import Header from './Header.jsx';
import HeroSection from './sections/HeroSection.jsx';
import PartnerLogosSection from './sections/PartnerLogosSection.jsx';
import EmpowerSection from './sections/EmpowerSection.jsx';
import GetStartedSection from './sections/GetStartedSection.jsx';
import ShowcaseSection from './sections/ShowcaseSection.jsx';
import WhySection from './sections/WhySection.jsx';
import MeetSection from './sections/MeetSection.jsx';
import CtaSection from './sections/CtaSection.jsx';
import RoadmapSection from './sections/RoadmapSection.jsx';
import NewsSection from './sections/NewsSection.jsx';
import JoinSection from './sections/JoinSection.jsx';
import Footer from './Footer.jsx';
import Modals from './support/Modals.jsx';
import FloatingActions from './support/FloatingActions.jsx';
import { assetPath } from '../utils/assetPath.js';
import styles from '../styles/main.module.scss';

function PageWrapper() {
  const pageWrapperClass = styles?.pageWrapper ? `${styles.pageWrapper} page__wrapper` : 'page__wrapper';
  return (
    <div className={pageWrapperClass}>
      <div className="main-gradient-right">
        <img src={assetPath('assets/img/bg-main-gradient-right.png')} alt="alt" />
      </div>
      <div className="main-gradient">
        <picture>
          <source media="(max-width: 480px)" srcSet={assetPath('assets/img/bg-main-gradient.png')} />
          <img src={assetPath('assets/img/main-gradient.png')} alt="alt" />
        </picture>
      </div>

      <Header />
      <main>
        <HeroSection />
        <PartnerLogosSection />
        <EmpowerSection />
        <GetStartedSection />
        <ShowcaseSection />
        <WhySection />
        <MeetSection />
        <CtaSection />
        <RoadmapSection />
        <NewsSection />
        <JoinSection />
      </main>
      <Footer />
      <Modals />
      <FloatingActions />
    </div>
  );
}

export default PageWrapper;
