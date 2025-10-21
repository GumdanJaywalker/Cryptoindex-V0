'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TopTrader } from '@/lib/types/index-trading'
import { CarouselTraderCard } from './CarouselTraderCard'
import { cn } from '@/lib/utils'

interface TraderCarouselProps {
  traders: TopTrader[]
  autoRotate?: boolean
  autoRotateInterval?: number
}

export function TraderCarousel({
  traders,
  autoRotate = true,
  autoRotateInterval = 5000,
}: TraderCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: 'start',
      loop: true,
    },
    autoRotate ? [Autoplay({ delay: autoRotateInterval, stopOnInteraction: false })] : []
  )
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

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

  if (traders.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No traders available
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Carousel Container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {traders.map((trader) => (
            <div key={trader.id} className="flex-[0_0_100%] min-w-0 px-1">
              <CarouselTraderCard trader={trader} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Show on Hover */}
      {traders.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-slate-900/90 border-slate-700 hover:bg-slate-800 hover:border-brand/50 transition-opacity',
              'opacity-0 group-hover:opacity-50',
              !canScrollPrev && 'cursor-not-allowed'
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
              'absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-slate-900/90 border-slate-700 hover:bg-slate-800 hover:border-brand/50 transition-opacity',
              'opacity-0 group-hover:opacity-50',
              !canScrollNext && 'cursor-not-allowed'
            )}
            onClick={scrollNext}
            disabled={!canScrollNext}
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </Button>
        </>
      )}

      {/* Dot Navigation */}
      {traders.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {traders.map((_, index) => (
            <button
              key={index}
              className={cn(
                'h-2 rounded-full transition-all',
                index === selectedIndex
                  ? 'w-8 bg-brand'
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to trader ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
