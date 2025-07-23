/**
 * Panda Mart Kenya API Testing Script
 * 
 * This script tests all the API endpoints we've created.
 * Run with: node test-api-endpoints.js
 * 
 * Make sure your Next.js server is running on http://localhost:3000
 */

const BASE_URL = 'http://localhost:3000/api'

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+254712345678',
  password: 'TestPassword123!'
}

const testAddress = {
  title: 'Home',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+254712345678',
  email: 'john.doe@example.com',
  addressLine1: '123 Kenyatta Avenue',
  addressLine2: 'Apartment 4B',
  city: 'Nairobi',
  county: 'Nairobi',
  postalCode: '00100',
  isDefault: true
}

// Global variables to store tokens and IDs
let accessToken = ''
let refreshToken = ''
let userId = ''
let cartItemId = ''
let orderId = ''
let addressId = ''
let wishlistItemId = ''

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  }

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    
    console.log(`\\n${method} ${endpoint}`)
    console.log(`Status: ${response.status}`)
    console.log('Response:', JSON.stringify(result, null, 2))
    
    return { status: response.status, data: result }
  } catch (error) {
    console.error(`Error testing ${method} ${endpoint}:`, error.message)
    return { status: 500, data: { error: error.message } }
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\\n=== TESTING HEALTH CHECK ===')
  await makeRequest('GET', '/health')
}

async function testUserRegistration() {
  console.log('\\n=== TESTING USER REGISTRATION ===')
  const response = await makeRequest('POST', '/auth/register', testUser)
  
  if (response.status === 201) {
    console.log('✅ User registration successful')
  } else {
    console.log('❌ User registration failed')
  }
}

async function testUserLogin() {
  console.log('\\n=== TESTING USER LOGIN ===')
  const loginData = {
    email: testUser.email,
    password: testUser.password
  }
  
  const response = await makeRequest('POST', '/auth/login', loginData)
  
  if (response.status === 200 && response.data.accessToken) {
    accessToken = response.data.accessToken
    refreshToken = response.data.refreshToken
    userId = response.data.user.id
    console.log('✅ User login successful')
    console.log('Access token stored for subsequent requests')
  } else {
    console.log('❌ User login failed')
  }
}

async function testTokenRefresh() {
  console.log('\\n=== TESTING TOKEN REFRESH ===')
  const response = await makeRequest('POST', '/auth/refresh', { refreshToken })
  
  if (response.status === 200 && response.data.accessToken) {
    accessToken = response.data.accessToken
    refreshToken = response.data.refreshToken
    console.log('✅ Token refresh successful')
  } else {
    console.log('❌ Token refresh failed')
  }
}

async function testUserProfile() {
  console.log('\\n=== TESTING USER PROFILE ===')
  
  // Get profile
  let response = await makeRequest('GET', '/users/profile', null, accessToken)
  if (response.status === 200) {
    console.log('✅ Get user profile successful')
  } else {
    console.log('❌ Get user profile failed')
  }
  
  // Update profile
  const updateData = {
    firstName: 'Jane',
    lastName: 'Smith',
    preferredLanguage: 'en'
  }
  
  response = await makeRequest('PUT', '/users/profile', updateData, accessToken)
  if (response.status === 200) {
    console.log('✅ Update user profile successful')
  } else {
    console.log('❌ Update user profile failed')
  }
}

async function testAddresses() {
  console.log('\\n=== TESTING USER ADDRESSES ===')
  
  // Add address
  let response = await makeRequest('POST', '/users/addresses', testAddress, accessToken)
  if (response.status === 200 && response.data.address) {
    addressId = response.data.address.id
    console.log('✅ Add address successful')
  } else {
    console.log('❌ Add address failed')
  }
  
  // Get addresses
  response = await makeRequest('GET', '/users/addresses', null, accessToken)
  if (response.status === 200) {
    console.log('✅ Get addresses successful')
  } else {
    console.log('❌ Get addresses failed')
  }
  
  // Get specific address
  if (addressId) {
    response = await makeRequest('GET', `/users/addresses/${addressId}`, null, accessToken)
    if (response.status === 200) {
      console.log('✅ Get specific address successful')
    } else {
      console.log('❌ Get specific address failed')
    }
    
    // Update address
    const updateData = { city: 'Mombasa', county: 'Mombasa' }
    response = await makeRequest('PUT', `/users/addresses/${addressId}`, updateData, accessToken)
    if (response.status === 200) {
      console.log('✅ Update address successful')
    } else {
      console.log('❌ Update address failed')
    }
  }
}

