'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { TrendingDown, TrendingUp, Minus, Plus, X, Scale } from 'lucide-react'
import { cn, formatShortDate, validateWeight } from '@/lib/utils'
import { useStore } from '@/store'
import { Button } from '@/components/ui/Button'

interface WeightChartProps {
  goalWeight?: number
}

export function WeightChart({ goalWeight: propGoalWeight }: WeightChartProps) {
  const { getWeightHistory, addWeight, profile } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [weightInput, setWeightInput] = useState('')
  const [error, setError] = useState('')

  const goalWeight = propGoalWeight ?? profile?.goalWeight ?? 165

  const chartData = useMemo(() => {
    const history = getWeightHistory(7)
    if (history.length === 0) {
      // Show placeholder when no data
      return []
    }
    return history.map(h => ({
      day: formatShortDate(h.date),
      weight: h.weight,
    }))
  }, [getWeightHistory])

  const startWeight = chartData.length > 0 ? chartData[0].weight : null
  const currentWeight = chartData.length > 0 ? chartData[chartData.length - 1].weight : null
  const change = startWeight && currentWeight ? currentWeight - startWeight : 0
  const trend = change < -0.1 ? 'down' : change > 0.1 ? 'up' : 'stable'

  const TrendIcon = trend === 'down' ? TrendingDown : trend === 'up' ? TrendingUp : Minus
  const trendColor = trend === 'down' ? 'text-sage-500' : trend === 'up' ? 'text-terracotta-500' : 'text-gray-400'

  const handleAddWeight = () => {
    const validation = validateWeight(weightInput)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid weight')
      return
    }

    addWeight(parseFloat(weightInput))
    setWeightInput('')
    setError('')
    setShowAddModal(false)
  }

  return (
    <>
      <Card variant="elevated" className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-charcoal">Weight Trend</h3>
            <p className="text-xs text-gray-400 mt-0.5">This week</p>
          </div>

          <div className="flex items-center gap-2">
            {chartData.length > 0 && (
              <motion.div
                className={cn('flex items-center gap-1 px-2 py-1 rounded-lg',
                  trend === 'down' ? 'bg-sage-100' : trend === 'up' ? 'bg-terracotta-100' : 'bg-gray-100'
                )}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <TrendIcon className={cn('w-4 h-4', trendColor)} />
                <span className={cn('text-sm font-medium', trendColor)}>
                  {Math.abs(change).toFixed(1)} lbs
                </span>
              </motion.div>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 bg-sage-100 hover:bg-sage-200 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-sage-600" />
            </button>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-48 lg:h-56 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mb-4">
              <Scale className="w-8 h-8 text-sage-400" />
            </div>
            <p className="text-gray-500 mb-2">No weight data yet</p>
            <p className="text-xs text-gray-400 mb-4">Log your weight to see trends</p>
            <Button size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Log Weight
            </Button>
          </div>
        ) : (
          <>
            <div className="h-48 lg:h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b6b6b', fontSize: 11 }}
                    dy={8}
                  />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b6b6b', fontSize: 11 }}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      padding: '8px 12px',
                    }}
                    labelStyle={{ color: '#2d2d2d', fontWeight: 500, marginBottom: 4 }}
                    formatter={(value: number) => [`${value} lbs`, 'Weight']}
                  />
                  {goalWeight && (
                    <ReferenceLine
                      y={goalWeight}
                      stroke="#d4613a"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#7a8b62"
                    strokeWidth={3}
                    dot={{ fill: '#7a8b62', strokeWidth: 2, r: 4 }}
                    activeDot={{ fill: '#7a8b62', strokeWidth: 0, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
              <div className="text-center">
                <p className="text-xs text-gray-400">Start</p>
                <p className="text-sm font-semibold text-charcoal">{startWeight?.toFixed(1)} lbs</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Current</p>
                <p className="text-sm font-semibold text-sage-600">{currentWeight?.toFixed(1)} lbs</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Goal</p>
                <p className="text-sm font-semibold text-terracotta-500">{goalWeight} lbs</p>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Add Weight Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-sm bg-white rounded-2xl shadow-xl z-50 p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-charcoal text-lg">Log Weight</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    setWeightInput('')
                    setError('')
                  }}
                  className="p-2 hover:bg-sage-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-500 mb-2 block">Weight (lbs)</label>
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => {
                    setWeightInput(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter your weight"
                  className={cn(
                    'w-full h-12 px-4 bg-sage-50 rounded-xl text-charcoal placeholder:text-gray-400 outline-none transition-colors',
                    error ? 'border-2 border-terracotta-400' : 'focus:ring-2 focus:ring-sage-400'
                  )}
                  autoFocus
                />
                {error && <p className="text-xs text-terracotta-500 mt-1">{error}</p>}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setShowAddModal(false)
                    setWeightInput('')
                    setError('')
                  }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddWeight}>
                  Save
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
