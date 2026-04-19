# FirstRun — Claude Code context

## What this is
A mobile-first React PWA for beginner runners. 6-week walk-to-run programme with integrated weekly eating habits. Target: run a first 1K. Built with Vite + React + React Router. No backend yet — localStorage only.

## Source of truth
- `../firstrun-prd-v6.docx` (extracted to `../prd.md`) — all product decisions, features, adaptive logic, PRD open questions
- `../firstrun-dashboard.jsx` and `../firstrun-onboarding.jsx` — original visual prototypes

## Dev
```
npm run dev    # localhost:5174
npm run build  # verify before ending a session
```

## Design tokens
All in `src/tokens.js` — import as `import { T } from "../tokens"`.

Key values to avoid re-reading the file:
- **Palette:** sage `#7A9B76`, moss `#4A6741`, ivory `#FAF7F2`, apricot `#E8A87C`, sky `#8BB8D0`, charcoal `#3B3F3A`
- **Radii:** sm 5, md 7, lg 10, xl 14, full 999
- **Font:** Nunito (Google Fonts), weights 400–900

## Layout convention
All screens: full-width outer div with `position: relative` + `AtmosphericBG`, inner content wrapper at `maxWidth: 430, margin: "0 auto", position: relative, zIndex: 1`. See onboarding `index.jsx` or dashboard `index.jsx` for the pattern.

## Component locations
```
src/
  tokens.js
  context/UserContext.jsx       — profile + progress state, localStorage, calcAllowance
  data/programme.js             — WEEKS array, EATING_HABITS
  components/
    ui/  Icon, Select, OptionCard, CheckboxCard, HighlightMessage,
         AtmosphericBG, WeightGraph
    WeekButton, WeekPanel, GoalPanel, BenefitsModal
  screens/
    onboarding/index.jsx + steps/  (7 steps + PlanReady)
    dashboard/index.jsx
```

## Settled decisions (not in PRD)
- Apple Sign In removed from welcome screen — email + Google only for now
- Injuries step simplified to binary: "Yes, I need to take it more easy" (`["easier"]`) / "No, I feel ok" (`["ok"]`)
- Plan summary rows are fully tappable buttons (not just the Edit label)
- Eating icon: `utensils` used consistently (not `leaf`) across benefits modal, welcome bubbles, dashboard eating card
- Active minutes on dashboard is a placeholder calculation (`sessionsCompleted * 20`) — replace when session logging is wired up
- Weight log uses `prompt()` — known placeholder, replace with bottom-sheet modal

## PRD open questions (don't block on these, use sensible defaults)
- Brand name: FirstRun is working title
- Backend: Firebase vs Supabase vs local-first — not decided
- Auth: stub only, buttons advance onboarding flow
- Imperial units: not implemented
- Calorie formula: needs clinical validation before launch
