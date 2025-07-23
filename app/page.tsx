import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home - Panda Mart Kenya',
  description: 'Welcome to Panda Mart Kenya - Your World of Amazing Deals. Shop electronics, fashion, home goods and more.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐼 Welcome to Panda Mart Kenya
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your World of Amazing Deals
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">🛍️ Shop Online</h2>
              <p className="text-gray-600">
                Browse thousands of products from electronics to fashion, all at amazing prices.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">🏪 Visit Our Stores</h2>
              <p className="text-gray-600">
                Find our physical stores across Kenya for in-person shopping and pickup.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-3">🚚 Fast Delivery</h2>
              <p className="text-gray-600">
                Get your orders delivered quickly across Kenya with our reliable delivery network.
              </p>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">API Status</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                Panda Mart Kenya API is running successfully! 
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>✅ Authentication System Ready</p>
                <p>✅ Product Catalog Ready</p>
                <p>✅ Shopping Cart Ready</p>
                <p>✅ Order Management Ready</p>
                <p>✅ User Profiles Ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}