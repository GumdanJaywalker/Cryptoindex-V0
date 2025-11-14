/**
 * Brand Color Constants
 *
 * Centralized color definitions for consistent theming across the app.
 * Updated: 2025-11-05
 */

export const BRAND_COLORS = {
  // Primary brand color (teal)
  primary: '#75cfc1',
  primaryDark: '#5db9aa',
  primaryLight: '#a4ddd4',

  // Profit/Loss colors (user-specified)
  profit: '#4ade80',  // Softer green for gains
  loss: '#dd7789',    // Red for losses (user-specified, not #f87171)

  // Layer badges (simplified: L1/Partner, L2/VS Battle)
  layer: {
    L1_PARTNER: '#98FCE4',    // Mint for L1/Partner indexes
    L2_VS_BATTLE: '#7DD9C8',  // Teal for L2/VS Battle indexes
  },

  // Legacy individual layer colors (for reference, can be removed later)
  layerLegacy: {
    L1: '#98FCE4',
    L2: '#7DD9C8',
    L3: '#A8FFE8',
    VS: '#B4E8FF',
    PARTNER: '#C4F0E8',
  }
} as const

export type BrandColors = typeof BRAND_COLORS
