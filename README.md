# Nourish - Calorie Counter

A modern, beautiful calorie tracking application built with Next.js 14, featuring a soft organic minimalism aesthetic.

![Nourish Preview](./preview.png)

## Features

### Core Functionality
- **Daily Dashboard** - At-a-glance calorie and macro tracking with an animated "breathing" progress ring
- **Easy Food Logging** - Favorites, recent foods, quick-add, and AI assistant
- **Progress Visualization** - Weight trends, calorie charts, macro breakdown, and streak tracking
- **Personalized Goals** - Calculated using the Mifflin-St Jeor equation based on your profile

### Design Highlights
- **Soft Organic Minimalism** - Warm, inviting design with sage green and terracotta accents
- **Fraunces + DM Sans** typography pairing
- **Satisfying Micro-interactions** - Spring physics, staggered reveals, and "plop" animations
- **Mobile-First** - Thumb-reachable actions, bottom navigation, PWA-ready

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand (with persistence)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nourish.git
cd nourish

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles, animations
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main app entry
├── components/
│   ├── dashboard/       # CalorieRing, MacroBar, MealCard
│   ├── layout/          # TabNav, FAB, Header
│   ├── log/             # FoodSearch, FavoriteGrid, AIAssistant
│   ├── onboarding/      # Onboarding flow
│   ├── pages/           # HomePage, LogPage, ProgressPage
│   ├── progress/        # WeightChart, CalorieChart, MacroDonut
│   └── ui/              # Button, Card, Toast
├── lib/
│   └── utils.ts         # Helper functions
└── store/
    └── index.ts         # Zustand store
```

## Design System

### Colors
- **Primary**: Sage Green (#7a8b62)
- **Accent**: Terracotta (#d4613a)
- **Background**: Cream (#fdfbf7)
- **Text**: Charcoal (#2d2d2d)

### Typography
- **Display**: Fraunces (serif) - Headers and large numbers
- **Body**: DM Sans (sans-serif) - UI text and content

### Animations
- **Breathe**: Subtle pulse on the calorie ring
- **Plop**: Spring animation for added items
- **Slide-up**: Page entrance transitions
- **Float**: Background blob movement

## Roadmap

### Phase 1 (MVP) ✅
- [x] Onboarding flow
- [x] Daily dashboard
- [x] Manual food logging
- [x] Favorites and recent foods
- [x] Basic progress charts

### Phase 2 (Enhanced)
- [ ] Barcode scanner integration
- [ ] AI meal assistant (API integration)
- [ ] Food database search
- [ ] Meal templates

### Phase 3 (Polish)
- [ ] Weekly/monthly reports
- [ ] Push notifications
- [ ] Data export
- [ ] Offline support (PWA)

### Phase 4 (Growth)
- [ ] User authentication
- [ ] Cloud sync
- [ ] Premium features
- [ ] Social sharing

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

Built with ❤️ using Next.js and Tailwind CSS
