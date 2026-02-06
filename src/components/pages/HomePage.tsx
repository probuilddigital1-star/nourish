'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { CalorieRing } from '@/components/dashboard/CalorieRing'
import { MacroBarGroup } from '@/components/dashboard/MacroBar'
import { MealCard } from '@/components/dashboard/MealCard'
import { Card } from '@/components/ui/Card'
import { CelebrationOverlay } from '@/components/gamification/CelebrationOverlay'
import { XPBreakdown } from '@/components/gamification/XPBreakdown'
import { WaterTracker } from '@/components/gamification/WaterTracker'
import { useStore, MealType } from '@/store'
import { XP_REWARDS } from '@/lib/achievements'

interface HomePageProps {
  onAddFood: (mealType?: MealType) => void
}

export function HomePage({ onAddFood }: HomePageProps) {
  const { goals, getTodayCalories, getTodayMacros, getMealEntries, addXP } = useStore()
  const [showCelebration, setShowCelebration] = useState(false)
  const celebratedRef = useRef(false)

  const todayCalories = getTodayCalories()
  const todayMacros = getTodayMacros()

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']

  // Celebrate when daily goal is hit (once per session)
  useEffect(() => {
    const hitGoal = todayCalories >= goals.calories * 0.95 && todayCalories <= goals.calories * 1.1
    if (hitGoal && !celebratedRef.current && todayCalories > 0) {
      celebratedRef.current = true
      setShowCelebration(true)
      addXP(XP_REWARDS.CALORIE_GOAL)
    }
  }, [todayCalories, goals.calories, addXP])

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false)
  }, [])

  return (
    <div className="min-h-screen pb-32 lg:pb-8">
      <Header />

      {/* Responsive main content */}
      <main className="px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Desktop: Two-column layout, Mobile: Single column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Calorie Ring and Macros */}
          <div className="lg:col-span-5 space-y-6">
            {/* Calorie Ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card variant="glass" className="p-6 lg:p-8">
                <div className="flex justify-center py-4">
                  <CalorieRing
                    current={todayCalories}
                    goal={goals.calories}
                    size={200}
                  />
                </div>
              </Card>
            </motion.div>

            {/* XP Breakdown */}
            <XPBreakdown />

            {/* Macro Overview */}
            <Card variant="glass" className="p-4 lg:p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-4">Today's Macros</h3>
              <MacroBarGroup
                protein={todayMacros.protein}
                carbs={todayMacros.carbs}
                fat={todayMacros.fat}
                goals={{
                  protein: goals.protein,
                  carbs: goals.carbs,
                  fat: goals.fat,
                }}
              />
            </Card>

            {/* Water Tracker */}
            <WaterTracker />

            {/* Quick Stats - Desktop only */}
            <div className="hidden lg:grid grid-cols-3 gap-4">
              <Card variant="flat" className="p-4 text-center">
                <p className="text-2xl font-display font-semibold text-sage-600">
                  {Math.round((todayCalories / goals.calories) * 100)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Daily Goal</p>
              </Card>
              <Card variant="flat" className="p-4 text-center">
                <p className="text-2xl font-display font-semibold text-terracotta-500">
                  {goals.calories - todayCalories > 0 ? goals.calories - todayCalories : 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Cal Remaining</p>
              </Card>
              <Card variant="flat" className="p-4 text-center">
                <p className="text-2xl font-display font-semibold text-charcoal">
                  {mealTypes.reduce((sum, type) => sum + getMealEntries(type).length, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Items Logged</p>
              </Card>
            </div>
          </div>

          {/* Right column - Meals */}
          <div className="lg:col-span-7">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Today's Meals</h3>

            {/* Desktop: 2x2 grid, Mobile: vertical stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mealTypes.map((mealType, index) => (
                <motion.div
                  key={mealType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <MealCard
                    mealType={mealType}
                    entries={getMealEntries(mealType)}
                    onAddFood={() => onAddFood(mealType)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <CelebrationOverlay
        isVisible={showCelebration}
        onComplete={handleCelebrationComplete}
      />
    </div>
  )
}
