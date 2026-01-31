'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MacroBarProps {
  label: string
  current: number
  goal: number
  color: 'protein' | 'carbs' | 'fat'
  unit?: string
}

const colors = {
  protein: {
    bg: 'bg-sage-100',
    fill: 'bg-sage-500',
    text: 'text-sage-600',
  },
  carbs: {
    bg: 'bg-terracotta-100',
    fill: 'bg-terracotta-400',
    text: 'text-terracotta-600',
  },
  fat: {
    bg: 'bg-amber-100',
    fill: 'bg-amber-400',
    text: 'text-amber-600',
  },
}

export function MacroBar({ label, current, goal, color, unit = 'g' }: MacroBarProps) {
  const percentage = Math.min((current / goal) * 100, 100)
  const colorScheme = colors[color]

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span className={cn('text-xs font-medium', colorScheme.text)}>
          {Math.round(current)}{unit}
        </span>
      </div>

      <div className={cn('h-2 rounded-full overflow-hidden', colorScheme.bg)}>
        <motion.div
          className={cn('h-full rounded-full', colorScheme.fill)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">0</span>
        <span className="text-[10px] text-gray-400">{goal}{unit}</span>
      </div>
    </div>
  )
}

export function MacroBarGroup({
  protein,
  carbs,
  fat,
  goals,
}: {
  protein: number
  carbs: number
  fat: number
  goals: { protein: number; carbs: number; fat: number }
}) {
  return (
    <div className="flex gap-4">
      <MacroBar label="Protein" current={protein} goal={goals.protein} color="protein" />
      <MacroBar label="Carbs" current={carbs} goal={goals.carbs} color="carbs" />
      <MacroBar label="Fat" current={fat} goal={goals.fat} color="fat" />
    </div>
  )
}
