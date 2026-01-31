import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function getStatusMessage(current: number, goal: number): { message: string; status: 'under' | 'on_track' | 'over' } {
  const remaining = goal - current
  const percentage = (current / goal) * 100

  if (percentage > 105) {
    return { message: `${formatNumber(Math.abs(remaining))} over budget`, status: 'over' }
  } else if (percentage >= 90) {
    return { message: 'Almost there!', status: 'on_track' }
  } else if (percentage >= 50) {
    return { message: `${formatNumber(remaining)} remaining`, status: 'on_track' }
  } else {
    return { message: `${formatNumber(remaining)} to go`, status: 'under' }
  }
}

export function calculateBMR(
  weight: number, // kg
  height: number, // cm
  age: number,
  sex: 'male' | 'female'
): number {
  // Mifflin-St Jeor Equation
  const base = 10 * weight + 6.25 * height - 5 * age
  return sex === 'male' ? base + 5 : base - 161
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  }
  return Math.round(bmr * (multipliers[activityLevel] || 1.2))
}

// Validation helpers
export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateAge(age: string): ValidationResult {
  const num = parseInt(age, 10)
  if (isNaN(num) || age.trim() === '') {
    return { isValid: false, error: 'Age is required' }
  }
  if (num < 13) {
    return { isValid: false, error: 'Must be at least 13 years old' }
  }
  if (num > 120) {
    return { isValid: false, error: 'Please enter a valid age' }
  }
  return { isValid: true }
}

export function validateHeightFeet(feet: string): ValidationResult {
  const num = parseInt(feet, 10)
  if (isNaN(num) || feet.trim() === '') {
    return { isValid: false, error: 'Feet is required' }
  }
  if (num < 3 || num > 8) {
    return { isValid: false, error: 'Feet must be between 3 and 8' }
  }
  return { isValid: true }
}

export function validateHeightInches(inches: string): ValidationResult {
  const num = parseInt(inches, 10)
  if (inches.trim() === '') {
    return { isValid: true } // Inches can be empty (defaults to 0)
  }
  if (isNaN(num)) {
    return { isValid: false, error: 'Invalid inches value' }
  }
  if (num < 0 || num > 11) {
    return { isValid: false, error: 'Inches must be 0-11' }
  }
  return { isValid: true }
}

export function validateWeight(weight: string): ValidationResult {
  const num = parseFloat(weight)
  if (isNaN(num) || weight.trim() === '') {
    return { isValid: false, error: 'Weight is required' }
  }
  if (num < 50) {
    return { isValid: false, error: 'Weight must be at least 50 lbs' }
  }
  if (num > 700) {
    return { isValid: false, error: 'Please enter a valid weight' }
  }
  return { isValid: true }
}

export function validateCalories(calories: string): ValidationResult {
  const num = parseInt(calories, 10)
  if (isNaN(num) || calories.trim() === '') {
    return { isValid: false, error: 'Calories is required' }
  }
  if (num < 0) {
    return { isValid: false, error: 'Calories cannot be negative' }
  }
  if (num > 10000) {
    return { isValid: false, error: 'Please enter a realistic calorie value' }
  }
  return { isValid: true }
}

// Height conversion helpers
export function feetInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches
  return totalInches * 2.54
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return { feet, inches }
}

// Format date for display (timezone-safe)
export function formatShortDate(dateStr: string): string {
  // Parse YYYY-MM-DD format manually to avoid timezone issues
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day) // month is 0-indexed
  return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)
}
