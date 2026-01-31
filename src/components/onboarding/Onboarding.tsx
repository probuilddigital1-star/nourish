'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Check,
  TrendingDown,
  Scale,
  TrendingUp,
  Sofa,
  Footprints,
  Bike,
  Dumbbell,
  Flame,
  Leaf,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  cn,
  calculateBMR,
  calculateTDEE,
  validateAge,
  validateHeightFeet,
  validateHeightInches,
  validateWeight,
  feetInchesToCm,
} from '@/lib/utils'
import { useStore } from '@/store'

type Step = 'welcome' | 'basics' | 'goals' | 'activity' | 'results'

interface FormData {
  name: string
  heightFeet: string
  heightInches: string
  weight: string
  age: string
  sex: 'male' | 'female'
  goalType: 'lose' | 'maintain' | 'gain'
  activityLevel: string
}

interface FormErrors {
  name?: string
  heightFeet?: string
  heightInches?: string
  weight?: string
  age?: string
}

const goalOptions = [
  { id: 'lose', label: 'Lose Weight', desc: 'Create a calorie deficit', icon: TrendingDown, color: 'text-sage-500' },
  { id: 'maintain', label: 'Maintain Weight', desc: 'Stay at your current weight', icon: Scale, color: 'text-amber-500' },
  { id: 'gain', label: 'Gain Weight', desc: 'Build muscle and mass', icon: TrendingUp, color: 'text-terracotta-500' },
]

const activityOptions = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise', icon: Sofa },
  { id: 'lightly_active', label: 'Lightly Active', desc: '1-3 days/week', icon: Footprints },
  { id: 'moderately_active', label: 'Moderately Active', desc: '3-5 days/week', icon: Bike },
  { id: 'very_active', label: 'Very Active', desc: '6-7 days/week', icon: Dumbbell },
  { id: 'extremely_active', label: 'Extremely Active', desc: 'Physical job + exercise', icon: Flame },
]

