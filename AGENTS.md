# Kova Landing Page

Vite + React 19 (JSX, no TypeScript). Custom path router in `src/App.jsx`.
Not a git repository — copy files before risky edits.

## Commands

- `npm run dev` — dev server (first free port from 3000; check output)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the build
- `node scripts/prepare-*-images.mjs` — regenerate a route's webp images
  from `assets-src/` into `public/images/`

## QA (playwright-core + system Edge, headless)

- `node scripts/qa.mjs` — home page
- `node scripts/qa-features.mjs` — /features
- `node scripts/qa-how.mjs` — /how-it-works
- `node scripts/qa-integrations.mjs` — /integrations
- All take `BASE_URL=http://localhost:<port>` (default 3000) and write
  screenshots to `qa-shots/`.

## Conventions

- Home page: every concept is its own full-width section in
  `src/components/home/` (Problem, HowWorks, DailyRhythm, Connectivity,
  Family, Automations, Sage, LocalFirst, Scenarios, Why, CtaSection).
  Section styles are `src/styles/home-sections.css`; hero, shared phone
  frame (`PhoneFrame.jsx`, `.phone-*`) and problem styles stay in
  `home.css`. The hero phone's slider drives `--lvl` on `.hero`, which
  sets the villa photo's `filter: brightness()`.
- Routes: `/`, `/features`, `/how-it-works`, `/integrations` — new routes
  go in the `ROUTES` map in `src/App.jsx` + a NAV entry in
  `src/components/Header.jsx` (mobile pill/hamburger break is 1150px).
  `/integrations/<id>` renders `src/pages/IntegrationGuidePage.jsx` — a
  full-page guide built from the same `integrations.js` entry the drawer
  shows (App.jsx derives `guideId` from the pathname).
- The integrations page keeps all provider data in
  `src/data/integrations.js`; styles are `ni-*` prefixed in
  `src/styles/ni-*.css`; everything renders inside `<div class="ni">` so
  the global `main > section` rule never reaches it.
- Brand icons: `simple-icons` (pinned); generic: `lucide-react`. The icon
  registry lives in `src/components/integrations/icons.jsx` — never use
  siNestjs / siMatterdotjs / siHelix / siVaultwarden for Kova brands.
