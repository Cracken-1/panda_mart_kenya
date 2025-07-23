# 🔧 Vercel Environment Variables Setup Guide

This guide explains how to configure environment variables for different Vercel environments (Development, Preview, Production).

## 🎯 Environment Types in Vercel

### 1. **Development** 
- Local development server (`npm run dev`)
- Uses `.env.local` file
- Database: Local PostgreSQL or development Supabase

### 2. **Preview** 
- Automatic deployments from feature branches
- Each branch gets its own URL
- Database: Staging/development database
- URL format: `https://panda-mart-kenya-git-[branch]-[username].vercel.app`

### 3. **Production**
- Deployments from main/master branch
- Your live application
- Database: Production database
- URL: `https://panda-mart-kenya.vercel.app` or custom domain

## 🔐 Environment Variables by Environment

### 🟢 **DEVELOPMENT** (Local)
Use the provided `.env.local` file for local development.

### 🟡 **PREVIEW** (Staging)
Set these in Vercel Dashboard → Settings → Environment Variables → Preview:

```bash
# Core Settings
NODE_ENV=preview
NEXT_PUBLIC_APP_URL=https://panda-mart-kenya-git-main-cracken-1.vercel.app

# Database (Staging Supabase Project)
DATABASE_URL=postgresql://postgres:[staging-password]@db.[staging-ref].supabase.co:5432/postgres
DATABASE_HOST=db.[staging-ref].supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=[staging-supabase-password]
DATABASE_SSL=true
DATABASE_MAX_CONNECTIONS=5

# Authentication Secrets (Preview-specific)
NEXTAUTH_SECRET=[generate-new-32-char-secret-for-preview]
JWT_ACCESS_SECRET=[generate-new-32-char-secret-for-preview]
JWT_REFRESH_SECRET=[generate-new-32-char-secret-for-preview]
JWT_RESET_SECRET=[generate-new-32-char-secret-for-preview]

# Email (Development/Testing)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=[your-test-email@gmail.com]
SMTP_PASS=[your-gmail-app-password]
EMAIL_FROM=noreply-staging@pandamart.co.ke

# Payment (Sandbox/Test)
MPESA_ENVIRONMENT=sandbox
STRIPE_SECRET_KEY=sk_test_[your-test-key]
```

### 🔴 **PRODUCTION** (Live)
Set these in Vercel Dashboard → Settings → Environment Variables → Production:

```bash
# Core Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://pandamart.co.ke

# Database (Production Supabase Project)
DATABASE_URL=postgresql://postgres:[prod-password]@db.[prod-ref].supabase.co:5432/postgres
DATABASE_HOST=db.[prod-ref].supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=[production-supabase-password]
DATABASE_SSL=true
DATABASE_MAX_CONNECTIONS=10

# Authentication Secrets (Production-specific - NEVER reuse from other environments)
NEXTAUTH_SECRET=[generate-new-32-char-secret-for-production]
JWT_ACCESS_SECRET=[generate-new-32-char-secret-for-production]
JWT_REFRESH_SECRET=[generate-new-32-char-secret-for-production]
JWT_RESET_SECRET=[generate-new-32-char-secret-for-production]

# Email (Production Service)
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=noreply@pandamart.co.ke
SMTP_PASS=[your-production-email-password]
EMAIL_FROM=noreply@pandamart.co.ke

# Payment (Live Credentials)
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=[your-live-mpesa-key]
MPESA_CONSUMER_SECRET=[your-live-mpesa-secret]
STRIPE_SECRET_KEY=sk_live_[your-live-key]

# Analytics & Monitoring
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-[your-ga-id]
SENTRY_DSN=https://[your-sentry-dsn]@sentry.io/[project-id]
```

## 🚀 Step-by-Step Vercel Setup

