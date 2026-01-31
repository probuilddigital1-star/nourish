'use client'

import { motion } from 'framer-motion'
import { Clock, Plus } from 'lucide-react'
import { FoodIconBadge } from '@/components/icons/FoodIcons'
import { cn, formatNumber } from '@/lib/utils'
import { Favorite, MealType, useStore } from '@/store'

interface RecentListProps {
  onAddFood: (food: Favorite, mealType: MealType) => void
  selectedMeal: MealType
}

export function RecentList({ onAddFood, selectedMeal }: RecentListProps) {
  const recentFoods = useStore((s) => s.recentFoods)

  if (recentFoods.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-sage-400" />
        </div>
        <p className="text-sm text-gray-500">No recent foods</p>
        <p className="text-xs text-gray-400 mt-1">Foods you log will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {recentFoods.slice(0, 10).map((food, index) => (
        <motion.button
          key={food.id}
          onClick={() => onAddFood(food, selectedMeal)}
          className={cn(
            'w-full flex items-center justify-between p-3 sm:p-4 rounded-xl',
            'bg-white hover:bg-sage-50 active:bg-sage-100',
            'transition-colors group'
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <FoodIconBadge name={food.iconKey || food.name} variant="sage" />
            <div className="text-left min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">
                {food.name}
              </p>
              <p className="text-xs text-gray-400">
                {food.servingSize} {food.servingUnit}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm font-semibold text-sage-600">
              {formatNumber(food.calories)} cal
            </span>
            <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="w-4 h-4 text-sage-600" />
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}
