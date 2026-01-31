'use client'

import { motion } from 'framer-motion'
import { Plus, Star } from 'lucide-react'
import { FoodIcon } from '@/components/icons/FoodIcons'
import { cn, formatNumber } from '@/lib/utils'
import { Favorite, MealType, useStore } from '@/store'

interface FavoriteGridProps {
  onAddFood: (food: Favorite, mealType: MealType) => void
  selectedMeal: MealType
}

export function FavoriteGrid({ onAddFood, selectedMeal }: FavoriteGridProps) {
  const favorites = useStore((s) => s.favorites)

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 text-sage-400" />
        </div>
        <p className="text-sm text-gray-500">No favorites yet</p>
        <p className="text-xs text-gray-400 mt-1">Long-press any food to add it here</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {favorites.map((food, index) => (
        <motion.div
          key={food.id}
          className="group"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
            type: 'spring',
            stiffness: 300,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            type="button"
            onClick={() => onAddFood(food, selectedMeal)}
            className="w-full h-full"
          >
            <div
              className={cn(
                'rounded-2xl bg-sage-50 border border-sage-100',
                'p-3 sm:p-4 flex flex-col items-center text-center transition-all h-full',
                'hover:bg-sage-100 hover:border-sage-200 active:bg-sage-200'
              )}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-sage-100 group-hover:bg-sage-200 flex items-center justify-center mb-2 transition-colors">
                <FoodIcon name={food.iconKey || food.name} size="lg" className="text-sage-600" />
              </div>
              <span className="text-xs font-medium text-charcoal truncate w-full">
                {food.name}
              </span>
              <span className="text-xs text-sage-600 font-semibold mt-0.5">
                {formatNumber(food.calories)} cal
              </span>
            </div>
          </button>
        </motion.div>
      ))}

      {/* Add more button */}
      <motion.div
        className="group"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: favorites.length * 0.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          type="button"
          className={cn(
            'w-full h-full min-h-[100px] rounded-2xl',
            'p-3 sm:p-4 flex flex-col items-center justify-center',
            'border-dashed border-2 border-sage-200 bg-transparent',
            'hover:border-sage-400 hover:bg-sage-50 transition-all'
          )}
        >
          <Plus className="w-5 h-5 text-sage-400 group-hover:text-sage-500" />
          <span className="text-xs text-sage-400 mt-1 group-hover:text-sage-500">Add</span>
        </button>
      </motion.div>
    </div>
  )
}
