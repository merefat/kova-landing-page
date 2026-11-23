// Prepares the homepage image manifest: crops/grades source photos into
// web-optimised WebP files in public/images/kova/home/.
// Sources: assets-src/kova/ (existing) + assets-src/candidates/ (Pexels).
// Run: node scripts/prepare-home-images.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KOVA = join(ROOT, 'assets-src/kova');
const CAND = join(ROOT, 'assets-src/candidates');
const OUT = join(ROOT, 'public/images/kova/home');
mkdirSync(OUT, { recursive: true });

const Q = { quality: 82 };

const JOBS = [
  // 01 — hero: modern villa at dusk (existing asset, re-encoded to manifest name)
  {
    src: join(KOVA, 'hero-smart-home.jpg'),
    out: 'hero-villa-dusk.webp',
    width: 1400,
  },
  // 02 — problem: man on sofa with phone (desaturated + cooled + darkened
  // so the figure reads as moody monochrome, face not clearly visible)
  {
    src: join(CAND, '23021292.jpg'),
    out: 'problem-person-phone.webp',
    width: 1200,
    modulate: { saturation: 0.22, brightness: 0.94, hue: -12 },
    linear: { a: 0.98, b: -4 },
  },
  // 03 — family: father and child in a bright kitchen (user-supplied)
  {
    src: join(KOVA, 'family-kitchen.png'),
    out: 'family-kitchen.webp',
    width: 1024,
  },
  // 04 — daily rhythm: moody living room, amber pendants
  {
    src: join(KOVA, 'living-room-modes-evening.png'),
    out: 'daily-rhythm-interior.webp',
    width: 1200,
  },
  // 05 — morning scenario: bright modern bedroom, natural light
  {
    src: join(CAND, '36777598.jpg'),
    out: 'morning-bedroom.webp',
    width: 1100,
    modulate: { saturation: 0.92, brightness: 0.97 },
  },
  // 06 — movie scenario: home cinema, recliners + projector
  {
    src: join(CAND, '8583821.jpg'),
    out: 'movie-room.webp',
    width: 1100,
    modulate: { saturation: 0.9, brightness: 0.9 },
  },
  // 07 — bedtime scenario: lamp-lit bedroom at night
  {
    src: join(CAND, '19191287.jpg'),
    out: 'bedtime-bedroom.webp',
    width: 1100,
    modulate: { saturation: 0.8, brightness: 1.02, hue: -8 },
  },
  // 08 — final CTA: warm wood living room
  {
    src: join(KOVA, 'family-living-room.png'),
    out: 'final-cta-interior.webp',
    width: 1200,
  },
  // 09 — local-first: hub glowing on a coffee table in a dim living room
  {
    src: join(KOVA, 'local-first-hub.png'),
    out: 'local-first-hub.webp',
    width: 1400,
  },
  // 10 — why: hand touching a holographic home-control UI at night
  {
    src: join(KOVA, 'why-hologram.png'),
    out: 'why-hologram.webp',
    width: 1400,
  },
];

for (const job of JOBS) {
  let img = sharp(job.src);
  const meta = await img.metadata();
  if (meta.width > job.width) img = img.resize({ width: job.width });
  if (job.modulate) img = img.modulate(job.modulate);
  if (job.linear) img = img.linear(job.linear.a, job.linear.b);
  const out = join(OUT, job.out);
  const info = await img.webp(Q).toFile(out);
  console.log(`${job.out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log('Done.');