### 1. **Access Environment Variables**
1. Go to [vercel.com](https://vercel.com)
2. Select your `panda-mart-kenya` project
3. Go to **Settings** → **Environment Variables**

### 2. **Add Variables by Environment**

#### For Each Variable:
1. **Key**: Variable name (e.g., `DATABASE_URL`)
2. **Value**: Variable value (e.g., `postgresql://...`)
3. **Environments**: Select appropriate environment(s)
   - ✅ **Development** (for local development)
   - ✅ **Preview** (for branch deployments)
   - ✅ **Production** (for main branch)

### 3. **Required Variables for Each Environment**

#### **Minimum Required (All Environments)**
```bash
NODE_ENV
NEXT_PUBLIC_APP_URL
DATABASE_URL
NEXTAUTH_SECRET
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_RESET_SECRET
```

#### **Optional but Recommended**
```bash
SMTP_HOST
SMTP_USER
SMTP_PASS
EMAIL_FROM
```

#### **Production Only**
```bash
SENTRY_DSN
NEXT_PUBLIC_GA_MEASUREMENT_ID
```

## 🔒 Security Best Practices

### 1. **Separate Secrets by Environment**
- ❌ **Never** reuse secrets across environments
- ✅ Generate unique secrets for each environment
- ✅ Use `npm run generate:secrets` for each environment

### 2. **Database Separation**
- **Development**: Local PostgreSQL or dev Supabase
- **Preview**: Staging Supabase project
- **Production**: Production Supabase project

### 3. **Secret Management**
```bash
# Generate secrets for each environment
npm run generate:secrets

# Copy different secrets to each environment
# Development → .env.local
# Preview → Vercel Preview Environment Variables
# Production → Vercel Production Environment Variables
```

### 4. **Access Control**
- Limit team access to production environment variables
- Use Vercel team permissions
- Regularly rotate secrets (every 90 days)

## 📊 Environment Variable Checklist

### ✅ **Development Setup**
- [ ] `.env.local` file created with all variables
- [ ] Local database configured
- [ ] Secrets generated and added
- [ ] Email configuration tested (optional)

### ✅ **Preview Setup**
- [ ] Preview environment variables added in Vercel
- [ ] Staging database configured
- [ ] Unique secrets generated for preview
- [ ] Preview deployment tested

### ✅ **Production Setup**
- [ ] Production environment variables added in Vercel
- [ ] Production database configured
- [ ] Unique secrets generated for production
- [ ] Custom domain configured (optional)
- [ ] SSL certificate verified
- [ ] Production deployment tested

## 🔧 Quick Setup Commands

### Generate Secrets for Each Environment
```bash
# For Development (.env.local)
npm run generate:secrets --env > dev-secrets.txt

# For Preview (copy to Vercel)
npm run generate:secrets --env > preview-secrets.txt

# For Production (copy to Vercel)
npm run generate:secrets --env > production-secrets.txt
```

### Test Environment Configuration
```bash
# Test local development
npm run dev

# Test API health
curl http://localhost:3000/api/health

# Run comprehensive tests
npm run test
```

## 🚨 Troubleshooting

### Common Issues

#### **Database Connection Errors**
```bash
# Check DATABASE_URL format
# Ensure SSL is enabled for production
# Verify Supabase project is active
```

#### **Authentication Errors**
```bash
# Ensure all JWT secrets are set
# Check secret length (should be 32+ characters)
# Verify NEXTAUTH_SECRET is set
```

#### **Build Failures**
```bash
# Check all required environment variables are set
# Verify no typos in variable names
# Ensure NODE_ENV is set correctly
```

## 📞 Support

### Resources
- **Vercel Docs**: [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- **Supabase Docs**: [Database Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)
- **Next.js Docs**: [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### Getting Help
- Check Vercel Function logs for errors
- Verify environment variables in Vercel dashboard
- Test API endpoints after deployment
- Monitor application performance

---

## 🎉 Environment Setup Complete!

Once all environment variables are configured:

1. **Deploy to Preview** - Test with staging data
2. **Deploy to Production** - Go live with production data
3. **Monitor Performance** - Watch logs and metrics
4. **Scale as Needed** - Adjust resources based on usage

**Your Panda Mart Kenya platform is ready for all environments!** 🚀

---

*Environment configuration completed - Ready for deployment! 🐼🛍️*