# Ari's Care Companion (Platelet Tracker)

## Status: Built. Awaiting deploy.

## Location
`ari-care-companion/` in the michelle-townsend-consulting repo.

## What It Is
A React 18 + Vite PWA for tracking Ari's platelet counts with ITP dietary guidance. Cross-device sync via Google Drive. Talk-to-text input. Recharts visualization with danger/caution zone markers. Installable as a home screen app.

## Tech Stack
- React 18, Vite 8, Recharts
- Google Drive API (OAuth, app folder for JSON storage)
- Web Speech API (talk-to-text)
- vite-plugin-pwa (service worker, offline support)
- Netlify deploy (netlify.toml configured)

## What's Built
- [x] Platelet count entry with date, count, notes
- [x] Talk-to-text input via Web Speech API
- [x] Recharts area chart with danger zone (<20K, red) and caution zone (20-50K, orange)
- [x] Entry history with delete
- [x] Google Drive sync (load/save platelet data as JSON)
- [x] Google OAuth sign-in/sign-out
- [x] Bottom tab bar (mobile), side nav (desktop)
- [x] PWA manifest and service worker
- [x] Netlify deploy config with SPA redirect
- [x] Branded SVG icons (favicon, 192, 512)

## What's Pending
- [ ] Diet Guide tab content (waiting for AriCareCompanion.jsx drop-in from Michelle)
- [ ] Google Cloud project credentials (client ID needed for OAuth)
- [ ] First deploy to Netlify
- [ ] Test with real data on phone/tablet

## Audience
- Ari (primary user, enters data)
- Michelle (monitors)
- Doctors (views history during appointments)

## Design
Green/gold/cream color scheme. Mobile-first. Clean enough for a doctor to take seriously.
