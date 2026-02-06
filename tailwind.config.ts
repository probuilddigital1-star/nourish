import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fdfbf7',
        'warm-white': '#f9f6f0',
        charcoal: '#2d2d2d',
        sage: {
          50: '#f6f7f4',
          100: '#e8ebe3',
          200: '#d1d7c7',
          300: '#b3bda2',
          400: '#95a37d',
          500: '#7a8b62',
          600: '#5f6d4c',
          700: '#4a5540',
          800: '#3d4536',
          900: '#343a2f',
        },
        terracotta: {
          300: '#e99a7a',
          400: '#e07b54',
          500: '#d4613a',
          600: '#b84d2a',
          700: '#9a3f23',
        },
        gold: {
          400: '#d4a03a',
          500: '#c4902a',
        },
        sky: {
          50: '#f0f7ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(122, 139, 98, 0.08)',
        'soft-lg': '0 8px 32px rgba(122, 139, 98, 0.12)',
        'glow': '0 0 40px rgba(122, 139, 98, 0.15)',
        'inner-soft': 'inset 0 2px 8px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'plop': 'plop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'glow-pulse': 'glowPulse 1.5s ease-in-out',
        'wobble': 'wobble 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.95' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        plop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(122, 139, 98, 0.4)' },
          '50%': { boxShadow: '0 0 20px 8px rgba(122, 139, 98, 0.2)' },
          '100%': { boxShadow: '0 0 0 0 rgba(122, 139, 98, 0)' },
        },
        wobble: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-2px) rotate(2deg)' },
          '75%': { transform: 'translateY(1px) rotate(-1deg)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
