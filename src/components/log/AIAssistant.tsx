'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles, Plus, Edit3, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface ParsedFood {
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize?: number
  servingUnit?: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  parsedFood?: ParsedFood
}

interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
  onAddFood: (food: { name: string; calories: number; protein: number; carbs: number; fat: number }) => void
}

export function AIAssistant({ isOpen, onClose, onAddFood }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! Tell me what you ate, and I'll help you log it. You can say things like \"I had a turkey sandwich with mayo\" or ask nutrition questions.",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editedFood, setEditedFood] = useState<ParsedFood | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    }

    const currentInput = input
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const conversationHistory = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.parsedFood
          ? JSON.stringify({ message: msg.content, food: msg.parsedFood })
          : msg.content,
      }))

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.message || "I've analyzed that for you.",
        parsedFood: data.food ? {
          name: data.food.name,
          calories: data.food.calories,
          protein: data.food.protein,
          carbs: data.food.carbs,
          fat: data.food.fat,
          servingSize: data.food.servingSize,
          servingUnit: data.food.servingUnit,
        } : undefined,
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error('AI error:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I couldn't process that. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleStartEdit = (messageId: string, food: ParsedFood) => {
    setEditingMessageId(messageId)
    setEditedFood({ ...food })
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditedFood(null)
  }

  const handleSaveEdit = () => {
    if (editedFood) {
      onAddFood(editedFood)
      setEditingMessageId(null)
      setEditedFood(null)
    }
  }

  const suggestedPrompts = [
    "I had a coffee with cream",
    "Grilled chicken salad",
    "What's a healthy snack?",
  ]

  // Render food card - either in view mode or edit mode
  const renderFoodCard = (message: Message) => {
    if (!message.parsedFood) return null

    const isEditing = editingMessageId === message.id
    const food = isEditing && editedFood ? editedFood : message.parsedFood

    if (isEditing && editedFood) {
      return (
        <Card variant="flat" className="mt-3 p-3 bg-sage-50">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Name</label>
              <input
                type="text"
                value={editedFood.name}
                onChange={(e) => setEditedFood({ ...editedFood, name: e.target.value })}
                className="w-full px-2 py-1.5 text-sm bg-white rounded-lg border border-sage-200 focus:ring-2 focus:ring-sage-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Calories</label>
                <input
                  type="number"
                  value={editedFood.calories}
                  onChange={(e) => setEditedFood({ ...editedFood, calories: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-sm bg-white rounded-lg border border-sage-200 focus:ring-2 focus:ring-sage-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Protein (g)</label>
                <input
                  type="number"
                  value={editedFood.protein}
                  onChange={(e) => setEditedFood({ ...editedFood, protein: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-sm bg-white rounded-lg border border-sage-200 focus:ring-2 focus:ring-sage-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Carbs (g)</label>
                <input
                  type="number"
                  value={editedFood.carbs}
                  onChange={(e) => setEditedFood({ ...editedFood, carbs: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-sm bg-white rounded-lg border border-sage-200 focus:ring-2 focus:ring-sage-400 outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Fat (g)</label>
                <input
                  type="number"
                  value={editedFood.fat}
                  onChange={(e) => setEditedFood({ ...editedFood, fat: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-sm bg-white rounded-lg border border-sage-200 focus:ring-2 focus:ring-sage-400 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                className="flex-1"
                onClick={handleSaveEdit}
              >
                <Check className="w-4 h-4 mr-1" />
                Add
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )
    }

    return (
      <Card variant="flat" className="mt-3 p-3 bg-sage-50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-charcoal text-sm">
            {food.name}
          </span>
          <span className="font-bold text-sage-600">
            {food.calories} cal
          </span>
        </div>

        <div className="flex gap-4 text-xs text-gray-500 mb-3">
          <span>P: {food.protein}g</span>
          <span>C: {food.carbs}g</span>
          <span>F: {food.fat}g</span>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            className="flex-1"
            onClick={() => onAddFood(message.parsedFood!)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleStartEdit(message.id, message.parsedFood!)}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Adjust
          </Button>
        </div>
      </Card>
    )
  }

  // Shared content as JSX variable (not a component)
  const modalHeader = (
    <header className="flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-sage-100 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-charcoal">AI Assistant</h2>
          <p className="text-xs text-gray-400">Powered by AI</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-sage-100 rounded-xl transition-colors"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </header>
  )

  const modalMessages = (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn(
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          )}
        >
          <div
            className={cn(
              'max-w-[85%] rounded-2xl px-4 py-3',
              message.role === 'user'
                ? 'bg-sage-500 text-white rounded-br-md'
                : 'bg-white shadow-soft rounded-bl-md'
            )}
          >
            <p className="text-sm">{message.content}</p>
            {renderFoodCard(message)}
          </div>
        </motion.div>
      ))}

      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start"
        >
          <div className="bg-white shadow-soft rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-sage-400 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )

  const modalSuggestions = messages.length === 1 && (
    <div className="px-4 pb-2 shrink-0">
      <p className="text-xs text-gray-400 mb-2">Try saying:</p>
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setInput(prompt)}
            className="px-3 py-1.5 bg-white rounded-full text-xs text-sage-600 hover:bg-sage-50 transition-colors border border-sage-100"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )

  const modalInput = (
    <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-sage-100 shrink-0">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 h-11 px-4 bg-sage-50 rounded-xl text-sm text-charcoal placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-sage-400"
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-11 h-11 !p-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Backdrop - desktop only */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-backdrop"
            className="hidden lg:block fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Desktop Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center pointer-events-none">
            <motion.div
              key="ai-modal-desktop"
              className="flex flex-col bg-cream overflow-hidden rounded-2xl shadow-xl pointer-events-auto"
              style={{
                width: '500px',
                height: '600px',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {modalHeader}
              {modalMessages}
              {modalSuggestions}
              {modalInput}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-modal-mobile"
            className="lg:hidden fixed z-50 flex flex-col bg-cream overflow-hidden inset-0"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {modalHeader}
            {modalMessages}
            {modalSuggestions}
            {modalInput}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
