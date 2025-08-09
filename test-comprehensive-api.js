const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  phone: '+254712345678'
};

let authToken = '';
let testProductId = '';
let testAddressId = '';
let testOrderId = '';

// Helper function to make authenticated requests
const authRequest = (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
  };
  if (data) config.data = data;
  return axios(config);
};

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, error = null) {
  results.tests.push({ name, passed, error });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}: ${error}`);
  }
}

async function runTests() {
  console.log('🚀 Starting Comprehensive API Tests\n');

  // 1. Health Check
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    logTest('Health Check', response.status === 200);
  } catch (error) {
    logTest('Health Check', false, error.message);
  }

  // 2. User Registration
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, TEST_USER);
    logTest('User Registration', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('User Registration', false, error.response?.data?.error || error.message);
  }

  // 3. User Login
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    authToken = response.data.tokens.accessToken;
    logTest('User Login', response.status === 200 && authToken);
  } catch (error) {
    logTest('User Login', false, error.response?.data?.error || error.message);
  }

  // 4. Get User Profile
  try {
    const response = await authRequest('get', '/users/profile');
    logTest('Get User Profile', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Get User Profile', false, error.response?.data?.error || error.message);
  }

  // 5. Get Categories
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    logTest('Get Categories', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Get Categories', false, error.response?.data?.error || error.message);
  }

  // 6. Get Brands
  try {
    const response = await axios.get(`${BASE_URL}/brands`);
    logTest('Get Brands', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Get Brands', false, error.response?.data?.error || error.message);
  }

  // 7. Get Products
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    if (response.data.products && response.data.products.length > 0) {
      testProductId = response.data.products[0].id;
    }
    logTest('Get Products', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Get Products', false, error.response?.data?.error || error.message);
  }

  // 8. Search Products
  try {
    const response = await axios.get(`${BASE_URL}/products/search?q=test`);
    logTest('Search Products', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Search Products', false, error.response?.data?.error || error.message);
  }

  // 9. Get Product by ID (if we have a test product)
  if (testProductId) {
    try {
      const response = await axios.get(`${BASE_URL}/products/${testProductId}`);
      logTest('Get Product by ID', response.status === 200 && response.data.success);
    } catch (error) {
      logTest('Get Product by ID', false, error.response?.data?.error || error.message);
    }
  }

  // 10. Add Address
  try {
    const addressData = {
      title: 'Home',
      firstName: 'Test',
      lastName: 'User',
      phone: '+254712345678',
      email: 'test@example.com',
      addressLine1: '123 Test Street',
      city: 'Nairobi',
      county: 'Nairobi',
      postalCode: '00100',
      isDefault: true
    };
    const response = await authRequest('post', '/users/addresses', addressData);
    if (response.data.address) {
      testAddressId = response.data.address.id;
    }
    logTest('Add Address', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Add Address', false, error.response?.data?.error || error.message);
  }

  // 11. Get Addresses
  try {
    const response = await authRequest('get', '/users/addresses');
    logTest('Get Addresses', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Get Addresses', false, error.response?.data?.error || error.message);
  }

  // 12. Update Address (if we have a test address)
  if (testAddressId) {
    try {
      const updateData = { city: 'Mombasa' };
      const response = await authRequest('put', `/users/addresses/${testAddressId}`, updateData);
      logTest('Update Address', response.status === 200 && response.data.success);
    } catch (error) {
      logTest('Update Address', false, error.response?.data?.error || error.message);
    }
  }

  // 13. Add to Cart (if we have a test product)
  if (testProductId) {
    try {
      const response = await authRequest('post', '/cart', {
        productId: testProductId,
        quantity: 2
      });
      logTest('Add to Cart', response.status === 200 && response.data.success);
    } catch (error) {
      logTest('Add to Cart', false, error.response?.data?.error || error.message);
    }
  }

  // 14. Get Cart
  try {
    const response = await authRequest('get', '/cart');
    logTest('Get Cart', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Get Cart', false, error.response?.data?.error || error.message);
  }

  // 15. Add to Wishlist (if we have a test product)
  if (testProductId) {
    try {
      const response = await authRequest('post', '/wishlist', {
        productId: testProductId
      });
      logTest('Add to Wishlist', response.status === 200 && response.data.success);
    } catch (error) {
      logTest('Add to Wishlist', false, error.response?.data?.error || error.message);
    }
  }

  // 16. Get Wishlist
  try {
    const response = await authRequest('get', '/wishlist');
    logTest('Get Wishlist', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Get Wishlist', false, error.response?.data?.error || error.message);
  }

  // 17. Create Order (if we have items in cart and address)
  if (testAddressId) {
    try {
      const orderData = {
        deliveryMethod: 'delivery',
        deliveryAddress: testAddressId,
        paymentMethod: 'mpesa',
        notes: 'Test order'
      };
      const response = await authRequest('post', '/orders', orderData);
      if (response.data.order) {
        testOrderId = response.data.order.id;
      }
      logTest('Create Order', response.status === 200 && response.data.success);
    } catch (error) {
      logTest('Create Order', false, error.response?.data?.error || error.message);
    }
  }

  // 18. Get Orders
  try {
    const response = await authRequest('get', '/orders');
    logTest('Get Orders', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Get Orders', false, error.response?.data?.error || error.message);
  }

  // 19. Get Order by ID (if we have a test order)
  if (testOrderId) {
    try {
      const response = await authRequest('get', `/orders/${testOrderId}`);
      logTest('Get Order by ID', response.status === 200 && response.data.success);
    } catch (error) {
      logTest('Get Order by ID', false, error.response?.data?.error || error.message);
    }
  }

  // 20. Token Refresh
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    const refreshToken = loginResponse.data.tokens.refreshToken;
    
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken
    });
    logTest('Token Refresh', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('Token Refresh', false, error.response?.data?.error || error.message);
  }

  // 21. Logout
  try {
    const response = await authRequest('post', '/auth/logout');
    logTest('User Logout', response.status === 200 && response.data.success);
  } catch (error) {
    logTest('User Logout', false, error.response?.data?.error || error.message);
  }

  // Print Summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter(test => !test.passed)
      .forEach(test => console.log(`  - ${test.name}: ${test.error}`));
  }

  console.log('\n🏁 Testing Complete!');
}

// Run the tests
runTests().catch(console.error);