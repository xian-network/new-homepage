export function initOrbitingSun(cleanups) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroBg = document.querySelector('.hero .bg-hero');
  const picture = heroBg?.querySelector('picture');
  const staticSun = heroBg?.querySelector('.sun');

  if (!heroBg || !picture || reduceMotion) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const ORBIT_SECS = 60;

  let overlay = null;
  let currentSrc = '';
  let lastSizeKey = '';
  let resizeTimeout;
  let roTimeout;
  let orientationTimeout;

  const sunPx = () => (window.innerWidth <= 480 ? 60 : window.innerWidth <= 1180 ? 80 : 100);

  const cleanupOverlay = () => {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
    if (staticSun) {
      staticSun.style.display = '';
    }
  };

  const updateSunSize = () => {
    if (!overlay) return;
    const circle = overlay.querySelector('#sun-circle');
    const sunImage = overlay.querySelector('#sun-image');
    const radius = sunPx() / 2;

    if (circle) {
      circle.setAttribute('r', radius.toString());
    }

    if (sunImage) {
      sunImage.setAttribute('width', sunPx().toString());
      sunImage.setAttribute('height', sunPx().toString());
      sunImage.setAttribute('x', (-sunPx() / 2).toString());
      sunImage.setAttribute('y', (-sunPx() / 2).toString());
    }
  };

  const createOverlay = () => {
    cleanupOverlay();
    overlay = document.createElementNS(svgNS, 'svg');
    overlay.setAttribute('class', 'sun-overlay');
    overlay.setAttribute('viewBox', '0 0 100 100');
    overlay.setAttribute('xmlns:xlink', xlinkNS);

    const defs = document.createElementNS(svgNS, 'defs');
    const orbitPath = document.createElementNS(svgNS, 'path');
    orbitPath.setAttribute('id', 'orbit-path');
    orbitPath.setAttribute('d', 'M50,10 C80,10 90,30 90,50 C90,70 80,90 50,90 C20,90 10,70 10,50 C10,30 20,10 50,10Z');
    defs.appendChild(orbitPath);
    overlay.appendChild(defs);

    const sunGroup = document.createElementNS(svgNS, 'g');
    sunGroup.setAttribute('class', 'sun-group');

    const sunCircle = document.createElementNS(svgNS, 'circle');
    sunCircle.setAttribute('id', 'sun-circle');
    sunCircle.setAttribute('fill', 'url(#sun-gradient)');
    sunGroup.appendChild(sunCircle);

    const sunImage = document.createElementNS(svgNS, 'image');
    sunImage.setAttribute('id', 'sun-image');
    sunImage.setAttributeNS(xlinkNS, 'xlink:href', './assets/img/sun.svg');
    sunImage.setAttribute('width', sunPx().toString());
    sunImage.setAttribute('height', sunPx().toString());
    sunImage.setAttribute('x', (-sunPx() / 2).toString());
    sunImage.setAttribute('y', (-sunPx() / 2).toString());
    sunImage.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    sunGroup.appendChild(sunImage);

    const animateMotion = document.createElementNS(svgNS, 'animateMotion');
    animateMotion.setAttribute('dur', `${ORBIT_SECS}s`);
    animateMotion.setAttribute('repeatCount', 'indefinite');

    const mpath = document.createElementNS(svgNS, 'mpath');
    mpath.setAttributeNS(xlinkNS, 'xlink:href', '#orbit-path');

    animateMotion.appendChild(mpath);
    sunGroup.appendChild(animateMotion);
    overlay.appendChild(sunGroup);

    heroBg.appendChild(overlay);
    updateSunSize();

    if (staticSun) {
      staticSun.style.display = 'none';
    }
  };

  const createOverlayWhenReady = () => {
    const sources = picture.querySelectorAll('source');
    const fallback = picture.querySelector('img');
    const activeSource = Array.from(sources).find((source) => {
      const media = source.getAttribute('media');
      return !media || window.matchMedia(media).matches;
    });

    const src = activeSource?.getAttribute('srcset') || fallback?.getAttribute('src');

    if (!src || src === currentSrc) return;

    currentSrc = src;
    createOverlay();
  };

  const resizeObserver = new ResizeObserver(() => {
    window.clearTimeout(roTimeout);
    roTimeout = window.setTimeout(updateSunSize, 100);
  });

  const handleResize = () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      const sizeKey = `${window.innerWidth}-${window.innerHeight}`;
      if (sizeKey !== lastSizeKey) {
        lastSizeKey = sizeKey;
        updateSunSize();
      }
    }, 150);
  };

  const handleOrientation = () => {
    window.clearTimeout(orientationTimeout);
    orientationTimeout = window.setTimeout(() => {
      cleanupOverlay();
      createOverlayWhenReady();
    }, 300);
  };

  createOverlayWhenReady();
  resizeObserver.observe(heroBg);
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleOrientation);

  cleanups.push(() => {
    window.clearTimeout(resizeTimeout);
    window.clearTimeout(roTimeout);
    window.clearTimeout(orientationTimeout);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientation);
    resizeObserver.disconnect();
    cleanupOverlay();
  });
}
