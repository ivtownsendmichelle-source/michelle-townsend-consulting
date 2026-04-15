# Sweep Step Layer 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first PWA for 12-step 4th Step work — onboarding, PIN lock, sobriety tracker, 4 inventories (Resentments, Fears, Sex Inventory, Harms), Pim companion stages 1-4, and export to JSON/text.

**Architecture:** React SPA with client-side routing (react-router), all data in versioned localStorage, Workbox for offline PWA. Single `useAppStore` context wraps a versioned schema. Pim growth is a pure function of inventory state. PIN is hashed and checked on every app open / 5-min background return.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind CSS v3 (custom theme), Workbox (vite-plugin-pwa), Vitest + React Testing Library, Fraunces (display font via Google Fonts self-hosted), Inter (body font).

---

## File Structure

```
sweep-step/                          # NEW repo root — separate from MTC
├── public/
│   ├── manifest.json                # PWA manifest
│   ├── favicon.svg                  # Broom/dust icon
│   ├── icon-192.png                 # PWA icon
│   ├── icon-512.png                 # PWA icon
│   └── fonts/                       # Self-hosted Fraunces + Inter
├── src/
│   ├── main.jsx                     # React entry, mounts <App/>
│   ├── App.jsx                      # Router + AppProvider + PinGate
│   ├── index.css                    # Tailwind directives + font-face
│   ├── store/
│   │   ├── schema.js                # localStorage schema v1, defaults, migration fn
│   │   ├── AppContext.jsx           # React context + provider, read/write localStorage
│   │   └── pin.js                   # Hash, verify, lockout logic
│   ├── hooks/
│   │   ├── useAppStore.js           # Convenience hook for AppContext
│   │   └── usePim.js               # Pim stage calc, dust level, messages
│   ├── components/
│   │   ├── PinGate.jsx             # PIN entry screen, lockout, wipe
│   │   ├── Pim.jsx                 # Pim visual + animation + tap handler
│   │   ├── PimDust.jsx             # Dust particle effect (CSS animation)
│   │   ├── MilestoneChip.jsx       # Sobriety milestone badge
│   │   ├── SobrietyCounter.jsx     # Days counter + milestone detection
│   │   ├── GuidanceBox.jsx         # Original + "Learn more" expandable guidance
│   │   ├── InventoryEntryForm.jsx  # Generic form for inventory entries
│   │   ├── InventoryEntryList.jsx  # List of saved entries, edit/delete
│   │   └── Layout.jsx              # Shell with top bar, bottom icons
│   ├── pages/
│   │   ├── Onboarding.jsx          # Multi-step onboarding flow
│   │   ├── Home.jsx                # Home screen with Pim + 4 tiles
│   │   ├── Resentments.jsx         # Resentments inventory
│   │   ├── Fears.jsx               # Fears inventory
│   │   ├── SexInventory.jsx        # Sex inventory
│   │   ├── Harms.jsx               # Harms inventory
│   │   ├── Milestones.jsx          # Milestone history view
│   │   ├── Settings.jsx            # Edit sobriety date, pronouns, HP term
│   │   └── Export.jsx              # JSON + text export
│   ├── data/
│   │   ├── guidance.js             # Original + modern guidance text per inventory
│   │   ├── milestones.js           # Milestone definitions + messages
│   │   └── pimMessages.js          # Pim tap messages + neglect messages
│   └── utils/
│       ├── dates.js                # Day diff, milestone calc, formatting
│       ├── export.js               # JSON + plain text export generators
│       └── pimStage.js             # Pure function: inventory state → stage number
├── tests/
│   ├── store/
│   │   ├── schema.test.js          # Schema defaults, migration
│   │   └── pin.test.js             # Hash, verify, lockout, wipe
│   ├── utils/
│   │   ├── dates.test.js           # Milestone calc, day diff
│   │   ├── export.test.js          # Export format verification
│   │   └── pimStage.test.js        # Stage calc from inventory state
│   ├── hooks/
│   │   └── usePim.test.js          # Pim hook behavior
│   ├── components/
│   │   ├── PinGate.test.jsx        # PIN entry flows
│   │   ├── GuidanceBox.test.jsx    # Expand/collapse guidance
│   │   └── SobrietyCounter.test.jsx
│   └── pages/
│       ├── Onboarding.test.jsx     # Onboarding flow
│       └── Home.test.jsx           # Home screen rendering
├── index.html                       # Vite entry HTML
├── vite.config.js                   # Vite + PWA plugin config
├── tailwind.config.js               # Custom design system
├── postcss.config.js                # Tailwind PostCSS
├── netlify.toml                     # Netlify deploy config
├── package.json
└── README.md
```

---

## Task 1: Project Scaffold + Tooling

**Files:**
- Create: `sweep-step/package.json`
- Create: `sweep-step/vite.config.js`
- Create: `sweep-step/tailwind.config.js`
- Create: `sweep-step/postcss.config.js`
- Create: `sweep-step/index.html`
- Create: `sweep-step/src/main.jsx`
- Create: `sweep-step/src/App.jsx`
- Create: `sweep-step/src/index.css`
- Create: `sweep-step/netlify.toml`
- Create: `sweep-step/README.md`
- Create: `sweep-step/.gitignore`

- [ ] **Step 1: Create project directory and initialize**

```bash
mkdir -p sweep-step && cd sweep-step
npm create vite@latest . -- --template react
```

Select React, JavaScript when prompted.

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom vite-plugin-pwa workbox-precaching
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind with the design system**

Replace `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5F1E8',
        ink: '#1A1A1A',
        oxblood: '#7A1F2B',
        violet: '#6B2FBF',
        acid: '#9FD53D',
        ochre: '#D4A52A',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Configure Vite with PWA plugin**

Replace `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png', 'fonts/**/*'],
      manifest: {
        name: 'Sweep Step',
        short_name: 'Sweep Step',
        description: 'A private 4th Step companion',
        theme_color: '#F5F1E8',
        background_color: '#F5F1E8',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
});
```

- [ ] **Step 5: Set up index.css with Tailwind and font imports**

Replace `src/index.css`:

```css
@import 'tailwindcss';

@theme {
  --color-cream: #F5F1E8;
  --color-ink: #1A1A1A;
  --color-oxblood: #7A1F2B;
  --color-violet: #6B2FBF;
  --color-acid: #9FD53D;
  --color-ochre: #D4A52A;

  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
}

@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/Fraunces-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

body {
  @apply bg-cream text-ink font-body antialiased;
  min-height: 100dvh;
}
```

- [ ] **Step 6: Set up minimal index.html**

Replace `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#F5F1E8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>Sweep Step</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Set up minimal App and main entry**

`src/main.jsx`:

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`src/App.jsx`:

```jsx
export default function App() {
  return <div className="min-h-dvh bg-cream p-4 font-body">Sweep Step</div>;
}
```

- [ ] **Step 8: Set up test infrastructure**

Create `tests/setup.js`:

```js
import '@testing-library/jest-dom';
```

- [ ] **Step 9: Write Netlify config**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 10: Write .gitignore**

```
node_modules/
dist/
.DS_Store
*.local
```

- [ ] **Step 11: Write README.md**

```markdown
# Sweep Step

A private, offline-first PWA for people working the 12 Steps, starting with Step 4.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Netlify

Push to the connected GitHub repo. Netlify auto-builds from `main`.

Manual deploy:
```bash
npm run build
npx netlify deploy --prod --dir=dist
```

## Roadmap

- **Layer 1 (current):** Onboarding, PIN lock, sobriety tracker, 4th Step inventories, Pim stages 1-4, export
- **Layer 2:** Meeting log, gratitude journal, phone list, daily reflection, Google Sheets sync, Pim stages 5-6
- **Layer 3:** Step progress tracker, promises checklist, Pim stage 7
```

