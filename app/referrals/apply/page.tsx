'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'

export default function ApplyInfluencerPage() {
  const { addToast } = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    avgViews: '',
    followers: '',
    notes: ''
  })
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }
  const onSubmit = () => {
    const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email)
    const numeric = (s: string) => Number(String(s).replace(/[^0-9.]/g, ''))
    const followersNum = numeric(form.followers)
    const avgViewsNum = numeric(form.avgViews)

    if (!form.name || !form.email) {
      addToast(createErrorToast('Missing fields', 'Name and Email are required'))
      return
    }
    if (!emailOk) {
      addToast(createErrorToast('Invalid email', 'Please enter a valid email address'))
      return
    }
    // Require at least one social handle
    if (!form.twitter && !form.youtube && !form.tiktok) {
      addToast(createErrorToast('Missing socials', 'Provide at least one social handle or channel'))
      return
    }
    // Basic eligibility hints
    if (followersNum < 5000 && avgViewsNum < 5000) {
      addToast(createErrorToast('Low reach', 'Followers or Avg. Views should be at least 5,000'))
      return
    }
    addToast(createSuccessToast('Application submitted', 'We will review and get back to you.'))
    setForm({ name: '', email: '', twitter: '', youtube: '', tiktok: '', avgViews: '', followers: '', notes: '' })
  }
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-4 lg:px-6 py-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Apply for Influencer Tier</h1>
          <p className="text-slate-400 text-sm mt-1">If your promotional reach is significant, apply to be reviewed for Influencer tier.</p>
        </div>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Name</div>
                <Input name="name" value={form.name} onChange={onChange} placeholder="Your name" className="bg-slate-900 border-slate-700" />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Email</div>
                <Input name="email" value={form.email} onChange={onChange} placeholder="you@example.com" className="bg-slate-900 border-slate-700" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Twitter/X</div>
                <Input name="twitter" value={form.twitter} onChange={onChange} placeholder="@handle" className="bg-slate-900 border-slate-700" />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">YouTube</div>
                <Input name="youtube" value={form.youtube} onChange={onChange} placeholder="channel URL" className="bg-slate-900 border-slate-700" />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">TikTok</div>
                <Input name="tiktok" value={form.tiktok} onChange={onChange} placeholder="@handle" className="bg-slate-900 border-slate-700" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">Avg. Views per Post</div>
                <Input name="avgViews" value={form.avgViews} onChange={onChange} placeholder="e.g. 20,000" className="bg-slate-900 border-slate-700" />
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Followers (primary channel)</div>
                <Input name="followers" value={form.followers} onChange={onChange} placeholder="e.g. 120,000" className="bg-slate-900 border-slate-700" />
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Notes</div>
              <Textarea name="notes" value={form.notes} onChange={onChange} placeholder="Tell us about your audience and previous promotions" className="bg-slate-900 border-slate-700 min-h-[120px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Link href="/referrals" className="text-xs px-3 py-2 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800">Cancel</Link>
              <Button className="bg-brand text-black hover:bg-brand-hover" onClick={onSubmit}>Submit Application</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
