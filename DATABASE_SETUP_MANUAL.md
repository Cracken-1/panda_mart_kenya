# Panda Mart Kenya - Database Setup Manual

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Database Architecture](#database-architecture)
3. [Prerequisites](#prerequisites)
4. [Installation Guide](#installation-guide)
5. [Core Tables](#core-tables)
6. [Supporting Tables](#supporting-tables)
7. [Security Implementation](#security-implementation)
8. [Indexes and Performance](#indexes-and-performance)
9. [Functions and Triggers](#functions-and-triggers)
10. [Initial Data Setup](#initial-data-setup)
11. [Testing and Validation](#testing-and-validation)
12. [Maintenance and Monitoring](#maintenance-and-monitoring)

---

## 🎯 Project Overview

**Panda Mart Kenya** is a comprehensive e-commerce platform designed to drive foot traffic to physical stores while providing online shopping capabilities. The platform combines traditional retail with modern digital experiences, featuring:

### Current Implementation Status
- ✅ **Frontend**: Complete React/Next.js application with responsive design
- ✅ **Authentication**: Email verification, password reset, 2FA ready
- ✅ **User Interface**: Account management, shopping cart, checkout flow
- ✅ **Store Integration**: Store locator, pickup/delivery options
- ✅ **Loyalty Program**: Points system, tier management, rewards
- ⚠️ **Database**: Schema designed, currently using mock data
- ⚠️ **Backend APIs**: Partial implementation, needs database integration

### What You're Building
This database will power a production-ready e-commerce platform that handles:
- **User Management**: Registration, authentication, profiles, preferences
- **Product Catalog**: Inventory management across multiple stores
- **Order Processing**: Shopping cart, checkout, payment processing
- **Loyalty Program**: Points earning, tier progression, reward redemption
- **Store Operations**: Multi-location inventory, pickup/delivery
- **Customer Support**: Ticketing system, feedback management
- **Analytics**: User behavior tracking, sales reporting

---

## 🏗️ Database Architecture

### Technology Stack
- **Database**: PostgreSQL 14+ (recommended)
- **Extensions**: uuid-ossp, pgcrypto, pg_trgm
- **Connection Pooling**: PgBouncer (recommended)
- **Backup Strategy**: Daily automated backups
- **Monitoring**: pg_stat_statements, custom metrics

### Design Principles
- **Security First**: Row-level security, encrypted sensitive data
- **Scalability**: Proper indexing, partitioning for large tables
- **Data Integrity**: Foreign key constraints, check constraints
- **Audit Trail**: Comprehensive logging and tracking
- **Performance**: Optimized queries, materialized views

---

## 📋 Prerequisites

### System Requirements
- PostgreSQL 14.0 or higher
- Minimum 4GB RAM (8GB recommended)
- 50GB+ storage space
- Ubuntu 20.04+ / CentOS 8+ / macOS 10.15+

### Required Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- Encryption functions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- Full-text search
```

### Environment Variables
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pandamart_kenya
DB_USER=pandamart_user
DB_PASSWORD=your_secure_password
DB_SSL=false
DB_MAX_CONNECTIONS=20
```

---

## 🚀 Installation Guide

### Step 1: PostgreSQL Installation

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### CentOS/RHEL
```bash
sudo dnf install postgresql postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Step 2: Database Setup
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE pandamart_kenya;
CREATE USER pandamart_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE pandamart_kenya TO pandamart_user;

# Connect to the database
\c pandamart_kenya

# Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### Step 3: Execute Schema
```bash
# Run the complete schema file
psql -U pandamart_user -d pandamart_kenya -f DATABASE_SCHEMA.sql
```

---

## 🗄️ Core Tables

### 1. Users Table
**Purpose**: Central user management and authentication
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    panda_id VARCHAR(20) UNIQUE NOT NULL,           -- Auto-generated: PND2401000001
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,            -- bcrypt hashed
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    tier VARCHAR(20) DEFAULT 'Bronze',              -- Bronze, Silver, Gold, Platinum, Diamond
    total_points INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    store_visits INTEGER DEFAULT 0,
    preferred_language VARCHAR(10) DEFAULT 'en',
    preferred_currency VARCHAR(5) DEFAULT 'KES',
    timezone VARCHAR(50) DEFAULT 'Africa/Nairobi',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Security Features**:
- Passwords hashed with bcrypt (12 rounds minimum)
- Email verification required
- Account lockout after failed attempts
- Session management with expiry

### 2. Products Table
**Purpose**: Product catalog management
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(100) UNIQUE NOT NULL,               -- Product SKU
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,              -- URL-friendly name
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),                   -- For discount calculations
    cost_price DECIMAL(12,2),                       -- For profit margins
    weight DECIMAL(8,3),                            -- In kilograms
    dimensions JSONB,                               -- {length, width, height}
    images TEXT[],                                  -- Array of image URLs
    features TEXT[],                                -- Product features
    specifications JSONB,                           -- Technical specs
    tags TEXT[],                                    -- Search tags
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    meta_title VARCHAR(255),                        -- SEO
    meta_description TEXT,                          -- SEO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Orders Table
**Purpose**: Order management and tracking
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,       -- Auto-generated: ORD20240115000001
    user_id UUID NOT NULL REFERENCES users(id),
    store_id UUID NOT NULL REFERENCES stores(id),
    status VARCHAR(50) DEFAULT 'pending',           -- pending, confirmed, processing, ready, completed, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending',   -- pending, paid, failed, refunded
    fulfillment_type VARCHAR(20) DEFAULT 'pickup',  -- pickup, delivery
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    delivery_fee DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'KES',
    notes TEXT,
    pickup_time TIMESTAMP,
    delivery_address JSONB,                         -- Full address object
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Stores Table
**Purpose**: Physical store locations and management
```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,               -- Store code: WG001, SC002
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),                        -- GPS coordinates
    longitude DECIMAL(11, 8),
    phone VARCHAR(20),
    email VARCHAR(255),
    opening_hours JSONB,                            -- Store hours by day
    services TEXT[],                                -- Available services
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Product Inventory Table
**Purpose**: Stock management per store
```sql
CREATE TABLE product_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,            -- Reserved for pending orders
    min_stock_level INTEGER DEFAULT 0,              -- Reorder threshold
    max_stock_level INTEGER DEFAULT 1000,
    last_restocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, store_id)
);
```

---

## 🔧 Supporting Tables

### Authentication & Security
- **`email_verification_tokens`**: Email verification process
- **`password_reset_tokens`**: Password reset functionality
- **`user_sessions`**: Session management and tracking
- **`user_2fa`**: Two-factor authentication settings
- **`auth_activity_log`**: Authentication event logging
- **`security_incidents`**: Security breach tracking

### Product Management
- **`categories`**: Product categorization hierarchy
- **`brands`**: Product brand information
- **`product_reviews`**: Customer product reviews
- **`product_views`**: Product view tracking

### Order Processing
- **`order_items`**: Individual items in orders
- **`order_status_history`**: Order status change tracking
- **`payments`**: Payment transaction records

### Loyalty & Rewards
- **`points_transactions`**: Points earning/spending history
- **`rewards`**: Available rewards catalog
- **`reward_redemptions`**: User reward redemptions
- **`coupons`**: Discount codes and promotions
- **`coupon_usage`**: Coupon usage tracking

### User Management
- **`cart_items`**: Shopping cart persistence
- **`wishlist_items`**: User wishlists
- **`user_addresses`**: Delivery addresses
- **`user_notification_preferences`**: Communication preferences
- **`user_privacy_settings`**: Privacy controls

### Communications
- **`notifications`**: In-app notifications
- **`email_templates`**: Email template management
- **`sms_templates`**: SMS template management
- **`email_log`**: Email delivery tracking
- **`sms_log`**: SMS delivery tracking

### Support & Analytics
- **`support_tickets`**: Customer support system
- **`ticket_responses`**: Support ticket conversations
- **`user_feedback`**: Customer feedback collection
- **`user_activity`**: User behavior tracking
- **`search_queries`**: Search analytics

---

## 🔒 Security Implementation

### 1. Row-Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY user_own_data ON users
    FOR ALL TO authenticated_user
    USING (id = current_user_id());

CREATE POLICY user_own_orders ON orders
    FOR ALL TO authenticated_user
    USING (user_id = current_user_id());
```

### 2. Data Encryption
```sql
-- Encrypt sensitive fields
CREATE OR REPLACE FUNCTION encrypt_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Encrypt phone numbers
    IF NEW.phone IS NOT NULL THEN
        NEW.phone = pgp_sym_encrypt(NEW.phone, current_setting('app.encryption_key'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. Audit Logging
```sql
-- Audit trigger for sensitive operations
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        table_name, operation, old_values, new_values, 
        user_id, timestamp
    ) VALUES (
        TG_TABLE_NAME, TG_OP, 
        row_to_json(OLD), row_to_json(NEW),
        current_user_id(), CURRENT_TIMESTAMP
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

### 4. Access Control
```sql
-- Create roles with specific permissions
CREATE ROLE app_user;
CREATE ROLE app_admin;
CREATE ROLE app_readonly;

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON users TO app_user;
GRANT ALL PRIVILEGES ON ALL TABLES TO app_admin;
GRANT SELECT ON ALL TABLES TO app_readonly;
```

---

## ⚡ Indexes and Performance

### Primary Indexes
```sql
-- User-related indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_panda_id ON users(panda_id);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_tier ON users(tier);

-- Product indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Order indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Inventory indexes
CREATE INDEX idx_inventory_product_store ON product_inventory(product_id, store_id);
CREATE INDEX idx_inventory_quantity ON product_inventory(quantity);
```

### Full-Text Search
```sql
-- Enable full-text search on products
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
CREATE INDEX idx_products_description_trgm ON products USING gin (description gin_trgm_ops);

-- Search function
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE(product_id UUID, relevance REAL) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, 
           similarity(p.name, search_term) + similarity(p.description, search_term) as relevance
    FROM products p
    WHERE p.name % search_term OR p.description % search_term
    ORDER BY relevance DESC;
END;
$$ LANGUAGE plpgsql;
```

---

## ⚙️ Functions and Triggers

### 1. Automatic ID Generation
```sql
-- Generate Panda IDs for users
CREATE OR REPLACE FUNCTION generate_panda_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.panda_id = 'PND' || TO_CHAR(CURRENT_DATE, 'YYMM') || 
                   LPAD(NEXTVAL('panda_id_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE panda_id_seq START 1;
CREATE TRIGGER generate_user_panda_id BEFORE INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION generate_panda_id();
```

### 2. Inventory Management
```sql
-- Update inventory when order is placed
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE product_inventory
    SET reserved_quantity = reserved_quantity + NEW.quantity
    WHERE product_id = NEW.product_id
    AND store_id = (SELECT store_id FROM orders WHERE id = NEW.order_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_item_inventory_update AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION update_inventory_on_order();
```

### 3. Loyalty Points System
```sql
-- Update user points and tier automatically
CREATE OR REPLACE FUNCTION update_user_points()
RETURNS TRIGGER AS $$
DECLARE
    user_total_points INTEGER;
    new_tier VARCHAR(20);
BEGIN
    -- Calculate total points
    SELECT COALESCE(SUM(CASE WHEN type IN ('earned', 'bonus') THEN points ELSE -points END), 0)
    INTO user_total_points
    FROM points_transactions
    WHERE user_id = NEW.user_id;
    
    -- Determine tier
    IF user_total_points >= 25000 THEN new_tier := 'Diamond';
    ELSIF user_total_points >= 10000 THEN new_tier := 'Platinum';
    ELSIF user_total_points >= 5000 THEN new_tier := 'Gold';
    ELSIF user_total_points >= 1000 THEN new_tier := 'Silver';
    ELSE new_tier := 'Bronze';
    END IF;
    
    -- Update user
    UPDATE users
    SET total_points = user_total_points, tier = new_tier
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_points_trigger AFTER INSERT ON points_transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_points();
```

---

## 📊 Initial Data Setup

### 1. Categories
```sql
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories', 1),
('Furniture', 'furniture', 'Home and office furniture', 2),
('Homeware', 'homeware', 'Kitchen and household items', 3),
('Beauty & Health', 'beauty-health', 'Personal care and health products', 4),
('Fashion', 'fashion', 'Clothing and accessories', 5),
('Sports & Outdoors', 'sports-outdoors', 'Sports equipment and outdoor gear', 6);
```

### 2. Sample Stores
```sql
INSERT INTO stores (name, code, address, city, county, phone, opening_hours) VALUES
('Westgate Mall', 'WG001', 'Westgate Mall, Westlands', 'Nairobi', 'Nairobi', '+254700000001',
 '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "09:00-21:00", "sunday": "10:00-20:00"}'),
('Sarit Centre', 'SC002', 'Sarit Centre, Westlands', 'Nairobi', 'Nairobi', '+254700000002',
 '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "09:00-21:00", "sunday": "10:00-20:00"}');
```

### 3. Email Templates
```sql
INSERT INTO email_templates (name, subject, body, variables) VALUES
('welcome_email', 'Welcome to Panda Mart Kenya!', 
 '<h1>Welcome {{name}}!</h1><p>Your Panda ID: {{panda_id}}</p><p>Start shopping and earning points today!</p>',
 '{"name": "User name", "panda_id": "User Panda ID"}'),
('order_confirmation', 'Order Confirmation - {{order_number}}',
 '<h1>Order Confirmed!</h1><p>Thank you for your order {{order_number}}.</p><p>Total: {{total_amount}}</p>',
 '{"order_number": "Order number", "total_amount": "Order total"}');
```

---

## 🧪 Testing and Validation

### 1. Data Integrity Tests
```sql
-- Test user creation
INSERT INTO users (email, password_hash, first_name, last_name) 
VALUES ('test@example.com', '$2b$12$hash', 'Test', 'User');

-- Verify Panda ID generation
SELECT panda_id FROM users WHERE email = 'test@example.com';

-- Test order creation
INSERT INTO orders (user_id, store_id, subtotal, total_amount)
SELECT u.id, s.id, 1000.00, 1000.00
FROM users u, stores s
WHERE u.email = 'test@example.com' AND s.code = 'WG001'
LIMIT 1;
```

### 2. Performance Tests
```sql
-- Test product search performance
EXPLAIN ANALYZE SELECT * FROM products WHERE name ILIKE '%laptop%';

-- Test order query performance
EXPLAIN ANALYZE 
SELECT o.*, u.first_name, s.name as store_name
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN stores s ON o.store_id = s.id
WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days';
```

### 3. Security Tests
```sql
-- Test RLS policies
SET ROLE app_user;
SELECT * FROM users; -- Should only return current user's data

-- Test encryption
SELECT pgp_sym_decrypt(phone, current_setting('app.encryption_key')) 
FROM users WHERE id = current_user_id();
```

---

## 🔧 Maintenance and Monitoring

### 1. Regular Maintenance Tasks
```sql
-- Weekly vacuum and analyze
VACUUM ANALYZE;

-- Reindex for performance
REINDEX DATABASE pandamart_kenya;

-- Clean up expired tokens
DELETE FROM email_verification_tokens WHERE expires_at < NOW();
DELETE FROM password_reset_tokens WHERE expires_at < NOW();
```

### 2. Monitoring Queries
```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('pandamart_kenya'));

-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;

-- Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 3. Backup Strategy
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U pandamart_user -h localhost pandamart_kenya > backup_$DATE.sql
gzip backup_$DATE.sql

# Keep only last 7 days of backups
find /backup/path -name "backup_*.sql.gz" -mtime +7 -delete
```

---

## 📞 Support and Troubleshooting

### Common Issues

1. **Connection Issues**
   - Check PostgreSQL service status
   - Verify connection parameters
   - Check firewall settings

2. **Performance Issues**
   - Run VACUUM ANALYZE
   - Check for missing indexes
   - Monitor query performance

3. **Data Integrity Issues**
   - Check foreign key constraints
   - Verify trigger functionality
   - Review audit logs

### Getting Help
- Check PostgreSQL logs: `/var/log/postgresql/`
- Monitor system resources: `htop`, `iotop`
- Database metrics: `pg_stat_activity`, `pg_stat_statements`

---

## 🎯 Next Steps

After completing the database setup:

1. **API Integration**: Connect the Next.js application to the database
2. **Authentication**: Implement JWT token management
3. **Payment Gateway**: Integrate M-Pesa and card payments
4. **Email Service**: Configure SMTP for notifications
5. **File Storage**: Set up image/file upload handling
6. **Monitoring**: Implement application monitoring
7. **Testing**: Comprehensive testing of all features
8. **Deployment**: Production deployment configuration

---

**Database Version**: 1.0.0  
**Last Updated**: January 2024  
**Compatibility**: PostgreSQL 14+  
**Estimated Setup Time**: 2-4 hours  

For technical support or questions about this setup, please refer to the project documentation or contact the development team.