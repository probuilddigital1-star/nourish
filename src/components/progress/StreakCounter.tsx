'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Award, Target, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

interface StreakCounterProps {
  currentStreak?: number
  longestStreak?: number
  totalDaysLogged?: number
}

export function StreakCounter({
  currentStreak: propCurrentStreak,
  longestStreak: propLongestStreak,
  totalDaysLogged: propTotalDaysLogged,
}: StreakCounterProps) {
  const { getCurrentStreak, getLongestStreak, getTotalDaysLogged, getWeekLogStatus } = useStore()

  const currentStreak = propCurrentStreak ?? getCurrentStreak()
  const longestStreak = propLongestStreak ?? getLongestStreak()
  const totalDaysLogged = propTotalDaysLogged ?? getTotalDaysLogged()
  const weekStatus = useMemo(() => getWeekLogStatus(), [getWeekLogStatus])
  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: currentStreak,
      suffix: 'days',
      color: 'text-terracotta-500',
      bgColor: 'bg-terracotta-100',
    },
    {
      icon: Award,
      label: 'Best Streak',
      value: longestStreak,
      suffix: 'days',
      color: 'text-sage-500',
      bgColor: 'bg-sage-100',
    },
    {
      icon: Target,
      label: 'Total Days',
      value: totalDaysLogged,
      suffix: 'logged',
      color: 'text-amber-500',
      bgColor: 'bg-amber-100',
    },
  ]

  return (
    <Card variant="elevated" className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Stats section */}
        <div className="flex-1">
          <h3 className="font-semibold text-charcoal mb-4">Your Progress</h3>
          <div className="grid grid-cols-3 gap-3 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon

              return (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={cn('w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center mb-2', stat.bgColor)}>
                    <Icon className={cn('w-6 h-6 lg:w-7 lg:h-7', stat.color)} />
                  </div>
                  <motion.span
                    className="text-2xl lg:text-3xl font-display font-semibold text-charcoal"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: index * 0.1 + 0.2 }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-[10px] lg:text-xs text-gray-400 mt-0.5">{stat.suffix}</span>
                  <span className="text-xs lg:text-sm text-gray-500 mt-1">{stat.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Streak visualization */}
        <div className="lg:w-auto lg:min-w-[280px] pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-sage-100 lg:pl-6">
          <p className="text-xs text-gray-400 mb-3">Last 7 days</p>
          <div className="flex justify-between gap-2">
            {weekStatus.map((isLogged, index) => {
              // Calculate the day label for each day (6 days ago to today)
              const date = new Date()
              date.setDate(date.getDate() - (6 - index))
              const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
              const isToday = index === 6 // Last item is today

              return (
                <motion.div
                  key={index}
                  className="flex flex-col items-center gap-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={cn(
                      'w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-sm',
                      isLogged
                        ? 'bg-sage-500 text-white'
                        : 'bg-sage-100 text-sage-400',
                      isToday && 'ring-2 ring-sage-300 ring-offset-2'
                    )}
                  >
                    {isLogged ? <Check className="w-4 h-4" /> : dayLabel}
                  </div>
                  <span className={cn(
                    'text-[10px] lg:text-xs',
                    isToday ? 'text-sage-600 font-medium' : 'text-gray-400'
                  )}>
                    {dayLabel}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
