"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'
import { useEffect, useState } from 'react'
import { SettingsStorage } from '@/lib/settings/storage'
import { saveNotifications } from '@/lib/api/settings'

export function NotificationsSection() {
  const { addToast } = useToast()
  const [price, setPrice] = useState(true)
  const [governance, setGovernance] = useState(true)
  const [trades, setTrades] = useState(true)
  const [email, setEmail] = useState(false)

  useEffect(() => {
    const saved = SettingsStorage.getNotifications()
    if (saved) { setPrice(saved.price); setGovernance(saved.governance); setTrades(saved.trades); setEmail(saved.email) }
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Notifications</h2>
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-3">
        {[
          { key: 'price', label: 'Price Alerts', state: price, set: setPrice },
          { key: 'governance', label: 'Governance Updates', state: governance, set: setGovernance },
          { key: 'trades', label: 'Trade Executions', state: trades, set: setTrades },
          { key: 'email', label: 'Email Notifications', state: email, set: setEmail },
        ].map((t) => (
          <label key={t.key} className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-900">
            <span className="text-slate-200 text-sm">{t.label}</span>
            <input type="checkbox" checked={t.state as boolean} onChange={(e)=> (t.set as any)(e.target.checked)} className="h-4 w-4" />
          </label>
        ))}
        <div className="flex justify-end">
          <Button
            className="bg-brand text-black hover:bg-brand-hover"
            onClick={async ()=> {
              try {
                await saveNotifications({ price, governance, trades, email })
                SettingsStorage.saveNotifications({ price, governance, trades, email })
                addToast(createSuccessToast('Saved', 'Notifications updated'))
              } catch (e: any) {
                addToast(createErrorToast('Failed', e?.message || 'Please try again'))
              }
            }}
          >
            Save
          </Button>
        </div>
      </CardContent></Card>
    </div>
  )
}

export default NotificationsSection
