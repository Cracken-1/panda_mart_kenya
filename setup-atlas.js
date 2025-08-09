#!/usr/bin/env node

// MongoDB Atlas Setup Helper Script
// This script helps you set up your MongoDB Atlas database for Panda Mart gamification

const readline = require('readline');
const { setupMongoDB } = require('./mongodb-setup.js');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.clear();
  colorLog('bright', '🐼 Panda Mart MongoDB Atlas Setup Helper');
  colorLog('cyan', '='.repeat(50));
  console.log('');
  
  colorLog('blue', 'This script will help you set up your MongoDB Atlas database for the');
  colorLog('blue', 'Panda Mart gamification system (points, badges, challenges, rewards).');
  console.log('');
  
  // Step 1: Check if they have MongoDB Atlas ready
  colorLog('yellow', '📋 Step 1: MongoDB Atlas Prerequisites');
  console.log('');
  console.log('Before we begin, make sure you have:');
  console.log('  ✅ Created a MongoDB Atlas account');
  console.log('  ✅ Created a cluster (M0 Sandbox is fine for development)');
  console.log('  ✅ Created a database user with read/write permissions');
  console.log('  ✅ Added your IP address to Network Access (or 0.0.0.0/0 for development)');
  console.log('  ✅ Copied your connection string');
  console.log('');
  
  const hasPrerequisites = await askQuestion('Do you have all the prerequisites ready? (y/N): ');
  
  if (hasPrerequisites.toLowerCase() !== 'y' && hasPrerequisites.toLowerCase() !== 'yes') {
    colorLog('blue', '');
    colorLog('blue', '📖 Please follow the setup guide first:');
    colorLog('green', '   1. Read: MONGODB_ATLAS_SETUP.md');
    colorLog('green', '   2. Set up your MongoDB Atlas cluster');
    colorLog('green', '   3. Come back and run this script again');
    colorLog('blue', '');
    colorLog('yellow', 'Exiting setup...');
    rl.close();
    return;
  }
  
  // Step 2: Get connection details
  colorLog('yellow', '📋 Step 2: Connection Configuration');
  console.log('');
  
  const mongoUri = await askQuestion('Enter your MongoDB Atlas connection string: ');
  
  if (!mongoUri || !mongoUri.includes('mongodb+srv://')) {
    colorLog('red', '❌ Invalid connection string. It should start with "mongodb+srv://"');
    colorLog('blue', 'Example: mongodb+srv://username:password@cluster.mongodb.net/');
    rl.close();
    return;
  }
  
  const dbName = await askQuestion('Enter database name (default: panda_mart_gamification): ') || 'panda_mart_gamification';
  
  // Step 3: Confirm setup
  colorLog('yellow', '📋 Step 3: Setup Confirmation');
  console.log('');
  colorLog('cyan', 'Configuration Summary:');
  console.log(`  🔗 MongoDB URI: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`  🗄️  Database: ${dbName}`);
  console.log('');
  console.log('This will create:');
  console.log('  📊 15 collections for gamification features');
  console.log('  🚀 40+ performance indexes');
  console.log('  🎮 Sample data (12 badges, 7 challenges, 8 rewards)');
  console.log('');
  
  const confirmSetup = await askQuestion('Proceed with setup? (Y/n): ');
  
  if (confirmSetup.toLowerCase() === 'n' || confirmSetup.toLowerCase() === 'no') {
    colorLog('yellow', 'Setup cancelled by user.');
    rl.close();
    return;
  }
  
  // Step 4: Run setup
  colorLog('yellow', '📋 Step 4: Running Database Setup');
  console.log('');
  
  // Set environment variables temporarily
  process.env.MONGODB_URI = mongoUri;
  process.env.MONGODB_DB = dbName;
  
  try {
    rl.close(); // Close readline before running setup
    
    colorLog('cyan', '🚀 Starting MongoDB Atlas setup...');
    console.log('');
    
    await setupMongoDB({
      skipSampleData: false,
      resetData: false,
      verbose: true
    });
    
    console.log('');
    colorLog('green', '🎉 Setup completed successfully!');
    console.log('');
    
    // Step 5: Next steps
    colorLog('yellow', '📋 Step 5: Next Steps');
    console.log('');
    colorLog('blue', '1. Update your .env.local file:');
    console.log(`   MONGODB_URI=${mongoUri}`);
    console.log(`   MONGODB_DB=${dbName}`);
    console.log('');
    colorLog('blue', '2. Test your setup:');
    colorLog('green', '   npm run mongo:test');
    console.log('');
    colorLog('blue', '3. View database statistics:');
    colorLog('green', '   npm run mongo:stats');
    console.log('');
    colorLog('blue', '4. Check your MongoDB Atlas dashboard:');
    console.log('   - Go to "Browse Collections"');
    console.log('   - You should see 15 collections with sample data');
    console.log('');
    colorLog('blue', '5. Run Supabase migration:');
    console.log('   - Copy contents of supabase-migration.sql');
    console.log('   - Run in your Supabase SQL Editor');
    console.log('');
    
    colorLog('cyan', '🐼 Your Panda Mart gamification system is ready!');
    colorLog('green', '✨ Users can now earn points, unlock badges, complete challenges, and redeem rewards!');
    
  } catch (error) {
    console.log('');
    colorLog('red', '❌ Setup failed:');
    console.error(error.message);
    console.log('');
    
    colorLog('yellow', '🔧 Troubleshooting:');
    console.log('  1. Check your connection string is correct');
    console.log('  2. Verify your database user has read/write permissions');
    console.log('  3. Ensure your IP is whitelisted in Network Access');
    console.log('  4. Try running: npm run mongo:test');
    console.log('');
    colorLog('blue', '📖 For detailed help, see: MONGODB_ATLAS_SETUP.md');
    
    process.exit(1);
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('');
  colorLog('yellow', '🛑 Setup interrupted by user');
  rl.close();
  process.exit(0);
});

// Run the setup
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});