const DEFAULT_STEPS = [
  {
    title: 'Install Xian Wallet',
    description: 'Download the browser extension to manage your assets on Xian.',
    links: [
      {
        label: 'Get Wallet',
        href: '#wallet-modal',
        onClick: (event) => {
          event.preventDefault();
          window.openWalletModal?.();
        },
      },
    ],
  },
  {
    title: 'Explore 20% Staking Yields',
    description: 'Check DEX opportunities with high yields on Xian.',
    links: [
      {
        label: 'View Staking',
        href: 'https://dex.xian.org/#staking',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
  {
    title: 'Bridge Funds From Solana',
    description: 'Securely move your assets into the Xian chain.',
    links: [
      {
        label: 'Use Bridge',
        href: 'https://bridge.xian.org',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
  {
    title: 'Buy $XIAN',
    description: 'Purchase XIAN from multiple exchanges and trading platforms.',
    links: [
      {
        label: 'View Exchanges',
        href: '#exchange-modal',
        onClick: (event) => {
          event.preventDefault();
          window.openExchangeModal?.();
        },
      },
    ],
  },
  {
    title: 'Join the Community',
    description: 'Connect with others on Telegram & Discord.',
    links: [
      {
        label: 'Join Us',
        href: '#social',
      },
    ],
  },
  {
    title: 'Stay Ahead with Updates',
    description: 'Follow news and ecosystem announcements to stay informed.',
    links: [
      {
        label: 'Visit X',
        href: 'https://x.com/xian_network/',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
];

function GetStartedSection({
  id = 'get-started',
  title = 'Getting Started',
  description = 'Take your first steps into the Xian ecosystem in just a few clicks.',
  steps = DEFAULT_STEPS,
}) {
  return (
    <section className="get-started" id={id}>
      <div className="container">
        <div className="main-block">
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={`${step.title}-${index}`}>
              <span className="shine" />
              <div className="step-number">{index + 1}</div>
              <h3>{step.title}</h3>
              {Array.isArray(step.description)
                ? step.description.map((paragraph, paragraphIndex) => (
                    <p key={`desc-${paragraphIndex}`}>{paragraph}</p>
                  ))
                : step.description
                ? <p>{step.description}</p>
                : null}
              {step.links?.length ? (
                <div className="step-links" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {step.links.map((link) => (
                    <a
                      key={link.label}
                      className={link.className || 'main-button'}
                      href={link.href || '#'}
                      target={link.target}
                      rel={link.rel}
                      onClick={(event) => {
                        if (link.onClick) {
                          link.onClick(event);
                        }
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GetStartedSection;
