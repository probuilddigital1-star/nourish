'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/Card'

// Mock data for demo
const mockMacroData = [
  { name: 'Protein', value: 28, color: '#7a8b62' },
  { name: 'Carbs', value: 47, color: '#e07b54' },
  { name: 'Fat', value: 25, color: '#d4a03a' },
]

export function MacroDonut() {
  return (
    <Card variant="elevated" className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-charcoal">Macro Breakdown</h3>
          <p className="text-xs text-gray-400 mt-0.5">Weekly average</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-around gap-6">
        <div className="relative w-40 h-40 lg:w-48 lg:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockMacroData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {mockMacroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-display font-semibold text-charcoal">100%</span>
            <span className="text-xs text-gray-400">Macros</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex sm:flex-col gap-4 sm:gap-3">
          {mockMacroData.map((macro, index) => (
            <motion.div
              key={macro.name}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: macro.color }}
              />
              <div className="flex sm:flex-row flex-col sm:gap-2">
                <span className="text-sm font-medium text-charcoal">{macro.name}</span>
                <span className="text-xs sm:text-sm text-gray-400">{macro.value}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}
