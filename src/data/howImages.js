// /how-it-works photography manifest — public/images/kova/how/, produced by
// scripts/prepare-how-images.mjs from assets-src/how/ (Pexels originals).
// Asset manifest: each entry records the Pexels photo page URL, photographer,
// download date (2026-11-20), licence (Pexels — free for commercial use, no
// attribution required) and where the image is used on the page.
// No image in this set shows an identifiable human face.

const LICENCE = 'Pexels License (free for commercial use, no attribution required)';
const DOWNLOADED = '2026-11-20';

export const HOW = {
  // 01 — cinematic hero background: dark warm living room, sofas + lamps
  heroRoom: {
    src: '/images/kova/how/hero-living-room.webp',
    alt: 'Warm modern living room in the evening with sofas, lamps and dark wooden walls',
    w: 1920,
    h: 1080,
    source: 'https://www.pexels.com/photo/276724/',
    photographer: 'Pixabay',
    license: LICENCE,
    downloaded: DOWNLOADED,
    usedIn: 'Hero — How Kova Works',
  },
  // 02 — modes & overlays background: modern lounge, sofa + city view
  modesRoom: {
    src: '/images/kova/how/modes-living-room.webp',
    alt: 'Modern living room with a large grey sofa and floor-to-ceiling city-view windows',
    w: 1800,
    h: 1201,
    source: 'https://www.pexels.com/photo/6758512/',
    photographer: 'Max Vakhtbovych',
    license: LICENCE,
    downloaded: DOWNLOADED,
    usedIn: 'Modes & Overlays',
  },
  // 03 — automations background: warm residential hallway at night
  autoHall: {
    src: '/images/kova/how/automation-hallway.webp',
    alt: 'Modern residential hallway at night with warm ambient lighting and wooden decor',
    w: 1600,
    h: 1067,
    source: 'https://www.pexels.com/photo/7510678/',
    photographer: 'Matheus Bertelli',
    license: LICENCE,
    downloaded: DOWNLOADED,
    usedIn: 'Automations',
  },
  // 04 — sage background: glowing floor lamp beside a sofa
  sageRoom: {
    src: '/images/kova/how/sage-lounge.webp',
    alt: 'Floor lamp glowing warmly beside a sofa in a cosy living room corner',
    w: 1600,
    h: 900,
    source: 'https://www.pexels.com/photo/26546549/',
    photographer: 'Sami Abdullah',
    license: LICENCE,
    downloaded: DOWNLOADED,
    usedIn: 'Meet Sage',
  },
  // 05 — local-first background: modern villa illuminated at dusk
  localVilla: {
    src: '/images/kova/how/local-first-villa.webp',
    alt: 'Modern villa illuminated at dusk with warm light through large glass windows',
    w: 1800,
    h: 1200,
    source: 'https://www.pexels.com/photo/13752348/',
    photographer: 'Gustavo Galeano Maz',
    license: LICENCE,
    downloaded: DOWNLOADED,
    usedIn: 'Local-First',
  },
  // 06 — final CTA background: modern glass house at twilight
  ctaHouse: {
    src: '/images/kova/how/final-cta-house.webp',
    alt: 'Modern glass house glowing warmly at twilight',
    w: 1400,
    h: 934,
    source: 'https://www.pexels.com/photo/4626268/',
    photographer: 'Littlehampton Bricks',
    license: LICENCE,
    downloaded: DOWNLOADED,
    usedIn: 'Final CTA',
  },
};
