# Panda Mart API Documentation

## Overview
The Panda Mart API is a comprehensive e-commerce REST API built with Next.js 13+ App Router, providing endpoints for user management, product catalog, shopping cart, orders, and more.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "error": null
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Rate Limiting
- Authentication endpoints: 5 requests per 15 minutes per IP
- General endpoints: 100 requests per minute per user

## Endpoints

### Health Check
#### GET /api/health
Check API health status.

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## Authentication

### Register User
#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "pandaId": "PM00000001",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+254712345678",
    "isVerified": false,
    "tier": "bronze",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login User
#### POST /api/auth/login
Authenticate user and get access tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "tokens": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 900
  },
  "user": {
    "id": "uuid",
    "pandaId": "PM00000001",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "tier": "bronze",
    "totalPoints": 0
  }
}
```

### Refresh Token
#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

### Logout
#### POST /api/auth/logout
Logout user and invalidate session.

**Headers:** `Authorization: Bearer <token>`

---

## User Management

### Get User Profile
#### GET /api/users/profile
Get current user's profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "pandaId": "PM00000001",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+254712345678",
    "isVerified": false,
    "tier": "bronze",
    "totalPoints": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User Profile
#### PUT /api/users/profile
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678"
}
```

---

## User Addresses

### Get User Addresses
#### GET /api/users/addresses
Get all user addresses.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "addresses": [
    {
      "id": "uuid",
      "title": "Home",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+254712345678",
      "email": "user@example.com",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apt 4B",
      "city": "Nairobi",
      "county": "Nairobi",
      "postalCode": "00100",
      "isDefault": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Add Address
#### POST /api/users/addresses
Add a new address.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Home",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678",
  "email": "user@example.com",
  "addressLine1": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "Nairobi",
  "county": "Nairobi",
  "postalCode": "00100",
  "isDefault": false
}
```

### Update Address
#### PUT /api/users/addresses/[addressId]
Update an existing address.

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as Add Address (partial updates supported)

### Delete Address
#### DELETE /api/users/addresses/[addressId]
Delete an address.

**Headers:** `Authorization: Bearer <token>`

---

## Products

### Get Products
#### GET /api/products
Get products with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `category` (string): Filter by category ID
- `brand` (string): Filter by brand ID
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sortBy` (string): Sort field (name, price, created_at)
- `sortOrder` (string): Sort order (asc, desc)
- `featured` (boolean): Filter featured products

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": "uuid",
      "sku": "PROD001",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Product description",
      "shortDescription": "Short description",
      "price": 1000.00,
      "originalPrice": 1200.00,
      "images": ["image1.jpg", "image2.jpg"],
      "features": ["Feature 1", "Feature 2"],
      "tags": ["tag1", "tag2"],
      "isFeatured": true,
      "category": {
        "id": "uuid",
        "name": "Electronics",
        "slug": "electronics"
      },
      "brand": {
        "id": "uuid",
        "name": "Samsung",
        "slug": "samsung"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

### Get Product by ID
#### GET /api/products/[id]
Get detailed product information.

**Response:**
```json
{
  "success": true,
  "product": {
    "id": "uuid",
    "sku": "PROD001",
    "name": "Product Name",
    "slug": "product-name",
    "description": "Detailed product description",
    "shortDescription": "Short description",
    "price": 1000.00,
    "originalPrice": 1200.00,
    "images": ["image1.jpg", "image2.jpg"],
    "features": ["Feature 1", "Feature 2"],
    "specifications": {
      "color": "Black",
      "weight": "1.5kg"
    },
    "tags": ["tag1", "tag2"],
    "stockQuantity": 50,
    "isFeatured": true,
    "category": { ... },
    "brand": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Search Products
#### GET /api/products/search
Search products by query.

**Query Parameters:**
- `q` (string): Search query
- `page` (number): Page number
- `limit` (number): Items per page

---

## Categories

### Get Categories
#### GET /api/categories
Get all product categories.

**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and accessories",
      "imageUrl": "category-image.jpg",
      "parentId": null,
      "isActive": true,
      "sortOrder": 0,
      "productCount": 150
    }
  ]
}
```

---

## Brands

### Get Brands
#### GET /api/brands
Get all brands.

**Response:**
```json
{
  "success": true,
  "brands": [
    {
      "id": "uuid",
      "name": "Samsung",
      "slug": "samsung",
      "description": "South Korean electronics company",
      "logoUrl": "samsung-logo.jpg",
      "websiteUrl": "https://samsung.com",
      "isActive": true,
      "productCount": 75
    }
  ]
}
```

---

## Shopping Cart

### Get Cart
#### GET /api/cart
Get user's shopping cart.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "cart": {
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "quantity": 2,
        "addedAt": "2024-01-01T00:00:00.000Z",
        "product": {
          "name": "Product Name",
          "slug": "product-name",
          "price": 1000.00,
          "images": ["image1.jpg"],
          "isActive": true,
          "category": "Electronics",
          "brand": "Samsung"
        },
        "itemTotal": 2000.00
      }
    ],
    "inactiveItems": [],
    "summary": {
      "itemCount": 1,
      "totalQuantity": 2,
      "subtotal": 2000.00,
      "tax": 320.00,
      "taxRate": 0.16,
      "total": 2320.00
    }
  }
}
```

### Add to Cart
#### POST /api/cart
Add item to cart.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 2
}
```

