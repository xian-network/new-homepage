import { assetPath } from '../../utils/assetPath.js';
import ProgressiveDisclosure from '../support/ProgressiveDisclosure.jsx';

function WhySection() {
  return (
    <section className="why section-spacing" id="why">
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
              <h2>Why Xian</h2>
              <p>
                Xian is live and operates as a comprehensive blockchain ecosystem, featuring a native wallet, block explorer,
                automated governance, and developer tooling. It is ready to use—now.
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="https://docs.xian.org/" target="_blank" rel="noreferrer" className="main-button">
                  Explore Docs
                </a>
                <a href="https://xian-faucet.poc.workers.dev/" target="_blank" rel="noreferrer" className="main-button">
                  Testnet Faucet
                </a>
              </div>
            </div>
          </div>
          <div className="why-items">
            <div className="why-item">
              <div className="why-item__top">
                <div className="why-item-top__icon">
                  <img src={assetPath('assets/img/why-icon-1.svg')} alt="icon" loading="lazy" decoding="async" />
                </div>
                <h3>Essential Libraries</h3>
              </div>
              <p>
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
              </p>
            </div>
            <div className="why-item">
              <div className="why-item__top">
                <div className="why-item-top__icon">
                  <img src={assetPath('assets/img/why-icon-2.svg')} alt="icon" loading="lazy" decoding="async" />
                </div>
                <h3>Next-Gen Token Standards</h3>
              </div>
              <p>Unlock advanced token functionality with built-in support for EIP-2612 (permits) and ERC-1363 (streaming payments).</p>
            </div>
            <div className="why-item">
              <div className="why-item__top">
                <div className="why-item-top__icon">
                  <img src={assetPath('assets/img/why-icon-3.svg')} alt="icon" loading="lazy" decoding="async" />
                </div>
                <h3>Earn for Building</h3>
              </div>
              <p>
                Earn 68% of transaction fees by building and deploying dApps. Developers are first-class economic actors on Xian.
              </p>
            </div>
            <div className="why-item">
              <div className="why-item__top">
                <div className="why-item-top__icon">
                  <img src={assetPath('assets/img/why-icon-4.svg')} alt="icon" loading="lazy" decoding="async" />
                </div>
                <h3>Bounty Rewards</h3>
              </div>
              <p>Show off your skills and earn—no application needed. Just build, innovate, and get rewarded.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhySection;
