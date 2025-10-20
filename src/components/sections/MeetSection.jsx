import { assetPath } from '../../utils/assetPath.js';

function MeetSection() {
  return (
    <section className="meet" id="meet">
      <div className="meet-bg">
        <img src={assetPath('assets/img/meet.svg')} alt="line" loading="lazy" decoding="async" />
      </div>
      <div className="meet-gradient">
        <img src={assetPath('assets/img/meet-gradient.png')} alt="gradient" loading="lazy" decoding="async" />
      </div>
      <div className="container">
        <div className="main-block">
          
          <h2>Meet $XIAN</h2>
          <p>
            $XIAN is the native gas&nbsp;&amp; governance asset of Xian—the first Python Layer‑1 blockchain. The genesis mint created{' '}
            <strong>111 million</strong> tokens, and <strong>100&nbsp;% of gas is redistributed</strong> every transaction with 1&nbsp;%
            permanently burned—driving deflationary pressure as network activity grows.
          </p>
        </div>
        <div className="meet__content">
          <div className="meet__column">
            
            <div className="meet__stat-grid">
              <div className="meet-stat">
                <span className="meet-stat__label">Genesis supply</span>
                <span className="meet-stat__value">111M $XIAN</span>
                <p className="meet-stat__body">Minted at genesis with a provable cap—no extra inflation or hidden unlocks.</p>
              </div>
              <div className="meet-stat">
                <span className="meet-stat__label">Perpetual burn</span>
                <span className="meet-stat__value">1% / txn</span>
                <p className="meet-stat__body">Every block permanently removes 1&nbsp;% of gas, compounding scarcity as usage scales.</p>
              </div>
            </div>
          </div>
          <div className="meet__column">
            <div className="meet-card meet-card--drivers">
              <div className="meet-card__header">
                <span className="meet-card__eyebrow">Network utility</span>
                <h3>$XIAN powers every layer of the Xian economy</h3>
              </div>
              <div className="meet-driver-grid">
                <article className="meet-driver">
                  <span className="meet-driver__badge">DEX</span>
                  <h3>Anchor asset across liquidity pools</h3>
                  <p>Protocol-owned liquidity pairs every major token against $XIAN to keep price discovery stable.</p>
                </article>
                <article className="meet-driver">
                  <span className="meet-driver__badge">POS</span>
                  <h3>Bonded collateral for validator slots</h3>
                  <p>
                    Validators stake a minimum of <strong>100,000 $XIAN</strong>, hardwiring economic alignment with chain security.
                  </p>
                </article>
                <article className="meet-driver">
                  <span className="meet-driver__badge">GAS</span>
                  <h3>Settlement currency for every transaction</h3>
                  <p>$XIAN pays execution costs, rewarding active participants as throughput scales.</p>
                </article>
              </div>
              <div className="meet-card__actions">
                <a href="https://dex.xian.org/#pair=1" target="_blank" rel="noreferrer" className="main-button bg-color">
                  Get $XIAN on Xian DEX
                </a>
                <a
                  href="https://raydium.io/swap/?inputMint=sol&outputMint=GnaXkbmMV1zGK6bRCQnM9Jd6Jv2Hjw5b2PFVBaKEE5At"
                  target="_blank"
                  rel="noreferrer"
                  className="main-button bg-color"
                >
                  Get $XIAN on Raydium
                </a>
                <a href="https://bridge.xian.org" target="_blank" rel="noreferrer" className="main-button">
                  Bridge Assets
                </a>
              </div>
            </div>
            <div className="meet-card meet-card--chart">
              <div className="meet-card__header">
                <span className="meet-card__eyebrow">Redistribution</span>
                <h3>Every transaction recycles gas back to the community</h3>
              </div>
              <div className="meet-redistribution">
                <div className="meet-redistribution__chart" aria-hidden="true">
                  <div className="meet-redistribution__label">Gas Flow</div>
                </div>
                <ul className="meet-redistribution__legend">
                  <li className="meet-redistribution__legend-item">
                    <span className="meet-legend__dot meet-legend__dot--validators" />
                    <div>
                      <strong>30&nbsp;% Validators</strong>
                      <p>Rewards uptime and security.</p>
                    </div>
                  </li>
                  <li className="meet-redistribution__legend-item">
                    <span className="meet-legend__dot meet-legend__dot--developers" />
                    <div>
                      <strong>68&nbsp;% Contract Developers</strong>
                      <p>Incentivises building real applications.</p>
                    </div>
                  </li>
                  <li className="meet-redistribution__legend-item">
                    <span className="meet-legend__dot meet-legend__dot--foundation" />
                    <div>
                      <strong>1&nbsp;% Foundation</strong>
                      <p>Funds grants and ecosystem growth.</p>
                    </div>
                  </li>
                  <li className="meet-redistribution__legend-item">
                    <span className="meet-legend__dot meet-legend__dot--burn" />
                    <div>
                      <strong>1&nbsp;% Burn</strong>
                      <p>Continuously reduces supply.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <a href="https://gas.xian.org/" target="_blank" rel="noreferrer" className="meet-driver__link">
                See it in action
              </a>
              <span className="meet__footnote">Ratios adjustable via DAO vote.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetSection;
