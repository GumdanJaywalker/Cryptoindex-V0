'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'gradient' | 'combined'
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

// Particle System
function ParticleSystem({ intensity = 'medium' }: { intensity: 'low' | 'medium' | 'high' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle settings
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

    // Initialize particles
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

      // RGB values for brand color (#8BD6FF)
      const brandR = 139
      const brandG = 214
      const brandB = 255

      particles.forEach((particle, index) => {
        // Move particles
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life--

        // Handle boundaries
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particles
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${brandR}, ${brandG}, ${brandB}, ${particle.opacity})`
        ctx.fill()

        // Draw connecting lines (between close particles)
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

        // Regenerate particles
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

// Solid background (remove gradient and glow effects)
function GradientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Solid background */}
      <div className="absolute inset-0 bg-slate-950" />
    </div>
  )
}

// Main Component
export function AnimatedBackground({
  variant = 'combined',
  intensity = 'medium',
  className = ''
}: AnimatedBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {/* Gradient background */}
      {(variant === 'gradient' || variant === 'combined') && <GradientBackground />}

      {/* Particle system */}
      {(variant === 'particles' || variant === 'combined') && (
        <ParticleSystem intensity={intensity} />
      )}

      {/* Additional noise effect */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='13' cy='40' r='1'/%3E%3Ccircle cx='40' cy='13' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
    </div>
  )
}

// If only simple particle effects are desired
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

// Interactive particles for hover effects
export function InteractiveParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    >
      {/* Mouse following effect works only on client side */}
    </div>
  )
}