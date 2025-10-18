function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Solana Token Address:{' '}
          <a
            href="https://solscan.io/token/GnaXkbmMV1zGK6bRCQnM9Jd6Jv2Hjw5b2PFVBaKEE5At"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#06e6cb', paddingTop: '.625rem', marginBottom: '.625rem', textOverflow: 'ellipsis', overflow: 'hidden', display: 'inline-block' }}
          >
            GnaXkbmMV1zGK6bRCQnM9Jd6Jv2Hjw5b2PFVBaKEE5At
          </a>
        </div>
        <ul className="footer-menu">
          <li>
            <a href="https://dex.xian.org/#pair=1" target="_blank" rel="noreferrer">
              Buy $XIAN
            </a>
          </li>
          <li>
            <a href="https://chromewebstore.google.com/detail/xian-wallet/kcimjjhplbcgkcnanijkolfillgfanlc/" target="_blank" rel="noreferrer">
              Wallet
            </a>
          </li>
          <li>
            <a href="https://docs.xian.org/" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </li>
          <li>
            <a href="https://explorer.xian.org/" target="_blank" rel="noreferrer">
              Explorer
            </a>
          </li>
          <li>
            <a href="#social">Community</a>
          </li>
        </ul>
        <div className="copyright mob">All rights reserved. XIAN (c) 2025</div>
        <div className="footer-bottom">
          <div className="footer-logo__block">
            <a href="/" className="logo">
              <img src="/assets/img/logo.svg" alt="logo" />
            </a>
            <p>
              Built on Xian.
              <br />
              Powered by Python.
              <br />
              Shaping the{' '}
              <span className="typewriter-text" data-text='["Innovation", "Decentralization", "Possibilities"]'>
                Future
              </span>
            </p>
          </div>
          <div className="copyright">All rights reserved. XIAN (c) 2025</div>
          <div className="footer-design">
            <p>Designed by</p>
            <a href="https://generis.agency/" target="_blank" rel="noreferrer" className="logo">
              <img src="/assets/img/generis.svg" alt="logo generis" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
