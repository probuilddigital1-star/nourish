export interface Achievement {
  id: string
  name: string
  description: string
  category: 'consistency' | 'nutrition' | 'exploration' | 'milestone'
  icon: string // Lucide icon name
}

export const ACHIEVEMENTS: Achievement[] = [
  // Consistency
  { id: 'first_log', name: 'First Bite', description: 'Log your first food', category: 'consistency', icon: 'Sprout' },
  { id: 'streak_3', name: 'Getting Started', description: '3-day logging streak', category: 'consistency', icon: 'Flame' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day logging streak', category: 'consistency', icon: 'Flame' },
  { id: 'streak_14', name: 'Fortnight Strong', description: '14-day logging streak', category: 'consistency', icon: 'Flame' },
  { id: 'streak_30', name: 'Monthly Master', description: '30-day logging streak', category: 'consistency', icon: 'Crown' },

  // Nutrition
  { id: 'goal_hit', name: 'On Target', description: 'Hit your daily calorie goal', category: 'nutrition', icon: 'Target' },
  { id: 'all_meals', name: 'Full Day', description: 'Log all 4 meal types in a day', category: 'nutrition', icon: 'Utensils' },
  { id: 'macro_master', name: 'Macro Master', description: 'Hit all macro goals in a day', category: 'nutrition', icon: 'Award' },
  { id: 'protein_week', name: 'Protein Pro', description: 'Hit protein goal 7 days in a row', category: 'nutrition', icon: 'Beef' },
  { id: 'hydrated', name: 'Hydrated', description: 'Drink 8 glasses of water', category: 'nutrition', icon: 'Droplets' },

  // Exploration
  { id: 'ai_explorer', name: 'AI Explorer', description: 'Use AI assistant 5 times', category: 'exploration', icon: 'Sparkles' },
  { id: 'scanner', name: 'Scanner Pro', description: 'Scan your first barcode', category: 'exploration', icon: 'ScanLine' },
  { id: 'variety_10', name: 'Adventurous Eater', description: 'Log 10 unique foods', category: 'exploration', icon: 'Leaf' },
  { id: 'variety_25', name: 'Food Explorer', description: 'Log 25 unique foods', category: 'exploration', icon: 'TreePine' },

  // Milestones
  { id: 'foods_50', name: 'Half Century', description: 'Log 50 total food entries', category: 'milestone', icon: 'Star' },
  { id: 'foods_100', name: 'Centurion', description: 'Log 100 total food entries', category: 'milestone', icon: 'Trophy' },
  { id: 'level_bloom', name: 'In Full Bloom', description: 'Reach Bloom level', category: 'milestone', icon: 'Flower2' },
]

export const LEVEL_THRESHOLDS = [
  { name: 'Seed', xp: 0, icon: 'Circle' },
  { name: 'Seedling', xp: 100, icon: 'Sprout' },
  { name: 'Sprout', xp: 300, icon: 'Leaf' },
  { name: 'Sapling', xp: 600, icon: 'TreeDeciduous' },
  { name: 'Bloom', xp: 1000, icon: 'Flower2' },
  { name: 'Flourish', xp: 2000, icon: 'Trees' },
  { name: 'Ancient Oak', xp: 5000, icon: 'TreePine' },
] as const

export function getLevelForXP(xp: number) {
  let current = LEVEL_THRESHOLDS[0]
  let next = LEVEL_THRESHOLDS[1]

  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      current = LEVEL_THRESHOLDS[i]
      next = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i]
      break
    }
  }

  const xpInLevel = xp - current.xp
  const xpForNext = next.xp - current.xp
  const progress = xpForNext > 0 ? Math.min(xpInLevel / xpForNext, 1) : 1

  return { current, next, xpInLevel, xpForNext, progress }
}

export const XP_REWARDS = {
  FOOD_LOGGED: 10,
  CALORIE_GOAL: 50,
  MACRO_GOAL: 25,
  FIRST_LOG_OF_DAY: 15,
  STREAK_BONUS: 5,
  WATER_COMPLETE: 20,
} as const
