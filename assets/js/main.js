import { data } from './data.js';
import { startParticles } from './particles.js';
import { startCursor } from './cursor.js';

const $ = (selector) => document.querySelector(selector);
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

// URL dari konfigurasi tetap divalidasi. Tidak menjalankan skema javascript/data.
function safeURL(value, type = 'link') {
  if (!value || String(value).includes('[[')) return '';
  try {
    const url = new URL(value, document.baseURI);
    const protocols = type === 'link' ? ['https:', 'http:', 'mailto:'] : ['https:', 'http:'];
    return protocols.includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}
function text(selector, value) { $(selector).textContent = value; }
function linkHTML(label, value) {
  const url = safeURL(value);
  return url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>` : `<span>${escapeHTML(label)} belum tersedia</span>`;
}
function setImage(image, source, fallback) {
  image.addEventListener('error', () => { image.src = fallback; }, { once: true });
  image.src = safeURL(source, 'asset') || fallback;
}
function stored(key) { try { return localStorage.getItem(key); } catch { return null; } }
function store(key, value) { try { localStorage.setItem(key, value); } catch { /* Mode privat tetap berjalan. */ } }
function toggleState(button, active) {
  button.setAttribute('aria-pressed', String(active));
  button.querySelector('.option-state').textContent = active ? 'Aktif' : 'Mati';
}

function render() {
  document.title = data.seo.title;
  $('meta[name="description"]').content = data.seo.description;
  $('meta[property="og:title"]').content = data.seo.title;
  $('meta[property="og:description"]').content = data.seo.description;
  $('meta[property="og:image"]').content = safeURL(data.seo.image, 'asset');
  const siteURL = safeURL(data.seo.url, 'asset');
  if (siteURL) {
    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelector('meta[property="og:url"]')?.remove();
    const canonical = document.createElement('link');
    canonical.rel = 'canonical'; canonical.href = siteURL; document.head.append(canonical);
    const ogURL = document.createElement('meta');
    ogURL.setAttribute('property', 'og:url'); ogURL.content = siteURL; document.head.append(ogURL);
  }
  text('#brand', data.themeName);
  text('.telegram-heading span', data.themeName);
  text('#hero-name', data.name);
  text('#hero-role', data.role);
  text('#hero-tagline', data.tagline);
  text('#hero-location', data.location);
  text('#profile-caption', data.profile.caption);
  setImage($('#profile'), data.profile.image, 'assets/img/profile.svg');
  $('#profile').alt = data.profile.alt;
  $('#about-copy').innerHTML = data.about.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join('');
  text('#signature', data.name);
  $('#credentials').innerHTML = [...data.education, ...data.certificates].map((item) => `<p>${escapeHTML(item)}</p>`).join('');
  const cvURL = safeURL(data.cv, 'asset');
  if (cvURL) { $('#cv-link').href = cvURL; $('#cv-link').hidden = false; }
  $('#skill-list').innerHTML = data.skills.map((skill) => {
    const numeric = typeof skill.level === 'number' && Number.isFinite(skill.level);
    const level = numeric ? Math.max(0, Math.min(100, skill.level)) : String(skill.level);
    const meter = numeric ? `<div class="ink-track" role="meter" aria-label="${escapeHTML(skill.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${level}"><div class="ink-fill" style="width:${level}%"></div></div>` : '';
    return `<div class="skill-row"><div class="skill-label"><span>${escapeHTML(skill.name)}</span><span>${escapeHTML(level)}${numeric ? '%' : ''}</span></div><small>${escapeHTML(skill.detail)}</small>${meter}</div>`;
  }).join('') || '<p>Inventaris sedang disiapkan.</p>';
  $('#project-list').innerHTML = data.projects.map((project, index) => `<article class="poster reveal" style="--rotation:${[-2, 1.5, -1, 2][index % 4]}deg">
    <div class="poster-inner">
      <div class="poster-face poster-front" id="front-${index}"><div class="wanted" aria-hidden="true">WANTED</div><img data-project-image="${index}" src="assets/img/project.svg" alt="${escapeHTML(project.alt)}" width="1200" height="750" loading="lazy" decoding="async"><h3>${escapeHTML(project.title)}</h3><p class="poster-category">${escapeHTML(project.category)}</p><button type="button" data-flip="${index}" aria-controls="back-${index}" aria-expanded="false" aria-label="Balik poster ${escapeHTML(project.title)}">Balik poster</button></div>
      <div class="poster-face poster-back" id="back-${index}" inert aria-hidden="true"><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p><div class="tech">${project.tech.map(escapeHTML).join(' / ')}</div><div class="project-links">${linkHTML('Demo', project.demo)}${linkHTML('GitHub', project.github)}</div>${project.completed ? '<span class="stamp">SELESAI</span>' : '<p class="note">Catatan proyek</p>'}<button type="button" data-flip="${index}" aria-controls="front-${index}" aria-label="Kembali ke poster ${escapeHTML(project.title)}">Kembali ke poster</button></div>
    </div></article>`).join('') || '<p>Belum ada buronan di papan ini.</p>';
  document.querySelectorAll('[data-project-image]').forEach((image) => setImage(image, data.projects[image.dataset.projectImage].image, 'assets/img/project.svg'));
  $('#experience-list').innerHTML = data.experience.map((item) => `<li class="journey-stop reveal"><span class="marker" aria-hidden="true">×</span><time>${escapeHTML(item.period)}</time><h3>${escapeHTML(item.position)}</h3><p class="company">${escapeHTML(item.company)}</p><p>${escapeHTML(item.description)}</p></li>`).join('') || '<li>Perjalanan baru akan dimulai.</li>';
  $('.route').hidden = !data.experience.length;
  text('#contact-intro', data.contact.intro);
  const email = data.contact.email.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    $('#email-link').href = `mailto:${encodeURIComponent(email)}`;
    text('#email-link', email); $('#email-link').hidden = false;
  }
  const socials = [['GitHub', data.contact.github], ['LinkedIn', data.contact.linkedin], ['Instagram', data.contact.instagram]];
  if (/^\d{8,15}$/.test(data.contact.whatsapp)) socials.push(['WhatsApp', `https://wa.me/${data.contact.whatsapp}`]);
  $('#social-links').innerHTML = socials.filter(([, url]) => safeURL(url)).map(([label, url]) => linkHTML(`✦ ${label}`, url)).join('');
  text('#year', new Date().getFullYear()); text('#footer-name', data.themeName);
}

let paused = stored('dusty-motion') === 'paused';
let animationContext;
let cleanupParticles = () => {};
let cleanupCursor = () => {};
const motionAllowed = () => !reduced.matches && !paused;

function setupMotion() {
  cleanupParticles(); cleanupCursor(); animationContext?.revert();
  const enabled = motionAllowed();
  root.classList.toggle('motion-on', enabled);
  root.classList.toggle('motion-paused', !enabled);
  document.querySelectorAll('.poster').forEach((poster) => { poster.style.transform = ''; });
  toggleState($('#motion-toggle'), !enabled);
  $('#motion-toggle').disabled = reduced.matches;
  $('#motion-help').hidden = !reduced.matches;
  if (!enabled) { $('#loader').hidden = true; return; }
  cleanupParticles = startParticles($('#dust'), data.motion.particles);
  cleanupCursor = startCursor($('#cursor'));
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return; // CDN gagal: konten tetap terlihat.
  gsap.registerPlugin(ScrollTrigger);
  animationContext = gsap.context(() => {
    const duration = Math.max(.1, Number(data.motion.duration) || .8);
    document.querySelectorAll('.reveal').forEach((element, index) => {
      gsap.from(element, { y: 24, opacity: 0, duration, delay: (index % 3) * .06, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
    });
    document.querySelectorAll('.ink-fill').forEach((element) => gsap.from(element, { scaleX: 0, duration: duration * 1.5, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 95%', once: true } }));
    gsap.to('.far', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.middle', { yPercent: 7, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: 1 } });
    const path = $('#route-line'), length = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.route-layout', start: 'top 70%', end: 'bottom 65%', scrub: .6 } });
    document.querySelectorAll('.marker').forEach((marker) => gsap.from(marker, { scale: 0, duration, ease: 'back.out(1.4)', scrollTrigger: { trigger: marker, start: 'top 85%', once: true } }));
  });
}

function intro() {
  if (!motionAllowed()) return;
  const loader = $('#loader'); loader.hidden = false;
  const message = 'Menyusuri jalan berdebu…'; let index = 0;
  text('#loading-text', '');
  const typing = setInterval(() => { text('#loading-text', message.slice(0, ++index)); if (index >= message.length) clearInterval(typing); }, 45);
  const introDuration = Math.min(2200, Math.max(600, (Number(data.motion.intro) || 1.6) * 1000));
  setTimeout(() => { clearInterval(typing); loader.classList.add('is-opening'); }, introDuration);
  setTimeout(() => { loader.hidden = true; }, introDuration + 850);
  // Intro dekoratif tidak memblokir klik atau fokus keyboard.
  document.addEventListener('keydown', () => { loader.hidden = true; clearInterval(typing); }, { once: true });
}

function navigation() {
  const menu = $('#menu-toggle'), nav = $('#nav-links');
  menu.hidden = false;
  // Offset mengikuti tinggi navbar, termasuk saat font atau viewport berubah.
  new ResizeObserver(([entry]) => {
    if (!nav.classList.contains('is-open')) root.style.setProperty('--nav-offset', `${entry.target.getBoundingClientRect().height + 16}px`);
  }).observe($('.site-header'));
  function close() { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', (event) => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { close(); menu.focus(); } });
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) {
      nav.querySelectorAll('a').forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
  new IntersectionObserver(([entry]) => {
    root.classList.toggle('hero-offscreen', !entry.isIntersecting);
    $('.site-header').classList.toggle('is-sticky', !entry.isIntersecting);
  }).observe($('#home'));
}

function posters() {
  $('#project-list').addEventListener('click', (event) => {
    const button = event.target.closest('[data-flip]'); if (!button) return;
    const poster = button.closest('.poster'), flipped = !poster.classList.contains('is-flipped');
    const front = poster.querySelector('.poster-front'), back = poster.querySelector('.poster-back');
    const visible = flipped ? back : front, hidden = flipped ? front : back;
    visible.inert = false; visible.removeAttribute('aria-hidden');
    poster.classList.toggle('is-flipped', flipped);
    front.querySelector('button').setAttribute('aria-expanded', String(flipped));
    visible.querySelector('button').focus({ preventScroll: true });
    hidden.inert = true; hidden.setAttribute('aria-hidden', 'true');
    poster.style.transform = '';
    const stamp = back.querySelector('.stamp');
    stamp?.classList.toggle('hit', flipped);
    poster.classList.toggle('shake', flipped);
  });
  document.querySelectorAll('.poster').forEach((poster) => {
    let frame = 0;
    poster.addEventListener('pointermove', (event) => {
      if (!motionAllowed() || !fine.matches || poster.classList.contains('is-flipped') || frame) return;
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        const box = poster.getBoundingClientRect();
        const x = (clientX - box.left) / box.width - .5, y = (clientY - box.top) / box.height - .5;
        poster.style.transform = `perspective(900px) translateY(-6px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg)`;
        frame = 0;
      });
    });
    poster.addEventListener('pointerleave', () => { cancelAnimationFrame(frame); frame = 0; poster.style.transform = ''; });
  });
  let frame = 0;
  $('#home').addEventListener('pointermove', (event) => {
    if (!motionAllowed() || !fine.matches || frame) return;
    const { clientX, clientY } = event;
    frame = requestAnimationFrame(() => {
      const x = (clientX / innerWidth - .5) * 14, y = (clientY / innerHeight - .5) * 8;
      $('.sun-layer').style.transform = `translate(${x}px, ${y}px)`;
      $('.landscape').style.setProperty('--mouse-x', `${-x}px`);
      $('.landscape').style.setProperty('--mouse-y', `${-y}px`); frame = 0;
    });
  });
  $('#home').addEventListener('pointerleave', () => { cancelAnimationFrame(frame); frame = 0; $('.sun-layer').style.transform = ''; $('.landscape').style.removeProperty('--mouse-x'); $('.landscape').style.removeProperty('--mouse-y'); });
}

function theme() {
  const button = $('#theme-toggle');
  function apply(value) {
    root.dataset.theme = value;
    toggleState(button, value === 'night');
    window.dispatchEvent(new Event('dusty-theme'));
  }
  apply(stored('dusty-theme') === 'night' ? 'night' : 'day');
  button.addEventListener('click', () => { const value = root.dataset.theme === 'day' ? 'night' : 'day'; apply(value); store('dusty-theme', value); });
  return apply;
}

function audio() {
  const src = safeURL(data.ambientAudio, 'asset'); if (!src) return () => {};
  const button = $('#audio-toggle'), sound = new Audio();
  sound.preload = 'none'; sound.src = src; sound.loop = true; sound.volume = .25; button.hidden = false;
  let playRequest = 0;
  function reset() { playRequest++; sound.pause(); toggleState(button, false); }
  button.addEventListener('click', async () => {
    if (!sound.paused) return reset();
    const request = ++playRequest;
    try { await sound.play(); if (request !== playRequest) { sound.pause(); return; } toggleState(button, true); text('#audio-status', ''); }
    catch { reset(); text('#audio-status', 'Audio belum dapat diputar. Periksa file audio.'); }
  });
  sound.addEventListener('error', () => { reset(); text('#audio-status', 'File audio tidak tersedia.'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) reset(); });
  return reset;
}

function accessibility(applyTheme, stopAudio) {
  const trigger = $('#accessibility-toggle'), panel = $('#accessibility-panel');
  const contrast = $('#contrast-toggle'), size = $('#text-size');
  function applyContrast(active) {
    root.classList.toggle('high-contrast', active);
    toggleState(contrast, active);
  }
  function applySize(value) {
    const valid = ['100', '112.5', '125'].includes(value) ? value : '100';
    size.value = valid;
    root.style.fontSize = `${valid}%`;
    root.classList.toggle('large-text', valid !== '100');
    window.ScrollTrigger?.refresh();
  }
  applyContrast(stored('dusty-contrast') === 'high');
  applySize(stored('dusty-text-size') || '100');
  trigger.hidden = false;
  trigger.addEventListener('click', () => {
    $('#loader').hidden = true;
    panel.showModal();
    root.classList.add('accessibility-open');
    trigger.setAttribute('aria-expanded', 'true');
  });
  panel.addEventListener('close', () => {
    root.classList.remove('accessibility-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus({ preventScroll: true });
  });
  // Dialog native menangani Escape dan halaman belakang inert; Tab tetap di panel.
  panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...panel.querySelectorAll('button:not(:disabled):not([hidden]), select')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first || !event.shiftKey && document.activeElement === last) {
      event.preventDefault(); (event.shiftKey ? last : first).focus();
    }
  });
  panel.addEventListener('click', (event) => {
    if (event.target !== panel) return;
    const box = panel.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) panel.close();
  });
  contrast.addEventListener('click', () => {
    const active = !root.classList.contains('high-contrast');
    applyContrast(active); store('dusty-contrast', active ? 'high' : 'normal');
  });
  size.addEventListener('change', () => { applySize(size.value); store('dusty-text-size', size.value); });
  $('#motion-toggle').addEventListener('click', () => { paused = !paused; store('dusty-motion', paused ? 'paused' : 'active'); setupMotion(); });
  $('#accessibility-reset').addEventListener('click', () => {
    applyTheme('day'); applyContrast(false); applySize('100'); stopAudio();
    paused = false;
    store('dusty-theme', 'day'); store('dusty-contrast', 'normal'); store('dusty-text-size', '100'); store('dusty-motion', 'active');
    setupMotion();
    text('#audio-status', '');
    text('#accessibility-status', reduced.matches ? 'Pengaturan direset. Preferensi kurangi gerakan perangkat tetap dihormati.' : 'Pengaturan kembali ke standar.');
  });
}

function contactForm() {
  const form = $('#contact-form'), fields = $('#form-fields'), status = $('#form-status');
  const submit = form.querySelector('button');
  const endpoint = safeURL(data.contact.formEndpoint, 'asset');
  // Backend dipilih Formspree. Batasi host untuk mencegah salah kirim data.
  const ready = endpoint && new URL(endpoint).origin === 'https://formspree.io' && /^\/f\/[\w-]+$/.test(new URL(endpoint).pathname);
  fields.disabled = false; form.noValidate = true;
  status.textContent = ready ? 'Alamat email hanya digunakan untuk membalas telegram Anda.' : 'Mode contoh: endpoint belum diisi. Pesan belum bisa dikirim.';
  if (ready) form.action = endpoint;
  form.addEventListener('input', (event) => { event.target.removeAttribute('aria-invalid'); event.target.setCustomValidity?.(''); });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const inputs = [...form.querySelectorAll('[required]')];
    inputs.forEach((input) => {
      input.value = input.value.trim();
      input.setCustomValidity(input.minLength > 0 && input.value.length < input.minLength ? `Isi minimal ${input.minLength} karakter.` : '');
      input.setAttribute('aria-invalid', String(!input.checkValidity()));
    });
    const invalid = inputs.find((input) => !input.checkValidity());
    if (invalid) { status.textContent = 'Periksa nama, email, dan pesan (minimal 10 karakter).'; invalid.focus(); invalid.reportValidity(); return; }
    if (!ready) { status.textContent = 'Belum dikirim. Pemilik situs perlu mengisi [[FORM_ENDPOINT]] di data.js.'; return; }
    if ($('#website').value) return;
    const payload = new FormData(form);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    submit.disabled = true; fields.disabled = true; form.setAttribute('aria-busy', 'true'); status.textContent = 'Telegram sedang dikirim…';
    try {
      const response = await fetch(endpoint, { method: 'POST', body: payload, headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!response.ok) throw new Error(response.status === 429 ? 'Terlalu banyak pengiriman. Tunggu sebentar lalu coba lagi.' : 'Server belum menerima pesan. Coba lagi atau gunakan email.');
      status.textContent = 'Telegram terkirim. Terima kasih sudah menghubungi.'; form.reset();
      inputs.forEach((input) => input.removeAttribute('aria-invalid'));
    } catch (error) {
      status.textContent = error.name === 'AbortError' ? 'Waktu tunggu habis. Pesan mungkin sudah diterima; periksa sebelum mengirim ulang. Isi tetap tersimpan di form.' : error.message === 'Failed to fetch' ? 'Koneksi gagal. Isi tetap tersimpan di form; coba lagi atau gunakan email.' : error.message;
    } finally { clearTimeout(timeout); submit.disabled = false; fields.disabled = false; form.removeAttribute('aria-busy'); }
  });
}

render();
root.classList.add('js');
const applyTheme = theme();
navigation(); posters(); contactForm();
accessibility(applyTheme, audio());
reduced.addEventListener('change', setupMotion);
fine.addEventListener('change', setupMotion);
document.addEventListener('visibilitychange', () => root.classList.toggle('page-hidden', document.hidden));
intro();
setupMotion();
// Coba ulang saat CDN defer selesai, tanpa menunda konten lokal.
window.addEventListener('load', setupMotion, { once: true });
