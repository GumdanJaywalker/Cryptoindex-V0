'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'

export function ProfileSection() {
  const { addToast } = useToast()
  const [name, setName] = useState('')
  const [ens, setEns] = useState('')
  const [email, setEmail] = useState('')

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Profile</h2>
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-3">
        <div>
          <div className="text-xs text-slate-400 mb-1">Nickname</div>
          <Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your display name" className="bg-slate-900 border-slate-700" />
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">ENS</div>
          <Input value={ens} onChange={(e)=>setEns(e.target.value)} placeholder="e.g., degen.eth" className="bg-slate-900 border-slate-700" />
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Email (for notifications)</div>
          <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" className="bg-slate-900 border-slate-700" />
        </div>
        <div className="flex justify-end">
          <Button className="bg-brand text-black hover:bg-brand-hover" onClick={()=> addToast(createSuccessToast('Saved', 'Profile updated'))}>Save</Button>
        </div>
      </CardContent></Card>
    </div>
  )
}

export default ProfileSection

