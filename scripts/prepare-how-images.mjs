// Prepares the /how-it-works page image manifest: grades the Pexels source
// photos in assets-src/how/ into web-optimised WebP files in
// public/images/kova/how/. Run: node scripts/prepare-how-images.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets-src/how');
const OUT = join(ROOT, 'public/images/kova/how');
mkdirSync(OUT, { recursive: true });

const Q = { quality: 82 };

const JOBS = [
  // 01 — hero: dark warm living room, sofas + lamps (Pexels 276724)
  {
    src: join(SRC, '276724.jpg'),
    out: 'hero-living-room.webp',
    width: 1920,
    modulate: { saturation: 0.96, brightness: 1.06 },
  },
  // 02 — modes: modern lounge, sofa + city view (Pexels 6758512)
  {
    src: join(SRC, '6758512.jpg'),
    out: 'modes-living-room.webp',
    width: 1800,
    modulate: { saturation: 0.95, brightness: 0.97 },
  },
  // 03 — automation: warm residential hallway at night (Pexels 7510678)
  {
    src: join(SRC, '7510678.jpg'),
    out: 'automation-hallway.webp',
    width: 1600,
    modulate: { saturation: 0.95, brightness: 0.98 },
  },
  // 04 — sage: glowing floor lamp beside a sofa (Pexels 26546549)
  {
    src: join(SRC, '26546549.jpg'),
    out: 'sage-lounge.webp',
    width: 1600,
  },
  // 05 — local-first: modern villa illuminated at dusk (Pexels 13752348)
  {
    src: join(SRC, '13752348.jpg'),
    out: 'local-first-villa.webp',
    width: 1800,
    modulate: { saturation: 0.95 },
  },
  // 06 — final CTA: modern glass house at twilight (Pexels 4626268)
  {
    src: join(SRC, '4626268.jpg'),
    out: 'final-cta-house.webp',
    width: 1400,
    modulate: { saturation: 0.96 },
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
