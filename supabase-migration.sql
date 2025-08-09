-- Supabase Migration Script for Hybrid Architecture
-- This script updates existing tables to work with MongoDB gamification system
-- Run this in your Supabase SQL Editor AFTER the initial setup

-- ============================================================================
-- MIGRATION: Update existing tables for hybrid architecture
-- ============================================================================

-- Add gamification-related columns to users table (if they don't exist)
DO $$ 
BEGIN
    -- Add gamification preferences
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'gamification_enabled') THEN
        ALTER TABLE users ADD COLUMN gamification_enabled BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'notifications_enabled') THEN
        ALTER TABLE users ADD COLUMN notifications_enabled BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'points_notifications') THEN
        ALTER TABLE users ADD COLUMN points_notifications BOOLEAN DEFAULT TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'badge_notifications') THEN
        ALTER TABLE users ADD COLUMN badge_notifications BOOLEAN DEFAULT TRUE;
    END IF;
    
    -- Add MongoDB reference tracking
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'mongo_initialized') THEN
        ALTER TABLE users ADD COLUMN mongo_initialized BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'mongo_last_sync') THEN
        ALTER TABLE users ADD COLUMN mongo_last_sync TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Update orders table to better integrate with points system
DO $$
BEGIN
    -- Ensure points columns exist with proper defaults
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'points_earned') THEN
        ALTER TABLE orders ADD COLUMN points_earned INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'points_used') THEN
        ALTER TABLE orders ADD COLUMN points_used INTEGER DEFAULT 0;
    END IF;
    
    -- Add gamification metadata
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'is_flash_sale') THEN
        ALTER TABLE orders ADD COLUMN is_flash_sale BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'gamification_metadata') THEN
        ALTER TABLE orders ADD COLUMN gamification_metadata JSONB;
    END IF;
END $$;

-- ============================================================================
-- NEW TABLES: Additional tables for hybrid architecture
-- ============================================================================

-- User preferences for gamification (PostgreSQL for consistency)
CREATE TABLE IF NOT EXISTS user_gamification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification preferences
    points_notifications BOOLEAN DEFAULT TRUE,
    badge_notifications BOOLEAN DEFAULT TRUE,
    challenge_notifications BOOLEAN DEFAULT TRUE,
    reward_notifications BOOLEAN DEFAULT TRUE,
    daily_reminder BOOLEAN DEFAULT TRUE,
    weekly_summary BOOLEAN DEFAULT TRUE,
    
    -- Privacy preferences
    leaderboard_visible BOOLEAN DEFAULT TRUE,
    profile_public BOOLEAN DEFAULT FALSE,
    activity_sharing BOOLEAN DEFAULT TRUE,
    
    -- Communication preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product reviews (PostgreSQL for moderation and critical data)
