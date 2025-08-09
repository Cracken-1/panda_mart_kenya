#!/usr/bin/env node

/**
 * Generate Secure Secrets for Panda Mart Kenya
 * 
 * This script generates cryptographically secure random strings
 * for use as JWT secrets and other authentication tokens.
 * 
 * Usage:
 *   node scripts/generate-secrets.js
 *   node scripts/generate-secrets.js --env
 */

const crypto = require('crypto');

// Generate a secure random string
function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

// Generate all required secrets
function generateAllSecrets() {
  return {
    NEXTAUTH_SECRET: generateSecret(32),
    JWT_ACCESS_SECRET: generateSecret(32),
    JWT_REFRESH_SECRET: generateSecret(32),
    JWT_RESET_SECRET: generateSecret(32),
    ENCRYPTION_KEY: generateSecret(32),
    SESSION_SECRET: generateSecret(24),
    WEBHOOK_SECRET: generateSecret(24),
    API_KEY: generateSecret(16)
  };
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const outputEnv = args.includes('--env');

  console.log('🔐 Panda Mart Kenya - Secret Generator\n');
  console.log('Generating cryptographically secure secrets...\n');

  const secrets = generateAllSecrets();

  if (outputEnv) {
    console.log('# Add these to your .env.local file:');
    console.log('# =====================================\n');
    
    Object.entries(secrets).forEach(([key, value]) => {
      console.log(`${key}=${value}`);
    });
    
    console.log('\n# =====================================');
    console.log('# Copy the above lines to your .env.local file');
  } else {
    console.log('Generated Secrets:');
    console.log('==================\n');
    
    Object.entries(secrets).forEach(([key, value]) => {
      console.log(`${key}:`);
      console.log(`  ${value}\n`);
    });
    
    console.log('Usage Instructions:');
    console.log('===================');
    console.log('1. Copy these secrets to your .env.local file');
    console.log('2. For Vercel deployment, add them as environment variables');
    console.log('3. Never commit these secrets to version control');
    console.log('4. Generate new secrets for each environment (dev/staging/prod)');
  }

  console.log('\n✅ Secrets generated successfully!');
  console.log('\n⚠️  Security Notes:');
  console.log('   - Keep these secrets secure and private');
  console.log('   - Use different secrets for each environment');
  console.log('   - Rotate secrets regularly (every 90 days)');
  console.log('   - Never share secrets in plain text');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSecret,
  generateAllSecrets
};