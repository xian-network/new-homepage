function GetStartedSection() {
  return (
    <section className="get-started" id="get-started">
      <div className="container">
        <div className="main-block">
          <h2>Getting Started</h2>
          <p>Take your first steps into the Xian ecosystem in just a few clicks.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span className="shine" />
            <div className="step-number">1</div>
            <h3>Install Xian Wallet</h3>
            <p>Download the browser extension to manage your assets on Xian.</p>
            <button className="main-button" type="button" onClick={() => window.openWalletModal?.()}>
              Get&nbsp;Wallet
            </button>
          </div>
          <div className="step-card">
            <span className="shine" />
            <div className="step-number">2</div>
            <h3>Explore 20% Staking Yields</h3>
            <p>Check DEX opportunities with high yields on Xian.</p>
            <a className="main-button" href="https://dex.xian.org/#staking" target="_blank" rel="noreferrer">
              View Staking
            </a>
          </div>
          <div className="step-card">
            <span className="shine" />
            <div className="step-number">3</div>
            <h3>Bridge Funds From Solana</h3>
            <p>Securely move your assets into the Xian chain.</p>
            <a href="https://bridge.xian.org" className="main-button" target="_blank" rel="noreferrer">
              Use Bridge
            </a>
          </div>
          <div className="step-card">
            <span className="shine" />
            <div className="step-number">4</div>
            <h3>Buy $XIAN</h3>
            <p>Purchase XIAN from multiple exchanges and trading platforms.</p>
            <button className="main-button" type="button" onClick={() => window.openExchangeModal?.()}>
              View Exchanges
            </button>
          </div>
          <div className="step-card">
            <span className="shine" />
            <div className="step-number">5</div>
            <h3>Join the Community</h3>
            <p>Connect with others on Telegram &amp; Discord.</p>
            <a href="#social" className="main-button">
              Join Us
            </a>
          </div>
          <div className="step-card">
            <span className="shine" />
            <div className="step-number">6</div>
            <h3>Stay Ahead with Updates</h3>
            <p>Follow news and ecosystem announcements to stay informed.</p>
            <a href="https://x.com/xian_network/" target="_blank" rel="noreferrer" className="main-button">
              Visit X
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GetStartedSection;
