'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'elevated' | 'flat' | 'glass'
  interactive?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', interactive = false, children, ...props }, ref) => {
    const baseStyles = 'rounded-2xl'

    const variants = {
      elevated: 'bg-white shadow-soft',
      flat: 'bg-sage-50 border border-sage-100',
      glass: 'bg-white/70 backdrop-blur-md border border-white/50 shadow-soft',
    }

    const interactiveStyles = interactive
      ? 'cursor-pointer transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-0.5 active:scale-[0.99]'
      : ''

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], interactiveStyles, className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
