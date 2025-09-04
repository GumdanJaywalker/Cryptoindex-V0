'use client'

import { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence, PanInfo } from 'motion/react'
import { X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  snapPoints?: number[] // [0.3, 0.6, 0.9] = 30%, 60%, 90% of viewport height
  initialSnap?: number // Index of initial snap point
  className?: string
  showHandle?: boolean
  enableBackdrop?: boolean
  enableSwipeToClose?: boolean
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.4, 0.8],
  initialSnap = 0,
  className,
  showHandle = true,
  enableBackdrop = true,
  enableSwipeToClose = true
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(initialSnap)
  const [isDragging, setIsDragging] = useState(false)

  // Calculate snap point heights
  const snapHeights = snapPoints.map(point => `${point * 100}vh`)
  const currentHeight = snapHeights[currentSnap]

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    
    if (!enableSwipeToClose) return

    const velocity = info.velocity.y
    const offset = info.offset.y

    // Close threshold - swipe down significantly
    if (offset > 100 && velocity > 300) {
      onClose()
      return
    }

    // Find closest snap point
    const viewportHeight = window.innerHeight
    const currentPosition = offset / viewportHeight
    const targetSnap = snapPoints.reduce((closest, point, index) => {
      const closestDiff = Math.abs(snapPoints[closest] - currentPosition)
      const currentDiff = Math.abs(point - currentPosition)
      return currentDiff < closestDiff ? index : closest
    }, currentSnap)

    setCurrentSnap(targetSnap)
  }

  const handleSnapToNext = () => {
    if (currentSnap < snapPoints.length - 1) {
      setCurrentSnap(currentSnap + 1)
    }
  }

  const handleSnapToPrevious = () => {
    if (currentSnap > 0) {
      setCurrentSnap(currentSnap - 1)
    } else if (enableSwipeToClose) {
      onClose()
    }
  }

  // Reset to initial snap when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(initialSnap)
    }
  }, [isOpen, initialSnap])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          {enableBackdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />
          )}

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ 
              y: `${100 - (snapPoints[currentSnap] * 100)}%`,
            }}
            exit={{ y: '100%' }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: isDragging ? 0 : 0.4
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-slate-900 border-t border-slate-800 rounded-t-2xl",
              "shadow-2xl transform-gpu",
              className
            )}
            style={{
              height: currentHeight,
              minHeight: snapHeights[0]
            }}
          >
            {/* Handle Bar */}
            {showHandle && (
              <div className="flex items-center justify-center py-3 px-4">
                <div className="w-12 h-1 bg-slate-600 rounded-full cursor-grab active:cursor-grabbing" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <div className="flex items-center gap-2">
                  {/* Snap controls */}
                  {snapPoints.length > 1 && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        onClick={handleSnapToPrevious}
                        disabled={currentSnap === 0 && !enableSwipeToClose}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                        onClick={handleSnapToNext}
                        disabled={currentSnap === snapPoints.length - 1}
                      >
                        <ChevronDown className="w-4 h-4 rotate-180" />
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto px-4 py-2">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Specialized Trading Bottom Sheet
interface TradingBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  indexSymbol: string
  initialAction?: 'buy' | 'sell'
}

export function TradingBottomSheet({
  isOpen,
  onClose,
  indexSymbol,
  initialAction = 'buy'
}: TradingBottomSheetProps) {
  const [action, setAction] = useState<'buy' | 'sell'>(initialAction)
  const [amount, setAmount] = useState('')
  const [leverage, setLeverage] = useState(1)

  const leverageOptions = [1, 2, 5, 10, 20]

  const handleTrade = () => {
    console.log(`${action} ${indexSymbol} - Amount: $${amount}, Leverage: ${leverage}x`)
    onClose()
  }

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Trade ${indexSymbol}`}
      snapPoints={[0.5, 0.8]}
      initialSnap={0}
      className="md:hidden"
    >
      <div className="space-y-6">
        {/* Action Selector */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setAction('buy')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
              action === 'buy'
                ? "bg-green-600 text-white"
                : "text-slate-400 hover:text-white"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setAction('sell')}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all",
              action === 'sell'
                ? "bg-red-600 text-white"
                : "text-slate-400 hover:text-white"
            )}
          >
            Sell
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-brand focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        {/* Leverage Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            Leverage: {leverage}x
          </label>
          <div className="grid grid-cols-5 gap-2">
            {leverageOptions.map((lev) => (
              <button
                key={lev}
                onClick={() => setLeverage(lev)}
                className={cn(
                  "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  leverage === lev
                    ? "bg-brand text-black"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                )}
              >
                {lev}x
              </button>
            ))}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {['25', '50', '100', '500'].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              ${quickAmount}
            </button>
          ))}
        </div>

        {/* Trade Summary */}
        {amount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-lg p-4 space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Position Size:</span>
              <span className="text-white">${(parseFloat(amount || '0') * leverage).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Direction:</span>
              <span className={action === 'buy' ? 'text-green-400' : 'text-red-400'}>
                {action === 'buy' ? 'Buy' : 'Sell'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Trade Button */}
        <Button
          onClick={handleTrade}
          disabled={!amount || parseFloat(amount) <= 0}
          className={cn(
            "w-full py-4 text-lg font-semibold",
            action === 'buy'
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          )}
        >
          {action === 'buy' ? 'Buy' : 'Sell'} {indexSymbol}
        </Button>
      </div>
    </BottomSheet>
  )
}

export default BottomSheet
