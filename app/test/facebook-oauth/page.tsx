'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FacebookOAuthTest() {
    const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string>('')

    const testFacebookOAuth = async () => {
        setStatus('testing')
        setError('')
        setResult(null)

        try {
            // Check if Facebook OAuth is configured
            const configResponse = await fetch('/api/auth/oauth/facebook/config')
            const configData = await configResponse.json()

            if (!configResponse.ok) {
                throw new Error(configData.error || 'Facebook OAuth not configured')
            }

            // Open Facebook OAuth popup
            const popup = window.open(
                '/api/auth/oauth/facebook',
                'facebook_oauth_test',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            )

            // Listen for popup completion
            const checkClosed = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkClosed)

                    // Check if authentication was successful
                    const authToken = localStorage.getItem('auth-token')
                    const userData = localStorage.getItem('user-data')

                    if (authToken && userData) {
                        setStatus('success')
                        setResult({
                            token: authToken.substring(0, 20) + '...',
                            user: JSON.parse(userData)
                        })
                    } else {
                        setStatus('error')
                        setError('Authentication was cancelled or failed')
                    }
                }
            }, 1000)

            // Timeout after 5 minutes
            setTimeout(() => {
                if (popup && !popup.closed) {
                    popup.close()
                    clearInterval(checkClosed)
                    setStatus('error')
                    setError('Authentication timed out')
                }
            }, 300000)

        } catch (error) {
            setStatus('error')
            setError(error instanceof Error ? error.message : 'Unknown error')
        }
    }

    const clearTest = () => {
        setStatus('idle')
        setResult(null)
        setError('')
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user-data')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Facebook OAuth Test
                        </h1>
                        <p className="text-gray-600">
                            Test your Facebook Login configuration
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Configuration Check */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Configuration Checklist:</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <span className={process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID ? '✅' : '❌'}></span>
                                    <span>FACEBOOK_CLIENT_ID configured</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span>⚠️</span>
                                    <span>Other Facebook credentials (check server logs)</span>
                                </div>
                            </div>
                        </div>

                        {/* Test Button */}
                        <div className="text-center">
                            <button
                                onClick={testFacebookOAuth}
                                disabled={status === 'testing'}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {status === 'testing' ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Testing Facebook OAuth...</span>
                                    </div>
                                ) : (
                                    'Test Facebook Login'
                                )}
                            </button>
                        </div>

                        {/* Results */}
                        {status === 'success' && result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-50 border border-green-200 rounded-lg p-4"
                            >
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-green-500">✅</span>
                                    <span className="font-semibold text-green-800">Facebook OAuth Success!</span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Token:</strong> {result.token}</div>
                                    <div><strong>User:</strong> {result.user.firstName} {result.user.lastName}</div>
                                    <div><strong>Email:</strong> {result.user.email}</div>
                                    <div><strong>Panda ID:</strong> {result.user.pandaId}</div>
                                    <div><strong>Provider:</strong> {result.user.authProvider}</div>
                                </div>
                            </motion.div>
                        )}

                        {status === 'error' && error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-50 border border-red-200 rounded-lg p-4"
                            >
                                <div className="flex items-center space-x-2 mb-2">
                                    <span className="text-red-500">❌</span>
                                    <span className="font-semibold text-red-800">Facebook OAuth Failed</span>
                                </div>
                                <div className="text-sm text-red-700">{error}</div>
                            </motion.div>
                        )}

                        {/* Clear Button */}
                        {(status === 'success' || status === 'error') && (
                            <div className="text-center">
                                <button
                                    onClick={clearTest}
                                    className="text-gray-600 hover:text-gray-800 text-sm underline"
                                >
                                    Clear Test Results
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Setup Instructions:</h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p>1. Go to <a href="https://developers.facebook.com/" target="_blank" className="text-blue-600 hover:underline">Facebook Developers</a></p>
                            <p>2. Create a new app and add Facebook Login product</p>
                            <p>3. Configure Valid OAuth Redirect URIs</p>
                            <p>4. Add your Facebook credentials to .env.local</p>
                            <p>5. Set OAUTH_SIMULATION=false to use real Facebook OAuth</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}