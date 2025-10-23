import { assetPath } from '../../utils/assetPath.js';

const createDropdowns = ({ includeWallet = true } = {}) => {
  const dropdowns = [
    {
      key: 'buy',
      wrapperClassName: 'btn-group',
      className: 'main-button bg-color buy-btn',
      label: 'Buy $XIAN',
      menuClassName: 'buy-menu',
      items: [
        {
          label: 'Xian DEX',
          href: 'https://dex.xian.org/#pair=1',
        },
        {
          label: 'Raydium DEX (Solana)',
          href: 'https://raydium.io/swap/?inputMint=sol&outputMint=GnaXkbmMV1zGK6bRCQnM9Jd6Jv2Hjw5b2PFVBaKEE5At',
        },
        {
          label: 'Dex-Trade CEX',
          href: 'https://dex-trade.com/spot/trading/XIANUSDT?interface=classic',
        },
      ],
    },
  ];

  if (includeWallet) {
    dropdowns.push({
      key: 'wallet',
      wrapperClassName: 'btn-group2',
      className: 'main-button bg-color get-wallet-btn',
      label: 'Get Wallet',
      menuClassName: 'get-wallet-menu',
      items: [
        {
          label: 'Chrome Extension',
          href: 'https://chromewebstore.google.com/detail/xian-wallet/kcimjjhplbcgkcnanijkolfillgfanlc/',
        },
        {
          label: 'Android Wallet',
          href: 'https://play.google.com/store/apps/details?id=net.xian.xianwalletapp&hl=en&pli=1',
        },
      ],
    });
  }

  return dropdowns;
};

const HERO_CONTENT = {
  home: {
    title: 'Two fast tracks into the Python Layer‑1.',
    description:
      'Xian splits the experience for builders and users. Choose your path, deploy Python smart contracts, or run your first on-chain transaction in minutes.',
    primaryActions: [
      { label: 'Start Building', href: '/build/', className: 'main-button bg-color' },
      { label: 'Start Using', href: '/use/', className: 'main-button' },
    ],
    dropdowns: () => createDropdowns(),
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
    dropdowns: () => createDropdowns(),
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
    dropdowns: () => createDropdowns({ includeWallet: false }),
  },
};

function HeroSection({ page = 'home' }) {
  const content = HERO_CONTENT[page] ?? HERO_CONTENT.home;
  const dropdowns = typeof content.dropdowns === 'function' ? content.dropdowns() : content.dropdowns ?? [];
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

        <div
          className="buttons-wrap top-desk"
          style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
        >
          {content.primaryActions?.map((action) => (
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
          {dropdowns.map((dropdown) => (
            <div className={dropdown.wrapperClassName} key={dropdown.key}>
              <button
                className={dropdown.className || 'main-button'}
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {dropdown.label}
                <span className="caret" />
              </button>

              <ul className={dropdown.menuClassName}>
                {dropdown.items?.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
