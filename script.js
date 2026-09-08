function lerp(start, end, t) {
  return start + (end - start) * t;
}

function clamp(t) {
  return Math.max(0, Math.min(1, t));
}

function lerpColor(rgbStart, rgbEnd, t) {
  const r = Math.round(lerp(rgbStart[0], rgbEnd[0], t));
  const g = Math.round(lerp(rgbStart[1], rgbEnd[1], t));
  const b = Math.round(lerp(rgbStart[2], rgbEnd[2], t));
  return `rgb(${r}, ${g}, ${b})`;
}

function elementProgress(el) {
  const rect = el.getBoundingClientRect();
  const raw = 1 - (rect.top / window.innerHeight);
  return clamp(raw);
}

const GREEN = [51, 255, 51];
const SKYAN = [21, 198, 196];

const textEls = document.querySelectorAll(' h2, h3, p, .terminal-label');
const shapeEls = document.querySelectorAll('.project-card, .tag');
const heroH1 = document.querySelector('header h1');

function updateMorph() {
  // Header: driven by overall page scroll, not its own position (it's pinned)
  const scrollableHeight = document.body.scrollHeight - window.innerHeight;
  const pageT = clamp(window.scrollY / scrollableHeight);
  const headerT = clamp(pageT / 0.25); // fully morphed by 25% down the page

  if (heroH1) {
    const retro = heroH1.querySelector('.font-retro');
    const future = heroH1.querySelector('.font-future');
    if (retro && future) {
      const retroOpacity = 1 - clamp(headerT / 0.45);
      const futureOpacity = clamp((headerT - 0.55) / 0.45);
      retro.style.opacity = retroOpacity;
      future.style.opacity = futureOpacity;
    }
  }

  // Everything else: still driven by each element's own scroll position
  textEls.forEach(el => {
    const t = elementProgress(el);
    el.style.color = lerpColor(GREEN, SKYAN, t);
    el.style.fontFamily = t > 0.5 ? "'Inter', sans-serif" : "'VT323', monospace";
  });

  shapeEls.forEach(el => {
    const t = elementProgress(el);
    const isTag = el.classList.contains('tag');
    const maxRadius = isTag ? 20 : 8;
    el.style.borderRadius = lerp(0, maxRadius, t) + 'px';
  });

  document.documentElement.style.setProperty('--scanline-opacity', lerp(1, 0, Math.min(pageT * 3, 1)));
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateMorph();
      ticking = false;
    });
    ticking = true;
  }
});

updateMorph();