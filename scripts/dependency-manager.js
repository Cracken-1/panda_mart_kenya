#!/usr/bin/env node

/**
 * Dependency Manager for Panda Mart Kenya
 * 
 * This script helps manage dependencies, check for updates,
 * and resolve peer dependency conflicts.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DependencyManager {
  constructor() {
    this.packageJsonPath = path.join(process.cwd(), 'package.json');
    this.packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
  }

  // Check for outdated packages
  checkOutdated() {
    console.log('🔍 Checking for outdated packages...\n');
    
    try {
      const result = execSync('npm outdated --json', { encoding: 'utf8' });
      const outdated = JSON.parse(result);
      
      if (Object.keys(outdated).length === 0) {
        console.log('✅ All packages are up to date!');
        return;
      }
      
      console.log('📦 Outdated packages found:');
      console.log('================================');
      
      Object.entries(outdated).forEach(([pkg, info]) => {
        const updateType = this.getUpdateType(info.current, info.latest);
        const emoji = updateType === 'major' ? '🚨' : updateType === 'minor' ? '⚠️' : '🔧';
        
        console.log(`${emoji} ${pkg}`);
        console.log(`   Current: ${info.current}`);
        console.log(`   Latest:  ${info.latest}`);
        console.log(`   Type:    ${updateType} update`);
        console.log('');
      });
      
    } catch (error) {
      if (error.status === 1) {
        console.log('✅ All packages are up to date!');
      } else {
        console.error('❌ Error checking outdated packages:', error.message);
      }
    }
  }

  // Get update type (major, minor, patch)
  getUpdateType(current, latest) {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    
    if (latestParts[0] > currentParts[0]) return 'major';
    if (latestParts[1] > currentParts[1]) return 'minor';
    if (latestParts[2] > currentParts[2]) return 'patch';
    
    return 'unknown';
  }

  // Update patch and minor versions
  updateSafe() {
    console.log('🔄 Updating patch and minor versions...\n');
    
    try {
      execSync('npm update', { stdio: 'inherit' });
      console.log('\n✅ Safe updates completed!');
    } catch (error) {
      console.error('❌ Error during safe updates:', error.message);
    }
  }

  // Check for peer dependency issues
  checkPeerDependencies() {
    console.log('🔍 Checking peer dependencies...\n');
    
    try {
      execSync('npm ls --depth=0', { stdio: 'pipe' });
      console.log('✅ No peer dependency issues found!');
    } catch (error) {
      console.log('⚠️  Peer dependency issues detected:');
      console.log(error.stdout.toString());
      
      this.suggestPeerDependencyFixes();
    }
  }

  // Suggest fixes for peer dependency issues
  suggestPeerDependencyFixes() {
    console.log('\n💡 Suggested fixes:');
    console.log('===================');
    console.log('1. Check package.json overrides section');
    console.log('2. Consider updating conflicting packages');
    console.log('3. Use --legacy-peer-deps flag if needed');
    console.log('4. Review and update React version compatibility');
  }

  // Run security audit
  securityAudit() {
    console.log('🔒 Running security audit...\n');
    
    try {
      execSync('npm audit', { stdio: 'inherit' });
      console.log('\n✅ No security vulnerabilities found!');
    } catch (error) {
      console.log('\n⚠️  Security vulnerabilities detected!');
      console.log('Run "npm audit fix" to attempt automatic fixes.');
    }
  }

  // Clean install
  cleanInstall() {
    console.log('🧹 Performing clean install...\n');
    
    try {
      // Remove node_modules and package-lock.json
      if (fs.existsSync('node_modules')) {
        console.log('Removing node_modules...');
        execSync('rm -rf node_modules', { stdio: 'inherit' });
      }
      
      if (fs.existsSync('package-lock.json')) {
        console.log('Removing package-lock.json...');
        fs.unlinkSync('package-lock.json');
      }
      
      console.log('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      
      console.log('\n✅ Clean install completed!');
    } catch (error) {
      console.error('❌ Error during clean install:', error.message);
    }
  }

  // Generate dependency report
  generateReport() {
    console.log('📊 Generating dependency report...\n');
    
    const report = {
      timestamp: new Date().toISOString(),
      project: this.packageJson.name,
      version: this.packageJson.version,
      nodeVersion: process.version,
      npmVersion: execSync('npm --version', { encoding: 'utf8' }).trim(),
      dependencies: {
        production: Object.keys(this.packageJson.dependencies || {}).length,
        development: Object.keys(this.packageJson.devDependencies || {}).length,
        total: Object.keys({
          ...this.packageJson.dependencies,
          ...this.packageJson.devDependencies
        }).length
      },
      overrides: this.packageJson.overrides || {},
      engines: this.packageJson.engines || {}
    };
    
    // Check for outdated packages
    try {
      const outdatedResult = execSync('npm outdated --json', { encoding: 'utf8' });
      report.outdated = JSON.parse(outdatedResult);
    } catch (error) {
      report.outdated = {};
    }
    
    // Save report
    const reportPath = 'dependency-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 Report saved to ${reportPath}`);
    console.log('\n📊 Summary:');
    console.log(`   Production dependencies: ${report.dependencies.production}`);
    console.log(`   Development dependencies: ${report.dependencies.development}`);
    console.log(`   Total dependencies: ${report.dependencies.total}`);
    console.log(`   Outdated packages: ${Object.keys(report.outdated).length}`);
  }

  // Main menu
  showMenu() {
    console.log('🐼 Panda Mart Kenya - Dependency Manager\n');
    console.log('Available commands:');
    console.log('==================');
    console.log('1. check     - Check for outdated packages');
    console.log('2. update    - Update patch and minor versions');
    console.log('3. peers     - Check peer dependencies');
    console.log('4. audit     - Run security audit');
    console.log('5. clean     - Clean install dependencies');
    console.log('6. report    - Generate dependency report');
    console.log('7. all       - Run all checks');
    console.log('\nUsage: node scripts/dependency-manager.js <command>');
  }

  // Run all checks
  runAll() {
    console.log('🚀 Running all dependency checks...\n');
    
    this.checkOutdated();
    console.log('\n' + '='.repeat(50) + '\n');
    
    this.checkPeerDependencies();
    console.log('\n' + '='.repeat(50) + '\n');
    
    this.securityAudit();
    console.log('\n' + '='.repeat(50) + '\n');
    
    this.generateReport();
    
    console.log('\n✅ All checks completed!');
  }
}

// Main execution
const manager = new DependencyManager();
const command = process.argv[2];

switch (command) {
  case 'check':
    manager.checkOutdated();
    break;
  case 'update':
    manager.updateSafe();
    break;
  case 'peers':
    manager.checkPeerDependencies();
    break;
  case 'audit':
    manager.securityAudit();
    break;
  case 'clean':
    manager.cleanInstall();
    break;
  case 'report':
    manager.generateReport();
    break;
  case 'all':
    manager.runAll();
    break;
  default:
    manager.showMenu();
}

module.exports = DependencyManager;