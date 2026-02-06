type HapticPattern = 'tap' | 'success' | 'achievement' | 'levelup'

const patterns: Record<HapticPattern, number | number[]> = {
  tap: 10,
  success: [10, 50, 10],
  achievement: [10, 30, 10, 30, 20],
  levelup: 50,
}

export function haptic(pattern: HapticPattern) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(patterns[pattern])
    } catch {
      // Silently fail - vibration not supported
    }
  }
}
