'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'
import { updatePassword } from '@/lib/api/settings'

export function SecuritySection() {
  const { addToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  const score = (() => {
    let s = 0
    if (password.length >= 8) s++
    if (/[A-Z]/.test(password)) s++
    if (/[a-z]/.test(password)) s++
    if (/[0-9]/.test(password)) s++
    if (/[^A-Za-z0-9]/.test(password)) s++
    return s
  })()
  const strengthLabel = ['Very weak','Weak','Fair','Good','Strong','Very strong'][score]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Security</h2>
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-3">
        <div>
          <div className="text-xs text-slate-400 mb-1">New Password</div>
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="bg-slate-900 border-slate-700" />
          <div className="mt-1 text-xs text-slate-400">Strength: <span className="text-slate-200">{strengthLabel}</span></div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Confirm Password</div>
          <Input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="••••••••" className="bg-slate-900 border-slate-700" />
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-brand text-black hover:bg-brand-hover"
            disabled={saving}
            onClick={async ()=> {
              if (!password || password !== confirm) { addToast(createErrorToast('Error', 'Password mismatch')); return }
              if (password.length < 8) { addToast(createErrorToast('Weak password', 'Use at least 8 characters')); return }
              try {
                setSaving(true)
                await updatePassword(password)
                setPassword(''); setConfirm('')
                addToast(createSuccessToast('Saved', 'Password updated'))
              } catch (e: any) {
                addToast(createErrorToast('Failed', e?.message || 'Please try again'))
              } finally {
                setSaving(false)
              }
            }}
          >
            {saving ? 'Updating…' : 'Update Password'}
          </Button>
        </div>
      </CardContent></Card>
    </div>
  )
}

export default SecuritySection
