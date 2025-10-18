function Modals() {
  return (
    <>
      <div id="cardModal" className="card-modal" style={{ display: 'none' }}>
        <div className="modal-overlay" onClick={() => window.closeCardModal?.()} />
        <div className="modal-content">
          <div className="modal-header">
            <button className="modal-close" type="button" onClick={() => window.closeCardModal?.()}>
              &times;
            </button>
            <h2 id="modalTitle" />
            <div id="modalLabels" className="modal-labels" />
          </div>
          <div className="modal-body">
            <div id="modalDescription" className="modal-description" />
          </div>
        </div>
      </div>

      <div id="walletModal" className="wallet-modal" style={{ display: 'none' }}>
        <div className="modal-overlay" onClick={() => window.closeWalletModal?.()} />
        <div className="wallet-modal-content">
          <div className="wallet-modal-header">
            <button className="modal-close" type="button" onClick={() => window.closeWalletModal?.()}>
              &times;
            </button>
            <h2>Download Xian Wallet</h2>
            <p>Choose your platform to get started with Xian</p>
          </div>
          <div className="wallet-options">
            <a
              href="https://chromewebstore.google.com/detail/xian-wallet/kcimjjhplbcgkcnanijkolfillgfanlc/"
              target="_blank"
              rel="noreferrer"
              className="wallet-option"
            >
              <h3>Chrome Extension</h3>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=net.xian.xianwalletapp&hl=en"
              target="_blank"
              rel="noreferrer"
              className="wallet-option"
            >
              <img src="/assets/img/googleplay.png" alt="Get it on Google Play" />
            </a>

            <div className="wallet-option disabled">
              <img src="/assets/img/appstore.png" alt="Download on the App Store" />
              <div className="coming-soon-overlay">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>

      <div id="exchangeModal" className="wallet-modal" style={{ display: 'none' }}>
        <div className="modal-overlay" onClick={() => window.closeExchangeModal?.()} />
        <div className="wallet-modal-content">
          <div className="wallet-modal-header">
            <button className="modal-close" type="button" onClick={() => window.closeExchangeModal?.()}>
              &times;
            </button>
            <h2>Buy $XIAN</h2>
            <p>Choose your preferred exchange to purchase XIAN</p>
          </div>
          <div className="wallet-options">
            <a href="https://dex.xian.org/#pair=1" target="_blank" rel="noreferrer" className="wallet-option">
              <img src="/assets/img/logo.svg" alt="XIAN DEX" />
              <h3>XIAN DEX</h3>
            </a>

            <a
              href="https://dexscreener.com/solana/a7fw843khqrqyudbulbfgoq2jsqj5qto3glk2hhjwecc"
              target="_blank"
              rel="noreferrer"
              className="wallet-option"
            >
              <img src="/assets/img/solanaLogoMark.png" alt="Raydium (Solana)" />
              <h3>Raydium (Solana)</h3>
            </a>

            <a
              href="https://dex-trade.com/spot/trading/XIANUSDT?interface=classic"
              target="_blank"
              rel="noreferrer"
              className="wallet-option"
            >
              <img src="/assets/img/dex-trade.svg" alt="Dex-Trade" />
              <h3>Dex-Trade (CEX)</h3>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modals;
