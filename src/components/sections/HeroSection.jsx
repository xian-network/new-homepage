import { assetPath } from '../../utils/assetPath.js';

const HERO_CONTENT = {
  home: {
    title: 'Two fast tracks into the Python Layer‑1.',
    description:
      'Xian splits the experience for builders and users. Pick the track that fits your goal and move from idea to on-chain activity in minutes.',
    pathCards: [
      {
        title: 'Developers',
        body: [
          'Ship production dApps with familiar tooling. Scaffold, test, and deploy contracts from Python without switching stacks.',
          'Highlights: 60-second CLI quickstart, instant GraphQL APIs, and 68% of gas rewards routed to contract authors.',
        ],
        action: { label: 'Start Building', href: '/build/', className: 'main-button bg-color' },
      },
      {
        title: 'Users & Tokenholders',
        body: [
          'Install the Xian Wallet, bridge liquidity securely, and explore curated DeFi, naming, and NFT apps already live on mainnet.',
          'Highlights: self-custody wallet, Solana bridge, and real yields that reinforce $XIAN demand.',
        ],
        action: { label: 'Start Using', href: '/use/', className: 'main-button bg-color' },
      },
    ],
  },
  build: {
    title: 'Build production dApps in Python.',
    description:
      'Install the CLI, scaffold your project, and deploy contracts without switching languages. The 60-second quickstart gets your first contract live immediately.',
    primaryActions: [
      { label: 'Run the Quickstart', href: '#get-started', className: 'main-button bg-color' },
      {
        label: 'Read the Docs',
        href: 'https://docs.xian.org',
        target: '_blank',
        rel: 'noreferrer',
        className: 'main-button',
      },
    ],
  },
  use: {
    title: 'Use the Python-powered economy in minutes.',
    description:
      'Install the Xian Wallet, bridge liquidity, and dive into live apps offering staking, trading, and NFTs. Your first transaction is only a few steps away.',
    primaryActions: [
      {
        label: 'Install Wallet',
        href: '#wallet-modal',
        className: 'main-button bg-color',
        onClick: (event) => {
          event.preventDefault();
          window.openWalletModal?.();
        },
      },
      {
        label: 'Bridge Funds',
        href: 'https://bridge.xian.org',
        target: '_blank',
        rel: 'noreferrer',
        className: 'main-button',
      },
    ],
  },
};

function HeroSection({ page = 'home' }) {
  const content = HERO_CONTENT[page] ?? HERO_CONTENT.home;
  const actions = Array.isArray(content.primaryActions) ? content.primaryActions.filter(Boolean) : [];
  const pathCards = Array.isArray(content.pathCards) ? content.pathCards.filter(Boolean) : [];
  return (
    <section className="hero">
      <div className="bg-hero-gradient">
        <img src={assetPath('assets/img/bg-gradient.png')} alt="" />
      </div>
      <div className="bg-hero">
        <picture>
          <source srcSet={assetPath('assets/img/cirlces-mob.svg')} media="(max-width: 480px)" />
          <img src={assetPath('assets/img/orbita.svg')} alt="orbita" />
        </picture>
        <div className="sun">
          <img src={assetPath('assets/img/sun.svg')} style={{ display: 'none' }} alt="sun" />
        </div>
      </div>

      <div className="container">
        <h1>{content.title}</h1>
        <p>{content.description}</p>

        {actions.length ? (
          <div
            className="buttons-wrap top-desk"
            style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
          >
            {actions.map((action) => (
              <a
                key={action.label}
                className={action.className || 'main-button bg-color'}
                href={action.href || '#'}
                target={action.target}
                rel={action.rel}
                onClick={(event) => {
                  if (action.onClick) {
                    action.onClick(event);
                  }
                }}
              >
                {action.label}
              </a>
            ))}
          </div>
        ) : null}
        {pathCards.length ? (
          <div className="steps-grid" style={{ marginTop: '3rem' }}>
            {pathCards.map((card, index) => (
              <div className="step-card" key={`${card.title}-${index}`}>
                <span className="shine" />
                <div className="step-number">{index + 1}</div>
                <h3>{card.title}</h3>
                {Array.isArray(card.body)
                  ? card.body.map((paragraph, paragraphIndex) => (
                      <p key={`body-${paragraphIndex}`}>{paragraph}</p>
                    ))
                  : card.body
                  ? <p>{card.body}</p>
                  : null}
                {card.action ? (
                  <div className="step-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <a
                      className={card.action.className || 'main-button bg-color'}
                      href={card.action.href || '#'}
                      target={card.action.target}
                      rel={card.action.rel}
                      onClick={(event) => {
                        if (card.action.onClick) {
                          card.action.onClick(event);
                        }
                      }}
                    >
                      {card.action.label}
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default HeroSection;
