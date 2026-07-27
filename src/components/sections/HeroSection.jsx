import { assetPath } from '../../utils/assetPath.js';

function HeroSection() {
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
        <aside className="migration-notice" aria-labelledby="migration-notice-title">
          <div className="migration-notice__heading">
            <span className="migration-notice__eyebrow">Important network update</span>
            <h2 id="migration-notice-title">New chain snapshot: <time dateTime="2026-09-20">20 September 2026</time></h2>
          </div>
          <p>
            We’re preparing a new blockchain based on Xian’s reworked codebase. Your existing address and private key will
            remain compatible. Only wallet-held <strong>XIAN</strong> and <strong>xUSDC</strong> balances will carry over. All
            other tokens and contract-held balances are excluded; contracts must be redeployed, except selected core
            infrastructure. Before the snapshot, unstake and withdraw XIAN and xUSDC into your wallet. Launch date to be
            announced.
          </p>
        </aside>

        <h1>The Blockchain Where Python Runs the Economy.</h1>
        <p>
          Xian is a new Layer‑1 chain where developers earn 68% of all fees. Powered by code. Backed by users. You can buy $XIAN
          today and ride the future of programmable value.
        </p>

        <div className="buttons-wrap top-desk" style={{ marginTop: '2.5rem' }}>
          <div className="btn-group">
            <button className="main-button bg-color buy-btn" type="button" aria-haspopup="true" aria-expanded="false">
              Buy&nbsp;$XIAN
              <span className="caret" />
            </button>

            <ul className="buy-menu">
              <li>
                <a href="https://dex.xian.org/#pair=1" target="_blank" rel="noreferrer">
                  Xian DEX
                </a>
              </li>
              <li>
                <a
                  href="https://raydium.io/swap/?inputMint=sol&outputMint=GnaXkbmMV1zGK6bRCQnM9Jd6Jv2Hjw5b2PFVBaKEE5At"
                  target="_blank"
                  rel="noreferrer"
                >
                  Raydium DEX (Solana)
                </a>
              </li>
              <li>
                <a href="https://dex-trade.com/spot/trading/XIANUSDT?interface=classic" target="_blank" rel="noreferrer">
                  Dex-Trade CEX
                </a>
              </li>
            </ul>
          </div>

          <div className="btn-group2">
            <button className="main-button bg-color get-wallet-btn" type="button" aria-haspopup="true" aria-expanded="false">
              Get&nbsp;Wallet
              <span className="caret" />
            </button>

            <ul className="get-wallet-menu">
              <li>
                <a
                  href="https://chromewebstore.google.com/detail/xian-wallet/kcimjjhplbcgkcnanijkolfillgfanlc/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chrome Extension
                </a>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=net.xian.xianwalletapp&hl=en&pli=1"
                  target="_blank"
                  rel="noreferrer"
                >
                  Android Wallet
                </a>
              </li>
            </ul>
          </div>
        </div>

        
      </div>
    </section>
  );
}

export default HeroSection;
