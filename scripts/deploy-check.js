#!/usr/bin/env node

/**
 * Pre-deployment Check Script for Panda Mart Kenya
 * 
 * This script performs various checks to ensure the application
 * is ready for deployment to production.
 * 
 * Usage:
 *   node scripts/deploy-check.js
 */

const fs = require('fs');
const path = require('path');

class DeploymentChecker {
  constructor() {
    this.checks = [];
    this.warnings = [];
    this.errors = [];
  }

  // Check if required files exist
  checkRequiredFiles() {
    const requiredFiles = [
      'package.json',
      'next.config.js',
      'vercel.json',
      '.env.example',
      'database-schema.sql',
      'README.md',
      'DEPLOYMENT_VERCEL.md'
    ];

    requiredFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.checks.push(`✅ ${file} exists`);
      } else {
        this.errors.push(`❌ Missing required file: ${file}`);
      }
    });
  }

  // Check package.json configuration
  checkPackageJson() {
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check required scripts
      const requiredScripts = ['build', 'start', 'dev'];
      requiredScripts.forEach(script => {
        if (pkg.scripts && pkg.scripts[script]) {
          this.checks.push(`✅ Script '${script}' defined`);
        } else {
          this.errors.push(`❌ Missing required script: ${script}`);
        }
      });

      // Check Node.js version requirement
      if (pkg.engines && pkg.engines.node) {
        this.checks.push(`✅ Node.js version specified: ${pkg.engines.node}`);
      } else {
        this.warnings.push(`⚠️  Node.js version not specified in engines`);
      }

      // Check dependencies
      const criticalDeps = ['next', 'react', 'react-dom', 'pg', 'bcryptjs', 'jsonwebtoken'];
      criticalDeps.forEach(dep => {
        if (pkg.dependencies && pkg.dependencies[dep]) {
          this.checks.push(`✅ Critical dependency '${dep}' present`);
        } else {
          this.errors.push(`❌ Missing critical dependency: ${dep}`);
        }
      });

    } catch (error) {
      this.errors.push(`❌ Error reading package.json: ${error.message}`);
    }
  }

  // Check Next.js configuration
  checkNextConfig() {
    try {
      if (fs.existsSync('next.config.js')) {
        const config = fs.readFileSync('next.config.js', 'utf8');
        
        if (config.includes('images')) {
          this.checks.push(`✅ Image configuration present`);
        } else {
          this.warnings.push(`⚠️  Image configuration not found`);
        }

        if (config.includes('headers')) {
          this.checks.push(`✅ Security headers configured`);
        } else {
          this.warnings.push(`⚠️  Security headers not configured`);
        }

        if (config.includes('poweredByHeader: false')) {
          this.checks.push(`✅ X-Powered-By header disabled`);
        } else {
          this.warnings.push(`⚠️  X-Powered-By header not disabled`);
        }
      }
    } catch (error) {
      this.errors.push(`❌ Error checking next.config.js: ${error.message}`);
    }
  }

  // Check Vercel configuration
  checkVercelConfig() {
    try {
      if (fs.existsSync('vercel.json')) {
        const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
        
        if (config.functions) {
          this.checks.push(`✅ Function configuration present`);
        }

        if (config.headers) {
          this.checks.push(`✅ Header configuration present`);
        }

        if (config.regions) {
          this.checks.push(`✅ Region configuration: ${config.regions.join(', ')}`);
        } else {
          this.warnings.push(`⚠️  No region specified, will use default`);
        }
      }
    } catch (error) {
      this.errors.push(`❌ Error reading vercel.json: ${error.message}`);
    }
  }

  // Check environment variables template
  checkEnvTemplate() {
    try {
      if (fs.existsSync('.env.example')) {
        const envContent = fs.readFileSync('.env.example', 'utf8');
        
        const requiredVars = [
          'DATABASE_URL',
          'NEXTAUTH_SECRET',
          'JWT_ACCESS_SECRET',
          'NEXT_PUBLIC_APP_URL'
        ];

        requiredVars.forEach(varName => {
          if (envContent.includes(varName)) {
            this.checks.push(`✅ Environment variable '${varName}' documented`);
          } else {
            this.errors.push(`❌ Missing environment variable documentation: ${varName}`);
          }
        });
      }
    } catch (error) {
      this.errors.push(`❌ Error checking .env.example: ${error.message}`);
    }
  }

  // Check API routes structure
  checkApiRoutes() {
    const apiPath = path.join('app', 'api');
    
    if (fs.existsSync(apiPath)) {
      const requiredRoutes = [
        'health',
        'auth/login',
        'auth/register',
        'users/profile',
        'products',
        'cart',
        'orders'
      ];

      requiredRoutes.forEach(route => {
        const routePath = path.join(apiPath, route, 'route.ts');
        if (fs.existsSync(routePath)) {
          this.checks.push(`✅ API route exists: /api/${route}`);
        } else {
          this.warnings.push(`⚠️  API route missing: /api/${route}`);
        }
      });
    } else {
      this.errors.push(`❌ API directory not found: ${apiPath}`);
    }
  }

  // Check database schema
  checkDatabaseSchema() {
    try {
      if (fs.existsSync('database-schema.sql')) {
        const schema = fs.readFileSync('database-schema.sql', 'utf8');
        
        const requiredTables = [
          'users',
          'products',
          'categories',
          'orders',
          'cart_items'
        ];

        requiredTables.forEach(table => {
          if (schema.includes(`CREATE TABLE ${table}`)) {
            this.checks.push(`✅ Database table '${table}' defined`);
          } else {
            this.errors.push(`❌ Missing database table: ${table}`);
          }
        });

        if (schema.includes('CREATE INDEX')) {
          this.checks.push(`✅ Database indexes defined`);
        } else {
          this.warnings.push(`⚠️  No database indexes found`);
        }
      }
    } catch (error) {
      this.errors.push(`❌ Error checking database schema: ${error.message}`);
    }
  }

  // Check TypeScript configuration
  checkTypeScript() {
    try {
      if (fs.existsSync('tsconfig.json')) {
        const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
        
        if (tsConfig.compilerOptions && tsConfig.compilerOptions.strict) {
          this.checks.push(`✅ TypeScript strict mode enabled`);
        } else {
          this.warnings.push(`⚠️  TypeScript strict mode not enabled`);
        }

        this.checks.push(`✅ TypeScript configuration present`);
      } else {
        this.warnings.push(`⚠️  TypeScript configuration not found`);
      }
    } catch (error) {
      this.errors.push(`❌ Error checking TypeScript config: ${error.message}`);
    }
  }

  // Check security configurations
  checkSecurity() {
    // Check for common security files
    const securityFiles = [
      '.gitignore',
      'middleware.ts'
    ];

    securityFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.checks.push(`✅ Security file '${file}' present`);
      } else {
        this.warnings.push(`⚠️  Security file missing: ${file}`);
      }
    });

    // Check .gitignore for sensitive files
    if (fs.existsSync('.gitignore')) {
      const gitignore = fs.readFileSync('.gitignore', 'utf8');
      const sensitivePatterns = ['.env', 'node_modules', '.next'];
      
      sensitivePatterns.forEach(pattern => {
        if (gitignore.includes(pattern)) {
          this.checks.push(`✅ Gitignore excludes '${pattern}'`);
        } else {
          this.errors.push(`❌ Gitignore missing pattern: ${pattern}`);
        }
      });
    }
  }

  // Run all checks
  runAllChecks() {
    console.log('🔍 Panda Mart Kenya - Deployment Readiness Check\n');
    console.log('Running pre-deployment checks...\n');

    this.checkRequiredFiles();
    this.checkPackageJson();
    this.checkNextConfig();
    this.checkVercelConfig();
    this.checkEnvTemplate();
    this.checkApiRoutes();
    this.checkDatabaseSchema();
    this.checkTypeScript();
    this.checkSecurity();

    this.displayResults();
  }

  // Display results
  displayResults() {
    console.log('📊 Check Results:');
    console.log('=================\n');

    if (this.checks.length > 0) {
      console.log('✅ Passed Checks:');
      this.checks.forEach(check => console.log(`   ${check}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.warnings.forEach(warning => console.log(`   ${warning}`));
      console.log('');
    }

    if (this.errors.length > 0) {
      console.log('❌ Errors (Must Fix):');
      this.errors.forEach(error => console.log(`   ${error}`));
      console.log('');
    }

    // Summary
    console.log('📈 Summary:');
    console.log(`   ✅ Passed: ${this.checks.length}`);
    console.log(`   ⚠️  Warnings: ${this.warnings.length}`);
    console.log(`   ❌ Errors: ${this.errors.length}\n`);

    // Deployment readiness
    if (this.errors.length === 0) {
      console.log('🚀 DEPLOYMENT READY!');
      console.log('   Your application is ready for deployment.');
      if (this.warnings.length > 0) {
        console.log('   Consider addressing warnings for optimal performance.');
      }
    } else {
      console.log('🚫 NOT READY FOR DEPLOYMENT');
      console.log('   Please fix all errors before deploying.');
    }

    console.log('\n📚 Next Steps:');
    console.log('   1. Fix any errors listed above');
    console.log('   2. Generate secrets: node scripts/generate-secrets.js');
    console.log('   3. Set up database (Supabase recommended)');
    console.log('   4. Configure environment variables in Vercel');
    console.log('   5. Deploy to Vercel');
    console.log('\n📖 See DEPLOYMENT_VERCEL.md for detailed instructions.');

    // Exit with appropriate code
    process.exit(this.errors.length > 0 ? 1 : 0);
  }
}

// Run if called directly
if (require.main === module) {
  const checker = new DeploymentChecker();
  checker.runAllChecks();
}

module.exports = DeploymentChecker;