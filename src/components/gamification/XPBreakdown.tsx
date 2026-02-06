'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Flame, Target, Droplets, Utensils, Sunrise } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useStore } from '@/store'
import { XP_REWARDS } from '@/lib/achievements'
import { cn } from '@/lib/utils'

interface XPSource {
  label: string
  amount: number
  count: number
  icon: typeof Flame
  color: string
}

export function XPBreakdown() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { todayLog, getTodayCalories, getTodayMacros, goals, waterIntake, waterDate, xp } = useStore()

  // Calculate today's XP sources
  const today = new Date().toISOString().split('T')[0]
  const foodCount = todayLog.length
  const foodXP = foodCount * XP_REWARDS.FOOD_LOGGED
  const firstLogXP = foodCount > 0 ? XP_REWARDS.FIRST_LOG_OF_DAY : 0

  const todayCalories = getTodayCalories()
  const hitCalorieGoal = todayCalories >= goals.calories * 0.95 && todayCalories <= goals.calories * 1.1 && todayCalories > 0
  const calorieGoalXP = hitCalorieGoal ? XP_REWARDS.CALORIE_GOAL : 0

  const todayMacros = getTodayMacros()
  const hitMacros = todayMacros.protein >= goals.protein * 0.9 &&
                    todayMacros.carbs >= goals.carbs * 0.9 &&
                    todayMacros.fat >= goals.fat * 0.9 &&
                    todayCalories > 0
  const macroXP = hitMacros ? XP_REWARDS.MACRO_GOAL : 0

  const waterComplete = waterDate === today && waterIntake >= 8
  const waterXP = waterComplete ? XP_REWARDS.WATER_COMPLETE : 0

  const todayXP = foodXP + firstLogXP + calorieGoalXP + macroXP + waterXP

  const sources: XPSource[] = [
    { label: 'Food logged', amount: XP_REWARDS.FOOD_LOGGED, count: foodCount, icon: Utensils, color: 'text-sage-500' },
    { label: 'First log of day', amount: firstLogXP, count: firstLogXP > 0 ? 1 : 0, icon: Sunrise, color: 'text-amber-500' },
    { label: 'Calorie goal', amount: calorieGoalXP, count: calorieGoalXP > 0 ? 1 : 0, icon: Target, color: 'text-terracotta-500' },
    { label: 'Macro goals', amount: macroXP, count: macroXP > 0 ? 1 : 0, icon: Flame, color: 'text-orange-500' },
    { label: 'Hydration', amount: waterXP, count: waterXP > 0 ? 1 : 0, icon: Droplets, color: 'text-sky-500' },
  ].filter(s => s.count > 0 || s.amount > 0)

  return (
    <Card variant="flat" className="bg-sage-50/80">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-sage-100/50 transition-colors rounded-2xl"
      >
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-sage-500" />
          <span className="text-sm font-medium text-charcoal">Today's XP</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            key={todayXP}
            initial={{ scale: 1.3, color: '#7a8b62' }}
            animate={{ scale: 1, color: '#374151' }}
            className="text-sm font-display font-semibold"
          >
            +{todayXP}
          </motion.span>
          <span className="text-xs text-gray-400">/ {xp} total</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 space-y-1.5">
              {sources.map((source, index) => {
                const Icon = source.icon
                const total = source.label === 'Food logged' ? source.amount * source.count : source.amount

                return (
                  <motion.div
                    key={source.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cn('w-3.5 h-3.5', source.color)} />
                      <span className="text-xs text-gray-600">{source.label}</span>
                      {source.count > 1 && (
                        <span className="text-[10px] text-gray-400">x{source.count}</span>
                      )}
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      total > 0 ? 'text-sage-600' : 'text-gray-300'
                    )}>
                      +{total}
                    </span>
                  </motion.div>
                )
              })}

              {sources.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">
                  Log food to start earning XP!
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
