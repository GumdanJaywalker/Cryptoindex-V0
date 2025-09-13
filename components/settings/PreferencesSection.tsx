'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast, createSuccessToast } from '@/components/notifications/toast-system'

export function PreferencesSection() {
  const { addToast } = useToast()
  const [theme, setTheme] = useState('dark')
  const [lang, setLang] = useState('en')
  const [currency, setCurrency] = useState('USD')
  const [timefmt, setTimefmt] = useState('24h')

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Preferences</h2>
      <Card className="bg-slate-900/50 border-slate-800"><CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-1">Theme</div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue placeholder="Theme" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Language</div>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue placeholder="Language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ko">한국어</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-1">Currency</div>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-slate-900 border-slate-700"><SelectValue placeholder="Currency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="KRW">KRW</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
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
          <Button className="bg-brand text-black hover:bg-brand-hover" onClick={()=> addToast(createSuccessToast('Saved', 'Preferences updated'))}>Save</Button>
        </div>
      </CardContent></Card>
    </div>
  )
}

export default PreferencesSection

