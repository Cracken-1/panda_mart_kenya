# 🐼 Panda Mart Kenya

**Your World of Amazing Deals** - A comprehensive e-commerce platform designed to drive foot traffic to physical stores while providing seamless online shopping experience.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue)

## 🚀 Features

### 🛍️ **E-commerce Core**
- **Product Catalog** with categories, brands, and advanced search
- **Shopping Cart** with store-specific inventory
- **Wishlist** functionality
- **Order Management** with pickup and delivery options
- **Payment Integration** (M-Pesa, Cards, Cash)

### 👤 **User Experience**
- **User Authentication** with email verification
- **Password Reset** with secure tokens
- **User Profiles** with delivery addresses
- **Loyalty Program** with points and tiers (Bronze, Silver, Gold, Diamond)
- **Reviews & Ratings** for products and stores

### 🏪 **Store Management**
- **Multi-store Support** with location-based inventory
- **Store Locator** with maps integration
- **Opening Hours** and services management
- **Pickup & Delivery** coordination

### 🔐 **Security & Authentication**
- **Email Verification** system
- **Password Reset** with time-limited tokens
- **Two-Factor Authentication** support
- **Session Management** across devices
- **Rate Limiting** and security monitoring

### 📊 **Analytics & Insights**
- **User Activity** tracking
- **Product Views** analytics
- **Search Queries** monitoring
- **Performance Metrics**

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Heroicons** - Beautiful icons
- **Framer Motion** - Smooth animations

### **Backend**
- **Next.js API Routes** - Serverless functions
- **PostgreSQL** - Primary database
- **Supabase** - Database hosting and auth
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing

### **Infrastructure**
- **Vercel** - Deployment and hosting
- **Supabase** - Database and real-time features
- **Cloudinary** - Image storage and optimization

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **PostgreSQL** 13+ (or Supabase account)
- **Git** for version control

## 🚀 Quick Start

### 1. **Clone Repository**
```bash
git clone git@github.com:Cracken-1/panda-mart-kenya.git
cd panda-mart-kenya
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your configuration
```

### 4. **Database Setup**
```bash
# Option 1: Use Supabase (Recommended for testing)
# 1. Create account at supabase.com
# 2. Create new project
# 3. Run DATABASE_SCHEMA_CLEAN.sql in SQL Editor

# Option 2: Local PostgreSQL
createdb pandamart_kenya
psql -d pandamart_kenya -f DATABASE_SCHEMA_CLEAN.sql
```

### 5. **Run Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🌐 Deployment

### **Testing Deployment (Vercel + Supabase)**

1. **Setup Database**
   - Create Supabase project
   - Run `DATABASE_SCHEMA_CLEAN.sql`
   - Copy connection details

2. **Deploy to Vercel**
   - Push code to GitHub
   - Import repository to Vercel
   - Add environment variables
   - Deploy

3. **Configure Email**
   - Setup Gmail SMTP or email service
   - Add SMTP credentials to Vercel

**Detailed deployment guide:** [TESTING_DEPLOYMENT.md](TESTING_DEPLOYMENT.md)

## 📁 Project Structure

```
panda-mart-kenya/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   └── health/               # Health check endpoints
│   ├── forgot-password/          # Password reset page
│   ├── reset-password/           # Password reset form
│   ├── verify-email/             # Email verification page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   ├── ui/                       # UI components
│   └── layout/                   # Layout components
├── lib/                          # Utility libraries
│   ├── auth/                     # Authentication logic
│   ├── database/                 # Database connection
│   └── services/                 # External services
├── scripts/                      # Utility scripts
│   ├── cleanup-expired-tokens.js # Token cleanup
│   ├── database-health-check.js  # Health monitoring
│   └── seed-initial-data.js      # Database seeding
├── DATABASE_SCHEMA_CLEAN.sql     # Clean database schema
├── DEPLOYMENT_GUIDE.md           # Production deployment
├── TESTING_DEPLOYMENT.md         # Testing deployment
└── README.md                     # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # TypeScript type checking

# Database
npm run db:setup         # Setup database schema
npm run db:seed          # Seed initial data
npm run db:backup        # Backup database

# Testing & Monitoring
npm run test             # Run tests
npm run security:audit   # Security audit
```

## 🔐 Environment Variables

### **Required Variables**
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"
DB_HOST="your-db-host"
DB_NAME="pandamart_kenya"
DB_USER="your-db-user"
DB_PASSWORD="your-db-password"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

**Complete list:** [.env.example](.env.example)

## 🧪 Testing

### **Manual Testing**
1. User registration and email verification
2. Password reset flow
3. Product browsing and search
4. Cart operations
5. Order placement
6. Mobile responsiveness

### **Health Checks**
- `/api/health` - Overall system health
- `/api/health/database` - Database connectivity
- `/api/health/email` - Email service status

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with 35+ tables covering:

- **User Management** - Authentication, profiles, preferences
- **Product Catalog** - Products, categories, brands, inventory
- **Order Processing** - Orders, payments, fulfillment
- **Loyalty System** - Points, rewards, tiers
- **Communication** - Email/SMS templates and logs
- **Analytics** - User activity, product views, searches
- **Security** - Audit logs, security incidents

**Schema file:** [DATABASE_SCHEMA_CLEAN.sql](DATABASE_SCHEMA_CLEAN.sql)

## 🔒 Security Features

- **Password Hashing** with bcrypt (12 rounds)
- **Email Verification** with secure tokens
- **Password Reset** with time-limited tokens
- **Rate Limiting** on authentication endpoints
- **Session Management** with secure cookies
- **SQL Injection** protection with parameterized queries
- **XSS Protection** with input sanitization
- **CSRF Protection** with tokens

## 🌍 Kenyan Market Features

- **M-Pesa Integration** for mobile payments
- **Multi-language Support** (English, Swahili)
- **Local Currency** (KES) support
- **County-based** store locations
- **Local Phone** number formats (+254)
- **Kenyan Business** compliance ready

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email:** support@pandamart.co.ke
- **Documentation:** [Deployment Guide](DEPLOYMENT_GUIDE.md)
- **Issues:** [GitHub Issues](https://github.com/Cracken-1/panda-mart-kenya/issues)

## 🎯 Roadmap

### **Phase 1: MVP** ✅
- [x] User authentication system
- [x] Product catalog
- [x] Shopping cart
- [x] Order management
- [x] Basic payment integration

### **Phase 2: Enhancement** 🚧
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Inventory management system
- [ ] Vendor portal
- [ ] Advanced search with filters

### **Phase 3: Scale** 📋
- [ ] Multi-tenant architecture
- [ ] API marketplace
- [ ] Third-party integrations
- [ ] Advanced reporting
- [ ] Machine learning recommendations

---

**Built with ❤️ for the Kenyan market**

*Panda Mart Kenya - Your World of Amazing Deals* 🐼🛍️