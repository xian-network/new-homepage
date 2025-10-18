import Swiper from 'swiper';
import 'swiper/css';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Title);

const GRAPHQL_ENDPOINT = 'https://node.xian.org/graphql';
const TRELLO_BOARD_ID = '3yPhI9gn';

function initBurgerMenu(cleanups) {
  const btn = document.querySelector('.btn_nav');
  const burger = document.querySelector('.burger');
  const headerWrapper = document.querySelector('.header-wrapper');
  if (!btn || !burger || !headerWrapper) return;

  const body = document.body;
  const bgBlur = document.querySelector('.bg-blur');
  const header = document.querySelector('.header');

  const openMenu = () => {
    burger.classList.add('active');
    headerWrapper.style.display = 'flex';
    body.classList.add('hidden');
    bgBlur?.classList.add('blur');
    header?.classList.add('blur');
  };

  const closeMenu = () => {
    burger.classList.remove('active');
    headerWrapper.style.display = '';
    body.classList.remove('hidden');
    bgBlur?.classList.remove('blur');
    header?.classList.remove('blur');
  };

  const toggleMenu = () => {
    if (window.innerWidth > 992) return;
    if (headerWrapper.style.display === 'flex') {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const clickHandler = (event) => {
    event.preventDefault();
    toggleMenu();
  };

  btn.addEventListener('click', clickHandler);
  cleanups.push(() => btn.removeEventListener('click', clickHandler));

  const closeTargets = headerWrapper.querySelectorAll('a, .main-button');
  const linkHandler = () => closeMenu();
  closeTargets.forEach((el) => el.addEventListener('click', linkHandler));
  cleanups.push(() => closeTargets.forEach((el) => el.removeEventListener('click', linkHandler)));

  const resizeHandler = () => {
    if (window.innerWidth > 992) {
      headerWrapper.style.display = '';
      closeMenu();
    }
  };

  window.addEventListener('resize', resizeHandler);
  cleanups.push(() => window.removeEventListener('resize', resizeHandler));
}

function initTypewriter(cleanups) {
  const elements = document.querySelectorAll('.typewriter-text');
  const timers = [];
  const timeouts = [];

  elements.forEach((el) => {
    const textsAttr = el.getAttribute('data-text');
    if (!textsAttr) return;
    let texts;
    try {
      texts = JSON.parse(textsAttr);
    } catch (error) {
      return;
    }
    if (!Array.isArray(texts) || texts.length === 0) return;

    let index = 0;

    const typeText = () => {
      const text = texts[index];
      let charIndex = 0;

      const intervalId = setInterval(() => {
        el.textContent = text.slice(0, charIndex + 1);
        charIndex += 1;
        if (charIndex >= text.length) {
          clearInterval(intervalId);
          const timeoutId = window.setTimeout(() => deleteText(), 2000);
          timeouts.push(timeoutId);
        }
      }, 150);
      timers.push(intervalId);
    };

    const deleteText = () => {
      const text = texts[index];
      let charIndex = text.length;
      const intervalId = setInterval(() => {
        charIndex -= 1;
        el.textContent = text.slice(0, Math.max(charIndex, 0));
        if (charIndex <= 0) {
          clearInterval(intervalId);
          index = (index + 1) % texts.length;
          typeText();
        }
      }, 150);
      timers.push(intervalId);
    };

    typeText();
  });

  cleanups.push(() => {
    timers.forEach((id) => clearInterval(id));
    timeouts.forEach((id) => clearTimeout(id));
  });
}

function initOrbitingSun(cleanups) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroBg = document.querySelector('.hero .bg-hero');
  const picture = heroBg?.querySelector('picture');
  const staticSun = heroBg?.querySelector('.sun');

  if (!heroBg || !picture || reduceMotion) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const xlinkNS = 'http://www.w3.org/1999/xlink';
  const PATH_INDEX = 0;
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
    const sunImage = overlay.querySelector('image');
    if (!sunImage) return;
    const size = sunPx();
    sunImage.setAttribute('width', String(size));
    sunImage.setAttribute('height', String(size));
    sunImage.setAttribute('x', String(-size / 2));
    sunImage.setAttribute('y', String(-size / 2));
  };

  const initFromCurrentPicture = async () => {
    const img = picture.querySelector('img');
    if (!img) return;

    const src = img.currentSrc || img.src;
    const sizeKey = `${picture.clientWidth}x${picture.clientHeight}`;
    if (src && src === currentSrc && sizeKey === lastSizeKey) {
      updateSunSize();
      return;
    }

    currentSrc = src;
    lastSizeKey = sizeKey;

    let svgText = '';
    try {
      const response = await fetch(src, { cache: 'force-cache' });
      const contentType = response.headers.get('content-type') || '';
      if (!/image\/svg\+xml/i.test(contentType)) {
        throw new Error(`Unexpected content type: ${contentType}`);
      }
      svgText = await response.text();
    } catch (error) {
      console.warn('Orbit: could not load SVG:', error);
      cleanupOverlay();
      return;
    }

    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
    const root = doc.querySelector('svg');
    const paths = [...doc.querySelectorAll('path')];
    const chosenPath = paths[PATH_INDEX] || paths[0];
    if (!root || !chosenPath) {
      cleanupOverlay();
      return;
    }

    const viewBox =
      root.getAttribute('viewBox') ||
      `0 0 ${root.getAttribute('width') || 1432} ${root.getAttribute('height') || 821}`;
    const pathData = chosenPath.getAttribute('d');
    if (!pathData) {
      cleanupOverlay();
      return;
    }

    cleanupOverlay();

    overlay = document.createElementNS(svgNS, 'svg');
    overlay.setAttribute('class', 'orbit-overlay');
    overlay.setAttribute('viewBox', viewBox);
    overlay.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    Object.assign(overlay.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    });

    const group = document.createElementNS(svgNS, 'g');
    const sunImage = document.createElementNS(svgNS, 'image');
    const size = sunPx();
    sunImage.setAttribute('width', String(size));
    sunImage.setAttribute('height', String(size));
    sunImage.setAttribute('x', String(-size / 2));
    sunImage.setAttribute('y', String(-size / 2));
    sunImage.setAttributeNS(xlinkNS, 'xlink:href', './assets/img/sun.svg');
    sunImage.setAttribute('href', './assets/img/sun.svg');
    group.appendChild(sunImage);

    const animation = document.createElementNS(svgNS, 'animateMotion');
    animation.setAttribute('dur', `${ORBIT_SECS}s`);
    animation.setAttribute('repeatCount', 'indefinite');
    animation.setAttribute('rotate', 'auto');
    animation.setAttribute('path', pathData);
    animation.setAttribute('begin', '0s');
    group.appendChild(animation);

    overlay.appendChild(group);

    picture.style.position = 'relative';
    picture.appendChild(overlay);

    if (staticSun) {
      staticSun.style.display = 'none';
    }

    requestAnimationFrame(() => {
      if (typeof animation.beginElement === 'function') {
        try {
          animation.beginElement();
        } catch (error) {
          console.warn('Orbit: failed to start animation', error);
        }
      }
    });
  };

  initFromCurrentPicture();

  const imgEl = picture.querySelector('img');
  if (imgEl) {
    const handleLoad = () => {
      initFromCurrentPicture();
      imgEl.removeEventListener('load', handleLoad);
    };
    imgEl.addEventListener('load', handleLoad);
    cleanups.push(() => imgEl.removeEventListener('load', handleLoad));
  }

  const resizeObserver = new ResizeObserver(() => {
    window.clearTimeout(roTimeout);
    roTimeout = window.setTimeout(initFromCurrentPicture, 120);
  });
  resizeObserver.observe(picture);

  const handleResize = () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(initFromCurrentPicture, 200);
  };
  const handleOrientation = () => {
    window.clearTimeout(orientationTimeout);
    orientationTimeout = window.setTimeout(initFromCurrentPicture, 250);
  };

  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleOrientation, { passive: true });

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

