export type Preferences = { theme: string; lang: string; currency: string; timefmt: string }
export type Profile = { name: string; ens: string; email: string }
export type Notifications = { price: boolean; governance: boolean; trades: boolean; email: boolean }

async function simulateLatency(ms = 500) {
  await new Promise((r) => setTimeout(r, ms))
}

export async function savePreferences(prefs: Preferences): Promise<{ ok: true }> {
  await simulateLatency(400)
  return { ok: true }
}

export async function saveProfile(profile: Profile): Promise<{ ok: true }> {
  await simulateLatency(500)
  return { ok: true }
}

export async function saveNotifications(notifs: Notifications): Promise<{ ok: true }> {
  await simulateLatency(300)
  return { ok: true }
}

export async function updatePassword(newPassword: string): Promise<{ ok: true }> {
  await simulateLatency(600)
  return { ok: true }
}

