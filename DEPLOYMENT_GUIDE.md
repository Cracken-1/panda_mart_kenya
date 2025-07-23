# Panda Mart Kenya - Complete Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Panda Mart Kenya e-commerce platform with the complete database schema and authentication system.

## Prerequisites

### System Requirements
- Node.js 18.0.0 or higher
- PostgreSQL 13+ with required extensions
- Redis server (for caching and sessions)
- SMTP service for email delivery
- SSL certificate for production

### Required Services
- Database hosting (PostgreSQL)
- Email service (SendGrid, AWS SES, or SMTP)
- File storage (Cloudinary, AWS S3)
- Domain and SSL certificate

## Step 1: Environment Setup

### 1.1 Clone and Install Dependencies

```bash
git clone <repository-url>
cd panda-mart-kenya
npm install
```

### 1.2 Environment Configuration

Copy the environment template and configure:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```bash
# Essential Configuration
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# Database
DB_HOST="your-db-host"
DB_NAME="pandamart_prod"
DB_USER="your-db-user"
DB_PASSWORD="your-secure-password"

# Email Service
SMTP_HOST="smtp.sendgrid.net"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"

# Security
NEXTAUTH_SECRET="your-very-long-random-secret"
JWT_ACCESS_SECRET="your-jwt-secret"
ENCRYPTION_KEY="your-32-character-key"
```

## Step 2: Database Setup

### 2.1 Create Database

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE pandamart_prod;
CREATE USER pandamart_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE pandamart_prod TO pandamart_user;
```

### 2.2 Install Required Extensions

```sql
-- Connect to your database
\c pandamart_prod

-- Install required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### 2.3 Run Database Schema

```bash
# Method 1: Using npm script
npm run db:setup

# Method 2: Direct psql command
psql -h your-host -U pandamart_user -d pandamart_prod -f DATABASE_SCHEMA.sql
```

### 2.4 Verify Database Setup

```sql
-- Check tables were created
\dt

-- Verify extensions
\dx

-- Test sample queries
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM email_templates;
```

## Step 3: Security Configuration

### 3.1 Database Security

```sql
-- Create application role with limited permissions
CREATE ROLE app_role;
GRANT CONNECT ON DATABASE pandamart_prod TO app_role;
GRANT USAGE ON SCHEMA public TO app_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_role;

-- Grant role to application user
GRANT app_role TO pandamart_user;
```

### 3.2 SSL Configuration

Ensure your database connection uses SSL:

```bash
# In .env.local
DB_SSL="true"
```

### 3.3 Rate Limiting Setup

Configure rate limiting for authentication endpoints:

```bash
# In .env.local
RATE_LIMIT_MAX_REQUESTS="100"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_LOGIN_MAX="5"
RATE_LIMIT_LOGIN_WINDOW="900000"
```

## Step 4: Email Service Setup

### 4.1 SendGrid Configuration

1. Create SendGrid account
2. Generate API key
3. Configure sender authentication
4. Add configuration to environment:

```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM="noreply@yourdomain.com"
```

### 4.2 Email Templates

The system includes default email templates:
- Welcome email
- Email verification
- Password reset
- Order confirmation

Templates are automatically created during database setup.

### 4.3 Test Email Configuration

```bash
# Create a test script to verify email setup
node -e "
const { emailService } = require('./lib/services/emailService');
emailService.sendEmail({
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<h1>Email service is working!</h1>'
}).then(result => console.log('Email test result:', result));
"
```

## Step 5: Application Build and Deployment

### 5.1 Build Application

```bash
# Install dependencies
npm ci --production=false

# Type check
npm run type-check

# Build application
npm run build
```

### 5.2 Production Deployment Options

#### Option A: Traditional Server Deployment

```bash
# Start production server
npm start

# Or with PM2 for process management
npm install -g pm2
pm2 start npm --name "panda-mart" -- start
pm2 save
pm2 startup
```

#### Option B: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t panda-mart-kenya .
docker run -p 3000:3000 --env-file .env.local panda-mart-kenya
```

#### Option C: Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## Step 6: Post-Deployment Configuration

### 6.1 Create Admin User

```sql
-- Create initial admin user
INSERT INTO users (
    email, phone, password_hash, first_name, last_name, 
    is_verified, email_verified_at, tier
) VALUES (
    'admin@yourdomain.com',
    '+254700000000',
    crypt('your-admin-password', gen_salt('bf', 12)),
    'Admin',
    'User',
    TRUE,
    CURRENT_TIMESTAMP,
    'Diamond'
);
```

### 6.2 Configure Default Settings

```sql
-- Insert default stores
INSERT INTO stores (name, code, address, city, county, phone, email, is_active) VALUES
('Nairobi Central', 'NBO001', 'CBD, Nairobi', 'Nairobi', 'Nairobi', '+254700000001', 'nairobi@yourdomain.com', TRUE),
('Westlands Branch', 'NBO002', 'Westlands, Nairobi', 'Nairobi', 'Nairobi', '+254700000002', 'westlands@yourdomain.com', TRUE);

