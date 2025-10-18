function FloatingActions() {
  return (
    <>
      <button id="buyFab" className="fab" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="fabMenu">
        <svg className="zap" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
          <polygon
            points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul id="fabMenu" className="fab-menu">
        <li className="menu-label">Buy $XIAN on</li>
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
            Raydium DEX <span>(Solana)</span>
          </a>
        </li>
        <li>
          <a href="https://dex-trade.com/spot/trading/XIANUSDT?interface=classic" target="_blank" rel="noreferrer">
            Dex-Trade CEX <span>(USDT pair)</span>
          </a>
        </li>
      </ul>
    </>
  );
}

export default FloatingActions;
