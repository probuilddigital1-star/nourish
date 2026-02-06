'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Award, Target, Check } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

interface StreakCounterProps {
  currentStreak?: number
  longestStreak?: number
  totalDaysLogged?: number
}

// Multi-layer animated flame SVG
function AnimatedFlame({ streak }: { streak: number }) {
  // Scale flame based on streak length
  const scale = streak === 0 ? 0.6 : streak < 3 ? 0.7 : streak < 7 ? 0.85 : streak < 30 ? 1 : 1.1
  const intensity = streak < 3 ? 0.5 : streak < 7 ? 0.7 : streak < 30 ? 0.9 : 1

  return (
    <div className="relative w-7 h-7 lg:w-8 lg:h-8" style={{ transform: `scale(${scale})` }}>
      {/* Outer glow for long streaks */}
      {streak >= 7 && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              '0 0 8px 2px rgba(234, 88, 12, 0.2)',
              '0 0 16px 4px rgba(234, 88, 12, 0.35)',
              '0 0 8px 2px rgba(234, 88, 12, 0.2)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <svg viewBox="0 0 32 32" className="w-full h-full">
        {/* Back flame layer - deep orange */}
        <motion.path
          d="M16 4c0 0-8 8-8 16c0 4.4 3.6 8 8 8s8-3.6 8-8c0-8-8-16-8-16z"
          fill="#ea580c"
          opacity={intensity}
          animate={{
            d: [
              'M16 4c0 0-8 8-8 16c0 4.4 3.6 8 8 8s8-3.6 8-8c0-8-8-16-8-16z',
              'M16 3c0 0-9 9-9 17c0 4.4 4 8 9 8s9-3.6 9-8c0-8-9-17-9-17z',
              'M16 4c0 0-8 8-8 16c0 4.4 3.6 8 8 8s8-3.6 8-8c0-8-8-16-8-16z',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Middle flame layer - orange */}
        <motion.path
          d="M16 8c0 0-6 6-6 12c0 3.3 2.7 6 6 6s6-2.7 6-6c0-6-6-12-6-12z"
          fill="#f97316"
          opacity={intensity * 0.9}
          animate={{
            d: [
              'M16 8c0 0-6 6-6 12c0 3.3 2.7 6 6 6s6-2.7 6-6c0-6-6-12-6-12z',
              'M16 7c0 0-7 7-7 13c0 3.3 3 6 7 6s7-2.7 7-6c0-6-7-13-7-13z',
              'M16 8c0 0-6 6-6 12c0 3.3 2.7 6 6 6s6-2.7 6-6c0-6-6-12-6-12z',
            ],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
        />

        {/* Inner flame layer - yellow */}
        <motion.path
          d="M16 14c0 0-3.5 3.5-3.5 7c0 1.9 1.6 3.5 3.5 3.5s3.5-1.6 3.5-3.5c0-3.5-3.5-7-3.5-7z"
          fill="#fbbf24"
          opacity={intensity}
          animate={{
            d: [
              'M16 14c0 0-3.5 3.5-3.5 7c0 1.9 1.6 3.5 3.5 3.5s3.5-1.6 3.5-3.5c0-3.5-3.5-7-3.5-7z',
              'M16 12c0 0-4 4-4 8c0 1.9 1.8 3.5 4 3.5s4-1.6 4-3.5c0-4-4-8-4-8z',
              'M16 14c0 0-3.5 3.5-3.5 7c0 1.9 1.6 3.5 3.5 3.5s3.5-1.6 3.5-3.5c0-3.5-3.5-7-3.5-7z',
            ],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Ember particles for 30+ streaks */}
        {streak >= 30 && (
          <>
            <motion.circle
              cx={12} cy={10} r={1}
              fill="#fbbf24"
              animate={{ cy: [10, 4], opacity: [0.8, 0], scale: [1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx={20} cy={8} r={0.8}
              fill="#f97316"
              animate={{ cy: [8, 2], opacity: [0.7, 0], scale: [1, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx={16} cy={6} r={0.6}
              fill="#fbbf24"
              animate={{ cy: [6, 1], opacity: [0.6, 0], scale: [1, 0.4] }}
              transition={{ duration: 1.3, repeat: Infinity, delay: 1 }}
            />
          </>
        )}
      </svg>
    </div>
  )
}

// Vine visualization for weekly status
function WeekVine({ weekStatus }: { weekStatus: boolean[] }) {
  const days = weekStatus.map((isLogged, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
    return { isLogged, dayLabel, isToday: index === 6 }
  })

  return (
    <div className="relative">
      <p className="text-xs text-gray-400 mb-3">Last 7 days</p>
      <div className="flex items-center gap-0">
        {days.map((day, index) => (
          <div key={index} className="flex items-center">
            {/* Vine segment connecting to previous node */}
            {index > 0 && (
              <motion.div
                className={cn(
                  'h-0.5 w-4 sm:w-5 lg:w-6',
                  day.isLogged && days[index - 1].isLogged
                    ? 'bg-sage-400'
                    : 'bg-sage-200'
                )}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
              />
            )}

            {/* Node */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 + 0.1, type: 'spring', stiffness: 300 }}
            >
              <div
                className={cn(
                  'w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-sm transition-all',
                  day.isLogged
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'bg-sage-100 text-sage-400',
                  day.isToday && 'ring-2 ring-sage-300 ring-offset-2'
                )}
              >
                {day.isLogged ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs">{day.dayLabel}</span>
                )}
              </div>
              <span className={cn(
                'text-[10px] lg:text-xs',
                day.isToday ? 'text-sage-600 font-medium' : 'text-gray-400'
              )}>
                {day.dayLabel}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
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
      label: 'Current Streak',
      value: currentStreak,
      suffix: 'days',
      color: 'text-terracotta-500',
      bgColor: 'bg-terracotta-100',
      renderIcon: () => <AnimatedFlame streak={currentStreak} />,
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
              const Icon = 'icon' in stat ? stat.icon : null

              return (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={cn('w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center mb-2', stat.bgColor)}>
                    {'renderIcon' in stat ? stat.renderIcon() : Icon && <Icon className={cn('w-6 h-6 lg:w-7 lg:h-7', stat.color)} />}
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

        {/* Vine visualization */}
        <div className="lg:w-auto lg:min-w-[280px] pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-sage-100 lg:pl-6">
          <WeekVine weekStatus={weekStatus} />
        </div>
      </div>
    </Card>
  )
}
