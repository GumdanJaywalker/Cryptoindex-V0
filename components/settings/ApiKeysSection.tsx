'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useToast, createSuccessToast } from '@/components/notifications/toast-system'

export function ApiKeysSection() {
  const { addToast } = useToast()
  const [key, setKey] = useState('')

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">API Keys</h2>
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Input value={key} onChange={(e)=>setKey(e.target.value)} placeholder="Generated key will appear here" className="bg-slate-900 border-slate-700" />
          <Button className="bg-brand text-black hover:bg-brand-hover" onClick={()=> { setKey(`hk_${Math.random().toString(36).slice(2,10)}`); addToast(createSuccessToast('Key created', 'New key generated')) }}>Create</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={()=> addToast(createSuccessToast('Rotated', 'Key rotated'))}>Rotate</Button>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={()=> { setKey(''); addToast(createSuccessToast('Deleted', 'Key deleted')) }}>Delete</Button>
        </div>
      </CardContent></Card>
    </div>
  )
}

export default ApiKeysSection

