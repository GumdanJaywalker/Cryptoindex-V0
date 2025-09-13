'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'

export function DangerZone() {
  const { addToast } = useToast()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-900">
          <div>
            <div className="text-slate-200 text-sm">Sign out from all devices</div>
            <div className="text-xs text-slate-500">This will invalidate all active sessions.</div>
          </div>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={()=> addToast(createSuccessToast('Signed out', 'All sessions invalidated'))}>Sign out all</Button>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-900">
          <div>
            <div className="text-slate-200 text-sm">Delete account (mock)</div>
            <div className="text-xs text-slate-500">Irreversible. Removes your data from this device.</div>
          </div>
          <Button className="bg-red-600 hover:bg-red-700" onClick={()=> addToast(createErrorToast('Not available', 'Account deletion will be handled by support'))}>Delete</Button>
        </div>
      </CardContent></Card>
    </div>
  )
}

export default DangerZone

