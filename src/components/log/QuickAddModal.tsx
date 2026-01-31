'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Coffee, Sun, Moon, Apple } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { MealType } from '@/store'

interface QuickAddModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (calories: number, mealType: MealType, notes?: string) => void
}

const mealOptions: { id: MealType; label: string; icon: typeof Coffee }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'lunch', label: 'Lunch', icon: Sun },
  { id: 'dinner', label: 'Dinner', icon: Moon },
  { id: 'snack', label: 'Snack', icon: Apple },
]

export function QuickAddModal({ isOpen, onClose, onAdd }: QuickAddModalProps) {
  const [calories, setCalories] = useState(200)
  const [selectedMeal, setSelectedMeal] = useState<MealType>('snack')
  const [notes, setNotes] = useState('')

  const handleAdd = () => {
    onAdd(calories, selectedMeal, notes || undefined)
    setCalories(200)
    setNotes('')
    onClose()
  }

  const adjustCalories = (amount: number) => {
    setCalories((prev) => Math.max(0, prev + amount))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal - centered on desktop, bottom sheet on mobile */}
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
            <div className="flex items-center justify-between px-6 pb-4 pt-2 lg:pt-6">
              <h2 className="font-display text-xl font-semibold text-charcoal">
                Quick Add
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sage-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 pb-8 space-y-6">
              {/* Calorie input */}
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500 mb-3">Calories</span>

                <div className="flex items-center gap-4">
                  <motion.button
                    onClick={() => adjustCalories(-50)}
                    className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>

                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-32 text-center text-4xl font-display font-semibold text-charcoal bg-transparent outline-none"
                  />

                  <motion.button
                    onClick={() => adjustCalories(50)}
                    className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Quick increment buttons */}
                <div className="flex gap-2 mt-4">
                  {[50, 100, 200].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => adjustCalories(amount)}
                      className="px-3 py-1.5 bg-sage-50 rounded-lg text-sm text-sage-600 hover:bg-sage-100 transition-colors"
                    >
                      +{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal type selector */}
              <div>
                <span className="text-sm text-gray-500 mb-3 block">Add to</span>
                <div className="grid grid-cols-4 gap-2">
                  {mealOptions.map((meal) => {
                    const Icon = meal.icon
                    const isSelected = selectedMeal === meal.id

                    return (
                      <button
                        key={meal.id}
                        onClick={() => setSelectedMeal(meal.id)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all',
                          isSelected
                            ? 'bg-sage-500 text-white'
                            : 'bg-sage-50 text-charcoal hover:bg-sage-100'
                        )}
                      >
                        <Icon className={cn('w-5 h-5', isSelected ? 'text-white' : 'text-sage-500')} />
                        <span className="text-xs font-medium">{meal.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Notes input */}
              <div>
                <span className="text-sm text-gray-500 mb-2 block">Notes (optional)</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Afternoon snack"
                  className="w-full h-11 px-4 bg-sage-50 rounded-xl text-sm text-charcoal placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-sage-400"
                />
              </div>

              {/* Add button */}
              <Button onClick={handleAdd} className="w-full" size="lg">
                Add {calories} calories
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