- [ ] **Step 12: Download fonts to public/fonts/**

```bash
mkdir -p public/fonts
# Download Fraunces variable font
curl -L -o public/fonts/Fraunces-Variable.woff2 "https://github.com/undercasetype/Fraunces/raw/master/fonts/variable/Fraunces%5BSOFT%2CWONK%2Copsz%2Cwght%5D.woff2"
# Download Inter variable font
curl -L -o public/fonts/Inter-Variable.woff2 "https://github.com/rsms/inter/raw/master/docs/font-files/Inter.var.woff2"
```

If curl fails, download manually from Google Fonts and place woff2 files in `public/fonts/`.

- [ ] **Step 13: Create placeholder PWA icons**

Create simple SVG favicon at `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#F5F1E8"/>
  <text x="16" y="24" text-anchor="middle" font-size="22" font-family="serif" fill="#7A1F2B">S</text>
</svg>
```

For `icon-192.png` and `icon-512.png`, generate from the SVG or use placeholder PNGs. These can be replaced with final art later.

- [ ] **Step 14: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts, page shows "Sweep Step" on cream background.

- [ ] **Step 15: Run tests (should pass with no tests yet)**

```bash
npx vitest run
```

Expected: No test suites found (or 0 tests). No errors.

- [ ] **Step 16: Commit**

```bash
git init
git add .
git commit -m "feat: project scaffold with Vite, React, Tailwind, PWA, Netlify config"
```

---

## Task 2: localStorage Schema + Store Context

**Files:**
- Create: `src/store/schema.js`
- Create: `src/store/AppContext.jsx`
- Create: `src/hooks/useAppStore.js`
- Create: `tests/store/schema.test.js`

- [ ] **Step 1: Write failing tests for schema**

Create `tests/store/schema.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { getDefaultStore, loadStore, saveStore, STORAGE_KEY } from '../../src/store/schema';

beforeEach(() => {
  localStorage.clear();
});

describe('getDefaultStore', () => {
  it('returns schema version 1', () => {
    const store = getDefaultStore();
    expect(store.version).toBe(1);
  });

  it('returns empty user object with null fields', () => {
    const store = getDefaultStore();
    expect(store.user).toEqual({
      pronouns: null,
      higherPowerTerm: null,
      sobrietyDate: null,
      pinHash: null,
      onboardingComplete: false,
    });
  });

  it('returns default pim state', () => {
    const store = getDefaultStore();
    expect(store.pim).toEqual({
      stage: 1,
      lastInteraction: null,
      dustLevel: 0,
    });
  });

  it('returns empty inventories', () => {
    const store = getDefaultStore();
    expect(store.inventories.resentments).toEqual([]);
    expect(store.inventories.fears).toEqual([]);
    expect(store.inventories.sex).toEqual([]);
    expect(store.inventories.harms).toEqual([]);
  });
});

describe('loadStore', () => {
  it('returns default store when localStorage is empty', () => {
    const store = loadStore();
    expect(store).toEqual(getDefaultStore());
  });

  it('returns parsed store from localStorage', () => {
    const data = getDefaultStore();
    data.user.pronouns = 'they/them';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const loaded = loadStore();
    expect(loaded.user.pronouns).toBe('they/them');
  });

  it('returns default store on corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');
    const store = loadStore();
    expect(store).toEqual(getDefaultStore());
  });
});

describe('saveStore', () => {
  it('persists store to localStorage', () => {
    const data = getDefaultStore();
    data.user.sobrietyDate = '2025-01-15';
    saveStore(data);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(JSON.parse(raw).user.sobrietyDate).toBe('2025-01-15');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/store/schema.test.js
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Implement schema.js**

Create `src/store/schema.js`:

```js
export const STORAGE_KEY = 'sweep-step';

export function getDefaultStore() {
  return {
    version: 1,
    user: {
      pronouns: null,
      higherPowerTerm: null,
      sobrietyDate: null,
      pinHash: null,
      onboardingComplete: false,
    },
    pim: {
      stage: 1,
      lastInteraction: null,
      dustLevel: 0,
    },
    inventories: {
      resentments: [],
      fears: [],
      sex: [],
      harms: [],
    },
    // Reserved for Layer 2
    // meetings: [],
    // gratitude: [],
    // phoneList: [],
    // dailyReflection: [],
    // Reserved for Layer 3
    // stepProgress: {},
    // promises: [],
  };
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStore();
    return JSON.parse(raw);
  } catch {
    return getDefaultStore();
  }
}

export function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/store/schema.test.js
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Create AppContext and useAppStore hook**

Create `src/store/AppContext.jsx`:

```jsx
import { createContext, useState, useCallback } from 'react';
import { loadStore, saveStore } from './schema';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [store, setStoreState] = useState(() => loadStore());

  const setStore = useCallback((updater) => {
    setStoreState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveStore(next);
      return next;
    });
  }, []);

  return (
    <AppContext.Provider value={{ store, setStore }}>
      {children}
    </AppContext.Provider>
  );
}
```

Create `src/hooks/useAppStore.js`:

```js
import { useContext } from 'react';
import { AppContext } from '../store/AppContext';

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/store/ src/hooks/useAppStore.js tests/store/schema.test.js
git commit -m "feat: localStorage schema v1 with AppContext provider"
```

---

## Task 3: PIN System

**Files:**
- Create: `src/store/pin.js`
- Create: `tests/store/pin.test.js`
- Create: `src/components/PinGate.jsx`
- Create: `tests/components/PinGate.test.jsx`

- [ ] **Step 1: Write failing tests for pin utilities**

Create `tests/store/pin.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { hashPin, verifyPin } from '../../src/store/pin';

describe('hashPin', () => {
  it('returns a string different from the input', () => {
    const hash = hashPin('1234');
    expect(hash).not.toBe('1234');
    expect(typeof hash).toBe('string');
  });

  it('returns the same hash for the same input', () => {
    expect(hashPin('5678')).toBe(hashPin('5678'));
  });

  it('returns different hashes for different inputs', () => {
    expect(hashPin('1234')).not.toBe(hashPin('5678'));
  });
});

describe('verifyPin', () => {
  it('returns true for matching pin', () => {
    const hash = hashPin('1234');
    expect(verifyPin('1234', hash)).toBe(true);
  });

  it('returns false for non-matching pin', () => {
    const hash = hashPin('1234');
    expect(verifyPin('9999', hash)).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/store/pin.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement pin.js**

Create `src/store/pin.js`:

```js
// Simple hash for local-only PIN. Not cryptographic — this is a local deterrent, not server auth.
export function hashPin(pin) {
  let hash = 0;
  const str = 'sweep-step-salt:' + pin;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(36);
}

export function verifyPin(pin, storedHash) {
  return hashPin(pin) === storedHash;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/store/pin.test.js
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Write failing tests for PinGate**

Create `tests/components/PinGate.test.jsx`:

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PinGate } from '../../src/components/PinGate';
import { hashPin } from '../../src/store/pin';

const mockStore = {
  user: { pinHash: hashPin('1234') },
};

const renderPinGate = (storeOverrides = {}) => {
  const store = { ...mockStore, ...storeOverrides };
  return render(
    <PinGate store={store}>
      <div>Protected Content</div>
    </PinGate>
  );
};

describe('PinGate', () => {
  it('shows PIN entry, not children, when locked', () => {
    renderPinGate();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText(/enter your pin/i)).toBeInTheDocument();
  });

  it('shows children after correct PIN', async () => {
    const user = userEvent.setup();
    renderPinGate();
    const input = screen.getByLabelText(/pin/i);
    await user.type(input, '1234');
    await user.click(screen.getByRole('button', { name: /unlock/i }));
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows error on wrong PIN', async () => {
    const user = userEvent.setup();
    renderPinGate();
    const input = screen.getByLabelText(/pin/i);
    await user.type(input, '9999');
    await user.click(screen.getByRole('button', { name: /unlock/i }));
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText(/incorrect/i)).toBeInTheDocument();
  });

  it('locks out after 5 failed attempts', async () => {
    const user = userEvent.setup();
    renderPinGate();
    const input = screen.getByLabelText(/pin/i);
    const btn = screen.getByRole('button', { name: /unlock/i });
    for (let i = 0; i < 5; i++) {
      await user.clear(input);
      await user.type(input, '9999');
      await user.click(btn);
    }
    expect(screen.getByText(/locked out/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run tests to verify they fail**

```bash
npx vitest run tests/components/PinGate.test.jsx
```

Expected: FAIL — module not found.

- [ ] **Step 7: Implement PinGate**

Create `src/components/PinGate.jsx`:

```jsx
import { useState, useEffect, useRef } from 'react';
import { verifyPin } from '../store/pin';

const LOCKOUT_SECONDS = 60;
const MAX_ATTEMPTS_LOCKOUT = 5;
const MAX_ATTEMPTS_WIPE = 10;

export function PinGate({ store, onWipe, children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutEnd, setLockoutEnd] = useState(null);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const inputRef = useRef(null);

  const isLockedOut = lockoutEnd && Date.now() < lockoutEnd;

  useEffect(() => {
    if (!lockoutEnd) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutEnd - Date.now()) / 1000));
      setLockoutRemaining(remaining);
      if (remaining <= 0) {
        setLockoutEnd(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutEnd]);

  useEffect(() => {
    if (!isLockedOut && !unlocked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLockedOut, unlocked]);

  if (unlocked) return children;

  if (showWipeConfirm) {
    return (
      <div className="min-h-dvh bg-cream flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-2xl text-oxblood mb-4">Final Warning</h1>
        <p className="text-ink mb-6">
          10 incorrect attempts. All data will be permanently erased.
        </p>
        <button
          className="bg-oxblood text-cream px-6 py-3 rounded-lg font-body text-lg mb-3"
          onClick={() => {
            if (onWipe) onWipe();
          }}
        >
          Erase Everything
        </button>
        <button
          className="text-ink underline"
          onClick={() => {
            setShowWipeConfirm(false);
            setAttempts(0);
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    if (verifyPin(pin, store.user.pinHash)) {
      setUnlocked(true);
      setAttempts(0);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setPin('');

    if (newAttempts >= MAX_ATTEMPTS_WIPE) {
      setShowWipeConfirm(true);
      return;
    }

    if (newAttempts >= MAX_ATTEMPTS_LOCKOUT) {
      setLockoutEnd(Date.now() + LOCKOUT_SECONDS * 1000);
    }
  };

  return (
    <div className="min-h-dvh bg-cream flex flex-col items-center justify-center p-6">
      <h1 className="font-display text-3xl text-ink mb-8">Sweep Step</h1>

      {isLockedOut ? (
        <div className="text-center">
          <p className="text-oxblood text-lg font-body" role="alert">
            Locked out. Try again in {lockoutRemaining}s.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <label htmlFor="pin-input" className="text-ink font-body text-lg">
            Enter your PIN
          </label>
          <input
            ref={inputRef}
            id="pin-input"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className="w-48 text-center text-2xl tracking-widest border-2 border-ink/20 rounded-lg p-3 bg-cream focus:border-violet focus:outline-none"
            aria-label="PIN"
            autoComplete="off"
          />
          {attempts > 0 && !isLockedOut && (
            <p className="text-oxblood text-sm" role="alert">
              Incorrect PIN. {MAX_ATTEMPTS_WIPE - attempts} attempts remaining.
            </p>
          )}
          <button
            type="submit"
            className="bg-ink text-cream px-8 py-3 rounded-lg font-body text-lg min-h-[44px]"
          >
            Unlock
          </button>
        </form>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Run PinGate tests**

```bash
npx vitest run tests/components/PinGate.test.jsx
```

Expected: All 4 tests PASS.

- [ ] **Step 9: Commit**

```bash
git add src/store/pin.js src/components/PinGate.jsx tests/store/pin.test.js tests/components/PinGate.test.jsx
git commit -m "feat: PIN lock system with hash, lockout, and wipe"
```

---

## Task 4: Date Utilities + Sobriety Milestones

**Files:**
- Create: `src/utils/dates.js`
- Create: `src/data/milestones.js`
- Create: `tests/utils/dates.test.js`
- Create: `src/components/SobrietyCounter.jsx`
- Create: `src/components/MilestoneChip.jsx`

- [ ] **Step 1: Write failing tests for date utilities**

Create `tests/utils/dates.test.js`:

```js
import { describe, it, expect, vi } from 'vitest';
import { daysSince, getCurrentMilestone, getEarnedMilestones } from '../../src/utils/dates';

describe('daysSince', () => {
  it('returns 0 for today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(daysSince(today)).toBe(0);
  });

  it('returns correct days for past date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-14'));
    expect(daysSince('2026-04-13')).toBe(1);
    expect(daysSince('2026-03-15')).toBe(30);
    vi.useRealTimers();
  });
});

describe('getCurrentMilestone', () => {
  it('returns 24 hours milestone for day 1', () => {
    const m = getCurrentMilestone(1);
    expect(m.label).toBe('24 Hours');
  });

  it('returns 30 days milestone for day 30', () => {
    const m = getCurrentMilestone(30);
    expect(m.label).toBe('30 Days');
  });

  it('returns 1 year milestone for day 365', () => {
    const m = getCurrentMilestone(365);
    expect(m.label).toBe('1 Year');
  });

  it('returns 2 years milestone for day 730', () => {
    const m = getCurrentMilestone(730);
    expect(m.label).toBe('2 Years');
  });

  it('returns null for day 0', () => {
    expect(getCurrentMilestone(0)).toBeNull();
  });

  it('returns null for day 2 (no milestone)', () => {
    expect(getCurrentMilestone(2)).toBeNull();
  });
});

describe('getEarnedMilestones', () => {
  it('returns all milestones up to current day count', () => {
    const earned = getEarnedMilestones(95);
    const labels = earned.map((m) => m.label);
    expect(labels).toContain('24 Hours');
    expect(labels).toContain('30 Days');
    expect(labels).toContain('60 Days');
    expect(labels).toContain('90 Days');
    expect(labels).not.toContain('6 Months');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/utils/dates.test.js
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Implement milestones data and date utilities**

Create `src/data/milestones.js`:

```js
export const MILESTONES = [
  { days: 1, label: '24 Hours' },
  { days: 30, label: '30 Days' },
  { days: 60, label: '60 Days' },
  { days: 90, label: '90 Days' },
  { days: 183, label: '6 Months' },
  { days: 274, label: '9 Months' },
  { days: 365, label: '1 Year' },
];

// After 1 year, milestones are yearly
export function getYearMilestone(days) {
  if (days < 365) return null;
  const years = Math.floor(days / 365);
  if (days === years * 365) {
    return { days: years * 365, label: `${years} Year${years > 1 ? 's' : ''}` };
  }
  return null;
}
```

Create `src/utils/dates.js`:

```js
import { MILESTONES, getYearMilestone } from '../data/milestones';

export function daysSince(dateString) {
  const start = new Date(dateString + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = today - start;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export function getCurrentMilestone(days) {
  // Check fixed milestones
  const fixed = MILESTONES.find((m) => m.days === days);
  if (fixed) return fixed;
  // Check yearly milestones (after first year)
  const yearly = getYearMilestone(days);
  if (yearly) return yearly;
  return null;
}

export function getEarnedMilestones(days) {
  const earned = MILESTONES.filter((m) => m.days <= days);
  // Add yearly milestones
  if (days >= 730) {
    for (let y = 2; y * 365 <= days; y++) {
      earned.push({ days: y * 365, label: `${y} Years` });
    }
  }
  return earned;
}

export function formatDate(dateString) {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/utils/dates.test.js
```

Expected: All 8 tests PASS.

- [ ] **Step 5: Implement SobrietyCounter and MilestoneChip**

Create `src/components/MilestoneChip.jsx`:

```jsx
export function MilestoneChip({ label }) {
  return (
    <span className="inline-block bg-ochre/20 text-ochre border border-ochre/40 rounded-full px-3 py-0.5 text-sm font-body font-medium">
      {label}
    </span>
  );
}
```

Create `src/components/SobrietyCounter.jsx`:

```jsx
import { useMemo } from 'react';
import { daysSince, getCurrentMilestone } from '../utils/dates';
import { MilestoneChip } from './MilestoneChip';

export function SobrietyCounter({ sobrietyDate, onTap }) {
  const days = useMemo(() => daysSince(sobrietyDate), [sobrietyDate]);
  const milestone = useMemo(() => getCurrentMilestone(days), [days]);

  return (
    <button
      onClick={onTap}
      className="flex items-center gap-2 min-h-[44px] px-3 py-1"
      aria-label={`${days} days sober. Tap to view milestones.`}
    >
      <span className="font-display text-xl text-ink">
        {days} <span className="text-base text-ink/60">day{days !== 1 ? 's' : ''}</span>
      </span>
      {milestone && <MilestoneChip label={milestone.label} />}
    </button>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/utils/dates.js src/data/milestones.js src/components/SobrietyCounter.jsx src/components/MilestoneChip.jsx tests/utils/dates.test.js
git commit -m "feat: sobriety counter with milestone chips"
```

---

## Task 5: Pim Stage Logic + Messages

**Files:**
- Create: `src/utils/pimStage.js`
- Create: `src/data/pimMessages.js`
- Create: `src/hooks/usePim.js`
- Create: `tests/utils/pimStage.test.js`

- [ ] **Step 1: Write failing tests for pimStage**

Create `tests/utils/pimStage.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { calcPimStage } from '../../src/utils/pimStage';

describe('calcPimStage', () => {
  it('returns stage 1 with no entries', () => {
    const inventories = { resentments: [], fears: [], sex: [], harms: [] };
    expect(calcPimStage(inventories)).toBe(1);
  });

  it('returns stage 2 with first entry in any section', () => {
    const inventories = { resentments: [{ id: '1' }], fears: [], sex: [], harms: [] };
    expect(calcPimStage(inventories)).toBe(2);
  });

  it('returns stage 3 with 10 total entries', () => {
    const entries = Array.from({ length: 10 }, (_, i) => ({ id: String(i) }));
    const inventories = { resentments: entries, fears: [], sex: [], harms: [] };
    expect(calcPimStage(inventories)).toBe(3);
  });

  it('returns stage 3 when one section is complete (has entries) even with < 10 total', () => {
    // "completing a full section" — for our purposes, having entries in all fields of at least 3 entries
    // But the spec says "completing any one full section" OR 10 total entries
    // We interpret "complete section" as having 3+ entries in one section
    const entries = Array.from({ length: 3 }, (_, i) => ({ id: String(i) }));
    const inventories = { resentments: entries, fears: [], sex: [], harms: [] };
    // 3 entries < 10, but one section has 3+ entries — stage 3
    expect(calcPimStage(inventories)).toBe(3);
  });

  it('returns stage 4 with all sections having entries and 25+ total', () => {
    const make = (n) => Array.from({ length: n }, (_, i) => ({ id: String(i) }));
    const inventories = { resentments: make(10), fears: make(7), sex: make(5), harms: make(4) };
    // 26 total, all sections have entries
    expect(calcPimStage(inventories)).toBe(4);
  });

  it('returns stage 3 not 4 when 25+ entries but not all sections filled', () => {
    const make = (n) => Array.from({ length: n }, (_, i) => ({ id: String(i) }));
    const inventories = { resentments: make(25), fears: [], sex: make(1), harms: [] };
    // 26 total but fears and harms empty
    expect(calcPimStage(inventories)).toBe(3);
  });

  it('caps at stage 4 for Layer 1', () => {
    const make = (n) => Array.from({ length: n }, (_, i) => ({ id: String(i) }));
    const inventories = { resentments: make(50), fears: make(50), sex: make(50), harms: make(50) };
    expect(calcPimStage(inventories)).toBe(4);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/utils/pimStage.test.js
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement pimStage.js**

Create `src/utils/pimStage.js`:

```js
const SECTION_COMPLETE_THRESHOLD = 3; // entries to consider a section "done" enough

export function calcPimStage(inventories) {
  const sections = ['resentments', 'fears', 'sex', 'harms'];
  const counts = sections.map((s) => inventories[s].length);
  const total = counts.reduce((a, b) => a + b, 0);
  const allSectionsFilled = counts.every((c) => c > 0);
  const anySectionComplete = counts.some((c) => c >= SECTION_COMPLETE_THRESHOLD);

  // Stage 4: all 4 sections have at least one entry AND 25+ total
  if (allSectionsFilled && total >= 25) return 4;

  // Stage 3: 10+ total OR one section "complete" (3+ entries)
  if (total >= 10 || anySectionComplete) return 3;

  // Stage 2: at least one entry anywhere
  if (total > 0) return 2;

  // Stage 1: no entries
  return 1;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/utils/pimStage.test.js
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Create Pim messages data**

Create `src/data/pimMessages.js`:

```js
export const PIM_TAP_MESSAGES = [
  'Pim is here.',
  'Pim sees you.',
  'Pim is patient.',
  'Pim doesn\'t judge.',
  'Just dust and time.',
  'Still here.',
  'Pim waits.',
  'One grain at a time.',
];

export const PIM_NEGLECT_MESSAGES = [
  null,                          // 0-2 days: no message
  'Pim\'s been waiting.',        // 3-6 days
  'Pim\'s been waiting.',        // 7-13 days
  'Pim\'s been waiting. No rush.', // 14+ days
];

export function getPimTapMessage(daysSinceLastAction) {
  if (daysSinceLastAction >= 3) {
    return 'Pim\'s been waiting.';
  }
  return PIM_TAP_MESSAGES[Math.floor(Math.random() * PIM_TAP_MESSAGES.length)];
}

export function getDustLevel(daysSinceLastAction) {
  if (daysSinceLastAction < 3) return 0;
  if (daysSinceLastAction < 7) return 1;
  if (daysSinceLastAction < 14) return 2;
  return 3;
}
```

- [ ] **Step 6: Create usePim hook**

Create `src/hooks/usePim.js`:

```js
import { useMemo, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { calcPimStage } from '../utils/pimStage';
import { getPimTapMessage, getDustLevel } from '../data/pimMessages';
import { daysSince } from '../utils/dates';

export function usePim() {
  const { store, setStore } = useAppStore();

  const stage = useMemo(() => calcPimStage(store.inventories), [store.inventories]);

  const daysSinceAction = useMemo(() => {
    if (!store.pim.lastInteraction) return 0;
    return daysSince(store.pim.lastInteraction);
  }, [store.pim.lastInteraction]);

  const dustLevel = useMemo(() => getDustLevel(daysSinceAction), [daysSinceAction]);

  const tapMessage = useMemo(() => getPimTapMessage(daysSinceAction), [daysSinceAction]);

  const recordAction = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setStore((prev) => ({
      ...prev,
      pim: {
        ...prev.pim,
        stage,
        lastInteraction: today,
        dustLevel: 0,
      },
    }));
  }, [setStore, stage]);

  return { stage, dustLevel, tapMessage, recordAction };
}
```

- [ ] **Step 7: Commit**

```bash
git add src/utils/pimStage.js src/data/pimMessages.js src/hooks/usePim.js tests/utils/pimStage.test.js
git commit -m "feat: Pim stage logic, messages, and usePim hook"
```

---

## Task 6: Onboarding Flow

**Files:**
- Create: `src/pages/Onboarding.jsx`
- Create: `tests/pages/Onboarding.test.jsx`

- [ ] **Step 1: Write failing test for onboarding**

Create `tests/pages/Onboarding.test.jsx`:

```jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Onboarding } from '../../src/pages/Onboarding';

describe('Onboarding', () => {
  let onComplete;

  beforeEach(() => {
    onComplete = vi.fn();
  });

  it('starts with the welcome screen', () => {
    render(<Onboarding onComplete={onComplete} />);
    expect(screen.getByText(/this is sweep step/i)).toBeInTheDocument();
  });

  it('progresses through all 6 steps', async () => {
    const user = userEvent.setup();
    render(<Onboarding onComplete={onComplete} />);

    // Step 1: Welcome — tap continue
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 2: Pronouns — skip or fill
    expect(screen.getByText(/pronouns/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 3: Higher Power
    expect(screen.getByText(/higher power/i)).toBeInTheDocument();
    await user.click(screen.getByLabelText(/the universe/i));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 4: Sobriety date
    expect(screen.getByText(/sobriety/i)).toBeInTheDocument();
    const dateInput = screen.getByLabelText(/date/i);
    await user.type(dateInput, '2025-01-15');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 5: PIN setup
    expect(screen.getByText(/pin/i)).toBeInTheDocument();
    const pinInput = screen.getByLabelText(/choose.*pin/i);
    await user.type(pinInput, '1234');
    const confirmInput = screen.getByLabelText(/confirm/i);
    await user.type(confirmInput, '1234');
    const checkbox = screen.getByLabelText(/i understand/i);
    await user.click(checkbox);
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 6: Meet Pim
    expect(screen.getByText(/this is pim/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /let.*begin|start|go/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
    const result = onComplete.mock.calls[0][0];
    expect(result.higherPowerTerm).toBe('The Universe');
    expect(result.sobrietyDate).toBe('2025-01-15');
    expect(result.pinHash).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/pages/Onboarding.test.jsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Onboarding.jsx**

Create `src/pages/Onboarding.jsx`:

```jsx
import { useState } from 'react';
import { hashPin } from '../store/pin';

const HP_OPTIONS = [
  'Higher Power',
  'God',
  'G.O.D. (Group Of Drunks)',
  'The Universe',
  'Nature',
  'The Group',
];

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [pronouns, setPronouns] = useState('');
  const [hpChoice, setHpChoice] = useState('');
  const [hpCustom, setHpCustom] = useState('');
  const [sobrietyDate, setSobrietyDate] = useState('');
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinUnderstood, setPinUnderstood] = useState(false);
  const [pinError, setPinError] = useState('');

  const next = () => setStep((s) => s + 1);

  const handlePinContinue = () => {
    if (pin.length < 4 || pin.length > 6) {
      setPinError('PIN must be 4 to 6 digits.');
      return;
    }
    if (pin !== pinConfirm) {
      setPinError('PINs do not match.');
      return;
    }
    if (!pinUnderstood) {
      setPinError('You must check the box to continue.');
      return;
    }
    setPinError('');
    next();
  };

  const handleFinish = () => {
    const term =
      hpChoice === 'custom' ? hpCustom : hpChoice === 'skip' ? null : hpChoice || null;
    onComplete({
      pronouns: pronouns || null,
      higherPowerTerm: term,
      sobrietyDate,
      pinHash: hashPin(pin),
    });
  };

  const screens = [
    // Step 0: Welcome
    <div key="welcome" className="flex flex-col items-center text-center gap-6">
      <h1 className="font-display text-4xl text-ink leading-tight">Sweep Step</h1>
      <p className="text-ink/80 text-lg max-w-xs">
        This is Sweep Step. It's yours. Nothing here leaves your phone.
      </p>
      <button onClick={next} className="bg-ink text-cream px-8 py-3 rounded-lg font-body text-lg min-h-[44px]">
        Continue
      </button>
    </div>,

    // Step 1: Pronouns
    <div key="pronouns" className="flex flex-col items-center text-center gap-6">
      <h2 className="font-display text-2xl text-ink">Pronouns</h2>
      <p className="text-ink/60 text-sm max-w-xs">Optional. Used in some messages.</p>
      <input
        type="text"
        value={pronouns}
        onChange={(e) => setPronouns(e.target.value)}
        placeholder="e.g. they/them, she/her"
        aria-label="Pronouns"
        className="w-64 border-2 border-ink/20 rounded-lg p-3 bg-cream text-center focus:border-violet focus:outline-none"
      />
      <button onClick={next} className="bg-ink text-cream px-8 py-3 rounded-lg font-body text-lg min-h-[44px]">
        Continue
      </button>
    </div>,

    // Step 2: Higher Power
    <div key="hp" className="flex flex-col items-center text-center gap-4">
      <h2 className="font-display text-2xl text-ink">Higher Power Language</h2>
      <p className="text-ink/60 text-sm max-w-xs">
        This word replaces "God" throughout the worksheets.
      </p>
      <fieldset className="flex flex-col gap-2 w-64 text-left">
        {HP_OPTIONS.map((opt) => (
          <label key={opt} className="flex items-center gap-2 min-h-[44px] cursor-pointer">
            <input
              type="radio"
              name="hp"
              value={opt}
              checked={hpChoice === opt}
              onChange={() => setHpChoice(opt)}
              className="w-5 h-5 accent-violet"
            />
            <span className="text-ink">{opt}</span>
          </label>
        ))}
        <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
          <input
            type="radio"
            name="hp"
            value="custom"
            checked={hpChoice === 'custom'}
            onChange={() => setHpChoice('custom')}
            className="w-5 h-5 accent-violet"
          />
          <span className="text-ink">My own word</span>
        </label>
        {hpChoice === 'custom' && (
          <input
            type="text"
            value={hpCustom}
            onChange={(e) => setHpCustom(e.target.value)}
            placeholder="Your word"
            className="border-2 border-ink/20 rounded-lg p-2 bg-cream focus:border-violet focus:outline-none ml-7"
          />
        )}
        <label className="flex items-center gap-2 min-h-[44px] cursor-pointer">
          <input
            type="radio"
            name="hp"
            value="skip"
            checked={hpChoice === 'skip'}
            onChange={() => setHpChoice('skip')}
            className="w-5 h-5 accent-violet"
          />
          <span className="text-ink/60">Skip</span>
        </label>
      </fieldset>
      <button onClick={next} className="bg-ink text-cream px-8 py-3 rounded-lg font-body text-lg min-h-[44px]">
        Continue
      </button>
    </div>,

    // Step 3: Sobriety Date
    <div key="sobriety" className="flex flex-col items-center text-center gap-6">
      <h2 className="font-display text-2xl text-ink">Sobriety Date</h2>
      <p className="text-ink/60 text-sm max-w-xs">When did your current journey begin?</p>
      <input
        type="date"
        value={sobrietyDate}
        onChange={(e) => setSobrietyDate(e.target.value)}
        aria-label="Sobriety date"
        max={new Date().toISOString().split('T')[0]}
        className="border-2 border-ink/20 rounded-lg p-3 bg-cream focus:border-violet focus:outline-none"
      />
      <button
        onClick={next}
        disabled={!sobrietyDate}
        className="bg-ink text-cream px-8 py-3 rounded-lg font-body text-lg min-h-[44px] disabled:opacity-40"
      >
        Continue
      </button>
    </div>,

    // Step 4: PIN Setup
    <div key="pin" className="flex flex-col items-center text-center gap-4 max-w-xs">
      <h2 className="font-display text-2xl text-ink">Set Your PIN</h2>
      <div className="bg-oxblood/10 border border-oxblood/30 rounded-lg p-4 text-left text-sm text-ink">
        <p className="font-bold text-oxblood mb-2">There is no recovery for this PIN.</p>
        <p>
          If you forget it, your data is gone. We cannot reset it. This is the cost of true
          privacy. Write it down somewhere safe.
        </p>
      </div>
      <label className="w-full text-left">
        <span className="text-sm text-ink/60 ml-1">Choose a PIN (4-6 digits)</span>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          aria-label="Choose a PIN"
          className="w-full border-2 border-ink/20 rounded-lg p-3 bg-cream text-center text-xl tracking-widest mt-1 focus:border-violet focus:outline-none"
        />
      </label>
      <label className="w-full text-left">
        <span className="text-sm text-ink/60 ml-1">Confirm PIN</span>
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={pinConfirm}
          onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
          aria-label="Confirm PIN"
          className="w-full border-2 border-ink/20 rounded-lg p-3 bg-cream text-center text-xl tracking-widest mt-1 focus:border-violet focus:outline-none"
        />
      </label>
      <label className="flex items-start gap-2 text-left cursor-pointer min-h-[44px]">
        <input
          type="checkbox"
          checked={pinUnderstood}
          onChange={(e) => setPinUnderstood(e.target.checked)}
          className="mt-1 w-5 h-5 accent-violet"
        />
        <span className="text-sm text-ink">I understand there is no way to recover my PIN</span>
      </label>
      {pinError && <p className="text-oxblood text-sm">{pinError}</p>}
      <button
        onClick={handlePinContinue}
        className="bg-ink text-cream px-8 py-3 rounded-lg font-body text-lg min-h-[44px]"
      >
        Continue
      </button>
    </div>,

    // Step 5: Meet Pim
    <div key="pim" className="flex flex-col items-center text-center gap-6">
      <h2 className="font-display text-2xl text-ink">Meet Pim</h2>
      {/* Pim dust pile placeholder — replaced with real SVG in Task 9 */}
      <div className="w-24 h-24 bg-ink/10 rounded-full flex items-center justify-center">
        <span className="text-4xl text-ink/30">⋅⋅⋅</span>
      </div>
      <p className="text-ink/80 text-lg max-w-xs leading-relaxed">
        This is Pim. Pim is dust right now. So were you, once. As you do the work, Pim becomes
        more. Pim never dies. Pim never judges. Pim just waits.
      </p>
      <button
        onClick={handleFinish}
        className="bg-ink text-cream px-8 py-3 rounded-lg font-body text-lg min-h-[44px]"
      >
        Let's begin
      </button>
    </div>,
  ];

  return (
    <div className="min-h-dvh bg-cream flex flex-col items-center justify-center p-6">
      {screens[step]}
    </div>
  );
}
```

- [ ] **Step 4: Run onboarding tests**

```bash
npx vitest run tests/pages/Onboarding.test.jsx
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Onboarding.jsx tests/pages/Onboarding.test.jsx
git commit -m "feat: 6-step onboarding flow with pronouns, HP, sobriety date, PIN"
```

---

## Task 7: Guidance Text for All 4 Inventories

**Files:**
- Create: `src/data/guidance.js`

- [ ] **Step 1: Create guidance.js with original + modern versions for all 4 inventories**

Create `src/data/guidance.js`:

```js
// Each section has `original` (AA worksheet voice) and `modern` (inclusive rewrite).
// The `modern` text uses {{HP}} as a placeholder for the user's Higher Power term.
// When HP is null/skipped, replace {{HP}} with "something larger than yourself".

