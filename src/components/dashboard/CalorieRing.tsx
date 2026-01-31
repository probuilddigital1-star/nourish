'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn, formatNumber } from '@/lib/utils'

interface CalorieRingProps {
  current: number
  goal: number
  size?: number
  strokeWidth?: number
}

export function CalorieRing({ current, goal, size = 220, strokeWidth = 14 }: CalorieRingProps) {
  const [mounted, setMounted] = useState(false)
  const percentage = Math.min((current / goal) * 100, 100)
  const remaining = Math.max(goal - current, 0)
  const isOver = current > goal

  // Animated progress
  const progress = useSpring(0, { stiffness: 50, damping: 15 })

  useEffect(() => {
    setMounted(true)
    progress.set(percentage)
  }, [percentage, progress])

  // Calculate SVG values
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const strokeDashoffset = useTransform(progress, (value) => {
    return circumference - (value / 100) * circumference
  })

  // Color based on progress
  const getColor = () => {
    if (isOver) return '#d4613a' // terracotta
    if (percentage >= 90) return '#d4a03a' // warm yellow
    return '#7a8b62' // sage
  }

  // Animated calorie counter
  const displayCalories = useSpring(0, { stiffness: 50, damping: 15 })

  useEffect(() => {
    displayCalories.set(current)
  }, [current, displayCalories])

  const animatedCalories = useTransform(displayCalories, (value) => formatNumber(Math.round(value)))

  if (!mounted) {
    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="shimmer w-full h-full rounded-full" />
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${getColor()}40 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e8ebe3"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-50"
        />

        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          className="drop-shadow-md"
        />

        {/* Decorative dots */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180 - Math.PI / 2
          const dotRadius = radius + strokeWidth / 2 + 8
          const x = size / 2 + dotRadius * Math.cos(angle)
          const y = size / 2 + dotRadius * Math.sin(angle)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2}
              fill="#d1d7c7"
              className="opacity-40"
            />
          )
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn(
            'font-display text-4xl font-semibold tracking-tight',
            isOver ? 'text-terracotta-500' : 'text-charcoal'
          )}
        >
          {animatedCalories}
        </motion.span>
        <span className="text-sm text-gray-500 mt-1">
          of {formatNumber(goal)} cal
        </span>

        {/* Status indicator */}
        <motion.div
          className={cn(
            'mt-3 px-3 py-1 rounded-full text-xs font-medium',
            isOver
              ? 'bg-terracotta-100 text-terracotta-600'
              : percentage >= 90
              ? 'bg-amber-100 text-amber-600'
              : 'bg-sage-100 text-sage-600'
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isOver
            ? `${formatNumber(current - goal)} over`
            : `${formatNumber(remaining)} left`}
        </motion.div>
      </div>
    </div>
  )
}
