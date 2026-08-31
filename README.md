# Hem Health

Personal health & fitness progressive web app. Save to your iPhone home screen for a native-like experience.

## Features

- **Goal Engine** — Personalized daily calorie and macro targets based on body composition trends (Renpho)
- **Food Tracking** — Quick-tap meals, Open Food Facts search, water logging
- **Workout Tracking** — Polar API sync + manual entry
- **Body Composition** — Renpho scale logging with trend charts
- **AI Insights** — Weekly summaries correlating sleep, workouts, nutrition, and body changes
- **PWA** — Installable on iPhone/Android with offline support

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 on your phone (same network) or use Safari → Share → Add to Home Screen.

## API Keys

Copy `.env.example` to `.env` and add your tokens:

- **Oura Ring** — [cloud.ouraring.com](https://cloud.ouraring.com/)
- **Polar** — [admin.polaraccesslink.com](https://admin.polaraccesslink.com/)

Without API keys the app runs with demo data.

## Tech Stack

- Vite + React + TypeScript
- vite-plugin-pwa (service worker + manifest)
- Recharts for body composition trends
- Open Food Facts API (free, no key required)

## Project Structure

```
src/
├── components/
│   ├── layout/       # AppShell, BottomNav
│   └── today/        # CalorieRing, MacroBreakdown, RecoveryScore
├── lib/
│   ├── api/          # Oura, Polar, Open Food Facts
│   ├── goal-engine/  # Calorie/macro calculator
│   └── mock-data.ts  # Demo data layer
├── pages/            # Today, Food, Workouts, Body, Insights
└── types/            # Shared TypeScript types
```

## Install on iPhone

1. Deploy or run dev server accessible on your network
2. Open in Safari
3. Tap Share → **Add to Home Screen**
4. Launch "Hem Health" from your home screen
