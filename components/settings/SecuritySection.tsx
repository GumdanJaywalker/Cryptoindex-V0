'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'
import { updatePassword } from '@/lib/api/settings'
import { Shield, Copy, Check } from 'lucide-react'

export function SecuritySection() {
  const { addToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  // 2FA states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [copiedCode, setCopiedCode] = useState(false)
  const [backupCodes] = useState([
    'ABCD-EFGH-IJKL',
    'MNOP-QRST-UVWX',
    'YZAB-CDEF-GHIJ',
    'KLMN-OPQR-STUV',
    'WXYZ-1234-5678',
    '9012-3456-7890'
  ])
  const secretKey = 'JBSWY3DPEHPK3PXP' // Mock secret for demo

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

  const handleCopySecret = () => {
    navigator.clipboard.writeText(secretKey)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
    addToast(createSuccessToast('Copied', 'Secret key copied to clipboard'))
  }

  const handleEnable2FA = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      addToast(createErrorToast('Invalid code', 'Enter a 6-digit code'))
      return
    }
    setTwoFactorEnabled(true)
    setShowSetup(false)
    setVerificationCode('')
    addToast(createSuccessToast('2FA Enabled', 'Two-factor authentication is now active'))
  }

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false)
    addToast(createSuccessToast('2FA Disabled', 'Two-factor authentication has been turned off'))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Security</h2>

      {/* Two-Factor Authentication */}
      <Card className="glass-card-dynamic border-teal">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-xs text-slate-400">
                  {twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security to your account'}
                </div>
              </div>
            </div>
            {!showSetup && (
              <Button
                variant={twoFactorEnabled ? "outline" : "default"}
                className={twoFactorEnabled
                  ? "border-teal text-slate-300 hover:bg-teal-card/50"
                  : "bg-brand text-black hover:bg-brand-hover"}
                onClick={() => twoFactorEnabled ? handleDisable2FA() : setShowSetup(true)}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable'}
              </Button>
            )}
          </div>

          {/* Setup Flow */}
          {showSetup && !twoFactorEnabled && (
            <div className="space-y-4 pt-4 border-t border-teal">
              <div className="text-sm text-slate-300">
                1. Scan this QR code with your authenticator app
              </div>

              {/* QR Code Placeholder */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center text-black text-xs">
                    QR Code<br/>Placeholder
                  </div>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="bg-teal-card/50 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-2">Or enter this key manually:</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono bg-teal-card px-3 py-2 rounded border border-teal">
                    {secretKey}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopySecret}
                    className="hover:bg-teal-card/70"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Verification */}
              <div>
                <div className="text-sm text-slate-300 mb-2">
                  2. Enter the 6-digit code from your app
                </div>
                <Input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="bg-teal-card border-teal text-center text-lg tracking-widest font-mono"
                />
              </div>

              {/* Backup Codes */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <div className="text-sm font-medium text-amber-400 mb-2">Save your backup codes</div>
                <div className="text-xs text-slate-300 mb-3">
                  Store these codes in a safe place. You can use them to access your account if you lose your device.
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {backupCodes.map((code, i) => (
                    <code key={i} className="text-xs font-mono bg-teal-card px-2 py-1 rounded">
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSetup(false)
                    setVerificationCode('')
                  }}
                  className="border-teal hover:bg-teal-card/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEnable2FA}
                  className="bg-brand text-black hover:bg-brand-hover"
                  disabled={verificationCode.length !== 6}
                >
                  Verify & Enable
                </Button>
              </div>
            </div>
          )}

          {/* When Enabled - Show Status */}
          {twoFactorEnabled && (
            <div className="pt-4 border-t border-teal space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check className="w-4 h-4" />
                <span>2FA is protecting your account</span>
              </div>
              <div className="text-xs text-slate-400">
                You&apos;ll be asked for a verification code when signing in from a new device.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="glass-card-dynamic border-teal"><CardContent className="p-4 space-y-3">
        <div>
          <div className="text-xs text-slate-400 mb-1">New Password</div>
          <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="bg-teal-card border-teal" />
          <div className="mt-1 text-xs text-slate-400">Strength: <span className="text-slate-200">{strengthLabel}</span></div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1">Confirm Password</div>
          <Input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="••••••••" className="bg-teal-card border-teal" />
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
