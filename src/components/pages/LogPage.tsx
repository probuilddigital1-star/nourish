'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Coffee, Sun, Moon, Apple } from 'lucide-react'
import { FoodSearch } from '@/components/log/FoodSearch'
import { QuickActions } from '@/components/log/QuickActions'
import { FavoriteGrid } from '@/components/log/FavoriteGrid'
import { RecentList } from '@/components/log/RecentList'
import { AIAssistant } from '@/components/log/AIAssistant'
import { QuickAddModal } from '@/components/log/QuickAddModal'
import { BarcodeScanner } from '@/components/log/BarcodeScanner'
import { useToast } from '@/components/ui/Toast'
import { useStore, Favorite, MealType } from '@/store'
import { cn } from '@/lib/utils'
import { SearchFood } from '@/services/foodApi'

interface LogPageProps {
  initialMealType?: MealType
}

const mealOptions: { id: MealType; label: string; icon: typeof Coffee }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'lunch', label: 'Lunch', icon: Sun },
  { id: 'dinner', label: 'Dinner', icon: Moon },
  { id: 'snack', label: 'Snack', icon: Apple },
]

export function LogPage({ initialMealType = 'snack' }: LogPageProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealType>(initialMealType)
  const [activeSection, setActiveSection] = useState<'favorites' | 'recent'>('favorites')
  const [showAI, setShowAI] = useState(false)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showScanner, setShowScanner] = useState(false)

  const { addFood } = useStore()
  const { addToast } = useToast()

  const handleSearch = useCallback((query: string) => {
    console.log('Searching:', query)
  }, [])

  const handleSelectFood = useCallback((food: { name: string; calories: number; protein: number; carbs: number; fat: number; servingSize: number; servingUnit: string }) => {
    addFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      mealType: selectedMeal,
    })
    addToast(`Added ${food.name} to ${selectedMeal}`, 'success')
  }, [addFood, addToast, selectedMeal])

  const handleAddFavorite = useCallback((food: Favorite, mealType: MealType) => {
    addFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      mealType,
      iconKey: food.iconKey,
    })
    addToast(`Added ${food.name} to ${mealType}`, 'success')
  }, [addFood, addToast])

  const handleQuickAdd = useCallback((calories: number, mealType: MealType, notes?: string) => {
    addFood({
      name: notes || 'Quick add',
      calories,
      protein: 0,
      carbs: 0,
      fat: 0,
      servingSize: 1,
      servingUnit: 'serving',
      mealType,
    })
    addToast(`Added ${calories} calories to ${mealType}`, 'success')
  }, [addFood, addToast])

  const handleAIAdd = useCallback((food: { name: string; calories: number; protein: number; carbs: number; fat: number; servingSize?: number; servingUnit?: string }) => {
    addFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.servingSize || 1,
      servingUnit: food.servingUnit || 'serving',
      mealType: selectedMeal,
    })
    addToast(`Added ${food.name} to ${selectedMeal}`, 'success')
    setShowAI(false)
  }, [addFood, addToast, selectedMeal])

  const handleBarcodeFood = useCallback((food: SearchFood) => {
    addFood({
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      servingSize: food.servingSize,
      servingUnit: food.servingUnit,
      mealType: selectedMeal,
    })
    addToast(`Added ${food.name} to ${selectedMeal}`, 'success')
  }, [addFood, addToast, selectedMeal])

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 pt-4 lg:pt-12 pb-3 bg-cream lg:sticky lg:top-0 lg:z-30 lg:bg-cream/80 lg:backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-xl lg:text-3xl font-semibold text-charcoal mb-3">
            Log Food
          </h1>

          {/* Meal selector - grid on mobile, flex on desktop */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:flex sm:flex-wrap">
            {mealOptions.map((meal) => {
              const Icon = meal.icon
              const isSelected = selectedMeal === meal.id

              return (
                <button
                  key={meal.id}
                  onClick={() => setSelectedMeal(meal.id)}
                  className={cn(
                    'flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-3 rounded-xl text-[10px] sm:text-sm font-medium transition-all',
                    isSelected
                      ? 'bg-sage-500 text-white shadow-sm'
                      : 'bg-white text-charcoal hover:bg-sage-50 border border-sage-100'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isSelected ? 'text-white' : 'text-sage-500')} />
                  <span>{meal.label}</span>
                </button>
              )
            })}
          </div>

          {/* Search */}
          <FoodSearch onSearch={handleSearch} onSelectFood={handleSelectFood} />
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 pt-3 space-y-4">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <QuickActions
            onScan={() => setShowScanner(true)}
            onQuickAdd={() => setShowQuickAdd(true)}
            onAI={() => setShowAI(true)}
          />

          {/* Section tabs */}
          <div className="flex gap-1 p-1 bg-sage-100 rounded-xl mt-4">
            <button
              onClick={() => setActiveSection('favorites')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeSection === 'favorites'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-sage-600 hover:text-sage-700'
              )}
            >
              <Star className="w-4 h-4" />
              Favorites
            </button>
            <button
              onClick={() => setActiveSection('recent')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors',
                activeSection === 'recent'
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-sage-600 hover:text-sage-700'
              )}
            >
              <Clock className="w-4 h-4" />
              Recent
            </button>
          </div>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 pb-4"
          >
            {activeSection === 'favorites' ? (
              <FavoriteGrid onAddFood={handleAddFavorite} selectedMeal={selectedMeal} />
            ) : (
              <RecentList onAddFood={handleAddFavorite} selectedMeal={selectedMeal} />
            )}
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      <AIAssistant
        isOpen={showAI}
        onClose={() => setShowAI(false)}
        onAddFood={handleAIAdd}
      />

      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onAdd={handleQuickAdd}
      />

      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onFoodFound={handleBarcodeFood}
      />
    </div>
  )
}
