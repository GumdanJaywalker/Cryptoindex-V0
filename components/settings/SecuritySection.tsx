'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'

export function SecuritySection() {
  const { addToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Security</h2>
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-3">
        <div>
          <div className="text-xs text-slate-400 mb-1">New Password</div>
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="bg-slate-900 border-slate-700" />
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Confirm Password</div>
          <Input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="••••••••" className="bg-slate-900 border-slate-700" />
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-brand text-black hover:bg-brand-hover"
            onClick={()=> {
              if (!password || password !== confirm) { addToast(createErrorToast('Error', 'Password mismatch')); return }
              addToast(createSuccessToast('Saved', 'Password updated'))
            }}
          >
            Update Password
          </Button>
        </div>
      </CardContent></Card>
    </div>
  )
}

export default SecuritySection

