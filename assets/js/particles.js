// Canvas dibatasi DPR 1.5 dan 60 partikel; berhenti saat tab tidak terlihat.
export function startParticles(canvas, count = 38) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};
  let width, height, frame = 0, previous = 0, night, color;
  const total = Math.max(0, Math.min(60, Number(count) || 0));
  const particles = Array.from({ length: innerWidth < 600 ? Math.min(20, total) : total }, () => ({ x: Math.random(), y: Math.random(), radius: .5 + Math.random() * 1.5, speed: .006 + Math.random() * .012, alpha: .1 + Math.random() * .3 }));
  function palette() {
    night = document.documentElement.dataset.theme === 'night';
    const style = getComputedStyle(document.documentElement);
    color = style.getPropertyValue(night ? '--sunset' : '--parchment-dark').trim();
  }
  function resize() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function draw(time) {
    const dt = previous ? Math.min((time - previous) / 1000, .05) : 0; previous = time;
    ctx.clearRect(0, 0, width, height); ctx.fillStyle = color;
    for (const particle of particles) {
      particle.x = (particle.x + particle.speed * dt + 1) % 1;
      particle.y = (particle.y + (night ? -1 : .25) * particle.speed * dt + 1) % 1;
      ctx.globalAlpha = particle.alpha;
      ctx.beginPath(); ctx.arc(particle.x * width, particle.y * height, particle.radius, 0, Math.PI * 2); ctx.fill();
    }
    frame = requestAnimationFrame(draw);
  }
  function visibility() {
    cancelAnimationFrame(frame); previous = 0;
    if (!document.hidden) frame = requestAnimationFrame(draw);
  }
  resize(); palette(); visibility();
  window.addEventListener('resize', resize);
  window.addEventListener('dusty-theme', palette);
  document.addEventListener('visibilitychange', visibility);
  return () => {
    cancelAnimationFrame(frame); ctx.clearRect(0, 0, width, height);
    window.removeEventListener('resize', resize);
    window.removeEventListener('dusty-theme', palette);
    document.removeEventListener('visibilitychange', visibility);
  };
}
