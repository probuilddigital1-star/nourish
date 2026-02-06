'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { MealIcon, FoodIconBadge } from '@/components/icons/FoodIcons'
import { cn, formatNumber } from '@/lib/utils'
import { haptic } from '@/lib/haptics'
import { FoodEntry, MealType, useStore } from '@/store'

interface MealCardProps {
  mealType: MealType
  entries: FoodEntry[]
  onAddFood: () => void
}

function SwipeableEntry({ entry, onDelete }: { entry: FoodEntry; onDelete: () => void }) {
  const x = useMotionValue(0)
  const deleteOpacity = useTransform(x, [-100, -60, 0], [1, 0.5, 0])
  const deleteScale = useTransform(x, [-100, -60, 0], [1, 0.8, 0.5])
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    if (info.offset.x < -100) {
      haptic('tap')
      onDelete()
    }
  }, [onDelete])

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Delete background */}
      <motion.div
        className="absolute inset-0 bg-terracotta-500 rounded-xl flex items-center justify-end pr-4"
        style={{ opacity: deleteOpacity }}
      >
        <motion.div style={{ scale: deleteScale }}>
          <Trash2 className="w-5 h-5 text-white" />
        </motion.div>
      </motion.div>

      {/* Swipeable content */}
      <motion.div
        className="group flex items-center justify-between py-2 px-3 bg-sage-50/50 rounded-xl relative"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={0.3}
        dragDirectionLock
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FoodIconBadge name={entry.name} variant="sage" className="flex-shrink-0 w-8 h-8" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-charcoal truncate">
              {entry.name}
            </p>
            <p className="text-xs text-gray-400">
              {entry.servingSize} {entry.servingUnit}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-sage-600">
            {entry.calories} cal
          </span>
          {/* Desktop hover delete button */}
          <button
            onClick={(e) => {
              if (isDragging) return
              e.stopPropagation()
              haptic('tap')
              onDelete()
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-terracotta-100 rounded-lg transition-all hidden sm:block"
          >
            <Trash2 className="w-4 h-4 text-terracotta-500" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export function MealCard({ mealType, entries, onAddFood }: MealCardProps) {
  const [isExpanded, setIsExpanded] = useState(entries.length > 0)
  const removeFood = useStore((s) => s.removeFood)

  const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)
  const label = mealType.charAt(0).toUpperCase() + mealType.slice(1)

  return (
    <Card
      variant="elevated"
      className="overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-sage-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
            <MealIcon mealType={mealType} className="text-sage-600" size="md" />
          </div>
          <div className="text-left">
            <span className="font-medium text-charcoal block">{label}</span>
            {entries.length > 0 && (
              <span className="text-xs text-gray-400">
                {entries.length} {entries.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={cn(
            'font-semibold',
            totalCalories > 0 ? 'text-charcoal' : 'text-gray-300'
          )}>
            {formatNumber(totalCalories)} cal
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {/* Food entries with swipe */}
              <AnimatePresence mode="popLayout">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <SwipeableEntry
                      entry={entry}
                      onDelete={() => removeFood(entry.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add food button */}
              <button
                type="button"
                onClick={onAddFood}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-sage-200 rounded-xl text-sage-500 hover:border-sage-400 hover:text-sage-600 hover:bg-sage-50/50 transition-colors active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add food</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
