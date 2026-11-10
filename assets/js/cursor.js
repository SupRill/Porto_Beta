// Cursor native tetap tersedia; crosshair dekoratif hanya untuk mouse presisi.
export function startCursor(cursor) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  let x = -100, y = -100, targetX = x, targetY = y, frame = 0, scale = 1, targetScale = 1;
  const holes = new Set();
  function draw() {
    x += (targetX - x) * .24; y += (targetY - y) * .24; scale += (targetScale - scale) * .2;
    cursor.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    if (Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(targetScale - scale) > .05) frame = requestAnimationFrame(draw);
    else frame = 0;
  }
  function move(event) {
    if (event.pointerType !== 'mouse') return;
    targetX = event.clientX; targetY = event.clientY; cursor.hidden = false;
    targetScale = event.target.closest('a,button,input,textarea') ? 1.5 : 1;
    if (!frame) frame = requestAnimationFrame(draw);
  }
  function hide() { cursor.hidden = true; cancelAnimationFrame(frame); frame = 0; }
  function click(event) {
    if (!event.detail || event.target.closest('input,textarea,select,label') || holes.size >= 8) return;
    const hole = document.createElement('span');
    hole.className = 'bullet-hole'; hole.setAttribute('aria-hidden', 'true');
    hole.style.left = `${event.clientX}px`; hole.style.top = `${event.clientY}px`;
    hole.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m20 3 3 10 8-5-4 10 10 3-11 3 5 10-10-6-6 9 1-12-12-3 11-4-5-9 9 5z"/><circle cx="20" cy="21" r="6"/></svg>';
    document.body.append(hole); holes.add(hole);
    setTimeout(() => { hole.remove(); holes.delete(hole); }, 700);
  }
  document.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  document.addEventListener('click', click);
  window.addEventListener('blur', hide);
  return () => {
    hide(); holes.forEach((hole) => hole.remove()); holes.clear();
    document.removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('pointerleave', hide);
    document.removeEventListener('click', click);
    window.removeEventListener('blur', hide);
  };
}
