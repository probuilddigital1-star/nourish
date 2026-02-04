'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Flame, Beef, Wheat, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface FoodData {
  name: string
  brand?: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: number
  servingUnit: string
}

interface FoodDetailModalProps {
  isOpen: boolean
  food: FoodData | null
  onClose: () => void
  onAdd: (food: FoodData) => void
}

export function FoodDetailModal({ isOpen, food, onClose, onAdd }: FoodDetailModalProps) {
  const [servings, setServings] = useState(1)

  // Reset servings when food changes
  const currentFood = food
  const [lastFoodName, setLastFoodName] = useState('')
  if (currentFood && currentFood.name !== lastFoodName) {
    setServings(1)
    setLastFoodName(currentFood.name)
  }

  const scaled = useMemo(() => {
    if (!food) return null
    return {
      calories: Math.round(food.calories * servings),
      protein: Math.round(food.protein * servings),
      carbs: Math.round(food.carbs * servings),
      fat: Math.round(food.fat * servings),
      servingSize: Math.round(food.servingSize * servings * 10) / 10,
    }
  }, [food, servings])

  const adjustServings = (delta: number) => {
    setServings(prev => Math.max(0.25, Math.round((prev + delta) * 4) / 4))
  }

  const handleAdd = () => {
    if (!food || !scaled) return
    onAdd({
      ...food,
      calories: scaled.calories,
      protein: scaled.protein,
      carbs: scaled.carbs,
      fat: scaled.fat,
      servingSize: scaled.servingSize,
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && food && scaled && (
        <>
          <motion.div
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className={cn(
              'fixed z-50 bg-white overflow-hidden',
              'bottom-0 left-0 right-0 rounded-t-3xl',
              'lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2',
              'lg:rounded-3xl lg:w-full lg:max-w-md'
            )}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Handle - mobile only */}
            <div className="flex justify-center pt-3 pb-2 lg:hidden">
              <div className="w-10 h-1 bg-sage-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-6 pb-3 pt-2 lg:pt-6">
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg font-semibold text-charcoal truncate">
                  {food.name}
                </h2>
                {food.brand && (
                  <p className="text-sm text-gray-400 mt-0.5">{food.brand}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sage-100 rounded-xl transition-colors ml-2 flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 pb-8 space-y-5">
              {/* Serving size adjuster */}
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500 mb-3">Servings</span>

                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => adjustServings(-0.25)}
                    className="w-11 h-11 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center min-w-[100px]">
                    <span className="text-3xl font-display font-semibold text-charcoal">
                      {servings}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {scaled.servingSize} {food.servingUnit}
                    </p>
                  </div>

                  <motion.button
                    onClick={() => adjustServings(0.25)}
                    className="w-11 h-11 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Quick serving buttons */}
                <div className="flex gap-2 mt-3">
                  {[0.5, 1, 1.5, 2].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setServings(amount)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        servings === amount
                          ? 'bg-sage-500 text-white'
                          : 'bg-sage-50 text-sage-600 hover:bg-sage-100'
                      )}
                    >
                      {amount}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Nutrition breakdown */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-orange-50 rounded-xl p-3 text-center">
                  <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-charcoal">{scaled.calories}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">cal</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <Beef className="w-4 h-4 text-red-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-charcoal">{scaled.protein}g</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">protein</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <Wheat className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-charcoal">{scaled.carbs}g</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">carbs</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <p className="text-lg font-semibold text-charcoal">{scaled.fat}g</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">fat</p>
                </div>
              </div>

              {/* Add button */}
              <Button onClick={handleAdd} className="w-full" size="lg">
                Add {scaled.calories} calories
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
