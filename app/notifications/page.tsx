"use client"

import NotificationsFilters from '@/components/notifications/NotificationsFilters'
import NotificationList from '@/components/notifications/NotificationList'

export default function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-white">Notifications</h1>
        <p className="text-sm text-cryptoindex-warm/90 mt-1">
          Stay on top of trades, governance, alerts, and referrals.
        </p>
      </div>

      <div className="mb-4">
        <NotificationsFilters />
      </div>

      <NotificationList />
    </div>
  )
}

