const fs = require('fs');
const path = require('path');

// Security audit configuration
const SECURITY_PATTERNS = {
  // SQL Injection vulnerabilities
  sqlInjection: [
    /\$\{[^}]*\}/g, // Template literals in SQL
    /['"][^'"]*\+[^'"]*['"]/g, // String concatenation in queries
    /query\([^)]*\+[^)]*\)/g, // Direct concatenation in query calls
  ],
  
  // Authentication issues
  authIssues: [
    /password.*=.*req\.body/gi, // Direct password access
    /token.*=.*req\.body/gi, // Direct token access without validation
    /admin.*=.*true/gi, // Hardcoded admin flags
  ],
  
  // Input validation issues
  inputValidation: [
    /req\.body\.[a-zA-Z_]+(?!\s*[=!<>])/g, // Direct body access without validation
    /params\.[a-zA-Z_]+(?!\s*[=!<>])/g, // Direct params access without validation
  ],
  
  // Sensitive data exposure
  sensitiveData: [
    /console\.log.*password/gi,
    /console\.log.*token/gi,
    /console\.log.*secret/gi,
    /password.*response/gi,
  ],
  
  // CORS and security headers
  securityHeaders: [
    /res\.header\(/g,
    /cors\(/g,
    /helmet\(/g,
  ]
};

const SECURITY_RECOMMENDATIONS = {
  sqlInjection: 'Use parameterized queries with $1, $2, etc. placeholders',
  authIssues: 'Always validate and sanitize authentication data',
  inputValidation: 'Validate and sanitize all user inputs',
  sensitiveData: 'Never log sensitive information',
  securityHeaders: 'Implement proper security headers and CORS policies'
};

class SecurityAuditor {
  constructor() {
    this.findings = [];
    this.fileCount = 0;
  }

  auditFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.fileCount++;
      
      Object.entries(SECURITY_PATTERNS).forEach(([category, patterns]) => {
        patterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              this.findings.push({
                file: filePath,
                category,
                issue: match,
                line: this.getLineNumber(content, match),
                recommendation: SECURITY_RECOMMENDATIONS[category]
              });
            });
          }
        });
      });
      
      // Check for specific security best practices
      this.checkSecurityBestPractices(filePath, content);
      
    } catch (error) {
      console.error(`Error auditing ${filePath}:`, error.message);
    }
  }

  checkSecurityBestPractices(filePath, content) {
    // Check for rate limiting
    if (filePath.includes('/auth/') && !content.includes('rateLimit')) {
      this.findings.push({
        file: filePath,
        category: 'rateLimiting',
        issue: 'Missing rate limiting on authentication endpoint',
        line: 1,
        recommendation: 'Implement rate limiting for authentication endpoints'
      });
    }

    // Check for input sanitization
    if (content.includes('req.body') && !content.includes('sanitize')) {
      this.findings.push({
        file: filePath,
        category: 'inputSanitization',
        issue: 'Potential missing input sanitization',
        line: this.getLineNumber(content, 'req.body'),
        recommendation: 'Always sanitize user inputs using InputSanitizer'
      });
    }

    // Check for proper error handling
    if (content.includes('catch') && content.includes('console.error')) {
      const errorMatches = content.match(/console\.error\([^)]*error[^)]*\)/gi);
      if (errorMatches) {
        errorMatches.forEach(match => {
          if (match.includes('error.message') || match.includes('error.stack')) {
            this.findings.push({
              file: filePath,
              category: 'errorHandling',
              issue: 'Potential sensitive error information exposure',
              line: this.getLineNumber(content, match),
              recommendation: 'Log detailed errors server-side only, return generic errors to client'
            });
          }
        });
      }
    }

    // Check for HTTPS enforcement
    if (filePath.includes('route.ts') && !content.includes('https')) {
      this.findings.push({
        file: filePath,
        category: 'httpsEnforcement',
        issue: 'No HTTPS enforcement detected',
        line: 1,
        recommendation: 'Ensure HTTPS is enforced in production'
      });
    }
  }

  getLineNumber(content, searchString) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchString)) {
        return i + 1;
      }
    }
    return 1;
  }

  auditDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          this.auditDirectory(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.js')) {
          this.auditFile(fullPath);
        }
      });
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error.message);
    }
  }

  generateReport() {
    console.log('🔒 Security Audit Report\n');
    console.log(`📁 Files audited: ${this.fileCount}`);
    console.log(`🚨 Security findings: ${this.findings.length}\n`);

    if (this.findings.length === 0) {
      console.log('✅ No security issues found!');
      return;
    }

    // Group findings by category
    const groupedFindings = this.findings.reduce((acc, finding) => {
      if (!acc[finding.category]) {
        acc[finding.category] = [];
      }
      acc[finding.category].push(finding);
      return acc;
    }, {});

    // Display findings by category
    Object.entries(groupedFindings).forEach(([category, findings]) => {
      console.log(`\n🔍 ${category.toUpperCase()} (${findings.length} issues):`);
      console.log('─'.repeat(50));
      
      findings.forEach((finding, index) => {
        console.log(`${index + 1}. File: ${finding.file}:${finding.line}`);
        console.log(`   Issue: ${finding.issue}`);
        console.log(`   💡 Recommendation: ${finding.recommendation}\n`);
      });
    });

    // Security score
    const maxScore = 100;
    const deductionPerFinding = Math.min(5, maxScore / this.findings.length);
    const securityScore = Math.max(0, maxScore - (this.findings.length * deductionPerFinding));
    
    console.log(`\n📊 Security Score: ${securityScore.toFixed(1)}/100`);
    
    if (securityScore >= 90) {
      console.log('🟢 Excellent security posture');
    } else if (securityScore >= 70) {
      console.log('🟡 Good security, minor improvements needed');
    } else if (securityScore >= 50) {
      console.log('🟠 Moderate security risks, improvements recommended');
    } else {
      console.log('🔴 Significant security risks, immediate attention required');
    }
  }

  saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      filesAudited: this.fileCount,
      totalFindings: this.findings.length,
      findings: this.findings,
      summary: this.findings.reduce((acc, finding) => {
        acc[finding.category] = (acc[finding.category] || 0) + 1;
        return acc;
      }, {})
    };

    fs.writeFileSync('security-audit-report.json', JSON.stringify(report, null, 2));
    console.log('\n💾 Detailed report saved to security-audit-report.json');
  }
}

// Run the security audit
const auditor = new SecurityAuditor();

// Audit API routes
auditor.auditDirectory('./app/api');

// Audit security libraries
if (fs.existsSync('./lib/security')) {
  auditor.auditDirectory('./lib/security');
}

// Audit middleware
if (fs.existsSync('./lib/middleware')) {
  auditor.auditDirectory('./lib/middleware');
}

// Generate and save report
auditor.generateReport();
auditor.saveReport();