### Update Cart Item
#### PUT /api/cart/[itemId]
Update cart item quantity.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 3
}
```

### Remove from Cart
#### DELETE /api/cart/[itemId]
Remove item from cart.

**Headers:** `Authorization: Bearer <token>`

### Clear Cart
#### DELETE /api/cart
Clear entire cart.

**Headers:** `Authorization: Bearer <token>`

---

## Wishlist

### Get Wishlist
#### GET /api/wishlist
Get user's wishlist.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "wishlist": {
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "addedAt": "2024-01-01T00:00:00.000Z",
        "product": {
          "name": "Product Name",
          "slug": "product-name",
          "price": 1000.00,
          "originalPrice": 1200.00,
          "images": ["image1.jpg"],
          "isActive": true,
          "category": "Electronics",
          "brand": "Samsung"
        }
      }
    ],
    "inactiveItems": [],
    "totalCount": 1
  }
}
```

### Add to Wishlist
#### POST /api/wishlist
Add item to wishlist.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "uuid"
}
```

### Remove from Wishlist
#### DELETE /api/wishlist/[itemId]
Remove item from wishlist.

**Headers:** `Authorization: Bearer <token>`

---

## Orders

### Get Orders
#### GET /api/orders
Get user's orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "PM1640995200001",
      "status": "pending",
      "totalAmount": 2320.00,
      "currency": "KES",
      "deliveryMethod": "delivery",
      "deliveryAddress": { ... },
      "deliveryFee": 200.00,
      "itemCount": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 5,
    "totalPages": 1
  }
}
```

### Create Order
#### POST /api/orders
Create a new order from cart items.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "deliveryMethod": "delivery",
  "deliveryAddress": "address-uuid-or-object",
  "paymentMethod": "mpesa",
  "notes": "Please call before delivery"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "orderNumber": "PM1640995200001",
    "status": "pending",
    "subtotal": 2000.00,
    "tax": 320.00,
    "deliveryFee": 200.00,
    "totalAmount": 2520.00,
    "currency": "KES",
    "deliveryMethod": "delivery",
    "paymentMethod": "mpesa",
    "itemCount": 2,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Order by ID
#### GET /api/orders/[orderId]
Get detailed order information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "orderNumber": "PM1640995200001",
    "status": "pending",
    "subtotal": 2000.00,
    "tax": 320.00,
    "deliveryFee": 200.00,
    "totalAmount": 2520.00,
    "currency": "KES",
    "deliveryMethod": "delivery",
    "deliveryAddress": { ... },
    "paymentMethod": "mpesa",
    "paymentStatus": "pending",
    "notes": "Please call before delivery",
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "productName": "Product Name",
        "productSku": "PROD001",
        "quantity": 2,
        "unitPrice": 1000.00,
        "totalPrice": 2000.00
      }
    ],
    "statusHistory": [
      {
        "status": "pending",
        "notes": "Order created",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Stores

### Get Stores
#### GET /api/stores
Get all store locations.

**Response:**
```json
{
  "success": true,
  "stores": [
    {
      "id": "uuid",
      "name": "Panda Mart Nairobi",
      "slug": "panda-mart-nairobi",
      "description": "Main store in Nairobi CBD",
      "address": "123 Kenyatta Avenue, Nairobi",
      "phone": "+254700123456",
      "email": "nairobi@pandamart.co.ke",
      "openingHours": {
        "monday": "9:00-18:00",
        "tuesday": "9:00-18:00",
        "wednesday": "9:00-18:00",
        "thursday": "9:00-18:00",
        "friday": "9:00-18:00",
        "saturday": "9:00-17:00",
        "sunday": "10:00-16:00"
      },
      "isActive": true
    }
  ]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse
- **Input Sanitization**: All inputs are sanitized
- **SQL Injection Protection**: Parameterized queries
- **Password Hashing**: Bcrypt with salt
- **CORS Configuration**: Proper cross-origin settings
- **Request Validation**: Comprehensive input validation

---

## Testing

Use the provided test scripts:
- `test-comprehensive-api.js` - Full API test suite
- `test-api-endpoints.js` - Basic endpoint tests
- `security-audit.js` - Security vulnerability scan

Run tests:
```bash
node test-comprehensive-api.js
node security-audit.js
```

---

## Support

For API support and questions:
- Email: api-support@pandamart.co.ke
- Documentation: [API Docs](https://docs.pandamart.co.ke)
- Status Page: [Status](https://status.pandamart.co.ke)