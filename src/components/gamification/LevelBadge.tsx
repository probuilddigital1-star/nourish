'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { Sprout, Leaf, TreeDeciduous, Flower2, TreePine, Trees, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { haptic } from '@/lib/haptics'

const LEVEL_ICONS: Record<string, typeof Sprout> = {
  Circle, Sprout, Leaf, TreeDeciduous, Flower2, Trees, TreePine,
}

export function LevelBadge() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { xp, getLevel } = useStore()
  const level = getLevel()
  const prevXPRef = useRef(xp)
  const [showLevelUp, setShowLevelUp] = useState(false)

  const Icon = LEVEL_ICONS[level.current.icon] || Circle

  // Detect level up
  useEffect(() => {
    if (prevXPRef.current > 0 && prevXPRef.current < level.current.xp && xp >= level.current.xp) {
      setShowLevelUp(true)
      haptic('levelup')
      setTimeout(() => setShowLevelUp(false), 2000)
    }
    prevXPRef.current = xp
  }, [xp, level.current.xp])

  // SVG arc for XP progress
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const progressSpring = useSpring(0, { stiffness: 60, damping: 20 })

  useEffect(() => {
    progressSpring.set(level.progress * 100)
  }, [level.progress, progressSpring])

  const strokeDashoffset = useTransform(progressSpring, (v) => {
    return circumference - (v / 100) * circumference
  })

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'relative w-10 h-10 rounded-full flex items-center justify-center transition-colors',
          isExpanded ? 'bg-sage-200' : 'bg-sage-100 hover:bg-sage-200'
        )}
        whileTap={{ scale: 0.95 }}
        animate={showLevelUp ? {
          scale: [1, 1.2, 1],
          transition: { duration: 0.4, ease: 'easeOut' }
        } : {}}
      >
        {/* Progress ring */}
        <svg
          width={40}
          height={40}
          viewBox="0 0 40 40"
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={20}
            cy={20}
            r={radius}
            stroke="#d1d7c7"
            strokeWidth={2.5}
            fill="none"
            opacity={0.5}
          />
          <motion.circle
            cx={20}
            cy={20}
            r={radius}
            stroke="#7a8b62"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
          />
        </svg>

        <Icon className="w-4.5 h-4.5 text-sage-600 relative z-10" />

        {/* Level-up glow */}
        {showLevelUp && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ boxShadow: '0 0 0 0 rgba(122, 139, 98, 0.4)' }}
            animate={{ boxShadow: ['0 0 0 0 rgba(122, 139, 98, 0.4)', '0 0 20px 8px rgba(122, 139, 98, 0.2)', '0 0 0 0 rgba(122, 139, 98, 0)'] }}
            transition={{ duration: 1.5 }}
          />
        )}
      </motion.button>

      {/* Expanded popover */}
      <AnimatePresence>
        {isExpanded && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsExpanded(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute right-0 top-full mt-2 z-50 w-52 bg-white rounded-2xl shadow-soft-lg border border-sage-100 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-sage-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-sage-600" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-charcoal">{level.current.name}</p>
                    <p className="text-xs text-gray-400">{xp} XP total</p>
                  </div>
                </div>

                {/* XP bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>{level.xpInLevel} XP</span>
                    <span>{level.xpForNext > 0 ? level.xpForNext : 'MAX'}</span>
                  </div>
                  <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${level.progress * 100}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>

                {level.xpForNext > 0 && (
                  <p className="text-[10px] text-gray-400 text-center">
                    {level.xpForNext - level.xpInLevel} XP to {level.next.name}
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
