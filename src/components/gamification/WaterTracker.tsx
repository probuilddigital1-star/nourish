'use client'

import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useStore } from '@/store'
import { haptic } from '@/lib/haptics'
import { cn } from '@/lib/utils'

const WATER_GOAL = 8

function WaterDrop({ index, isFilled, onToggle }: {
  index: number
  isFilled: boolean
  onToggle: () => void
}) {
  return (
    <motion.button
      onClick={onToggle}
      className={cn(
        'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-colors',
        isFilled
          ? 'bg-sky-400 shadow-sm'
          : 'bg-sky-50 hover:bg-sky-100 border border-sky-200/50'
      )}
      whileTap={{ scale: 0.85 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        delay: index * 0.04,
        type: 'spring',
        stiffness: 400,
        damping: 20,
      }}
    >
      <Droplets
        className={cn(
          'w-4 h-4',
          isFilled ? 'text-white' : 'text-sky-300'
        )}
      />
    </motion.button>
  )
}

export function WaterTracker() {
  const { waterIntake, waterDate, addWater, removeWater } = useStore()

  const today = new Date().toISOString().split('T')[0]
  const currentIntake = waterDate === today ? waterIntake : 0

  const handleToggle = (index: number) => {
    if (index < currentIntake) {
      removeWater()
    } else {
      addWater()
      haptic('tap')
    }
  }

  return (
    <Card variant="flat" className="bg-sky-50/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-500" />
          <span className="text-sm font-medium text-charcoal">Water</span>
        </div>
        <span className="text-xs text-gray-400">
          {currentIntake}/{WATER_GOAL} glasses
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5">
        {Array.from({ length: WATER_GOAL }, (_, i) => (
          <WaterDrop
            key={i}
            index={i}
            isFilled={i < currentIntake}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>

      {currentIntake >= WATER_GOAL && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-sky-500 text-center mt-2 font-medium"
        >
          Hydration goal complete! +20 XP
        </motion.p>
      )}
    </Card>
  )
}
