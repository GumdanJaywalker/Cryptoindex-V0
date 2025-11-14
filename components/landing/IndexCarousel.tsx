'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MemeIndex } from '@/lib/types/index-trading'
import { CompactIndexCard } from './CompactIndexCard'
import { cn } from '@/lib/utils'

interface IndexCarouselProps {
  indexes: MemeIndex[]
  onCardClick?: (index: MemeIndex) => void
}

export function IndexCarousel({ indexes, onCardClick }: IndexCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  // Group indexes into pages of 6 (3 rows x 2 cols)
  const pages = []
  for (let i = 0; i < indexes.length; i += 6) {
    pages.push(indexes.slice(i, i + 6))
  }

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (pages.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No trending indexes available
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {pages.map((page, pageIdx) => (
            <div key={pageIdx} className="flex-[0_0_100%] min-w-0 px-1">
              {/* 3 rows x 2 cols Grid */}
              <div className="grid grid-cols-2 grid-rows-3 gap-4">
                {page.map((index) => (
                  <CompactIndexCard
                    key={index.id}
                    index={index}
                    onClick={() => onCardClick?.(index)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Show on Hover */}
      {pages.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-teal-card/90 border-teal hover:bg-teal-card/50 hover:border-white/10 transition-opacity',
              'opacity-20 hover:opacity-100',
              !canScrollPrev && 'cursor-not-allowed opacity-0'
            )}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-teal-card/90 border-teal hover:bg-teal-card/50 hover:border-white/10 transition-opacity',
              'opacity-20 hover:opacity-100',
              !canScrollNext && 'cursor-not-allowed opacity-0'
            )}
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </Button>
        </>
      )}

      {/* Dot Navigation */}
      {pages.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {pages.map((_, index) => (
            <button
              key={index}
              className={cn(
                'h-2 rounded-full transition-all',
                index === selectedIndex
                  ? 'w-8 bg-brand'
                  : 'w-2 bg-teal-card/70 hover:bg-teal-card/60'
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
