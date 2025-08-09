// Direct MongoDB Atlas Setup Script
// This script sets up MongoDB Atlas directly with your connection string

const { setupMongoDB } = require('./mongodb-setup.js');

// Your MongoDB Atlas connection details
const MONGODB_URI = 'mongodb+srv://alphoncewekesamukaisi:WTlt8wnJgfR8hyno@panda-mart-gamification.sgmrmnb.mongodb.net/?retryWrites=true&w=majority&appName=panda-mart-gamification';
const MONGODB_DB = 'panda_mart_gamification';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runDirectSetup() {
  console.clear();
  colorLog('bright', '🐼 Panda Mart MongoDB Atlas Direct Setup');
  colorLog('cyan', '='.repeat(50));
  console.log('');
  
  colorLog('blue', 'Setting up your MongoDB Atlas database with:');
  console.log(`  🔗 URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`  🗄️  Database: ${MONGODB_DB}`);
  console.log('');
  
  // Set environment variables
  process.env.MONGODB_URI = MONGODB_URI;
  process.env.MONGODB_DB = MONGODB_DB;
  
  try {
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
    
    // Show next steps
    colorLog('yellow', '📋 Next Steps:');
    console.log('');
    colorLog('blue', '1. Update your .env.local file:');
    console.log(`   MONGODB_URI=${MONGODB_URI}`);
    console.log(`   MONGODB_DB=${MONGODB_DB}`);
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
    
    process.exit(1);
  }
}

// Run the setup
runDirectSetup().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});