# MongoDB Gamification System for Panda Mart

This document provides comprehensive instructions for setting up and using the MongoDB-based gamification system for Panda Mart Kenya.

## 🎯 Overview

The Panda Mart gamification system uses a hybrid database architecture:
- **PostgreSQL**: User authentication, critical transactional data
- **MongoDB**: Gamification features (points, badges, challenges, rewards)

This approach combines the ACID compliance of PostgreSQL for critical operations with the flexibility and performance of MongoDB for gamification analytics.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install mongodb @types/mongodb
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env.local

# Add MongoDB configuration to .env.local
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=panda_mart_gamification
```

### 3. Setup Database
```bash
# Standard setup with sample data
npm run mongo:setup

# Verbose setup (recommended for first time)
npm run mongo:setup:verbose

# Reset and setup (if you need to start fresh)
npm run mongo:setup:reset
```

### 4. Test Setup
```bash
# Run comprehensive tests
npm run mongo:test

# View database statistics
npm run mongo:stats
```

## 📊 Database Collections

### Core Collections

#### `pandaPoints`
User points and tier management
```javascript
{
  userId: "user_123",
  pointsBalance: 1250,
  lifetimePointsEarned: 2500,
  tier: "Gold",
  tierProgress: 75,
  createdAt: Date,
  updatedAt: Date
}
```

#### `pointsTransactions`
Complete transaction history
```javascript
{
  userId: "user_123",
  transactionType: "earned", // or "redeemed"
  pointsAmount: 50,
  source: "purchase",
  sourceId: "order_456",
  description: "Purchase points for order #456",
  metadata: { orderId: "order_456", orderValue: 1000 },
  createdAt: Date
}
```

#### `badges`
Available badges and achievements
```javascript
{
  name: "Welcome Warrior",
  description: "Complete your first purchase",
  iconUrl: "/badges/welcome.svg",
  badgeType: "milestone", // milestone, community, achievement, special
  pointsReward: 50,
  requirements: { action: "first_purchase" },
  rarity: "common", // common, uncommon, rare, epic, legendary
  isActive: true,
  createdAt: Date
}
```

#### `userBadges`
User's earned badges
```javascript
{
  userId: "user_123",
  badgeId: "badge_id",
  badgeName: "Welcome Warrior",
  earnedAt: Date,
  pointsAwarded: 50
}
```

#### `dailyActivities`
Daily check-ins, spins, and activities
```javascript
{
  userId: "user_123",
  activityType: "checkin", // checkin, spin, bonus
  activityDate: "2025-01-15",
  pointsEarned: 5,
  rewardData: { streak: 7, basePoints: 5, streakBonus: 10 },
  createdAt: Date
}
```

#### `challenges`
Available challenges
```javascript
{
  title: "Weekly Shopper",
  description: "Make 3 purchases this week",
  challengeType: "weekly", // daily, weekly, monthly
  pointsReward: 100,
  requirements: { action: "purchases", count: 3, timeframe: "week" },
  startDate: Date,
  endDate: Date,
  maxCompletions: 1,
  isActive: true,
  createdAt: Date
}
```

#### `rewards`
Redeemable rewards catalog
```javascript
{
  name: "KES 200 Off",
  description: "Get KES 200 off your next purchase",
  rewardType: "discount", // discount, free_shipping, voucher, mystery
  pointsCost: 200,
  rewardValue: 200.00,
  rewardData: { 
    discount_type: "fixed", 
    minimum_order: 500,
    discount_code: "PANDA200"
  },
  stockQuantity: null, // null for unlimited
  maxPerUser: 5,
  validFrom: Date,
  validUntil: Date,
  isActive: true,
  createdAt: Date
}
```

## 🔧 Usage Examples

### Initialize User Points
```javascript
import { PandaPointsDB } from '@/lib/database/mongodb';

// Initialize new user
const userPoints = await PandaPointsDB.initializeUserPoints('user_123');
console.log(userPoints); // { userId: 'user_123', pointsBalance: 0, tier: 'Bronze', ... }
```

### Award Points
```javascript
import { PointsTransactionsDB } from '@/lib/database/mongodb';

// Award points for purchase
const transaction = await PointsTransactionsDB.createTransaction({
  userId: 'user_123',
  transactionType: 'earned',
  pointsAmount: 50,
  source: 'purchase',
  sourceId: 'order_456',
  description: 'Purchase points for order #456',
  metadata: { orderId: 'order_456', orderValue: 1000 }
});
```

### Check Daily Activities
```javascript
import { DailyActivitiesDB } from '@/lib/database/mongodb';

// Check if user has checked in today
const hasCheckedIn = await DailyActivitiesDB.hasActivityToday('user_123', 'checkin');

// Get user's check-in streak
const streakData = await DailyActivitiesDB.getUserStreak('user_123', 'checkin');
console.log(streakData); // { currentStreak: 7, longestStreak: 15 }
```

### Award Badges
```javascript
import { UserBadgesDB, BadgesDB } from '@/lib/database/mongodb';

// Check available badges
const badges = await BadgesDB.getActiveBadges();

// Award badge to user
await UserBadgesDB.awardBadge('user_123', 'badge_id', 50);
```

### Hybrid Service Usage
```javascript
import { HybridAccountService } from '@/lib/database/hybrid';

// Create complete user account (PostgreSQL + MongoDB)
const result = await HybridAccountService.createUserAccount({
  pandaId: 'PANDA123456',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe'
});

