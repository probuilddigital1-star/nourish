'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { Check } from 'lucide-react'
import { formatNumber, formatShortDate } from '@/lib/utils'
import { useStore } from '@/store'

interface CalorieChartProps {
  goalCalories?: number
}

export function CalorieChart({ goalCalories: propGoalCalories }: CalorieChartProps) {
  const { getCalorieHistory, goals } = useStore()
  const goalCalories = propGoalCalories ?? goals.calories

  const chartData = useMemo(() => {
    const history = getCalorieHistory(7)
    return history.map(h => ({
      day: formatShortDate(h.date),
      calories: h.calories,
      goal: h.goal,
    }))
  }, [getCalorieHistory])

  const average = useMemo(() => {
    const loggedDays = chartData.filter(d => d.calories > 0)
    if (loggedDays.length === 0) return 0
    return Math.round(loggedDays.reduce((sum, d) => sum + d.calories, 0) / loggedDays.length)
  }, [chartData])

  const daysOnTrack = chartData.filter(
    (d) => d.calories > 0 && Math.abs(d.calories - d.goal) <= d.goal * 0.1
  ).length

  const getBarColor = (calories: number, goal: number) => {
    const diff = calories - goal
    if (diff > goal * 0.1) return '#d4613a' // over - terracotta
    if (diff < -goal * 0.15) return '#d4a03a' // under - amber
    return '#7a8b62' // on track - sage
  }

  return (
    <Card variant="elevated" className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-charcoal">Calorie Averages</h3>
          <p className="text-xs text-gray-400 mt-0.5">This week</p>
        </div>

        <motion.div
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-sage-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Check className="w-4 h-4 text-sage-500" />
          <span className="text-sm font-medium text-sage-600">
            {daysOnTrack}/7 days
          </span>
        </motion.div>
      </div>

      <div className="h-40 lg:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b6b', fontSize: 11 }}
              dy={8}
            />
            <YAxis
              domain={[0, 'dataMax + 200']}
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
              formatter={(value: number) => [`${formatNumber(value)} cal`, 'Calories']}
            />
            <ReferenceLine
              y={goalCalories}
              stroke="#b3bda2"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]} maxBarSize={32}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.calories === 0 ? '#e5e7eb' : getBarColor(entry.calories, entry.goal)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-100">
        <div className="text-center">
          <p className="text-xs text-gray-400">Average</p>
          <p className="text-sm font-semibold text-charcoal">{formatNumber(average)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Goal</p>
          <p className="text-sm font-semibold text-sage-600">{formatNumber(goalCalories)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">Difference</p>
          <p className="text-sm font-semibold text-charcoal">
            {average > goalCalories ? '+' : ''}{formatNumber(average - goalCalories)}
          </p>
        </div>
      </div>
    </Card>
  )
}
