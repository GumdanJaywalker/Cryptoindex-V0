'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Touch gesture detection hook
export function useSwipeGestures(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const touchEndRef = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    touchEndRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!touchStartRef.current || !touchEndRef.current) return

    const deltaX = touchEndRef.current.x - touchStartRef.current.x
    const deltaY = touchEndRef.current.y - touchStartRef.current.y

    // Determine if swipe is more horizontal or vertical
    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY)

    if (isHorizontal) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }

    touchStartRef.current = null
    touchEndRef.current = null
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold])

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

// Long press detection hook
export function useLongPress(
  onLongPress: () => void,
  onClick?: () => void,
  delay: number = 500
) {
  const [isLongPress, setIsLongPress] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const start = useCallback(() => {
    setIsLongPress(false)
    timeoutRef.current = setTimeout(() => {
      setIsLongPress(true)
      onLongPress()
    }, delay)
  }, [onLongPress, delay])

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const clickHandler = useCallback(() => {
    if (!isLongPress && onClick) {
      onClick()
    }
  }, [isLongPress, onClick])

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
    onClick: clickHandler
  }
}

// Pull to refresh hook
export function usePullToRefresh(
  onRefresh: () => Promise<void> | void,
  threshold: number = 80,
  maxPull: number = 120
) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const startY = useRef<number>(0)
  const currentY = useRef<number>(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only trigger if at top of page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || isRefreshing) return

    currentY.current = e.touches[0].clientY
    const pullDistance = Math.max(0, currentY.current - startY.current)
    
    if (pullDistance > 0) {
      // Prevent default scrolling when pulling
      e.preventDefault()
      setPullDistance(Math.min(pullDistance, maxPull))
    }
  }, [isPulling, isRefreshing, maxPull])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
      }
    }

    setIsPulling(false)
    setPullDistance(0)
    startY.current = 0
    currentY.current = 0
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh])

  // Calculate pull progress (0-1)
  const pullProgress = Math.min(pullDistance / threshold, 1)

  return {
    isPulling,
    pullDistance,
    pullProgress,
    isRefreshing,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}

// Pinch to zoom hook
export function usePinchZoom(
  onZoom?: (scale: number) => void,
  minScale: number = 0.5,
  maxScale: number = 3
) {
  const [scale, setScale] = useState(1)
  const [isPinching, setIsPinching] = useState(false)
  
  const lastDistance = useRef<number>(0)
  const initialScale = useRef<number>(1)

  const getDistance = (touches: TouchList) => {
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPinching(true)
      lastDistance.current = getDistance(e.touches)
      initialScale.current = scale
    }
  }, [scale])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPinching || e.touches.length !== 2) return

    e.preventDefault()
    
    const currentDistance = getDistance(e.touches)
    const scaleChange = currentDistance / lastDistance.current
    const newScale = Math.min(
      Math.max(initialScale.current * scaleChange, minScale),
      maxScale
    )

    setScale(newScale)
    onZoom?.(newScale)
  }, [isPinching, minScale, maxScale, onZoom])

  const handleTouchEnd = useCallback(() => {
    setIsPinching(false)
    lastDistance.current = 0
  }, [])

  const reset = useCallback(() => {
    setScale(1)
    onZoom?.(1)
  }, [onZoom])

  return {
    scale,
    isPinching,
    reset,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  }
}

// Double tap hook
export function useDoubleTap(
  onSingleTap?: () => void,
  onDoubleTap?: () => void,
  delay: number = 300
) {
  const tapCountRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTap = useCallback(() => {
    tapCountRef.current += 1

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (tapCountRef.current === 1) {
        onSingleTap?.()
      } else if (tapCountRef.current === 2) {
        onDoubleTap?.()
      }
      tapCountRef.current = 0
    }, delay)
  }, [onSingleTap, onDoubleTap, delay])

  return { onTap: handleTap }
}

// Touch-friendly scroll behavior
export function useTouchScroll(elementRef: React.RefObject<HTMLElement>) {
  const [isScrolling, setIsScrolling] = useState(false)
  const momentumRef = useRef<{ velocity: number; lastTime: number; lastY: number }>({
    velocity: 0,
    lastTime: 0,
    lastY: 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const element = elementRef.current
    if (!element) return

    let animationFrame: number

    const handleTouchStart = (e: TouchEvent) => {
      setIsScrolling(true)
      const touch = e.touches[0]
      momentumRef.current = {
        velocity: 0,
        lastTime: Date.now(),
        lastY: touch.clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const now = Date.now()
      const deltaTime = now - momentumRef.current.lastTime
      const deltaY = touch.clientY - momentumRef.current.lastY

      if (deltaTime > 0) {
        momentumRef.current.velocity = deltaY / deltaTime
      }

      momentumRef.current.lastTime = now
      momentumRef.current.lastY = touch.clientY
    }

    const handleTouchEnd = () => {
      setIsScrolling(false)
      
      // Apply momentum scrolling
      const applyMomentum = () => {
        const { velocity } = momentumRef.current
        if (Math.abs(velocity) > 0.1) {
          const newScrollTop = element.scrollTop - velocity * 16
          element.scrollTop = Math.max(0, Math.min(newScrollTop, element.scrollHeight - element.clientHeight))
          momentumRef.current.velocity *= 0.95 // Decay
          animationFrame = requestAnimationFrame(applyMomentum)
        }
      }

      if (Math.abs(momentumRef.current.velocity) > 0.5) {
        applyMomentum()
      }
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [elementRef])

  return { isScrolling }
}

// Haptic feedback hook (for supported devices)
export function useHapticFeedback() {
  const triggerImpact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[style])
    }
  }, [])

  const triggerSelection = useCallback(() => {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return
    
    if ('vibrate' in navigator) {
      navigator.vibrate([5])
    }
  }, [])

  const triggerNotification = useCallback((type: 'success' | 'warning' | 'error' = 'success') => {
    if (typeof window === 'undefined' || !('vibrate' in navigator)) return
    
    if ('vibrate' in navigator) {
      const patterns = {
        success: [10, 50, 10],
        warning: [20, 100, 20],
        error: [50, 100, 50]
      }
      navigator.vibrate(patterns[type])
    }
  }, [])

  return {
    triggerImpact,
    triggerSelection,
    triggerNotification
  }
}

export default {
  useSwipeGestures,
  useLongPress,
  usePullToRefresh,
  usePinchZoom,
  useDoubleTap,
  useTouchScroll,
  useHapticFeedback
}