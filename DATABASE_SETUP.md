# Panda Mart Database Setup

## Database Schema Design

### Core Tables

#### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    panda_id VARCHAR(20) UNIQUE NOT NULL, -- PANDA123456 format
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' -- active, suspended, deleted
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_panda_id ON users(panda_id);
```

#### 2. User Profiles Table
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    location VARCHAR(255),
    preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    notification_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Loyalty Program Tables
```sql
CREATE TABLE loyalty_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL, -- Bronze, Silver, Gold, Platinum, Diamond
    min_points INTEGER NOT NULL,
    points_multiplier DECIMAL(3,2) NOT NULL, -- 1.0, 1.5, 2.0, 3.0, 5.0
    benefits JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_loyalty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tier_id UUID REFERENCES loyalty_tiers(id),
    total_points INTEGER DEFAULT 0,
    available_points INTEGER DEFAULT 0,
    lifetime_spent DECIMAL(12,2) DEFAULT 0,
    store_visits INTEGER DEFAULT 0,
    join_date DATE DEFAULT CURRENT_DATE,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL, -- earned, redeemed, expired, bonus
    points INTEGER NOT NULL,
    description TEXT NOT NULL,
    reference_id UUID, -- order_id, reward_id, etc.
    reference_type VARCHAR(50), -- order, reward, bonus, etc.
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Orders and Transactions
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- ORD-2025-001
    user_id UUID REFERENCES users(id),
    store_id UUID,
    total_amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    delivery_type VARCHAR(20), -- pickup, delivery
    delivery_address JSONB,
    pickup_store_id UUID,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. Notifications System
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- order, promotion, loyalty, security, community, system
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

#### 6. User Sessions and Security
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    location VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL, -- login, logout, password_change, 2fa_enable, etc.
    ip_address INET,
    user_agent TEXT,
    location VARCHAR(255),
    success BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. Stores and Locations
```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    coordinates POINT, -- PostGIS for location queries
    opening_hours JSONB,
    facilities JSONB DEFAULT '{}', -- parking, wifi, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 8. Rewards and Coupons
```sql
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- discount, credit, service, access
    points_required INTEGER NOT NULL,
    value DECIMAL(10,2), -- discount amount or credit value
    terms_conditions TEXT,
    validity_days INTEGER DEFAULT 30,
    max_redemptions INTEGER,
    current_redemptions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE user_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id),
    redemption_code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, used, expired
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

### Database Triggers and Functions

#### 1. Update Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_loyalty_updated_at BEFORE UPDATE ON user_loyalty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### 2. Generate Panda ID
```sql
CREATE OR REPLACE FUNCTION generate_panda_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    exists BOOLEAN;
BEGIN
    LOOP
        new_id := 'PANDA' || LPAD(floor(random() * 1000000)::text, 6, '0');
        SELECT EXISTS(SELECT 1 FROM users WHERE panda_id = new_id) INTO exists;
        IF NOT exists THEN
            EXIT;
        END IF;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate Panda ID
CREATE OR REPLACE FUNCTION set_panda_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.panda_id IS NULL OR NEW.panda_id = '' THEN
        NEW.panda_id := generate_panda_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_panda_id BEFORE INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION set_panda_id();
```

#### 3. Loyalty Points Management
```sql
CREATE OR REPLACE FUNCTION update_loyalty_tier(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    user_points INTEGER;
    new_tier_id UUID;
BEGIN
    -- Get current points
    SELECT total_points INTO user_points 
    FROM user_loyalty 
    WHERE user_id = user_uuid;
    
    -- Find appropriate tier
    SELECT id INTO new_tier_id
    FROM loyalty_tiers
    WHERE min_points <= user_points
    ORDER BY min_points DESC
    LIMIT 1;
    
    -- Update user's tier
    UPDATE user_loyalty 
    SET tier_id = new_tier_id, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update tier when points change
CREATE OR REPLACE FUNCTION check_loyalty_tier_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_points != OLD.total_points THEN
        PERFORM update_loyalty_tier(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tier_on_points_change AFTER UPDATE ON user_loyalty
    FOR EACH ROW EXECUTE FUNCTION check_loyalty_tier_update();
```

### Initial Data Seeds

