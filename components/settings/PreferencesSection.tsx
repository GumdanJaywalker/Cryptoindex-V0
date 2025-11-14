'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'
import { SettingsStorage } from '@/lib/settings/storage'
import { savePreferences } from '@/lib/api/settings'
import { useCurrencyStore } from '@/lib/store/currency-store'
import type { Currency } from '@/lib/types/currency'

export function PreferencesSection() {
  const { addToast } = useToast()
  const { currency: storeCurrency, setCurrency: setStoreCurrency } = useCurrencyStore()
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('en')
  const [currency, setCurrency] = useState<Currency>(storeCurrency)
  const [timefmt, setTimefmt] = useState('24h')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const saved = SettingsStorage.getPreferences()
    if (saved) {
      setTheme(saved.theme)
      setLang(saved.lang)
      // Use currency from store if available, otherwise from saved preferences
      setCurrency((saved.currency as Currency) || storeCurrency)
      setTimefmt(saved.timefmt)
    } else {
      // Set default to HYPE if no saved preferences
      setCurrency('HYPE')
    }
  }, [storeCurrency])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Preferences</h2>
      <Card className="glass-card-dynamic border-teal"><CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">Time Format</div>
            <Select value={timefmt} onValueChange={setTimefmt}>
              <SelectTrigger className="bg-teal-card border-teal"><SelectValue placeholder="Time Format" /></SelectTrigger>
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
                // Update currency store
                setStoreCurrency(currency)
                // Save to backend and localStorage
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