-- Insert sample categories
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories', 1, TRUE),
('Groceries', 'groceries', 'Food and household items', 2, TRUE),
('Fashion', 'fashion', 'Clothing and accessories', 3, TRUE);
```

### 6.3 SSL Certificate Setup

For production, ensure SSL is properly configured:

```bash
# Using Let's Encrypt with Certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 6.4 Monitoring Setup

Configure monitoring and logging:

```bash
# In .env.local
LOG_LEVEL="info"
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-public-sentry-dsn"
```

## Step 7: Testing and Verification

### 7.1 Health Checks

Test critical endpoints:

```bash
# Database health
curl https://yourdomain.com/api/health/database

# Email service health
curl https://yourdomain.com/api/health/email

# Application health
curl https://yourdomain.com/api/health
```

### 7.2 Authentication Flow Testing

1. **User Registration**
   - Register new user
   - Verify email verification email is sent
   - Complete email verification

2. **Password Reset**
   - Request password reset
   - Verify reset email is sent
   - Complete password reset process

3. **Login Security**
   - Test rate limiting
   - Verify session management
   - Test logout functionality

### 7.3 Database Performance

```sql
-- Check database performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 'some-uuid';

-- Verify indexes are being used
SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch 
FROM pg_stat_user_indexes 
ORDER BY idx_tup_read DESC;
```

## Step 8: Backup and Maintenance

### 8.1 Database Backup

```bash
# Create backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/pandamart_$DATE.sql"

pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE
gzip $BACKUP_FILE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "pandamart_*.sql.gz" -mtime +30 -delete
```

### 8.2 Automated Maintenance

Create cron jobs for maintenance:

```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
0 3 * * * /usr/bin/node /path/to/app/scripts/cleanup-expired-tokens.js
0 4 * * 0 /usr/bin/node /path/to/app/scripts/weekly-maintenance.js
```

### 8.3 Log Rotation

Configure log rotation:

```bash
# /etc/logrotate.d/panda-mart
/var/log/panda-mart/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload panda-mart
    endscript
}
```

## Step 9: Security Hardening

### 9.1 Server Security

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

### 9.2 Application Security

```bash
# In .env.local - Security headers
SECURITY_HEADERS="true"
CSRF_PROTECTION="true"
RATE_LIMITING="true"

# Content Security Policy
CSP_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
```

### 9.3 Database Security

```sql
-- Regular security audit
SELECT usename, valuntil FROM pg_user WHERE valuntil < NOW();
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Monitor failed login attempts
SELECT * FROM auth_activity_log WHERE success = FALSE AND created_at > NOW() - INTERVAL '24 hours';
```

## Step 10: Performance Optimization

### 10.1 Database Optimization

```sql
-- Update table statistics
ANALYZE;

-- Check slow queries
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Optimize frequently accessed tables
VACUUM ANALYZE users;
VACUUM ANALYZE products;
VACUUM ANALYZE orders;
```

### 10.2 Application Optimization

```bash
# Enable compression
# In next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false
}
```

### 10.3 CDN Configuration

Configure CDN for static assets:

```bash
# In .env.local
NEXT_PUBLIC_CDN_URL="https://cdn.yourdomain.com"
NEXT_PUBLIC_IMAGE_DOMAIN="images.yourdomain.com"
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check connection
   psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT NOW();"
   ```

2. **Email Delivery Issues**
   ```bash
   # Test SMTP connection
   telnet smtp.sendgrid.net 587
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate
   openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
   ```

4. **Performance Issues**
   ```sql
   -- Check database locks
   SELECT * FROM pg_locks WHERE NOT granted;
   
   -- Check connection count
   SELECT count(*) FROM pg_stat_activity;
   ```

## Support and Maintenance

### Regular Maintenance Tasks

1. **Daily**
   - Monitor error logs
   - Check system resources
   - Verify backup completion

2. **Weekly**
   - Review security logs
   - Update dependencies
   - Performance analysis

3. **Monthly**
   - Security audit
   - Database maintenance
   - Backup testing

### Emergency Procedures

1. **Database Recovery**
   ```bash
   # Restore from backup
   psql -h $DB_HOST -U $DB_USER -d $DB_NAME < backup_file.sql
   ```

2. **Application Rollback**
   ```bash
   # Using PM2
   pm2 stop panda-mart
   git checkout previous-stable-tag
   npm run build
   pm2 start panda-mart
   ```

This comprehensive deployment guide ensures a secure, scalable, and maintainable deployment of the Panda Mart Kenya platform with full database and authentication functionality.