export const GUIDANCE = {
  resentments: {
    original:
      'In dealing with resentments, we set them on paper. We listed people, institutions, or principles with whom we were angry. We asked ourselves why we were angry. In most cases it was found that our self-esteem, our pocketbooks, our ambitions, our personal relationships (including sex) were hurt or threatened. We were usually as much at fault as anyone else. We turned back to the list, for it held the key to the future. We were prepared to look at it from an entirely different angle. We began to see that the world and its people really dominated us. In that state, the wrong-doing of others, fancied or real, had power to actually kill. We asked God to help us show them the same tolerance, pity, and patience that we would cheerfully grant a sick friend.',
    modern:
      'Resentments are heavy. They take up room. This section is about getting them out of your head and onto paper so you can see them clearly.\n\nList the people, places, groups, or ideas you carry anger toward. Then ask: what part of you feels threatened? Your sense of self, your security, your relationships, your pride, your wallet, your plans.\n\nThis is not about who was right. It\'s about what you\'re carrying and why it still has a hold on you.\n\nWhen you\'re ready, look at your own part. Not to excuse anyone else, but to find where you have leverage to let go. Ask {{HP}} — or just ask yourself honestly — to help you see these people the way you\'d see someone who was sick. Not to forgive on command. Just to loosen the grip.',
  },
  fears: {
    original:
      'We reviewed our fears thoroughly. We put them on paper, even though we had no resentment in connection with them. We asked ourselves why we had them. Wasn\'t it because self-reliance had failed us? Self-reliance was good as far as it went, but it didn\'t go far enough. We asked God to remove our fear and direct our attention to what He would have us be.',
    modern:
      'Fear is not weakness. It\'s information.\n\nWrite down what you\'re afraid of. All of it. The rational and the irrational. The ones you talk about and the ones you don\'t.\n\nThen ask: where did this fear come from? Often fear is rooted in the belief that you have to handle everything alone, and the quiet panic that you can\'t.\n\nSelf-reliance isn\'t the problem. White-knuckling it is. The question here is: what if you didn\'t have to carry this alone?\n\nAsk {{HP}} — or just the honest part of yourself — to help you redirect your energy from the fear to what you could become without it.',
  },
  sex: {
    original:
      'We reviewed our own conduct over the years past. Where had we been selfish, dishonest, or inconsiderate? Whom had we hurt? Did we unjustifiably arouse jealousy, suspicion, or bitterness? Where were we at fault, what should we have done instead? We subjected each relation to this test — was it selfish or not?',
    modern:
      'This section is about your sexual and romantic conduct. Not about shame. Not about who you\'ve loved or how you\'ve loved. It\'s about where your behavior caused harm.\n\nThink about the people you\'ve been involved with. Were you honest? Were you considerate of their feelings? Did you create situations — jealousy, suspicion, manipulation — that hurt someone?\n\nThis applies equally regardless of your orientation, gender, or relationship structure. Harm is harm, whether in a marriage, a hookup, a throuple, or a situationship.\n\nThe goal is to see your patterns clearly. Not to catalog guilt. Ask: what did I actually do, and what should I have done instead? That\'s the whole question.',
  },
  harms: {
    original:
      'We made a list of all persons we had harmed, and became willing to make amends to them all. We considered carefully those we had hurt, the harm done, and the amends to be made.',
    modern:
      'This is the harms list. It will become your amends list later, but right now it\'s just about honesty.\n\nWho did you hurt? What did you do? How did it affect them? And what do you owe — not as punishment, but as repair?\n\nSome amends are direct: a conversation, a repayment, a changed behavior. Some are indirect: living differently, donating time, making it right through someone else. Some people on this list you may never contact, and that\'s okay. The willingness is what matters first.\n\nDon\'t edit the list to protect your ego. If a name comes up, write it down. You\'ll figure out the how later.',
  },
};

