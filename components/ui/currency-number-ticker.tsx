'use client'

import NumberTicker from '@/components/magicui/number-ticker'
import { useCurrency } from '@/lib/hooks/useCurrency'
import type { Currency } from '@/lib/types/currency'

interface CurrencyNumberTickerProps {
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
}

/**
 * NumberTicker wrapper that automatically handles currency conversion and formatting
 *
 * This component:
 * 1. Reads the user's selected currency from the store
 * 2. Converts the amount from HYPE to the selected currency
 * 3. Applies the correct prefix ($ for USD) or suffix (HYPE, USDC, etc.)
 * 4. Respects all the animation features of NumberTicker
 *
 * Usage:
 * ```tsx
 * // Will automatically use selected currency from Settings
 * <CurrencyNumberTicker value={1.2345} decimalPlaces={4} />
 *
 * // Force specific currency
 * <CurrencyNumberTicker value={1.2345} currency="USD" decimalPlaces={4} />
 * ```
 */
export function CurrencyNumberTicker({
  value,
  currency: overrideCurrency,
  decimalPlaces = 2,
  className = '',
  compact = false,
}: CurrencyNumberTickerProps) {
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

  // Format for compact notation if needed
  const formatCompact = (val: number): number => {
    if (!compact) return val
    const absVal = Math.abs(val)
    if (absVal >= 1_000_000) {
      return val / 1_000_000 // Will show as "X.XXM"
    }
    return val
  }

  const displayValue = formatCompact(convertedValue)
  const compactSuffix = compact && Math.abs(convertedValue) >= 1_000_000 ? 'M' : ''

  return (
    <NumberTicker
      value={displayValue}
      prefix={prefix}
      suffix={`${compactSuffix}${suffix}`}
      decimalPlaces={decimalPlaces}
      className={className}
    />
  )
}
