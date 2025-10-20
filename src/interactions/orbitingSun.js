import { assetPath } from '../utils/assetPath.js';

export function initOrbitingSun(cleanups) {
  const mqlReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reduceMotion = !!mqlReduce?.matches;

  const heroBg = document.querySelector('.hero .bg-hero');
  const picture = heroBg?.querySelector('picture');
  const staticSun = heroBg?.querySelector('.sun');

  if (!heroBg || !picture || reduceMotion) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const ORBIT_SECS = 60;
  const DEFAULT_PATH_INDEX = 0;

  // --- State ---
  let overlay = null;
  let currentSrc = '';
  let lastSizeKey = '';
  let resizeTimeout;
  let roTimeout;
  let orientationTimeout;
  let frameId;
  let requestId = 0;
  let disposed = false;
  let controller = null; // AbortController for fetch

  // Track original position
  const originalPosition = picture.style.position;
  let positionAdjusted = false;

  const imageEl = picture.querySelector('img');
  let imageLoadHandler;

  // Size of the orbiting sun
  const sunPx = () => (window.innerWidth <= 480 ? 60 : window.innerWidth <= 1180 ? 80 : 100);

  const resetTracking = () => {
    currentSrc = '';
    lastSizeKey = '';
  };

  const cleanupOverlay = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = undefined;
    }
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    if (positionAdjusted) {
      picture.style.position = originalPosition;
      positionAdjusted = false;
    }
    if (staticSun) {
      staticSun.style.display = '';
    }
  };

  // Unique ids per render to avoid collisions if multiple heroes exist
  const uid = () => `hs-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

  const makeDefs = (svgRoot, cw, ch, idSuffix) => {
    let defs = svgRoot.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS(svgNS, 'defs');
      svgRoot.appendChild(defs);
    }

    // Bloom filter for the sun (subtle)
    const bloomId = `sun-bloom-${idSuffix}`;
    const bloom = document.createElementNS(svgNS, 'filter');
    bloom.setAttribute('id', bloomId);
    bloom.setAttribute('x', '-50%');
    bloom.setAttribute('y', '-50%');
    bloom.setAttribute('width', '200%');
    bloom.setAttribute('height', '200%');
    bloom.innerHTML = `
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="
        1 0 0 0 0
        0 0.55 0 0 0
        0 0 0 0 0
        0 0 0 1 0" result="tint"/>
      <feBlend in="SourceGraphic" in2="tint" mode="screen"/>
    `;
    defs.appendChild(bloom);

    // Slight softening for some stars
    const starBlurId = `star-blur-${idSuffix}`;
    const starBlur = document.createElementNS(svgNS, 'filter');
    starBlur.setAttribute('id', starBlurId);
    starBlur.innerHTML = `<feGaussianBlur in="SourceGraphic" stdDeviation="0.35"/>`;
    defs.appendChild(starBlur);

    // Vignette / top-left cool light
    const vignetteId = `vignette-${idSuffix}`;
    const vign = document.createElementNS(svgNS, 'radialGradient');
    vign.setAttribute('id', vignetteId);
    vign.setAttribute('gradientUnits', 'userSpaceOnUse');
    vign.setAttribute('cx', String(cw * 0.08));
    vign.setAttribute('cy', String(ch * 0.06));
    vign.setAttribute('r', String(Math.max(cw, ch) * 0.6));
    vign.innerHTML = `
      <stop offset="0%"   stop-color="rgb(28,177,212)" stop-opacity="0.22"/>
      <stop offset="60%"  stop-color="rgb(28,177,212)" stop-opacity="0.0"/>
    `;
    defs.appendChild(vign);

    return { bloomId, vignetteId, starBlurId };
  };

  // Create a starfield group with subtle, randomized twinkle.
  // Create a starfield group with subtle, randomized twinkle + slow drift.
const createStarfield = (cw, ch, starBlurId) => {
  const base = Math.min(180, Math.max(60, Math.round((cw * ch) / 9000)));
  const farCount  = Math.round(base * 0.70); // tiny, more numerous (farther)
  const nearCount = Math.round(base * 0.30); // slightly larger (closer)

  const gRoot = document.createElementNS(svgNS, 'g');
  gRoot.setAttribute('class', 'starfield');

  const makeLayer = (count, sizeMin, sizeMax, baseOpacity, blurChance) => {
    const layer = document.createElementNS(svgNS, 'g');
    for (let i = 0; i < count; i++) {
      const c = document.createElementNS(svgNS, 'circle');
      const r = sizeMin + Math.random() * (sizeMax - sizeMin);
      const x = Math.random() * cw;
      const y = Math.random() * ch;
      c.setAttribute('cx', Math.max(1, Math.min(cw - 1, x)).toFixed(2));
      c.setAttribute('cy', Math.max(1, Math.min(ch - 1, y)).toFixed(2));
      c.setAttribute('r',  r.toFixed(2));
      c.setAttribute('fill', '#fff');
      c.setAttribute('opacity', (baseOpacity * (0.7 + Math.random() * 0.6)).toFixed(2));
      if (Math.random() < blurChance) c.setAttribute('filter', `url(#${starBlurId})`);

      const tw = document.createElementNS(svgNS, 'animate');
      tw.setAttribute('attributeName', 'opacity');
      const o1 = (0.35 + Math.random() * 0.4) * baseOpacity;
      const o2 = (0.85 + Math.random() * 0.15) * baseOpacity;
      tw.setAttribute('values', `${o1.toFixed(2)};${o2.toFixed(2)};${o1.toFixed(2)}`);
      tw.setAttribute('dur', `${(2.5 + Math.random() * 3.5).toFixed(2)}s`);
      tw.setAttribute('repeatCount', 'indefinite');
      tw.setAttribute('begin', `${(-Math.random() * 5).toFixed(2)}s`);
      c.appendChild(tw);

      layer.appendChild(c);
    }
    return layer;
  };

  // Far layer: slower, smaller drift
  const far = makeLayer(farCount, 0.4, 0.9, 0.55, 0.25);
  const farDrift = document.createElementNS(svgNS, 'animateTransform');
  farDrift.setAttribute('attributeName', 'transform');
  farDrift.setAttribute('type', 'translate');
  // Drift ~(+28px,+12px) over 90s then loop back
  farDrift.setAttribute('values', `0 0; 28 12; 0 0`);
  farDrift.setAttribute('dur', '90s');
  farDrift.setAttribute('repeatCount', 'indefinite');
  farDrift.setAttribute('calcMode', 'spline');
  farDrift.setAttribute('keySplines', '0.4 0 0.2 1; 0.4 0 0.2 1');
  far.appendChild(farDrift);

  // Near layer: slightly faster/larger drift for parallax feel
  const near = makeLayer(nearCount, 0.8, 1.6, 0.75, 0.35);
  const nearDrift = document.createElementNS(svgNS, 'animateTransform');
  nearDrift.setAttribute('attributeName', 'transform');
  nearDrift.setAttribute('type', 'translate');
  // Drift ~(+40px,+18px) over 60s then loop back
  nearDrift.setAttribute('values', `0 0; 40 18; 0 0`);
  nearDrift.setAttribute('dur', '60s');
  nearDrift.setAttribute('repeatCount', 'indefinite');
  nearDrift.setAttribute('calcMode', 'spline');
  nearDrift.setAttribute('keySplines', '0.4 0 0.2 1; 0.4 0 0.2 1');
  near.appendChild(nearDrift);

  gRoot.appendChild(far);
  gRoot.appendChild(near);
  return gRoot;
};


  const initFromCurrentPicture = async () => {
    if (disposed) return;
    const img = imageEl || picture.querySelector('img');
    if (!img) return;

    const cw = picture.clientWidth || 1432;
    const ch = picture.clientHeight || 821;

    const src = img.currentSrc || img.src;
    const sizeKey = `${cw}x${ch}-s${sunPx()}`;

    if (!src || (src === currentSrc && sizeKey === lastSizeKey)) {
      return;
    }

    currentSrc = src;
    lastSizeKey = sizeKey;
    const fetchToken = ++requestId;

    // Abort previous fetch if any
    if (controller) controller.abort();
    controller = new AbortController();

    let svgText = '';
    try {
      const response = await fetch(src, { cache: 'force-cache', signal: controller.signal });
      const contentType = response.headers.get('content-type') || '';
      const isSvg = /image\/svg\+xml/i.test(contentType) || src.trim().toLowerCase().endsWith('.svg');

      // CORS opaque or wrong type → fallback gracefully
      if (!isSvg || response.type === 'opaque') {
        throw new Error(`Expected SVG; got type=${response.type} content-type=${contentType}`);
      }

      svgText = await response.text();
    } catch (error) {
      if (error.name === 'AbortError') return;
      console.warn('Orbit: could not load SVG:', error);
      cleanupOverlay();
      resetTracking();
      return;
    }

    if (disposed || fetchToken !== requestId) return;

    let doc;
    try {
      doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    } catch (error) {
      console.warn('Orbit: invalid SVG:', error);
      cleanupOverlay();
      resetTracking();
      return;
    }

    const root = doc.querySelector('svg');
    const paths = root ? Array.from(doc.querySelectorAll('path')) : [];
    const chosenIndex = Number.isInteger(+picture?.dataset?.orbitPathIndex) ? +picture.dataset.orbitPathIndex : DEFAULT_PATH_INDEX;
    const chosenPath = paths[chosenIndex] || paths[0];

    if (!root || !chosenPath) {
      cleanupOverlay();
      resetTracking();
      return;
    }

    const widthAttr = root.getAttribute('width') || cw;
    const heightAttr = root.getAttribute('height') || ch;
    const viewBox = root.getAttribute('viewBox') || `0 0 ${widthAttr} ${heightAttr}`;
    const pathData = chosenPath.getAttribute('d');
    if (!pathData) {
      cleanupOverlay();
      resetTracking();
      return;
    }

    cleanupOverlay();

    // --- Build overlay SVG with effects ---
    overlay = document.createElementNS(svgNS, 'svg');
    overlay.setAttribute('class', 'orbit-overlay');
    overlay.setAttribute('viewBox', viewBox);
    overlay.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';

    const idSuffix = uid();
    const { bloomId, vignetteId, starBlurId } = makeDefs(overlay, cw, ch, idSuffix);

    // 1) Background light & vignette (subtle, 'screen' blend)
    const fxLayer = document.createElementNS(svgNS, 'rect');
    fxLayer.setAttribute('x', '0'); fxLayer.setAttribute('y', '0');
    fxLayer.setAttribute('width', '100%'); fxLayer.setAttribute('height', '100%');
    fxLayer.setAttribute('fill', `url(#${vignetteId})`);
    fxLayer.style.mixBlendMode = 'screen';
    fxLayer.setAttribute('opacity', '0.85');
    overlay.appendChild(fxLayer);

    // 2) Starfield (behind the sun/orbits)
    const stars = createStarfield(cw, ch, starBlurId);
    overlay.appendChild(stars);

    // 3) Sun group (image with mild bloom) moving along the SVG orbit
    const sunGroup = document.createElementNS(svgNS, 'g');
    const size = sunPx();

    const sunImage = document.createElementNS(svgNS, 'image');
    sunImage.setAttribute('width', String(size));
    sunImage.setAttribute('height', String(size));
    sunImage.setAttribute('x', String(-size / 2));
    sunImage.setAttribute('y', String(-size / 2));
    const sunSource = assetPath('assets/img/sun.svg');
    sunImage.setAttributeNS(xlinkNS, 'xlink:href', sunSource);
    sunImage.setAttribute('href', sunSource);
    sunImage.setAttribute('filter', `url(#${bloomId})`);
    sunGroup.appendChild(sunImage);

    const animateMotion = document.createElementNS(svgNS, 'animateMotion');
    animateMotion.setAttribute('dur', `${ORBIT_SECS}s`);
    animateMotion.setAttribute('repeatCount', 'indefinite');
    animateMotion.setAttribute('rotate', 'auto');
    animateMotion.setAttribute('path', pathData);
    animateMotion.setAttribute('begin', '0s');
    sunGroup.appendChild(animateMotion);

    overlay.appendChild(sunGroup);

    const computedPosition = window.getComputedStyle(picture).position;
    if ((!picture.style.position || picture.style.position === 'static') && computedPosition === 'static') {
      picture.style.position = 'relative';
      positionAdjusted = true;
    }

    picture.appendChild(overlay);

    if (staticSun) {
      staticSun.style.display = 'none';
    }

    frameId = requestAnimationFrame(() => {
      if (typeof animateMotion.beginElement === 'function') {
        animateMotion.beginElement();
      }
    });

  };

  // Initial boot
  initFromCurrentPicture();

  // Re-init on image load (source swap)
  if (imageEl) {
    imageLoadHandler = () => { !disposed && initFromCurrentPicture(); };
    imageEl.addEventListener('load', imageLoadHandler);
  }

  // ResizeObserver (guarded)
  let resizeObserver;
  try {
    resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(roTimeout);
      roTimeout = window.setTimeout(() => {
        if (!disposed) initFromCurrentPicture();
      }, 120);
    });
    resizeObserver.observe(picture);
  } catch (e) {
    console.warn('Orbit: ResizeObserver failed', e);
  }

  // Window resize/orientation
  const handleResize = () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => { !disposed && initFromCurrentPicture(); }, 200);
  };
  const handleOrientation = () => {
    window.clearTimeout(orientationTimeout);
    orientationTimeout = window.setTimeout(() => { !disposed && initFromCurrentPicture(); }, 250);
  };
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleOrientation, { passive: true });

  // Live reduced-motion changes
  const onMotionChange = (e) => {
    if (e.matches) {
      // turned ON reduce motion -> stop effects & show static
      if (controller) controller.abort();
      cleanupOverlay();
    } else {
      // turned OFF -> (re)start
      initFromCurrentPicture();
    }
  };
  try {
    mqlReduce?.addEventListener?.('change', onMotionChange);
    // Fallback for older Safari
    mqlReduce?.addListener?.(onMotionChange);
  } catch {}

  // Cleanup
  cleanups.push(() => {
    disposed = true;
    if (controller) controller.abort();
    window.clearTimeout(resizeTimeout);
    window.clearTimeout(roTimeout);
    window.clearTimeout(orientationTimeout);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientation);
    if (imageEl && imageLoadHandler) {
      imageEl.removeEventListener('load', imageLoadHandler);
    }
    try {
      resizeObserver?.disconnect();
    } catch {}
    try {
      mqlReduce?.removeEventListener?.('change', onMotionChange);
      mqlReduce?.removeListener?.(onMotionChange);
    } catch {}
    cleanupOverlay();
  });
}
