function SplitPathsSection() {
  return (
    <section className="get-started" id="get-started">
      <div className="container">
        <div className="main-block">
          <h2>Choose your way into Xian</h2>
          <p>Follow a dedicated track whether you're deploying Python smart contracts or executing your first transaction.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span className="shine" />
            <div className="step-number">1</div>
            <h3>Developers</h3>
            <p>
              Ship production dApps with familiar tooling. Start from the CLI, deploy in under a minute, and earn 68% of gas from
              every transaction your contract executes.
            </p>
            <p>
              Highlights:&nbsp;Python-native runtime, instant GraphQL APIs, on-chain governance hooks, and composable contract
              templates built by fellow developers.
            </p>
            <a href="/build/" className="main-button bg-color">
              Visit the Developer Hub
            </a>
          </div>
          <div className="step-card">
            <span className="shine" />
            <div className="step-number">2</div>
            <h3>Users &amp; Tokenholders</h3>
            <p>
              Install the Xian Wallet, bridge funds securely, and put your assets to work across live dApps. DeFi, naming services,
              and NFT experiences are already live on mainnet.
            </p>
            <p>
              Highlights:&nbsp;self-custody wallet, one-click bridging from Solana, deflationary tokenomics, and curated apps ready
              for your first transaction.
            </p>
            <a href="/use/" className="main-button bg-color">
              Explore the User Path
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SplitPathsSection;
