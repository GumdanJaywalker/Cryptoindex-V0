'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { PreferencesSection } from '@/components/settings/PreferencesSection'
import { NotificationsSection } from '@/components/settings/NotificationsSection'
import { SecuritySection } from '@/components/settings/SecuritySection'
import { ApiKeysSection } from '@/components/settings/ApiKeysSection'
import { DangerZone } from '@/components/settings/DangerZone'

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')

  return (
    <div className="min-h-screen bg-teal-base text-white">
      <div className="px-4 lg:px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your account, preferences, and security.</p>
        </div>

        <Card className="glass-card-dynamic border-teal h-[60vh] overflow-hidden">
          <CardContent className="p-0 h-full">
            <Tabs value={tab} onValueChange={setTab} className="flex flex-col lg:flex-row h-[60vh]">
              {/* Left rail */}
              <div className="lg:w-52 border-b lg:border-b-0 lg:border-r border-teal p-3 lg:p-6 flex lg:flex-col h-full">
                <div className="flex-1 flex items-center justify-center w-full">
                  <TabsList className="flex lg:flex-col items-center justify-center w-full gap-1 bg-transparent p-0">
                    {[
                      { key: 'profile', label: 'Profile' },
                      { key: 'preferences', label: 'Preferences' },
                      { key: 'notifications', label: 'Notifications' },
                      { key: 'security', label: 'Security' },
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
              </div>

              {/* Right content */}
              <div className="flex-1 p-4 lg:p-8 overflow-auto">
                <TabsContent value="profile" className="m-0"><ProfileSection /></TabsContent>
                <TabsContent value="preferences" className="m-0"><PreferencesSection /></TabsContent>
                <TabsContent value="notifications" className="m-0"><NotificationsSection /></TabsContent>
                <TabsContent value="security" className="m-0"><SecuritySection /></TabsContent>
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
