# 1RUN.UK — Claude Code context

## What this is
A mobile-first React PWA for beginner runners. 6-week walk-to-run programme with integrated weekly eating habits. Target: run a first 1K. Built with Vite + React + React Router. Backend: Firebase (Firestore + Auth). Deployed at https://1k-beta.vercel.app · GitHub: https://github.com/edwardglw/1k

## Source of truth
- `../prd.md` — product decisions, features, PRD open questions
- `../firstrun-dashboard.jsx` and `../firstrun-onboarding.jsx` — original visual prototypes

## Dev
```
npm run dev    # localhost:5173 (or next available port)
npm run build  # verify before ending a session
```

Firebase config is in `.env.local` (gitignored). Do not commit it.

## Design tokens
All in `src/tokens.js` — import as `import { T } from "../tokens"`.

- **Palette:** sage `#7A9B76`, moss `#4A6741`, ivory `#FAF7F2`, apricot `#E8A87C`, sky `#8BB8D0`, charcoal `#3B3F3A`
- **Radii:** sm 5, md 7, lg 10, xl 14, full 999
- **Font:** Nunito (Google Fonts), weights 400–900
- **Extra colours used:** red `#C0392B` / `#FDEAEA`, amber `#D97706` / `#FEF3E2` (WeekFeelingSheet only — not in tokens.js)

## Layout convention
All screens: full-width outer div with `position: relative` + `AtmosphericBG`, inner content wrapper at `maxWidth: 430, margin: "0 auto", position: relative, zIndex: 1`.

## Auth flow
Landing → `/signup` (create account) → `/onboarding` (personalise plan) → `/dashboard`
Returning: Landing "Sign in" → `/signin` → `/dashboard`
Route guards in `App.jsx` enforce auth + `programmeStarted` before showing app screens.

## Firebase
- `src/lib/firebase.js` — exports `auth` and `db`
- `UserContext` handles `onAuthStateChanged`, loads Firestore on sign-in, syncs on every profile/progress change
- Firestore doc: `users/{uid}` with `{ profile, progress }` fields
- localStorage kept as offline cache

## Component locations
```
src/
  lib/
    firebase.js               — Firebase app, auth, db exports
  tokens.js
  context/
    UserContext.jsx           — Firebase auth + Firestore sync, profile + progress state
  data/
    programme.js              — WEEKS array, EATING_HABITS, formatIntervals()
  components/
    ui/  Icon, Select, OptionCard, CheckboxCard, HighlightMessage,
         AtmosphericBG, WeightGraph
    WeekButton.jsx            — 6 week circles; current week pulses (moss fill + animation)
    WeekPanel.jsx
    GoalPanel.jsx
    BenefitsModal.jsx
    BadgeCelebration.jsx      — full-screen overlay; onContinue triggers WeekFeelingSheet for week badges
    WeekFeelingSheet.jsx      — "How did that feel?" bottom sheet; red/green/amber; no skip
    SessionDoneSheet.jsx
    ShareSheet.jsx
    WeightLogSheet.jsx
  screens/
    landing/index.jsx         — dark scrollable hero; "Register with email" → /signup
    onboarding/index.jsx      — 6 steps + PlanReady; completeOnboarding() → /dashboard
    onboarding/steps/         — ScreenAmbition, ScreenActivity, ScreenAboutYou, ScreenWeight,
                                 ScreenInjuries, ScreenReward, ScreenPlanReady
    auth/
      SignIn.jsx              — email/password + Google; → /dashboard
      SignUp.jsx              — email/password only; → /onboarding
    dashboard/index.jsx
    week/index.jsx            — session locking: can't mark done if prev week incomplete
    profile/index.jsx         — shows signed-in email + Sign out; no register CTA
```

## Key UserContext exports
`firebaseUser, authLoading, profile, progress, setProfile, completeOnboarding,
signIn, signUp, signInWithGoogle, signOutUser,
markSessionDone, unmarkSessionDone, applyWeekFeedback,
isSessionDone, getSessionDate, getWeekStatus,
logWeighIn, hasWeighedInThisWeek, isUnder18, totalSessions, sessionsCompleted`

## Progress data shape
```js
{
  currentWeek: 1,          // advances automatically when a week is completed
  sessionsDone: {},        // "w1-s0": "2026-04-24" (ISO date)
  weighIns: [],            // [{ week, value }] — one per week, persisted to Firestore
  badges: [],              // [{ type, label, message, earnedAt }]
  startWeight: null,
  programmeStarted: false,
  programmeComplete: false,
  weekFeedback: {},        // { "w1": "too_hard" | "about_right" | "too_easy" }
  walkMult: 1.0,           // adaptive walk multiplier (0.8–1.3); 1.1 if injuries=["easier"]
  runMult: 1.0,            // adaptive run multiplier (1.0–1.3)
}
```

## Adaptive session logic
Sessions in weeks 3–6 have `intervals: { walk, run, repeats, verb? }`.
`formatIntervals(intervals, walkMult, runMult)` in `programme.js` returns the adapted description.
Times formatted as "X min Y sec", seconds rounded to nearest 10.
After each week: WeekFeelingSheet → `applyWeekFeedback(weekNum, feedback)` updates multipliers.

## Settled decisions
- Injuries `["easier"]` → `walkMult` initialised at 1.1
- `currentWeek` advances to N+1 when week N is fully completed
- Session locking: "Mark as done" is blocked (shows sheet) if previous week not complete
- Recipe cards commented out — waiting for real URLs
- Active minutes = `sessionsCompleted * 20` (placeholder)
- Imperial units not implemented
- Calorie formula needs clinical validation before launch