async function testCategories() {
  console.log('\\n=== TESTING CATEGORIES ===')
  
  // Get categories
  let response = await makeRequest('GET', '/categories')
  if (response.status === 200) {
    console.log('✅ Get categories successful')
  } else {
    console.log('❌ Get categories failed')
  }
  
  // Get categories with product count
  response = await makeRequest('GET', '/categories?includeProductCount=true')
  if (response.status === 200) {
    console.log('✅ Get categories with product count successful')
  } else {
    console.log('❌ Get categories with product count failed')
  }
}

async function testBrands() {
  console.log('\\n=== TESTING BRANDS ===')
  
  // Get brands
  let response = await makeRequest('GET', '/brands')
  if (response.status === 200) {
    console.log('✅ Get brands successful')
  } else {
    console.log('❌ Get brands failed')
  }
  
  // Get brands with product count
  response = await makeRequest('GET', '/brands?includeProductCount=true')
  if (response.status === 200) {
    console.log('✅ Get brands with product count successful')
  } else {
    console.log('❌ Get brands with product count failed')
  }
}

async function testStores() {
  console.log('\\n=== TESTING STORES ===')
  
  // Get stores
  let response = await makeRequest('GET', '/stores')
  if (response.status === 200) {
    console.log('✅ Get stores successful')
  } else {
    console.log('❌ Get stores failed')
  }
  
  // Get stores by city
  response = await makeRequest('GET', '/stores?city=Nairobi')
  if (response.status === 200) {
    console.log('✅ Get stores by city successful')
  } else {
    console.log('❌ Get stores by city failed')
  }
}

async function testProducts() {
  console.log('\\n=== TESTING PRODUCTS ===')
  
  // Get products
  let response = await makeRequest('GET', '/products')
  if (response.status === 200) {
    console.log('✅ Get products successful')
  } else {
    console.log('❌ Get products failed')
  }
  
  // Get products with filters
  response = await makeRequest('GET', '/products?page=1&limit=5&sortBy=price&sortOrder=asc')
  if (response.status === 200) {
    console.log('✅ Get products with filters successful')
  } else {
    console.log('❌ Get products with filters failed')
  }
  
  // Search products
  response = await makeRequest('GET', '/products/search?q=phone')
  if (response.status === 200) {
    console.log('✅ Search products successful')
  } else {
    console.log('❌ Search products failed')
  }
}

async function testCart() {
  console.log('\\n=== TESTING SHOPPING CART ===')
  
  // Get empty cart
  let response = await makeRequest('GET', '/cart', null, accessToken)
  if (response.status === 200) {
    console.log('✅ Get cart successful')
  } else {
    console.log('❌ Get cart failed')
  }
  
  // Add item to cart (using a dummy product ID)
  const cartData = {
    productId: '123e4567-e89b-12d3-a456-426614174000', // Dummy UUID
    quantity: 2
  }
  
  response = await makeRequest('POST', '/cart', cartData, accessToken)
  if (response.status === 200 && response.data.item) {
    cartItemId = response.data.item.id
    console.log('✅ Add to cart successful (or expected failure for dummy product)')
  } else {
    console.log('⚠️ Add to cart failed (expected for dummy product ID)')
  }
  
  // Update cart item (if we have a cart item ID)
  if (cartItemId) {
    const updateData = { quantity: 3 }
    response = await makeRequest('PUT', `/cart/${cartItemId}`, updateData, accessToken)
    if (response.status === 200) {
      console.log('✅ Update cart item successful')
    } else {
      console.log('❌ Update cart item failed')
    }
  }
}

