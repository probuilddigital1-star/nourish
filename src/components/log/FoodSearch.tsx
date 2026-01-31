'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { searchFoods, SearchFood } from '@/services/foodApi'

interface FoodSearchProps {
  onSearch: (query: string) => void
  onSelectFood: (food: SearchFood) => void
  placeholder?: string
}

export function FoodSearch({ onSearch, onSelectFood, placeholder = "Search foods..." }: FoodSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchFood[]>([])
  const [showResults, setShowResults] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounced search with USDA API
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowResults(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setIsLoading(true)
    const timer = setTimeout(async () => {
      try {
        const foods = await searchFoods(query, 15)
        setResults(foods)
        setShowResults(foods.length > 0)
        onSearch(query)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 400) // Slightly longer debounce for API calls

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setShowResults(false)
  }, [])

  const handleSelectFood = useCallback((food: SearchFood) => {
    onSelectFood(food)
    setQuery('')
    setResults([])
    setShowResults(false)
  }, [onSelectFood])

  // Close dropdown when clicking outside
  const handleBlur = useCallback(() => {
    // Delay to allow click on dropdown item to register
    setTimeout(() => {
      setIsFocused(false)
      setShowResults(false)
    }, 200)
  }, [])

  return (
    <div className="relative">
      {/* Search input */}
      <div
        className={cn(
          'relative flex items-center gap-3 px-4 h-12 bg-white rounded-2xl border-2 transition-all duration-200',
          isFocused ? 'border-sage-400 shadow-soft' : 'border-sage-100'
        )}
      >
        <Search
          className={cn(
            'w-5 h-5 transition-colors',
            isFocused ? 'text-sage-500' : 'text-gray-400'
          )}
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            if (results.length > 0) setShowResults(true)
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-charcoal placeholder:text-gray-400 outline-none text-sm"
        />

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2 className="w-5 h-5 text-sage-500 animate-spin" />
            </motion.div>
          )}
          {query && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="p-1 hover:bg-sage-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Search results dropdown */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-soft-lg border border-sage-100 overflow-hidden z-50"
          >
            <div className="max-h-64 overflow-y-auto">
              {results.map((food, index) => (
                <button
                  key={food.id}
                  type="button"
                  onClick={() => handleSelectFood(food)}
                  className="w-full flex items-center justify-between p-3 hover:bg-sage-50 active:bg-sage-100 transition-colors border-b border-sage-50 last:border-b-0 group"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-charcoal">{food.name}</p>
                    <p className="text-xs text-gray-400">{food.brand} • {food.servingSize} {food.servingUnit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-sage-600">
                      {food.calories} cal
                    </span>
                    <div className="w-7 h-7 bg-sage-100 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-sage-600" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
