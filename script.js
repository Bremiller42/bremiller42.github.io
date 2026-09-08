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

const GREEN = [51, 255, 51];
const SKYAN = [21, 198, 196];

function updateMorph() {
    const scrollableHeight = document.body.scrollHeight - window.innerHeight;
    const t = clamp(window.scrollY / scrollableHeight);

    const accentColor = lerpColor(GREEN, SKYAN, t);
    const radius = lerp(0, 8, t);
    const scanLine = lerp(1, 0, Math.min(t * 3, 1));

    const root = document.documentElement.style;
    root.setProperty(--accent, accentColor);
    root.setProperty(--morph-radius, `${radius}px`);
    root.setProperty(--scanline-opacity, scanLine);
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
})

updateMorph();