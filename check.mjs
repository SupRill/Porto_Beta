// Pemeriksaan tanpa dependency. Opsional: sinkronkan SEO dari satu sumber data.
import assert from 'node:assert/strict';
import { readFile, writeFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = await readFile(path.join(root, 'assets/js/data.js'), 'utf8');
const { data } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const htmlPath = path.join(root, 'index.html');
let html = await readFile(htmlPath, 'utf8');
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

assert(data.name && data.role && data.themeName, 'Identitas wajib diisi');
for (const key of ['skills', 'projects', 'experience', 'about', 'education', 'certificates']) assert(Array.isArray(data[key]), `${key} harus array`);
for (const skill of data.skills) assert(typeof skill.level === 'string' ? skill.level.trim().length > 0 : Number.isFinite(skill.level) && skill.level >= 0 && skill.level <= 100, `Level tidak valid: ${skill.name}`);
for (const project of data.projects) assert(project.title && Array.isArray(project.tech), 'Proyek harus memiliki judul dan array tech');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(ids).size, ids.length, 'ID HTML duplikat');
for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id), `Anchor tidak ditemukan: ${id}`);
const assets = [data.profile.image, ...data.projects.map((project) => project.image), data.cv, data.ambientAudio, data.seo.image];
for (const [, value] of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) assets.push(value);
for (const asset of new Set(assets.filter(Boolean))) {
  if (/^https?:\/\//.test(asset)) continue;
  assert(!asset.startsWith('/') && !asset.includes('..'), `Path harus relatif di dalam proyek: ${asset}`);
  await access(path.join(root, asset));
}
assert(html.includes('lang="id"') && html.includes('type="module"'), 'Bahasa/modul HTML hilang');
assert(html.includes('gsap@3.12.5') && html.includes('ScrollTrigger.min.js'), 'CDN animasi belum dipin');
assert(html.includes('fieldset id="form-fields" disabled'), 'Form harus aman ketika JavaScript nonaktif');
for (const [, target] of html.matchAll(/aria-(?:controls|labelledby|describedby)="([^"]+)"/g)) {
  for (const id of target.split(/\s+/)) assert(ids.includes(id), `Referensi aksesibilitas tidak ditemukan: ${id}`);
}
assert(html.includes('<dialog id="accessibility-panel"'), 'Panel aksesibilitas harus memakai dialog native');
// Judul yang menghilangkan <br> pada mobile tetap memiliki pemisah kata.
for (const className of ['journal-copy', 'ledger-layout']) {
  const heading = html.slice(html.indexOf(className)).match(/<h2>(.*?)<\/h2>/s)?.[1];
  assert(heading && !/\S<br>\S/.test(heading), `Spasi judul mobile hilang: ${className}`);
}

if (process.argv.includes('--sync-meta')) {
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(data.seo.title)}</title>`);
  const values = { description: data.seo.description, 'og:title': data.seo.title, 'og:description': data.seo.description, 'og:image': data.seo.url ? new URL(data.seo.image, data.seo.url).href : data.seo.image };
  for (const [name, value] of Object.entries(values)) {
    const attribute = name.startsWith('og:') ? 'property' : 'name';
    const pattern = new RegExp(`<meta ${attribute}="${name}" content="[^"]*">`);
    html = html.replace(pattern, `<meta ${attribute}="${name}" content="${escape(value)}">`);
  }
  html = html.replace(/\n?\s*<link rel="canonical"[^>]*>/g, '').replace(/\n?\s*<meta property="og:url"[^>]*>/g, '');
  if (data.seo.url) {
    const url = new URL(data.seo.url);
    assert(['https:', 'http:'].includes(url.protocol), 'URL SEO harus HTTP(S)');
    html = html.replace('</head>', `  <link rel="canonical" href="${escape(url.href)}">\n  <meta property="og:url" content="${escape(url.href)}">\n</head>`);
  }
  await writeFile(htmlPath, html);
  console.log('Metadata HTML diselaraskan dari data.js.');
}
console.log(`Lulus: data, anchor, ${new Set(assets.filter(Boolean)).size} path aset, modul, CDN, dan fallback form.`);
