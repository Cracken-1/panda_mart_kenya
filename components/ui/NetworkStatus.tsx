'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Enhanced network detection
  const checkNetworkStatus = async () => {
    setIsChecking(true)
    
    try {
      // Multiple checks for better accuracy
      const checks = await Promise.allSettled([
        // Check 1: Basic navigator.onLine
        Promise.resolve(navigator.onLine),
        
        // Check 2: Try to fetch a small resource
        fetch('/panda.ico', { 
          method: 'HEAD',
          cache: 'no-cache',
          mode: 'no-cors'
        }).then(() => true).catch(() => false),
        
        // Check 3: Try to reach a reliable external service
        fetch('https://www.google.com/favicon.ico', { 
          method: 'HEAD',
          cache: 'no-cache',
          mode: 'no-cors'
        }).then(() => true).catch(() => false)
      ])

      // Evaluate results
      const navigatorOnline = checks[0].status === 'fulfilled' ? checks[0].value : false
      const localCheck = checks[1].status === 'fulfilled' ? checks[1].value : false
      const externalCheck = checks[2].status === 'fulfilled' ? checks[2].value : false

      // Consider online if at least 2 out of 3 checks pass
      const onlineCount = [navigatorOnline, localCheck, externalCheck].filter(Boolean).length
      const newIsOnline = onlineCount >= 2

      setIsOnline(newIsOnline)
      setLastChecked(new Date())
      
      // Show status notification only if status changed
      if (newIsOnline !== isOnline) {
        setShowStatus(true)
        setTimeout(() => setShowStatus(false), 5000)
      }
      
    } catch (error) {
      console.error('Network check failed:', error)
      // Fallback to navigator.onLine
      setIsOnline(navigator.onLine)
    } finally {
      setIsChecking(false)
    }
  }

  // Initial check and setup listeners
  useEffect(() => {
    // Initial check
    checkNetworkStatus()

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('Browser detected online')
      checkNetworkStatus()
    }

    const handleOffline = () => {
      console.log('Browser detected offline')
      setIsOnline(false)
      setShowStatus(true)
      setTimeout(() => setShowStatus(false), 10000) // Show longer for offline
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Periodic check every 30 seconds when offline
    const interval = setInterval(() => {
      if (!isOnline) {
        checkNetworkStatus()
      }
    }, 30000)

    // Check when page becomes visible (user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && !isOnline) {
        checkNetworkStatus()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [isOnline])

  // Manual retry
  const handleRetry = () => {
    checkNetworkStatus()
  }

  // Don't show anything if online and no status to show
  if (isOnline && !showStatus) {
    return null
  }

  return (
    <AnimatePresence>
      {(showStatus || !isOnline) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 ${
            isOnline 
              ? 'bg-green-600' 
              : 'bg-red-600'
          } text-white shadow-lg`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isOnline ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <WifiOff className="w-5 h-5" />
                )}
                
                <div>
                  <p className="font-medium">
                    {isOnline 
                      ? 'Connection restored' 
                      : 'No internet connection'
                    }
                  </p>
                  {!isOnline && (
                    <p className="text-sm opacity-90">
                      Some features may not work properly. 
                      {lastChecked && (
                        <span className="ml-1">
                          Last checked: {lastChecked.toLocaleTimeString()}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!isOnline && (
                  <button
                    onClick={handleRetry}
                    disabled={isChecking}
                    className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                    <span className="text-sm">
                      {isChecking ? 'Checking...' : 'Retry'}
                    </span>
                  </button>
                )}

                {isOnline && showStatus && (
                  <button
                    onClick={() => setShowStatus(false)}
                    className="text-white/80 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NetworkStatus