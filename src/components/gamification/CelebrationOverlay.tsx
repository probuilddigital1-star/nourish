'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { haptic } from '@/lib/haptics'

interface CelebrationOverlayProps {
  isVisible: boolean
  onComplete: () => void
}

// Petal shape component
function Petal({ delay, angle, distance }: { delay: number; angle: number; distance: number }) {
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * distance
  const y = Math.sin(rad) * distance

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-4 h-8 rounded-full opacity-0"
      style={{
        background: `linear-gradient(135deg, #b3bda2 0%, #95a37d 50%, #7a8b62 100%)`,
        transformOrigin: 'center bottom',
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0, rotate: angle - 90 }}
      animate={{
        x: [0, x * 0.5, x],
        y: [0, y * 0.5 - 20, y],
        scale: [0, 1.2, 0.8],
        opacity: [0, 0.7, 0],
        rotate: [angle - 90, angle - 90 + 15, angle - 90 + 30],
      }}
      transition={{
        duration: 2,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  )
}

// Small floating particle
function Particle({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
      style={{ background: '#d1d7c7' }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{
        x: [0, x * 0.3, x],
        y: [0, y - 40, y - 80],
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0.3],
      }}
      transition={{
        duration: 2.2,
        delay,
        ease: 'easeOut',
      }}
    />
  )
}

export function CelebrationOverlay({ isVisible, onComplete }: CelebrationOverlayProps) {
  useEffect(() => {
    if (isVisible) {
      haptic('success')
      const timer = setTimeout(onComplete, 2800)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  // Generate petals in a circle
  const petals = Array.from({ length: 12 }, (_, i) => ({
    angle: i * 30,
    distance: 80 + Math.random() * 40,
    delay: 0.1 + i * 0.05,
  }))

  // Generate particles
  const particles = Array.from({ length: 16 }, (_, i) => ({
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    delay: 0.2 + Math.random() * 0.5,
  }))

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Subtle backdrop */}
          <motion.div
            className="absolute inset-0 bg-sage-500/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Center content */}
          <div className="relative">
            {/* Petals */}
            {petals.map((petal, i) => (
              <Petal key={i} {...petal} />
            ))}

            {/* Particles */}
            {particles.map((particle, i) => (
              <Particle key={`p-${i}`} {...particle} />
            ))}

            {/* "Nourished" text */}
            <motion.div
              className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-glow"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
                delay: 0.3,
              }}
            >
              <p className="font-display italic text-2xl font-semibold text-sage-600">
                Nourished
              </p>
              <p className="text-xs text-gray-400 text-center mt-1">Daily goal reached!</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
