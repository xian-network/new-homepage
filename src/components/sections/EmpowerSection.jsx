import { assetPath } from '../../utils/assetPath.js';
import ProgressiveDisclosure from '../support/ProgressiveDisclosure.jsx';

const CONTRACT_CODE = `
<span class="py-keyword">import</span> <span class="py-builtin">currency</span><span class="py-comment">  # currency is the main token/currency of the network</span>
<span class="py-builtin">safe</span> = <span class="py-builtin">Hash</span>(default_value=<span class="py-number">0</span>)

<span class="py-decorator">@export</span>
<span class="py-keyword">def</span> <span class="py-identifier">deposit</span>(amount: <span class="py-builtin">float</span>):
    <span class="py-builtin">currency</span>.<span class="py-identifier">transfer_from</span>(
        amount=amount,
        to=<span class="py-builtin">ctx</span>.<span class="py-identifier">this</span>,
        main_account=<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>
    )
    <span class="py-builtin">safe</span>[<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>] += amount

<span class="py-decorator">@export</span>
<span class="py-keyword">def</span> <span class="py-identifier">withdraw</span>(amount: <span class="py-builtin">float</span>):
    <span class="py-keyword">assert</span> <span class="py-builtin">safe</span>[<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>] >= amount, <span class="py-string">'insufficient funds'</span>
    <span class="py-builtin">currency</span>.<span class="py-identifier">transfer</span>(amount=amount, to=<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>)
    <span class="py-builtin">safe</span>[<span class="py-builtin">ctx</span>.<span class="py-identifier">caller</span>] -= amount
`;

function EmpowerSection() {
  return (
    <section className="empower section-spacing" id="empower">
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
        <div className="empower-description content-rhythm">
          <p>
            Xian eliminates the learning curve, allowing Python developers to build blockchain applications instantly—without
            mastering new programming languages or complex frameworks.
          </p>
          
          <ProgressiveDisclosure
            title="Why Python for Blockchain?"
            preview="Discover how Python bridges the gap between traditional development and blockchain innovation..."
            variant="minimal"
          >
            <p>
              By bridging Python with blockchain, AI, and fintech, Xian removes barriers and expands what's possible. Whether
              you're building smart contracts, AI-powered dApps, or financial applications, one language does it all.
            </p>
            <p>
              Python's simplicity and extensive ecosystem make it the perfect choice for blockchain development. With over 13 million 
              Python developers worldwide, Xian opens blockchain development to a massive community of skilled programmers.
            </p>
          </ProgressiveDisclosure>
        </div>
        <h2 style={{ marginTop: '6rem', marginBottom: '2rem', textAlign: 'center' }}>
          The Python blockchain for real smart contracts
        </h2>
        <div className="contract-example">
          <div className="contract-header">
            <h3>Python Contracts in Action</h3>
            <button
              className="toggle-code"
              id="toggle-code"
              type="button"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={(event) => window.toggleCode?.(event.currentTarget)}
            >
              <span>Show Code</span>
              <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#06e6cb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <div className="code-block">
            <pre>
              <code className="language-python" dangerouslySetInnerHTML={{ __html: CONTRACT_CODE }} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmpowerSection;
