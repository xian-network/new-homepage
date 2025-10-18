import { assetPath } from '../../utils/assetPath.js';

function PartnerLogosSection() {
  return (
    <section id="partner-logos">
      <div className="container logos">
        <div className="coingecko-logo">
          <a href="https://www.coingecko.com/en/coins/xian" title="Xian on CoinGecko" target="_blank" rel="noopener noreferrer">
            <img
              src={assetPath('assets/img/coingecko.svg')}
              alt="CoinGecko"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
        <div className="dextrade-logo">
          <a
            href="https://dex-trade.com/spot/trading/XIANUSDT?interface=classic"
            target="_blank"
            rel="noopener noreferrer"
            title="Xian on Dex-Trade"
          >
            <img
              src={assetPath('assets/img/dex-trade.svg')}
              alt="Dex-Trade"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default PartnerLogosSection;
