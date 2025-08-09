// MongoDB setup script for Panda Mart Account System
// This script initializes the MongoDB database with collections and sample data

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

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
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorLog(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupMongoDB(options = {}) {
    const { skipSampleData = false, resetData = false, verbose = false } = options;
    let client;

    try {
        colorLog('cyan', '🔄 Starting MongoDB setup for Panda Mart Gamification System...');
        colorLog('blue', `📍 MongoDB URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
        colorLog('blue', `📍 Database: ${MONGODB_DB}`);

        // Test connection first
        colorLog('yellow', '🔄 Testing MongoDB connection...');
        client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });

        await client.connect();
        await client.db(MONGODB_DB).admin().ping();

        const db = client.db(MONGODB_DB);
        colorLog('green', `✅ Connected to MongoDB database: ${MONGODB_DB}`);

        // Check if database already exists and has data
        const collections = await db.listCollections().toArray();
        if (collections.length > 0 && !resetData) {
            colorLog('yellow', `⚠️  Database already contains ${collections.length} collections`);
            if (!skipSampleData) {
                const proceed = await askQuestion('Do you want to continue and potentially overwrite existing data? (y/N): ');
                if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
                    colorLog('blue', '🛑 Setup cancelled by user');
                    return;
                }
            }
        }

        // Reset data if requested
        if (resetData) {
            colorLog('yellow', '🔄 Resetting database...');
            await resetDatabase(db);
        }

        // Create collections and indexes
        await createCollections(db, verbose);
        await createIndexes(db, verbose);

        if (!skipSampleData) {
            await insertSampleData(db, verbose);
        }

        // Verify setup
        await verifySetup(db);

        colorLog('green', '🎉 MongoDB setup completed successfully!');
        colorLog('cyan', '📊 Database is ready for Panda Mart gamification features!');

    } catch (error) {
        colorLog('red', '❌ MongoDB setup failed:');
        console.error(error);

        if (error.name === 'MongoServerSelectionError') {
            colorLog('yellow', '💡 Troubleshooting tips:');
            console.log('   • Make sure MongoDB is running');
            console.log('   • Check your connection string');
            console.log('   • Verify network connectivity');
            console.log('   • Check firewall settings');
        }

        process.exit(1);
    } finally {
        if (client) {
            await client.close();
            colorLog('blue', '✅ MongoDB connection closed');
        }
    }
}

async function resetDatabase(db) {
    try {
        const collections = await db.listCollections().toArray();
        for (const collection of collections) {
            await db.collection(collection.name).drop();
            colorLog('yellow', `  🗑️  Dropped collection: ${collection.name}`);
        }
        colorLog('green', '✅ Database reset completed');
    } catch (error) {
        colorLog('red', '❌ Error resetting database:', error.message);
    }
}

async function askQuestion(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        readline.question(question, (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

async function createCollections(db, verbose = false) {
    colorLog('cyan', '🔄 Creating collections...');

    const collections = [
        { name: 'pandaPoints', description: 'User points and tier management' },
        { name: 'pointsTransactions', description: 'Points earning and spending history' },
        { name: 'badges', description: 'Available badges and achievements' },
        { name: 'userBadges', description: 'User earned badges with timestamps' },
        { name: 'challenges', description: 'Available challenges (daily/weekly/monthly)' },
        { name: 'userChallenges', description: 'User challenge progress and completions' },
        { name: 'dailyActivities', description: 'Daily check-ins, spins, and activities' },
        { name: 'rewards', description: 'Redeemable rewards catalog' },
        { name: 'rewardRedemptions', description: 'User reward redemption history' },
        { name: 'storeVisits', description: 'In-store visit tracking' },
        { name: 'leaderboards', description: 'Leaderboard data and rankings' },
        { name: 'userReviews', description: 'Product reviews and ratings' },
        { name: 'wishlistItems', description: 'User wishlist items' },
        { name: 'notifications', description: 'User notifications and alerts' },
        { name: 'referrals', description: 'User referral tracking' }
    ];

    let created = 0;
    let existing = 0;

    for (const collection of collections) {
        try {
            await db.createCollection(collection.name);
            colorLog('green', `  ✅ Created: ${collection.name}`);
            if (verbose) {
                console.log(`     📝 ${collection.description}`);
            }
            created++;
        } catch (error) {
            if (error.code === 48) {
                colorLog('yellow', `  ℹ️  Exists: ${collection.name}`);
                existing++;
            } else {
                colorLog('red', `  ❌ Error creating ${collection.name}: ${error.message}`);
            }
        }
    }

    colorLog('green', `✅ Collections setup: ${created} created, ${existing} already existed`);
}

async function createIndexes(db, verbose = false) {
    colorLog('cyan', '🔄 Creating performance indexes...');

    const indexConfigs = [
        {
            collection: 'pandaPoints',
            indexes: [
                { key: { userId: 1 }, unique: true, name: 'userId_unique' },
                { key: { tier: 1 }, name: 'tier_index' },
                { key: { lifetimePointsEarned: -1 }, name: 'lifetime_points_desc' },
                { key: { updatedAt: -1 }, name: 'updated_desc' }
            ]
        },
        {
            collection: 'pointsTransactions',
            indexes: [
                { key: { userId: 1, createdAt: -1 }, name: 'user_transactions' },
                { key: { transactionType: 1, createdAt: -1 }, name: 'type_date' },
                { key: { source: 1 }, name: 'source_index' },
                { key: { createdAt: -1 }, name: 'date_desc' },
                { key: { userId: 1, transactionType: 1 }, name: 'user_type' }
            ]
        },
        {
            collection: 'badges',
            indexes: [
                { key: { name: 1 }, unique: true, name: 'name_unique' },
                { key: { badgeType: 1, isActive: 1 }, name: 'type_active' },
                { key: { isActive: 1 }, name: 'active_index' }
            ]
        },
        {
            collection: 'userBadges',
            indexes: [
                { key: { userId: 1, badgeId: 1 }, unique: true, name: 'user_badge_unique' },
                { key: { userId: 1, earnedAt: -1 }, name: 'user_earned_desc' },
                { key: { badgeId: 1 }, name: 'badge_index' },
                { key: { earnedAt: -1 }, name: 'earned_desc' }
            ]
        },
        {
            collection: 'dailyActivities',
            indexes: [
                { key: { userId: 1, activityDate: 1, activityType: 1 }, unique: true, name: 'user_date_type_unique' },
                { key: { userId: 1, activityDate: -1 }, name: 'user_date_desc' },
                { key: { activityType: 1, activityDate: -1 }, name: 'type_date_desc' },
                { key: { activityDate: -1 }, name: 'date_desc' }
            ]
        },
        {
            collection: 'challenges',
            indexes: [
                { key: { challengeType: 1, isActive: 1 }, name: 'type_active' },
                { key: { startDate: 1, endDate: 1 }, name: 'date_range' },
                { key: { isActive: 1, endDate: 1 }, name: 'active_end_date' }
            ]
        },
        {
            collection: 'userChallenges',
            indexes: [
                { key: { userId: 1, challengeId: 1 }, unique: true, name: 'user_challenge_unique' },
                { key: { userId: 1, status: 1 }, name: 'user_status' },
                { key: { challengeId: 1, status: 1 }, name: 'challenge_status' }
            ]
        },
        {
            collection: 'rewards',
            indexes: [
                { key: { rewardType: 1, isActive: 1 }, name: 'type_active' },
                { key: { pointsCost: 1, isActive: 1 }, name: 'cost_active' },
                { key: { validFrom: 1, validUntil: 1 }, name: 'validity_range' },
                { key: { isActive: 1, pointsCost: 1 }, name: 'active_cost' }
            ]
        },
        {
            collection: 'rewardRedemptions',
            indexes: [
                { key: { userId: 1, redeemedAt: -1 }, name: 'user_redeemed_desc' },
                { key: { rewardId: 1, redeemedAt: -1 }, name: 'reward_redeemed_desc' },
                { key: { status: 1 }, name: 'status_index' }
            ]
        },
        {
            collection: 'storeVisits',
            indexes: [
                { key: { userId: 1, createdAt: -1 }, name: 'user_visits_desc' },
                { key: { storeLocation: 1, createdAt: -1 }, name: 'store_visits_desc' },
                { key: { visitType: 1, createdAt: -1 }, name: 'type_visits_desc' }
            ]
        }
    ];

    let totalIndexes = 0;

    for (const config of indexConfigs) {
        try {
            const result = await db.collection(config.collection).createIndexes(config.indexes);
            colorLog('green', `  ✅ ${config.collection}: ${config.indexes.length} indexes`);
            if (verbose) {
                config.indexes.forEach(index => {
                    console.log(`     📊 ${index.name}: ${JSON.stringify(index.key)}`);
                });
            }
            totalIndexes += config.indexes.length;
        } catch (error) {
            colorLog('red', `  ❌ Error creating indexes for ${config.collection}: ${error.message}`);
        }
    }

    colorLog('green', `✅ Created ${totalIndexes} performance indexes across all collections`);
}

async function insertSampleData(db, verbose = false) {
    colorLog('cyan', '🔄 Inserting sample data...');

    try {
        // Insert comprehensive badge system
        const badges = [
            // Milestone Badges
            {
                name: 'Welcome Warrior',
                description: 'Complete your first purchase on Panda Mart',
                iconUrl: '/badges/welcome.svg',
                badgeType: 'milestone',
                pointsReward: 50,
                requirements: { action: 'first_purchase' },
                rarity: 'common',
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Loyal Shopper',
                description: 'Earn 1000 lifetime PandaPoints',
                iconUrl: '/badges/loyal.svg',
                badgeType: 'milestone',
                pointsReward: 200,
                requirements: { action: 'lifetime_points', threshold: 1000 },
                rarity: 'rare',
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Points Master',
                description: 'Earn 5000 lifetime PandaPoints',
                iconUrl: '/badges/master.svg',
                badgeType: 'milestone',
                pointsReward: 500,
                requirements: { action: 'lifetime_points', threshold: 5000 },
                rarity: 'epic',
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Panda Legend',
                description: 'Earn 10000 lifetime PandaPoints',
                iconUrl: '/badges/legend.svg',
                badgeType: 'milestone',
                pointsReward: 1000,
                requirements: { action: 'lifetime_points', threshold: 10000 },
                rarity: 'legendary',
                isActive: true,
                createdAt: new Date()
            },

            // Community Badges
            {
                name: 'Review Rookie',
                description: 'Write your first product review',
                iconUrl: '/badges/review-rookie.svg',
                badgeType: 'community',
                pointsReward: 25,
                requirements: { action: 'first_review' },
                rarity: 'common',
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Review Rockstar',
                description: 'Write 10 helpful product reviews',
                iconUrl: '/badges/review-star.svg',
                badgeType: 'community',
                pointsReward: 150,
                requirements: { action: 'helpful_reviews', count: 10 },
                rarity: 'rare',
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Community Champion',
                description: 'Write 50 helpful reviews',
                iconUrl: '/badges/champion.svg',
                badgeType: 'community',
                pointsReward: 500,
                requirements: { action: 'helpful_reviews', count: 50 },
                rarity: 'epic',
                isActive: true,
                createdAt: new Date()
            },

            // Achievement Badges
            {
                name: 'Deal Hunter',
                description: 'Purchase 5 flash sale items',
                iconUrl: '/badges/deal-hunter.svg',
                badgeType: 'achievement',
                pointsReward: 100,
                requirements: { action: 'flash_sale_purchases', count: 5 },
                rarity: 'uncommon',
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Store Explorer',
                description: 'Visit 3 different Panda Mart locations',
                iconUrl: '/badges/explorer.svg',
                badgeType: 'achievement',
                pointsReward: 75,
                requirements: { action: 'store_visits', unique_stores: 3 },
                rarity: 'uncommon',
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Early Bird',
                description: 'Complete 7 consecutive daily check-ins',
                iconUrl: '/badges/early-bird.svg',
                badgeType: 'achievement',
                pointsReward: 100,
                requirements: { action: 'daily_streak', count: 7 },
                rarity: 'rare',
                isActive: true,
                createdAt: new Date()
            },
            {
                name: 'Streak Master',
                description: 'Complete 30 consecutive daily check-ins',
                iconUrl: '/badges/streak-master.svg',
                badgeType: 'achievement',
                pointsReward: 300,
                requirements: { action: 'daily_streak', count: 30 },
                rarity: 'epic',
                isActive: true,
                createdAt: new Date()
            },

            // Special Badges
            {
                name: 'Beta Tester',
                description: 'Early adopter of Panda Mart gamification',
                iconUrl: '/badges/beta.svg',
                badgeType: 'special',
                pointsReward: 250,
                requirements: { action: 'beta_user' },
                rarity: 'legendary',
                isActive: true,
                createdAt: new Date()
            }
        ];

        let badgeCount = 0;
        for (const badge of badges) {
            const result = await db.collection('badges').updateOne(
                { name: badge.name },
                { $setOnInsert: badge },
                { upsert: true }
            );
            if (result.upsertedCount > 0) badgeCount++;
        }
        colorLog('green', `  ✅ Badges: ${badgeCount} inserted, ${badges.length - badgeCount} already existed`);

        // Insert comprehensive challenges
        const now = new Date();
        const challenges = [
            // Daily Challenges
            {
                title: 'Daily Shopper',
                description: 'Make a purchase today',
                challengeType: 'daily',
                pointsReward: 25,
                requirements: { action: 'purchases', count: 1, timeframe: 'day' },
                startDate: now,
                endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                maxCompletions: 1,
                isActive: true,
                createdAt: now
            },
            {
                title: 'Review Writer',
                description: 'Write a product review today',
                challengeType: 'daily',
                pointsReward: 30,
                requirements: { action: 'reviews', count: 1, timeframe: 'day' },
                startDate: now,
                endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                maxCompletions: 1,
                isActive: true,
                createdAt: now
            },

            // Weekly Challenges
            {
                title: 'Weekly Shopper',
                description: 'Make 3 purchases this week',
                challengeType: 'weekly',
                pointsReward: 100,
                requirements: { action: 'purchases', count: 3, timeframe: 'week' },
                startDate: now,
                endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                maxCompletions: 1,
                isActive: true,
                createdAt: now
            },
            {
                title: 'Store Visitor',
                description: 'Visit any Panda Mart store and scan QR code',
                challengeType: 'weekly',
                pointsReward: 75,
                requirements: { action: 'store_visit', qr_scan: true },
                startDate: now,
                endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                maxCompletions: 1,
                isActive: true,
                createdAt: now
            },
            {
                title: 'Social Butterfly',
                description: 'Write 3 product reviews this week',
                challengeType: 'weekly',
                pointsReward: 120,
                requirements: { action: 'reviews', count: 3, timeframe: 'week' },
                startDate: now,
                endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                maxCompletions: 1,
                isActive: true,
                createdAt: now
            },

            // Monthly Challenges
            {
                title: 'Monthly Champion',
                description: 'Make 10 purchases this month',
                challengeType: 'monthly',
                pointsReward: 300,
                requirements: { action: 'purchases', count: 10, timeframe: 'month' },
                startDate: now,
                endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                maxCompletions: 1,
                isActive: true,
                createdAt: now
            },
            {
                title: 'Review Master',
                description: 'Write 15 helpful reviews this month',
                challengeType: 'monthly',
                pointsReward: 400,
                requirements: { action: 'helpful_reviews', count: 15, timeframe: 'month' },
                startDate: now,
                endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                maxCompletions: 1,
                isActive: true,
                createdAt: now
            }
        ];

        let challengeCount = 0;
        for (const challenge of challenges) {
            const result = await db.collection('challenges').updateOne(
                { title: challenge.title },
                { $setOnInsert: challenge },
                { upsert: true }
            );
            if (result.upsertedCount > 0) challengeCount++;
        }
        colorLog('green', `  ✅ Challenges: ${challengeCount} inserted, ${challenges.length - challengeCount} already existed`);

        // Insert comprehensive rewards catalog
        const rewards = [
            // Discount Rewards
            {
                name: 'KES 100 Off',
                description: 'Get KES 100 off your next purchase (min. order KES 500)',
                rewardType: 'discount',
                pointsCost: 100,
                rewardValue: 100.00,
                rewardData: {
                    discount_type: 'fixed',
                    minimum_order: 500,
                    discount_code: 'PANDA100'
                },
                stockQuantity: null,
                maxPerUser: 10,
                validFrom: now,
                validUntil: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now
            },
            {
                name: 'KES 200 Off',
                description: 'Get KES 200 off your next purchase (min. order KES 1000)',
                rewardType: 'discount',
                pointsCost: 200,
                rewardValue: 200.00,
                rewardData: {
                    discount_type: 'fixed',
                    minimum_order: 1000,
                    discount_code: 'PANDA200'
                },
                stockQuantity: null,
                maxPerUser: 5,
                validFrom: now,
                validUntil: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now
            },
            {
                name: '10% Off',
                description: '10% discount on your next purchase (max KES 500 off)',
                rewardType: 'discount',
                pointsCost: 150,
                rewardValue: 0.10,
                rewardData: {
                    discount_type: 'percentage',
                    max_discount: 500,
                    discount_code: 'PANDA10PCT'
                },
                stockQuantity: null,
                maxPerUser: 3,
                validFrom: now,
                validUntil: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now
            },

            // Shipping Rewards
            {
                name: 'Free Standard Delivery',
                description: 'Free standard delivery on your next order',
                rewardType: 'free_shipping',
                pointsCost: 75,
                rewardValue: 0.00,
                rewardData: {
                    shipping_type: 'standard',
                    shipping_code: 'FREESHIP'
                },
                stockQuantity: null,
                maxPerUser: 15,
                validFrom: now,
                validUntil: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now
            },
            {
                name: 'Free Express Delivery',
                description: 'Free express delivery on your next order',
                rewardType: 'free_shipping',
                pointsCost: 150,
                rewardValue: 0.00,
                rewardData: {
                    shipping_type: 'express',
                    shipping_code: 'FREEEXPRESS'
                },
                stockQuantity: null,
                maxPerUser: 5,
                validFrom: now,
                validUntil: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now
            },

            // Voucher Rewards
            {
                name: 'KES 500 Shopping Voucher',
                description: 'KES 500 shopping voucher (min. order KES 1500)',
                rewardType: 'voucher',
                pointsCost: 500,
                rewardValue: 500.00,
                rewardData: {
                    voucher_type: 'general',
                    minimum_order: 1500,
                    voucher_code: 'VOUCHER500'
                },
                stockQuantity: 50,
                maxPerUser: 2,
                validFrom: now,
                validUntil: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now
            },
            {
                name: 'KES 1000 Premium Voucher',
                description: 'KES 1000 premium shopping voucher (min. order KES 3000)',
                rewardType: 'voucher',
                pointsCost: 1000,
                rewardValue: 1000.00,
                rewardData: {
                    voucher_type: 'premium',
                    minimum_order: 3000,
                    voucher_code: 'PREMIUM1000'
                },
                stockQuantity: 20,
                maxPerUser: 1,
                validFrom: now,
                validUntil: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now
            },

            // Special Rewards
            {
                name: 'Mystery Box',
                description: 'Surprise mystery box with random goodies',
                rewardType: 'mystery',
                pointsCost: 300,
                rewardValue: 0.00,
                rewardData: {
                    mystery_type: 'standard',
                    possible_items: ['discount', 'voucher', 'free_shipping', 'bonus_points']
                },
                stockQuantity: 100,
                maxPerUser: 3,
                validFrom: now,
                validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                isActive: true,
                createdAt: now
            }
        ];

        let rewardCount = 0;
        for (const reward of rewards) {
            const result = await db.collection('rewards').updateOne(
                { name: reward.name },
                { $setOnInsert: reward },
                { upsert: true }
            );
            if (result.upsertedCount > 0) rewardCount++;
        }
        colorLog('green', `  ✅ Rewards: ${rewardCount} inserted, ${rewards.length - rewardCount} already existed`);

        // Insert sample notifications templates
        const notificationTemplates = [
            {
                type: 'welcome',
                title: 'Welcome to Panda Mart! 🐼',
                message: 'You\'ve earned 50 PandaPoints as a welcome bonus!',
                actionUrl: '/account/points',
                isActive: true
            },
            {
                type: 'badge_earned',
                title: 'New Badge Unlocked! 🏆',
                message: 'Congratulations! You\'ve earned the {badgeName} badge!',
                actionUrl: '/account/badges',
                isActive: true
            },
            {
                type: 'challenge_completed',
                title: 'Challenge Complete! ✅',
                message: 'You\'ve completed the {challengeName} challenge and earned {points} points!',
                actionUrl: '/account/challenges',
                isActive: true
            },
            {
                type: 'tier_upgraded',
                title: 'Tier Upgrade! ⬆️',
                message: 'Congratulations! You\'ve been upgraded to {tierName} tier!',
                actionUrl: '/account/points',
                isActive: true
            }
        ];

        for (const template of notificationTemplates) {
            await db.collection('notifications').updateOne(
                { type: template.type },
                { $setOnInsert: { ...template, createdAt: now } },
                { upsert: true }
            );
        }
        colorLog('green', '  ✅ Notification templates inserted');

        colorLog('green', '✅ All sample data inserted successfully');

        if (verbose) {
            colorLog('blue', '📊 Sample Data Summary:');
            console.log(`   • ${badges.length} badges (4 types: milestone, community, achievement, special)`);
            console.log(`   • ${challenges.length} challenges (daily, weekly, monthly)`);
            console.log(`   • ${rewards.length} rewards (discounts, shipping, vouchers, mystery)`);
            console.log(`   • ${notificationTemplates.length} notification templates`);
        }

    } catch (error) {
        colorLog('red', '❌ Error inserting sample data:', error.message);
        throw error;
    }
}

async function verifySetup(db) {
    colorLog('cyan', '🔄 Verifying database setup...');

    try {
        const verificationResults = [];

        // Check collections exist
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        const expectedCollections = [
            'pandaPoints', 'pointsTransactions', 'badges', 'userBadges',
            'challenges', 'userChallenges', 'dailyActivities', 'rewards',
            'rewardRedemptions', 'storeVisits', 'notifications'
        ];

        for (const expectedCollection of expectedCollections) {
            const exists = collectionNames.includes(expectedCollection);
            verificationResults.push({
                test: `Collection: ${expectedCollection}`,
                passed: exists,
                details: exists ? 'Found' : 'Missing'
            });
        }

        // Check sample data
        const badgeCount = await db.collection('badges').countDocuments();
        const challengeCount = await db.collection('challenges').countDocuments();
        const rewardCount = await db.collection('rewards').countDocuments();

        verificationResults.push(
            { test: 'Sample badges', passed: badgeCount > 0, details: `${badgeCount} badges` },
            { test: 'Sample challenges', passed: challengeCount > 0, details: `${challengeCount} challenges` },
            { test: 'Sample rewards', passed: rewardCount > 0, details: `${rewardCount} rewards` }
        );

        // Check indexes
        const pandaPointsIndexes = await db.collection('pandaPoints').indexes();
        const transactionIndexes = await db.collection('pointsTransactions').indexes();

        verificationResults.push(
            { test: 'PandaPoints indexes', passed: pandaPointsIndexes.length > 1, details: `${pandaPointsIndexes.length} indexes` },
            { test: 'Transaction indexes', passed: transactionIndexes.length > 1, details: `${transactionIndexes.length} indexes` }
        );

        // Display results
        const passed = verificationResults.filter(r => r.passed).length;
        const total = verificationResults.length;

        colorLog('cyan', '📋 Verification Results:');
        verificationResults.forEach(result => {
            const icon = result.passed ? '✅' : '❌';
            const color = result.passed ? 'green' : 'red';
            colorLog(color, `  ${icon} ${result.test}: ${result.details}`);
        });

        if (passed === total) {
            colorLog('green', `🎉 All ${total} verification tests passed!`);
        } else {
            colorLog('yellow', `⚠️  ${passed}/${total} verification tests passed`);
        }

        return passed === total;

    } catch (error) {
        colorLog('red', '❌ Error during verification:', error.message);
        return false;
    }
}

async function showDatabaseStats(db) {
    colorLog('cyan', '📊 Database Statistics:');

    try {
        const stats = await db.stats();
        const collections = await db.listCollections().toArray();

        console.log(`   Database: ${db.databaseName}`);
        console.log(`   Collections: ${collections.length}`);
        console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Indexes: ${stats.indexes}`);
        console.log(`   Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);

        // Collection-specific stats
        colorLog('blue', '📋 Collection Details:');
        for (const collection of collections) {
            const count = await db.collection(collection.name).countDocuments();
            console.log(`   • ${collection.name}: ${count} documents`);
        }

    } catch (error) {
        colorLog('red', '❌ Error getting database stats:', error.message);
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    const options = {
        skipSampleData: args.includes('--skip-sample-data'),
        resetData: args.includes('--reset'),
        verbose: args.includes('--verbose') || args.includes('-v'),
        showStats: args.includes('--stats'),
        help: args.includes('--help') || args.includes('-h')
    };

    if (options.help) {
        console.log(`
${colors.bright}Panda Mart MongoDB Setup Script${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node mongodb-setup.js [options]

${colors.cyan}Options:${colors.reset}
  --skip-sample-data    Skip inserting sample badges, challenges, and rewards
  --reset              Reset database (drop all collections before setup)
  --verbose, -v        Show detailed output during setup
  --stats              Show database statistics after setup
  --help, -h           Show this help message

${colors.cyan}Environment Variables:${colors.reset}
  MONGODB_URI          MongoDB connection string (default: mongodb://localhost:27017)
  MONGODB_DB           Database name (default: panda_mart_gamification)

${colors.cyan}Examples:${colors.reset}
  node mongodb-setup.js                    # Standard setup with sample data
  node mongodb-setup.js --verbose          # Detailed setup output
  node mongodb-setup.js --reset --verbose  # Reset and setup with details
  node mongodb-setup.js --skip-sample-data # Setup without sample data
  node mongodb-setup.js --stats            # Show database stats after setup
`);
        return;
    }

    try {
        await setupMongoDB(options);

        if (options.showStats) {
            const client = new MongoClient(MONGODB_URI);
            await client.connect();
            const db = client.db(MONGODB_DB);
            await showDatabaseStats(db);
            await client.close();
        }

    } catch (error) {
        colorLog('red', '❌ Setup failed:', error.message);
        process.exit(1);
    }
}

// Run the setup
if (require.main === module) {
    main();
}

module.exports = {
    setupMongoDB,
    createCollections,
    createIndexes,
    insertSampleData,
    verifySetup,
    showDatabaseStats
};