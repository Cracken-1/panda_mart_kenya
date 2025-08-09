# MongoDB Atlas Setup Guide for Panda Mart

This guide will walk you through setting up MongoDB Atlas (cloud) for your Panda Mart gamification system.

## 🚀 Step 1: MongoDB Atlas Account Setup

### 1.1 Create Your Cluster
Since you've already created your MongoDB account, let's set up your cluster:

1. **Go to MongoDB Atlas Dashboard**
   - Visit: https://cloud.mongodb.com/
   - Sign in with your account

2. **Create a New Project**
   - Click "New Project"
   - Name: `Panda Mart Kenya`
   - Click "Next" → "Create Project"

3. **Create a Database Cluster**
   - Click "Build a Database"
   - Choose **M0 Sandbox** (Free tier - perfect for development)
   - **Cloud Provider**: AWS (recommended)
   - **Region**: Choose closest to Kenya (eu-west-1 or ap-south-1)
   - **Cluster Name**: `panda-mart-gamification`
   - Click "Create"

### 1.2 Configure Database Access

1. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - **Authentication Method**: Password
   - **Username**: `pandamart_user`
   - **Password**: Generate a secure password (save this!)
   - **Database User Privileges**: "Read and write to any database"
   - Click "Add User"

2. **Configure Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP addresses
   - Click "Confirm"

### 1.3 Get Your Connection String

1. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - **Driver**: Node.js
   - **Version**: 4.1 or later
   - Copy the connection string (looks like):
   ```
   mongodb+srv://pandamart_user:<password>@panda-mart-gamification.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 🔧 Step 2: Environment Configuration

### 2.1 Update Your Environment Variables

Create or update your `.env.local` file:

```bash
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://pandamart_user:YOUR_PASSWORD@panda-mart-gamification.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=panda_mart_gamification

# PostgreSQL (Supabase) Configuration
DATABASE_URL=your_supabase_connection_string
DB_HOST=your_supabase_host
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
```

**Important**: Replace `YOUR_PASSWORD` with the actual password you created for the database user.

### 2.2 Test Your Connection

```bash
# Test MongoDB connection
node -e "
const { MongoClient } = require('mongodb');
const uri = 'YOUR_MONGODB_URI_HERE';
const client = new MongoClient(uri);
client.connect().then(() => {
  console.log('✅ MongoDB Atlas connection successful!');
  client.close();
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
});
"
```

## 🎮 Step 3: Initialize Your Gamification Database

### 3.1 Install Dependencies

```bash
# Install MongoDB driver
npm install mongodb @types/mongodb
```

### 3.2 Run the Setup Script

```bash
# Run the comprehensive setup with verbose output
npm run mongo:setup:verbose
```

You should see output like:
```
🔄 Starting MongoDB setup for Panda Mart Gamification System...
📍 MongoDB URI: mongodb+srv://***:***@panda-mart-gamification.xxxxx.mongodb.net/
📍 Database: panda_mart_gamification
🔄 Testing MongoDB connection...
✅ Connected to MongoDB database: panda_mart_gamification
🔄 Creating collections...
  ✅ Created: pandaPoints
  ✅ Created: pointsTransactions
  ✅ Created: badges
  ... (15 collections total)
🔄 Creating performance indexes...
  ✅ pandaPoints: 4 indexes
  ✅ pointsTransactions: 5 indexes
  ... (40+ indexes total)
🔄 Inserting sample data...
  ✅ Badges: 12 inserted, 0 already existed
  ✅ Challenges: 7 inserted, 0 already existed
  ✅ Rewards: 8 inserted, 0 already existed
🔄 Verifying database setup...
📋 Verification Results:
  ✅ Collection: pandaPoints: Found
  ✅ Collection: pointsTransactions: Found
  ... (all collections verified)
