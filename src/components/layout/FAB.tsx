'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FABProps {
  onClick: () => void
  className?: string
}

export function FAB({ onClick, className }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'fixed z-50 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-sage-500 to-sage-600 text-white rounded-full shadow-lg shadow-sage-500/30',
        'bottom-24 right-6',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20,
      }}
    >
      <Plus className="w-6 h-6" />

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-sage-500"
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeOut',
        }}
      />
    </motion.button>
  )
}
