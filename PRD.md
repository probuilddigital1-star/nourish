# Product Requirements Document: Nourish
## Calorie Counter & Nutrition Tracker

**Version:** 1.0
**Last Updated:** January 28, 2025
**Status:** Draft

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Target Users](#2-target-users)
3. [Core Features](#3-core-features)
4. [User Flows](#4-user-flows)
5. [Information Architecture](#5-information-architecture)
6. [UI/UX Specifications](#6-uiux-specifications)
7. [Design System](#7-design-system)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Models](#9-data-models)
10. [API Specifications](#10-api-specifications)
11. [Success Metrics](#11-success-metrics)
12. [Release Phases](#12-release-phases)

---

## 1. Product Overview

### 1.1 Vision

Nourish is a calorie counting and nutrition tracking application that prioritizes simplicity and minimal friction. The app transforms the often tedious task of food logging into a quick, satisfying experience through intelligent shortcuts, AI assistance, and a calming visual design.

### 1.2 Problem Statement

Existing calorie counters suffer from:
- **Friction overload**: Too many taps to log a simple meal
- **Visual clutter**: Dashboards overwhelmed with numbers and charts
- **Cold, clinical UX**: Feels like a medical app, not a lifestyle companion
- **Abandonment**: Users quit within 2 weeks due to logging fatigue

### 1.3 Solution

Nourish solves these problems through:
- **One-tap logging**: Favorites, recent meals, and AI suggestions surface first
- **Calm dashboard**: Essential info at a glance; details on demand
- **Warm, organic design**: Feels approachable and encouraging
- **Smart assistance**: AI learns preferences and reduces manual entry

### 1.4 Key Differentiators

| Competitor Pain Point | Nourish Solution |
|-----------------------|------------------|
| 5+ taps to log a meal | 1-2 taps for common foods |
| Overwhelming data screens | Progressive disclosure; primary info only |
| Generic food database | AI-powered meal recognition + learning |
| No personality | Warm, encouraging micro-interactions |

---

## 2. Target Users

### 2.1 Primary Persona: "Mindful Maya"

- **Age**: 25-40
- **Goal**: Lose 10-20 lbs or maintain healthy weight
- **Behavior**: Health-conscious but busy; wants simple tools
- **Pain Points**: Tried apps before but quit due to complexity
- **Tech Comfort**: High; uses smartphone for most daily tasks

### 2.2 Secondary Persona: "Fitness Frank"

- **Age**: 20-35
- **Goal**: Track macros for muscle building
- **Behavior**: Consistent gym-goer; needs accurate macro tracking
- **Pain Points**: Wants quick logging between sets
- **Tech Comfort**: Very high; uses multiple fitness apps

### 2.3 Tertiary Persona: "Health-Curious Hannah"

- **Age**: 35-55
- **Goal**: Understand eating patterns; doctor recommended tracking
- **Behavior**: New to calorie counting; needs guidance
- **Pain Points**: Intimidated by nutrition apps
- **Tech Comfort**: Moderate; prefers simple interfaces

---

## 3. Core Features

### 3.1 Feature Priority Matrix

| Feature | Priority | Complexity | Phase |
|---------|----------|------------|-------|
| User Onboarding | P0 | Medium | 1 |
| Daily Dashboard | P0 | Medium | 1 |
| Manual Food Logging | P0 | Medium | 1 |
| Food Database Search | P0 | High | 1 |
| Quick-Add Favorites | P0 | Low | 1 |
| Progress Charts | P0 | Medium | 1 |
| Barcode Scanner | P1 | High | 1 |
| AI Meal Assistant | P1 | High | 2 |
| Goal Customization | P1 | Medium | 1 |
| Weekly/Monthly Reports | P2 | Medium | 2 |
| Meal Photo Recognition | P2 | High | 3 |
| Social Sharing | P3 | Low | 3 |

### 3.2 Feature Specifications

#### 3.2.1 User Onboarding

**Purpose**: Collect essential info to personalize goals; make user feel welcomed.

**Flow**:
1. Welcome screen with value proposition
2. Basic info collection (name, email, password)
3. Physical stats (height, weight, age, sex)
4. Goal selection (lose, maintain, gain)
5. Activity level selection
6. Calculated daily targets presentation
7. Quick tutorial overlay on dashboard

**Requirements**:
- [ ] Maximum 7 screens
- [ ] Progress indicator visible throughout
- [ ] Skip option available (use defaults)
- [ ] Data persists if user abandons mid-flow
- [ ] Smooth transitions between steps (300ms ease-out)
- [ ] Calorie goal calculated using Mifflin-St Jeor equation

**Acceptance Criteria**:
- User completes onboarding in under 90 seconds
- All required fields validated before progression
- Goals recalculable from Settings later

---

#### 3.2.2 Daily Dashboard (Home Tab)

**Purpose**: Provide at-a-glance daily status without overwhelming.

**Layout**:
```
┌─────────────────────────────────────┐
│  Good morning, Maya         [Avatar]│
│  Tuesday, January 28                │
├─────────────────────────────────────┤
│                                     │
│      ┌───────────────────┐          │
│      │                   │          │
│      │   CIRCULAR        │          │
│      │   CALORIE         │          │
│      │   PROGRESS        │          │
│      │   1,247 / 1,800   │          │
│      │                   │          │
│      └───────────────────┘          │
│                                     │
│   553 remaining • On track! 🎯      │
│                                     │
├─────────────────────────────────────┤
│  MACROS           P    C    F       │
│  ████░░  ███░░░  ██░░░░             │
│  72g     145g    38g                │
├─────────────────────────────────────┤
│  TODAY'S MEALS                      │
│  ┌─────────────────────────────┐    │
│  │ ☀️ Breakfast      420 cal   │    │
│  │ Greek yogurt, granola...    │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ 🌤️ Lunch          580 cal   │    │
│  │ Chicken salad, bread...     │    │
│  └─────────────────────────────┘    │
│  ┌─────────────────────────────┐    │
│  │ + Add Dinner                │    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│                                     │
│         [ + LOG FOOD ]              │ ← FAB, thumb-reachable
│                                     │
├─────────────────────────────────────┤
│  🏠 Home    📝 Log    📊 Progress   │
└─────────────────────────────────────┘
```

**Requirements**:
- [ ] Circular progress animates on load (0 → current value)
- [ ] Progress ring has subtle "breathing" pulse animation when idle
- [ ] Macro bars show percentage of daily goal
- [ ] Meal cards expandable to show item details
- [ ] "On track" / "Over budget" / "Under budget" contextual message
- [ ] Pull-to-refresh updates data
- [ ] Date picker accessible from header (swipe or tap)
- [ ] FAB (Floating Action Button) fixed 20px from bottom, centered

**Micro-interactions**:
- Calorie number counts up on page load
- Meal card slides in when added
- Gentle haptic feedback on FAB press (mobile)
- Progress ring color shifts: green (on track) → yellow (close) → red (over)

---

#### 3.2.3 Food Logging (Log Tab)

**Purpose**: Minimize effort to record meals.

**Logging Methods** (in priority order):
1. **Favorites**: One-tap add for saved foods
2. **Recent**: Last 20 logged items
3. **Quick Add**: Manual calorie entry (no food details)
4. **Search**: Database lookup
5. **Barcode Scan**: UPC lookup
6. **AI Assistant**: Natural language input

**Layout**:
```
┌─────────────────────────────────────┐
│  Log Food                    [X]    │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ 🔍 Search foods or ask AI.. │    │
│  └─────────────────────────────┘    │
│                                     │
│  [📷 Scan] [⚡ Quick Add] [🤖 AI]   │
│                                     │
├─────────────────────────────────────┤
│  ⭐ FAVORITES                       │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Greek │ │Chicken│ │Coffee│        │
│  │Yogurt│ │Breast │ │ 2cal │        │
│  │ 150  │ │ 165   │ │      │        │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
├─────────────────────────────────────┤
│  🕐 RECENT                          │
│  ┌─────────────────────────────┐    │
│  │ Banana, medium        105   │ +  │
│  ├─────────────────────────────┤    │
│  │ Oatmeal, 1 cup        150   │ +  │
│  ├─────────────────────────────┤    │
│  │ Almonds, 1oz          164   │ +  │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  🏠 Home    📝 Log    📊 Progress   │
└─────────────────────────────────────┘
```

**Requirements**:
- [ ] Favorites grid: max 6 visible, horizontal scroll for more
- [ ] One-tap on favorite immediately adds to current meal
- [ ] Recent list sorted by frequency + recency hybrid
- [ ] Search provides instant results (debounced 200ms)
- [ ] Each food item shows: name, serving size, calories
- [ ] Tapping item opens detail modal (adjust serving, view macros)
- [ ] Long-press on any food to add to favorites

**Quick Add Modal**:
- Calorie input with number pad
- Optional: meal type selector
- Optional: notes field
- "Add" button confirms

---

#### 3.2.4 Barcode Scanner

**Purpose**: Instant food lookup via product UPC.

**Flow**:
1. User taps "Scan" button
2. Camera viewfinder opens with guide frame
3. Barcode detected → auto-lookup
4. Product found → show details with "Add" CTA
5. Product not found → prompt manual entry or AI assist

**Requirements**:
- [ ] Camera permission requested with clear explanation
- [ ] Viewfinder has alignment guide rectangle
- [ ] Haptic/audio feedback on successful scan
- [ ] Supports UPC-A, UPC-E, EAN-13, EAN-8
- [ ] Lookup against Open Food Facts API + custom database
- [ ] Fallback: "Product not found. Describe it to AI?"
- [ ] Scanned items auto-save to recent

**Technical**:
- Use `@zxing/browser` for client-side decoding
- Camera stream at 720p minimum
- Torch/flash toggle for low-light

---

#### 3.2.5 AI Meal Assistant

**Purpose**: Natural language food logging and nutrition guidance.

**Capabilities**:
1. **Parse meal descriptions**: "I had a turkey sandwich with mayo and a side salad"
2. **Estimate portions**: "About a handful of almonds"
3. **Answer questions**: "How many calories in a large apple?"
4. **Suggest alternatives**: "What's a lower-calorie breakfast option?"
5. **Meal planning**: "Suggest a 500-calorie dinner"

**Interface**:
```
┌─────────────────────────────────────┐
│  🤖 AI Assistant             [X]    │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🤖 Hi Maya! Tell me what    │    │
│  │    you ate, or ask me       │    │
│  │    anything about nutrition.│    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 👤 I had a chicken burrito  │    │
│  │    from Chipotle with       │    │
│  │    guac and sour cream      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 🤖 Got it! That's roughly:  │    │
│  │                             │    │
│  │ Chicken Burrito    1050 cal │    │
│  │ ├─ Protein: 52g             │    │
│  │ ├─ Carbs: 102g              │    │
│  │ └─ Fat: 45g                 │    │
│  │                             │    │
│  │ [Add to Lunch] [Adjust]     │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │ Type a message...      [➤] │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Requirements**:
- [ ] Streaming responses for perceived speed
- [ ] Structured data extraction for parsed meals
- [ ] Confidence indicator for estimates
- [ ] "Adjust" allows manual override of AI estimates
- [ ] Conversation context maintained within session
- [ ] Suggested quick replies: "Add this", "What else?", "Lower calorie option?"

**AI Behavior Guidelines**:
- Always acknowledge uncertainty in estimates
- Provide ranges when exact data unavailable
- Never give medical advice; redirect to professionals
- Encouraging, non-judgmental tone

---

#### 3.2.6 Goal Customization

**Purpose**: Personalize calorie and macro targets.

**Configurable Goals**:
| Goal | Default Calculation | User Override |
|------|---------------------|---------------|
| Daily Calories | Mifflin-St Jeor ± deficit/surplus | Manual number |
| Protein | 0.8g per lb body weight | Manual g or % |
| Carbohydrates | 45-55% of calories | Manual g or % |
| Fat | 25-35% of calories | Manual g or % |
| Water | 8 glasses (64oz) | Manual oz/L |

**Settings Screen**:
- Sliders for macro percentages (must total 100%)
- Toggle between grams and percentages
- Activity level adjustment affects TDEE
- Weight goal (lose/maintain/gain) with rate selector
- "Recalculate" button to reset to formula defaults

**Requirements**:
- [ ] Changes reflect immediately on dashboard
- [ ] Warning if macros don't sum to 100%
- [ ] Historical goals preserved (don't overwrite past days)
- [ ] Preset options: "Balanced", "Low Carb", "High Protein"

---

#### 3.2.7 Progress Visualization (Progress Tab)

**Purpose**: Transform data into motivating insights.

**Layout**:
```
┌─────────────────────────────────────┐
│  Progress              [Week ▼]     │
├─────────────────────────────────────┤
│                                     │
│  WEIGHT TREND                       │
│  ┌─────────────────────────────┐    │
│  │     📉                      │    │
│  │  175 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │    │
│  │      ╲                      │    │
│  │  170 ─ ─╲─ ─ ─ ─ ─ ─ ─ ─   │    │
│  │          ╲    •             │    │
│  │  165 ─ ─ ─╲──•─────────    │    │
│  │            •                │    │
│  │  M  T  W  T  F  S  S       │    │
│  └─────────────────────────────┘    │
│  -2.3 lbs this week 🎉             │
│                                     │
├─────────────────────────────────────┤
│  CALORIE AVERAGES                   │
│  ┌─────────────────────────────┐    │
│  │  █ █ █ ░ █ █ █              │    │
│  │  M T W T F S S              │    │
│  └─────────────────────────────┘    │
│  Avg: 1,742 cal • Goal: 1,800      │
│  ✓ 6 of 7 days on target           │
│                                     │
├─────────────────────────────────────┤
│  MACRO BREAKDOWN                    │
│  ┌─────────────────────────────┐    │
│  │        ╭───╮                │    │
│  │      ╱  P  ╲               │    │
│  │     │ 28%   │              │    │
│  │  C  │       │  F           │    │
│  │ 47% ╲      ╱  25%          │    │
│  │       ╰───╯                │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  🏠 Home    📝 Log    📊 Progress   │
└─────────────────────────────────────┘
```

**Chart Types**:
1. **Weight Trend**: Line chart, smoothed, with goal line
2. **Calorie History**: Bar chart, color-coded (green=on target, red=over)
3. **Macro Distribution**: Donut/pie chart with percentages
4. **Streak Counter**: Days in a row hitting goals

**Time Ranges**:
- Week (default)
- Month
- 3 Months
- Year
- All Time

**Requirements**:
- [ ] Charts animate on tab entry
- [ ] Tap data point to see details
- [ ] Empty state for insufficient data
- [ ] Export data as CSV option
- [ ] Goal lines/ranges overlaid on charts
- [ ] Color-coded days: green (goal met), yellow (close), red (missed)

**Weekly/Monthly Reports**:
- Auto-generated summary card
- Key stats: avg calories, weight change, best day, streak
- Shareable as image
- Push notification prompt: "Your weekly report is ready!"

---

#### 3.2.8 Favorites Management

**Purpose**: One-tap access to frequently logged foods.

**Features**:
- Add any food to favorites (long-press or explicit button)
- Reorder favorites via drag-and-drop
- Edit favorite (adjust default serving size)
- Remove from favorites
- Favorites sync across devices

**Requirements**:
- [ ] Maximum 50 favorites
- [ ] Favorites appear on Log tab in grid format
- [ ] Custom serving size saved per favorite
- [ ] Favorites searchable

---

## 4. User Flows

### 4.1 First-Time User Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Landing │───▶│ Sign Up │───▶│Onboard- │───▶│Dashboard│
│  Page   │    │  Form   │    │  ing    │    │ (Home)  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
              ┌─────────┐  ┌─────────┐  ┌─────────┐
              │ Basic   │  │ Goals   │  │Activity │
              │  Info   │  │ Setup   │  │ Level   │
              └─────────┘  └─────────┘  └─────────┘
```

### 4.2 Log Food Flow (Happy Path)

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│Dashboard│───▶│  Log    │───▶│  Tap    │───▶│ Success │
│  (FAB)  │    │  Tab    │    │Favorite │    │ Toast   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                               │
                                               ▼
                                         ┌─────────┐
                                         │Dashboard│
                                         │ Updated │
                                         └─────────┘
```

### 4.3 Barcode Scan Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Log    │───▶│ Camera  │───▶│ Barcode │───▶│ Product │
│  Tab    │    │  Open   │    │ Detected│    │ Found   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                               │
                    ┌──────────────────────────┤
                    ▼                          ▼
              ┌─────────┐                ┌─────────┐
              │   Add   │                │ Adjust  │
              │ As-Is   │                │ Serving │
              └─────────┘                └─────────┘
                    │                          │
                    └──────────┬───────────────┘
                               ▼
                         ┌─────────┐
                         │ Success │
                         └─────────┘
```

### 4.4 AI Assistant Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Log    │───▶│   AI    │───▶│  User   │───▶│   AI    │
│  Tab    │    │  Modal  │    │ Message │    │ Parsing │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                               │
                                               ▼
                                         ┌─────────┐
                                         │ Parsed  │
                                         │  Meal   │
                                         └─────────┘
                                               │
                    ┌──────────────────────────┤
                    ▼                          ▼
              ┌─────────┐                ┌─────────┐
              │ Confirm │                │ Adjust  │
              │   Add   │                │ Details │
              └─────────┘                └─────────┘
```

---

## 5. Information Architecture

### 5.1 Navigation Structure

```
├── Home (Tab 1)
│   ├── Daily Summary
│   ├── Calorie Progress Ring
│   ├── Macro Overview
│   ├── Today's Meals List
│   └── Quick Actions
│
├── Log (Tab 2)
│   ├── Search Bar
│   ├── Action Buttons (Scan, Quick Add, AI)
│   ├── Favorites Grid
│   └── Recent Items List
│
├── Progress (Tab 3)
│   ├── Time Range Selector
│   ├── Weight Chart
│   ├── Calorie Chart
│   ├── Macro Chart
│   └── Achievements/Streaks
│
└── Settings (Accessible from Header)
    ├── Profile
    ├── Goals
    ├── Notifications
    ├── Data Export
    ├── Help & Support
    └── Account
```

### 5.2 Modal/Overlay Hierarchy

| Trigger | Modal Type | Content |
|---------|------------|---------|
| Tap meal card | Bottom Sheet | Meal details, edit, delete |
| Tap food item | Bottom Sheet | Nutrition details, serving adjuster, add |
| Tap "Scan" | Full Screen | Camera viewfinder |
| Tap "AI" | Full Screen | Chat interface |
| Tap "Quick Add" | Bottom Sheet | Calorie input |
| Tap chart data point | Tooltip | Day details |

---

## 6. UI/UX Specifications

### 6.1 Design Principles

1. **Calm over chaotic**: Limit information density; progressive disclosure
2. **Speed over completeness**: Favor quick logging over perfect accuracy
3. **Encouragement over judgment**: Positive language; celebrate wins
4. **Consistency over novelty**: Familiar patterns; predictable behavior
5. **Accessibility over aesthetics**: WCAG 2.1 AA compliance minimum

### 6.2 Layout Guidelines

**Mobile-First Breakpoints**:
| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640-1024px | Two column, side nav optional |
| Desktop | > 1024px | Three column, side nav |

**Touch Targets**:
- Minimum 44x44px for all interactive elements
- FAB: 56x56px
- Bottom nav items: full width / 3, 56px height

**Thumb Zone Optimization** (Mobile):
```
┌─────────────────────────────────────┐
│                                     │  ← Hard to reach
│         Secondary actions           │
│                                     │
├─────────────────────────────────────┤
│                                     │  ← Natural reach
│         Primary content             │
│                                     │
├─────────────────────────────────────┤
│                                     │  ← Easy reach
│    Primary actions (FAB, nav)       │
│                                     │
└─────────────────────────────────────┘
```

### 6.3 Interaction Patterns

**Gestures**:
| Gesture | Action |
|---------|--------|
| Tap | Select, activate |
| Long press | Context menu, add to favorites |
| Swipe left on meal | Delete with confirmation |
| Swipe right on meal | Edit |
| Pull down | Refresh |
| Swipe horizontally on date | Change day |

**Feedback**:
| Action | Feedback |
|--------|----------|
| Add food | Toast: "Added to [Meal]", haptic |
| Delete food | Toast: "Removed", undo option, haptic |
| Goal met | Celebration animation, haptic |
| Error | Toast with red accent, haptic |

### 6.4 Loading States

- Skeleton screens for initial data load
- Inline spinners for action confirmation
- Progress indicators for uploads/scans
- Optimistic updates for add/delete actions

### 6.5 Empty States

| Screen | Empty State Message | CTA |
|--------|---------------------|-----|
| Dashboard (no meals) | "Ready to start your day? Log your first meal!" | "Log Food" button |
| Favorites | "Save your go-to foods for one-tap logging" | "Browse Foods" button |
| Progress (no data) | "Log a few days to see your trends appear here" | "Go to Log" button |

### 6.6 Error Handling

| Error Type | User Message | Recovery |
|------------|--------------|----------|
| Network offline | "You're offline. Changes will sync when connected." | Auto-retry |
| Barcode not found | "Product not found. Try searching or ask AI." | Alternative actions |
| AI unavailable | "AI is taking a break. Try again in a moment." | Retry button |
| Invalid input | Field-specific message | Inline correction |

---

## 7. Design System

### 7.1 Color Palette

**Primary Colors**:
```css
--color-sage-50: #f6f7f4;
--color-sage-100: #e8ebe3;
--color-sage-200: #d1d7c7;
--color-sage-300: #b3bda2;
--color-sage-400: #95a37d;
--color-sage-500: #7a8b62;  /* Primary */
--color-sage-600: #5f6d4c;
--color-sage-700: #4a5540;
--color-sage-800: #3d4536;
--color-sage-900: #343a2f;
```

**Accent Colors**:
```css
--color-terracotta-400: #e07b54;
--color-terracotta-500: #d4613a;  /* Accent */
--color-terracotta-600: #b84d2a;
```

**Neutral Colors**:
```css
--color-cream: #fdfbf7;
--color-warm-white: #f9f6f0;
--color-charcoal: #2d2d2d;
--color-gray-500: #6b6b6b;
--color-gray-300: #b0b0b0;
```

**Semantic Colors**:
```css
--color-success: #5a9a6e;
--color-warning: #d4a thirteen;
--color-error: #c45d4a;
--color-info: #5a8fa8;
```

### 7.2 Typography

**Font Families**:
```css
--font-display: 'Fraunces', Georgia, serif;
--font-body: 'DM Sans', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

**Type Scale**:
| Name | Size | Weight | Use |
|------|------|--------|-----|
| Display Large | 32px | 600 | Welcome headers |
| Display Medium | 24px | 600 | Section headers |
| Title Large | 20px | 500 | Card titles |
| Title Medium | 16px | 500 | Subsection headers |
| Body Large | 16px | 400 | Primary content |
| Body Medium | 14px | 400 | Secondary content |
| Body Small | 12px | 400 | Captions, metadata |
| Label | 12px | 500 | Buttons, tags |

### 7.3 Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### 7.4 Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;
```

### 7.5 Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.12);
```

### 7.6 Animation Tokens

```css
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;

--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 7.7 Component Library

| Component | Variants | States |
|-----------|----------|--------|
| Button | Primary, Secondary, Ghost, Danger | Default, Hover, Active, Disabled, Loading |
| Input | Text, Number, Search | Default, Focus, Error, Disabled |
| Card | Elevated, Flat, Interactive | Default, Hover, Selected |
| Toast | Success, Error, Warning, Info | Entering, Visible, Exiting |
| Modal | Bottom Sheet, Center, Full Screen | Opening, Open, Closing |
| Progress Ring | Small, Medium, Large | Animated, Static |
| Chip | Filter, Input, Suggestion | Default, Selected, Disabled |
| Tab Bar | Bottom, Top | Active, Inactive |

---

## 8. Technical Architecture

### 8.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js 14 (App Router) | SSR, API routes, excellent DX |
| Language | TypeScript | Type safety, better tooling |
| Styling | Tailwind CSS | Rapid development, design system alignment |
| Animations | Framer Motion | Declarative, performant, React-native-like |
| Charts | Recharts | Composable, customizable, React-based |
| Icons | Lucide React | Consistent, tree-shakeable |
| Barcode | @zxing/browser | Client-side, supports multiple formats |
| AI | Vercel AI SDK | Streaming, edge-compatible |
| Auth | NextAuth.js v5 | Flexible, secure, supports multiple providers |
| Database | PostgreSQL | Relational, robust, scalable |
| ORM | Prisma | Type-safe queries, migrations |
| PWA | next-pwa | Service worker, offline support |
| Hosting | Vercel | Seamless Next.js integration |

### 8.2 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Next.js   │  │   Framer    │  │   Service   │         │
│  │    App      │  │   Motion    │  │   Worker    │         │
│  └──────┬──────┘  └─────────────┘  └──────┬──────┘         │
│         │                                  │                │
│         │         ┌─────────────┐         │                │
│         └────────▶│   Zustand   │◀────────┘                │
│                   │   (State)   │                           │
│                   └──────┬──────┘                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                         SERVER                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  API Routes │  │   Server    │  │  NextAuth   │          │
│  │             │  │   Actions   │  │             │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│                   ┌─────────────┐                            │
│                   │   Prisma    │                            │
│                   │    ORM      │                            │
│                   └──────┬──────┘                            │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                       EXTERNAL                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ PostgreSQL  │  │  OpenAI /   │  │ Open Food   │          │
│  │  Database   │  │  Anthropic  │  │ Facts API   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└──────────────────────────────────────────────────────────────┘
```

### 8.3 Project Structure

```
nourish/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── onboarding/
│   │       └── page.tsx
│   ├── (main)/
│   │   ├── layout.tsx          # Tab navigation shell
│   │   ├── page.tsx            # Home/Dashboard
│   │   ├── log/
│   │   │   └── page.tsx
│   │   ├── progress/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   ├── foods/
│   │   │   ├── search/
│   │   │   └── barcode/
│   │   ├── logs/
│   │   └── ai/
│   │       └── chat/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # Design system primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── CalorieRing.tsx
│   │   ├── MacroBar.tsx
│   │   ├── MealCard.tsx
│   │   └── DailySummary.tsx
│   ├── log/
│   │   ├── FoodSearch.tsx
│   │   ├── FavoriteGrid.tsx
│   │   ├── RecentList.tsx
│   │   ├── BarcodeScanner.tsx
│   │   ├── QuickAddModal.tsx
│   │   └── AIAssistant.tsx
│   ├── progress/
│   │   ├── WeightChart.tsx
│   │   ├── CalorieChart.tsx
│   │   ├── MacroDonut.tsx
│   │   └── StreakCounter.tsx
│   ├── onboarding/
│   │   ├── StepIndicator.tsx
│   │   ├── GoalSelector.tsx
│   │   └── ActivityPicker.tsx
│   └── layout/
│       ├── TabNav.tsx
│       ├── Header.tsx
│       └── FAB.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── calculations.ts         # TDEE, macros, etc.
├── hooks/
│   ├── useAuth.ts
│   ├── useFoodLog.ts
│   ├── useGoals.ts
│   └── useProgress.ts
├── store/
│   └── index.ts                # Zustand store
├── types/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── manifest.json
│   └── icons/
├── tailwind.config.ts
├── next.config.js
└── package.json
```

### 8.4 State Management

**Global State (Zustand)**:
```typescript
interface AppState {
  // User
  user: User | null;
  goals: Goals;

  // Today's data
  todayLog: FoodLog[];
  todayCalories: number;
  todayMacros: Macros;

  // UI State
  activeTab: 'home' | 'log' | 'progress';
  selectedDate: Date;

  // Actions
  addFood: (food: FoodEntry) => void;
  removeFood: (id: string) => void;
  updateGoals: (goals: Partial<Goals>) => void;
}
```

**Server State (React Query via Server Actions)**:
- Food search results
- Historical logs
- Progress data
- User profile

### 8.5 Offline Strategy

**Cached Data**:
- User profile and goals
- Favorites list
- Last 7 days of logs
- Food database subset (frequently used items)

**Offline Actions** (queued for sync):
- Add food entry
- Delete food entry
- Update serving size

**Sync Mechanism**:
1. Changes stored in IndexedDB
2. Service worker detects connectivity
3. Queue processed sequentially
4. Conflicts resolved (server wins for non-logs, client wins for logs)

### 8.6 Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |
| Lighthouse Score | > 90 |

---

## 9. Data Models

### 9.1 Database Schema (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Profile
  height        Float?    // in cm
  weight        Float?    // in kg
  birthDate     DateTime?
  sex           Sex?
  activityLevel ActivityLevel?

  // Relations
  goals         Goals?
  foodLogs      FoodLog[]
  favorites     Favorite[]
  weightLogs    WeightLog[]
}

model Goals {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  dailyCalories   Int
  proteinGrams    Int
  carbGrams       Int
  fatGrams        Int
  waterOz         Int      @default(64)

  goalType        GoalType @default(MAINTAIN)
  weeklyChange    Float?   // lbs per week

  updatedAt       DateTime @updatedAt
}

model FoodLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  date        DateTime @db.Date
  mealType    MealType

  foodId      String?  // Reference to food database
  foodName    String
  servingSize Float
  servingUnit String

  calories    Int
  protein     Float
  carbs       Float
  fat         Float
  fiber       Float?
  sugar       Float?
  sodium      Float?

  notes       String?
  isQuickAdd  Boolean  @default(false)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId, date])
}

model Food {
  id            String   @id @default(cuid())
  name          String
  brand         String?
  barcode       String?  @unique

  servingSize   Float
  servingUnit   String

  calories      Int
  protein       Float
  carbs         Float
  fat           Float
  fiber         Float?
  sugar         Float?
  sodium        Float?

  verified      Boolean  @default(false)
  source        String?  // "usda", "open_food_facts", "user"

  createdAt     DateTime @default(now())

  @@index([barcode])
  @@index([name])
}

model Favorite {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])

  foodId        String?
  foodName      String

  servingSize   Float    // User's preferred serving
  servingUnit   String
  calories      Int      // Pre-calculated for quick display

  position      Int      // For ordering

  createdAt     DateTime @default(now())

  @@unique([userId, foodId])
  @@index([userId])
}

model WeightLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])

  date      DateTime @db.Date
  weight    Float    // in user's preferred unit
  notes     String?

  createdAt DateTime @default(now())

  @@unique([userId, date])
  @@index([userId, date])
}