🎉 All 15 verification tests passed!
🎉 MongoDB setup completed successfully!
📊 Database is ready for Panda Mart gamification features!
```

### 3.3 Verify Setup

```bash
# Run comprehensive tests
npm run mongo:test
```

Expected output:
```
🧪 MongoDB Gamification System Test Suite
📍 Testing database: panda_mart_gamification

🔄 Testing MongoDB connection...
✅ MongoDB connection successful!

🔄 Testing gamification operations...
  🔄 Test 1: Initialize user points...
  🔄 Test 2: Create points transaction...
  🔄 Test 3: Query available badges...
  🔄 Test 4: Award user badge...
  🔄 Test 5: Query available rewards...
  🔄 Test 6: Record daily activity...
  🔄 Test 7: Generate user statistics...

📋 Test Results:
  ✅ Initialize user points: User test_user_xxx initialized
  ✅ Award points transaction: Points balance: 50
  ✅ Query available badges: Found 12 active badges
  ✅ Award user badge: Awarded: Welcome Warrior
  ✅ Query available rewards: Found 8 affordable rewards
  ✅ Record daily activity: Daily check-in recorded
  ✅ Generate user statistics: Generated stats for 1 transaction types

🔄 Cleaning up test data...
✅ Test data cleaned up

🎉 All 7 gamification tests passed!
🚀 MongoDB gamification system is ready for production!

🔄 Testing index performance...
  📊 PandaPoints query uses index: Yes
  📊 Transaction query uses index: Yes

📊 Final Test Summary:
  ✅ Database Connection
  ✅ Gamification Operations
  ✅ Index Performance

🎉 All tests passed! MongoDB gamification system is ready! 🐼🎮
```

## 📊 Step 4: View Your Database

### 4.1 MongoDB Atlas Dashboard

1. **Go to Collections**
   - In Atlas dashboard, click "Browse Collections"
   - You should see your `panda_mart_gamification` database
   - With 15 collections: `pandaPoints`, `pointsTransactions`, `badges`, etc.

2. **Sample Data Verification**
   - Click on `badges` collection
   - You should see 12 badges with different types and rarities
   - Click on `challenges` collection
   - You should see 7 challenges (daily, weekly, monthly)
   - Click on `rewards` collection
   - You should see 8 different rewards

### 4.2 Database Statistics

```bash
# View detailed database statistics
npm run mongo:stats
```

## 🔧 Step 5: Supabase Migration

### 5.1 Update Your Supabase Database

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your Panda Mart project

2. **Run Migration Script**
   - Go to "SQL Editor"
   - Create a new query
   - Copy and paste the contents of `supabase-migration.sql`
   - Click "Run"

3. **Verify Migration**
   - Check that new columns were added to `users` table
   - Verify new tables were created: `user_gamification_preferences`, `product_reviews`, `store_locations`, `user_referrals`
   - Confirm sample store locations were inserted

### 5.2 Test Hybrid Integration

Create a test file to verify both databases work together:

```javascript
// test-hybrid.js
const { HybridAccountService } = require('./lib/database/hybrid');

