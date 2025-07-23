# Panda Mart Kenya API Testing Guide

This guide will help you test all the API endpoints we've created for your Panda Mart Kenya e-commerce platform.

## 🚀 Quick Start

### Prerequisites
1. **Node.js 18+** installed
2. **PostgreSQL** database running
3. **Next.js development server** running (`npm run dev`)
4. **Environment variables** configured (copy `.env.example` to `.env.local`)

### Database Setup
Before testing, make sure you have:
1. Created the PostgreSQL database
2. Run the database schema from `DATABASE_SETUP_MANUAL.md`
3. Added some sample data (categories, brands, products, stores)

## 🧪 Testing Methods

### Method 1: Automated Testing Script
Run the comprehensive test script:

```bash
# Make sure your Next.js server is running first
npm run dev

# In another terminal, run the test script
node test-api-endpoints.js
```

This script will:
- Test all endpoints in sequence
- Create a test user
- Test authentication flow
- Test CRUD operations
- Clean up test data

### Method 2: Postman Collection
1. Import `Panda-Mart-API.postman_collection.json` into Postman
2. The collection includes all endpoints with sample data
3. Variables are automatically set (tokens, IDs) between requests
4. Run the entire collection or individual requests

### Method 3: Manual cURL Testing
Use the cURL commands below for manual testing.

## 📋 API Endpoints Overview

### ✅ Completed APIs

| Category | Endpoint | Method | Auth Required | Description |
|----------|----------|--------|---------------|-------------|
| **Health** | `/api/health` | GET | No | System health check |
| **Auth** | `/api/auth/register` | POST | No | User registration |
| **Auth** | `/api/auth/login` | POST | No | User login |
| **Auth** | `/api/auth/refresh` | POST | No | Refresh access token |
| **Auth** | `/api/auth/logout` | POST | Optional | User logout |
| **Profile** | `/api/users/profile` | GET | Yes | Get user profile |
| **Profile** | `/api/users/profile` | PUT | Yes | Update user profile |
| **Addresses** | `/api/users/addresses` | GET | Yes | Get user addresses |
| **Addresses** | `/api/users/addresses` | POST | Yes | Add new address |
| **Addresses** | `/api/users/addresses/[id]` | GET | Yes | Get specific address |
| **Addresses** | `/api/users/addresses/[id]` | PUT | Yes | Update address |
| **Addresses** | `/api/users/addresses/[id]` | DELETE | Yes | Delete address |
| **Products** | `/api/products` | GET | No | List products with filters |
| **Products** | `/api/products/[id]` | GET | No | Get product details |
| **Products** | `/api/products/search` | GET | No | Search products |
| **Categories** | `/api/categories` | GET | No | Get categories |
| **Brands** | `/api/brands` | GET | No | Get brands |
| **Stores** | `/api/stores` | GET | No | Get stores |
| **Cart** | `/api/cart` | GET | Yes | Get user's cart |
| **Cart** | `/api/cart` | POST | Yes | Add item to cart |
| **Cart** | `/api/cart` | DELETE | Yes | Clear cart |
| **Cart** | `/api/cart/[itemId]` | PUT | Yes | Update cart item |
| **Cart** | `/api/cart/[itemId]` | DELETE | Yes | Remove cart item |
| **Wishlist** | `/api/wishlist` | GET | Yes | Get user's wishlist |
| **Wishlist** | `/api/wishlist` | POST | Yes | Add to wishlist |
| **Wishlist** | `/api/wishlist/[itemId]` | DELETE | Yes | Remove from wishlist |
| **Orders** | `/api/orders` | GET | Yes | Get user's orders |
| **Orders** | `/api/orders` | POST | Yes | Create new order |
| **Orders** | `/api/orders/[orderId]` | GET | Yes | Get order details |
| **Orders** | `/api/orders/[orderId]` | PUT | Yes | Update order (cancel) |

## 🔧 Manual Testing with cURL

### 1. Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

### 2. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john.doe@example.com",
    "phone": "+254712345678",
    "password": "TestPassword123!"
  }'
```

### 3. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "TestPassword123!"
  }'
```

**Save the `accessToken` from the response for authenticated requests.**

### 4. Get User Profile
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Get Products
```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=10&sortBy=price&sortOrder=asc"
```

### 6. Search Products
```bash
curl -X GET "http://localhost:3000/api/products/search?q=phone&page=1&limit=5"
```

### 7. Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "productId": "PRODUCT_UUID_HERE",
    "quantity": 2
  }'
```

### 8. Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "deliveryMethod": "delivery",
    "deliveryAddress": {
      "title": "Home",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+254712345678",
      "addressLine1": "123 Kenyatta Avenue",
      "city": "Nairobi",
      "county": "Nairobi",
      "postalCode": "00100"
    },
    "paymentMethod": "mpesa",
    "notes": "Please call before delivery"
  }'
```

## 🔍 Testing Scenarios

### Authentication Flow
1. Register a new user
2. Login with credentials
3. Use access token for protected endpoints
4. Refresh token when it expires
5. Logout

### Shopping Flow
1. Browse products and categories
2. Search for specific products
3. Add products to cart
4. Update cart quantities
5. Add delivery address
6. Create order from cart
7. View order history

### Profile Management
1. Get user profile
2. Update profile information
3. Add multiple addresses
4. Set default address
5. Update and delete addresses

## ⚠️ Expected Behaviors

### Success Responses
- All successful responses return `{ "success": true, ... }`
- HTTP status codes: 200 (OK), 201 (Created)

### Error Responses
- All errors return `{ "error": "Error message", ... }`
- Common status codes:
  - 400: Bad Request (validation errors)
  - 401: Unauthorized (missing/invalid token)
  - 404: Not Found
  - 429: Too Many Requests (rate limiting)
  - 500: Internal Server Error

### Rate Limiting
- Login endpoint: 5 attempts per 15 minutes per IP
- Other endpoints: Standard rate limiting applies

### Data Validation
- Email format validation
- Kenyan phone number format (+254...)
- Password strength requirements
- Required field validation

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check PostgreSQL is running
   - Verify database credentials in `.env.local`
   - Ensure database exists and schema is created

2. **JWT Token Errors**
   - Check JWT secrets are set in environment
   - Ensure tokens haven't expired
   - Use refresh token to get new access token

3. **Validation Errors**
   - Check request body format
   - Ensure required fields are provided
   - Verify data types match expectations

4. **CORS Issues**
   - Ensure requests are made to correct localhost port
   - Check Next.js server is running

### Debug Mode
Add this to your `.env.local` for more detailed logging:
```
NODE_ENV=development
DEBUG=true
```

## 📊 Sample Test Data

### Test User
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+254712345678",
  "password": "TestPassword123!"
}
```

### Test Address
```json
{
  "title": "Home",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678",
  "addressLine1": "123 Kenyatta Avenue",
  "addressLine2": "Apartment 4B",
  "city": "Nairobi",
  "county": "Nairobi",
  "postalCode": "00100",
  "isDefault": true
}
```

## 🚀 Next Steps

After testing the APIs:

1. **Set up your database** with real product data
2. **Configure external services** (M-Pesa, email, SMS)
3. **Implement frontend** using these APIs
4. **Add more features** as needed
5. **Deploy to production** with proper environment variables

## 📞 Support

If you encounter issues:
1. Check the console logs in your Next.js server
2. Verify your database schema matches the expected structure
3. Ensure all environment variables are properly set
4. Test with the provided sample data first

Happy testing! 🎉