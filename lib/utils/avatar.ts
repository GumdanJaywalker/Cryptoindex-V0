// Deterministic avatar generator using DiceBear v7
// Uses multiple collections and background colors to increase variety

const collections = [
  'adventurer',
  'avataaars',
  'bottts',
  'micah',
  'pixel-art',
  'shapes',
]

const bgPalette = [
  'b6e3f4', // light blue
  'c0aede', // lilac
  'd1d4f9', // periwinkle
  'ffd5dc', // pink
  'ffdfbf', // peach
  'e0f2fe', // sky
  'dcfce7', // green
  'fee2e2', // red
]

function hashString(input: string): number {
  let h = 2166136261 >>> 0 // FNV-1a base
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function getAvatarUrl(seedRaw: string, opts?: { size?: number }) {
  const seed = seedRaw || 'anonymous'
  const h = hashString(seed)
  const style = collections[h % collections.length]
  const bg = bgPalette[h % bgPalette.length]
  const size = opts?.size && Number.isFinite(opts.size) ? Math.max(32, Math.min(320, Math.floor(opts.size))) : undefined

  const params = new URLSearchParams({
    seed,
    backgroundType: 'gradientLinear',
    backgroundColor: bg,
    radius: '50',
  })
  if (size) params.set('size', String(size))

  return `https://api.dicebear.com/7.x/${style}/svg?${params.toString()}`
}

