// Deploys the project to Vercel via the REST API (no CLI needed).
// Usage: VERCEL_TOKEN=xxx node scripts/deploy-vercel.mjs
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const API = 'https://api.vercel.com';
const PROJECT = 'kova-landing-page';
const TOKEN = process.env.VERCEL_TOKEN;
if (!TOKEN) {
  console.error('Set the VERCEL_TOKEN env var.');
  process.exit(1);
}
const auth = { Authorization: `Bearer ${TOKEN}` };

// Files the remote Vite build needs — everything else (.vercelignore) stays local.
const INCLUDE_FILES = [
  'index.html',
  'package.json',
  'package-lock.json',
  'vite.config.js',
  'vercel.json',
];
const INCLUDE_DIRS = ['src', 'public'];

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const entries = [];
for (const f of INCLUDE_FILES) entries.push(join(ROOT, f));
for (const d of INCLUDE_DIRS) for (const p of walk(join(ROOT, d))) entries.push(p);

const files = entries.map((p) => {
  const buf = readFileSync(p);
  return {
    file: relative(ROOT, p).split(sep).join('/'),
    sha: createHash('sha1').update(buf).digest('hex'),
    size: buf.length,
    buf,
  };
});
console.log(`Uploading ${files.length} files (${(files.reduce((n, f) => n + f.size, 0) / 1e6).toFixed(1)} MB)...`);

const user = await (await fetch(`${API}/v2/user`, { headers: auth })).json();
const team = user.user?.defaultTeamId ? `?teamId=${user.user.defaultTeamId}` : '';

let done = 0;
for (let i = 0; i < files.length; i += 5) {
  await Promise.all(
    files.slice(i, i + 5).map(async (f) => {
      const res = await fetch(`${API}/v2/files${team}`, {
        method: 'POST',
        headers: {
          ...auth,
          'x-vercel-digest': f.sha,
          'Content-Type': 'application/octet-stream',
          'Content-Length': String(f.size),
        },
        body: f.buf,
      });
      if (!res.ok) throw new Error(`upload ${f.file}: ${res.status} ${await res.text()}`);
      done++;
    })
  );
  process.stdout.write(`\r  ${done}/${files.length}`);
}
console.log('');

let proj = await fetch(`${API}/v9/projects/${PROJECT}${team}`, { headers: auth });
if (proj.status === 404) {
  proj = await fetch(`${API}/v10/projects${team}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: PROJECT, framework: 'vite' }),
  });
  if (!proj.ok) throw new Error(`create project: ${proj.status} ${await proj.text()}`);
  console.log(`Created project "${PROJECT}"`);
}

const dep = await (
  await fetch(`${API}/v13/deployments${team}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: PROJECT,
      project: PROJECT,
      target: 'production',
      files: files.map(({ file, sha, size }) => ({ file, sha, size })),
      projectSettings: {
        framework: 'vite',
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        installCommand: 'npm install',
      },
    }),
  })
).json();
if (dep.error) {
  console.error('Deployment error:', dep.error);
  process.exit(1);
}
console.log(`Deployment ${dep.id} → building...`);

for (let i = 0; i < 90; i++) {
  await new Promise((r) => setTimeout(r, 5000));
  const s = await (
    await fetch(`${API}/v13/deployments/${dep.id}${team}`, { headers: auth })
  ).json();
  if (s.readyState === 'READY') {
    console.log(`READY — https://${s.alias?.[0] || s.url}`);
    break;
  }
  if (s.readyState === 'ERROR' || s.readyState === 'CANCELED') {
    console.error(`Deployment ${s.readyState}:`, s.errorMessage || '');
    process.exit(1);
  }
}
