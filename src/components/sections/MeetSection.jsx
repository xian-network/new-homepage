import { assetPath } from '../../utils/assetPath.js';

function MeetSection() {
  return (
    <section className="meet" id="meet">
      <div className="meet-bg">
        <img src={assetPath('assets/img/meet.svg')} alt="line" />
      </div>
      <div className="meet-gradient">
        <img src={assetPath('assets/img/meet-gradient.png')} alt="gradient" />
      </div>
      <div className="container">
        <div className="main-block">
          <h2>Meet $XIAN</h2>
          <p>
            $XIAN is the native gas&nbsp;&amp; governance asset of Xian—the first Python Layer‑1 blockchain. The genesis mint created{' '}
            <strong>111 million</strong> tokens, but <strong>100&nbsp;% of gas is redistributed</strong> every transaction, with 1 %
            permanently burned—so supply trends down.
          </p>
        </div>
        <div className="meet-wrapper">
          <div className="star">
            <img src={assetPath('assets/img/star.svg')} alt="star" />
          </div>
          <div className="meet-items">
            <div className="meet-item__img">
              <picture>
                <source srcSet={assetPath('assets/img/meet-mob-2.png')} media="(max-width: 700px)" />
                <source srcSet={assetPath('assets/img/meet-mob.png')} media="(max-width: 1180px)" />
                <img src={assetPath('assets/img/meet.png')} alt="meet image" />
              </picture>
            </div>
            <div className="meet-item__block">
              <p>Core Economic Drivers Behind $XIAN's Value:</p>
              <ul>
                <li>
                  <strong>Main Token for All Trading Pairs:</strong> Essential liquidity and consistent demand across the ecosystem.
                </li>
                <li>
                  <strong>Validator Staking Requirement:</strong> Validators must stake at least <strong>100,000 $XIAN</strong>, ensuring
                  token scarcity and long-term holding.
                </li>
                <li>
                  <strong>Gas Payments Exclusively in $XIAN:</strong> Guarantees ongoing token utility through constant usage for
                  transactions.
                </li>
                <li>
                  <strong>Gas Redistribution (live)</strong>
                  <ul className="sublist">
                    <li>Validators – 30 %</li>
                    <li>Contract Developer – 68 %</li>
                    <li>Foundation – 1 %</li>
                    <li>Burn – 1 %</li>
                  </ul>
                  <a
                    href="https://gas.xian.org/"
                    style={{ color: '#06e6cb', textDecoration: 'underline' }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    See it in action!
                  </a>
                  <br />
                  <span className="small">Ratios adjustable via DAO vote.</span>
                  <br />
                </li>
              </ul>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '3.125rem',
                  gap: '1rem',
                  flexDirection: 'column',
                }}
              >
                <a href="https://dex.xian.org/#pair=1" target="_blank" rel="noreferrer" className="main-button bg-color" style={{ margin: 0 }}>
                  Get $XIAN on Xian DEX
                </a>
                <a
                  href="https://raydium.io/swap/?inputMint=sol&outputMint=GnaXkbmMV1zGK6bRCQnM9Jd6Jv2Hjw5b2PFVBaKEE5At"
                  target="_blank"
                  rel="noreferrer"
                  className="main-button bg-color"
                  style={{ margin: 0 }}
                >
                  Get $XIAN on Raydium
                </a>
                <a href="https://bridge.xian.org" target="_blank" rel="noreferrer" className="main-button" style={{ margin: 0 }}>
                  Bridge Assets
                </a>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '3.125rem',
                gap: '1rem',
                flexDirection: 'column',
                maxWidth: '100%',
                width: '600px',
              }}
            >
              <canvas id="xianPieChart" width="300" height="300" style={{ margin: '1rem', display: 'block' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MeetSection;
