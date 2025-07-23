/**
 * Simple API Test Script
 * 
 * This script tests the basic functionality of our APIs
 * Run with: node test-api-simple.js
 * 
 * Make sure your Next.js server is running on http://localhost:3000
 */

const BASE_URL = 'http://localhost:3000/api'

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
    
    console.log(`\n${method} ${endpoint}`)
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
  console.log('\n=== TESTING HEALTH CHECK ===')
  await makeRequest('GET', '/health')
}

async function testPublicEndpoints() {
  console.log('\n=== TESTING PUBLIC ENDPOINTS ===')
  
  // Test categories
  await makeRequest('GET', '/categories')
  
  // Test brands
  await makeRequest('GET', '/brands')
  
  // Test stores
  await makeRequest('GET', '/stores')
  
  // Test products
  await makeRequest('GET', '/products?limit=5')
  
  // Test product search
  await makeRequest('GET', '/products/search?q=test')
}

async function testAuthEndpoints() {
  console.log('\n=== TESTING AUTH ENDPOINTS ===')
  
  // Test user registration (will likely fail due to missing database, but tests the endpoint)
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+254712345678',
    password: 'TestPassword123!'
  }
  
  await makeRequest('POST', '/auth/register', testUser)
  
  // Test user login
  const loginData = {
    email: testUser.email,
    password: testUser.password
  }
  
  await makeRequest('POST', '/auth/login', loginData)
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Simple API Tests')
  console.log('============================')
  
  try {
    await testHealthCheck()
    await testPublicEndpoints()
    await testAuthEndpoints()
    
  } catch (error) {
    console.error('Test execution error:', error)
  }
  
  console.log('\n🏁 Simple API Testing Complete!')
  console.log('===============================')
  console.log('\nNote: Some tests may fail due to missing database setup.')
  console.log('This is expected and just tests that the endpoints are accessible.')
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or you need to install node-fetch')
  console.log('Install with: npm install node-fetch')
  console.log('Or use Node.js 18+')
  process.exit(1)
}

// Run the tests
runTests().catch(console.error)