function initDropdowns(cleanups) {
  const dropdowns = [
    { button: document.querySelector('.buy-btn'), container: document.querySelector('.btn-group') },
    { button: document.querySelector('.get-wallet-btn'), container: document.querySelector('.btn-group2') },
  ];

  dropdowns.forEach(({ button, container }) => {
    if (!button || !container) return;

    const toggle = (event) => {
      event.preventDefault();
      const open = container.classList.toggle('open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const outsideClick = (event) => {
      if (!container.contains(event.target)) {
        container.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      }
    };

    button.addEventListener('click', toggle);
    document.addEventListener('click', outsideClick);

    cleanups.push(() => {
      button.removeEventListener('click', toggle);
      document.removeEventListener('click', outsideClick);
    });
  });
}

function initSwiper(cleanups) {
  const sliderEl = document.querySelector('.news-slider');
  if (!sliderEl) return;

  const swiperInstance = new Swiper('.news-slider', {
    slidesPerView: 2,
    spaceBetween: 90,
    allowTouchMove: true,
    loop: false,
    breakpoints: {
      992: {
        slidesPerView: 2,
        spaceBetween: 90,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
      },
    },
  });

  cleanups.push(() => swiperInstance.destroy(true, true));
}

async function loadTokens() {
  const tokenGrid = document.getElementById('token-grid');
  if (!tokenGrid) return;

  const contractsQuery = `
    query TokenContracts($first: Int!) {
      allContracts(
        first: $first,
        orderBy: CREATED_DESC,
        filter: { xsc0001: { equalTo: true } }
      ) {
        nodes {
          name
          created
        }
      }
    }
  `;

  const itemsPerPage = 3;

  try {
    const contractsResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: contractsQuery,
        variables: { first: itemsPerPage },
      }),
    });

    const contractsJson = await contractsResponse.json();
    const contracts = contractsJson?.data?.allContracts?.nodes ?? [];
    if (!contracts.length) return;

    const metaKeys = contracts.flatMap(({ name }) => [
      `${name}.metadata:token_name`,
      `${name}.metadata:token_symbol`,
    ]);

    const metadataQuery = `
      query TokenMeta($keys: [String!]!) {
        allStates(filter: { key: { in: $keys } }) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    `;

    const metadataResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: metadataQuery, variables: { keys: metaKeys } }),
    });

    const metadataJson = await metadataResponse.json();
    const metadataEdges = metadataJson?.data?.allStates?.edges ?? [];
    const metadataMap = {};

    metadataEdges.forEach(({ node }) => {
      if (!node) return;
      const [contractKey, field] = node.key.split(':');
      const contractName = contractKey.replace('.metadata', '');
      metadataMap[contractName] = metadataMap[contractName] || {};
      metadataMap[contractName][field] = node.value;
    });

    tokenGrid.innerHTML = '';

    contracts.forEach(({ name, created }) => {
      const metadata = metadataMap[name] || {};
      const tokenName = metadata.token_name || name;
      const tokenSymbol = metadata.token_symbol ? ` (${metadata.token_symbol})` : '';
      const displayName = `${tokenName}${tokenSymbol}`;
      const createdDate = new Date(created).toLocaleString();

      const card = document.createElement('div');
      card.className = 'showcase-card';
      card.innerHTML = `
        <h3 class="showcase-card__title">${displayName}</h3>
        <p class="showcase-card__desc">Created ${createdDate}</p>
        <a href="https://explorer.xian.org/tokens/${name}" target="_blank" class="showcase-card__link" style="color: #06e6cb;">
          <span class="lang-en">View</span>
        </a>
      `;
      tokenGrid.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching token data:', error);
  }
}

