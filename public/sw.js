// Service Worker for Panda Mart Kenya
// Provides offline functionality, caching, and push notifications

const CACHE_NAME = 'pandamart-v1.0.0'
const STATIC_CACHE = 'pandamart-static-v1.0.0'
const DYNAMIC_CACHE = 'pandamart-dynamic-v1.0.0'
const IMAGE_CACHE = 'pandamart-images-v1.0.0'

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/offline',
  '/manifest.json',
  '/panda.ico',
  '/_next/static/css/app.css',
  '/_next/static/js/app.js'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https:\/\/pandamart\.co\.ke\/api\/stores/,
  /^https:\/\/pandamart\.co\.ke\/api\/collections/,
  /^https:\/\/pandamart\.co\.ke\/api\/deals/
]

// Image patterns to cache
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  /^https:\/\/res\.cloudinary\.com/,
  /^https:\/\/images\.pandamart\.co\.ke/
]

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('[SW] Static files cached successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static files:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Service worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return
  }
  
  // Handle different types of requests
  if (isStaticFile(request.url)) {
    event.respondWith(handleStaticFile(request))
  } else if (isImageRequest(request.url)) {
    event.respondWith(handleImageRequest(request))
  } else if (isAPIRequest(request.url)) {
    event.respondWith(handleAPIRequest(request))
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request))
  } else {
    event.respondWith(handleDynamicRequest(request))
  }
})

// Check if request is for static files
function isStaticFile(url) {
  return url.includes('/_next/static/') || 
         url.includes('/panda.ico') ||
         url.includes('/manifest.json') ||
         url.includes('/robots.txt')
}

// Check if request is for images
function isImageRequest(url) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(url))
}

// Check if request is for API
function isAPIRequest(url) {
  return url.includes('/api/') || 
         API_CACHE_PATTERNS.some(pattern => pattern.test(url))
}

// Check if request is navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate'
}

// Handle static files - cache first strategy
async function handleStaticFile(request) {
  try {
    const cache = await caches.open(STATIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Static file request failed:', error)
    return new Response('Static file not available offline', { status: 503 })
  }
}

// Handle images - cache first with fallback
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // Only cache successful responses and limit cache size
      const cacheKeys = await cache.keys()
      if (cacheKeys.length > 100) {
        // Remove oldest entries
        await cache.delete(cacheKeys[0])
      }
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('[SW] Image request failed:', error)
    // Return placeholder image
    return new Response(
      '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image unavailable</text></svg>',
      { 
        headers: { 'Content-Type': 'image/svg+xml' },
        status: 200 
      }
    )
  }
}

// Handle API requests - network first with cache fallback
async function handleAPIRequest(request) {
  try {
    // Try network first with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout for API
    
    const networkResponse = await fetch(request, { 
      signal: controller.signal 
    })
    
    clearTimeout(timeoutId)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('[SW] API network request failed, trying cache:', error.name)
    
    // Only show error if we're really offline
    const reallyOffline = await isReallyOffline()
    
    if (!reallyOffline) {
      // We have connectivity, let the request fail naturally
      throw error
    }
    
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Service unavailable', 
        message: 'Content not available offline',
        offline: true
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503 
      }
    )
  }
}

// Enhanced network detection
async function isReallyOffline() {
  try {
    // Try multiple quick checks
    const checks = await Promise.allSettled([
      fetch('/', { method: 'HEAD', cache: 'no-cache' }),
      fetch('/panda.ico', { method: 'HEAD', cache: 'no-cache' }),
      fetch('https://www.google.com/favicon.ico', { method: 'HEAD', cache: 'no-cache', mode: 'no-cors' })
    ])
    
    // If any check succeeds, we're online
    return checks.every(result => result.status === 'rejected')
  } catch (error) {
    return true // Assume offline if checks fail
  }
}

// Handle navigation requests - network first with intelligent offline fallback
async function handleNavigationRequest(request) {
  try {
    // Try network first with a reasonable timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const networkResponse = await fetch(request, { 
      signal: controller.signal,
      cache: 'no-cache'
    })
    
    clearTimeout(timeoutId)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`)
    
  } catch (error) {
    console.log('[SW] Navigation request failed:', error.name, error.message)
    
    // Check if we're really offline before showing offline page
    const reallyOffline = await isReallyOffline()
    
    if (!reallyOffline) {
      // We have some connectivity, try to serve from cache or let it fail naturally
      const cache = await caches.open(DYNAMIC_CACHE)
      const cachedResponse = await cache.match(request)
      
      if (cachedResponse) {
        return cachedResponse
      }
      
      // Return a minimal error page instead of full offline page
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Loading... - Panda Mart Kenya</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="refresh" content="3">
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .loading-container { max-width: 400px; margin: 0 auto; }
              .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #FF6B35; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              h1 { color: #FF6B35; }
              p { color: #666; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="loading-container">
              <div class="spinner"></div>
              <h1>Loading...</h1>
              <p>Please wait while we load the page.</p>
            </div>
          </body>
        </html>`,
        { 
          headers: { 'Content-Type': 'text/html' },
          status: 200 
        }
      )
    }
    
    // Only show offline page if we're really offline
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page only when truly offline
    const offlineResponse = await cache.match('/offline')
    if (offlineResponse) {
      return offlineResponse
    }
    
    return new Response(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Panda Mart Kenya</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline-container { max-width: 400px; margin: 0 auto; }
            .offline-icon { font-size: 64px; margin-bottom: 20px; }
            h1 { color: #FF6B35; }
            p { color: #666; line-height: 1.6; }
            .retry-btn { 
              background: #FF6B35; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 6px; 
              cursor: pointer; 
              font-size: 16px;
              margin-top: 20px;
            }
            .retry-btn:hover { background: #e55a2b; }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">🐼</div>
            <h1>You're Offline</h1>
            <p>It looks like you're not connected to the internet. Please check your connection and try again.</p>
            <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>`,
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 200 
      }
    )
  }
}

// Handle other dynamic requests
async function handleDynamicRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    return new Response('Content not available offline', { status: 503 })
  }
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received')
  
  if (!event.data) {
    return
  }
  
  const data = event.data.json()
  const options = {
    body: data.body || 'New notification from Panda Mart',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    image: data.image,
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/action-dismiss.png'
      }
    ],
    tag: data.tag || 'general',
    renotify: true,
    requireInteraction: data.priority === 'high',
    silent: data.priority === 'low',
    timestamp: Date.now(),
    vibrate: [200, 100, 200]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Panda Mart', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked')
  
  event.notification.close()
  
  const action = event.action
  const data = event.notification.data
  
  if (action === 'dismiss') {
    return
  }
  
  const urlToOpen = data.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync any pending data when connection is restored
    console.log('[SW] Performing background sync')
    
    // Example: sync offline orders, analytics, etc.
    // This would typically involve checking IndexedDB for pending data
    // and sending it to the server when connection is available
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error)
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW] Periodic sync triggered:', event.tag)
  
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent())
  }
})

// Sync content periodically
async function syncContent() {
  try {
    console.log('[SW] Syncing content in background')
    
    // Update cache with fresh content
    const cache = await caches.open(DYNAMIC_CACHE)
    
    // Fetch and cache important pages
    const importantPages = ['/', '/deals', '/collections']
    
    for (const page of importantPages) {
      try {
        const response = await fetch(page)
        if (response.ok) {
          await cache.put(page, response)
        }
      } catch (error) {
        console.log(`[SW] Failed to sync ${page}:`, error)
      }
    }
    
  } catch (error) {
    console.error('[SW] Content sync failed:', error)
  }
}

console.log('[SW] Service worker loaded successfully')