'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'
import { SettingsStorage } from '@/lib/settings/storage'
import { savePreferences } from '@/lib/api/settings'

export function PreferencesSection() {
  const { addToast } = useToast()
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('en')
  const [currency, setCurrency] = useState('USD')
  const [timefmt, setTimefmt] = useState('24h')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = SettingsStorage.getPreferences()
    if (saved) {
      setTheme(saved.theme)
      setLang(saved.lang)
      setCurrency(saved.currency)
      setTimefmt(saved.timefmt)
    }
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Preferences</h2>
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">Currency</div>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue placeholder="Currency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="HYPE">HYPE</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Time Format</div>
            <Select value={timefmt} onValueChange={setTimefmt}>
              <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue placeholder="Time Format" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24‑hour</SelectItem>
                <SelectItem value="12h">12‑hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-brand text-black hover:bg-brand-hover"
            disabled={saving}
            onClick={async ()=> {
              try {
                setSaving(true)
                await savePreferences({ theme, lang, currency, timefmt })
                SettingsStorage.savePreferences({ theme, lang, currency, timefmt })
                addToast(createSuccessToast('Saved', 'Preferences updated'))
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

export default PreferencesSection
