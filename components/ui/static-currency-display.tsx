'use client'

import { useCurrency } from '@/lib/hooks/useCurrency'
import type { Currency } from '@/lib/types/currency'
import { cn } from '@/lib/utils'

interface StaticCurrencyDisplayProps {
  /** The amount in HYPE (base currency) */
  value: number
  /** Override the selected currency (optional) */
  currency?: Currency
  /** Number of decimal places */
  decimalPlaces?: number
  /** Additional CSS classes */
  className?: string
  /** Whether to use compact notation (K, M, B) */
  compact?: boolean
  /** Custom prefix (overrides currency prefix) */
  customPrefix?: string
  /** Custom suffix (overrides currency suffix) */
  customSuffix?: string
}

/**
 * Static number display (no animation) for trading UI
 *
 * Provides instant, flicker-free number updates without spring animations.
 * Ideal for real-time trading interfaces where immediate feedback is critical.
 *
 * Usage:
 * ```tsx
 * <StaticCurrencyDisplay value={1.2345} decimalPlaces={4} />
 * ```
 */
export function StaticCurrencyDisplay({
  value,
  currency: overrideCurrency,
  decimalPlaces = 2,
  className = '',
  compact = false,
  customPrefix,
  customSuffix,
}: StaticCurrencyDisplayProps) {
  const { currency: selectedCurrency, convertCurrency } = useCurrency()
  const targetCurrency = overrideCurrency || selectedCurrency

  // Convert amount from HYPE to target currency
  const convertedValue = convertCurrency(value, 'HYPE', targetCurrency)

  // Get prefix and suffix based on currency
  const getDisplay = (curr: Currency) => {
    switch (curr) {
      case 'USD':
        return { prefix: '$', suffix: '' }
      case 'HYPE':
        return { prefix: '', suffix: ' HYPE' }
      case 'USDC':
        return { prefix: '', suffix: ' USDC' }
      case 'USDT':
        return { prefix: '', suffix: ' USDT' }
      case 'BTC':
        return { prefix: '', suffix: ' BTC' }
      default:
        return { prefix: '', suffix: '' }
    }
  }

  const { prefix, suffix } = getDisplay(targetCurrency)
  const finalPrefix = customPrefix !== undefined ? customPrefix : prefix
  const finalSuffix = customSuffix !== undefined ? customSuffix : suffix

  // Format for compact notation if needed
  const formatCompact = (val: number): { value: number; suffix: string } => {
    if (!compact) return { value: val, suffix: '' }

    const absVal = Math.abs(val)
    if (absVal >= 1_000_000_000) {
      return { value: val / 1_000_000_000, suffix: 'B' }
    }
    if (absVal >= 1_000_000) {
      return { value: val / 1_000_000, suffix: 'M' }
    }
    if (absVal >= 1_000) {
      return { value: val / 1_000, suffix: 'K' }
    }
    return { value: val, suffix: '' }
  }

  const { value: displayValue, suffix: compactSuffix } = formatCompact(convertedValue)
  const formattedValue = displayValue.toFixed(decimalPlaces)

  return (
    <span className={cn("tabular-nums", className)}>
      {finalPrefix}{formattedValue}{compactSuffix}{finalSuffix}
    </span>
  )
}
