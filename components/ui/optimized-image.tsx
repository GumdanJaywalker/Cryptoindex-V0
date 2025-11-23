'use client'

import { useState, useRef, useEffect, memo, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useLazyImage } from '@/lib/hooks/use-performance'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  placeholder?: string
  quality?: number
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

/**
 * Performance Optimized Image Component
 * - Lazy Loading
 * - WebP format support
 * - Placeholder display
 * - Progressive loading
 */
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  quality = 75,
  priority = false,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState<string | undefined>()

  const { imgRef, src: lazySrc, isLoaded, onLoad: handleLazyLoad } = useLazyImage(src, {
    threshold: 0.1,
    rootMargin: '50px'
  })

  // Detect WebP support
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null)

  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const dataURL = canvas.toDataURL('image/webp')
        setSupportsWebP(dataURL.indexOf('data:image/webp') === 0)
      } else {
        setSupportsWebP(false)
      }
    }

    checkWebPSupport()
  }, [])

  // Generate optimized image URL
  const optimizedSrc = useMemo(() => {
    if (!lazySrc || supportsWebP === null) return undefined

    // Use image CDN service in production
    const params = new URLSearchParams()

    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    if (quality !== 75) params.set('q', quality.toString())
    if (supportsWebP) params.set('f', 'webp')

    // Example: URL transformation for Cloudinary, ImageKit, etc.
    return `${lazySrc}?${params.toString()}`
  }, [lazySrc, width, height, quality, supportsWebP])

  const handleLoad = () => {
    handleLazyLoad()
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
    onError?.()
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-teal-card text-slate-400 text-sm",
          className
        )}
        style={{ width, height }}
      >
        Image failed to load
      </div>
    )
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-teal-card animate-pulse flex items-center justify-center"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!placeholder && (
            <div className="w-8 h-8 border-2 border-teal border-t-brand rounded-full animate-spin" />
          )}
        </div>
      )}

      {/* Actual image */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      {/* 로딩 오버레이 - shimmer effect removed for cleaner UX */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-teal-card/50" />
      )}
    </div>
  )
})

/**
 * Optimized Image Component for Avatars
 */
export const OptimizedAvatar = memo(function OptimizedAvatar({
  src,
  alt,
  size = 40,
  fallback,
  className
}: {
  src?: string
  alt: string
  size?: number
  fallback?: string
  className?: string
}) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-slate-700 text-slate-300 font-medium rounded-full",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("rounded-full", className)}
      onError={() => setImageError(true)}
      quality={85}
    />
  )
})

export default OptimizedImage