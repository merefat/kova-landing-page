// Converts the Kova source photos in assets-src/kova/ to web-optimised WebP
// in public/assets/kova/. Never upscales. Run: npm run images
import sharp from 'sharp';
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../assets-src/kova/', import.meta.url));
const OUT = fileURLToPath(new URL('../public/assets/kova/', import.meta.url));
mkdirSync(OUT, { recursive: true });

const QUALITY = 82;

// Explicit trims (px) for images with baked-in dark borders.
// climate-thermostat: dark doorframe edges on both sides of the shot.
const CROPS = {
  'climate-thermostat': { left: 98, top: 0, width: 800, height: 571 },
};

const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));
for (const file of files) {
  const name = file.replace(/\.[^.]+$/, '');
  const src = join(SRC, file);
  let img = sharp(src);
  let meta = await img.metadata();
  let cropInfo = '';

  const rect = CROPS[name];
  if (rect) {
    img = img.extract(rect);
    meta = { width: rect.width, height: rect.height };
    cropInfo = ` cropped ${rect.width}x${rect.height}`;
  }

  const out = join(OUT, `${name}.webp`);
  const info = await img.webp({ quality: QUALITY }).toFile(out);
  console.log(`${file} -> ${name}.webp  ${meta.width}x${meta.height}${cropInfo}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log('Done.');
