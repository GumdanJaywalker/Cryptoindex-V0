'use client'

import { useEffect, useState, createContext, useContext } from 'react'
import { PWAManager } from './sw-register'

interface PWAContextType {
  isInstalled: boolean
  isOnline: boolean
  showInstallPrompt: boolean
  installApp: () => Promise<boolean>
  dismissInstallPrompt: () => void
}

const PWAContext = createContext<PWAContextType | null>(null)

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const pwa = PWAManager.getInstance()

    // Initialize PWA
    pwa.init()

    // Check if already installed
    setIsInstalled(pwa.isInstalled())
    setIsOnline(pwa.isOnline())

    // PWA install prompt disabled for now
    // if (!pwa.isInstalled()) {
    //   const timer = setTimeout(() => {
    //     setShowInstallPrompt(true)
    //   }, 10000)
    //   return () => clearTimeout(timer)
    // }

    // Listen for network changes
    const unsubscribe = pwa.onNetworkChange(setIsOnline)

    return unsubscribe
  }, [])

  const installApp = async (): Promise<boolean> => {
    const pwa = PWAManager.getInstance()
    const result = await pwa.promptInstall()
    
    if (result) {
      setIsInstalled(true)
      setShowInstallPrompt(false)
    }
    
    return result
  }

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false)
  }

  return (
    <PWAContext.Provider
      value={{
        isInstalled,
        isOnline,
        showInstallPrompt,
        installApp,
        dismissInstallPrompt
      }}
    >
      {children}
    </PWAContext.Provider>
  )
}

export function usePWAContext() {
  const context = useContext(PWAContext)
  if (!context) {
    throw new Error('usePWAContext must be used within PWAProvider')
  }
  return context
}