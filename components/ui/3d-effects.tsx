'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

// 3D 틸트 카드 컴포넌트
interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltMaxAngle?: number
  scale?: number
  speed?: number
}

export function TiltCard({
  children,
  className = '',
  tiltMaxAngle = 10,
  scale = 1.05,
  speed = 400
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: speed, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: speed, damping: 30 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltMaxAngle, -tiltMaxAngle])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltMaxAngle, tiltMaxAngle])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale }}
      className={`transform-gpu transition-all duration-200 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// 마우스 추적 파티클 시스템
interface MouseParticlesProps {
  className?: string
  particleCount?: number
  colors?: string[]
  size?: number
}

export function MouseParticles({
  className = '',
  particleCount = 20,
  colors = ['#8BD6FF', '#7BC9FF', '#A5E0FF'],
  size = 4
}: MouseParticlesProps) {
  const [particles, setParticles] = useState<Array<{
    id: number
    x: number
    y: number
    opacity: number
    scale: number
    color: string
  }>>([])
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      
      // 새 파티클 생성
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        scale: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
      
      setParticles(prev => [...prev.slice(-particleCount), newParticle])
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [particleCount, colors])

  // 파티클 페이드아웃
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          opacity: particle.opacity * 0.95,
          scale: particle.scale * 0.98
        })).filter(particle => particle.opacity > 0.01)
      )
    }, 16) // 60fps

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`pointer-events-none fixed inset-0 z-10 ${className}`}>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full blur-sm"
          style={{
            left: particle.x - size / 2,
            top: particle.y - size / 2,
            width: size,
            height: size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            scale: particle.scale,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: particle.scale, opacity: particle.opacity }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </div>
  )
}

// 3D 깊이감 있는 그림자 효과
interface DepthShadowProps {
  children: ReactNode
  depth?: number
  color?: string
  className?: string
}

export function DepthShadow({
  children,
  depth = 20,
  color = 'rgba(139, 214, 255, 0.3)',
  className = ''
}: DepthShadowProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: isHovered 
          ? `drop-shadow(0 ${depth}px ${depth * 2}px ${color})`
          : `drop-shadow(0 ${depth / 4}px ${depth / 2}px ${color})`
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// 3D 플로팅 애니메이션
interface FloatingElementProps {
  children: ReactNode
  intensity?: number
  speed?: number
  className?: string
}

export function FloatingElement({
  children,
  intensity = 10,
  speed = 3,
  className = ''
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-intensity, intensity, -intensity],
        rotateX: [-2, 2, -2],
        rotateY: [-1, 1, -1],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}

// 3D 백그라운드 그리드
export function Background3DGrid() {
  const [mounted, setMounted] = useState(false)
  const [gridData] = useState(() => {
    // 고정된 시드 기반 패턴 생성 (hydration 안전)
    return Array.from({ length: 96 }, (_, i) => ({
      id: i,
      initialZ: ((i * 17) % 50) - 25, // 의사 랜덤하지만 고정값
      animateZ1: ((i * 23) % 50) - 25,
      animateZ2: ((i * 31) % 50) - 25,
      duration: 5 + ((i * 7) % 5),
      delay: (i * 3) % 2
    }))
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute inset-0" style={{ perspective: '1000px' }}>
          <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
            {Array.from({ length: 96 }, (_, i) => (
              <div key={i} className="border border-brand/20" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        <motion.div
          className="grid grid-cols-12 grid-rows-8 h-full w-full"
          style={{ 
            transformStyle: "preserve-3d",
            rotateX: 15,
            rotateY: -5
          }}
          animate={{
            rotateY: [-5, 5, -5],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {gridData.map((item) => (
            <motion.div
              key={item.id}
              className="border border-brand/20"
              style={{
                transformStyle: "preserve-3d",
                translateZ: item.initialZ
              }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                translateZ: [item.animateZ1, item.animateZ2]
              }}
              transition={{
                duration: item.duration,
                repeat: Infinity,
                delay: item.delay
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// 홀로그램 효과
interface HologramEffectProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export function HologramEffect({
  children,
  className = '',
  intensity = 0.05
}: HologramEffectProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: `
          linear-gradient(
            45deg,
            transparent 30%,
            rgba(139, 214, 255, ${intensity}) 50%,
            transparent 70%
          )
        `,
        backgroundSize: '20px 20px',
      }}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <motion.div
        animate={{
          filter: [
            'hue-rotate(0deg) contrast(1)',
            'hue-rotate(10deg) contrast(1.1)',
            'hue-rotate(0deg) contrast(1)'
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// 3D 글리치 효과
interface GlitchEffectProps {
  children: ReactNode
  className?: string
  trigger?: boolean
}

export function GlitchEffect({
  children,
  className = '',
  trigger = false
}: GlitchEffectProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsGlitching(true)
      const timeout = setTimeout(() => setIsGlitching(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [trigger])

  return (
    <motion.div
      className={`relative ${className}`}
      animate={isGlitching ? {
        x: [0, -2, 2, -1, 1, 0],
        filter: [
          'hue-rotate(0deg)',
          'hue-rotate(90deg)',
          'hue-rotate(180deg)',
          'hue-rotate(270deg)',
          'hue-rotate(0deg)'
        ],
        textShadow: [
          '0 0 0 transparent',
          '2px 0 0 #ff0000, -2px 0 0 #00ffff',
          '0 0 0 transparent'
        ]
      } : {}}
      transition={{
        duration: 0.1,
        repeat: isGlitching ? 5 : 0
      }}
    >
      {children}
    </motion.div>
  )
}

// 사용하기 쉬운 통합 3D 카드
interface Enhanced3DCardProps {
  children: ReactNode
  className?: string
  enableTilt?: boolean
  enableGlow?: boolean
  enableFloat?: boolean
  enableHologram?: boolean
  glowColor?: string
}

export function Enhanced3DCard({
  children,
  className = '',
  enableTilt = true,
  enableGlow = true,
  enableFloat = false,
  enableHologram = false,
  glowColor = 'rgba(139, 214, 255, 0.3)'
}: Enhanced3DCardProps) {
  let cardContent = children

  if (enableHologram) {
    cardContent = (
      <HologramEffect>
        {cardContent}
      </HologramEffect>
    )
  }

  if (enableFloat) {
    cardContent = (
      <FloatingElement intensity={5} speed={4}>
        {cardContent}
      </FloatingElement>
    )
  }

  if (enableGlow) {
    cardContent = (
      <DepthShadow color={glowColor}>
        {cardContent}
      </DepthShadow>
    )
  }

  if (enableTilt) {
    cardContent = (
      <TiltCard className={className}>
        {cardContent}
      </TiltCard>
    )
  }

  return cardContent as JSX.Element
}