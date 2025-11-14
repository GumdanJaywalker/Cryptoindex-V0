import type { Currency, CurrencyFormatOptions, ExchangeRates } from '@/lib/types/currency'

/**
 * Format a number with thousand separators and decimal places
 */
function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * Format large numbers with compact notation (e.g., 1.2M, 3.5B)
 */
function formatCompact(value: number, decimals: number = 2): string {
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(decimals)}B`
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(decimals)}M`
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(decimals)}K`
  }
  return formatNumber(value, decimals)
}

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  exchangeRates: ExchangeRates
): number {
  if (from === to) return amount

  // Convert from HYPE to target
  if (from === 'HYPE') {
    switch (to) {
      case 'USD':
        return amount * exchangeRates.HYPE_USD
      case 'USDC':
        return amount * exchangeRates.HYPE_USDC
      case 'USDT':
        return amount * exchangeRates.HYPE_USDT
      case 'BTC':
        return amount * exchangeRates.HYPE_BTC
      case 'HIIN':
        return amount * exchangeRates.HYPE_HIIN
      case 'HIDE':
        return amount * exchangeRates.HYPE_HIDE
      default:
        return amount
    }
  }

  // Convert from target to HYPE (inverse)
  if (to === 'HYPE') {
    switch (from) {
      case 'USD':
        return amount / exchangeRates.HYPE_USD
      case 'USDC':
        return amount / exchangeRates.HYPE_USDC
      case 'USDT':
        return amount / exchangeRates.HYPE_USDT
      case 'BTC':
        return amount / exchangeRates.HYPE_BTC
      case 'HIIN':
        return amount / exchangeRates.HYPE_HIIN
      case 'HIDE':
        return amount / exchangeRates.HYPE_HIDE
      default:
        return amount
    }
  }

  // For non-HYPE pairs, convert through HYPE
  const inHype = convertCurrency(amount, from, 'HYPE', exchangeRates)
  return convertCurrency(inHype, 'HYPE', to, exchangeRates)
}

/**
 * Get currency symbol or suffix
 */
function getCurrencyDisplay(currency: Currency): { prefix: string; suffix: string } {
  switch (currency) {
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
    case 'HIIN':
      return { prefix: '', suffix: ' $HIIN' }
    case 'HIDE':
      return { prefix: '', suffix: ' $HIDE' }
    default:
      return { prefix: '', suffix: '' }
  }
}

/**
 * Main currency formatting function
 *
 * @param amount - The numeric amount to format
 * @param currency - The currency to display
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * Examples:
 * - formatCurrency(1234.56, 'HYPE') => "1,234.56 HYPE"
 * - formatCurrency(1234.56, 'USD') => "$1,234.56"
 * - formatCurrency(1234567, 'USDC', { compact: true }) => "1.23M USDC"
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  options: CurrencyFormatOptions = {}
): string {
  const {
    decimals = 2,
    showSymbol = true,
    compact = false,
    forceSign = false,
  } = options

  const { prefix, suffix } = getCurrencyDisplay(currency)
  const sign = forceSign && amount > 0 ? '+' : ''
  const formattedNumber = compact ? formatCompact(amount, decimals) : formatNumber(amount, decimals)

  if (!showSymbol) {
    return `${sign}${formattedNumber}`
  }

  return `${sign}${prefix}${formattedNumber}${suffix}`
}

/**
 * Format price displays (typically 4 decimal places)
 *
 * @param amount - The price amount in HYPE
 * @param currency - The target currency to display
 * @param exchangeRates - Exchange rates for conversion
 * @returns Formatted price string
 *
 * Examples:
 * - formatPrice(1.2345, 'HYPE', rates) => "1.2345 HYPE"
 * - formatPrice(1.2345, 'USD', rates) => "$1.54" (if 1 HYPE = 1.25 USD)
 */
export function formatPrice(amount: number, currency: Currency, exchangeRates?: ExchangeRates): string {
  const convertedAmount = exchangeRates
    ? convertCurrency(amount, 'HYPE', currency, exchangeRates)
    : amount
  return formatCurrency(convertedAmount, currency, { decimals: 4 })
}

/**
 * Format percentage change (always with sign)
 *
 * @param percentage - The percentage value
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 *
 * Examples:
 * - formatPercentage(5.67) => "+5.67%"
 * - formatPercentage(-2.34) => "-2.34%"
 */
export function formatPercentage(percentage: number, decimals: number = 2): string {
  const sign = percentage >= 0 ? '+' : ''
  return `${sign}${percentage.toFixed(decimals)}%`
}

/**
 * Format fee amount (ALWAYS in HYPE, regardless of user preference)
 *
 * @param amount - The fee amount in HYPE
 * @param decimals - Number of decimal places
 * @returns Formatted fee string
 *
 * Examples:
 * - formatFee(0.12) => "0.12 HYPE"
 * - formatFee(0.123456, 4) => "0.1235 HYPE"
 */
export function formatFee(amount: number, decimals: number = 2): string {
  return formatCurrency(amount, 'HYPE', { decimals })
}

/**
 * Format gas cost (ALWAYS in HYPE, regardless of user preference)
 *
 * @param amount - The gas cost in HYPE
 * @param decimals - Number of decimal places
 * @returns Formatted gas string
 *
 * Examples:
 * - formatGas(1.5) => "1.50 HYPE"
 * - formatGas(1.234567, 4) => "1.2346 HYPE"
 */
export function formatGas(amount: number, decimals: number = 2): string {
  return formatCurrency(amount, 'HYPE', { decimals })
}

/**
 * Format volume with compact notation
 *
 * @param amount - The volume amount in HYPE
 * @param currency - The target currency to display
 * @param exchangeRates - Exchange rates for conversion
 * @returns Formatted volume string
 *
 * Examples:
 * - formatVolume(2340000, 'HYPE', rates) => "2.34M HYPE"
 * - formatVolume(2340000, 'USD', rates) => "$2.93M" (if 1 HYPE = 1.25 USD)
 */
export function formatVolume(amount: number, currency: Currency, exchangeRates?: ExchangeRates): string {
  const convertedAmount = exchangeRates
    ? convertCurrency(amount, 'HYPE', currency, exchangeRates)
    : amount
  return formatCurrency(convertedAmount, currency, { compact: true })
}

/**
 * Format balance/equity displays
 *
 * @param amount - The balance amount in HYPE
 * @param currency - The target currency to display
 * @param exchangeRates - Exchange rates for conversion
 * @returns Formatted balance string
 *
 * Examples:
 * - formatBalance(8492.50, 'HYPE', rates) => "8,492.50 HYPE"
 * - formatBalance(8492.50, 'USD', rates) => "$10,615.63" (if 1 HYPE = 1.25 USD)
 */
export function formatBalance(amount: number, currency: Currency, exchangeRates?: ExchangeRates): string {
  const convertedAmount = exchangeRates
    ? convertCurrency(amount, 'HYPE', currency, exchangeRates)
    : amount
  return formatCurrency(convertedAmount, currency, { decimals: 2 })
}

/**
 * Format PnL (Profit and Loss) with sign and color indicator
 *
 * @param amount - The PnL amount in HYPE
 * @param currency - The target currency to display
 * @param exchangeRates - Exchange rates for conversion
 * @returns Object with formatted string and color class
 *
 * Examples:
 * - formatPnL(342.18, 'HYPE', rates) => { text: "+342.18 HYPE", colorClass: "hl-accent-green" }
 * - formatPnL(-123.45, 'USD', rates) => { text: "-$154.31", colorClass: "hl-accent-red" }
 */
export function formatPnL(
  amount: number,
  currency: Currency,
  exchangeRates?: ExchangeRates
): { text: string; colorClass: string } {
  const convertedAmount = exchangeRates
    ? convertCurrency(amount, 'HYPE', currency, exchangeRates)
    : amount
  const formatted = formatCurrency(convertedAmount, currency, { decimals: 2, forceSign: true })
  const colorClass = amount >= 0 ? 'hl-accent-green' : 'hl-accent-red'
  return { text: formatted, colorClass }
}
