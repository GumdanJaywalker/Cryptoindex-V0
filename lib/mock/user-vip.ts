/**
 * Mock VIP Tier Data
 *
 * In production, this will come from user profile/backend
 * For now, defaulting to VIP2 (0.4% protocol fee)
 */

import { VIPTier } from '@/lib/constants/fees'

/**
 * Mock user VIP tier
 * VIP2 is a reasonable middle tier (30% of users according to spec)
 */
export const MOCK_USER_VIP_TIER: VIPTier = VIPTier.VIP2

/**
 * Mock invited user status
 * Invited users get 10% discount on all fees
 */
export const MOCK_IS_INVITED_USER: boolean = false

/**
 * Get current user's VIP tier
 * In production, this would fetch from backend/user profile
 */
export function getUserVIPTier(): VIPTier {
  // TODO: Replace with actual user profile fetch
  return MOCK_USER_VIP_TIER
}

/**
 * Get invited user status
 * In production, this would fetch from backend/user profile
 */
export function getIsInvitedUser(): boolean {
  // TODO: Replace with actual user profile fetch
  return MOCK_IS_INVITED_USER
}

/**
 * Check if user qualifies for invited user discount
 */
export function hasInvitedUserDiscount(): boolean {
  return getIsInvitedUser()
}
