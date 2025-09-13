'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { PreferencesSection } from '@/components/settings/PreferencesSection'
import { NotificationsSection } from '@/components/settings/NotificationsSection'
import { SecuritySection } from '@/components/settings/SecuritySection'
import { ConnectionsSection } from '@/components/settings/ConnectionsSection'
import { ApiKeysSection } from '@/components/settings/ApiKeysSection'
import { DangerZone } from '@/components/settings/DangerZone'

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-16">
      <Header />
      <div className="px-4 lg:px-6 py-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account, preferences, and security.</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-0">
            <Tabs value={tab} onValueChange={setTab} className="flex flex-col lg:flex-row">
              {/* Left rail */}
              <div className="lg:w-56 border-b lg:border-b-0 lg:border-r border-slate-800 p-3 lg:p-4">
                <TabsList className="flex lg:flex-col w-full gap-1 bg-transparent p-0">
                  {[
                    { key: 'profile', label: 'Profile' },
                    { key: 'preferences', label: 'Preferences' },
                    { key: 'notifications', label: 'Notifications' },
                    { key: 'security', label: 'Security' },
                    { key: 'connections', label: 'Connections' },
                    { key: 'apikeys', label: 'API Keys' },
                    { key: 'danger', label: 'Danger Zone' },
                  ].map((x) => (
                    <TabsTrigger
                      key={x.key}
                      value={x.key}
                      className="justify-start data-[state=active]:bg-brand data-[state=active]:text-black text-slate-300 text-sm"
                    >
                      {x.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Right content */}
              <div className="flex-1 p-4 lg:p-6">
                <TabsContent value="profile" className="m-0"><ProfileSection /></TabsContent>
                <TabsContent value="preferences" className="m-0"><PreferencesSection /></TabsContent>
                <TabsContent value="notifications" className="m-0"><NotificationsSection /></TabsContent>
                <TabsContent value="security" className="m-0"><SecuritySection /></TabsContent>
                <TabsContent value="connections" className="m-0"><ConnectionsSection /></TabsContent>
                <TabsContent value="apikeys" className="m-0"><ApiKeysSection /></TabsContent>
                <TabsContent value="danger" className="m-0"><DangerZone /></TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

