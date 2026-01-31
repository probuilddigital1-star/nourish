'use client'

import { motion } from 'framer-motion'
import { Camera, Zap, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickActionsProps {
  onScan: () => void
  onQuickAdd: () => void
  onAI: () => void
}

const actions = [
  {
    id: 'scan',
    label: 'Scan',
    icon: Camera,
    color: 'bg-sage-500 text-white',
    action: 'onScan',
  },
  {
    id: 'quick',
    label: 'Quick Add',
    icon: Zap,
    color: 'bg-terracotta-500 text-white',
    action: 'onQuickAdd',
  },
  {
    id: 'ai',
    label: 'AI',
    icon: Sparkles,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    action: 'onAI',
  },
] as const

export function QuickActions({ onScan, onQuickAdd, onAI }: QuickActionsProps) {
  const handlers = { onScan, onQuickAdd, onAI }

  return (
    <div className="flex gap-2">
      {actions.map((action, index) => {
        const Icon = action.icon

        return (
          <motion.button
            key={action.id}
            onClick={handlers[action.action]}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-medium text-sm',
              'transition-all hover:opacity-90 active:scale-[0.98]',
              action.color
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            <span>{action.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
