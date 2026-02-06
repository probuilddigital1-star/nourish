import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getLevelForXP, XP_REWARDS, ACHIEVEMENTS } from '@/lib/achievements'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: number
  servingUnit: string
  mealType: MealType
  timestamp: number
  iconKey?: string
}

export interface DailyLog {
  date: string // YYYY-MM-DD format
  entries: FoodEntry[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface WeightEntry {
  id: string
  date: string // YYYY-MM-DD format
  weight: number // in lbs
  timestamp: number
}

export interface Favorite {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: number
  servingUnit: string
  iconKey?: string // Changed from emoji to iconKey
}

export interface Goals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface UserProfile {
  name: string
  height: number // cm
  weight: number // kg
  age: number
  sex: 'male' | 'female'
  activityLevel: string
  goalType: 'lose' | 'maintain' | 'gain'
  goalWeight?: number // target weight in lbs
}

// Helper to get today's date in YYYY-MM-DD format
const getToday = () => new Date().toISOString().split('T')[0]

interface AppState {
  // Onboarding
  hasCompletedOnboarding: boolean
  setHasCompletedOnboarding: (value: boolean) => void

  // User Profile
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void

  // Goals
  goals: Goals
  setGoals: (goals: Goals) => void

  // Today's food log
  todayLog: FoodEntry[]
  addFood: (food: Omit<FoodEntry, 'id' | 'timestamp'>) => void
  removeFood: (id: string) => void
  clearTodayLog: () => void

  // Food history (persisted daily logs)
  foodHistory: DailyLog[]
  getFoodHistory: (days?: number) => DailyLog[]
  getCalorieHistory: (days?: number) => { date: string; calories: number; goal: number }[]

  // Weight tracking
  weightHistory: WeightEntry[]
  addWeight: (weight: number) => void
  getWeightHistory: (days?: number) => WeightEntry[]

  // Streak tracking
  getCurrentStreak: () => number
  getLongestStreak: () => number
  getTotalDaysLogged: () => number
  getWeekLogStatus: () => boolean[] // Last 7 days, true if logged

  // Favorites
  favorites: Favorite[]
  addFavorite: (food: Omit<Favorite, 'id'>) => void
  removeFavorite: (id: string) => void

  // Recent foods
  recentFoods: Favorite[]
  addToRecent: (food: Omit<Favorite, 'id'>) => void

  // UI State
  activeTab: 'home' | 'log' | 'progress'
  setActiveTab: (tab: 'home' | 'log' | 'progress') => void
  selectedDate: string
  setSelectedDate: (date: string) => void

  // Hydration - sync todayLog with foodHistory on startup
  hydrateTodayLog: () => void

  // Gamification
  xp: number
  achievements: string[]
  aiUseCount: number
  barcodeUsed: boolean
  addXP: (amount: number) => void
  unlockAchievement: (id: string) => void
  checkAchievements: () => string | null // returns newly unlocked achievement id
  incrementAIUse: () => void
  markBarcodeUsed: () => void
  getLevel: () => ReturnType<typeof getLevelForXP>
  getUniquefoods: () => number
  getTotalFoodsLogged: () => number

  // Water tracking
  waterIntake: number
  waterDate: string
  addWater: () => void
  removeWater: () => void

  // Computed
  getTodayCalories: () => number
  getTodayMacros: () => { protein: number; carbs: number; fat: number }
  getMealEntries: (mealType: MealType) => FoodEntry[]
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Onboarding
      hasCompletedOnboarding: false,
      setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),

      // User Profile
      profile: null,
      setProfile: (profile) => set({ profile }),

      // Goals
      goals: {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 65,
      },
      setGoals: (goals) => set({ goals }),

      // Today's food log
      todayLog: [],
      addFood: (food) => {
        const entry: FoodEntry = {
          ...food,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }
        const today = getToday()

        set((state) => {
          const newTodayLog = [...state.todayLog, entry]

          // Update or create today's history entry
          const existingIndex = state.foodHistory.findIndex(h => h.date === today)
          const totals = newTodayLog.reduce(
            (acc, e) => ({
              calories: acc.calories + e.calories,
              protein: acc.protein + e.protein,
              carbs: acc.carbs + e.carbs,
              fat: acc.fat + e.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          )

          const todayEntry: DailyLog = {
            date: today,
            entries: newTodayLog,
            totalCalories: totals.calories,
            totalProtein: totals.protein,
            totalCarbs: totals.carbs,
            totalFat: totals.fat,
          }

          const newHistory = existingIndex >= 0
            ? state.foodHistory.map((h, i) => i === existingIndex ? todayEntry : h)
            : [...state.foodHistory, todayEntry]

          return { todayLog: newTodayLog, foodHistory: newHistory }
        })

        // Award XP for logging food
        get().addXP(XP_REWARDS.FOOD_LOGGED)

        // Check if this is the first log of the day
        const todayEntries = get().todayLog
        if (todayEntries.length === 1) {
          get().addXP(XP_REWARDS.FIRST_LOG_OF_DAY)
        }

        // Also add to recent
        get().addToRecent({
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          servingSize: food.servingSize,
          servingUnit: food.servingUnit,
          iconKey: food.iconKey,
        })
      },
      removeFood: (id) => {
        const today = getToday()

        set((state) => {
          const newTodayLog = state.todayLog.filter((f) => f.id !== id)

          // Update today's history entry
          const existingIndex = state.foodHistory.findIndex(h => h.date === today)
          if (existingIndex >= 0) {
            const totals = newTodayLog.reduce(
              (acc, e) => ({
                calories: acc.calories + e.calories,
                protein: acc.protein + e.protein,
                carbs: acc.carbs + e.carbs,
                fat: acc.fat + e.fat,
              }),
              { calories: 0, protein: 0, carbs: 0, fat: 0 }
            )

            const todayEntry: DailyLog = {
              date: today,
              entries: newTodayLog,
              totalCalories: totals.calories,
              totalProtein: totals.protein,
              totalCarbs: totals.carbs,
              totalFat: totals.fat,
            }

            const newHistory = state.foodHistory.map((h, i) =>
              i === existingIndex ? todayEntry : h
            )

            return { todayLog: newTodayLog, foodHistory: newHistory }
          }

          return { todayLog: newTodayLog }
        })
      },
      clearTodayLog: () => set({ todayLog: [] }),

      // Food history (persisted daily logs)
      foodHistory: [],
      getFoodHistory: (days = 30) => {
        const { foodHistory } = get()
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        const cutoffStr = cutoff.toISOString().split('T')[0]

        return foodHistory
          .filter(h => h.date >= cutoffStr)
          .sort((a, b) => a.date.localeCompare(b.date))
      },
      getCalorieHistory: (days = 7) => {
        const { foodHistory, goals } = get()
        const result: { date: string; calories: number; goal: number }[] = []

        // Generate last N days
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const dayLog = foodHistory.find(h => h.date === dateStr)

          result.push({
            date: dateStr,
            calories: dayLog?.totalCalories || 0,
            goal: goals.calories,
          })
        }

        return result
      },

      // Weight tracking
      weightHistory: [],
      addWeight: (weight) => {
        const today = getToday()
        const entry: WeightEntry = {
          id: crypto.randomUUID(),
          date: today,
          weight,
          timestamp: Date.now(),
        }

        set((state) => {
          // Replace entry if same date, otherwise add
          const existingIndex = state.weightHistory.findIndex(w => w.date === today)
          if (existingIndex >= 0) {
            const newHistory = [...state.weightHistory]
            newHistory[existingIndex] = entry
            return { weightHistory: newHistory }
          }
          return { weightHistory: [...state.weightHistory, entry] }
        })
      },
      getWeightHistory: (days = 30) => {
        const { weightHistory } = get()
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        const cutoffStr = cutoff.toISOString().split('T')[0]

        return weightHistory
          .filter(w => w.date >= cutoffStr)
          .sort((a, b) => a.date.localeCompare(b.date))
      },

      // Streak tracking
      getCurrentStreak: () => {
        const { foodHistory } = get()
        if (foodHistory.length === 0) return 0

        let streak = 0
        const today = new Date()

        // Check backwards from today, limit to 365 days max
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today)
          checkDate.setDate(checkDate.getDate() - i)
          const dateStr = checkDate.toISOString().split('T')[0]

          const hasLog = foodHistory.some(h => h.date === dateStr && h.entries.length > 0)

          if (hasLog) {
            streak++
          } else if (i > 0) {
            // Allow today to be unlogged but break on past days
            break
          }
        }

        return streak
      },
      getLongestStreak: () => {
        const { foodHistory } = get()
        if (foodHistory.length === 0) return 0

        const sortedDates = foodHistory
          .filter(h => h.entries.length > 0)
          .map(h => h.date)
          .sort()

        if (sortedDates.length === 0) return 0

        let longest = 1
        let current = 1

        for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i - 1])
          const curr = new Date(sortedDates[i])
          const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            current++
            longest = Math.max(longest, current)
          } else {
            current = 1
          }
        }

        return longest
      },
      getTotalDaysLogged: () => {
        const { foodHistory } = get()
        return foodHistory.filter(h => h.entries.length > 0).length
      },
      getWeekLogStatus: () => {
        const { foodHistory } = get()
        const result: boolean[] = []

        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split('T')[0]
          const hasLog = foodHistory.some(h => h.date === dateStr && h.entries.length > 0)
          result.push(hasLog)
        }

        return result
      },

      // Favorites with polished icon keys
      favorites: [
        {
          id: '1',
          name: 'Greek Yogurt',
          calories: 150,
          protein: 15,
          carbs: 8,
          fat: 5,
          servingSize: 1,
          servingUnit: 'cup',
          iconKey: 'yogurt',
        },
        {
          id: '2',
          name: 'Grilled Chicken',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 4,
          servingSize: 4,
          servingUnit: 'oz',
          iconKey: 'chicken',
        },
        {
          id: '3',
          name: 'Brown Rice',
          calories: 215,
          protein: 5,
          carbs: 45,
          fat: 2,
          servingSize: 1,
          servingUnit: 'cup',
          iconKey: 'rice',
        },
        {
          id: '4',
          name: 'Banana',
          calories: 105,
          protein: 1,
          carbs: 27,
          fat: 0,
          servingSize: 1,
          servingUnit: 'medium',
          iconKey: 'banana',
        },
        {
          id: '5',
          name: 'Almonds',
          calories: 164,
          protein: 6,
          carbs: 6,
          fat: 14,
          servingSize: 1,
          servingUnit: 'oz',
          iconKey: 'almonds',
        },
        {
          id: '6',
          name: 'Avocado',
          calories: 240,
          protein: 3,
          carbs: 12,
          fat: 22,
          servingSize: 1,
          servingUnit: 'whole',
          iconKey: 'fruit',
        },
      ],
      addFavorite: (food) =>
        set((state) => ({
          favorites: [...state.favorites, { ...food, id: crypto.randomUUID() }],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),

      // Recent foods
      recentFoods: [],
      addToRecent: (food) =>
        set((state) => {
          const existing = state.recentFoods.findIndex((f) => f.name === food.name)
          let newRecent = [...state.recentFoods]

          if (existing >= 0) {
            // Move to front
            newRecent.splice(existing, 1)
          }

          newRecent = [{ ...food, id: crypto.randomUUID() }, ...newRecent].slice(0, 20)
          return { recentFoods: newRecent }
        }),

      // UI State
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),
      selectedDate: new Date().toISOString().split('T')[0],
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Hydration - sync todayLog with foodHistory on startup
      hydrateTodayLog: () => {
        const { foodHistory, todayLog } = get()
        const today = getToday()
        const todayHistory = foodHistory.find(h => h.date === today)

        // If foodHistory has today's data but todayLog is empty or stale, sync it
        if (todayHistory && todayHistory.entries.length > 0) {
          // Check if todayLog needs syncing by comparing timestamps
          const historyLatest = Math.max(...todayHistory.entries.map(e => e.timestamp))
          const todayLatest = todayLog.length > 0 ? Math.max(...todayLog.map(e => e.timestamp)) : 0

          if (historyLatest > todayLatest || todayLog.length !== todayHistory.entries.length) {
            set({ todayLog: todayHistory.entries })
          }
        } else if (todayLog.length > 0) {
          // Check if todayLog has entries from a different day (stale data)
          const todayLogDate = new Date(todayLog[0].timestamp).toISOString().split('T')[0]
          if (todayLogDate !== today) {
            // Clear stale todayLog - those entries should already be in foodHistory
            set({ todayLog: [] })
          }
        }
      },

      // Gamification
      xp: 0,
      achievements: [],
      aiUseCount: 0,
      barcodeUsed: false,

      addXP: (amount) => {
        set((state) => ({ xp: state.xp + amount }))
        // Check achievements after XP change
        get().checkAchievements()
      },

      unlockAchievement: (id) => {
        set((state) => {
          if (state.achievements.includes(id)) return state
          return { achievements: [...state.achievements, id] }
        })
      },

      checkAchievements: () => {
        const state = get()
        let newlyUnlocked: string | null = null

        for (const achievement of ACHIEVEMENTS) {
          if (state.achievements.includes(achievement.id)) continue

          let earned = false

          switch (achievement.id) {
            case 'first_log':
              earned = state.todayLog.length > 0 || state.foodHistory.length > 0
              break
            case 'streak_3':
              earned = state.getCurrentStreak() >= 3
              break
            case 'streak_7':
              earned = state.getCurrentStreak() >= 7
              break
            case 'streak_14':
              earned = state.getCurrentStreak() >= 14
              break
            case 'streak_30':
              earned = state.getCurrentStreak() >= 30
              break
            case 'goal_hit': {
              const cals = state.getTodayCalories()
              earned = cals >= state.goals.calories * 0.95 && cals <= state.goals.calories * 1.05
              break
            }
            case 'all_meals': {
              const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack']
              earned = mealTypes.every(m => state.getMealEntries(m).length > 0)
              break
            }
            case 'macro_master': {
              const macros = state.getTodayMacros()
              earned = macros.protein >= state.goals.protein * 0.9 &&
                       macros.carbs >= state.goals.carbs * 0.9 &&
                       macros.fat >= state.goals.fat * 0.9
              break
            }
            case 'hydrated':
              earned = state.waterDate === getToday() && state.waterIntake >= 8
              break
            case 'ai_explorer':
              earned = state.aiUseCount >= 5
              break
            case 'scanner':
              earned = state.barcodeUsed
              break
            case 'variety_10':
              earned = state.getUniquefoods() >= 10
              break
            case 'variety_25':
              earned = state.getUniquefoods() >= 25
              break
            case 'foods_50':
              earned = state.getTotalFoodsLogged() >= 50
              break
            case 'foods_100':
              earned = state.getTotalFoodsLogged() >= 100
              break
            case 'level_bloom':
              earned = state.xp >= 1000
              break
          }

          if (earned) {
            state.unlockAchievement(achievement.id)
            if (!newlyUnlocked) newlyUnlocked = achievement.id
          }
        }

        return newlyUnlocked
      },

      incrementAIUse: () => {
        set((state) => ({ aiUseCount: state.aiUseCount + 1 }))
      },

      markBarcodeUsed: () => {
        set({ barcodeUsed: true })
      },

      getLevel: () => {
        return getLevelForXP(get().xp)
      },

      getUniquefoods: () => {
        const { foodHistory, todayLog } = get()
        const names = new Set<string>()
        foodHistory.forEach(day => day.entries.forEach(e => names.add(e.name.toLowerCase())))
        todayLog.forEach(e => names.add(e.name.toLowerCase()))
        return names.size
      },

      getTotalFoodsLogged: () => {
        const { foodHistory, todayLog } = get()
        const historyTotal = foodHistory.reduce((sum, day) => sum + day.entries.length, 0)
        return historyTotal + todayLog.length
      },

      // Water tracking
      waterIntake: 0,
      waterDate: '',

      addWater: () => {
        const today = getToday()
        set((state) => {
          const intake = state.waterDate === today ? state.waterIntake + 1 : 1
          return { waterIntake: Math.min(intake, 8), waterDate: today }
        })
        // Check hydration achievement
        const state = get()
        if (state.waterIntake >= 8) {
          get().addXP(XP_REWARDS.WATER_COMPLETE)
        }
      },

      removeWater: () => {
        const today = getToday()
        set((state) => {
          if (state.waterDate !== today) return { waterIntake: 0, waterDate: today }
          return { waterIntake: Math.max(state.waterIntake - 1, 0) }
        })
      },

      // Computed
      getTodayCalories: () => {
        const { todayLog } = get()
        return todayLog.reduce((sum, entry) => sum + entry.calories, 0)
      },
      getTodayMacros: () => {
        const { todayLog } = get()
        return todayLog.reduce(
          (acc, entry) => ({
            protein: acc.protein + entry.protein,
            carbs: acc.carbs + entry.carbs,
            fat: acc.fat + entry.fat,
          }),
          { protein: 0, carbs: 0, fat: 0 }
        )
      },
      getMealEntries: (mealType) => {
        const { todayLog } = get()
        return todayLog.filter((entry) => entry.mealType === mealType)
      },
    }),
    {
      name: 'nourish-storage',
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        profile: state.profile,
        goals: state.goals,
        favorites: state.favorites,
        recentFoods: state.recentFoods,
        foodHistory: state.foodHistory,
        weightHistory: state.weightHistory,
        todayLog: state.todayLog,
        xp: state.xp,
        achievements: state.achievements,
        aiUseCount: state.aiUseCount,
        barcodeUsed: state.barcodeUsed,
        waterIntake: state.waterIntake,
        waterDate: state.waterDate,
      }),
    }
  )
)
