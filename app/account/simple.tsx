// Simple test page to verify account routing works
'use client'

export default function SimpleAccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="w-16 h-16 bg-panda-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-panda-black-900 mb-2">Account Page Works!</h1>
          <p className="text-gray-600 mb-4">The routing is working correctly.</p>
          <div className="text-sm text-gray-500">
            Path: /account
          </div>
        </div>
      </div>
    </div>
  )
}