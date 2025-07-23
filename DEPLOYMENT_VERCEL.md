# 🚀 Vercel Deployment Guide - Panda Mart Kenya

This guide will help you deploy Panda Mart Kenya to Vercel with Supabase as the database.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Supabase account (free tier available)
- Domain name (optional, Vercel provides free subdomain)

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose organization and fill details:
   - **Name**: `panda-mart-kenya`
   - **Database Password**: Generate strong password
   - **Region**: Choose closest to your users
5. Wait for project creation (~2 minutes)

### 2. Setup Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy contents from `database-schema.sql`
4. Click **Run** to execute schema
5. Verify tables are created in **Table Editor**

### 3. Get Database Credentials
1. Go to **Settings** → **Database**
2. Copy connection details:
   ```
   Host: db.[project-ref].supabase.co
   Database name: postgres
   Port: 5432
   User: postgres
   Password: [your-password]
   ```
3. Copy the **Connection String** (URI format)

## 🚀 Vercel Deployment

### 1. Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Panda Mart Kenya"

# Add remote repository
git remote add origin git@github.com:Cracken-1/panda_mart_kenya.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **New Project**
4. Import `panda_mart_kenya` repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3. Environment Variables
In Vercel project settings, add these environment variables:

#### **Required Variables**
```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DATABASE_HOST=db.[project-ref].supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=your_supabase_password
DATABASE_SSL=true
DATABASE_MAX_CONNECTIONS=10

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-generated-secret-32-chars
JWT_ACCESS_SECRET=your-generated-secret-32-chars
JWT_REFRESH_SECRET=your-generated-secret-32-chars
JWT_RESET_SECRET=your-generated-secret-32-chars
```

#### **Generate Secrets**
Use this command to generate secure secrets:
```bash
openssl rand -base64 32
```

#### **Email Configuration (Optional)**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@pandamart.co.ke
```

### 4. Deploy
1. Click **Deploy**
2. Wait for build completion (~2-3 minutes)
3. Visit your deployed site: `https://your-project.vercel.app`

## 🔧 Post-Deployment Setup

### 1. Test API Health
Visit: `https://your-project.vercel.app/api/health`

Expected response:
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Test Database Connection
Visit: `https://your-project.vercel.app/api/health/database`

### 3. Create Test User
Use the registration endpoint or frontend to create a test user.

## 🌐 Custom Domain (Optional)

### 1. Add Domain in Vercel
1. Go to **Settings** → **Domains**
2. Add your domain: `pandamart.co.ke`
3. Configure DNS records as shown

### 2. Update Environment Variables
```bash
NEXT_PUBLIC_APP_URL=https://pandamart.co.ke
```

## 📊 Monitoring & Analytics

### 1. Vercel Analytics
- Enable in **Settings** → **Analytics**
- View performance metrics

### 2. Supabase Monitoring
- Monitor database performance
- View API usage
- Check logs

## 🔒 Security Checklist

- [ ] Strong database password
- [ ] Secure JWT secrets (32+ characters)
- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] Database SSL enabled
- [ ] Rate limiting configured
- [ ] CORS properly configured

## 🚨 Troubleshooting

### Common Issues

#### **Build Failures**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
npm run build  # Test locally first
npm run type-check  # Fix TypeScript errors
```

#### **Database Connection Issues**
```bash
# Verify connection string format
# Check Supabase project status
# Ensure SSL is enabled for production
```

#### **Environment Variable Issues**
```bash
# Ensure all required variables are set
# Check for typos in variable names
# Verify secrets are properly generated
```

#### **API Route Errors**
```bash
# Check function logs in Vercel
# Verify database schema is applied
# Test API endpoints individually
```

## 📈 Performance Optimization

### 1. Database Optimization
- Enable connection pooling
- Add database indexes
- Monitor query performance

### 2. Vercel Optimization
- Enable Edge Functions for static content
- Configure caching headers
- Optimize images with Next.js Image component

### 3. Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Track user analytics

## 🔄 Continuous Deployment

### Automatic Deployments
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from feature branches
- **Development**: Local development server

### Deployment Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git commit -am "Add new feature"
git push origin feature/new-feature
# Creates preview deployment

# Production release
git checkout main
git merge feature/new-feature
git push origin main
# Triggers production deployment
```

## 📞 Support

### Resources
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

### Getting Help
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Project Issues**: [GitHub Issues](https://github.com/Cracken-1/panda_mart_kenya/issues)

---

## 🎉 Deployment Complete!

Your Panda Mart Kenya application is now live on Vercel! 

**Next Steps:**
1. Test all functionality
2. Set up monitoring
3. Configure custom domain
4. Add SSL certificate
5. Set up backup strategy

**Live URLs:**
- **Production**: `https://your-project.vercel.app`
- **API Health**: `https://your-project.vercel.app/api/health`
- **Admin Panel**: `https://your-project.vercel.app/admin`

---

*Happy deploying! 🚀*