'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { X, Download, Smartphone } from 'lucide-react'
import { usePWAContext } from '@/lib/pwa/pwa-provider'

export function PWAInstallPrompt() {
  const { showInstallPrompt, installApp, dismissInstallPrompt } = usePWAContext()

  const handleInstall = async () => {
    await installApp()
  }

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 shadow-2xl backdrop-blur-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-black" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm">
                  Install CryptoIndex
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Get faster access and offline trading capabilities
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="bg-brand text-black hover:bg-brand-hover font-semibold"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </Button>
                  
                  <Button
                    onClick={dismissInstallPrompt}
                    size="sm"
                    variant="ghost"
                    className="text-slate-400 hover:text-white"
                  >
                    Not now
                  </Button>
                </div>
              </div>
              
              <button
                onClick={dismissInstallPrompt}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Network status indicator
export function NetworkStatus() {
  const { isOnline } = usePWAContext()

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2 text-center text-sm font-medium"
        >
          You're offline. Some features may be limited.
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PWAInstallPrompt