enum Sex {
  MALE
  FEMALE
  OTHER
}

enum ActivityLevel {
  SEDENTARY
  LIGHTLY_ACTIVE
  MODERATELY_ACTIVE
  VERY_ACTIVE
  EXTREMELY_ACTIVE
}

enum GoalType {
  LOSE
  MAINTAIN
  GAIN
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}
```

### 9.2 API Response Types

```typescript
// Food Search Response
interface FoodSearchResult {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  matchScore: number;
}

// Daily Summary Response
interface DailySummary {
  date: string;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    type: MealType;
    entries: FoodLogEntry[];
    subtotal: number;
  }[];
  status: 'under' | 'on_track' | 'over';
}

// Progress Data Response
interface ProgressData {
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  weight: {
    data: { date: string; value: number }[];
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  calories: {
    data: { date: string; value: number; goal: number }[];
    average: number;
    daysOnTrack: number;
    totalDays: number;
  };
  macros: {
    averageProtein: number;
    averageCarbs: number;
    averageFat: number;
  };
  streak: {
    current: number;
    longest: number;
  };
}
```

---

## 10. API Specifications

### 10.1 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods/search` | Search food database |
| GET | `/api/foods/barcode/:code` | Lookup by barcode |
| GET | `/api/logs` | Get food logs (with date range) |
| POST | `/api/logs` | Add food log entry |
| PUT | `/api/logs/:id` | Update food log entry |
| DELETE | `/api/logs/:id` | Delete food log entry |
| GET | `/api/favorites` | Get user favorites |
| POST | `/api/favorites` | Add favorite |
| DELETE | `/api/favorites/:id` | Remove favorite |
| GET | `/api/progress` | Get progress data |
| POST | `/api/weight` | Log weight |
| GET | `/api/goals` | Get user goals |
| PUT | `/api/goals` | Update goals |
| POST | `/api/ai/chat` | AI assistant (streaming) |

### 10.2 Key Endpoint Details

**Food Search**
```
GET /api/foods/search?q=chicken&limit=20&offset=0

Response:
{
  "results": FoodSearchResult[],
  "total": number,
  "hasMore": boolean
}
```

**Add Food Log**
```
POST /api/logs

Body:
{
  "date": "2025-01-28",
  "mealType": "LUNCH",
  "foodId": "clx123...",  // optional if quickAdd
  "foodName": "Grilled Chicken Breast",
  "servingSize": 6,
  "servingUnit": "oz",
  "calories": 280,
  "protein": 52,
  "carbs": 0,
  "fat": 6,
  "isQuickAdd": false
}

Response:
{
  "id": "clx456...",
  "createdAt": "2025-01-28T12:30:00Z",
  ...entry
}
```

**AI Chat (Streaming)**
```
POST /api/ai/chat

Body:
{
  "messages": [
    { "role": "user", "content": "I had a burger and fries for lunch" }
  ],
  "context": {
    "currentCalories": 800,
    "goalCalories": 1800,
    "mealType": "LUNCH"
  }
}

Response: Server-Sent Events stream
```

---

## 11. Success Metrics

### 11.1 Key Performance Indicators (KPIs)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Retention** | | |
| Day 1 Retention | > 60% | Users returning next day |
| Day 7 Retention | > 40% | Users returning after 1 week |
| Day 30 Retention | > 25% | Users active after 1 month |
| **Engagement** | | |
| Daily Active Users | Growth | Unique users per day |
| Logs per Day (active user) | > 3 | Average food entries |
| Session Duration | 2-5 min | Average time in app |
| **Conversion** | | |
| Onboarding Completion | > 80% | Users finishing onboarding |
| First Log | > 70% | Users logging food day 1 |
| Premium Conversion | > 5% | Free to paid conversion |
| **Satisfaction** | | |
| App Store Rating | > 4.5 | Average rating |
| NPS | > 40 | Net Promoter Score |

### 11.2 Feature-Specific Metrics

| Feature | Metric | Target |
|---------|--------|--------|
| Barcode Scanner | Successful scans | > 85% |
| AI Assistant | Queries resolved | > 75% |
| Quick Add | % of total logs | > 30% |
| Favorites | Users with 3+ favorites | > 50% |

### 11.3 Technical Metrics

| Metric | Target |
|--------|--------|
| API Response Time (p95) | < 200ms |
| Error Rate | < 0.1% |
| Uptime | 99.9% |
| PWA Install Rate | > 20% of mobile users |

---

## 12. Release Phases

### Phase 1: MVP (Weeks 1-6)

**Goal**: Core logging functionality

**Features**:
- [ ] User authentication (email + social)
- [ ] Onboarding flow
- [ ] Daily dashboard
- [ ] Manual food logging
- [ ] Food database search
- [ ] Quick-add calories
- [ ] Basic favorites
- [ ] Simple progress view (weekly calories)
- [ ] Goal setting

**Milestones**:
- Week 2: Auth + onboarding complete
- Week 4: Logging flow complete
- Week 6: Dashboard + basic progress

### Phase 2: Enhanced Logging (Weeks 7-10)

**Goal**: Reduce logging friction

**Features**:
- [ ] Barcode scanner
- [ ] AI meal assistant (basic)
- [ ] Improved search with suggestions
- [ ] Recent items smart sorting
- [ ] Meal templates

**Milestones**:
- Week 8: Barcode scanner live
- Week 10: AI assistant MVP

### Phase 3: Insights & Polish (Weeks 11-14)

**Goal**: Delight and retain users

**Features**:
- [ ] Full progress charts
- [ ] Weekly/monthly reports
- [ ] Streak tracking
- [ ] Enhanced animations
- [ ] Push notifications
- [ ] Data export

**Milestones**:
- Week 12: Progress visualizations complete
- Week 14: Polish pass complete

### Phase 4: Growth (Weeks 15+)

**Goal**: Expand and monetize

**Features**:
- [ ] Premium tier
- [ ] Meal photo recognition
- [ ] Recipe import
- [ ] Social features
- [ ] Integrations (Apple Health, Fitbit)
- [ ] Customizable dashboard

---

## Appendix A: Competitive Analysis

| App | Strengths | Weaknesses | Nourish Opportunity |
|-----|-----------|------------|---------------------|
| MyFitnessPal | Huge database, brand recognition | Cluttered UI, slow, ads | Cleaner UX, faster logging |
| Lose It! | Good design, barcode scanner | Limited free tier | More generous free tier |
| Cronometer | Detailed micronutrients | Complex, not beginner-friendly | Simpler approach |
| Yazio | Modern design | Expensive premium | Better value prop |

---

## Appendix B: Calorie Calculation Formulas

**Mifflin-St Jeor Equation (BMR)**:
- Male: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
- Female: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161

**Activity Multipliers (TDEE)**:
| Level | Multiplier | Description |
|-------|------------|-------------|
| Sedentary | 1.2 | Little or no exercise |
| Lightly Active | 1.375 | Light exercise 1-3 days/week |
| Moderately Active | 1.55 | Moderate exercise 3-5 days/week |
| Very Active | 1.725 | Hard exercise 6-7 days/week |
| Extremely Active | 1.9 | Very hard exercise, physical job |

**Weight Change Adjustments**:
- Lose 0.5 lb/week: TDEE - 250 cal
- Lose 1 lb/week: TDEE - 500 cal
- Lose 1.5 lb/week: TDEE - 750 cal
- Lose 2 lb/week: TDEE - 1000 cal
- Gain: Reverse the above

---

## Appendix C: Accessibility Requirements

**WCAG 2.1 AA Compliance**:
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Touch targets ≥ 44x44px
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Focus states visible
- [ ] Screen reader compatible
- [ ] Keyboard navigable
- [ ] Reduced motion option
- [ ] Scalable text (up to 200%)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-28 | - | Initial draft |

---

*End of PRD*
