import { assetPath } from '../../utils/assetPath.js';

const DEFAULT_ACTIONS = [
  {
    label: 'Explore Docs',
    href: 'https://docs.xian.org/',
    target: '_blank',
    rel: 'noreferrer',
    className: 'main-button',
  },
  {
    label: 'Testnet Faucet',
    href: 'https://xian-faucet.poc.workers.dev/',
    target: '_blank',
    rel: 'noreferrer',
    className: 'main-button',
  },
];

const DEFAULT_ITEMS = [
  {
    icon: 'assets/img/why-icon-1.svg',
    title: 'Essential Libraries',
    description: (
      <>
        Supercharge your development with Xian's tools: from{' '}
        <a href="https://docs.xian.org/tools/xian-js" target="_blank" rel="noreferrer" style={{ color: '#06e6cb' }}>
          xian-js
        </a>
        ,{' '}
        <a href="https://docs.xian.org/tools/xian-py" target="_blank" rel="noreferrer" style={{ color: '#06e6cb' }}>
          xian-py
        </a>
        , and{' '}
        <a
          href="https://docs.xian.org/tools/xian-wallet-utils"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#06e6cb' }}
        >
          wallet libraries
        </a>
        , to our{' '}
        <a
          href="https://docs.xian.org/node/interfaces/graphql"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#06e6cb' }}
        >
          GraphQL environment
        </a>
        .
      </>
    ),
  },
  {
    icon: 'assets/img/why-icon-2.svg',
    title: 'Next-Gen Token Standards',
    description: 'Unlock advanced token functionality with built-in support for EIP-2612 (permits) and ERC-1363 (streaming payments).',
  },
  {
    icon: 'assets/img/why-icon-3.svg',
    title: 'Earn for Building',
    description: 'Earn 68% of transaction fees by building and deploying dApps. Developers are first-class economic actors on Xian.',
  },
  {
    icon: 'assets/img/why-icon-4.svg',
    title: 'Bounty Rewards',
    description: 'Show off your skills and earn—no application needed. Just build, innovate, and get rewarded.',
  },
];

const DEFAULT_DESCRIPTION =
  'Xian is live and operates as a comprehensive blockchain ecosystem, featuring a native wallet, block explorer, automated governance, and developer tooling. It is ready to use—now.';

function WhySection({ heading = 'Why Xian', description = DEFAULT_DESCRIPTION, actions = DEFAULT_ACTIONS, items = DEFAULT_ITEMS }) {
  const descriptionContent = Array.isArray(description)
    ? description.map((paragraph, index) => (
        <p key={`why-desc-${index}`}>{paragraph}</p>
      ))
    : typeof description === 'string'
    ? <p>{description}</p>
    : description;

  return (
    <section className="why">
      <div className="why-bg">
        <picture>
          <source srcSet={assetPath('assets/img/orange-mob.png')} media="(max-width: 480px)" />
          <img src={assetPath('assets/img/orange-planet.png')} alt="blue planet" loading="lazy" decoding="async" />
        </picture>
      </div>
      <div className="why-gradient">
        <img src={assetPath('assets/img/why-gradient-3.png')} alt="gradient" loading="lazy" decoding="async" />
      </div>
      <div className="container">
        <div className="star">
          <img src={assetPath('assets/img/star-2.svg')} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="why-block">
          <div className="why-block__top">
            <div className="why-block__top-img">
              <img src={assetPath('assets/img/why-img.png')} alt="image" loading="lazy" decoding="async" />
            </div>
            <div className="why-block__top-text">
              <h2>{heading}</h2>
              {descriptionContent}
              {actions?.length ? (
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {actions.map((action) => (
                    <a
                      key={action.label}
                      href={action.href}
                      target={action.target}
                      rel={action.rel}
                      className={action.className || 'main-button'}
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
            </div>
          </div>
          <div className="why-items">
            {items.map((item) => {
              const iconSrc = item.icon ? assetPath(item.icon) : assetPath('assets/img/why-icon-1.svg');
              return (
                <div className="why-item" key={item.title}>
                  <div className="why-item__top">
                    <div className="why-item-top__icon">
                      <img src={iconSrc} alt="icon" loading="lazy" decoding="async" />
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                  {typeof item.description === 'string' ? <p>{item.description}</p> : item.description}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
