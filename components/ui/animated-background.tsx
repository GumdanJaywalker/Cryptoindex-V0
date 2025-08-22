'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'gradient' | 'combined'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

// 파티클 시스템
function ParticleSystem({ intensity = 'medium' }: { intensity: 'low' | 'medium' | 'high' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 캔버스 크기 설정
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // 파티클 설정
    const particleCount = intensity === 'high' ? 150 : intensity === 'medium' ? 80 : 40
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      life: number
    }> = []

    // 파티클 초기화
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        life: Math.random() * 200 + 50
      })
    }

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 브랜드 색상 (#8BD6FF)의 RGB 값
      const brandR = 139
      const brandG = 214  
      const brandB = 255

      particles.forEach((particle, index) => {
        // 파티클 이동
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life--

        // 경계 처리
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // 파티클 그리기
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${brandR}, ${brandG}, ${brandB}, ${particle.opacity})`
        ctx.fill()

        // 연결선 그리기 (가까운 파티클들끼리)
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(${brandR}, ${brandG}, ${brandB}, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })

        // 파티클 재생성
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.life = Math.random() * 200 + 50
          particle.opacity = Math.random() * 0.5 + 0.1
        }
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}

// 그라디언트 애니메이션 배경
function GradientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* 메인 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* 애니메이션 오브 */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-brand opacity-10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 opacity-8 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          y: [0, 50, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl"
        animate={{
          scale: [1, 0.8, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// 메인 컴포넌트
export function AnimatedBackground({ 
  variant = 'combined', 
  intensity = 'medium',
  className = ''
}: AnimatedBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* 그라디언트 배경 */}
      {(variant === 'gradient' || variant === 'combined') && <GradientBackground />}
      
      {/* 파티클 시스템 */}
      {(variant === 'particles' || variant === 'combined') && (
        <ParticleSystem intensity={intensity} />
      )}
      
      {/* 추가 노이즈 효과 */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='13' cy='40' r='1'/%3E%3Ccircle cx='40' cy='13' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
    </div>
  )
}

// 간단한 파티클 효과만 원하는 경우
export function SimpleParticles({ count = 50 }: { count?: number }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-brand rounded-full opacity-20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)
          }}
          animate={{
            y: [null, -100],
            opacity: [0.2, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

// 호버 효과를 위한 인터랙티브 파티클
export function InteractiveParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    >
      {/* 마우스 따라다니는 효과는 클라이언트에서만 동작 */}
    </div>
  )
}