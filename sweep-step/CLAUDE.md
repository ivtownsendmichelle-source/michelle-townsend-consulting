# Sweep Step

A progressive web app for people working the 12 steps, starting with the 4th Step. Mobile-first. Installable. Offline-capable. Built for the non-traditional recovery crowd. LGBTQ+ inclusive in voice, design, and structure — not as decoration.

## Layer Roadmap

### Layer 1 (current)
Onboarding, PIN lock, sobriety tracker + milestones, 4th Step inventories (Resentments, Fears, Sex Inventory, Harms), Pim companion stages 1-4, export to JSON and plain text.

### Layer 2 (future)
Meeting log, gratitude journal, phone list, daily reflection, Google Sheets sync, Pim stages 5-6.

### Layer 3 (future)
Step progress tracker, promises checklist, Pim stage 7.

## Tech Stack

- React 19 + Vite 6
- React Router v6
- Tailwind CSS v4 (custom design system via @theme in index.css, no tailwind.config.js)
- Workbox via vite-plugin-pwa (offline-first)
- Vitest + React Testing Library
- localStorage for all user data — no backend, no analytics, no external calls
- Netlify for deploy

## Key Decisions

### Name
**Sweep Step.** The broom is the metaphor. Pim carries a broom.

### Pim (the companion)
- Pim is a dust creature that grows as the user does the work.
- Hand-drawn style SVG, slightly imperfect, charming. Fluid in identity — no gendered design cues.
- Stage 1: Pile of dust (default)
- Stage 2: Dust with two small eyes (first inventory entry saved)
- Stage 3: Dust bunny with a broom bristle (10 total entries OR 3+ entries in one section)
- Stage 4: Small fuzzy creature holding a tiny broom (all 4 sections have entries AND 25+ total) — Layer 1 cap
- Stages 5-7 reserved for Layer 2/3. Stage logic in `src/utils/pimStage.js` supports extension.
- Neglect: dust particles accumulate around (not on) Pim after 3/7/14 days of inactivity. Message at 14 days: "Pim's been waiting. No rush." Never guilt. Never sad. Never death.
- Tap messages rotate: "Pim is here." "Pim sees you." etc. When neglected 3+ days: "Pim's been waiting."
- Breathing animation (subtle scale) always active.

### PIN Lock
- 4-6 digit numeric, hashed locally with a salted djb2 variant (`src/store/pin.js`)
- Required on every app open and after 5 minutes in background
- 5 wrong attempts: 60-second lockout
- 10 wrong attempts: wipe confirmation screen → erases all data
- No "forgot PIN" link. No recovery. User warned at setup with mandatory "I understand" checkbox.

### Higher Power Language
User chooses during onboarding. Options:
- Higher Power
- God
- G.O.D. (Group Of Drunks)
- The Universe
- Nature
- The Group
- Custom free text
- Skip (uses neutral framing: "something larger than yourself")

The chosen term replaces `{{HP}}` everywhere the worksheet says "God."

### Dual Guidance Pattern
Each inventory section shows:
1. **Original guidance** — AA worksheet voice, shown by default in a styled callout
2. **"Learn more" toggle** — expands a rewritten modern, inclusive version. Same information, different voice. No clinical AA language, no assumed gender, no assumed faith path. HP term inserted where relevant.

Both versions are in `src/data/guidance.js`. The `insertHP()` function handles substitution.

### Inventory Structure
All 4 follow the same component pattern: `GuidanceBox` + `InventoryEntryForm` + `InventoryEntryList`.

**Resentments** (4 columns): resentfulAt, cause, affects (checkboxes + other), myPart (checkboxes + other)
**Fears**: fear, why, selfCause, hpDirection
**Sex Inventory**: whom, whatIDid, aroused, myFault, shouldHaveDone
**Harms**: person, whatIDid, howAffected, amendsType (select: Direct/Indirect/Living)

### Sobriety Milestones
Calculated from sobriety date: 24h, 30d, 60d, 90d, 6mo, 9mo, 1yr, then yearly.
Milestone hit → Pim reacts, chip appears, message: "[N] days. You're here." Quiet dignity.

### Export
- JSON: full store, re-importable
- Plain text: formatted by section, numbered entries, dates, printable
- Both via Blob download. Filename: `sweep-step-export-YYYY-MM-DD.json|txt`

## Design System

### Colors
- Background: cream `#F5F1E8`
- Primary text: ink `#1A1A1A`
- Accent 1: oxblood `#7A1F2B`
- Accent 2: electric violet `#6B2FBF`
- Accent 3: acid green `#9FD53D`
- Accent 4: warm ochre `#D4A52A`

No gradients. No rainbows. Inclusivity is in the boldness and unexpected pairings.

### Typography
- Display/headers: Fraunces (variable, self-hosted)
- Body: Inter (variable, self-hosted)
- Inventory entry text: body font, slightly larger for readability during emotional work

### Voice
- Direct. Warm. Not soft. Not clinical.
- No exclamation points except milestone moments.
- No emoji in UI (Pim's expressions are visual).
- Never assume gender, faith, or relationship structure.

### Layout
- Mobile-first, breakpoints up to tablet. Not optimized for desktop.
- Generous whitespace — the 4th Step is heavy work. Room to breathe.
- Tap targets minimum 44px.
- WCAG AA contrast minimum.

## localStorage Schema

```js
{
  version: 1,
  user: { pronouns, higherPowerTerm, sobrietyDate, pinHash, onboardingComplete },
  pim: { stage, lastInteraction, dustLevel },
  inventories: { resentments: [], fears: [], sex: [], harms: [] },
  // Reserved Layer 2: meetings, gratitude, phoneList, dailyReflection
  // Reserved Layer 3: stepProgress, promises
}
```

Key: `"sweep-step"` in localStorage.

## Implementation Plan

Full plan with 15 tasks and ~80 steps:
`docs/superpowers/plans/2026-04-14-sweep-step-layer1.md`

## Session Log

### 2026-04-14 — Initial planning + scaffold
- Created implementation plan (15 tasks, Layer 1 full scope)
- Created this CLAUDE.md as source of truth
- Execution method: subagent-driven development
- Task 1 complete: project scaffolded with Vite 6 (pinned for vite-plugin-pwa compat), React 19, Tailwind v4, PWA manifest. Fraunces font is placeholder, Inter downloaded. Build verified.
