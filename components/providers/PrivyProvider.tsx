'use client'

import React from 'react'
import { PrivyProvider as CorePrivyProvider } from '@privy-io/react-auth'
import { privyConfig } from '@/lib/privy/config'

interface Props { children: React.ReactNode }

// Wrap app with real Privy provider (falls back to pass-through if misconfigured)
export function PrivyProvider({ children }: Props) {
  const appId = (privyConfig as any)?.appId as string | undefined
  if (!appId) return <>{children}</>
  return (
    <CorePrivyProvider appId={appId} config={privyConfig as any}>
      {children}
    </CorePrivyProvider>
  )
}