function renderLabels(labels) {
  if (!labels || !labels.length) return '';

  const labelColors = {
    green: '#61bd4f',
    yellow: '#f2d600',
    orange: '#ff9f1a',
    red: '#eb5a46',
    purple: '#c377e0',
    blue: '#0079bf',
    sky: '#00c2e0',
    lime: '#51e898',
    pink: '#ff78cb',
    black: '#4d4d4d',
    null: '#b3bac5',
  };

  return `
    <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
      ${labels
        .map((label) => {
          const color = labelColors[label.color] || labelColors.null;
          const name = label.name || 'Unlabeled';
          return `
            <span class="roadmap-label" style="
              display: inline-block;
              background: ${color};
              color: white;
              padding: 0.2rem 0.5rem;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 500;
              margin-right: 0.5rem;
              margin-bottom: 0.25rem;
              text-shadow: 0 1px 1px rgba(0,0,0,0.3);
              white-space: nowrap;
            " title="${name}">${name}</span>
          `;
        })
        .join('')}
    </div>
  `;
}

function parseMarkdown(text) {
  if (!text) return '<p>No description available.</p>';
  let html = text;

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  html = html.replace(/^[\s]*[-*+] (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, (match) => `<ul>${match}</ul>`);
  html = html.replace(/^[\s]*\d+\. (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, (match) =>
    match.includes('<ul>') ? match : `<ol>${match}</ol>`
  );
  html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }

  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  return html;
}

function openCardModal(cardId, title, description, labels) {
  const modal = document.getElementById('cardModal');
  if (!modal) return;

  const modalTitle = document.getElementById('modalTitle');
  const modalLabels = document.getElementById('modalLabels');
  const modalDescription = document.getElementById('modalDescription');

  if (modalTitle) modalTitle.textContent = title;
  if (modalLabels) modalLabels.innerHTML = labels && labels.length ? renderLabels(labels) : '';
  if (modalDescription) modalDescription.innerHTML = parseMarkdown(description);

  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
  document.body.style.overflow = 'hidden';
}

function closeCardModal() {
  const modal = document.getElementById('cardModal');
  if (!modal) return;
  modal.classList.remove('show');
  window.setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

function openWalletModal() {
  const modal = document.getElementById('walletModal');
  if (!modal) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
  document.body.style.overflow = 'hidden';
}

function closeWalletModal() {
  const modal = document.getElementById('walletModal');
  if (!modal) return;
  modal.classList.remove('show');
  window.setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

function openExchangeModal() {
  const modal = document.getElementById('exchangeModal');
  if (!modal) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
  document.body.style.overflow = 'hidden';
}

function closeExchangeModal() {
  const modal = document.getElementById('exchangeModal');
  if (!modal) return;
  modal.classList.remove('show');
  window.setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

async function loadTrelloRoadmap() {
  const roadmapContainer = document.getElementById('roadmap-content');
  if (!roadmapContainer) return;

  try {
    const publicBoardResponse = await fetch(
      `https://trello.com/b/${TRELLO_BOARD_ID}.json`
    );

    if (!publicBoardResponse.ok) {
      throw new Error(`Public board fetch failed with status ${publicBoardResponse.status}`);
    }

    const publicBoardData = await publicBoardResponse.json();
    if (publicBoardData?.cards && publicBoardData?.lists) {
      let roadmapHTML = '<div class="roadmap-lists" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem;">';

      publicBoardData.lists.forEach((list) => {
        if (list.closed) return;
        const cards = publicBoardData.cards.filter((card) => card.idList === list.id && !card.closed);
        roadmapHTML += `
          <div class="roadmap-list" style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.1);">
            <h3 style="color: #06e6cb; margin-bottom: 1rem; font-size: 1.25rem;">${list.name}</h3>
            <div class="roadmap-cards">
        `;

        if (cards.length === 0) {
          roadmapHTML += '<p style="opacity: 0.7; font-style: italic;">No items yet</p>';
        } else {
          const limitedCards = cards.slice(0, 6);
          limitedCards.forEach((card) => {
            const labelsHTML = renderLabels(card.labels || []);
            const hasDescription = card.desc && card.desc.trim().length > 0;
            roadmapHTML += `
              <div class="roadmap-card" style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; border-left: 3px solid #06e6cb; position: relative;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${card.name}</h4>
                ${labelsHTML ? `<div style="margin-bottom: 0.5rem;">${labelsHTML}</div>` : ''}
                ${hasDescription ? `
                  <button class="read-more-btn" data-card-id="${card.id}" data-card-title="${card.name.replace(/"/g, '&quot;')}" data-card-desc="${(card.desc || '').replace(/"/g, '&quot;')}" data-card-labels='${JSON.stringify(card.labels || [])}'>
                    <span class="read-more-text">read more</span>
                    <span class="read-more-arrow">→</span>
                  </button>
                ` : ''}
              </div>
            `;
          });

          if (cards.length > 6) {
            roadmapHTML += `<div style="text-align: center; margin-top: 0.5rem; opacity: 0.7; font-size: 0.9rem;">Showing 6 of ${cards.length} items</div>`;
          }
        }

        roadmapHTML += '</div></div>';
      });

      roadmapHTML += '</div>';
      roadmapContainer.innerHTML = roadmapHTML;
      return;
    }
  } catch (error) {
    roadmapContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); border-radius: 8px;">
        <h3 style="color: #ff6b6b; margin-bottom: 1rem;">Error Loading Roadmap</h3>
        <p>Unable to fetch roadmap data from Trello.</p>
        <div style="text-align: left; max-width: 500px; margin: 1rem auto; font-size: 0.9rem; opacity: 0.8;">
          <strong>Possible solutions:</strong>
          <ul>
            <li>Make sure your Trello board is <strong>public</strong></li>
            <li>Verify your API key and token from <a href="https://trello.com/app-key" target="_blank" style="color: #06e6cb;">trello.com/app-key</a></li>
            <li>Check browser console for detailed error messages</li>
            <li>Ensure your token has read permissions for the board</li>
          </ul>
        </div>
        <p style="font-size: 0.9rem; opacity: 0.8;">Error: ${error.message}</p>
      </div>
    `;
  }
}

async function fetchXianStats() {
  const container = document.getElementById('xianPieChart');
  if (!container) return;

  const graphUrl = GRAPHQL_ENDPOINT;
  const CHUNK_SIZE = 2000;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('.')[0];

  const nowQuery = `query {
    allEvents(condition: { contract: "con_pairs", event: "Swap" },
              filter: { dataIndexed: { contains: { pair: "1" } } },
              orderBy: CREATED_DESC, first: 1) {
      edges { node { data } }
    }
  }`;

  const volumeQuery = `query {
    allEvents(condition: { contract: "con_pairs", event: "Swap" },
              filter: { dataIndexed: { contains: { pair: "1" } },
                        created: { greaterThan: "${since}" } },
              first: 1000) {
      edges { node { data } }
    }
  }`;

  const countQuery = `query {
    allStates(
      filter: {
        and: {
          key: { startsWith: "currency.balances:", notLike: "%:%:%" },
          valueNumeric: { greaterThan: "0" }
        }
      }
    ) {
      totalCount
    }
  }`;

  const excludedQuery = `query {
    allStates(filter: {
      key: { in: [
        "currency.balances:team_lock",
        "currency.balances:dao_funding_stream",
        "currency.balances:dao",
        "currency.balances:con_team_y1_linear_vesting"
      ] }
    }) {
      edges { node { key, value } }
    }
  }`;

  try {
    const [resNow, resVol, resCount, resExcluded] = await Promise.all([
      fetch(graphUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: nowQuery }) }).then((r) => r.json()),
      fetch(graphUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: volumeQuery }) }).then((r) => r.json()),
      fetch(graphUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: countQuery }) }).then((r) => r.json()),
      fetch(graphUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: excludedQuery }) }).then((r) => r.json()),
    ]);

    const totalCount = resCount?.data?.allStates?.totalCount ?? 0;
    let totalSupply = 0;

    for (let offset = 0; offset < totalCount; offset += CHUNK_SIZE) {
      const chunkQuery = `query ($first: Int!, $offset: Int!) {
        allStates(
          filter: {
            and: {
              key: { startsWith: "currency.balances:", notLike: "%:%:%" },
              valueNumeric: { greaterThan: "0" }
            }
          },
          orderBy: VALUE_DESC,
          first: $first,
          offset: $offset
        ) {
          edges {
            node {
              value
            }
          }
        }
      }`;

      const chunkResp = await fetch(graphUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: chunkQuery, variables: { first: CHUNK_SIZE, offset } }),
      }).then((r) => r.json());

      const chunkValues = chunkResp?.data?.allStates?.edges?.map((edge) => parseFloat(edge?.node?.value ?? '0')) ?? [];
      totalSupply += chunkValues.reduce((sum, value) => sum + value, 0);
    }

    const excludedMap = Object.fromEntries(
      (resExcluded?.data?.allStates?.edges ?? []).map((edge) => [edge?.node?.key, parseFloat(edge?.node?.value ?? '0')])
    );

    const treasury = excludedMap['currency.balances:dao'] || 0;
    const vesting = excludedMap['currency.balances:con_team_y1_linear_vesting'] || 0;
    const locker = excludedMap['currency.balances:team_lock'] || 0;
    const stream = excludedMap['currency.balances:dao_funding_stream'] || 0;

    const circulating = totalSupply - (treasury + vesting + locker + stream);

    const ctx = container.getContext('2d');
    if (!ctx) return;

    if (window.xianPieChart && typeof window.xianPieChart.destroy === 'function') {
      window.xianPieChart.destroy();
    }

    const isMobile = window.innerWidth <= 600;
    window.xianPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Validator DAO Treasury', 'Validator DAO Vesting', 'Team Locker', 'Team Vesting', 'Circulating'],
        datasets: [
          {
            data: [treasury, stream, locker, vesting, circulating],
            backgroundColor: ['#06e6cb', '#f39c12', '#9b59b6', '#45b7d1', '#96ceb4'],
            borderColor: ['#04b8a3', '#d68910', '#7d3c98', '#3a9bc1', '#7fb89a'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: isMobile ? 'bottom' : 'right',
            labels: {
              color: '#ffffff',
              font: { size: 14 },
            },
          },
          title: {
            display: true,
            text: 'Live $XIAN Token Distribution',
            color: '#ffffff',
            font: { size: 20, weight: 'bold' },
          },
        },
      },
    });
  } catch (error) {
    console.error('Failed to load XIAN stats', error);
  }
}

function initPieChart(cleanups) {
  fetchXianStats();
  const intervalId = window.setInterval(fetchXianStats, 60_000);
  cleanups.push(() => {
    window.clearInterval(intervalId);
    if (window.xianPieChart && typeof window.xianPieChart.destroy === 'function') {
      window.xianPieChart.destroy();
      window.xianPieChart = undefined;
    }
  });
}

function initRoadmapInteractions(cleanups) {
  const roadmapContent = document.getElementById('roadmap-content');
  if (!roadmapContent) return;

  const handleClick = (event) => {
    const readMoreBtn = event.target.closest('.read-more-btn');
    if (!readMoreBtn) return;
    event.preventDefault();
    const title = readMoreBtn.getAttribute('data-card-title') || '';
    const description = readMoreBtn.getAttribute('data-card-desc') || '';
    const labelsJSON = readMoreBtn.getAttribute('data-card-labels') || '[]';

    try {
      const labels = JSON.parse(labelsJSON);
      openCardModal('', title, description, labels);
    } catch (error) {
      openCardModal('', title, description, []);
    }
  };

  roadmapContent.addEventListener('click', handleClick);
  cleanups.push(() => roadmapContent.removeEventListener('click', handleClick));
}

function initModalShortcuts(cleanups) {
  const keyHandler = (event) => {
    if (event.key !== 'Escape') return;
    closeCardModal();
    closeWalletModal();
    closeExchangeModal();
  };

  document.addEventListener('keydown', keyHandler);
  cleanups.push(() => document.removeEventListener('keydown', keyHandler));
}

function initFab(cleanups) {
  const fab = document.getElementById('buyFab');
  const menu = document.getElementById('fabMenu');
  if (!fab || !menu) return;

  const toggle = () => {
    const expanded = fab.getAttribute('aria-expanded') === 'true';
    const nextState = !expanded;
    fab.setAttribute('aria-expanded', String(nextState));
    menu.classList.toggle('open', nextState);
    fab.classList.toggle('open', nextState);
  };

  const outsideClick = (event) => {
    if (!fab.contains(event.target) && !menu.contains(event.target)) {
      fab.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      fab.classList.remove('open');
    }
  };

  fab.addEventListener('click', toggle);
  document.addEventListener('click', outsideClick);

  cleanups.push(() => {
    fab.removeEventListener('click', toggle);
    document.removeEventListener('click', outsideClick);
  });
}

async function initReferralTracker() {
  const urlParams = new URLSearchParams(window.location.search);
  const incomingRef = urlParams.get('uid');

  if (incomingRef && !localStorage.getItem('referrer')) {
    const timestamp = Date.now();
    localStorage.setItem('referrer', incomingRef);
    localStorage.setItem('referrer_ts', timestamp.toString());

    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      await fetch('https://ref.xian.org/create-referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referrer: incomingRef, ip: data.ip, timestamp }),
      });
    } catch (error) {
      console.error('Failed to record referral', error);
    }
  }
}

export function initPageInteractions() {
  const cleanups = [];
  initBurgerMenu(cleanups);
  initTypewriter(cleanups);
  initOrbitingSun(cleanups);
  initDropdowns(cleanups);
  initSwiper(cleanups);
  loadTokens();
  initPieChart(cleanups);
  loadTrelloRoadmap();
  initRoadmapInteractions(cleanups);
  initModalShortcuts(cleanups);
  initFab(cleanups);
  initReferralTracker();

  window.openCardModal = openCardModal;
  window.closeCardModal = closeCardModal;
  window.openWalletModal = openWalletModal;
  window.closeWalletModal = closeWalletModal;
  window.openExchangeModal = openExchangeModal;
  window.closeExchangeModal = closeExchangeModal;

  return () => {
    cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error('Failed to cleanup interaction', error);
      }
    });
  };
}
