# Panda Mart Kenya - API Integration Guide

## 📋 Table of Contents
1. [Current API Status](#current-api-status)
2. [Required Internal APIs](#required-internal-apis)
3. [External API Integrations](#external-api-integrations)
4. [API Architecture](#api-architecture)
5. [Authentication & Security](#authentication--security)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Testing & Monitoring](#testing--monitoring)

---

## 🔍 Current API Status

### ✅ **Existing APIs**
```
app/api/
├── auth/
│   ├── forgot-password/route.ts    ✅ Implemented
│   ├── reset-password/route.ts     ✅ Implemented
│   └── verify-email/route.ts       ✅ Implemented
└── health/
    ├── route.ts                    ✅ Implemented
    └── database/route.ts           ✅ Implemented
```

### ⚠️ **Current Limitations**
- Only basic authentication APIs exist
- No product, order, or user management APIs
- No payment processing endpoints
- No external service integrations
- Frontend uses mock data and localStorage

---

## 🚀 Required Internal APIs

### **1. Authentication & User Management**
```typescript
// Missing APIs to implement:
POST   /api/auth/register           // User registration
POST   /api/auth/login              // User login
POST   /api/auth/logout             // User logout
POST   /api/auth/refresh            // Token refresh
GET    /api/auth/me                 // Get current user
PUT    /api/auth/profile            // Update profile
POST   /api/auth/change-password    // Change password
POST   /api/auth/2fa/setup          // Setup 2FA
POST   /api/auth/2fa/verify         // Verify 2FA
DELETE /api/auth/2fa/disable        // Disable 2FA
```

### **2. User Management**
```typescript
GET    /api/users/profile           // Get user profile
PUT    /api/users/profile           // Update user profile
GET    /api/users/addresses         // Get user addresses
POST   /api/users/addresses         // Add new address
PUT    /api/users/addresses/:id     // Update address
DELETE /api/users/addresses/:id     // Delete address
GET    /api/users/preferences       // Get user preferences
PUT    /api/users/preferences       // Update preferences
GET    /api/users/notifications     // Get notifications
PUT    /api/users/notifications/:id // Mark as read
DELETE /api/users/notifications/:id // Delete notification
```### **
3. Product Management**
```typescript
GET    /api/products                // Get products with filters
GET    /api/products/:id            // Get single product
GET    /api/products/search         // Search products
GET    /api/products/featured       // Get featured products
GET    /api/products/categories     // Get categories
GET    /api/products/brands         // Get brands
GET    /api/products/:id/reviews    // Get product reviews
POST   /api/products/:id/reviews    // Add product review
GET    /api/products/:id/inventory  // Check inventory by store
```

### **4. Shopping Cart**
```typescript
GET    /api/cart                    // Get user's cart
POST   /api/cart/items              // Add item to cart
PUT    /api/cart/items/:id          // Update cart item
DELETE /api/cart/items/:id          // Remove cart item
DELETE /api/cart                    // Clear cart
POST   /api/cart/validate           // Validate cart before checkout
```

### **5. Orders & Checkout**
```typescript
POST   /api/orders                  // Create new order
GET    /api/orders                  // Get user's orders
GET    /api/orders/:id              // Get single order
PUT    /api/orders/:id/cancel       // Cancel order
GET    /api/orders/:id/status       // Get order status
POST   /api/orders/:id/review       // Review order/products
```

### **6. Payments**
```typescript
POST   /api/payments/initiate       // Initiate payment
POST   /api/payments/verify         // Verify payment
POST   /api/payments/webhook        // Payment webhooks
GET    /api/payments/methods        // Get saved payment methods
POST   /api/payments/methods        // Save payment method
DELETE /api/payments/methods/:id    // Delete payment method
GET    /api/payments/history        // Get payment history
```

### **7. Loyalty & Rewards**
```typescript
GET    /api/loyalty/points          // Get user points
GET    /api/loyalty/history         // Get points history
GET    /api/loyalty/rewards         // Get available rewards
POST   /api/loyalty/redeem          // Redeem reward
GET    /api/loyalty/tier            // Get user tier info
GET    /api/coupons                 // Get user coupons
POST   /api/coupons/validate        // Validate coupon code
POST   /api/coupons/apply           // Apply coupon to order
```

### **8. Stores & Inventory**
```typescript
GET    /api/stores                  // Get all stores
GET    /api/stores/:id              // Get single store
GET    /api/stores/nearby           // Get nearby stores
GET    /api/stores/:id/inventory    // Get store inventory
GET    /api/stores/:id/hours        // Get store hours
POST   /api/stores/:id/review       // Review store
```

### **9. Wishlist**
```typescript
GET    /api/wishlist                // Get user's wishlist
POST   /api/wishlist/items          // Add item to wishlist
DELETE /api/wishlist/items/:id      // Remove from wishlist
POST   /api/wishlist/share          // Share wishlist
```

### **10. Support & Feedback**
```typescript
POST   /api/support/tickets         // Create support ticket
GET    /api/support/tickets         // Get user's tickets
GET    /api/support/tickets/:id     // Get single ticket
POST   /api/support/tickets/:id/reply // Reply to ticket
POST   /api/feedback                // Submit feedback
GET    /api/faq                     // Get FAQ items
```

---

## 🌐 External API Integrations

### **1. Payment Gateways**

#### **M-Pesa Integration (Primary)**
```typescript
// Safaricom Daraja API
const MPESA_CONFIG = {
  baseURL: 'https://sandbox.safaricom.co.ke', // or production
  consumerKey: process.env.MPESA_CONSUMER_KEY,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET,
  passkey: process.env.MPESA_PASSKEY,
  shortcode: process.env.MPESA_SHORTCODE,
}

// Required endpoints:
POST /oauth/v1/generate?grant_type=client_credentials  // Get access token
POST /mpesa/stkpush/v1/processrequest                 // STK Push
POST /mpesa/stkpushquery/v1/query                     // Query STK Push
POST /mpesa/c2b/v1/registerurl                        // Register URLs
```

#### **Stripe Integration (Cards)**
```typescript
// Stripe API
const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
}

// Required endpoints:
POST /v1/payment_intents                              // Create payment intent
POST /v1/payment_methods                              // Save payment method
GET  /v1/customers/:id/payment_methods                // Get saved methods
POST /v1/webhooks                                     // Handle webhooks
```

### **2. SMS Services**

#### **Africa's Talking SMS**
```typescript
const SMS_CONFIG = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
  baseURL: 'https://api.africastalking.com/version1',
}

// Required endpoints:
POST /messaging                                       // Send SMS
GET  /messaging/reports                               // Delivery reports
```

### **3. Email Services**

#### **SendGrid (Recommended)**
```typescript
const EMAIL_CONFIG = {
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: 'noreply@pandamart.co.ke',
  baseURL: 'https://api.sendgrid.com/v3',
}

// Required endpoints:
POST /mail/send                                       // Send email
GET  /stats                                           // Email statistics
POST /templates                                       // Manage templates
```

### **4. File Storage**

#### **Cloudinary (Images)**
```typescript
const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}

// Required endpoints:
POST /v1_1/:cloud_name/image/upload                   // Upload image
POST /v1_1/:cloud_name/image/destroy                  // Delete image
GET  /v1_1/:cloud_name/resources                      // List resources
```

### **5. Maps & Location**

#### **Google Maps API**
```typescript
const MAPS_CONFIG = {
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  baseURL: 'https://maps.googleapis.com/maps/api',
}

// Required endpoints:
GET /geocode/json                                     // Geocoding
GET /directions/json                                  // Directions
GET /place/nearbysearch/json                          // Nearby places
```

### **6. Analytics & Monitoring**

#### **Google Analytics 4**
```typescript
const GA_CONFIG = {
  measurementId: process.env.GA_MEASUREMENT_ID,
  apiSecret: process.env.GA_API_SECRET,
}

// Required endpoints:
POST /mp/collect                                      // Send events
POST /mp/debug/collect                                // Debug events
```

---

## 🏗️ API Architecture

### **Request/Response Standards**
```typescript
// Standard API Response Format
interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    timestamp: string
    requestId: string
  }
}

// Standard Error Codes
enum ErrorCodes {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}
```

### **Middleware Stack**
```typescript
// API Middleware Order
1. CORS handling
2. Rate limiting
3. Request logging
4. Authentication
5. Authorization
6. Input validation
7. Request processing
8. Response formatting
9. Error handling
```

---

## 🔒 Authentication & Security

### **JWT Token Strategy**
```typescript
interface JWTPayload {
  userId: string
  email: string
  pandaId: string
  tier: string
  permissions: string[]
  iat: number
  exp: number
}

// Token Configuration
const JWT_CONFIG = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  issuer: 'pandamart.co.ke',
  audience: 'pandamart-users'
}
```

### **API Security Headers**
```typescript
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': "default-src 'self'",
  'X-Rate-Limit-Limit': '100',
  'X-Rate-Limit-Remaining': '99',
  'X-Rate-Limit-Reset': '1640995200'
}
```

### **Rate Limiting Strategy**
```typescript
const RATE_LIMITS = {
  // Authentication endpoints
  '/api/auth/login': { requests: 5, window: '15m' },
  '/api/auth/register': { requests: 3, window: '1h' },
  
  // General API endpoints
  '/api/*': { requests: 100, window: '15m' },
  
  // Payment endpoints
  '/api/payments/*': { requests: 10, window: '1h' },
  
  // Search endpoints
  '/api/products/search': { requests: 50, window: '15m' }
}
```

---

## 🛣️ Implementation Roadmap

### **Phase 1: Core APIs (Week 1-2)**
- [ ] Authentication APIs (login, register, logout)
- [ ] User profile management
- [ ] Basic product listing
- [ ] Shopping cart functionality
- [ ] Database integration

### **Phase 2: E-commerce Core (Week 3-4)**
- [ ] Order processing APIs
- [ ] Payment integration (M-Pesa)
- [ ] Inventory management
- [ ] Email notifications
- [ ] Order status tracking

### **Phase 3: Advanced Features (Week 5-6)**
- [ ] Loyalty program APIs
- [ ] Coupon system
- [ ] Product reviews
- [ ] Wishlist functionality
- [ ] Store locator

### **Phase 4: External Integrations (Week 7-8)**
- [ ] SMS notifications
- [ ] File upload (Cloudinary)
- [ ] Maps integration
- [ ] Analytics tracking
- [ ] Payment webhooks

### **Phase 5: Optimization & Monitoring (Week 9-10)**
- [ ] API performance optimization
- [ ] Comprehensive testing
- [ ] Monitoring and logging
- [ ] Documentation
- [ ] Security audit

---

## 🧪 Testing & Monitoring

### **API Testing Strategy**
```typescript
// Test Categories
1. Unit Tests - Individual API functions
2. Integration Tests - Database interactions
3. End-to-End Tests - Complete user flows
4. Load Tests - Performance under stress
5. Security Tests - Authentication & authorization
```

### **Monitoring Setup**
```typescript
// Key Metrics to Monitor
- API response times
- Error rates by endpoint
- Authentication success/failure rates
- Payment processing success rates
- Database query performance
- External API dependency health
```

### **Health Check Endpoints**
```typescript
GET /api/health                     // Overall system health
GET /api/health/database            // Database connectivity
GET /api/health/external            // External services status
GET /api/health/payments            // Payment gateway status
```

---

## 📝 Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/pandamart
DB_SSL=false

# Authentication
NEXTAUTH_SECRET=your-secret-key
JWT_ACCESS_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# M-Pesa
MPESA_CONSUMER_KEY=your-consumer-key
MPESA_CONSUMER_SECRET=your-consumer-secret
MPESA_PASSKEY=your-passkey
MPESA_SHORTCODE=your-shortcode
MPESA_ENVIRONMENT=sandbox

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@pandamart.co.ke

# SMS (Africa's Talking)
AFRICASTALKING_API_KEY=your-api-key
AFRICASTALKING_USERNAME=your-username

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Maps
GOOGLE_MAPS_API_KEY=your-maps-key

# Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_API_SECRET=your-ga-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 🚀 Quick Start Implementation

### **1. Create API Base Structure**
```bash
mkdir -p app/api/{auth,users,products,orders,payments,loyalty,stores}
```

### **2. Install Required Dependencies**
```bash
npm install jsonwebtoken bcryptjs
npm install stripe @types/stripe
npm install africastalking
npm install @sendgrid/mail
npm install cloudinary
npm install @google/maps
```

### **3. Setup Database Connection**
```typescript
// Already implemented in lib/database/index.ts
import { db } from '@/lib/database'
```

### **4. Implement Authentication Middleware**
```typescript
// lib/middleware/auth.ts
export async function authenticateUser(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) throw new Error('No token provided')
  
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
  return payload as JWTPayload
}
```

---

**API Integration Status**: 🔄 In Progress  
**Estimated Completion**: 8-10 weeks  
**Priority**: High - Required for production deployment  

This guide provides the complete roadmap for transforming your mock-data frontend into a fully functional e-commerce platform with proper API integration.