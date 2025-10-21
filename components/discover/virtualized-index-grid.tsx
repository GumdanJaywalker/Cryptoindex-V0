"use client";

import { useRef, useEffect, useState } from 'react'
import { Grid } from 'react-window'
import { IndexDetailCard } from './index-detail-card'
import type { MemeIndex } from '@/lib/types/index-trading'

interface VirtualizedIndexGridProps {
  indices: MemeIndex[]
  onIndexClick: (index: MemeIndex) => void
}

export function VirtualizedIndexGrid({ indices, onIndexClick }: VirtualizedIndexGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({
    width: 1200,
    height: 800,
    columnCount: 3,
    rowCount: 0,
  })

  // Calculate grid dimensions based on viewport
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const viewportHeight = window.innerHeight - 300 // Account for header and other UI

      // Determine column count based on screen width
      let columnCount = 3 // lg: 3 columns
      if (containerWidth < 768) {
        columnCount = 1 // mobile: 1 column
      } else if (containerWidth < 1024) {
        columnCount = 2 // md: 2 columns
      }

      const rowCount = Math.ceil(indices.length / columnCount)

      setDimensions({
        width: containerWidth,
        height: Math.min(viewportHeight, rowCount * 440), // 440px per row (400px card + 40px gap)
        columnCount,
        rowCount,
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [indices.length])

  // If no indices, return empty state (handled by parent)
  if (indices.length === 0) {
    return null
  }

  // Cell renderer for the grid
  const Cell = ({ 
    ariaAttributes, 
    columnIndex, 
    rowIndex, 
    style 
  }: {
    ariaAttributes: { 'aria-colindex': number; role: 'gridcell' }
    columnIndex: number
    rowIndex: number
    style: React.CSSProperties
  }) => {
    const index = rowIndex * dimensions.columnCount + columnIndex
    const indexData = indices[index]

    if (!indexData) return null

    return (
      <div
        {...ariaAttributes}
        style={{
          ...style,
          padding: '8px', // 8px gap on each side = 16px total gap
        }}
      >
        <IndexDetailCard index={indexData} onClick={() => onIndexClick(indexData)} />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full">
      <Grid
        cellComponent={Cell}
        cellProps={{}}
        columnCount={dimensions.columnCount}
        columnWidth={dimensions.width / dimensions.columnCount}
        defaultHeight={dimensions.height}
        rowCount={dimensions.rowCount}
        rowHeight={440} // Card height (400px) + gap (40px)
        defaultWidth={dimensions.width}
        className="scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900"
      />
    </div>
  )
}
