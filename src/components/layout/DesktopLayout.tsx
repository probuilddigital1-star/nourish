'use client'

import { motion } from 'framer-motion'
import { Home, UtensilsCrossed, TrendingUp, Settings, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

interface DesktopLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'log', label: 'Log Food', icon: UtensilsCrossed },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
] as const

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const { activeTab, setActiveTab, profile } = useStore()

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-sage-100 fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-sage-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-charcoal">Nourish</h1>
              <p className="text-xs text-gray-400">Calorie Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id
              const Icon = item.icon

              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all',
                      isActive
                        ? 'bg-sage-100 text-sage-700 font-medium'
                        : 'text-gray-600 hover:bg-sage-50 hover:text-sage-600'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-indicator"
                        className="absolute left-0 w-1 h-8 bg-sage-500 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={cn('w-5 h-5', isActive && 'text-sage-600')} />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-sage-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sage-50 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center text-white font-medium">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-charcoal">{profile?.name || 'User'}</p>
              <p className="text-xs text-gray-400">View profile</p>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 lg:ml-64 min-w-0">
        {/* Desktop content wrapper with max-width for very large screens */}
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
