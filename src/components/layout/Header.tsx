'use client'

import { motion } from 'framer-motion'
import { Settings, Bell } from 'lucide-react'
import { getGreeting, formatDate } from '@/lib/utils'
import { useStore } from '@/store'
import { LevelBadge } from '@/components/gamification/LevelBadge'

export function Header() {
  const profile = useStore((s) => s.profile)
  const name = profile?.name || 'there'

  return (
    <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12 pb-4">
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-cream/80 backdrop-blur-xl" />

      <div className="relative flex items-start justify-between max-w-4xl mx-auto lg:max-w-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-charcoal">
            {getGreeting()}, {name}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatDate(new Date())}
          </p>
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <LevelBadge />
          <button className="p-2 hover:bg-sage-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
          </button>
          {/* Settings button - only on mobile since desktop has sidebar */}
          <button className="p-2 hover:bg-sage-100 rounded-xl transition-colors lg:hidden">
            <Settings className="w-5 h-5 text-gray-500" />
          </button>

          {/* Avatar - only on mobile since desktop has sidebar */}
          <div className="lg:hidden w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center text-white font-medium text-sm ml-1">
            {name.charAt(0).toUpperCase()}
          </div>
        </motion.div>
      </div>
    </header>
  )
}
