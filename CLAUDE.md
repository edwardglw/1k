# 1RUN.UK — Claude Code context

## What this is
A mobile-first React PWA for beginner runners. 6-week walk-to-run programme with integrated weekly eating habits. Target: run a first 1K. Built with Vite + React + React Router. Backend: Firebase (Firestore + Auth). Deployed at https://1k-beta.vercel.app · GitHub: https://github.com/edwardglw/1k

## Current state (25 Apr 2026)
The previous to-do list (former `note.txt` items 2–10) is fully shipped: WeekFeelingSheet, recipe-card placeholders, eating detail screen, deploy, PWA basics, Firebase auth, empty-state copy, animations.

Active work: **polish / UX pass.** See `../TODO.md` for the live list (10 items: empty states, page transitions, loading/error states, focus rings, touch targets, end-to-end verify).

### Recent changes worth knowing
- **Brand audit**: all user-facing copy in `src/` is `1RUN.UK`. The only stale "FirstRun" mention was in this file (cleared). Page `<title>`, `package.json` name, marketing.html: clean.
- **Weight is optional in onboarding.** `ScreenWeight.jsx` label reads "Current weight (optional)" with a clarifying subhead. `canAdvance()` for step 3 in `onboarding/index.jsx` still requires weight + targetWeight to advance — this should probably loosen to allow skipping (currently a user who wants to skip has to be under 18 to bypass the gate). **Open question.**
- **Weight chart already uses onboarding `startWeight` as Week 1 baseline** — `WeightGraph.jsx` plots it as an open dot (white fill, moss stroke), distinct from weigh-ins. Dashboard `index.jsx` line 310 hides the entire Weight Journey card when `progress.startWeight` is null.
- **Hero branding parked**: a new logo is being designed. Once the asset lands, apply consistently across App header (`App.jsx`), `SignIn.jsx`, `SignUp.jsx`, Profile footer brand (`profile/index.jsx`), and Landing nav (`landing/Landing.css` `.lp-logo` + `.lp-footer-brand`). The current pattern is `1RUN` in dominant colour + `.UK` smaller in sage.

### Gotchas
- **`onboarding/steps/ScreenWelcome.jsx` is dead code.** Not imported in `onboarding/index.jsx`. Don't edit it expecting changes to render. Safe to delete if you want to tidy.
- The onboarding flow is 6 steps (Ambition, Activity, AboutYou, Weight, Injuries, Reward) plus a `ScreenPlanReady` summary — there is **no welcome screen** between Landing and step 0.

## Source of truth
- `../prd.md` — product decisions, features, PRD open questions
- `../TODO.md` — active polish/UX backlog
- `../firstrun-dashboard.jsx` and `../firstrun-onboarding.jsx` — legacy visual prototypes from the old "FirstRun" name. Visual reference only; product is branded **1RUN.UK** everywhere user-facing.

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
- **Firestore rules**: auth required; users can only read/write their own doc. Not in test mode.
- **Vercel env vars**: all `VITE_FIREBASE_*` vars set in Vercel project settings (not in repo — `.env.local` is gitignored)
- **Authorised domains**: `localhost` and `1k-beta.vercel.app` both added in Firebase Auth settings

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
                                 (ScreenWelcome.jsx exists but is NOT imported — dead code)
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
- Weight is **optional** in onboarding; if skipped, the dashboard Weight Journey card hides entirely (no fallback empty state). Calorie allowance also depends on weight, so users who skip won't see an allowance card either.
- WeightGraph uses `progress.startWeight` (set from onboarding `data.weight`) as the Week 1 baseline — open dot, distinct from weigh-in dots.
- Hero branding overhaul parked pending new logo. Apply across App header / SignIn / SignUp / Profile / Landing once asset is ready.
- `ScreenWelcome.jsx` is orphan code — not wired into the onboarding flow. Don't edit it.
