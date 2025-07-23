# 🚀 Panda Mart Kenya - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Panda Mart Kenya platform to various hosting providers and environments.

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Tests passing (if implemented)
- [ ] Security audit completed
- [ ] Performance optimization done

### Environment Setup
- [ ] Production environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates obtained
- [ ] Domain DNS configured
- [ ] CDN setup (if using)

### Security
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Authentication system tested
- [ ] Payment integration secured
- [ ] Audit logging enabled

## 🌐 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest and most optimized platform for Next.js applications.

#### Steps:
1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Environment Variables**
   ```env
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-domain.com
   MPESA_CONSUMER_KEY=your-production-mpesa-key
   MPESA_CONSUMER_SECRET=your-production-mpesa-secret
   DATABASE_URL=your-production-database-url
   ```

4. **Custom Domain**
   - Add your domain in Vercel dashboard
   - Update DNS records as instructed
   - SSL certificate is automatically provisioned

#### Vercel Configuration (`vercel.json`)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 2. Netlify

Alternative static site hosting with serverless functions.

#### Steps:
1. **Build Configuration**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Set environment variables
   - Deploy

### 3. AWS Amplify

Full-stack deployment with AWS services integration.

#### Steps:
1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Project**
   ```bash
   amplify init
   amplify add hosting
   amplify publish
   ```

3. **Configuration**
   ```yaml
   # amplify.yml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

### 4. Docker Deployment

For containerized deployments on any platform.

#### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - redis
      - postgres

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pandamart
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 5. Traditional VPS/Server

For self-hosted deployments on Ubuntu/CentOS servers.

#### Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Install SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
```

#### Application Deployment
```bash
# Clone repository
git clone https://github.com/your-username/panda-mart-kenya.git
cd panda-mart-kenya

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "panda-mart" -- start
pm2 startup
pm2 save
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/pandamart
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Environment Configuration

### Production Environment Variables
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Security
NEXTAUTH_SECRET=your-super-secure-secret-key-32-chars-min
JWT_SECRET=your-jwt-secret-key-32-chars-min

# Database
DATABASE_URL=postgresql://user:password@host:5432/pandamart
REDIS_URL=redis://localhost:6379

# Payment
MPESA_CONSUMER_KEY=your-production-mpesa-key
MPESA_CONSUMER_SECRET=your-production-mpesa-secret
MPESA_ENVIRONMENT=production

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-app-password

# Monitoring
SENTRY_DSN=your-sentry-dsn
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 📊 Monitoring & Analytics

### Application Monitoring
```bash
# Install monitoring tools
npm install @sentry/nextjs
npm install @vercel/analytics
```

### Health Checks
Create health check endpoints:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
}
```

### Performance Monitoring
```typescript
// app/api/metrics/route.ts
export async function GET() {
  return Response.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage()
  })
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🔐 Security Considerations

### SSL/TLS Configuration
- Use TLS 1.3 minimum
- Configure HSTS headers
- Implement certificate pinning
- Regular certificate renewal

### Database Security
- Use connection pooling
- Enable SSL connections
- Regular backups
- Access control lists

### API Security
- Rate limiting enabled
- CORS properly configured
- Input validation
- Authentication required

## 📈 Performance Optimization

### Build Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
}

module.exports = nextConfig
```

### CDN Configuration
- Static assets via CDN
- Image optimization
- Gzip compression
- Browser caching headers

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Node.js version (18+)
   - Clear `.next` directory
   - Verify environment variables

2. **Runtime Errors**
   - Check server logs
   - Verify database connections
   - Test API endpoints

3. **Performance Issues**
   - Enable compression
   - Optimize images
   - Use CDN for static assets

### Debugging Commands
```bash
# Check application logs
pm2 logs panda-mart

# Monitor system resources
htop
df -h

# Test API endpoints
curl -I https://yourdomain.com/api/health

# Check SSL certificate
openssl s_client -connect yourdomain.com:443
```

## 📞 Support

For deployment support:
- **Documentation**: Check README.md and component docs
- **Issues**: Create GitHub issue with deployment logs
- **Security**: Report security issues privately

---

**Remember to test thoroughly in a staging environment before deploying to production!**