'use client'

import {
  Coffee,
  Sun,
  Moon,
  Apple,
  Utensils,
  Beef,
  Fish,
  Egg,
  Wheat,
  Milk,
  Salad,
  Cookie,
  Sandwich,
  Pizza,
  Drumstick,
  Cherry,
  Grape,
  Banana,
  Carrot,
  Croissant,
  IceCream,
  Cake,
  Wine,
  Beer,
  CupSoda,
  GlassWater,
  Soup,
  Flame,
  Scale,
  Dumbbell,
  TrendingDown,
  TrendingUp,
  Minus,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Food category icons with consistent styling
export const foodIcons: Record<string, LucideIcon> = {
  // Proteins
  chicken: Drumstick,
  beef: Beef,
  fish: Fish,
  egg: Egg,

  // Dairy
  yogurt: Milk,
  milk: Milk,
  cheese: Milk,

  // Grains
  rice: Wheat,
  bread: Sandwich,
  oatmeal: Wheat,
  pasta: Wheat,
  croissant: Croissant,

  // Fruits
  apple: Apple,
  banana: Banana,
  cherry: Cherry,
  grape: Grape,
  fruit: Apple,

  // Vegetables
  salad: Salad,
  carrot: Carrot,
  vegetable: Salad,

  // Nuts & Seeds
  almonds: Cookie,
  nuts: Cookie,

  // Prepared Foods
  sandwich: Sandwich,
  pizza: Pizza,
  soup: Soup,

  // Sweets
  cookie: Cookie,
  cake: Cake,
  icecream: IceCream,

  // Drinks
  coffee: Coffee,
  water: GlassWater,
  soda: CupSoda,
  wine: Wine,
  beer: Beer,

  // Default
  food: Utensils,
  default: Utensils,
}

// Meal type icons
export const mealIcons: Record<string, LucideIcon> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Apple,
}

// Goal type icons
export const goalIcons: Record<string, LucideIcon> = {
  lose: TrendingDown,
  maintain: Scale,
  gain: TrendingUp,
}

// Activity icons
export const activityIcons: Record<string, LucideIcon> = {
  sedentary: Minus,
  lightly_active: Flame,
  moderately_active: Flame,
  very_active: Dumbbell,
  extremely_active: Dumbbell,
}

interface FoodIconProps {
  name: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// Get the best matching icon for a food name
function getFoodIconKey(name: string): string {
  const lowercaseName = name.toLowerCase()

  // Check for exact matches first
  if (foodIcons[lowercaseName]) return lowercaseName

  // Check for partial matches
  const keywords: [string, string][] = [
    ['chicken', 'chicken'],
    ['beef', 'beef'],
    ['steak', 'beef'],
    ['fish', 'fish'],
    ['salmon', 'fish'],
    ['tuna', 'fish'],
    ['egg', 'egg'],
    ['yogurt', 'yogurt'],
    ['milk', 'milk'],
    ['cheese', 'cheese'],
    ['rice', 'rice'],
    ['bread', 'bread'],
    ['toast', 'bread'],
    ['oat', 'oatmeal'],
    ['pasta', 'pasta'],
    ['apple', 'apple'],
    ['banana', 'banana'],
    ['fruit', 'fruit'],
    ['berry', 'cherry'],
    ['salad', 'salad'],
    ['vegetable', 'vegetable'],
    ['veggie', 'vegetable'],
    ['broccoli', 'vegetable'],
    ['carrot', 'carrot'],
    ['almond', 'almonds'],
    ['nut', 'nuts'],
    ['peanut', 'nuts'],
    ['sandwich', 'sandwich'],
    ['burger', 'sandwich'],
    ['pizza', 'pizza'],
    ['soup', 'soup'],
    ['cookie', 'cookie'],
    ['cake', 'cake'],
    ['ice cream', 'icecream'],
    ['coffee', 'coffee'],
    ['water', 'water'],
    ['soda', 'soda'],
    ['juice', 'soda'],
    ['wine', 'wine'],
    ['beer', 'beer'],
    ['avocado', 'fruit'],
    ['protein', 'chicken'],
  ]

  for (const [keyword, iconKey] of keywords) {
    if (lowercaseName.includes(keyword)) {
      return iconKey
    }
  }

  return 'default'
}

export function FoodIcon({ name, className, size = 'md' }: FoodIconProps) {
  const iconKey = getFoodIconKey(name)
  const Icon = foodIcons[iconKey] || foodIcons.default

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return <Icon className={cn(sizeClasses[size], className)} />
}

interface MealIconProps {
  mealType: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function MealIcon({ mealType, className, size = 'md' }: MealIconProps) {
  const Icon = mealIcons[mealType.toLowerCase()] || mealIcons.snack

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return <Icon className={cn(sizeClasses[size], className)} />
}

// Styled wrapper for food icons with background
interface FoodIconBadgeProps {
  name: string
  className?: string
  variant?: 'sage' | 'terracotta' | 'neutral'
}

export function FoodIconBadge({ name, className, variant = 'sage' }: FoodIconBadgeProps) {
  const variantStyles = {
    sage: 'bg-sage-100 text-sage-600',
    terracotta: 'bg-terracotta-100 text-terracotta-600',
    neutral: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className={cn(
      'w-10 h-10 rounded-xl flex items-center justify-center',
      variantStyles[variant],
      className
    )}>
      <FoodIcon name={name} size="md" />
    </div>
  )
}

// Styled wrapper for meal icons with background
interface MealIconBadgeProps {
  mealType: string
  className?: string
  isActive?: boolean
}

export function MealIconBadge({ mealType, className, isActive = false }: MealIconBadgeProps) {
  return (
    <div className={cn(
      'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
      isActive
        ? 'bg-white/20 text-white'
        : 'bg-sage-100 text-sage-600',
      className
    )}>
      <MealIcon mealType={mealType} size="md" />
    </div>
  )
}
