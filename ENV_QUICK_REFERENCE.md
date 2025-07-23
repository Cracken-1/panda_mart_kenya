# 🔧 Environment Variables Quick Reference

## 📋 Copy-Paste Ready Environment Variables

### 🟢 **DEVELOPMENT** (.env.local)
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/pandamart_kenya
NEXTAUTH_SECRET=wyI5iBVT9lBvWwb8MRTbGEJfzbzfMRK3EiaiVNjWI9Q=
JWT_ACCESS_SECRET=psBjSP1KBEgLkZDC7v0txRNzSC14VpnvAhIe+av8VP8=
JWT_REFRESH_SECRET=eb5oiyXvPJVwfHW970jG0BcKK4FPdzXzSEmVl5YD1xY=
JWT_RESET_SECRET=qd0GCGxIB4ydkuDO2uJb8EsSv/nF1uEP+cFIpV4gxqw=
```

### 🟡 **PREVIEW** (Vercel Dashboard)
```bash
NODE_ENV=preview
NEXT_PUBLIC_APP_URL=https://panda-mart-kenya-git-main-cracken-1.vercel.app
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
NEXTAUTH_SECRET=[generate-new-secret]
JWT_ACCESS_SECRET=[generate-new-secret]
JWT_REFRESH_SECRET=[generate-new-secret]
JWT_RESET_SECRET=[generate-new-secret]
```

### 🔴 **PRODUCTION** (Vercel Dashboard)
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://pandamart.co.ke
DATABASE_URL=postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
NEXTAUTH_SECRET=[generate-new-secret]
JWT_ACCESS_SECRET=[generate-new-secret]
JWT_REFRESH_SECRET=[generate-new-secret]
JWT_RESET_SECRET=[generate-new-secret]
```

## 🎯 Environment-Specific URLs

| Environment | URL Pattern | Example |
|-------------|-------------|---------|
| **Development** | `http://localhost:3000` | `http://localhost:3000` |
| **Preview** | `https://[project]-git-[branch]-[user].vercel.app` | `https://panda-mart-kenya-git-main-cracken-1.vercel.app` |
| **Production** | `https://[project].vercel.app` | `https://panda-mart-kenya.vercel.app` |

## 🗄️ Database Configuration

### **Development (Local PostgreSQL)**
```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=pandamart_kenya
DATABASE_USER=postgres
DATABASE_PASSWORD=your_local_password
DATABASE_SSL=false
```

### **Preview/Production (Supabase)**
```bash
DATABASE_HOST=db.[project-ref].supabase.co
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=your_supabase_password
DATABASE_SSL=true
```

## 📧 Email Configuration

### **Development/Preview (Gmail)**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@pandamart.co.ke
```

### **Production (Professional Email)**
```bash
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=noreply@pandamart.co.ke
SMTP_PASS=your-production-password
EMAIL_FROM=noreply@pandamart.co.ke
```

## 🔐 Generate New Secrets

```bash
# Run this command to generate new secrets
npm run generate:secrets --env

# Copy output to appropriate environment
```

## ✅ Verification Checklist

### **After Setting Environment Variables:**

#### Development
- [ ] `.env.local` file created
- [ ] `npm run dev` starts successfully
- [ ] `http://localhost:3000/api/health` returns 200
- [ ] Database connection works

#### Preview
- [ ] Environment variables added in Vercel
- [ ] Preview deployment successful
- [ ] Preview URL accessible
- [ ] API endpoints working

#### Production
- [ ] Environment variables added in Vercel
- [ ] Production deployment successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All functionality tested

## 🚨 Security Reminders

- ❌ **Never** commit `.env.local` to Git
- ❌ **Never** reuse secrets across environments
- ✅ **Always** use different databases for each environment
- ✅ **Always** generate unique secrets for production
- ✅ **Always** enable SSL for production databases

---

**Quick setup complete! Your environment variables are ready for deployment.** 🚀