async function testWishlist() {
  console.log('\\n=== TESTING WISHLIST ===')
  
  // Get wishlist
  let response = await makeRequest('GET', '/wishlist', null, accessToken)
  if (response.status === 200) {
    console.log('✅ Get wishlist successful')
  } else {
    console.log('❌ Get wishlist failed')
  }
  
  // Add item to wishlist (using dummy product ID)
  const wishlistData = {
    productId: '123e4567-e89b-12d3-a456-426614174000' // Dummy UUID
  }
  
  response = await makeRequest('POST', '/wishlist', wishlistData, accessToken)
  if (response.status === 200 && response.data.item) {
    wishlistItemId = response.data.item.id
    console.log('✅ Add to wishlist successful (or expected failure for dummy product)')
  } else {
    console.log('⚠️ Add to wishlist failed (expected for dummy product ID)')
  }
}

async function testOrders() {
  console.log('\\n=== TESTING ORDERS ===')
  
  // Get orders
  let response = await makeRequest('GET', '/orders', null, accessToken)
  if (response.status === 200) {
    console.log('✅ Get orders successful')
  } else {
    console.log('❌ Get orders failed')
  }
  
  // Create order (will fail without cart items, but tests the endpoint)
  const orderData = {
    deliveryMethod: 'delivery',
    deliveryAddress: testAddress,
    paymentMethod: 'mpesa',
    notes: 'Test order'
  }
  
  response = await makeRequest('POST', '/orders', orderData, accessToken)
  if (response.status === 200 && response.data.order) {
    orderId = response.data.order.id
    console.log('✅ Create order successful')
  } else {
    console.log('⚠️ Create order failed (expected without cart items)')
  }
}

async function testLogout() {
  console.log('\\n=== TESTING USER LOGOUT ===')
  const response = await makeRequest('POST', '/auth/logout', {}, accessToken)
  
  if (response.status === 200) {
    console.log('✅ User logout successful')
  } else {
    console.log('❌ User logout failed')
  }
}

// Cleanup function
async function cleanup() {
  console.log('\\n=== CLEANUP ===')
  
  // Delete address if created
  if (addressId && accessToken) {
    const response = await makeRequest('DELETE', `/users/addresses/${addressId}`, null, accessToken)
    if (response.status === 200) {
      console.log('✅ Address deleted')
    }
  }
  
  // Remove wishlist item if created
  if (wishlistItemId && accessToken) {
    const response = await makeRequest('DELETE', `/wishlist/${wishlistItemId}`, null, accessToken)
    if (response.status === 200) {
      console.log('✅ Wishlist item removed')
    }
  }
  
  // Clear cart if items exist
  if (accessToken) {
    const response = await makeRequest('DELETE', '/cart', null, accessToken)
    if (response.status === 200) {
      console.log('✅ Cart cleared')
    }
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Panda Mart Kenya API Tests')
  console.log('=====================================')
  
  try {
    await testHealthCheck()
    await testUserRegistration()
    await testUserLogin()
    
    if (accessToken) {
      await testTokenRefresh()
      await testUserProfile()
      await testAddresses()
      await testCart()
      await testWishlist()
      await testOrders()
    }
    
    // Test public endpoints
    await testCategories()
    await testBrands()
    await testStores()
    await testProducts()
    
    if (accessToken) {
      await testLogout()
    }
    
    await cleanup()
    
  } catch (error) {
    console.error('Test execution error:', error)
  }
  
  console.log('\\n🏁 API Testing Complete!')
  console.log('=====================================')
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or you need to install node-fetch')
  console.log('Install with: npm install node-fetch')
  console.log('Or use Node.js 18+')
  process.exit(1)
}

// Run the tests
runAllTests().catch(console.error)