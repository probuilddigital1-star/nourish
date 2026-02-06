'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sprout, Flame, Crown, Target, Utensils, Award, Droplets,
  Sparkles, ScanLine, Leaf, TreePine, Star, Trophy, Flower2, Lock
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useStore } from '@/store'
import { ACHIEVEMENTS, Achievement } from '@/lib/achievements'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, typeof Sprout> = {
  Sprout, Flame, Crown, Target, Utensils, Award, Droplets,
  Sparkles, ScanLine, Leaf, TreePine, Star, Trophy, Flower2,
}

const CATEGORY_LABELS: Record<string, string> = {
  consistency: 'Consistency',
  nutrition: 'Nutrition',
  exploration: 'Exploration',
  milestone: 'Milestones',
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  consistency: { bg: 'bg-terracotta-100', text: 'text-terracotta-500', ring: 'ring-terracotta-200' },
  nutrition: { bg: 'bg-sage-100', text: 'text-sage-600', ring: 'ring-sage-200' },
  exploration: { bg: 'bg-sky-100', text: 'text-sky-500', ring: 'ring-sky-200' },
  milestone: { bg: 'bg-gold-400/20', text: 'text-gold-500', ring: 'ring-gold-400/30' },
}

function AchievementBadge({ achievement, isUnlocked, index }: {
  achievement: Achievement
  isUnlocked: boolean
  index: number
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  const Icon = ICON_MAP[achievement.icon] || Star
  const colors = CATEGORY_COLORS[achievement.category]

  return (
    <div className="relative">
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.04, type: 'spring', stiffness: 300 }}
        onClick={() => setShowTooltip(!showTooltip)}
        className={cn(
          'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all relative',
          isUnlocked
            ? cn(colors.bg, 'shadow-sm hover:shadow-md')
            : 'bg-gray-100 hover:bg-gray-150'
        )}
      >
        {isUnlocked ? (
          <Icon className={cn('w-6 h-6 sm:w-7 sm:h-7', colors.text)} />
        ) : (
          <div className="relative">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-300" style={{ filter: 'blur(1px)' }} />
            <Lock className="w-3 h-3 text-gray-400 absolute -bottom-0.5 -right-0.5" />
          </div>
        )}

        {/* Unlock glow */}
        {isUnlocked && (
          <motion.div
            className={cn('absolute inset-0 rounded-2xl ring-2', colors.ring)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowTooltip(false)} />
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-40 bg-white rounded-xl shadow-soft-lg border border-sage-100 p-3 text-center"
            >
              <p className={cn(
                'text-sm font-semibold font-display',
                isUnlocked ? 'text-charcoal' : 'text-gray-400'
              )}>
                {achievement.name}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {achievement.description}
              </p>
              {isUnlocked && (
                <span className={cn('inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full', colors.bg, colors.text)}>
                  Unlocked
                </span>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AchievementGrid() {
  const { achievements } = useStore()

  const unlockedCount = achievements.length
  const totalCount = ACHIEVEMENTS.length

  // Group by category
  const categories = ['consistency', 'nutrition', 'exploration', 'milestone'] as const

  return (
    <Card variant="elevated" className="p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-charcoal">Achievements</h3>
        <span className="text-xs text-gray-400 font-medium">
          {unlockedCount}/{totalCount} unlocked
        </span>
      </div>

      <div className="space-y-5">
        {categories.map((category) => {
          const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category)

          return (
            <div key={category}>
              <p className="text-xs text-gray-400 font-medium mb-2.5">
                {CATEGORY_LABELS[category]}
              </p>
              <div className="flex flex-wrap gap-2">
                {categoryAchievements.map((achievement, index) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    isUnlocked={achievements.includes(achievement.id)}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