async function testHybridSystem() {
  console.log('🧪 Testing Hybrid PostgreSQL + MongoDB System...');
  
  try {
    // Test database connections
    const connections = await HybridAccountService.testConnections();
    console.log('📊 Database Connections:', connections);
    
    if (connections.overall) {
      console.log('✅ Hybrid system is ready!');
      console.log('🐼 PostgreSQL: User authentication, orders, reviews');
      console.log('🎮 MongoDB: Points, badges, challenges, rewards');
    } else {
      console.log('❌ Some connections failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testHybridSystem();
```

Run the test:
```bash
node test-hybrid.js
```

## 🎯 Step 6: Integration with Your App

### 6.1 Update API Routes

Your API routes can now use the hybrid service:

```javascript
// app/api/account/profile/route.ts
import { HybridAccountService } from '@/lib/database/hybrid';

export async function GET(request) {
  try {
    const userId = getUserIdFromToken(request); // Your auth logic
    
    // Get complete user profile (PostgreSQL + MongoDB)
    const profile = await HybridAccountService.getUserProfile(userId);
    
    return NextResponse.json({
      success: true,
      data: {
        user: profile.user, // From PostgreSQL
        pandaPoints: profile.pandaPoints, // From MongoDB
        badges: profile.badges, // From MongoDB
        dailyStatus: profile.dailyStatus, // From MongoDB
        stats: profile.stats // From MongoDB
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 6.2 Frontend Integration

```javascript
// components/AccountDashboard.tsx
import { useEffect, useState } from 'react';

export default function AccountDashboard() {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    fetch('/api/account/profile')
      .then(res => res.json())
      .then(data => setProfile(data.data));
  }, []);
  
  if (!profile) return <div>Loading...</div>;
  
  return (
    <div className="space-y-6">
      {/* User Info from PostgreSQL */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold">
          Welcome, {profile.user.first_name}!
        </h2>
        <p>Panda ID: {profile.user.panda_id}</p>
      </div>
      
      {/* Gamification from MongoDB */}
      <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-6 rounded-lg text-white">
        <h3 className="text-lg font-semibold">PandaPoints</h3>
        <p className="text-2xl font-bold">{profile.pandaPoints.pointsBalance}</p>
        <p>Tier: {profile.pandaPoints.tier}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Badges */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold">Badges Earned</h4>
          <p className="text-xl">{profile.badges.totalEarned}</p>
        </div>
        
        {/* Daily Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="font-semibold">Daily Streak</h4>
          <p className="text-xl">{profile.dailyStatus.currentStreak} days</p>
        </div>
      </div>
    </div>
  );
}
```

## 🔒 Step 7: Security & Production Setup

### 7.1 MongoDB Atlas Security

1. **Network Access**
   - Remove "Allow Access from Anywhere" (0.0.0.0/0)
   - Add specific IP addresses for your production servers
   - Add your development machine's IP

2. **Database Users**
   - Create separate users for development and production
   - Use principle of least privilege
   - Rotate passwords regularly

3. **Connection String Security**
   - Never commit connection strings to version control
   - Use environment variables
   - Consider using MongoDB Atlas Private Endpoints for production

### 7.2 Monitoring

1. **MongoDB Atlas Monitoring**
   - Go to "Monitoring" tab in Atlas
   - Set up alerts for high CPU, memory usage
   - Monitor slow queries

2. **Application Monitoring**
   ```javascript
   // Add to your app
   import { testMongoConnection } from './lib/database/mongodb';
   
   // Health check endpoint
   export async function GET() {
     const mongoHealthy = await testMongoConnection();
     const postgresHealthy = await testPostgresConnection();
     
     return NextResponse.json({
       status: mongoHealthy && postgresHealthy ? 'healthy' : 'unhealthy',
       databases: {
         postgresql: postgresHealthy,
         mongodb: mongoHealthy
       },
       timestamp: new Date().toISOString()
     });
   }
   ```

## 🎉 Congratulations!

Your hybrid PostgreSQL + MongoDB system is now ready! You have:

✅ **MongoDB Atlas** - Cloud database for gamification
✅ **Supabase PostgreSQL** - User authentication and critical data  
✅ **15 MongoDB Collections** - Points, badges, challenges, rewards
✅ **Sample Data** - 12 badges, 7 challenges, 8 rewards
✅ **Performance Indexes** - 40+ optimized indexes
✅ **Hybrid Service** - Seamless integration between databases
✅ **Test Suite** - Comprehensive testing for reliability

## 🚀 Next Steps

1. **Deploy to Production**
   - Set up production MongoDB Atlas cluster
   - Configure proper network security
   - Set up monitoring and alerts

2. **Customize Gamification**
   - Modify badge requirements
   - Add custom challenges
   - Create seasonal rewards

3. **Scale as Needed**
   - Monitor performance
   - Add database sharding if needed
   - Optimize queries based on usage patterns

Your Panda Mart gamification system is ready to engage users with points, badges, challenges, and rewards! 🐼🎮✨