export type Preferences = { theme: string; lang: string; currency: string; timefmt: string }
export type Profile = { name: string; ens: string; email: string }
export type Notifications = { price: boolean; governance: boolean; trades: boolean; email: boolean }

const safeGet = (key: string) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const safeSet = (key: string, val: any) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

export const SettingsStorage = {
  getPreferences(): Preferences | null { return safeGet('settings:preferences') },
  savePreferences(p: Preferences) { safeSet('settings:preferences', p) },
  getProfile(): Profile | null { return safeGet('settings:profile') },
  saveProfile(p: Profile) { safeSet('settings:profile', p) },
  getNotifications(): Notifications | null { return safeGet('settings:notifications') },
  saveNotifications(n: Notifications) { safeSet('settings:notifications', n) },
}

