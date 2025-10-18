const PROJECTS = [
  {
    title: 'Xian Name Service',
    description: 'A decentralized naming service for Xian addresses, built on Xian.',
    href: 'https://xns.domains',
    img: '/assets/img/xns.domains_-min.png',
    ribbon: 'LIVE',
  },
  {
    title: 'PixelSnek',
    description: 'On-Chain NFT Pixel Animation Platform',
    href: 'https://pixelsnek.xian.org',
    img: '/assets/img/pixelsnek.xian.org_-min.png',
    ribbon: 'LIVE',
  },
  {
    title: 'SNAKexchange',
    description: 'A decentralized exchange for Xian assets.',
    href: 'https://snakexchange.org/',
    img: '/assets/img/snakexchange.org-min.png',
    ribbon: 'LIVE',
  },
  {
    title: 'XWT Platform',
    description: 'Token staking rewards and launch pad platform, powered by the $XWT token.',
    href: 'https://xwtplatform.com/',
    img: '/assets/img/xwt.png',
    ribbon: 'LIVE',
  },
  {
    title: 'XIAN DEX',
    description: 'Advanced trading interface offering decentralized exchange, farms and staking.',
    href: 'https://dex.xian.org',
    img: '/assets/img/xian-dex.png',
    ribbon: 'LIVE',
  },
  {
    title: 'XARB Protocol',
    description:
      'Arbitrage protocol generating profits from XIAN market movements, feeding value back into $XIAN and $XARB tokens.',
    href: 'https://t.me/XianArbitrage',
    img: '/assets/img/xarb.jpg',
    ribbon: 'LIVE',
  },
];

function ShowcaseSection() {
  return (
    <section className="showcase" id="showcase">
      <div className="container">
        <div className="main-block">
          <h2>Built on Xian</h2>
          <p>Explore some of the apps and projects harnessing native Python on Xian.</p>
        </div>
        <div className="showcase-grid">
          {PROJECTS.map((project) => (
            <div className="showcase-card" key={project.title}>
              <img src={project.img} alt="Project Logo" className="showcase-card__img" />
              <div className="showcase-card__ribbon">{project.ribbon}</div>
              <div className="showcase-card__content">
                <h3 className="showcase-card__title">{project.title}</h3>
                <p className="showcase-card__desc">{project.description}</p>
                <a href={project.href} target="_blank" rel="noreferrer" className="main-button">
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ShowcaseSection;
