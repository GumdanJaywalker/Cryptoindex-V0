'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type BuilderData = {
  basics: {
    name: string
    symbol: string
    category: string
    description: string
  }
  chain: {
    chain: string
    settlementToken: string
    feeToken: string
  }
  constituents: {
    raw: string // placeholder until AssetPicker/WeightTable is wired
  }
  rules: {
    maxPerAsset: string
    minLiquidity: string
  }
}

const defaultData: BuilderData = {
  basics: { name: '', symbol: '', category: '', description: '' },
  chain: { chain: 'L3', settlementToken: 'USDC', feeToken: 'USDC' },
  constituents: { raw: '' },
  rules: { maxPerAsset: '35', minLiquidity: '1000000' },
}

const STORAGE_KEY = 'index-builder-draft-v1'

export function useIndexBuilder() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<BuilderData>(defaultData)

  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  // Hydration-safe: load draft after mount to avoid SSR/client mismatch
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        setData({ ...defaultData, ...JSON.parse(raw) })
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      setSaving(true)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setLastSavedAt(Date.now())
      // Small delay to show the transition from Saving... to Saved
      setTimeout(() => setSaving(false), 200)
    } catch {}
  }, [data])

  const update = useCallback((partial: Partial<BuilderData>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }, [])

  const reset = useCallback(() => {
    setData(defaultData)
    setStep(0)
  }, [])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.basics.symbol || 'index'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  // Minimal validation per step
  const getStepError = useCallback((s: number): string | null => {
    const t = (v: string) => v.trim().length > 0
    switch (s) {
      case 0: {
        const { name, symbol, category, description } = data.basics
        if (!t(name)) return 'Name is required'
        if (name.trim().length < 3) return 'Name must be at least 3 characters'
        if (!t(symbol)) return 'Symbol is required'
        if (symbol.trim().length < 2) return 'Symbol must be at least 2 characters'
        if (!t(category)) return 'Category is required'
        if (!t(description)) return 'Description is required'
        return null
      }
      case 1: {
        const { chain, settlementToken, feeToken } = data.chain
        if (!t(chain)) return 'Chain is required'
        if (!t(settlementToken)) return 'Settlement token is required'
        if (!t(feeToken)) return 'Fee currency is required'
        return null
      }
      case 2: {
        const max = Number(data.rules.maxPerAsset)
        const minLiq = Number(data.rules.minLiquidity)
        if (!Number.isFinite(max) || max <= 0 || max > 100) return 'Max per asset must be 0–100'
        if (!Number.isFinite(minLiq) || minLiq < 0) return 'Min liquidity must be a non-negative number'
        return null
      }
      case 3: {
        const parts = data.constituents.raw
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
        if (!parts.length) return 'Select at least one asset'
        let sum = 0
        for (const p of parts) {
          const value = Number(p.split(':')[1])
          if (Number.isFinite(value)) sum += value
        }
        if (Math.abs(sum - 100) >= 0.01) return 'Total weight must equal 100%'
        return null
      }
      default:
        return null
    }
  }, [data])

  const canContinue = useCallback((s: number) => getStepError(s) === null, [getStepError])

  return {
    step,
    setStep,
    data,
    update,
    exportJSON,
    canContinue,
    getStepError,
    reset,
    lastSavedAt,
    saving,
  }
}
