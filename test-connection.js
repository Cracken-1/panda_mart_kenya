// Test MongoDB Atlas connection
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://alphoncewekesamukaisi:WTlt8wnJgfR8hyno@panda-mart-gamification.sgmrmnb.mongodb.net/?retryWrites=true&w=majority&appName=panda-mart-gamification';

async function testConnection() {
  console.log('🔄 Testing MongoDB Atlas connection...');
  console.log('URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));
  
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    console.log('🔄 Connecting...');
    await client.connect();
    
    console.log('🔄 Testing ping...');
    await client.db('panda_mart_gamification').admin().ping();
    
    console.log('✅ MongoDB Atlas connection successful!');
    
    // List databases to verify access
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('📊 Available databases:', dbs.databases.map(db => db.name));
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Authentication issue - check username/password');
    } else if (error.message.includes('network')) {
      console.log('💡 Network issue - check IP whitelist in MongoDB Atlas');
    }
    
    return false;
  } finally {
    if (client) {
      await client.close();
      console.log('🔄 Connection closed');
    }
  }
}

testConnection();