#### 1. Loyalty Tiers
```sql
INSERT INTO loyalty_tiers (name, min_points, points_multiplier, benefits) VALUES
('Bronze', 0, 1.0, '{"delivery": "standard", "birthday_reward": true, "early_access": false}'),
('Silver', 1000, 1.5, '{"delivery": "priority", "birthday_reward": true, "early_access": false, "exclusive_promotions": true}'),
('Gold', 5000, 2.0, '{"delivery": "express_free", "birthday_reward": true, "early_access": true, "exclusive_promotions": true}'),
('Platinum', 10000, 3.0, '{"delivery": "priority_free", "birthday_reward": true, "early_access": true, "exclusive_promotions": true, "extended_warranty": true}'),
('Diamond', 25000, 5.0, '{"delivery": "same_day_free", "birthday_reward": true, "early_access": true, "exclusive_promotions": true, "extended_warranty": true, "personal_assistant": true}');
```

#### 2. Sample Stores
```sql
INSERT INTO stores (name, code, address, city, county, phone, email, coordinates, opening_hours, facilities) VALUES
('Panda Mart Westgate', 'WG001', 'Westgate Shopping Mall, Westlands', 'Nairobi', 'Nairobi', '+254700000001', 'westgate@pandamart.co.ke', POINT(-1.2676, 36.8065), '{"monday": "8:00-22:00", "tuesday": "8:00-22:00", "wednesday": "8:00-22:00", "thursday": "8:00-22:00", "friday": "8:00-22:00", "saturday": "8:00-22:00", "sunday": "9:00-21:00"}', '{"parking": true, "wifi": true, "restaurant": true}'),
('Panda Mart Garden City', 'GC001', 'Garden City Mall, Thika Road', 'Nairobi', 'Nairobi', '+254700000002', 'gardencity@pandamart.co.ke', POINT(-1.2194, 36.8968), '{"monday": "8:00-22:00", "tuesday": "8:00-22:00", "wednesday": "8:00-22:00", "thursday": "8:00-22:00", "friday": "8:00-22:00", "saturday": "8:00-22:00", "sunday": "9:00-21:00"}', '{"parking": true, "wifi": true, "kids_area": true}'),
('Panda Mart Sarit Centre', 'SC001', 'Sarit Centre, Westlands', 'Nairobi', 'Nairobi', '+254700000003', 'sarit@pandamart.co.ke', POINT(-1.2630, 36.8063), '{"monday": "8:00-22:00", "tuesday": "8:00-22:00", "wednesday": "8:00-22:00", "thursday": "8:00-22:00", "friday": "8:00-22:00", "saturday": "8:00-22:00", "sunday": "9:00-21:00"}', '{"parking": true, "wifi": true}');
```

### Performance Optimization

#### 1. Indexes for Common Queries
```sql
-- User lookups
CREATE INDEX idx_users_email_status ON users(email, status);
CREATE INDEX idx_users_phone_status ON users(phone, status);

-- Loyalty queries
CREATE INDEX idx_user_loyalty_user_id ON user_loyalty(user_id);
CREATE INDEX idx_loyalty_transactions_user_id_created_at ON loyalty_transactions(user_id, created_at DESC);

-- Order queries
CREATE INDEX idx_orders_user_id_created_at ON orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status_created_at ON orders(status, created_at DESC);

-- Notification queries
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- Session management
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_active ON user_sessions(user_id, is_active);
```

#### 2. Partitioning for Large Tables
```sql
-- Partition loyalty_transactions by month
CREATE TABLE loyalty_transactions_y2025m01 PARTITION OF loyalty_transactions
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE loyalty_transactions_y2025m02 PARTITION OF loyalty_transactions
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Add more partitions as needed
```

### Backup and Maintenance

#### 1. Regular Cleanup Jobs
```sql
-- Clean expired sessions
DELETE FROM user_sessions WHERE expires_at < CURRENT_TIMESTAMP;

-- Clean old security logs (keep 1 year)
DELETE FROM security_logs WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '1 year';

-- Clean read notifications older than 3 months
DELETE FROM notifications 
WHERE is_read = TRUE 
AND created_at < CURRENT_TIMESTAMP - INTERVAL '3 months';
```

#### 2. Backup Strategy
```bash
# Daily backup
pg_dump -h localhost -U postgres -d pandamart > backup_$(date +%Y%m%d).sql

# Weekly full backup with compression
pg_dump -h localhost -U postgres -d pandamart | gzip > backup_weekly_$(date +%Y%m%d).sql.gz
```

### Environment Setup

#### 1. Development Environment
```bash
# Docker Compose for local development
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pandamart_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

#### 2. Production Considerations
- Use connection pooling (PgBouncer)
- Set up read replicas for analytics
- Implement proper monitoring (Prometheus + Grafana)
- Use SSL/TLS for all connections
- Regular security audits
- Automated backups to cloud storage