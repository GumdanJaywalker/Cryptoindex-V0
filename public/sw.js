// CryptoIndex Service Worker
const CACHE_NAME = 'cryptoindex-v1.0.0'
const STATIC_CACHE_NAME = 'cryptoindex-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'cryptoindex-dynamic-v1.0.0'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/trading',
  '/trending', 
  '/portfolio',
  '/governance',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Assets that change frequently
const DYNAMIC_ASSETS = [
  '/api/',
  '/images/',
  '/_next/static/',
  '/_next/image'
]

// Network-first assets (real-time data)
const NETWORK_FIRST = [
  '/api/market-data',
  '/api/prices',
  '/api/trades',
  '/api/portfolio'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('CryptoIndex SW: Installing...')
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('CryptoIndex SW: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      }),
      self.skipWaiting() // Activate immediately
    ])
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('CryptoIndex SW: Activating...')
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('cryptoindex-')) {
              console.log('CryptoIndex SW: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      self.clients.claim() // Take control immediately
    ])
  )
})

// Fetch event - handle different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip cross-origin requests (except for known APIs)
  if (url.origin !== location.origin && !url.hostname.includes('api.')) {
    return
  }

  // Network-first strategy for real-time data
  if (NETWORK_FIRST.some(path => url.pathname.startsWith(path))) {
    event.respondWith(networkFirstStrategy(request))
    return
  }

  // Cache-first strategy for static assets
  if (STATIC_ASSETS.includes(url.pathname) || 
      url.pathname.startsWith('/_next/static/') ||
      url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  // Stale-while-revalidate for dynamic content
  event.respondWith(staleWhileRevalidateStrategy(request))
})

// Network-first strategy - for real-time data
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('CryptoIndex SW: Network failed, trying cache:', request.url)
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline fallback for API endpoints
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'No network connection available',
          cached: false 
        }),
        { 
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    throw error
  }
}

// Cache-first strategy - for static assets
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('CryptoIndex SW: Failed to fetch and cache:', request.url)
    throw error
  }
}

// Stale-while-revalidate strategy - for dynamic content
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request)
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE_NAME)
      cache.then(c => c.put(request, networkResponse.clone()))
    }
    return networkResponse
  }).catch((error) => {
    console.log('CryptoIndex SW: Network failed for:', request.url)
    throw error
  })
  
  return cachedResponse || fetchPromise
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('CryptoIndex SW: Background sync triggered:', event.tag)
  
  if (event.tag === 'trade-orders') {
    event.waitUntil(syncTradeOrders())
  }
  
  if (event.tag === 'portfolio-updates') {
    event.waitUntil(syncPortfolioUpdates())
  }
})

// Sync pending trade orders when back online
async function syncTradeOrders() {
  try {
    const pendingOrders = await getStoredData('pending-trades')
    
    for (const order of pendingOrders) {
      try {
        const response = await fetch('/api/trades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order)
        })
        
        if (response.ok) {
          await removeStoredData('pending-trades', order.id)
          console.log('CryptoIndex SW: Synced trade order:', order.id)
        }
      } catch (error) {
        console.error('CryptoIndex SW: Failed to sync order:', order.id, error)
      }
    }
  } catch (error) {
    console.error('CryptoIndex SW: Background sync failed:', error)
  }
}

// Sync portfolio updates
async function syncPortfolioUpdates() {
  try {
    const updates = await getStoredData('portfolio-updates')
    
    for (const update of updates) {
      try {
        const response = await fetch('/api/portfolio/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        })
        
        if (response.ok) {
          await removeStoredData('portfolio-updates', update.id)
        }
      } catch (error) {
        console.error('CryptoIndex SW: Failed to sync portfolio update:', error)
      }
    }
  } catch (error) {
    console.error('CryptoIndex SW: Portfolio sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('CryptoIndex SW: Push received')
  
  let notificationData = {
    title: 'CryptoIndex',
    body: 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'cryptoindex-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  }
  
  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = { ...notificationData, ...data }
    } catch (error) {
      console.error('CryptoIndex SW: Invalid push data:', error)
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('CryptoIndex SW: Notification clicked:', event.notification.tag)
  
  event.notification.close()
  
  const action = event.action || 'view'
  
  if (action === 'dismiss') {
    return
  }
  
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Try to focus existing window
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

// Utility functions for IndexedDB storage
async function getStoredData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CryptoIndexDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction([storeName], 'readonly')
      const store = transaction.objectStore(storeName)
      const getRequest = store.getAll()
      
      getRequest.onsuccess = () => resolve(getRequest.result || [])
      getRequest.onerror = () => reject(getRequest.error)
    }
    
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' })
      }
    }
  })
}

async function removeStoredData(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CryptoIndexDB', 1)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const deleteRequest = store.delete(id)
      
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }
  })
}

// Periodic background tasks
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'price-updates') {
    event.waitUntil(updatePriceCache())
  }
})

async function updatePriceCache() {
  try {
    console.log('CryptoIndex SW: Updating price cache...')
    const response = await fetch('/api/prices/all')
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      await cache.put('/api/prices/all', response.clone())
    }
  } catch (error) {
    console.error('CryptoIndex SW: Price cache update failed:', error)
  }
}