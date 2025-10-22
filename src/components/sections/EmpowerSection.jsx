import { assetPath } from '../../utils/assetPath.js';
import ContractPlayground from '../playground/ContractPlayground.jsx';

function EmpowerSection() {
  return (
    <section className="empower">
      <div className="blue-planet">
        <picture>
          <source srcSet={assetPath('assets/img/gradient-mob.png')} media="(max-width: 480px)" />
        </picture>
      </div>
      <div className="container">
        <div className="empower-block">
          <p>Empowering 13 Million Python Developers to Build Blockchain Apps</p>
          <div className="empower-block__img">
            <img src={assetPath('assets/img/hero-logo.png')} alt="python logo" loading="lazy" decoding="async" />
          </div>
          <div className="empower-block__img mobile">
            <img src={assetPath('assets/img/bg-tablet.png')} alt="python logo" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="empower-description">
          <p>
            Xian eliminates the learning curve, allowing Python developers to build blockchain applications instantly—without
            mastering new programming languages or complex frameworks.
          </p>
          <p>
            By bridging Python with blockchain, AI, and fintech, Xian removes barriers and expands what's possible. Whether
            you're building smart contracts, AI-powered dApps, or financial applications, one language does it all.
          </p>
        </div>
        <h2 style={{ marginTop: '6rem', marginBottom: '2rem', textAlign: 'center' }}>
          The Python blockchain for real smart contracts
        </h2>
        <ContractPlayground />
      </div>
    </section>
  );
}

export default EmpowerSection;