-- Handle existing table gracefully
DO $$
BEGIN
    -- Create table if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_reviews' AND table_schema = 'public') THEN
        CREATE TABLE product_reviews (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE SET NULL,
            order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
            product_id VARCHAR(100) NOT NULL,
            product_name VARCHAR(200),
            
            -- Review content
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            title VARCHAR(200),
            review_text TEXT,
            
            -- Review metadata
            is_verified_purchase BOOLEAN DEFAULT FALSE,
            is_helpful_count INTEGER DEFAULT 0,
            is_flagged BOOLEAN DEFAULT FALSE,
            moderation_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
            
            -- Gamification integration
            points_awarded INTEGER DEFAULT 0,
            mongo_review_id VARCHAR(100), -- Reference to MongoDB document
            
            -- Timestamps
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Created product_reviews table';
    ELSE
        -- Table exists, ensure all columns are present
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_reviews' AND column_name = 'moderation_status') THEN
            ALTER TABLE product_reviews ADD COLUMN moderation_status VARCHAR(20) DEFAULT 'pending';
            RAISE NOTICE 'Added moderation_status column to existing product_reviews table';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_reviews' AND column_name = 'points_awarded') THEN
            ALTER TABLE product_reviews ADD COLUMN points_awarded INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_reviews' AND column_name = 'mongo_review_id') THEN
            ALTER TABLE product_reviews ADD COLUMN mongo_review_id VARCHAR(100);
        END IF;
        
        RAISE NOTICE 'Updated existing product_reviews table with missing columns';
    END IF;
END $$;

-- Store locations for visit tracking
CREATE TABLE IF NOT EXISTS store_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_code VARCHAR(20) UNIQUE NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    
    -- Location details
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Geographic coordinates
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Store details
    phone VARCHAR(20),
    email VARCHAR(100),
    manager_name VARCHAR(100),
    
    -- Operating hours (JSON format)
    operating_hours JSONB,
    
    -- Store features
    has_pharmacy BOOLEAN DEFAULT FALSE,
    has_bakery BOOLEAN DEFAULT FALSE,
    has_deli BOOLEAN DEFAULT FALSE,
    parking_available BOOLEAN DEFAULT TRUE,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral system (PostgreSQL for financial tracking)
CREATE TABLE IF NOT EXISTS user_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    referred_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Referral details
    referral_code VARCHAR(20) NOT NULL,
    referral_source VARCHAR(50), -- 'app', 'email', 'social', etc.
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'expired'
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Rewards
    referrer_points_awarded INTEGER DEFAULT 0,
    referred_points_awarded INTEGER DEFAULT 0,
    referrer_reward_given BOOLEAN DEFAULT FALSE,
    referred_reward_given BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR NEW TABLES
-- ============================================================================

-- User gamification preferences indexes
CREATE INDEX IF NOT EXISTS idx_user_gamification_preferences_user_id 
    ON user_gamification_preferences(user_id);

-- Product reviews indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_product_reviews_moderation ON product_reviews(moderation_status);
CREATE INDEX IF NOT EXISTS idx_product_reviews_mongo_id ON product_reviews(mongo_review_id);

-- Store locations indexes
CREATE INDEX IF NOT EXISTS idx_store_locations_code ON store_locations(store_code);
CREATE INDEX IF NOT EXISTS idx_store_locations_city ON store_locations(city);
CREATE INDEX IF NOT EXISTS idx_store_locations_active ON store_locations(is_active);
CREATE INDEX IF NOT EXISTS idx_store_locations_coordinates ON store_locations(latitude, longitude);

-- User referrals indexes
CREATE INDEX IF NOT EXISTS idx_user_referrals_referrer ON user_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_referred ON user_referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_user_referrals_code ON user_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_user_referrals_status ON user_referrals(status);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS FOR NEW TABLES
-- ============================================================================

-- Ensure the update_updated_at_column function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers for new tables
CREATE TRIGGER update_user_gamification_preferences_updated_at
    BEFORE UPDATE ON user_gamification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_locations_updated_at
    BEFORE UPDATE ON store_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_referrals_updated_at
    BEFORE UPDATE ON user_referrals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY FOR NEW TABLES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE user_gamification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- User gamification preferences policies
CREATE POLICY "Users can manage own gamification preferences" ON user_gamification_preferences
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Product reviews policies (with error handling)
DO $$
BEGIN
    -- Create policies only if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'product_reviews' 
        AND policyname = 'Users can view approved reviews'
    ) THEN
        CREATE POLICY "Users can view approved reviews" ON product_reviews
            FOR SELECT USING (moderation_status = 'approved');
        RAISE NOTICE 'Created policy: Users can view approved reviews';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'product_reviews' 
        AND policyname = 'Users can manage own reviews'
    ) THEN
        CREATE POLICY "Users can manage own reviews" ON product_reviews
            FOR ALL USING (auth.uid()::text = user_id::text);
        RAISE NOTICE 'Created policy: Users can manage own reviews';
    END IF;
END $$;

-- Store locations policies (public read access)
CREATE POLICY "Anyone can view active store locations" ON store_locations
    FOR SELECT USING (is_active = TRUE);

-- User referrals policies
CREATE POLICY "Users can view own referrals" ON user_referrals
    FOR SELECT USING (
        auth.uid()::text = referrer_id::text OR 
        auth.uid()::text = referred_id::text
    );

CREATE POLICY "Users can create referrals" ON user_referrals
    FOR INSERT WITH CHECK (auth.uid()::text = referrer_id::text);