export function Onboarding() {
  const [step, setStep] = useState<Step>('welcome')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    heightFeet: '',
    heightInches: '',
    weight: '',
    age: '',
    sex: 'female',
    goalType: 'lose',
    activityLevel: 'lightly_active',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const { setProfile, setGoals, setHasCompletedOnboarding } = useStore()

  const validateBasics = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    const feetValidation = validateHeightFeet(formData.heightFeet)
    if (!feetValidation.isValid) {
      newErrors.heightFeet = feetValidation.error
    }

    const inchesValidation = validateHeightInches(formData.heightInches)
    if (!inchesValidation.isValid) {
      newErrors.heightInches = inchesValidation.error
    }

    const weightValidation = validateWeight(formData.weight)
    if (!weightValidation.isValid) {
      newErrors.weight = weightValidation.error
    }

    const ageValidation = validateAge(formData.age)
    if (!ageValidation.isValid) {
      newErrors.age = ageValidation.error
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const steps: Step[] = ['welcome', 'basics', 'goals', 'activity', 'results']
  const currentIndex = steps.indexOf(step)

  const getHeightCm = () => {
    const feet = parseInt(formData.heightFeet) || 0
    const inches = parseInt(formData.heightInches) || 0
    return feetInchesToCm(feet, inches)
  }

  const calculateCalorieGoal = () => {
    const heightCm = getHeightCm()
    const weightKg = parseFloat(formData.weight) * 0.453592 // lbs to kg
    const age = parseInt(formData.age)

    const bmr = calculateBMR(weightKg, heightCm, age, formData.sex)
    let tdee = calculateTDEE(bmr, formData.activityLevel)

    // Adjust for goal
    if (formData.goalType === 'lose') tdee -= 500
    if (formData.goalType === 'gain') tdee += 300

    return Math.round(tdee)
  }

  const handleComplete = () => {
    const calories = calculateCalorieGoal()

    setProfile({
      name: formData.name,
      height: getHeightCm(),
      weight: parseFloat(formData.weight) * 0.453592,
      age: parseInt(formData.age),
      sex: formData.sex,
      activityLevel: formData.activityLevel,
      goalType: formData.goalType,
    })

    setGoals({
      calories,
      protein: Math.round(parseFloat(formData.weight) * 0.8), // 0.8g per lb
      carbs: Math.round((calories * 0.45) / 4), // 45% of cals
      fat: Math.round((calories * 0.3) / 9), // 30% of cals
    })

    setHasCompletedOnboarding(true)
  }

  const nextStep = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex])
    }
  }

  const prevStep = () => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setStep(steps[prevIndex])
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-6 sm:p-8 lg:p-12 max-w-lg mx-auto lg:justify-center">
      {/* Progress indicator */}
      {step !== 'welcome' && (
        <div className="flex gap-2 mb-8">
          {steps.slice(1).map((s, i) => (
            <div
              key={s}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                i < currentIndex ? 'bg-sage-500' : 'bg-sage-200'
              )}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Welcome */}
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              className="w-24 h-24 bg-gradient-to-br from-sage-400 to-sage-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-sage-500/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Leaf className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              className="font-display text-4xl font-semibold text-charcoal mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome to Nourish
            </motion.h1>

            <motion.p
              className="text-gray-500 mb-12 max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Simple calorie tracking that fits your life. Let's set up your personalized goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={nextStep} size="lg">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Basic Info */}
        {step === 'basics' && (
          <motion.div
            key="basics"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">
              About You
            </h2>
            <p className="text-gray-500 mb-8">Help us personalize your experience</p>

            <div className="space-y-4 flex-1">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: undefined })
                  }}
                  placeholder="Your name"
                  className={cn(
                    'w-full h-12 px-4 bg-white rounded-xl border-2 text-charcoal placeholder:text-gray-400 outline-none transition-colors',
                    errors.name ? 'border-terracotta-400 focus:border-terracotta-500' : 'border-sage-100 focus:border-sage-400'
                  )}
                />
                {errors.name && <p className="text-xs text-terracotta-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">Height</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.heightFeet}
                        onChange={(e) => {
                          setFormData({ ...formData, heightFeet: e.target.value })
                          if (errors.heightFeet) setErrors({ ...errors, heightFeet: undefined })
                        }}
                        placeholder="5"
                        className={cn(
                          'w-full h-12 px-4 pr-10 bg-white rounded-xl border-2 text-charcoal placeholder:text-gray-400 outline-none transition-colors',
                          errors.heightFeet ? 'border-terracotta-400 focus:border-terracotta-500' : 'border-sage-100 focus:border-sage-400'
                        )}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">ft</span>
                    </div>
                    {errors.heightFeet && <p className="text-xs text-terracotta-500 mt-1">{errors.heightFeet}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.heightInches}
                        onChange={(e) => {
                          setFormData({ ...formData, heightInches: e.target.value })
                          if (errors.heightInches) setErrors({ ...errors, heightInches: undefined })
                        }}
                        placeholder="8"
                        className={cn(
                          'w-full h-12 px-4 pr-10 bg-white rounded-xl border-2 text-charcoal placeholder:text-gray-400 outline-none transition-colors',
                          errors.heightInches ? 'border-terracotta-400 focus:border-terracotta-500' : 'border-sage-100 focus:border-sage-400'
                        )}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">in</span>
                    </div>
                    {errors.heightInches && <p className="text-xs text-terracotta-500 mt-1">{errors.heightInches}</p>}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Weight (lbs)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => {
                      setFormData({ ...formData, weight: e.target.value })
                      if (errors.weight) setErrors({ ...errors, weight: undefined })
                    }}
                    placeholder="165"
                    className={cn(
                      'w-full h-12 px-4 bg-white rounded-xl border-2 text-charcoal placeholder:text-gray-400 outline-none transition-colors',
                      errors.weight ? 'border-terracotta-400 focus:border-terracotta-500' : 'border-sage-100 focus:border-sage-400'
                    )}
                  />
                  {errors.weight && <p className="text-xs text-terracotta-500 mt-1">{errors.weight}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => {
                      setFormData({ ...formData, age: e.target.value })
                      if (errors.age) setErrors({ ...errors, age: undefined })
                    }}
                    placeholder="30"
                    className={cn(
                      'w-full h-12 px-4 bg-white rounded-xl border-2 text-charcoal placeholder:text-gray-400 outline-none transition-colors',
                      errors.age ? 'border-terracotta-400 focus:border-terracotta-500' : 'border-sage-100 focus:border-sage-400'
                    )}
                  />
                  {errors.age && <p className="text-xs text-terracotta-500 mt-1">{errors.age}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-2 block">Sex</label>
                <div className="flex gap-2">
                  {(['female', 'male'] as const).map((sex) => (
                    <button
                      key={sex}
                      onClick={() => setFormData({ ...formData, sex })}
                      className={cn(
                        'flex-1 h-12 rounded-xl font-medium transition-all',
                        formData.sex === sex
                          ? 'bg-sage-500 text-white'
                          : 'bg-white border-2 border-sage-100 text-charcoal hover:border-sage-300'
                      )}
                    >
                      {sex.charAt(0).toUpperCase() + sex.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="ghost" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => {
                  if (validateBasics()) {
                    nextStep()
                  }
                }}
                className="flex-1"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Goals */}
        {step === 'goals' && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">
              Your Goal
            </h2>
            <p className="text-gray-500 mb-8">What would you like to achieve?</p>

            <div className="space-y-3 flex-1">
              {goalOptions.map((goal) => {
                const Icon = goal.icon
                const isSelected = formData.goalType === goal.id

                return (
                  <button
                    key={goal.id}
                    onClick={() => setFormData({ ...formData, goalType: goal.id as FormData['goalType'] })}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-2xl transition-all',
                      isSelected
                        ? 'bg-sage-500 text-white'
                        : 'bg-white border-2 border-sage-100 hover:border-sage-300'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      isSelected ? 'bg-white/20' : 'bg-sage-100'
                    )}>
                      <Icon className={cn('w-6 h-6', isSelected ? 'text-white' : goal.color)} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium">{goal.label}</p>
                      <p className={cn(
                        'text-sm',
                        isSelected ? 'text-sage-100' : 'text-gray-400'
                      )}>
                        {goal.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="ghost" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button onClick={nextStep} className="flex-1">
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Activity Level */}
        {step === 'activity' && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">
              Activity Level
            </h2>
            <p className="text-gray-500 mb-8">How active are you typically?</p>

            <div className="space-y-3 flex-1">
              {activityOptions.map((level) => {
                const Icon = level.icon
                const isSelected = formData.activityLevel === level.id

                return (
                  <button
                    key={level.id}
                    onClick={() => setFormData({ ...formData, activityLevel: level.id })}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-2xl transition-all',
                      isSelected
                        ? 'bg-sage-500 text-white'
                        : 'bg-white border-2 border-sage-100 hover:border-sage-300'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      isSelected ? 'bg-white/20' : 'bg-sage-100'
                    )}>
                      <Icon className={cn('w-5 h-5', isSelected ? 'text-white' : 'text-sage-500')} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium">{level.label}</p>
                      <p className={cn(
                        'text-sm',
                        isSelected ? 'text-sage-100' : 'text-gray-400'
                      )}>
                        {level.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="ghost" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button onClick={nextStep} className="flex-1">
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {step === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center text-center"
          >
            <motion.div
              className="w-20 h-20 bg-sage-100 rounded-2xl flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Target className="w-10 h-10 text-sage-500" />
            </motion.div>

            <motion.h2
              className="font-display text-2xl font-semibold text-charcoal mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your Daily Goal
            </motion.h2>

            <motion.p
              className="text-gray-500 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Based on your profile, we recommend:
            </motion.p>

            <motion.div
              className="bg-white rounded-3xl p-8 shadow-soft w-full max-w-xs mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-6xl font-display font-semibold text-sage-500 mb-2">
                {calculateCalorieGoal().toLocaleString()}
              </p>
              <p className="text-gray-500">calories per day</p>
            </motion.div>

            <motion.p
              className="text-sm text-gray-400 mb-8 max-w-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              You can always adjust this later in Settings
            </motion.p>

            <motion.div
              className="flex gap-3 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button variant="ghost" onClick={prevStep} className="flex-1">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Start Tracking
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
