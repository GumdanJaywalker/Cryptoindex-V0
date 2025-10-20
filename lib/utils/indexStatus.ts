/**
 * Index Status Utilities
 * Common utilities for handling index status colors and labels
 */

export type IndexStatus = 'bonding' | 'funding' | 'lp' | 'graduated';

export const INDEX_STATUS_CONFIG = {
  bonding: {
    color: 'bg-brand/20 text-brand border-brand/30',
    label: 'Bonding Curve',
    description: 'Initial launch phase with $50K target'
  },
  funding: {
    color: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
    label: 'Funding Round',
    description: 'Raising capital with $200K target'
  },
  lp: {
    color: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
    label: 'LP Round',
    description: 'Liquidity provision phase with $250K target'
  },
  graduated: {
    color: 'bg-green-400/20 text-green-400 border-green-400/30',
    label: 'Graduated',
    description: 'Successfully graduated to Layer-2'
  }
} as const;

/**
 * Get the color classes for a given index status
 */
export function getStatusColor(status: string): string {
  const config = INDEX_STATUS_CONFIG[status as IndexStatus];
  return config?.color ?? 'bg-slate-700/20 text-slate-400 border-slate-700/30';
}

/**
 * Get the display label for a given index status
 */
export function getStatusLabel(status: string): string {
  const config = INDEX_STATUS_CONFIG[status as IndexStatus];
  return config?.label ?? status;
}

/**
 * Get the description for a given index status
 */
export function getStatusDescription(status: string): string {
  const config = INDEX_STATUS_CONFIG[status as IndexStatus];
  return config?.description ?? '';
}

/**
 * Format a date string to relative time (e.g., "3d ago", "5h ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMins > 0) return `${diffMins}m ago`;
  return 'Just now';
}

/**
 * Format a date string to a user-friendly format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
