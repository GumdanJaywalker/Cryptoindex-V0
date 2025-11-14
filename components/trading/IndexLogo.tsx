'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface IndexLogoProps {
  symbol: string
  logoUrl?: string
  logoGradient?: string
  size?: number
  className?: string
}

export function IndexLogo({
  symbol,
  logoUrl,
  logoGradient,
  size = 20,
  className
}: IndexLogoProps) {
  const [hasError, setHasError] = useState(false)

  // Clean symbol for display
  const cleanSymbol = symbol.replace('_INDEX', '')

  // Try to load image if URL is provided
  if (logoUrl && !hasError) {
    return (
      <img
        src={logoUrl}
        alt={cleanSymbol}
        onError={() => setHasError(true)}
        className={cn("rounded-full", className)}
        style={{ width: size, height: size }}
      />
    )
  }

  // Fallback: Gradient background with initials
  const initials = cleanSymbol.slice(0, 2).toUpperCase()
  const defaultGradient = logoGradient || "bg-gradient-to-br from-brand/80 to-brand"

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center",
        defaultGradient,
        className
      )}
      style={{ width: size, height: size }}
    >
      <span
        className="font-bold text-white"
        style={{ fontSize: size * 0.45 }}
      >
        {initials}
      </span>
    </div>
  )
}
