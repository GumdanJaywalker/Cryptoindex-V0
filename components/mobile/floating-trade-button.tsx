'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  X,
  ChevronUp,
  ArrowUpDown
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingTradeButtonProps {
  onQuickTrade?: (type: 'buy' | 'sell') => void
  selectedIndex?: string
  className?: string
}

export function FloatingTradeButton({
  onQuickTrade,
  selectedIndex = 'MEME',
  className
}: FloatingTradeButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [quickMode, setQuickMode] = useState<'buy' | 'sell' | null>(null)

  const handleQuickTrade = (type: 'buy' | 'sell') => {
    setQuickMode(type)
    onQuickTrade?.(type)
    
    // 2초 후 자동으로 닫기
    setTimeout(() => {
      setQuickMode(null)
      setIsExpanded(false)
    }, 2000)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (quickMode) setQuickMode(null)
  }

  return (
    <>
      {/* 백그라운드 오버레이 (확장시) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* 메인 플로팅 버튼 */}
      <div className={cn("fixed bottom-20 right-4 z-50 md:hidden", className)}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="mb-3 space-y-2"
            >
              {/* Buy Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleQuickTrade('buy')}
                  className="w-16 h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-xl border-2 border-green-500 relative overflow-hidden"
                  disabled={quickMode === 'buy'}
                >
                  <motion.div
                    animate={quickMode === 'buy' ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <TrendingUp className="w-7 h-7" />
                  </motion.div>
                  
                  {quickMode === 'buy' && (
                    <motion.div
                      className="absolute inset-0 bg-green-400"
                      initial={{ scale: 0, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </Button>
              </motion.div>

              {/* Sell Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleQuickTrade('sell')}
                  className="w-16 h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-xl border-2 border-red-500 relative overflow-hidden"
                  disabled={quickMode === 'sell'}
                >
                  <motion.div
                    animate={quickMode === 'sell' ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, -180, -360]
                    } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <TrendingDown className="w-7 h-7" />
                  </motion.div>
                  
                  {quickMode === 'sell' && (
                    <motion.div
                      className="absolute inset-0 bg-red-400"
                      initial={{ scale: 0, opacity: 0.8 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </Button>
              </motion.div>

              {/* 현재 선택된 인덱스 표시 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Badge 
                  variant="outline" 
                  className="bg-slate-900/80 text-brand border-brand/50 px-3 py-1"
                >
                  {selectedIndex}
                </Badge>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 메인 토글 버튼 */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isExpanded ? { rotate: 45 } : { rotate: 0 }}
        >
          <Button
            onClick={toggleExpanded}
            className="w-16 h-16 rounded-2xl bg-brand text-black hover:bg-brand-hover shadow-2xl relative overflow-hidden group"
          >
            <motion.div
              animate={isExpanded ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Zap className="w-7 h-7" />
            </motion.div>
            
            <motion.div
              animate={isExpanded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <X className="w-7 h-7" />
            </motion.div>

            {/* 펄스 효과 */}
            <motion.div
              className="absolute inset-0 bg-brand rounded-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </Button>
        </motion.div>

        {/* 성공 피드백 */}
        <AnimatePresence>
          {quickMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              <div className={cn(
                "px-3 py-1 rounded-lg text-xs font-semibold text-white shadow-lg",
                quickMode === 'buy' ? "bg-green-600" : "bg-red-600"
              )}>
                {quickMode === 'buy' ? 'Buy Order Submitted!' : 'Sell Order Submitted!'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

// 스마트 위치 조정이 가능한 고급 플로팅 버튼
interface SmartFloatingTradeButtonProps extends FloatingTradeButtonProps {
  avoidElements?: string[] // 피해야 할 요소들의 선택자
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  autoHide?: boolean // 스크롤시 자동 숨김
}

export function SmartFloatingTradeButton({
  avoidElements = [],
  position = 'bottom-right',
  autoHide = true,
  ...props
}: SmartFloatingTradeButtonProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // 스크롤 감지
  useEffect(() => {
    if (typeof window === 'undefined' || !autoHide) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // 아래로 스크롤시 숨김, 위로 스크롤시 표시
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [autoHide, lastScrollY])

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-20 left-4'
      case 'top-right':
        return 'top-20 right-4'
      case 'top-left':
        return 'top-20 left-4'
      default:
        return 'bottom-20 right-4'
    }
  }

  return (
    <motion.div
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20,
        scale: isVisible ? 1 : 0.8
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("fixed z-50 md:hidden", getPositionClasses())}
    >
      <FloatingTradeButton {...props} className="" />
    </motion.div>
  )
}

export default FloatingTradeButton