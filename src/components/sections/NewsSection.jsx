function NewsSection() {
  return (
    <section className="news" id="news" style={{ display: 'none' }}>
      <div className="container">
        <h2>Latest news</h2>
        <div className="news-items">
          <div className="news-slider">
            <div className="swiper-wrapper" id="news-container" />
          </div>
          <a href="https://xiannetwork.medium.com/" target="_blank" rel="noreferrer" className="main-button">
            Read More
          </a>
        </div>
      </div>
    </section>
  );
}

export default NewsSection;
