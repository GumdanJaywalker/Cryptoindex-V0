'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'
import { SettingsStorage } from '@/lib/settings/storage'
import { saveProfile } from '@/lib/api/settings'

export function ProfileSection() {
  const { addToast } = useToast()
  const [name, setName] = useState('')
  const [ens, setEns] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = SettingsStorage.getProfile()
    if (saved) { setName(saved.name); setEns(saved.ens); setEmail(saved.email) }
  }, [])

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
          <Button
            className="bg-brand text-black hover:bg-brand-hover"
            disabled={saving}
            onClick={async ()=> {
              const emailOk = !email || /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)
              if (!name.trim()) { addToast(createErrorToast('Invalid name', 'Please enter your nickname')); return }
              if (!emailOk) { addToast(createErrorToast('Invalid email', 'Please enter a valid email')); return }
              try {
                setSaving(true)
                await saveProfile({ name, ens, email })
                SettingsStorage.saveProfile({ name, ens, email })
                addToast(createSuccessToast('Saved', 'Profile updated'))
              } catch (e: any) {
                addToast(createErrorToast('Failed', e?.message || 'Please try again'))
              } finally {
                setSaving(false)
              }
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </CardContent></Card>
    </div>
  )
}

export default ProfileSection
