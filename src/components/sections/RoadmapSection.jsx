import { assetPath } from '../../utils/assetPath.js';

function RoadmapSection() {
  return (
    <section className="roadmap" id="roadmap">
      <div className="roadmap-gradient">
        <img src={assetPath('assets/img/roadmap-gradient.png')} alt="gradient" loading="lazy" decoding="async" />
      </div>
      <div className="container">
        <h2>Roadmap</h2>
        <div style={{ marginTop: '2rem' }}>
          <div id="roadmap-content" className="roadmap-content">
            <div className="loading-message">
              <p>Loading roadmap from Trello...</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href="https://trello.com/b/3yPhI9gn/xian-roadmap" target="_blank" rel="noreferrer" className="main-button">
              View Full Board on Trello
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RoadmapSection;
