#!/usr/bin/env node

/**
 * Security Audit Script for Panda Mart Kenya
 * Checks for security vulnerabilities and best practices
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

class SecurityAuditor {
  constructor() {
    this.issues = []
    this.warnings = []
    this.passed = []
  }

  // Main audit function
  async runAudit() {
    console.log('🔒 Starting Security Audit for Panda Mart Kenya...\n')

    await this.checkEnvironmentVariables()
    await this.checkFilePermissions()
    await this.checkDependencies()
    await this.checkSecurityHeaders()
    await this.checkInputValidation()
    await this.checkAuthenticationSecurity()
    await this.checkDataProtection()
    await this.checkAPIEndpoints()
    await this.checkClientSideSecurity()
    await this.checkInfrastructureSecurity()

    this.generateReport()
  }

  // Check environment variables
  async checkEnvironmentVariables() {
    console.log('📋 Checking Environment Variables...')

    const requiredEnvVars = [
      'JWT_ACCESS_SECRET',
      'JWT_REFRESH_SECRET',
      'JWT_RESET_SECRET',
      'SESSION_SECRET',
      'ENCRYPTION_KEY',
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'RECAPTCHA_SECRET_KEY'
    ]

    const envExample = this.readFile('.env.example')
    const envLocal = this.readFile('.env.local')

    // Check if required variables are defined
    for (const envVar of requiredEnvVars) {
      if (!envExample.includes(envVar)) {
        this.issues.push(`Missing required environment variable in .env.example: ${envVar}`)
      }
    }

    // Check for weak secrets
    const weakPatterns = [
      /secret.*=.*"(test|dev|demo|example|changeme|password|123456)"/i,
      /key.*=.*"(test|dev|demo|example|changeme|password|123456)"/i,
      /password.*=.*"(test|dev|demo|example|changeme|password|123456)"/i
    ]

    for (const pattern of weakPatterns) {
      if (pattern.test(envExample)) {
        this.warnings.push('Weak default values found in .env.example')
        break
      }
    }

    // Check secret lengths
    const secretVars = envExample.match(/.*SECRET.*=.*"(.+)"/g) || []
    for (const secretVar of secretVars) {
      const value = secretVar.split('=')[1]?.replace(/"/g, '') || ''
      if (value.length < 32) {
        this.warnings.push(`Short secret detected: ${secretVar.split('=')[0]} (should be at least 32 characters)`)
      }
    }

    this.passed.push('Environment variables structure checked')
  }

  // Check file permissions
  async checkFilePermissions() {
    console.log('📁 Checking File Permissions...')

    const sensitiveFiles = [
      '.env.local',
      '.env.production',
      'package.json',
      'next.config.js',
      'middleware.ts'
    ]

    for (const file of sensitiveFiles) {
      if (fs.existsSync(file)) {
        try {
          const stats = fs.statSync(file)
          const mode = stats.mode & parseInt('777', 8)
          
          if (mode > parseInt('644', 8)) {
            this.warnings.push(`File ${file} has overly permissive permissions: ${mode.toString(8)}`)
          }
        } catch (error) {
          this.warnings.push(`Could not check permissions for ${file}`)
        }
      }
    }

    this.passed.push('File permissions checked')
  }

  // Check dependencies for vulnerabilities
  async checkDependencies() {
    console.log('📦 Checking Dependencies...')

    const packageJson = this.readJsonFile('package.json')
    if (!packageJson) {
      this.issues.push('package.json not found')
      return
    }

    // Check for known vulnerable packages
    const vulnerablePackages = [
      'lodash@4.17.20',
      'axios@0.21.0',
      'node-fetch@2.6.6'
    ]

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }

    for (const [pkg, version] of Object.entries(allDeps)) {
      const pkgVersion = `${pkg}@${version}`
      if (vulnerablePackages.some(vuln => pkgVersion.includes(vuln))) {
        this.issues.push(`Potentially vulnerable package: ${pkgVersion}`)
      }
    }

    // Check for security-related packages
    const securityPackages = [
      'helmet',
      'bcryptjs',
      'jsonwebtoken',
      'express-rate-limit'
    ]

    const hasSecurityPackages = securityPackages.some(pkg => 
      allDeps[pkg] || Object.keys(allDeps).some(dep => dep.includes(pkg))
    )

    if (!hasSecurityPackages) {
      this.warnings.push('No security-focused packages detected')
    }

    this.passed.push('Dependencies checked for known vulnerabilities')
  }

  // Check security headers implementation
  async checkSecurityHeaders() {
    console.log('🛡️ Checking Security Headers...')

    const middlewareContent = this.readFile('middleware.ts')
    const securityConfig = this.readFile('lib/security/config.ts')

    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy',
      'Referrer-Policy'
    ]

    for (const header of requiredHeaders) {
      if (!middlewareContent.includes(header) && !securityConfig.includes(header)) {
        this.issues.push(`Missing security header: ${header}`)
      }
    }

    // Check CSP implementation
    if (middlewareContent.includes('Content-Security-Policy')) {
      if (!middlewareContent.includes("default-src 'self'")) {
        this.warnings.push('CSP may be too permissive')
      }
    }

    this.passed.push('Security headers implementation checked')
  }

  // Check input validation
  async checkInputValidation() {
    console.log('✅ Checking Input Validation...')

    const validationFile = this.readFile('lib/security/validation.ts')
    
    if (!validationFile) {
      this.issues.push('Input validation module not found')
      return
    }

    // Check for SQL injection protection
    if (!validationFile.includes('SQL_INJECTION_PATTERNS')) {
      this.issues.push('SQL injection protection not implemented')
    }

    // Check for XSS protection
    if (!validationFile.includes('XSS_PATTERNS')) {
      this.issues.push('XSS protection not implemented')
    }

    // Check for input sanitization
    if (!validationFile.includes('sanitize')) {
      this.warnings.push('Input sanitization may not be implemented')
    }

    this.passed.push('Input validation implementation checked')
  }

  // Check authentication security
  async checkAuthenticationSecurity() {
    console.log('🔐 Checking Authentication Security...')

    const authFile = this.readFile('lib/security/auth.ts')
    
    if (!authFile) {
      this.issues.push('Authentication module not found')
      return
    }

    // Check password hashing
    if (!authFile.includes('bcrypt')) {
      this.issues.push('Secure password hashing not implemented')
    }

    // Check JWT implementation
    if (!authFile.includes('jwt')) {
      this.warnings.push('JWT implementation not found')
    }

    // Check rate limiting
    if (!authFile.includes('RateLimiter')) {
      this.warnings.push('Rate limiting not implemented in auth')
    }

    // Check 2FA support
    if (!authFile.includes('TwoFactorAuth')) {
      this.warnings.push('Two-factor authentication not implemented')
    }

    this.passed.push('Authentication security checked')
  }

  // Check data protection measures
  async checkDataProtection() {
    console.log('🔒 Checking Data Protection...')

    const files = [
      'app/privacy/page.tsx',
      'components/ui/CookieConsent.tsx',
      'lib/security/config.ts'
    ]

    for (const file of files) {
      if (!fs.existsSync(file)) {
        this.issues.push(`Data protection file missing: ${file}`)
      }
    }

    // Check for GDPR compliance
    const privacyFile = this.readFile('app/privacy/page.tsx')
    if (privacyFile && !privacyFile.includes('GDPR')) {
      this.warnings.push('GDPR compliance not explicitly mentioned')
    }

    // Check cookie consent
    const cookieFile = this.readFile('components/ui/CookieConsent.tsx')
    if (!cookieFile) {
      this.issues.push('Cookie consent implementation missing')
    }

    this.passed.push('Data protection measures checked')
  }

  // Check API endpoint security
  async checkAPIEndpoints() {
    console.log('🌐 Checking API Security...')

    const middlewareContent = this.readFile('middleware.ts')

    // Check CORS configuration
    if (!middlewareContent.includes('Access-Control-Allow-Origin')) {
      this.warnings.push('CORS not configured')
    }

    // Check rate limiting for APIs
    if (!middlewareContent.includes('/api/')) {
      this.warnings.push('API-specific security measures not found')
    }

    // Check authentication middleware
    if (!middlewareContent.includes('isAuthenticated')) {
      this.warnings.push('Authentication middleware not implemented')
    }

    this.passed.push('API security configuration checked')
  }

  // Check client-side security
  async checkClientSideSecurity() {
    console.log('💻 Checking Client-Side Security...')

    const layoutFile = this.readFile('app/layout.tsx')
    
    // Check for security meta tags
    if (!layoutFile.includes('X-Content-Type-Options')) {
      this.warnings.push('Security meta tags not found in layout')
    }

    // Check for CSP in HTML
    if (!layoutFile.includes('Content-Security-Policy')) {
      this.warnings.push('CSP not set in HTML meta tags')
    }

    // Check service worker
    if (!fs.existsSync('public/sw.js')) {
      this.warnings.push('Service worker not implemented')
    }

    this.passed.push('Client-side security checked')
  }

  // Check infrastructure security
  async checkInfrastructureSecurity() {
    console.log('🏗️ Checking Infrastructure Security...')

    // Check for security documentation
    const securityFiles = [
      'SECURITY.md',
      'DEPLOYMENT.md',
      'DATABASE_SETUP.md'
    ]

    for (const file of securityFiles) {
      if (!fs.existsSync(file)) {
        this.warnings.push(`Security documentation missing: ${file}`)
      }
    }

    // Check Next.js configuration
    const nextConfig = this.readFile('next.config.js')
    if (nextConfig) {
      if (!nextConfig.includes('poweredByHeader: false')) {
        this.warnings.push('X-Powered-By header not disabled')
      }
    }

    this.passed.push('Infrastructure security configuration checked')
  }

  // Utility functions
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8')
    } catch (error) {
      return null
    }
  }

  readJsonFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      return null
    }
  }

  // Generate audit report
  generateReport() {
    console.log('\n' + '='.repeat(60))
    console.log('🔒 SECURITY AUDIT REPORT')
    console.log('='.repeat(60))

    console.log(`\n✅ PASSED CHECKS (${this.passed.length}):`)
    this.passed.forEach(item => console.log(`  ✓ ${item}`))

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`)
      this.warnings.forEach(item => console.log(`  ⚠️  ${item}`))
    }

    if (this.issues.length > 0) {
      console.log(`\n❌ CRITICAL ISSUES (${this.issues.length}):`)
      this.issues.forEach(item => console.log(`  ❌ ${item}`))
    }

    console.log('\n' + '='.repeat(60))
    
    const totalChecks = this.passed.length + this.warnings.length + this.issues.length
    const score = Math.round((this.passed.length / totalChecks) * 100)
    
    console.log(`SECURITY SCORE: ${score}%`)
    
    if (this.issues.length === 0) {
      console.log('🎉 No critical security issues found!')
    } else {
      console.log('⚠️  Please address critical issues before deployment')
    }

    if (this.warnings.length === 0 && this.issues.length === 0) {
      console.log('🚀 Application is ready for production deployment!')
    }

    console.log('='.repeat(60))

    // Generate detailed report file
    this.generateDetailedReport()
  }

  // Generate detailed report file
  generateDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks: this.passed.length + this.warnings.length + this.issues.length,
        passed: this.passed.length,
        warnings: this.warnings.length,
        criticalIssues: this.issues.length,
        score: Math.round((this.passed.length / (this.passed.length + this.warnings.length + this.issues.length)) * 100)
      },
      details: {
        passed: this.passed,
        warnings: this.warnings,
        criticalIssues: this.issues
      },
      recommendations: this.generateRecommendations()
    }

    fs.writeFileSync('security-audit-report.json', JSON.stringify(report, null, 2))
    console.log('\n📄 Detailed report saved to: security-audit-report.json')
  }

  // Generate security recommendations
  generateRecommendations() {
    const recommendations = []

    if (this.issues.length > 0) {
      recommendations.push('Address all critical security issues before deployment')
    }

    if (this.warnings.length > 0) {
      recommendations.push('Review and address security warnings for enhanced protection')
    }

    recommendations.push('Regularly update dependencies to patch security vulnerabilities')
    recommendations.push('Implement automated security testing in CI/CD pipeline')
    recommendations.push('Conduct regular penetration testing')
    recommendations.push('Monitor application logs for suspicious activities')
    recommendations.push('Set up security alerts and monitoring')
    recommendations.push('Train development team on secure coding practices')

    return recommendations
  }
}

// Run the audit
const auditor = new SecurityAuditor()
auditor.runAudit().catch(console.error)