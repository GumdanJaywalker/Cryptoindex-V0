'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast, createSuccessToast } from '@/components/notifications/toast-system'

export function ConnectionsSection() {
  const { addToast } = useToast()
  const items = [
    { name: 'Twitter/X', connected: false },
    { name: 'Discord', connected: true },
  ]
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Connections</h2>
      <Card className="glass-card-dynamic border-teal"><CardContent className="p-4 space-y-3">
        {items.map((s) => (
          <div key={s.name} className="flex items-center justify-between p-3 rounded-lg border border-teal bg-teal-card">
            <div className="text-slate-200 text-sm">{s.name}</div>
            {s.connected ? (
              <Button variant="outline" className="border-teal text-slate-300 hover:bg-teal-card/50" onClick={()=> addToast(createSuccessToast('Disconnected', `${s.name} disconnected`))}>Disconnect</Button>
            ) : (
              <Button className="bg-brand text-black hover:bg-brand-hover" onClick={()=> addToast(createSuccessToast('Connected', `${s.name} connected`))}>Connect</Button>
            )}
          </div>
        ))}
      </CardContent></Card>
    </div>
  )
}

export default ConnectionsSection

