'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Onboarding } from '@/components/onboarding/Onboarding'
import { HomePage } from '@/components/pages/HomePage'
import { LogPage } from '@/components/pages/LogPage'
import { ProgressPage } from '@/components/pages/ProgressPage'
import { TabNav } from '@/components/layout/TabNav'
import { DesktopLayout } from '@/components/layout/DesktopLayout'
import { FAB } from '@/components/layout/FAB'
import { ToastProvider } from '@/components/ui/Toast'
import { useStore, MealType } from '@/store'

export default function App() {
  const [mounted, setMounted] = useState(false)
  const [pendingMeal, setPendingMeal] = useState<MealType | undefined>()
  const { hasCompletedOnboarding, activeTab, setActiveTab, hydrateTodayLog } = useStore()

  // Handle hydration - sync todayLog with foodHistory
  useEffect(() => {
    setMounted(true)
    hydrateTodayLog()
  }, [hydrateTodayLog])

  const handleAddFood = (mealType?: MealType) => {
    setPendingMeal(mealType)
    setActiveTab('log')
  }

  const handleFABClick = () => {
    setActiveTab('log')
    setPendingMeal(undefined)
  }

  // Clear pending meal when navigating away from log
  useEffect(() => {
    if (activeTab !== 'log') {
      setPendingMeal(undefined)
    }
  }, [activeTab])

  // Show loading skeleton during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-sage-200 border-t-sage-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  // Show onboarding if not completed
  if (!hasCompletedOnboarding) {
    return (
      <ToastProvider>
        <Onboarding />
      </ToastProvider>
    )
  }

  return (
    <ToastProvider>
      <DesktopLayout>
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HomePage onAddFood={handleAddFood} />
              </motion.div>
            )}

            {activeTab === 'log' && (
              <motion.div
                key="log"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LogPage initialMealType={pendingMeal} />
              </motion.div>
            )}

            {activeTab === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ProgressPage />
              </motion.div>
            )}
          </AnimatePresence>

          {/* FAB - only show on home tab, hide on desktop */}
          {activeTab === 'home' && (
            <div className="lg:hidden">
              <FAB onClick={handleFABClick} />
            </div>
          )}

          {/* Bottom Navigation - mobile only */}
          <div className="lg:hidden">
            <TabNav />
          </div>
        </div>
      </DesktopLayout>
    </ToastProvider>
  )
}
