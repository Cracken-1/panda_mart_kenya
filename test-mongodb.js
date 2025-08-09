// Test script for MongoDB gamification setup
// This script tests the MongoDB connection and basic operations

const { MongoClient } = require('mongodb');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'panda_mart_gamification';

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

async function testMongoConnection() {
  let client;
  
  try {
    colorLog('cyan', '🔄 Testing MongoDB connection...');
    
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    await client.db(MONGODB_DB).admin().ping();
    
    colorLog('green', '✅ MongoDB connection successful!');
    return true;
    
  } catch (error) {
    colorLog('red', '❌ MongoDB connection failed:');
    console.error(error.message);
    return false;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function testGamificationOperations() {
  let client;
  
  try {
    colorLog('cyan', '🔄 Testing gamification operations...');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);
    
    const testUserId = 'test_user_' + Date.now();
    const testResults = [];
    
    // Test 1: Initialize user points
    colorLog('yellow', '  🔄 Test 1: Initialize user points...');
    const userPoints = {
      userId: testUserId,
      pointsBalance: 0,
      lifetimePointsEarned: 0,
      tier: 'Bronze',
      tierProgress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('pandaPoints').insertOne(userPoints);
    const insertedPoints = await db.collection('pandaPoints').findOne({ userId: testUserId });
    testResults.push({
      test: 'Initialize user points',
      passed: insertedPoints !== null,
      details: insertedPoints ? `User ${testUserId} initialized` : 'Failed to insert'
    });
    
    // Test 2: Award points transaction
    colorLog('yellow', '  🔄 Test 2: Create points transaction...');
    const transaction = {
      userId: testUserId,
      transactionType: 'earned',
      pointsAmount: 50,
      source: 'test_purchase',
      description: 'Test purchase points',
      metadata: { orderId: 'TEST123' },
      createdAt: new Date()
    };
    
    await db.collection('pointsTransactions').insertOne(transaction);
    
    // Update user points
    await db.collection('pandaPoints').updateOne(
      { userId: testUserId },
      { 
        $inc: { 
          pointsBalance: transaction.pointsAmount,
          lifetimePointsEarned: transaction.pointsAmount
        },
        $set: { updatedAt: new Date() }
      }
    );
    
    const updatedPoints = await db.collection('pandaPoints').findOne({ userId: testUserId });
    testResults.push({
      test: 'Award points transaction',
      passed: updatedPoints.pointsBalance === 50,
      details: `Points balance: ${updatedPoints.pointsBalance}`
    });
    
    // Test 3: Check available badges
    colorLog('yellow', '  🔄 Test 3: Query available badges...');
    const badges = await db.collection('badges').find({ isActive: true }).toArray();
    testResults.push({
      test: 'Query available badges',
      passed: badges.length > 0,
      details: `Found ${badges.length} active badges`
    });
    
    // Test 4: Award a badge
    colorLog('yellow', '  🔄 Test 4: Award user badge...');
    if (badges.length > 0) {
      const firstBadge = badges[0];
      const userBadge = {
        userId: testUserId,
        badgeId: firstBadge._id.toString(),
        badgeName: firstBadge.name,
        earnedAt: new Date(),
        pointsAwarded: firstBadge.pointsReward
      };
      
      await db.collection('userBadges').insertOne(userBadge);
      const awardedBadge = await db.collection('userBadges').findOne({ 
        userId: testUserId, 
        badgeId: firstBadge._id.toString() 
      });
      
      testResults.push({
        test: 'Award user badge',
        passed: awardedBadge !== null,
        details: awardedBadge ? `Awarded: ${firstBadge.name}` : 'Failed to award badge'
      });
    } else {
      testResults.push({
        test: 'Award user badge',
        passed: false,
        details: 'No badges available to award'
      });
    }
    
    // Test 5: Check available rewards
    colorLog('yellow', '  🔄 Test 5: Query available rewards...');
    const rewards = await db.collection('rewards').find({ 
      isActive: true,
      pointsCost: { $lte: 100 }
    }).toArray();
    testResults.push({
      test: 'Query available rewards',
      passed: rewards.length > 0,
      details: `Found ${rewards.length} affordable rewards`
    });
    
    // Test 6: Daily activity
    colorLog('yellow', '  🔄 Test 6: Record daily activity...');
    const today = new Date().toISOString().split('T')[0];
    const dailyActivity = {
      userId: testUserId,
      activityType: 'checkin',
      activityDate: today,
      pointsEarned: 5,
      rewardData: { streak: 1 },
      createdAt: new Date()
    };
    
    await db.collection('dailyActivities').insertOne(dailyActivity);
    const recordedActivity = await db.collection('dailyActivities').findOne({
      userId: testUserId,
      activityType: 'checkin',
      activityDate: today
    });
    
    testResults.push({
      test: 'Record daily activity',
      passed: recordedActivity !== null,
      details: recordedActivity ? 'Daily check-in recorded' : 'Failed to record activity'
    });
    
    // Test 7: Query user statistics
    colorLog('yellow', '  🔄 Test 7: Generate user statistics...');
    const userStats = await db.collection('pointsTransactions').aggregate([
      { $match: { userId: testUserId } },
      {
        $group: {
          _id: '$transactionType',
          totalPoints: { $sum: '$pointsAmount' },
          transactionCount: { $sum: 1 }
        }
      }
    ]).toArray();
    
    testResults.push({
      test: 'Generate user statistics',
      passed: userStats.length > 0,
      details: `Generated stats for ${userStats.length} transaction types`
    });
    
    // Display test results
    colorLog('cyan', '📋 Test Results:');
    const passed = testResults.filter(r => r.passed).length;
    const total = testResults.length;
    
    testResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      const color = result.passed ? 'green' : 'red';
      colorLog(color, `  ${icon} ${result.test}: ${result.details}`);
    });
    
    // Cleanup test data
    colorLog('yellow', '🔄 Cleaning up test data...');
    await db.collection('pandaPoints').deleteOne({ userId: testUserId });
    await db.collection('pointsTransactions').deleteMany({ userId: testUserId });
    await db.collection('userBadges').deleteMany({ userId: testUserId });
    await db.collection('dailyActivities').deleteMany({ userId: testUserId });
    colorLog('green', '✅ Test data cleaned up');
    
    if (passed === total) {
      colorLog('green', `🎉 All ${total} gamification tests passed!`);
      colorLog('cyan', '🚀 MongoDB gamification system is ready for production!');
    } else {
      colorLog('yellow', `⚠️  ${passed}/${total} tests passed - some issues detected`);
    }
    
    return passed === total;
    
  } catch (error) {
    colorLog('red', '❌ Error during gamification tests:');
    console.error(error);
    return false;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function testIndexPerformance() {
  let client;
  
  try {
    colorLog('cyan', '🔄 Testing index performance...');
    
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_DB);
    
    // Test query performance with explain
    const explainResult = await db.collection('pandaPoints').find({ userId: 'test_user' }).explain('executionStats');
    const indexUsed = explainResult.executionStats.executionStages.indexName !== undefined;
    
    colorLog(indexUsed ? 'green' : 'yellow', `  📊 PandaPoints query uses index: ${indexUsed ? 'Yes' : 'No'}`);
    
    // Test transaction query performance
    const transactionExplain = await db.collection('pointsTransactions')
      .find({ userId: 'test_user' })
      .sort({ createdAt: -1 })
      .explain('executionStats');
    
    const transactionIndexUsed = transactionExplain.executionStats.executionStages.indexName !== undefined;
    colorLog(transactionIndexUsed ? 'green' : 'yellow', `  📊 Transaction query uses index: ${transactionIndexUsed ? 'Yes' : 'No'}`);
    
    return indexUsed && transactionIndexUsed;
    
  } catch (error) {
    colorLog('red', '❌ Error testing index performance:', error.message);
    return false;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

async function runAllTests() {
  colorLog('bright', '🧪 MongoDB Gamification System Test Suite');
  colorLog('blue', `📍 Testing database: ${MONGODB_DB}`);
  console.log('');
  
  const results = {
    connection: false,
    operations: false,
    performance: false
  };
  
  // Test 1: Connection
  results.connection = await testMongoConnection();
  console.log('');
  
  if (results.connection) {
    // Test 2: Gamification operations
    results.operations = await testGamificationOperations();
    console.log('');
    
    // Test 3: Index performance
    results.performance = await testIndexPerformance();
    console.log('');
  }
  
  // Final summary
  const allPassed = Object.values(results).every(r => r === true);
  
  colorLog('cyan', '📊 Final Test Summary:');
  colorLog(results.connection ? 'green' : 'red', `  ${results.connection ? '✅' : '❌'} Database Connection`);
  colorLog(results.operations ? 'green' : 'red', `  ${results.operations ? '✅' : '❌'} Gamification Operations`);
  colorLog(results.performance ? 'green' : 'red', `  ${results.performance ? '✅' : '❌'} Index Performance`);
  
  console.log('');
  if (allPassed) {
    colorLog('green', '🎉 All tests passed! MongoDB gamification system is ready! 🐼🎮');
  } else {
    colorLog('yellow', '⚠️  Some tests failed. Please check the setup and try again.');
    
    if (!results.connection) {
      colorLog('blue', '💡 Connection troubleshooting:');
      console.log('   • Make sure MongoDB is running');
      console.log('   • Check MONGODB_URI environment variable');
      console.log('   • Verify network connectivity');
    }
  }
  
  return allPassed;
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = {
  testMongoConnection,
  testGamificationOperations,
  testIndexPerformance,
  runAllTests
};