-- ============================================================================
-- FUNCTIONS FOR HYBRID INTEGRATION
-- ============================================================================

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        -- Generate 8-character alphanumeric code
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM user_referrals WHERE referral_code = code) INTO exists;
        
        -- Exit loop if code is unique
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate points for orders
CREATE OR REPLACE FUNCTION calculate_order_points(order_total DECIMAL)
RETURNS INTEGER AS $$
BEGIN
    -- Basic calculation: 1 point per 100 KES spent
    -- You can customize this logic based on your business rules
    RETURN FLOOR(order_total / 100)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Function to update order points automatically
CREATE OR REPLACE FUNCTION update_order_points()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate points if not already set
    IF NEW.points_earned = 0 AND NEW.status = 'completed' THEN
        NEW.points_earned = calculate_order_points(NEW.total_amount);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate points on order completion
CREATE TRIGGER calculate_order_points_trigger
    BEFORE UPDATE ON orders
    FOR EACH ROW
    WHEN (OLD.status != 'completed' AND NEW.status = 'completed')
    EXECUTE FUNCTION update_order_points();

-- ============================================================================
-- SAMPLE DATA FOR NEW TABLES
-- ============================================================================

-- Insert sample store locations
INSERT INTO store_locations (
    store_code, store_name, address_line_1, city, county, 
    latitude, longitude, phone, operating_hours, 
    has_pharmacy, has_bakery, parking_available
) VALUES 
(
    'PM001', 
    'Panda Mart Westlands', 
    'Westlands Shopping Centre, Waiyaki Way', 
    'Nairobi', 
    'Nairobi',
    -1.2676, 
    36.8108, 
    '+254700123456',
    '{"monday": "8:00-22:00", "tuesday": "8:00-22:00", "wednesday": "8:00-22:00", "thursday": "8:00-22:00", "friday": "8:00-22:00", "saturday": "8:00-22:00", "sunday": "9:00-21:00"}',
    TRUE, 
    TRUE, 
    TRUE
),
(
    'PM002', 
    'Panda Mart Karen', 
    'Karen Shopping Centre, Langata Road', 
    'Nairobi', 
    'Nairobi',
    -1.3194, 
    36.7073, 
    '+254700123457',
    '{"monday": "8:00-21:00", "tuesday": "8:00-21:00", "wednesday": "8:00-21:00", "thursday": "8:00-21:00", "friday": "8:00-21:00", "saturday": "8:00-21:00", "sunday": "9:00-20:00"}',
    FALSE, 
    TRUE, 
    TRUE
),
(
    'PM003', 
    'Panda Mart CBD', 
    'Kimathi Street, City Centre', 
    'Nairobi', 
    'Nairobi',
    -1.2864, 
    36.8172, 
    '+254700123458',
    '{"monday": "7:00-20:00", "tuesday": "7:00-20:00", "wednesday": "7:00-20:00", "thursday": "7:00-20:00", "friday": "7:00-20:00", "saturday": "8:00-20:00", "sunday": "9:00-18:00"}',
    TRUE, 
    FALSE, 
    FALSE
) ON CONFLICT (store_code) DO NOTHING;

-- Initialize gamification preferences for existing users
INSERT INTO user_gamification_preferences (user_id)
SELECT id FROM users 
WHERE NOT EXISTS (
    SELECT 1 FROM user_gamification_preferences 
    WHERE user_gamification_preferences.user_id = users.id
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if migration was successful
SELECT 
    'Migration Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'gamification_enabled') 
        THEN '✅ Users table updated'
        ELSE '❌ Users table migration failed'
    END as status
UNION ALL
SELECT 
    'New Tables',
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_gamification_preferences')
        AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_reviews')
        AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'store_locations')
        AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_referrals')
        THEN '✅ All new tables created'
        ELSE '❌ Some tables missing'
    END
UNION ALL
SELECT 
    'Sample Data',
    CASE 
        WHEN (SELECT COUNT(*) FROM store_locations) >= 3
        THEN '✅ Sample store locations added'
        ELSE '❌ Sample data missing'
    END;

-- Show updated table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('users', 'orders', 'user_gamification_preferences', 'product_reviews', 'store_locations', 'user_referrals')
AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Show store locations
SELECT 
    store_code,
    store_name,
    city,
    has_pharmacy,
    has_bakery,
    is_active
FROM store_locations
ORDER BY store_code;