// Get complete user profile
const profile = await HybridAccountService.getUserProfile('user_123');
console.log(profile.pandaPoints); // Points data from MongoDB
console.log(profile.user); // User data from PostgreSQL
```

## 🎮 Gamification Features

### Points System
- **Earning**: Purchase points, review points, daily check-ins, challenges
- **Spending**: Redeem for discounts, free shipping, vouchers
- **Tiers**: Bronze → Silver → Gold → Platinum (based on lifetime points)

### Badge System
- **Types**: Milestone, Community, Achievement, Special
- **Rarities**: Common, Uncommon, Rare, Epic, Legendary
- **Auto-unlock**: Badges unlock automatically when requirements are met

### Daily Activities
- **Check-in**: Daily points with streak bonuses
- **Spin Wheel**: Random rewards (points, discounts, free shipping)
- **Streak Tracking**: Consecutive day tracking with bonus rewards

### Challenges
- **Daily**: Simple daily tasks (1 purchase, 1 review)
- **Weekly**: Medium-term goals (3 purchases, store visit)
- **Monthly**: Long-term achievements (10 purchases, 15 reviews)

### Rewards Catalog
- **Discounts**: Fixed amount or percentage off
- **Free Shipping**: Standard or express delivery
- **Vouchers**: Shopping credit with minimum order
- **Mystery Boxes**: Random surprise rewards

## 🔍 Monitoring & Analytics

### Database Statistics
```bash
# View collection statistics
npm run mongo:stats
```

### Performance Monitoring
```javascript
// Check index usage
const explain = await db.collection('pandaPoints')
  .find({ userId: 'user_123' })
  .explain('executionStats');
```

### User Analytics
```javascript
// Get user statistics
const stats = await PointsTransactionsDB.getTransactionStats('user_123');
console.log(stats); // { earned: { total: 1500, count: 30 }, redeemed: { total: 500, count: 5 } }
```

## 🛠️ Advanced Configuration

### Custom Badge Requirements
```javascript
// Add custom badge with complex requirements
const customBadge = {
  name: "Power Shopper",
  requirements: {
    action: "custom",
    conditions: {
      totalOrders: { $gte: 20 },
      lifetimePoints: { $gte: 2000 },
      reviewCount: { $gte: 10 }
    }
  }
};
```

### Custom Challenge Types
```javascript
// Create seasonal challenge
const seasonalChallenge = {
  title: "Holiday Shopper",
  challengeType: "seasonal",
  requirements: {
    action: "purchases",
    count: 5,
    timeframe: "custom",
    startDate: new Date('2025-12-01'),
    endDate: new Date('2025-12-31')
  }
};
```

## 🔒 Security Considerations

### Data Validation
- All user inputs are validated using Zod schemas
- MongoDB queries use parameterized queries to prevent injection
- User permissions checked before database operations

### Rate Limiting
- Daily activity limits prevent abuse
- Point earning caps prevent exploitation
- Reward redemption limits per user

### Data Privacy
- User data is anonymized in analytics
- Personal information stored only in PostgreSQL
- MongoDB contains only user IDs and activity data

## 🚀 Deployment

### Production Setup
1. **MongoDB Atlas** (recommended for production)
2. **Connection pooling** configured automatically
3. **Indexes** optimized for query performance
4. **Backup strategy** for both PostgreSQL and MongoDB

### Environment Variables
```bash
# Production MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=panda_mart_gamification

# Development MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=panda_mart_gamification_dev
```

## 🧪 Testing

### Unit Tests
```bash
# Test MongoDB connection and operations
npm run mongo:test
```

### Integration Tests
```javascript
// Test hybrid service
const success = await HybridAccountService.testConnections();
console.log(success); // { postgresql: true, mongodb: true, overall: true }
```

## 📚 API Integration

### Next.js API Routes
```javascript
// app/api/account/points/route.ts
import { HybridAccountService } from '@/lib/database/hybrid';

export async function GET(request) {
  const userId = getUserIdFromToken(request);
  const profile = await HybridAccountService.getUserProfile(userId);
  return NextResponse.json(profile);
}
```

### Frontend Integration
```javascript
// React component
const { data: profile } = useSWR('/api/account/points', fetcher);

return (
  <div>
    <h2>PandaPoints: {profile?.pandaPoints?.pointsBalance}</h2>
    <p>Tier: {profile?.pandaPoints?.tier}</p>
    <p>Badges: {profile?.badges?.totalEarned}</p>
  </div>
);
```

## 🎯 Next Steps

1. **Setup MongoDB** using this guide
2. **Test the system** with the provided test scripts
3. **Integrate with your API routes** using the hybrid service
4. **Customize gamification rules** based on your business needs
5. **Monitor performance** and optimize as needed

## 🆘 Troubleshooting

### Common Issues

**Connection Failed**
```bash
# Check MongoDB service
sudo systemctl status mongod

# Test connection
mongosh "mongodb://localhost:27017/panda_mart_gamification"
```

**Index Errors**
```bash
# Drop and recreate indexes
npm run mongo:setup:reset
```

**Performance Issues**
```bash
# Check index usage
npm run mongo:test
```

### Support
- Check the MongoDB setup guide: `MONGODB_SETUP_GUIDE.md`
- Run diagnostics: `npm run mongo:test`
- View logs: Check MongoDB logs for detailed error messages

---

Your MongoDB gamification system is now ready to power the Panda Mart rewards program! 🐼🎮✨