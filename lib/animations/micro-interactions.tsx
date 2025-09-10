'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'motion/react'

// 숫자 카운트업 훅
export function useCountUp(
  target: number,
  duration: number = 1000,
  decimals: number = 2,
  startOnMount: boolean = true
) {
  const [current, setCurrent] = useState(startOnMount ? 0 : target)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const animate = (to: number) => {
    if (isAnimating) return
    
    setIsAnimating(true)
    const startValue = current
    const difference = to - startValue
    const startTime = Date.now()
    
    const updateValue = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const value = startValue + (difference * easedProgress)
      
      setCurrent(value)
      
      if (progress < 1) {
        requestAnimationFrame(updateValue)
      } else {
        setCurrent(to)
        setIsAnimating(false)
      }
    }
    
    requestAnimationFrame(updateValue)
  }
  
  useEffect(() => {
    if (startOnMount) {
      animate(target)
    }
  }, [target, startOnMount])
  
  return {
    value: Number(current.toFixed(decimals)),
    animate: (to: number) => animate(to),
    isAnimating
  }
}

// 가격 플래시 효과 훅
export function usePriceFlash(value: number, duration: number = 1000) {
  const [flashState, setFlashState] = useState<'none' | 'up' | 'down'>('none')
  const [previousValue, setPreviousValue] = useState(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  useEffect(() => {
    if (value !== previousValue) {
      const direction = value > previousValue ? 'up' : 'down'
      setFlashState(direction)
      
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      
      timeoutRef.current = setTimeout(() => {
        setFlashState('none')
      }, duration)
      
      setPreviousValue(value)
    }
    
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [value, previousValue, duration])
  
  const getFlashStyles = () => {
    switch (flashState) {
      case 'up':
        return {
          backgroundColor: 'rgba(34, 197, 94, 0.2)', // green-500 with opacity
          transition: `background-color ${duration}ms ease-out`
        }
      case 'down':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.2)', // red-500 with opacity
          transition: `background-color ${duration}ms ease-out`
        }
      default:
        return {
          backgroundColor: 'transparent',
          transition: `background-color ${duration}ms ease-out`
        }
    }
  }
  
  return {
    flashState,
    flashStyles: getFlashStyles(),
    isFlashing: flashState !== 'none'
  }
}

// 스프링 애니메이션 숫자 컴포넌트
interface AnimatedNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
  enableFlash?: boolean
  [key: string]: any
}

export function AnimatedNumber({
  value,
  decimals = 2,
  prefix = '',
  suffix = '',
  className = '',
  duration = 800,
  enableFlash = true,
  ...props
}: AnimatedNumberProps) {
  const countUp = useCountUp(value, duration, decimals, false)
  const flash = usePriceFlash(value, 600)
  
  // 값이 변경될 때 애니메이션 시작
  useEffect(() => {
    countUp.animate(value)
  }, [value])
  
  return (
    <span
      className={className}
      style={enableFlash ? flash.flashStyles : undefined}
      {...props}
    >
      {prefix}{countUp.value.toLocaleString()}{suffix}
    </span>
  )
}

// 퍼센트 변화 애니메이션 컴포넌트
interface AnimatedPercentageProps {
  value: number
  showSign?: boolean
  className?: string
  [key: string]: any
}

export function AnimatedPercentage({
  value,
  showSign = true,
  className = '',
  ...props
}: AnimatedPercentageProps) {
  const flash = usePriceFlash(value, 800)
  const countUp = useCountUp(value, 600, 2, false)
  
  useEffect(() => {
    countUp.animate(value)
  }, [value])
  
  const isPositive = value > 0
  const displayValue = countUp.value
  
  return (
    <span
      className={`font-semibold ${
        isPositive ? 'text-green-400' : 'text-red-400'
      } ${className}`}
      style={flash.flashStyles}
      {...props}
    >
      {showSign && displayValue !== 0 && (isPositive ? '+' : '')}{displayValue.toFixed(2)}%
    </span>
  )
}

// 펄스 애니메이션
export const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 0.6,
    ease: "easeInOut",
    times: [0, 0.5, 1]
  }
}

// 바운스 애니메이션
export const bounceAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 0.5,
    ease: "easeOut",
    times: [0, 0.3, 1]
  }
}

// 흔들림 애니메이션
export const shakeAnimation = {
  x: [0, -5, 5, -5, 5, 0],
  transition: {
    duration: 0.5,
    ease: "easeInOut"
  }
}

// 로딩 스피너 애니메이션
export const spinAnimation = {
  rotate: 360,
  transition: {
    duration: 1,
    ease: "linear",
    repeat: Infinity
  }
}

// 스케일 호버 애니메이션
export const scaleHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
}

// 타입라이터 효과 훅
export function useTypewriter(text: string, speed: number = 50) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  useEffect(() => {
    if (!text) return
    
    setIsTyping(true)
    setDisplayText('')
    
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text[index])
        index++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, speed)
    
    return () => clearInterval(timer)
  }, [text, speed])
  
  return { displayText, isTyping }
}

// 카운터 배지 애니메이션
interface AnimatedBadgeProps {
  count: number
  maxDisplay?: number
  className?: string
  [key: string]: any
}

export function AnimatedBadge({
  count,
  maxDisplay = 99,
  className = '',
  ...props
}: AnimatedBadgeProps) {
  const [prevCount, setPrevCount] = useState(count)
  const [isAnimating, setIsAnimating] = useState(false)
  
  const displayCount = count > maxDisplay ? `${maxDisplay}+` : count.toString()
  
  useEffect(() => {
    if (count !== prevCount) {
      setIsAnimating(true)
      const timeout = setTimeout(() => {
        setIsAnimating(false)
        setPrevCount(count)
      }, 300)
      
      return () => clearTimeout(timeout)
    }
  }, [count, prevCount])
  
  if (count === 0) return null
  
  return (
    <motion.div
      className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full ${className}`}
      animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {displayCount}
    </motion.div>
  )
}

// 프로그레스 바 애니메이션
interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  duration?: number
  [key: string]: any
}

export function AnimatedProgress({
  value,
  max = 100,
  className = '',
  barClassName = '',
  duration = 1000,
  ...props
}: AnimatedProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={`w-full bg-slate-700 rounded-full h-2 overflow-hidden ${className}`} {...props}>
      <motion.div
        className={`h-full bg-gradient-to-r from-brand to-brand/80 rounded-full ${barClassName}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: duration / 1000, ease: "easeOut" }}
      />
    </div>
  )
}

// 부드러운 스크롤 애니메이션
export function useSmoothScroll() {
  const scrollTo = (elementId: string, offset: number = 0) => {
    const element = document.getElementById(elementId)
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + offset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }
  
  return { scrollTo }
}

// 요소 등장 애니메이션 설정
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" }
}

export const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.3, ease: "easeOut" }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: { duration: 0.4, ease: "easeOut" }
}

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.4, ease: "easeOut" }
}

// Stagger 애니메이션 컨테이너
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
}

// 인터섹션 옵저버 훅 (스크롤 트리거용)
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  
  useEffect(() => {
    if (!ref.current) return
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      threshold: 0.1,
      ...options
    })
    
    observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [ref, options])
  
  return isIntersecting
}
