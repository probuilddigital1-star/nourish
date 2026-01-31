'use client'

import { motion } from 'framer-motion'
import { Home, UtensilsCrossed, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'log', label: 'Log', icon: UtensilsCrossed },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
] as const

export function TabNav() {
  const { activeTab, setActiveTab } = useStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-sage-100" />

      {/* Tab items */}
      <div className="relative flex items-center justify-around px-6 h-20 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-colors',
                isActive ? 'text-sage-600' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 bg-sage-100 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <Icon
                className={cn(
                  'relative w-6 h-6 transition-transform',
                  isActive && 'scale-110'
                )}
              />
              <span className="relative text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Safe area spacer */}
      <div className="h-safe-area-inset-bottom bg-white/80" />
    </nav>
  )
}
