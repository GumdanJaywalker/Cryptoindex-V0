'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useIndexBuilder } from '@/hooks/use-index-builder'
import { AssetPicker } from '@/components/launch/AssetPicker'
import { WeightTable } from '@/components/launch/WeightTable'
import { useToast, createSuccessToast, createErrorToast } from '@/components/notifications/toast-system'
import { submitIndexSpec } from '@/lib/api/governance'
import { assetsCatalog } from '@/lib/mock/assets'

const steps = [
  'Basics',
  'Chain / Settlement',
  'Rules',
  'Constituents',
  'Simulation',
  'Review',
] as const

export function IndexBuilderWizard() {
  const {
    step,
    setStep,
    data,
    update,
    canContinue,
    getStepError,
    reset,
    lastSavedAt,
    saving,
  } = useIndexBuilder()
  const { addToast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  // Relative time ticker for Saved badge
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30000)
    return () => window.clearInterval(id)
  }, [])

  const formatRelative = (ts: number) => {
    const diffSec = Math.max(0, Math.floor((now - ts) / 1000))
    if (diffSec < 5) return 'just now'
    if (diffSec < 60) return `${diffSec}s ago`
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour}h ago`
    const diffDay = Math.floor(diffHour / 24)
    return `${diffDay}d ago`
  }

  const StepIndicator = useMemo(() => (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((label, i) => (
        <Button
          key={label}
          size="sm"
          variant={i === step ? 'default' : 'outline'}
          className={cn(
            'text-xs',
            i === step
              ? 'bg-brand text-black hover:bg-brand-hover'
              : 'border-slate-700 text-slate-300 hover:bg-slate-800'
          )}
          onClick={() => setStep(i)}
        >
          <span className="mr-2">{i + 1}.</span> {label}
        </Button>
      ))}
    </div>
  ), [step, setStep])

  const categoryOptions = ['Meme', 'AI', 'DeFi', 'Gaming', 'Chain', 'Theme', 'Other']
  const chainOptions = ['L3']
  const tokenOptions = ['USDC', 'USDT']
  const [categoryOther, setCategoryOther] = useState<string>('')
  const [isCategoryOther, setIsCategoryOther] = useState<boolean>(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Index</h1>
          <p className="text-slate-400 text-sm">Design your custom index spec and request governance review</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-brand border-brand/30">Draft</Badge>
          {saving ? (
            <span className="text-xs text-slate-400">Saving…</span>
          ) : lastSavedAt ? (
            <span
              className="text-xs text-slate-400"
              title={new Date(lastSavedAt).toLocaleString('en-US', { 
                year: 'numeric', month: 'short', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
              })}
            >
              Saved <span className="text-slate-300 ml-1">{formatRelative(lastSavedAt)}</span>
            </span>
          ) : null}
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      {StepIndicator}

      {/* Basics */}
      {step === 0 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400">Name</label>
                <Input
                  placeholder="e.g. DOG_INDEX"
                  value={data.basics.name}
                  onChange={(e) => update({ basics: { ...data.basics, name: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Symbol</label>
                <Input
                  placeholder="e.g. DOGX"
                  value={data.basics.symbol}
                  onChange={(e) => update({ basics: { ...data.basics, symbol: e.target.value.toUpperCase() } })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Category</label>
                <Select
                  value={isCategoryOther ? 'Other' : (data.basics.category || '')}
                  onValueChange={(v) => {
                    const isOther = v === 'Other'
                    setIsCategoryOther(isOther)
                    if (isOther) {
                      setCategoryOther('')
                      update({ basics: { ...data.basics, category: '' } })
                    } else {
                      setCategoryOther('')
                      update({ basics: { ...data.basics, category: v } })
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isCategoryOther && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter custom category"
                      value={categoryOther}
                      onChange={(e) => {
                        setCategoryOther(e.target.value)
                        update({ basics: { ...data.basics, category: e.target.value } })
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400">Description</label>
              <Input
                placeholder="Short description"
                value={data.basics.description}
                onChange={(e) => update({ basics: { ...data.basics, description: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm text-slate-400">Thumbnail Image</label>
                <Input
                  placeholder="Image URL (https://...)"
                  value={data.basics.thumbnail || ''}
                  onChange={(e) => update({ basics: { ...data.basics, thumbnail: e.target.value } })}
                />
                <div className="text-xs text-slate-500">권장: 정사각형 또는 4:3, PNG/JPEG/SVG. 큰 파일은 로컬 저장소에 저장 시 느릴 수 있습니다.</div>
                <div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (!f) return
                      const max = 2 * 1024 * 1024 // 2MB
                      if (f.size > max) {
                        alert('파일이 너무 큽니다 (2MB 이하 권장). URL 입력을 사용해 주세요.')
                        return
                      }
                      const reader = new FileReader()
                      reader.onload = () => {
                        update({ basics: { ...data.basics, thumbnail: String(reader.result || '') } })
                      }
                      reader.readAsDataURL(f)
                    }}
                    className="block text-sm text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700"
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <div className="text-sm text-slate-400 mb-2">Preview</div>
                <div className="w-full aspect-square rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden flex items-center justify-center">
                  {data.basics.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.basics.thumbnail} alt="thumbnail preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-xs text-slate-500">No thumbnail selected</div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chain / Settlement */}
      {step === 1 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400">Chain</label>
                <div className="p-2 h-10 flex items-center rounded-md border border-slate-700 bg-slate-900/50 text-slate-300">
                  L3
                  <span className="ml-2 text-xs text-slate-500">(fixed)</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Settlement Token</label>
                <Select
                  value={data.chain.settlementToken}
                  onValueChange={(v) => update({ chain: { ...data.chain, settlementToken: v } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokenOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Fee Currency</label>
                <Select
                  value={data.chain.feeToken}
                  onValueChange={(v) => update({ chain: { ...data.chain, feeToken: v } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokenOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Constituents */}
      {step === 3 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-slate-300 text-sm">Select assets and assign equal weights (or adjust later).</div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-brand text-black hover:bg-brand-hover">Select Assets</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-slate-950 border-slate-800 text-white">
                  <DialogHeader>
                    <DialogTitle>Asset Selector</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <AssetPicker
                      value={data.constituents.raw}
                      onChange={(raw) => update({ constituents: { ...data.constituents, raw } })}
                      minLiquidity={Number(data.rules.minLiquidity) || 0}
                      blacklist={[]}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {/* Inline warning if total != 100% or no assets */}
            {(() => {
              const err = getStepError(3)
              return err ? (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded p-3">
                  {err}
                </div>
              ) : null
            })()}
            <WeightTable
              value={data.constituents.raw}
              onChange={(raw) => update({ constituents: { ...data.constituents, raw } })}
              capPercent={Number(data.rules.maxPerAsset) || undefined}
            />
            <div className="text-xs text-slate-400">Total should equal 100% to continue.</div>
          </CardContent>
        </Card>
      )}

      {/* Rules (L3 indexes: no rebalance schedule) */}
      {step === 2 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400">Max per Asset (%)</label>
                <Input
                  placeholder="e.g. 35"
                  value={data.rules.maxPerAsset}
                  onChange={(e) => update({ rules: { ...data.rules, maxPerAsset: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Min Liquidity (USD)</label>
                <Input
                  placeholder="e.g. 1000000"
                  value={data.rules.minLiquidity}
                  onChange={(e) => update({ rules: { ...data.rules, minLiquidity: e.target.value } })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulation */}
      {step === 4 && (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6 space-y-2">
            {(() => {
              const parseRaw = (raw: string) => raw
                .split(',')
                .map((p) => p.trim())
                .filter(Boolean)
                .map((p) => {
                  const [s, w] = p.split(':').map((x) => x.trim())
                  return { symbol: (s || '').toUpperCase(), weight: Number(w) || 0 }
                })
              const parts = parseRaw(data.constituents.raw)
              const bySymbol = new Map(assetsCatalog.map((a) => [a.symbol.toUpperCase(), a]))
              let r1w = 0, r1m = 0, r1y = 0
              parts.forEach(({ symbol, weight }) => {
                const meta = bySymbol.get(symbol)
                if (!meta) return
                const w = weight / 100
                r1w += w * meta.ret1wPct
                r1m += w * meta.ret1mPct
                r1y += w * meta.ret1yPct
              })
              const n = parts.length
              const maxW = parts.reduce((m, p) => Math.max(m, p.weight), 0)
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-900/60 border-slate-800">
                    <CardContent className="p-4">
                      <div className="text-xs text-slate-400 mb-1">Composition</div>
                      <div className="text-sm text-white">Assets: {n || 0}</div>
                      <div className="text-sm text-white">Max weight: {maxW.toFixed(2)}%</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-900/60 border-slate-800">
                    <CardContent className="p-4">
                      <div className="text-xs text-slate-400 mb-1">Estimated Return</div>
                      <div className="text-sm text-white">1w: {r1w.toFixed(1)}%</div>
                      <div className="text-sm text-white">1m: {r1m.toFixed(1)}%</div>
                      <div className="text-sm text-white">1y: {r1y.toFixed(1)}%</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-900/60 border-slate-800">
                    <CardContent className="p-4">
                      <div className="text-xs text-slate-400 mb-1">Notes</div>
                      <div className="text-xs text-slate-400">Mock calculation based on catalog meta; not investment advice.</div>
                      <div className="text-xs text-slate-400">L3 indexes do not rebalance automatically.</div>
                    </CardContent>
                  </Card>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Review */}
      {step === 5 && (() => {
        const errors: string[] = []
        let firstInvalidStep: number | null = null
        for (let i = 0; i <= 3; i++) {
          const err = getStepError(i)
          if (err) {
            errors.push(`Step ${i + 1}: ${err}`)
            if (firstInvalidStep === null) firstInvalidStep = i
          }
        }
        // Validation checklist booleans
        const t = (v: string) => v.trim().length > 0
        const basicsOk = {
          name: t(data.basics.name) && data.basics.name.trim().length >= 3,
          symbol: t(data.basics.symbol) && data.basics.symbol.trim().length >= 2,
          category: t(data.basics.category),
          description: t(data.basics.description),
        }
        const chainOk = {
          chain: t(data.chain.chain),
          settlementToken: t(data.chain.settlementToken),
          feeToken: t(data.chain.feeToken),
        }
        const rulesOk = {
          maxPerAsset: Number.isFinite(Number(data.rules.maxPerAsset)) && Number(data.rules.maxPerAsset) > 0 && Number(data.rules.maxPerAsset) <= 100,
          minLiquidity: Number.isFinite(Number(data.rules.minLiquidity)) && Number(data.rules.minLiquidity) >= 0,
        }
        const parseRaw = (raw: string) => raw
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => {
            const [s, w] = p.split(':').map((x) => x.trim())
            return { symbol: (s || '').toUpperCase(), weight: Number(w) || 0 }
          })
        const items = parseRaw(data.constituents.raw)
        const total = items.reduce((s, i) => s + (Number.isFinite(i.weight) ? i.weight : 0), 0)
        const allValid = errors.length === 0
        const handleSubmit = async () => {
          if (!allValid || submitting) return
          setSubmitting(true)
          try {
            const spec = {
              basics: data.basics,
              chain: data.chain,
              constituents: items,
              rules: {
                maxPerAsset: Number(data.rules.maxPerAsset) || 0,
                minLiquidity: Number(data.rules.minLiquidity) || 0,
              },
            }
            const res = await submitIndexSpec(spec)
            addToast(createSuccessToast('Submitted for review', `Proposal ID: ${res.id}`))
          } catch (e: any) {
            addToast(createErrorToast('Submission failed', e?.message || 'Please try again later'))
          } finally {
            setSubmitting(false)
          }
        }
        return (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-6 space-y-4">
              <div className="text-slate-300">Review your index details before submitting for governance review.</div>

              {/* Validation checklist summary */}
              <div className="bg-slate-900/60 border border-slate-800 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">Validation checklist</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <div className={basicsOk.name ? 'text-green-400' : 'text-red-400'}>
                      Name {basicsOk.name ? '✓' : '• required (≥3 chars)'}
                    </div>
                    <div className={basicsOk.symbol ? 'text-green-400' : 'text-red-400'}>
                      Symbol {basicsOk.symbol ? '✓' : '• required (≥2 chars)'}
                    </div>
                    <div className={basicsOk.category ? 'text-green-400' : 'text-red-400'}>
                      Category {basicsOk.category ? '✓' : '• required'}
                    </div>
                    <div className={basicsOk.description ? 'text-green-400' : 'text-red-400'}>
                      Description {basicsOk.description ? '✓' : '• required'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className={chainOk.chain ? 'text-green-400' : 'text-red-400'}>
                      Chain {chainOk.chain ? '✓' : '• required'}
                    </div>
                    <div className={chainOk.settlementToken ? 'text-green-400' : 'text-red-400'}>
                      Settlement token {chainOk.settlementToken ? '✓' : '• required'}
                    </div>
                    <div className={chainOk.feeToken ? 'text-green-400' : 'text-red-400'}>
                      Fee currency {chainOk.feeToken ? '✓' : '• required'}
                    </div>
                    <div className={rulesOk.maxPerAsset ? 'text-green-400' : 'text-red-400'}>
                      Max per asset {rulesOk.maxPerAsset ? '✓' : '• 0–100'}
                    </div>
                    <div className={rulesOk.minLiquidity ? 'text-green-400' : 'text-red-400'}>
                      Min liquidity {rulesOk.minLiquidity ? '✓' : '• ≥ 0'}
                    </div>
                    <div className={items.length > 0 ? 'text-green-400' : 'text-red-400'}>
                      Constituents {items.length > 0 ? '✓' : '• select ≥1'}
                    </div>
                    <div className={Math.abs(total - 100) < 0.01 ? 'text-green-400' : 'text-red-400'}>
                      Weights total = 100% {Math.abs(total - 100) < 0.01 ? '✓' : `• now ${total.toFixed(2)}%`}
                    </div>
                  </div>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded p-3">
                  <div className="font-medium mb-1">Please resolve the following before submitting:</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/40 text-red-300 hover:bg-red-500/10"
                      onClick={() => {
                        if (firstInvalidStep !== null) setStep(firstInvalidStep)
                      }}
                    >
                      Go to first error
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-xs text-slate-400">Basics</div>
                    <div className="text-sm text-white">Name: {data.basics.name || '—'}</div>
                    <div className="text-sm text-white">Symbol: {data.basics.symbol || '—'}</div>
                    <div className="text-sm text-white">Category: {data.basics.category || '—'}</div>
                    <div className="text-xs text-slate-400">{data.basics.description || ''}</div>
                    <div>
                      <Button size="sm" variant="outline" className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setStep(0)}>Edit</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-xs text-slate-400">Chain / Settlement</div>
                    <div className="text-sm text-white">Chain: {data.chain.chain || '—'}</div>
                    <div className="text-sm text-white">Settlement: {data.chain.settlementToken || '—'}</div>
                    <div className="text-sm text-white">Fee: {data.chain.feeToken || '—'}</div>
                    <div>
                      <Button size="sm" variant="outline" className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setStep(1)}>Edit</Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-900/60 border-slate-800">
                  <CardContent className="p-4 space-y-2">
                    <div className="text-xs text-slate-400">Rules (L3)</div>
                    <div className="text-sm text-white">Max per asset: {data.rules.maxPerAsset || '—'}%</div>
                    <div className="text-sm text-white">Min liquidity: ${data.rules.minLiquidity || '—'}</div>
                    <div className="text-xs text-slate-400">No rebalancing on L3 indexes.</div>
                    <div>
                      <Button size="sm" variant="outline" className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setStep(2)}>Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-900/60 border-slate-800">
                <CardContent className="p-4">
                  <div className="text-xs text-slate-400 mb-2">Constituents (Total {total.toFixed(2)}%)</div>
                  {items.length === 0 ? (
                    <div className="text-sm text-slate-400">No assets selected.</div>
                  ) : (
                    <div className="text-sm text-white">
                      {items.map((i) => `${i.symbol} ${i.weight}%`).join(', ')}
                    </div>
                  )}
                  <div>
                    <Button size="sm" variant="outline" className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setStep(3)}>Edit</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-2">
                <Button
                  className="bg-brand text-black hover:bg-brand-hover"
                  onClick={handleSubmit}
                  disabled={!allValid || submitting}
                  title={!allValid ? 'Please fix the errors above before submitting' : undefined}
                >
                  Request Governance Review
                </Button>
                {!allValid && (
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={() => {
                      if (firstInvalidStep !== null) setStep(firstInvalidStep)
                    }}
                  >
                    Jump to error
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })()}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <div className="flex items-center gap-2">
          {step === steps.length - 1 ? (
            <></>
          ) : (
            <Button
              className="bg-brand text-black hover:bg-brand-hover"
              onClick={() => setStep(step + 1)}
              disabled={!canContinue(step)}
              title={!canContinue(step) ? (getStepError(step) || 'Please complete required fields') : undefined}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
