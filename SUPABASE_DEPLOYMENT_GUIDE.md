# Supabase Deployment Guide for Panda Mart Kenya

This guide helps you configure Supabase as your production database for Vercel deployment.

## 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Set project name: `panda-mart-kenya-prod`
5. Set database password (save this securely)
6. Choose region closest to your users (e.g., `eu-west-1` for Europe)
7. Click "Create new project"

## 2. Get Database Connection Details

After project creation, go to Settings > Database:

```
Host: db.[your-project-ref].supabase.co
Database name: postgres
Port: 5432
User: postgres
Password: [your-database-password]
```

Your connection string will be:
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

## 3. Configure Vercel Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables:
```bash
# Database (Primary - Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Authentication Secrets (Generate new ones!)
NEXTAUTH_SECRET=[generate-32-char-secret]
JWT_ACCESS_SECRET=[generate-32-char-secret]
JWT_REFRESH_SECRET=[generate-32-char-secret]
JWT_RESET_SECRET=[generate-32-char-secret]
```

### Optional Variables:
```bash
# Email (if using SMTP)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
EMAIL_FROM=noreply@pandamart.co.ke

# Payment Integration
MPESA_CONSUMER_KEY=your-mpesa-key
MPESA_CONSUMER_SECRET=your-mpesa-secret
STRIPE_SECRET_KEY=sk_live_your-stripe-key

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 4. Set Up Database Schema

1. In Supabase Dashboard, go to SQL Editor
2. Run the database schema from `DATABASE_SCHEMA_CLEAN.sql`
3. Or use the Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref [your-project-ref]

# Run migrations
supabase db push
```

## 5. Configure Database Security

### Row Level Security (RLS)
Enable RLS for all tables in Supabase Dashboard:

```sql
-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Add similar policies for other tables
```

### Database Roles
Supabase automatically creates roles. For production:
- Use `postgres` role for application connections
- Create service roles for specific operations if needed

## 6. Environment-Specific Configuration

### Development
```bash
DATABASE_URL=postgresql://postgres:[dev-password]@db.[dev-ref].supabase.co:5432/postgres
```

### Staging/Preview
```bash
DATABASE_URL=postgresql://postgres:[staging-password]@db.[staging-ref].supabase.co:5432/postgres
```

### Production
```bash
DATABASE_URL=postgresql://postgres:[prod-password]@db.[prod-ref].supabase.co:5432/postgres
```

## 7. Backup and Monitoring

### Automated Backups
Supabase Pro includes automated daily backups. For free tier:
- Set up manual backup scripts
- Use `pg_dump` for regular exports

### Monitoring
- Monitor database performance in Supabase Dashboard
- Set up alerts for connection limits
- Monitor query performance

## 8. Connection Pooling

Supabase includes connection pooling by default:
- Session mode: Direct connections
- Transaction mode: Pooled connections (recommended for serverless)

For Vercel (serverless), use transaction mode:
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true
```

## 9. SSL Configuration

Supabase enforces SSL by default. Your connection string automatically uses SSL.

## 10. Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Check if DATABASE_URL is set correctly
   - Verify Supabase project is active
   - Check IP restrictions in Supabase settings

2. **SSL Errors**
   - Supabase requires SSL in production
   - Ensure `ssl: { rejectUnauthorized: false }` in connection config

3. **Connection Limits**
   - Free tier: 60 connections
   - Pro tier: 200+ connections
   - Use connection pooling for serverless

4. **Build Errors**
   - Ensure DATABASE_URL is set in Vercel environment
   - Database queries are skipped during build if no DATABASE_URL

### Verification Commands:

```bash
# Test connection locally
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Test from Node.js
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

## 11. Security Best Practices

1. **Use Environment Variables**: Never hardcode credentials
2. **Rotate Passwords**: Change database passwords regularly
3. **Enable RLS**: Use Row Level Security for data protection
4. **Monitor Access**: Review connection logs regularly
5. **Backup Regularly**: Ensure data recovery capabilities
6. **Use SSL**: Always encrypt connections in production

## 12. Cost Optimization

1. **Connection Pooling**: Reduces connection overhead
2. **Query Optimization**: Use indexes and efficient queries
3. **Data Archiving**: Move old data to cheaper storage
4. **Monitor Usage**: Track database size and connections

---

## Quick Setup Checklist

- [ ] Create Supabase project
- [ ] Get DATABASE_URL connection string
- [ ] Set DATABASE_URL in Vercel environment variables
- [ ] Set NODE_ENV=production in Vercel
- [ ] Generate and set authentication secrets
- [ ] Run database schema setup
- [ ] Enable Row Level Security
- [ ] Test deployment
- [ ] Set up monitoring and backups

Your Panda Mart Kenya application is now configured to use Supabase as the production database!