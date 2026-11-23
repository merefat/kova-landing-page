// Prepares the /integrations page hero: grades the generated night-house
// source in assets-src/integrations/ into web-optimised WebP files in
// public/images/kova/integrations/. Never upscales.
// Source: drop the full-res PNG in as kova-network-hero-background.png
// (1672x941) — it takes priority over the .jpg preview, and re-run.
// Run: node scripts/prepare-integrations-images.mjs
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets-src/integrations');
const OUT = join(ROOT, 'public/images/kova/integrations');
mkdirSync(OUT, { recursive: true });

const Q = { quality: 84 };

const PNG = join(SRC, 'kova-network-hero-background.png');
const JPG = join(SRC, 'kova-network-hero-background.jpg');
const src = existsSync(PNG) ? PNG : JPG;
if (!existsSync(src)) {
  console.error(`No hero source found at ${PNG} or ${JPG}`);
  process.exit(1);
}
console.log(`Source: ${src}`);

const JOBS = [
  { src, out: 'hero-network.webp', width: 1672, modulate: { saturation: 1.0 } },
  { src, out: 'hero-network-sm.webp', width: 900, modulate: { saturation: 1.0 } },
  // Bottom CTA — minimalist villa at night with EV charger under the carport
  { src: join(SRC, 'cta-villa-night.png'), out: 'cta-villa-night.webp', width: 1400 },
];

for (const job of JOBS) {
  if (!existsSync(job.src)) {
    console.warn(`Skipping ${job.out} — no source at ${job.src}`);
    continue;
  }
  let img = sharp(job.src);
  const meta = await img.metadata();
  if (meta.width > job.width) img = img.resize({ width: job.width });
  if (job.modulate) img = img.modulate(job.modulate);
  const out = join(OUT, job.out);
  const info = await img.webp(Q).toFile(out);
  console.log(`${job.out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log('Done.');
