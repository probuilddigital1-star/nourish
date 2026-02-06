'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { WeightChart } from '@/components/progress/WeightChart'
import { CalorieChart } from '@/components/progress/CalorieChart'
import { MacroDonut } from '@/components/progress/MacroDonut'
import { StreakCounter } from '@/components/progress/StreakCounter'
import { AchievementGrid } from '@/components/gamification/AchievementGrid'
import { useStore } from '@/store'
import { cn } from '@/lib/utils'

type TimeRange = 'week' | 'month' | '3months' | 'year'

const timeRangeLabels: Record<TimeRange, string> = {
  week: 'This Week',
  month: 'This Month',
  '3months': '3 Months',
  year: 'This Year',
}

export function ProgressPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week')
  const [showRangeDropdown, setShowRangeDropdown] = useState(false)
  const { goals } = useStore()

  return (
    <div className="min-h-screen pb-32 lg:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-4 bg-cream/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-charcoal">
            Progress
          </h1>

          {/* Time range selector */}
          <div className="relative">
            <button
              onClick={() => setShowRangeDropdown(!showRangeDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-sm font-medium text-charcoal hover:bg-sage-50 transition-colors"
            >
              {timeRangeLabels[timeRange]}
              <ChevronDown className={cn(
                'w-4 h-4 text-gray-400 transition-transform',
                showRangeDropdown && 'rotate-180'
              )} />
            </button>

            {showRangeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-soft-lg border border-sage-100 overflow-hidden z-50"
              >
                {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range)
                      setShowRangeDropdown(false)
                    }}
                    className={cn(
                      'w-full px-4 py-2.5 text-sm text-left hover:bg-sage-50 transition-colors',
                      timeRange === range ? 'bg-sage-50 text-sage-600 font-medium' : 'text-charcoal'
                    )}
                  >
                    {timeRangeLabels[range]}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 pt-2 space-y-6">
        <div className="max-w-6xl mx-auto">
          {/* Streak Counter - full width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="mb-6"
          >
            <StreakCounter />
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <AchievementGrid />
          </motion.div>

          {/* Desktop: Two-column layout for charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <WeightChart />
            </motion.div>

            {/* Calorie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CalorieChart goalCalories={goals.calories} />
            </motion.div>

            {/* Macro Donut - spans full width on lg */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <MacroDonut />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Click outside to close dropdown */}
      {showRangeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowRangeDropdown(false)}
        />
      )}
    </div>
  )
}
