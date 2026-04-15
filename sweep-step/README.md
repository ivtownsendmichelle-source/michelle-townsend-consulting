# Sweep Step

A private, offline-first PWA for people working the 12 Steps, starting with Step 4.

## Local Development

npm install
npm run dev

## Deploy to Netlify

Push to the connected GitHub repo. Netlify auto-builds from main.

Manual deploy:
npm run build
npx netlify deploy --prod --dir=dist

## Roadmap

- **Layer 1 (current):** Onboarding, PIN lock, sobriety tracker, 4th Step inventories, Pim stages 1-4, export
- **Layer 2:** Meeting log, gratitude journal, phone list, daily reflection, Google Sheets sync, Pim stages 5-6
- **Layer 3:** Step progress tracker, promises checklist, Pim stage 7
