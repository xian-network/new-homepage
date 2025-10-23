import HeroSection from '../components/sections/HeroSection.jsx';
import PartnerLogosSection from '../components/sections/PartnerLogosSection.jsx';
import SplitPathsSection from '../components/sections/SplitPathsSection.jsx';
import EmpowerSection from '../components/sections/EmpowerSection.jsx';
import ShowcaseSection from '../components/sections/ShowcaseSection.jsx';
import WhySection from '../components/sections/WhySection.jsx';
import MeetSection from '../components/sections/MeetSection.jsx';
import CtaSection from '../components/sections/CtaSection.jsx';
import RoadmapSection from '../components/sections/RoadmapSection.jsx';
import NewsSection from '../components/sections/NewsSection.jsx';
import JoinSection from '../components/sections/JoinSection.jsx';

function HomePage() {
  return (
    <>
      <HeroSection page="home" />
      <PartnerLogosSection />
      <SplitPathsSection />
      <EmpowerSection />
      <ShowcaseSection />
      <WhySection
        heading="Why Xian works for builders and users"
        description="Xian is live with tools, liquidity, and governance that reward everyone who participates. Builders deploy in familiar Python, and users benefit from fast settlement, real yields, and a deflationary token."
        actions={[
          { label: 'Developers →', href: '/build/' },
          { label: 'Users →', href: '/use/' },
        ]}
        items={[
          {
            icon: 'assets/img/why-icon-1.svg',
            title: 'Python-native contracts',
            description:
              'Write production code in Python, ship with the Xian CLI, and expose GraphQL APIs instantly for your frontends.',
          },
          {
            icon: 'assets/img/why-icon-2.svg',
            title: 'Live earning opportunities',
            description:
              'Stake, farm, and trade on protocols like Xian DEX and XWT Platform—each reinforcing $XIAN demand and rewards.',
          },
          {
            icon: 'assets/img/why-icon-3.svg',
            title: 'Aligned economics',
            description:
              '68% of every transaction fee flows to contract developers, 30% to validators, 1% to ecosystem growth, and 1% burns forever.',
          },
          {
            icon: 'assets/img/why-icon-4.svg',
            title: 'Community-led roadmap',
            description:
              'Ship features, vote on upgrades, and launch products without permission—grants and bounties are always on.',
          },
        ]}
      />
      <MeetSection />
      <CtaSection
        title="Ready to explore both tracks?"
        buttons={[
          { label: 'Start Building', href: '/build/' },
          { label: 'Start Using', href: '/use/' },
        ]}
      />
      <RoadmapSection />
      <NewsSection />
      <JoinSection />
    </>
  );
}

export default HomePage;