export function insertHP(text, term) {
  const replacement = term || 'something larger than yourself';
  return text.replace(/\{\{HP\}\}/g, replacement);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/guidance.js
git commit -m "feat: guidance text for all 4 inventories (original + inclusive modern)"
```

---

## Task 8: GuidanceBox + Inventory Components

**Files:**
- Create: `src/components/GuidanceBox.jsx`
- Create: `src/components/InventoryEntryForm.jsx`
- Create: `src/components/InventoryEntryList.jsx`
- Create: `tests/components/GuidanceBox.test.jsx`

- [ ] **Step 1: Write failing test for GuidanceBox**

Create `tests/components/GuidanceBox.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuidanceBox } from '../../src/components/GuidanceBox';

describe('GuidanceBox', () => {
  it('shows original guidance by default', () => {
    render(<GuidanceBox original="Original text here" modern="Modern text here" />);
    expect(screen.getByText('Original text here')).toBeInTheDocument();
    expect(screen.queryByText('Modern text here')).not.toBeInTheDocument();
  });

  it('shows modern guidance when Learn more is tapped', async () => {
    const user = userEvent.setup();
    render(<GuidanceBox original="Original text here" modern="Modern text here" />);
    await user.click(screen.getByText(/learn more/i));
    expect(screen.getByText('Modern text here')).toBeInTheDocument();
  });

  it('hides modern guidance when toggled back', async () => {
    const user = userEvent.setup();
    render(<GuidanceBox original="Original text here" modern="Modern text here" />);
    await user.click(screen.getByText(/learn more/i));
    await user.click(screen.getByText(/show less/i));
    expect(screen.queryByText('Modern text here')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/components/GuidanceBox.test.jsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement GuidanceBox**

Create `src/components/GuidanceBox.jsx`:

```jsx
import { useState } from 'react';

export function GuidanceBox({ original, modern }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-6">
      <div className="bg-ochre/10 border border-ochre/30 rounded-lg p-4 text-sm text-ink/80 leading-relaxed whitespace-pre-line">
        {original}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-violet text-sm mt-2 underline min-h-[44px] px-1"
      >
        {expanded ? 'Show less' : 'Learn more'}
      </button>
      {expanded && (
        <div className="bg-violet/5 border border-violet/20 rounded-lg p-4 mt-2 text-sm text-ink/80 leading-relaxed whitespace-pre-line">
          {modern}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run GuidanceBox tests**

```bash
npx vitest run tests/components/GuidanceBox.test.jsx
```

Expected: All 3 tests PASS.

- [ ] **Step 5: Implement InventoryEntryForm**

Create `src/components/InventoryEntryForm.jsx`:

```jsx
import { useState } from 'react';

export function InventoryEntryForm({ fields, onSave, editingEntry, onCancelEdit }) {
  const getInitial = () => {
    if (editingEntry) return { ...editingEntry };
    const initial = {};
    fields.forEach((f) => {
      if (f.type === 'checkboxes') {
        initial[f.key] = [];
      } else {
        initial[f.key] = '';
      }
    });
    return initial;
  };

  const [values, setValues] = useState(getInitial);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = (key, option, checked) => {
    setValues((prev) => {
      const current = prev[key] || [];
      const next = checked ? [...current, option] : current.filter((o) => o !== option);
      return { ...prev, [key]: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...values,
      id: editingEntry?.id || crypto.randomUUID(),
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setValues(getInitial());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-ink/70 mb-1">{field.label}</label>
          {field.type === 'text' && (
            <input
              type="text"
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border-2 border-ink/15 rounded-lg p-3 bg-cream text-ink text-lg focus:border-violet focus:outline-none"
              placeholder={field.placeholder || ''}
            />
          )}
          {field.type === 'textarea' && (
            <textarea
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              rows={3}
              className="w-full border-2 border-ink/15 rounded-lg p-3 bg-cream text-ink text-lg focus:border-violet focus:outline-none resize-y"
              placeholder={field.placeholder || ''}
            />
          )}
          {field.type === 'checkboxes' && (
            <div className="space-y-1">
              {field.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 min-h-[44px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(values[field.key] || []).includes(opt)}
                    onChange={(e) => handleCheckbox(field.key, opt, e.target.checked)}
                    className="w-5 h-5 accent-violet"
                  />
                  <span className="text-ink">{opt}</span>
                </label>
              ))}
              {field.hasOther && (
                <input
                  type="text"
                  value={values[field.key + '_other'] || ''}
                  onChange={(e) => handleChange(field.key + '_other', e.target.value)}
                  placeholder="Other..."
                  className="w-full border-2 border-ink/15 rounded-lg p-2 bg-cream text-ink mt-1 focus:border-violet focus:outline-none"
                />
              )}
            </div>
          )}
          {field.type === 'select' && (
            <select
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border-2 border-ink/15 rounded-lg p-3 bg-cream text-ink focus:border-violet focus:outline-none"
            >
              <option value="">Select...</option>
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-ink text-cream px-6 py-3 rounded-lg font-body min-h-[44px] flex-1"
        >
          {editingEntry ? 'Update Entry' : 'Add Entry'}
        </button>
        {editingEntry && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="border-2 border-ink/20 text-ink px-4 py-3 rounded-lg font-body min-h-[44px]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
```

- [ ] **Step 6: Implement InventoryEntryList**

Create `src/components/InventoryEntryList.jsx`:

```jsx
import { useState } from 'react';

export function InventoryEntryList({ entries, fields, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-ink/60">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</h3>
      {entries.map((entry, index) => (
        <div key={entry.id} className="border border-ink/10 rounded-lg p-4 bg-cream">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-ink/40 font-body">#{index + 1}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(entry)}
                className="text-violet text-sm underline min-h-[44px] px-2"
              >
                Edit
              </button>
              {confirmDelete === entry.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      onDelete(entry.id);
                      setConfirmDelete(null);
                    }}
                    className="text-oxblood text-sm font-bold min-h-[44px] px-2"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="text-ink/40 text-sm min-h-[44px] px-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(entry.id)}
                  className="text-oxblood text-sm underline min-h-[44px] px-2"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
          <div className="space-y-1 text-sm">
            {fields.map((field) => {
              const val = entry[field.key];
              if (!val || (Array.isArray(val) && val.length === 0)) return null;
              return (
                <div key={field.key}>
                  <span className="text-ink/50">{field.label}: </span>
                  <span className="text-ink">
                    {Array.isArray(val) ? val.join(', ') : val}
                    {entry[field.key + '_other'] ? `, ${entry[field.key + '_other']}` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/GuidanceBox.jsx src/components/InventoryEntryForm.jsx src/components/InventoryEntryList.jsx tests/components/GuidanceBox.test.jsx
git commit -m "feat: GuidanceBox, InventoryEntryForm, and InventoryEntryList components"
```

---

## Task 9: Inventory Pages (Resentments, Fears, Sex, Harms)

**Files:**
- Create: `src/pages/Resentments.jsx`
- Create: `src/pages/Fears.jsx`
- Create: `src/pages/SexInventory.jsx`
- Create: `src/pages/Harms.jsx`

- [ ] **Step 1: Implement Resentments page**

Create `src/pages/Resentments.jsx`:

```jsx
import { useState, useCallback } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { usePim } from '../hooks/usePim';
import { GuidanceBox } from '../components/GuidanceBox';
import { InventoryEntryForm } from '../components/InventoryEntryForm';
import { InventoryEntryList } from '../components/InventoryEntryList';
import { GUIDANCE, insertHP } from '../data/guidance';
import { Link } from 'react-router-dom';

const FIELDS = [
  { key: 'resentfulAt', label: "I'm resentful at...", type: 'text', placeholder: 'Person, institution, or principle' },
  { key: 'cause', label: 'The cause', type: 'textarea', placeholder: 'What happened?' },
  {
    key: 'affects',
    label: 'Affects my...',
    type: 'checkboxes',
    options: ['Self-esteem', 'Pride', 'Ambitions', 'Personal relations', 'Sex relations', 'Pocketbook', 'Security'],
    hasOther: true,
  },
  {
    key: 'myPart',
    label: 'My part (where was I...)',
    type: 'checkboxes',
    options: ['Selfish', 'Dishonest', 'Self-seeking', 'Frightened'],
    hasOther: true,
  },
];

export function Resentments() {
  const { store, setStore } = useAppStore();
  const { recordAction } = usePim();
  const [editing, setEditing] = useState(null);
  const entries = store.inventories.resentments;
  const hpTerm = store.user.higherPowerTerm;

  const handleSave = useCallback(
    (entry) => {
      setStore((prev) => {
        const list = prev.inventories.resentments;
        const existing = list.findIndex((e) => e.id === entry.id);
        const updated = existing >= 0
          ? list.map((e) => (e.id === entry.id ? entry : e))
          : [...list, entry];
        return {
          ...prev,
          inventories: { ...prev.inventories, resentments: updated },
        };
      });
      recordAction();
      setEditing(null);
    },
    [setStore, recordAction]
  );

  const handleDelete = useCallback(
    (id) => {
      setStore((prev) => ({
        ...prev,
        inventories: {
          ...prev.inventories,
          resentments: prev.inventories.resentments.filter((e) => e.id !== id),
        },
      }));
    },
    [setStore]
  );

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Resentments</h1>
      </div>
      <GuidanceBox
        original={GUIDANCE.resentments.original}
        modern={insertHP(GUIDANCE.resentments.modern, hpTerm)}
      />
      <InventoryEntryForm
        fields={FIELDS}
        onSave={handleSave}
        editingEntry={editing}
        onCancelEdit={() => setEditing(null)}
      />
      <InventoryEntryList
        entries={entries}
        fields={FIELDS}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

- [ ] **Step 2: Implement Fears page**

Create `src/pages/Fears.jsx`:

```jsx
import { useState, useCallback } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { usePim } from '../hooks/usePim';
import { GuidanceBox } from '../components/GuidanceBox';
import { InventoryEntryForm } from '../components/InventoryEntryForm';
import { InventoryEntryList } from '../components/InventoryEntryList';
import { GUIDANCE, insertHP } from '../data/guidance';
import { Link } from 'react-router-dom';

const FIELDS = [
  { key: 'fear', label: "What I'm afraid of", type: 'text', placeholder: 'The fear' },
  { key: 'why', label: 'Why I have this fear', type: 'textarea', placeholder: 'Where does this come from?' },
  { key: 'selfCause', label: 'What part of self caused the fear', type: 'textarea', placeholder: 'Self-reliance failed me how?' },
  { key: 'hpDirection', label: 'What would {{HP}} have me do instead', type: 'textarea', placeholder: 'A different direction' },
];

export function Fears() {
  const { store, setStore } = useAppStore();
  const { recordAction } = usePim();
  const [editing, setEditing] = useState(null);
  const entries = store.inventories.fears;
  const hpTerm = store.user.higherPowerTerm;

  const fieldsWithHP = FIELDS.map((f) => ({
    ...f,
    label: insertHP(f.label, hpTerm),
  }));

  const handleSave = useCallback(
    (entry) => {
      setStore((prev) => {
        const list = prev.inventories.fears;
        const existing = list.findIndex((e) => e.id === entry.id);
        const updated = existing >= 0
          ? list.map((e) => (e.id === entry.id ? entry : e))
          : [...list, entry];
        return { ...prev, inventories: { ...prev.inventories, fears: updated } };
      });
      recordAction();
      setEditing(null);
    },
    [setStore, recordAction]
  );

  const handleDelete = useCallback(
    (id) => {
      setStore((prev) => ({
        ...prev,
        inventories: { ...prev.inventories, fears: prev.inventories.fears.filter((e) => e.id !== id) },
      }));
    },
    [setStore]
  );

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Fears</h1>
      </div>
      <GuidanceBox
        original={GUIDANCE.fears.original}
        modern={insertHP(GUIDANCE.fears.modern, hpTerm)}
      />
      <InventoryEntryForm
        fields={fieldsWithHP}
        onSave={handleSave}
        editingEntry={editing}
        onCancelEdit={() => setEditing(null)}
      />
      <InventoryEntryList
        entries={entries}
        fields={fieldsWithHP}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

- [ ] **Step 3: Implement SexInventory page**

Create `src/pages/SexInventory.jsx`:

```jsx
import { useState, useCallback } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { usePim } from '../hooks/usePim';
import { GuidanceBox } from '../components/GuidanceBox';
import { InventoryEntryForm } from '../components/InventoryEntryForm';
import { InventoryEntryList } from '../components/InventoryEntryList';
import { GUIDANCE, insertHP } from '../data/guidance';
import { Link } from 'react-router-dom';

const FIELDS = [
  { key: 'whom', label: 'Whom did I harm', type: 'text', placeholder: 'Person' },
  { key: 'whatIDid', label: 'What did I do', type: 'textarea', placeholder: 'What happened' },
  { key: 'aroused', label: 'Did I unjustifiably arouse jealousy, suspicion, bitterness', type: 'textarea', placeholder: 'Be honest' },
  { key: 'myFault', label: 'Where was I at fault', type: 'textarea', placeholder: 'My part' },
  { key: 'shouldHaveDone', label: 'What should I have done instead', type: 'textarea', placeholder: 'The better path' },
];

export function SexInventory() {
  const { store, setStore } = useAppStore();
  const { recordAction } = usePim();
  const [editing, setEditing] = useState(null);
  const entries = store.inventories.sex;
  const hpTerm = store.user.higherPowerTerm;

  const handleSave = useCallback(
    (entry) => {
      setStore((prev) => {
        const list = prev.inventories.sex;
        const existing = list.findIndex((e) => e.id === entry.id);
        const updated = existing >= 0
          ? list.map((e) => (e.id === entry.id ? entry : e))
          : [...list, entry];
        return { ...prev, inventories: { ...prev.inventories, sex: updated } };
      });
      recordAction();
      setEditing(null);
    },
    [setStore, recordAction]
  );

  const handleDelete = useCallback(
    (id) => {
      setStore((prev) => ({
        ...prev,
        inventories: { ...prev.inventories, sex: prev.inventories.sex.filter((e) => e.id !== id) },
      }));
    },
    [setStore]
  );

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Sex Inventory</h1>
      </div>
      <GuidanceBox
        original={GUIDANCE.sex.original}
        modern={insertHP(GUIDANCE.sex.modern, hpTerm)}
      />
      <InventoryEntryForm
        fields={FIELDS}
        onSave={handleSave}
        editingEntry={editing}
        onCancelEdit={() => setEditing(null)}
      />
      <InventoryEntryList
        entries={entries}
        fields={FIELDS}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

- [ ] **Step 4: Implement Harms page**

Create `src/pages/Harms.jsx`:

```jsx
import { useState, useCallback } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { usePim } from '../hooks/usePim';
import { GuidanceBox } from '../components/GuidanceBox';
import { InventoryEntryForm } from '../components/InventoryEntryForm';
import { InventoryEntryList } from '../components/InventoryEntryList';
import { GUIDANCE, insertHP } from '../data/guidance';
import { Link } from 'react-router-dom';

const FIELDS = [
  { key: 'person', label: 'Person or entity harmed', type: 'text', placeholder: 'Who' },
  { key: 'whatIDid', label: 'What I did', type: 'textarea', placeholder: 'What happened' },
  { key: 'howAffected', label: 'How it affected them', type: 'textarea', placeholder: 'The impact' },
  {
    key: 'amendsType',
    label: 'What I owe (amends type)',
    type: 'select',
    options: ['Direct', 'Indirect', 'Living'],
  },
];

export function Harms() {
  const { store, setStore } = useAppStore();
  const { recordAction } = usePim();
  const [editing, setEditing] = useState(null);
  const entries = store.inventories.harms;
  const hpTerm = store.user.higherPowerTerm;

  const handleSave = useCallback(
    (entry) => {
      setStore((prev) => {
        const list = prev.inventories.harms;
        const existing = list.findIndex((e) => e.id === entry.id);
        const updated = existing >= 0
          ? list.map((e) => (e.id === entry.id ? entry : e))
          : [...list, entry];
        return { ...prev, inventories: { ...prev.inventories, harms: updated } };
      });
      recordAction();
      setEditing(null);
    },
    [setStore, recordAction]
  );

  const handleDelete = useCallback(
    (id) => {
      setStore((prev) => ({
        ...prev,
        inventories: { ...prev.inventories, harms: prev.inventories.harms.filter((e) => e.id !== id) },
      }));
    },
    [setStore]
  );

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Harms</h1>
      </div>
      <GuidanceBox
        original={GUIDANCE.harms.original}
        modern={insertHP(GUIDANCE.harms.modern, hpTerm)}
      />
      <InventoryEntryForm
        fields={FIELDS}
        onSave={handleSave}
        editingEntry={editing}
        onCancelEdit={() => setEditing(null)}
      />
      <InventoryEntryList
        entries={entries}
        fields={FIELDS}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/pages/Resentments.jsx src/pages/Fears.jsx src/pages/SexInventory.jsx src/pages/Harms.jsx
git commit -m "feat: all 4 inventory pages with guidance, forms, and entry lists"
```

---

## Task 10: Pim Visual Component

**Files:**
- Create: `src/components/Pim.jsx`
- Create: `src/components/PimDust.jsx`

- [ ] **Step 1: Implement PimDust (ambient dust particles)**

Create `src/components/PimDust.jsx`:

```jsx
export function PimDust({ level }) {
  if (level === 0) return null;

  // More particles at higher dust levels
  const particleCount = level * 4;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        const size = 2 + Math.random() * 3;
        const left = 10 + Math.random() * 80;
        const bottom = Math.random() * 30;
        const delay = Math.random() * 4;
        const duration = 3 + Math.random() * 3;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-ink/15"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: `${bottom}%`,
              animation: `pimDustFloat ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes pimDustFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-8px) scale(1.1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Implement Pim visual component with 4 stages**

Create `src/components/Pim.jsx`:

```jsx
import { useState } from 'react';
import { PimDust } from './PimDust';

function PimStage1() {
  // Pile of dust — irregular, organic blobs
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32" aria-label="Pim, a small pile of dust">
      <g className="animate-pim-breathe">
        {/* Main dust pile */}
        <ellipse cx="60" cy="85" rx="35" ry="12" fill="#8B7E6A" opacity="0.6" />
        <ellipse cx="55" cy="80" rx="25" ry="10" fill="#9B8E7A" opacity="0.7" />
        <ellipse cx="65" cy="78" rx="18" ry="8" fill="#A89B87" opacity="0.8" />
        {/* Scattered dust particles */}
        <circle cx="35" cy="88" r="3" fill="#8B7E6A" opacity="0.4" />
        <circle cx="85" cy="86" r="2" fill="#8B7E6A" opacity="0.3" />
        <circle cx="48" cy="75" r="2" fill="#A89B87" opacity="0.5" />
      </g>
      <style>{`
        .animate-pim-breathe {
          animation: pimBreathe 4s ease-in-out infinite;
          transform-origin: center 80%;
        }
        @keyframes pimBreathe {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.03) scaleX(0.98); }
        }
      `}</style>
    </svg>
  );
}

function PimStage2() {
  // Dust with two small eyes
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32" aria-label="Pim, dust with small eyes peeking out">
      <g className="animate-pim-breathe">
        <ellipse cx="60" cy="85" rx="35" ry="12" fill="#8B7E6A" opacity="0.6" />
        <ellipse cx="55" cy="78" rx="28" ry="12" fill="#9B8E7A" opacity="0.7" />
        <ellipse cx="65" cy="75" rx="20" ry="10" fill="#A89B87" opacity="0.8" />
        {/* Eyes */}
        <circle cx="52" cy="72" r="3.5" fill="#1A1A1A" />
        <circle cx="68" cy="72" r="3.5" fill="#1A1A1A" />
        <circle cx="53" cy="71" r="1" fill="#F5F1E8" />
        <circle cx="69" cy="71" r="1" fill="#F5F1E8" />
      </g>
      <style>{`
        .animate-pim-breathe {
          animation: pimBreathe 4s ease-in-out infinite;
          transform-origin: center 80%;
        }
        @keyframes pimBreathe {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.03) scaleX(0.98); }
        }
      `}</style>
    </svg>
  );
}

function PimStage3() {
  // Dust bunny with a broom bristle
  return (
    <svg viewBox="0 0 120 120" className="w-32 h-32" aria-label="Pim, a dust bunny with a broom bristle">
      <g className="animate-pim-breathe">
        {/* Body — fluffier */}
        <ellipse cx="60" cy="82" rx="30" ry="18" fill="#9B8E7A" opacity="0.8" />
        <ellipse cx="55" cy="75" rx="22" ry="15" fill="#A89B87" opacity="0.9" />
        <ellipse cx="65" cy="73" rx="18" ry="13" fill="#B5A897" />
        {/* Fuzzy edges */}
        <circle cx="38" cy="80" r="5" fill="#9B8E7A" opacity="0.6" />
        <circle cx="82" cy="82" r="4" fill="#9B8E7A" opacity="0.5" />
        <circle cx="45" cy="68" r="4" fill="#A89B87" opacity="0.6" />
        {/* Eyes */}
        <circle cx="52" cy="70" r="4" fill="#1A1A1A" />
        <circle cx="68" cy="70" r="4" fill="#1A1A1A" />
        <circle cx="53" cy="69" r="1.2" fill="#F5F1E8" />
        <circle cx="69" cy="69" r="1.2" fill="#F5F1E8" />
        {/* Broom bristle sticking out */}
        <line x1="78" y1="65" x2="90" y2="45" stroke="#D4A52A" strokeWidth="2" strokeLinecap="round" />
        <line x1="88" y1="47" x2="93" y2="40" stroke="#D4A52A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="90" y1="45" x2="96" y2="42" stroke="#D4A52A" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <style>{`
        .animate-pim-breathe {
          animation: pimBreathe 4s ease-in-out infinite;
          transform-origin: center 80%;
        }
        @keyframes pimBreathe {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.04) scaleX(0.97); }
        }
      `}</style>
    </svg>
  );
}

function PimStage4() {
  // Fuzzy creature holding a tiny broom
  return (
    <svg viewBox="0 0 120 120" className="w-36 h-36" aria-label="Pim, a fuzzy creature holding a tiny broom">
      <g className="animate-pim-breathe">
        {/* Body */}
        <ellipse cx="55" cy="78" rx="28" ry="25" fill="#B5A897" />
        <ellipse cx="55" cy="70" rx="22" ry="20" fill="#C4B7A5" />
        {/* Fuzzy texture */}
        <circle cx="35" cy="75" r="6" fill="#B5A897" opacity="0.7" />
        <circle cx="75" cy="78" r="5" fill="#B5A897" opacity="0.6" />
        <circle cx="40" cy="60" r="5" fill="#C4B7A5" opacity="0.7" />
        <circle cx="70" cy="62" r="4" fill="#C4B7A5" opacity="0.6" />
        {/* Eyes — bigger, friendlier */}
        <circle cx="46" cy="65" r="5" fill="#1A1A1A" />
        <circle cx="64" cy="65" r="5" fill="#1A1A1A" />
        <circle cx="47.5" cy="63.5" r="1.8" fill="#F5F1E8" />
        <circle cx="65.5" cy="63.5" r="1.8" fill="#F5F1E8" />
        {/* Tiny smile */}
        <path d="M 48 74 Q 55 78 62 74" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Arm stub holding broom */}
        <ellipse cx="80" cy="72" rx="6" ry="4" fill="#B5A897" />
        {/* Broom handle */}
        <line x1="83" y1="72" x2="100" y2="45" stroke="#8B7E6A" strokeWidth="2.5" strokeLinecap="round" />
        {/* Broom head */}
        <rect x="93" y="35" width="14" height="12" rx="2" fill="#D4A52A" />
        <line x1="95" y1="37" x2="95" y2="45" stroke="#C49A1A" strokeWidth="1" />
        <line x1="98" y1="37" x2="98" y2="45" stroke="#C49A1A" strokeWidth="1" />
        <line x1="101" y1="37" x2="101" y2="45" stroke="#C49A1A" strokeWidth="1" />
        <line x1="104" y1="37" x2="104" y2="45" stroke="#C49A1A" strokeWidth="1" />
      </g>
      <style>{`
        .animate-pim-breathe {
          animation: pimBreathe 4s ease-in-out infinite;
          transform-origin: center 80%;
        }
        @keyframes pimBreathe {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.04) scaleX(0.97); }
        }
      `}</style>
    </svg>
  );
}

const STAGE_COMPONENTS = [null, PimStage1, PimStage2, PimStage3, PimStage4];

export function Pim({ stage, dustLevel, onTap, tapMessage }) {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  const StageComponent = STAGE_COMPONENTS[Math.min(stage, 4)] || PimStage1;

  const handleTap = () => {
    setCurrentMessage(tapMessage);
    setShowMessage(true);
    if (onTap) onTap();
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        onClick={handleTap}
        className="relative p-4 focus:outline-none"
        aria-label="Tap Pim"
      >
        <PimDust level={dustLevel} />
        <StageComponent />
      </button>
      {showMessage && (
        <p className="text-ink/60 text-sm font-body mt-2 animate-fade-in">{currentMessage}</p>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Pim.jsx src/components/PimDust.jsx
git commit -m "feat: Pim visual component with 4 stages, breathing animation, dust particles"
```

---

## Task 11: Home Screen + Layout

**Files:**
- Create: `src/components/Layout.jsx`
- Create: `src/pages/Home.jsx`
- Create: `src/pages/Milestones.jsx`
- Create: `src/pages/Settings.jsx`

- [ ] **Step 1: Implement Layout shell**

Create `src/components/Layout.jsx`:

```jsx
import { Link, useLocation } from 'react-router-dom';
import { SobrietyCounter } from './SobrietyCounter';

export function Layout({ sobrietyDate, children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-dvh bg-cream flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        {sobrietyDate ? (
          <Link to="/milestones">
            <SobrietyCounter sobrietyDate={sobrietyDate} />
          </Link>
        ) : (
          <div />
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Bottom bar — only on home */}
      {isHome && (
        <footer className="flex justify-center gap-8 pb-6 pt-2">
          <Link
            to="/settings"
            className="text-ink/40 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Settings"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </Link>
          <Link
            to="/export"
            className="text-ink/40 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Export"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </Link>
        </footer>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Implement Home page**

Create `src/pages/Home.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { Pim } from '../components/Pim';
import { usePim } from '../hooks/usePim';

const TILES = [
  { label: 'Resentments', path: '/resentments', color: 'border-oxblood/30 text-oxblood' },
  { label: 'Fears', path: '/fears', color: 'border-violet/30 text-violet' },
  { label: 'Sex Inventory', path: '/sex-inventory', color: 'border-acid/40 text-ink' },
  { label: 'Harms', path: '/harms', color: 'border-ochre/30 text-ochre' },
];

export function Home() {
  const { stage, dustLevel, tapMessage, recordAction } = usePim();

  return (
    <div className="flex flex-col items-center px-4 pb-4">
      {/* Pim — the emotional center */}
      <div className="py-8">
        <Pim stage={stage} dustLevel={dustLevel} tapMessage={tapMessage} onTap={recordAction} />
      </div>

      {/* 4 inventory tiles */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {TILES.map((tile) => (
          <Link
            key={tile.path}
            to={tile.path}
            className={`border-2 ${tile.color} rounded-xl p-5 text-center font-display text-lg min-h-[80px] flex items-center justify-center hover:bg-ink/5 transition-colors`}
          >
            {tile.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Implement Milestones page**

Create `src/pages/Milestones.jsx`:

```jsx
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { daysSince, getEarnedMilestones, formatDate } from '../utils/dates';
import { MilestoneChip } from '../components/MilestoneChip';

export function Milestones() {
  const { store } = useAppStore();
  const days = useMemo(() => daysSince(store.user.sobrietyDate), [store.user.sobrietyDate]);
  const earned = useMemo(() => getEarnedMilestones(days), [days]);

  return (
    <div className="min-h-dvh bg-cream p-4">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Milestones</h1>
      </div>

      <div className="text-center mb-8">
        <p className="font-display text-5xl text-ink">{days}</p>
        <p className="text-ink/60 font-body">day{days !== 1 ? 's' : ''}</p>
        <p className="text-ink/40 text-sm mt-1">since {formatDate(store.user.sobrietyDate)}</p>
      </div>

      {earned.length > 0 ? (
        <div className="space-y-3">
          {earned.map((m) => (
            <div key={m.days} className="flex items-center gap-3">
              <MilestoneChip label={m.label} />
              <span className="text-ink/40 text-sm">{m.days} day{m.days !== 1 ? 's' : ''}. You're here.</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-ink/40 text-center">First milestone: 24 hours. You're on your way.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Implement Settings page**

Create `src/pages/Settings.jsx`:

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';

export function Settings() {
  const { store, setStore } = useAppStore();
  const [sobrietyDate, setSobrietyDate] = useState(store.user.sobrietyDate || '');
  const [pronouns, setPronouns] = useState(store.user.pronouns || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setStore((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        sobrietyDate: sobrietyDate || prev.user.sobrietyDate,
        pronouns: pronouns || null,
      },
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-dvh bg-cream p-4">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Settings</h1>
      </div>

      <div className="space-y-6 max-w-sm">
        <div>
          <label className="block text-sm text-ink/60 mb-1">Sobriety Date</label>
          <input
            type="date"
            value={sobrietyDate}
            onChange={(e) => setSobrietyDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border-2 border-ink/15 rounded-lg p-3 bg-cream focus:border-violet focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-1">Pronouns</label>
          <input
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="e.g. they/them"
            className="w-full border-2 border-ink/15 rounded-lg p-3 bg-cream focus:border-violet focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-ink/60 mb-1">Higher Power Language</label>
          <p className="text-ink/80 p-3 border-2 border-ink/10 rounded-lg bg-cream/50">
            {store.user.higherPowerTerm || 'Not set (neutral framing)'}
          </p>
          <p className="text-ink/40 text-xs mt-1">Set during onboarding. Re-run onboarding to change.</p>
        </div>

        <button
          onClick={handleSave}
          className="bg-ink text-cream px-8 py-3 rounded-lg font-body text-lg min-h-[44px] w-full"
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Layout.jsx src/pages/Home.jsx src/pages/Milestones.jsx src/pages/Settings.jsx
git commit -m "feat: home screen with Pim tiles, milestones view, settings page"
```

---

## Task 12: Export System

**Files:**
- Create: `src/utils/export.js`
- Create: `tests/utils/export.test.js`
- Create: `src/pages/Export.jsx`

- [ ] **Step 1: Write failing tests for export utilities**

Create `tests/utils/export.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { generatePlainText, generateJSON } from '../../src/utils/export';
import { getDefaultStore } from '../../src/store/schema';

describe('generateJSON', () => {
  it('returns valid JSON string of the store', () => {
    const store = getDefaultStore();
    store.inventories.resentments = [{ id: '1', resentfulAt: 'Test', cause: 'Because' }];
    const json = generateJSON(store);
    const parsed = JSON.parse(json);
    expect(parsed.inventories.resentments).toHaveLength(1);
    expect(parsed.version).toBe(1);
  });
});

describe('generatePlainText', () => {
  it('includes section headers', () => {
    const store = getDefaultStore();
    const text = generatePlainText(store);
    expect(text).toContain('RESENTMENTS');
    expect(text).toContain('FEARS');
    expect(text).toContain('SEX INVENTORY');
    expect(text).toContain('HARMS');
  });

  it('includes numbered entries', () => {
    const store = getDefaultStore();
    store.inventories.fears = [
      { id: '1', fear: 'Spiders', why: 'Childhood', selfCause: 'Control', hpDirection: 'Let go', createdAt: '2026-01-01T00:00:00Z' },
    ];
    const text = generatePlainText(store);
    expect(text).toContain('1.');
    expect(text).toContain('Spiders');
  });

  it('shows (none) for empty sections', () => {
    const store = getDefaultStore();
    const text = generatePlainText(store);
    expect(text).toContain('(none)');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/utils/export.test.js
```

Expected: FAIL — modules not found.

- [ ] **Step 3: Implement export.js**

Create `src/utils/export.js`:

```js
export function generateJSON(store) {
  return JSON.stringify(store, null, 2);
}

export function generatePlainText(store) {
  const lines = [];
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  lines.push(`SWEEP STEP — 4th Step Inventory`);
  lines.push(`Exported: ${date}`);
  lines.push('');

  // Resentments
  lines.push('=== RESENTMENTS ===');
  lines.push('');
  if (store.inventories.resentments.length === 0) {
    lines.push('(none)');
  } else {
    store.inventories.resentments.forEach((entry, i) => {
      lines.push(`${i + 1}. Resentful at: ${entry.resentfulAt || ''}`);
      lines.push(`   Cause: ${entry.cause || ''}`);
      lines.push(`   Affects: ${(entry.affects || []).join(', ')}${entry.affects_other ? ', ' + entry.affects_other : ''}`);
      lines.push(`   My part: ${(entry.myPart || []).join(', ')}${entry.myPart_other ? ', ' + entry.myPart_other : ''}`);
      lines.push('');
    });
  }
  lines.push('');

  // Fears
  lines.push('=== FEARS ===');
  lines.push('');
  if (store.inventories.fears.length === 0) {
    lines.push('(none)');
  } else {
    store.inventories.fears.forEach((entry, i) => {
      lines.push(`${i + 1}. Fear: ${entry.fear || ''}`);
      lines.push(`   Why: ${entry.why || ''}`);
      lines.push(`   Self-cause: ${entry.selfCause || ''}`);
      lines.push(`   Direction: ${entry.hpDirection || ''}`);
      lines.push('');
    });
  }
  lines.push('');

  // Sex Inventory
  lines.push('=== SEX INVENTORY ===');
  lines.push('');
  if (store.inventories.sex.length === 0) {
    lines.push('(none)');
  } else {
    store.inventories.sex.forEach((entry, i) => {
      lines.push(`${i + 1}. Whom: ${entry.whom || ''}`);
      lines.push(`   What I did: ${entry.whatIDid || ''}`);
      lines.push(`   Aroused: ${entry.aroused || ''}`);
      lines.push(`   My fault: ${entry.myFault || ''}`);
      lines.push(`   Should have done: ${entry.shouldHaveDone || ''}`);
      lines.push('');
    });
  }
  lines.push('');

  // Harms
  lines.push('=== HARMS ===');
  lines.push('');
  if (store.inventories.harms.length === 0) {
    lines.push('(none)');
  } else {
    store.inventories.harms.forEach((entry, i) => {
      lines.push(`${i + 1}. Person: ${entry.person || ''}`);
      lines.push(`   What I did: ${entry.whatIDid || ''}`);
      lines.push(`   How affected: ${entry.howAffected || ''}`);
      lines.push(`   Amends type: ${entry.amendsType || ''}`);
      lines.push('');
    });
  }

  return lines.join('\n');
}

export function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/utils/export.test.js
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Implement Export page**

Create `src/pages/Export.jsx`:

```jsx
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { generateJSON, generatePlainText, downloadBlob } from '../utils/export';

export function Export() {
  const { store } = useAppStore();

  const today = new Date().toISOString().split('T')[0];

  const handleJSON = () => {
    const content = generateJSON(store);
    downloadBlob(content, `sweep-step-export-${today}.json`, 'application/json');
  };

  const handleText = () => {
    const content = generatePlainText(store);
    downloadBlob(content, `sweep-step-export-${today}.txt`, 'text/plain');
  };

  return (
    <div className="min-h-dvh bg-cream p-4">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Export</h1>
      </div>

      <div className="space-y-4 max-w-sm">
        <p className="text-ink/60 text-sm">
          Your data stays on your device. Export creates a file you can save wherever you choose.
        </p>

        <button
          onClick={handleJSON}
          className="w-full border-2 border-violet/30 text-violet rounded-xl p-4 text-left min-h-[60px]"
        >
          <span className="font-display text-lg block">Export as JSON</span>
          <span className="text-sm text-ink/40">Full data. Re-importable in future versions.</span>
        </button>

        <button
          onClick={handleText}
          className="w-full border-2 border-ochre/30 text-ochre rounded-xl p-4 text-left min-h-[60px]"
        >
          <span className="font-display text-lg block">Export as Plain Text</span>
          <span className="text-sm text-ink/40">Readable. Printable. For sponsor work or records.</span>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/utils/export.js src/pages/Export.jsx tests/utils/export.test.js
git commit -m "feat: export to JSON and plain text with download"
```

---

## Task 13: Router + App Wiring

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Wire up the full App with routing, AppProvider, and PinGate**

Replace `src/App.jsx`:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { useAppStore } from './hooks/useAppStore';
import { PinGate } from './components/PinGate';
import { Layout } from './components/Layout';
import { Onboarding } from './pages/Onboarding';
import { Home } from './pages/Home';
import { Resentments } from './pages/Resentments';
import { Fears } from './pages/Fears';
import { SexInventory } from './pages/SexInventory';
import { Harms } from './pages/Harms';
import { Milestones } from './pages/Milestones';
import { Settings } from './pages/Settings';
import { Export } from './pages/Export';
import { hashPin } from './store/pin';
import { getDefaultStore, STORAGE_KEY } from './store/schema';

function AppInner() {
  const { store, setStore } = useAppStore();

  // Not onboarded yet — show onboarding
  if (!store.user.onboardingComplete) {
    return (
      <Onboarding
        onComplete={(data) => {
          setStore((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              pronouns: data.pronouns,
              higherPowerTerm: data.higherPowerTerm,
              sobrietyDate: data.sobrietyDate,
              pinHash: data.pinHash,
              onboardingComplete: true,
            },
          }));
        }}
      />
    );
  }

  const handleWipe = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStore(getDefaultStore());
  };

  return (
    <PinGate store={store} onWipe={handleWipe}>
      <Layout sobrietyDate={store.user.sobrietyDate}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resentments" element={<Resentments />} />
          <Route path="/fears" element={<Fears />} />
          <Route path="/sex-inventory" element={<SexInventory />} />
          <Route path="/harms" element={<Harms />} />
          <Route path="/milestones" element={<Milestones />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/export" element={<Export />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </PinGate>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: Verify the app runs**

```bash
npm run dev
```

Expected: App starts. Shows onboarding on first load. After completing onboarding, shows PIN screen. After entering PIN, shows home with Pim and 4 tiles.

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire up routing, AppProvider, PinGate, and all pages"
```

---

## Task 14: Background Timer for PIN Re-lock

**Files:**
- Modify: `src/components/PinGate.jsx`

- [ ] **Step 1: Add visibility change listener to PinGate for 5-minute re-lock**

Edit `src/components/PinGate.jsx` — add a `useEffect` inside the component, after the existing `useEffect` hooks:

```jsx
// Add these at the top of the PinGate function, after existing state
const backgroundTimeRef = useRef(null);

// Add this useEffect after the existing ones
useEffect(() => {
  if (!unlocked) return;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      backgroundTimeRef.current = Date.now();
    } else if (backgroundTimeRef.current) {
      const elapsed = Date.now() - backgroundTimeRef.current;
      if (elapsed > 5 * 60 * 1000) {
        setUnlocked(false);
        setPin('');
        setAttempts(0);
      }
      backgroundTimeRef.current = null;
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, [unlocked]);
```

- [ ] **Step 2: Verify re-lock works manually**

Open app, unlock, switch tabs, wait 5+ minutes (or use devtools to simulate). App should re-lock on return.

- [ ] **Step 3: Commit**

```bash
git add src/components/PinGate.jsx
git commit -m "feat: re-lock PIN after 5 minutes in background"
```

---

## Task 15: PWA Polish + Build Verification

**Files:**
- Modify: various (minor tweaks)

- [ ] **Step 1: Build for production**

```bash
npm run build
```

Expected: Build succeeds. `dist/` contains `index.html`, JS/CSS bundles, manifest, service worker.

- [ ] **Step 2: Preview production build**

```bash
npx vite preview
```

Expected: App loads at localhost, works offline after first load (check in devtools > Application > Service Worker).

- [ ] **Step 3: Verify PWA installability**

Open the preview URL in Chrome. Check DevTools > Application > Manifest. Should show "Installable" with correct icons and theme color.

- [ ] **Step 4: Run full test suite one final time**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "chore: production build verification, PWA polish"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Onboarding flow (6 screens: welcome, pronouns, HP, sobriety date, PIN, meet Pim) — Task 6
- [x] PIN lock with hash, lockout, wipe — Task 3
- [x] PIN re-lock after 5 min background — Task 14
- [x] Sobriety counter + milestone chips — Task 4
- [x] Milestone view — Task 11
- [x] 4 inventories (Resentments, Fears, Sex, Harms) with correct fields per spec — Task 9
- [x] Original guidance + "Learn more" modern guidance for all 4 — Tasks 7, 8
- [x] Higher Power term insertion — Task 7 (`insertHP`)
- [x] Pim stages 1-4 with visuals — Task 10
- [x] Pim breathing animation — Task 10
- [x] Pim tap messages + neglect dust — Tasks 5, 10
- [x] Export JSON + plain text — Task 12
- [x] Versioned localStorage schema with reserved keys — Task 2
- [x] PWA manifest + service worker + offline — Tasks 1, 15
- [x] Netlify config — Task 1
- [x] Design system (colors, fonts, spacing) — Task 1
- [x] Mobile-first, 44px tap targets, WCAG AA — Throughout
- [x] Settings (edit sobriety date, pronouns) — Task 11
- [x] Home screen with Pim center + 4 tiles — Task 11
- [x] Routing extensible for future layers — Task 13

**Placeholder scan:** No TBD, TODO, or "implement later" found.

**Type consistency:** `store`, `setStore`, `inventories`, `pim`, `stage` — consistent throughout. Field keys in inventory pages match export field references.
