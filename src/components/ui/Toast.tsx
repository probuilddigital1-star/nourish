'use client'

import { useEffect, useState, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { Check, X, AlertCircle, Info, Flame, Award } from 'lucide-react'
import { FoodIcon } from '@/components/icons/FoodIcons'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'achievement'

interface ToastMeta {
  foodName?: string
  calories?: number
  caloriesRemaining?: number
  achievementName?: string
}

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
  meta?: ToastMeta
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, duration?: number, meta?: ToastMeta) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success', duration = 3000, meta?: ToastMeta) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type, duration, meta }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function AnimatedCalories({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 80, damping: 20 })
  const display = useTransform(spring, (v) => Math.round(v))
  const [shown, setShown] = useState(0)

  useEffect(() => {
    spring.set(value)
    return spring.on('change', (v) => setShown(Math.round(v)))
  }, [value, spring])

  return <span>{shown}</span>
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(onRemove, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onRemove])

  const isAchievement = toast.type === 'achievement'
  const hasFoodMeta = toast.meta?.foodName && toast.meta?.calories

  if (isAchievement) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg pointer-events-auto bg-white/90 backdrop-blur-xl border border-gold-400/30"
      >
        <div className="w-9 h-9 rounded-full bg-gold-400/20 flex items-center justify-center flex-shrink-0">
          <Award className="w-5 h-5 text-gold-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-gold-500 uppercase tracking-wide">Achievement Unlocked</p>
          <p className="text-sm font-semibold text-charcoal font-display italic">{toast.meta?.achievementName || toast.message}</p>
        </div>
      </motion.div>
    )
  }

  if (hasFoodMeta) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg pointer-events-auto bg-white/90 backdrop-blur-xl border-l-4 border-sage-500"
      >
        <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
          <FoodIcon name={toast.meta!.foodName!} size="md" className="text-sage-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-charcoal truncate">{toast.meta!.foodName}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-semibold text-sage-600">
              +<AnimatedCalories value={toast.meta!.calories!} /> cal
            </span>
            {toast.meta!.caloriesRemaining != null && toast.meta!.caloriesRemaining > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <span>{toast.meta!.caloriesRemaining} left</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-sage-500">
          <Flame className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">+10 XP</span>
        </div>
      </motion.div>
    )
  }

  // Default toast
  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    achievement: <Award className="w-5 h-5" />,
  }

  const colors = {
    success: 'bg-sage-500 text-white',
    error: 'bg-terracotta-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-sky-500 text-white',
    achievement: 'bg-gold-400 text-white',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg pointer-events-auto',
        colors[toast.type]
      )}
    >
      <span className="flex-shrink-0">{icons[toast.type]}</span>
      <span className="text-sm font-medium">{toast.message}</span>
    </motion.div>
  )
}
