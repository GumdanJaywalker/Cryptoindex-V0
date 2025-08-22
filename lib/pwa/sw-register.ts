'use client'

// Service Worker Registration for CryptoIndex PWA
export class PWAManager {
  private static instance: PWAManager
  private registration: ServiceWorkerRegistration | null = null
  private isSupported = false

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator
  }

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager()
    }
    return PWAManager.instance
  }

  async init() {
    if (!this.isSupported) {
      console.log('PWA: Service Worker not supported')
      return false
    }

    try {
      console.log('PWA: Registering service worker...')
      
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'imports'
      })

      // Handle updates
      this.registration.addEventListener('updatefound', () => {
        console.log('PWA: New version available')
        this.handleUpdate()
      })

      // Check for existing updates
      if (this.registration.waiting) {
        this.handleUpdate()
      }

      console.log('PWA: Service worker registered successfully')
      return true
    } catch (error) {
      console.error('PWA: Service worker registration failed:', error)
      return false
    }
  }

  private handleUpdate() {
    if (!this.registration?.waiting) return

    console.log('PWA: Update ready to install')
    
    // Auto-update in production, prompt in development
    if (process.env.NODE_ENV === 'production') {
      this.skipWaiting()
    } else {
      this.promptForUpdate()
    }
  }

  private async promptForUpdate() {
    const shouldUpdate = confirm(
      'A new version of CryptoIndex is available. Update now?'
    )
    
    if (shouldUpdate) {
      this.skipWaiting()
    }
  }

  private skipWaiting() {
    if (!this.registration?.waiting) return

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    
    // Reload page after activation
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }

  // Install prompt management
  async promptInstall(): Promise<boolean> {
    const deferredPrompt = await this.getInstallPrompt()
    
    if (!deferredPrompt) {
      console.log('PWA: Install prompt not available')
      return false
    }

    try {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      
      console.log('PWA: Install prompt result:', result.outcome)
      return result.outcome === 'accepted'
    } catch (error) {
      console.error('PWA: Install prompt failed:', error)
      return false
    }
  }

  private async getInstallPrompt(): Promise<any> {
    return new Promise((resolve) => {
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault()
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        resolve(e)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      
      // Check if already stored
      if ((window as any).deferredPrompt) {
        resolve((window as any).deferredPrompt)
      }
      
      // Timeout after 5 seconds
      setTimeout(() => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        resolve(null)
      }, 5000)
    })
  }

  // Check if app is installed
  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone ||
           document.referrer.includes('android-app://')
  }

  // Background sync registration
  async registerBackgroundSync(tag: string): Promise<boolean> {
    if (!this.registration || !('sync' in this.registration)) {
      console.log('PWA: Background sync not supported')
      return false
    }

    try {
      await this.registration.sync.register(tag)
      console.log(`PWA: Background sync registered for tag: ${tag}`)
      return true
    } catch (error) {
      console.error('PWA: Background sync registration failed:', error)
      return false
    }
  }

  // Push notification setup
  async setupPushNotifications(): Promise<boolean> {
    if (!this.registration || !('pushManager' in this.registration)) {
      console.log('PWA: Push notifications not supported')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      
      if (permission !== 'granted') {
        console.log('PWA: Push notification permission denied')
        return false
      }

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        )
      })

      console.log('PWA: Push subscription created')
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription)
      return true
    } catch (error) {
      console.error('PWA: Push notification setup failed:', error)
      return false
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  private async sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      })
    } catch (error) {
      console.error('PWA: Failed to send subscription to server:', error)
    }
  }

  // Cache management
  async clearOldCaches(): Promise<void> {
    if (!('caches' in window)) return

    try {
      const cacheNames = await caches.keys()
      const oldCaches = cacheNames.filter(name => 
        name.startsWith('cryptoindex-') && 
        !name.includes('v1.0.0')
      )

      await Promise.all(oldCaches.map(name => caches.delete(name)))
      console.log('PWA: Old caches cleared')
    } catch (error) {
      console.error('PWA: Failed to clear old caches:', error)
    }
  }

  // Offline storage for pending actions
  async storeOfflineAction(action: any): Promise<void> {
    if (!('indexedDB' in window)) return

    try {
      const db = await this.openDB()
      const transaction = db.transaction(['offline-actions'], 'readwrite')
      const store = transaction.objectStore('offline-actions')
      
      await store.add({
        ...action,
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('PWA: Failed to store offline action:', error)
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CryptoIndexDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = () => {
        const db = request.result
        
        if (!db.objectStoreNames.contains('offline-actions')) {
          db.createObjectStore('offline-actions', { keyPath: 'id' })
        }
        
        if (!db.objectStoreNames.contains('pending-trades')) {
          db.createObjectStore('pending-trades', { keyPath: 'id' })
        }
        
        if (!db.objectStoreNames.contains('portfolio-updates')) {
          db.createObjectStore('portfolio-updates', { keyPath: 'id' })
        }
      }
    })
  }

  // Network status monitoring
  onNetworkChange(callback: (isOnline: boolean) => void): () => void {
    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }

  // Get network status
  isOnline(): boolean {
    return navigator.onLine
  }
}

// React hooks for PWA functionality
export function usePWA() {
  const pwa = PWAManager.getInstance()
  
  return {
    install: () => pwa.promptInstall(),
    isInstalled: () => pwa.isInstalled(),
    isOnline: () => pwa.isOnline(),
    setupNotifications: () => pwa.setupPushNotifications(),
    storeOfflineAction: (action: any) => pwa.storeOfflineAction(action),
    onNetworkChange: (callback: (isOnline: boolean) => void) => 
      pwa.onNetworkChange(callback)
  }
}

// Auto-initialize PWA when this module is imported
if (typeof window !== 'undefined') {
  const pwa = PWAManager.getInstance()
  
  // Initialize on page load
  window.addEventListener('load', () => {
    pwa.init()
  })
}