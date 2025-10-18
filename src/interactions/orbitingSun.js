import { assetPath } from '../utils/assetPath.js';

export function initOrbitingSun(cleanups) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroBg = document.querySelector('.hero .bg-hero');
  const picture = heroBg?.querySelector('picture');
  const staticSun = heroBg?.querySelector('.sun');

  if (!heroBg || !picture || reduceMotion) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const ORBIT_SECS = 60;
  const PATH_INDEX = 0;

  let overlay = null;
  let currentSrc = '';
  let lastSizeKey = '';
  let resizeTimeout;
  let roTimeout;
  let orientationTimeout;
  let frameId;
  let requestId = 0;
  let disposed = false;

  const originalPosition = picture.style.position;
  let positionAdjusted = false;
  const imageEl = picture.querySelector('img');
  let imageLoadHandler;

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

  const initFromCurrentPicture = async () => {
    if (disposed) return;
    const img = imageEl || picture.querySelector('img');
    if (!img) return;

    const src = img.currentSrc || img.src;
    const sizeKey = `${picture.clientWidth}x${picture.clientHeight}-s${sunPx()}`;

    if (!src || (src === currentSrc && sizeKey === lastSizeKey)) {
      return;
    }

    currentSrc = src;
    lastSizeKey = sizeKey;
    const fetchToken = ++requestId;

    let svgText = '';
    try {
      const response = await fetch(src, { cache: 'force-cache' });
      const contentType = response.headers.get('content-type') || '';
      const isSvg = /image\/svg\+xml/i.test(contentType) || src.trim().toLowerCase().endsWith('.svg');

      if (!isSvg) {
        throw new Error(`Expected SVG but received content-type: ${contentType}`);
      }

      svgText = await response.text();
    } catch (error) {
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
    const chosenPath = paths[PATH_INDEX] || paths[0];

    if (!root || !chosenPath) {
      cleanupOverlay();
      resetTracking();
      return;
    }

    const widthAttr = root.getAttribute('width') || picture.clientWidth || 1432;
    const heightAttr = root.getAttribute('height') || picture.clientHeight || 821;
    const viewBox = root.getAttribute('viewBox') || `0 0 ${widthAttr} ${heightAttr}`;
    const pathData = chosenPath.getAttribute('d');

    if (!pathData) {
      cleanupOverlay();
      resetTracking();
      return;
    }

    cleanupOverlay();

    overlay = document.createElementNS(svgNS, 'svg');
    overlay.setAttribute('class', 'orbit-overlay');
    overlay.setAttribute('viewBox', viewBox);
    overlay.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';

    const sunGroup = document.createElementNS(svgNS, 'g');
    const sunImage = document.createElementNS(svgNS, 'image');
    const size = sunPx();

    sunImage.setAttribute('width', String(size));
    sunImage.setAttribute('height', String(size));
    sunImage.setAttribute('x', String(-size / 2));
    sunImage.setAttribute('y', String(-size / 2));
    const sunSource = assetPath('assets/img/sun.svg');
    sunImage.setAttributeNS(xlinkNS, 'xlink:href', sunSource);
    sunImage.setAttribute('href', sunSource);
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
    if (
      (!picture.style.position || picture.style.position === 'static') &&
      computedPosition === 'static'
    ) {
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

  initFromCurrentPicture();

  if (imageEl) {
    imageLoadHandler = () => {
      if (!disposed) {
        initFromCurrentPicture();
      }
    };
    imageEl.addEventListener('load', imageLoadHandler);
  }

  const resizeObserver = new ResizeObserver(() => {
    window.clearTimeout(roTimeout);
    roTimeout = window.setTimeout(() => {
      if (!disposed) {
        initFromCurrentPicture();
      }
    }, 120);
  });

  resizeObserver.observe(picture);

  const handleResize = () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(() => {
      if (!disposed) {
        initFromCurrentPicture();
      }
    }, 200);
  };

  const handleOrientation = () => {
    window.clearTimeout(orientationTimeout);
    orientationTimeout = window.setTimeout(() => {
      if (!disposed) {
        initFromCurrentPicture();
      }
    }, 250);
  };

  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleOrientation, { passive: true });

  cleanups.push(() => {
    disposed = true;
    window.clearTimeout(resizeTimeout);
    window.clearTimeout(roTimeout);
    window.clearTimeout(orientationTimeout);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientation);
    if (imageEl && imageLoadHandler) {
      imageEl.removeEventListener('load', imageLoadHandler);
    }
    resizeObserver.disconnect();
    cleanupOverlay();
  });
}
