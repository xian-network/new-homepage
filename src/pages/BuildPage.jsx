import HeroSection from '../components/sections/HeroSection.jsx';
import PartnerLogosSection from '../components/sections/PartnerLogosSection.jsx';
import EmpowerSection from '../components/sections/EmpowerSection.jsx';
import GetStartedSection from '../components/sections/GetStartedSection.jsx';
import ShowcaseSection from '../components/sections/ShowcaseSection.jsx';
import WhySection from '../components/sections/WhySection.jsx';
import CtaSection from '../components/sections/CtaSection.jsx';
import RoadmapSection from '../components/sections/RoadmapSection.jsx';
import NewsSection from '../components/sections/NewsSection.jsx';
import JoinSection from '../components/sections/JoinSection.jsx';

const QUICKSTART_STEPS = [
  {
    title: 'Install the CLI',
    description: 'pip install xian-py to add the Xian command line toolkit to your Python environment.',
    links: [
      {
        label: 'Installation guide',
        href: 'https://docs.xian.org/getting-started/installation',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
  {
    title: 'Bootstrap a project',
    description: 'Run `xian init hello-xian` to scaffold a contract with tests, deployment scripts, and GraphQL bindings.',
    links: [
      {
        label: 'View quickstart',
        href: 'https://docs.xian.org/getting-started/quickstart',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
  {
    title: 'Write Python logic',
    description: 'Use familiar Python packages to model your state machine. Each contract ships with automatic schema generation.',
    links: [
      {
        label: 'Contract examples',
        href: 'https://docs.xian.org/smart-contracts/overview',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
  {
    title: 'Deploy in 60 seconds',
    description: 'Authenticate with your wallet, publish to testnet or mainnet, and stream logs directly in your terminal.',
    links: [
      {
        label: 'Deployment docs',
        href: 'https://docs.xian.org/deployment/overview',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
];

const WHY_ITEMS = [
  {
    icon: 'assets/img/why-icon-1.svg',
    title: 'Native Python runtime',
    description: 'No new DSLs. Import requests, pandas, numpy, and custom packages to compose production-grade logic.',
  },
  {
    icon: 'assets/img/why-icon-2.svg',
    title: 'Instant data access',
    description: 'Auto-generated GraphQL endpoints and wallet libraries make it painless to wire your UI or backend.',
  },
  {
    icon: 'assets/img/why-icon-3.svg',
    title: 'Earn from usage',
    description: '68% of gas fees route to the address that deployed the contract. More adoption equals compounding revenue.',
  },
  {
    icon: 'assets/img/why-icon-4.svg',
    title: 'Supportive ecosystem',
    description: 'Access grants, bounties, and code reviews from the core team and fellow builders shipping on Xian.',
  },
];

function BuildPage() {
  return (
    <>
      <HeroSection page="build" />
      <PartnerLogosSection />
      <EmpowerSection />
      <GetStartedSection
        title="60-second Quickstart"
        description="Launch your first Python smart contract with a workflow that feels like every other Python project."
        steps={QUICKSTART_STEPS}
      />
      <ShowcaseSection />
      <WhySection
        heading="Why developers choose Xian"
        description="Xian abstracts the blockchain friction so you can stay focused on Python. Tooling, data, and economics are tuned for builders."
        actions={[
          {
            label: 'Read the Docs',
            href: 'https://docs.xian.org',
            target: '_blank',
            rel: 'noreferrer',
          },
          {
            label: 'Join the Builders Chat',
            href: 'https://discord.gg/nWQ4sPZXr5',
            target: '_blank',
            rel: 'noreferrer',
          },
        ]}
        items={WHY_ITEMS}
      />
      <CtaSection
        title="Deploy your first Python contract"
        buttons={[
          { label: 'Run the Quickstart', href: '#get-started' },
          {
            label: 'Open Documentation',
            href: 'https://docs.xian.org',
            target: '_blank',
            rel: 'noreferrer',
          },
        ]}
      />
      <RoadmapSection />
      <NewsSection />
      <JoinSection />
    </>
  );
}

export default BuildPage;
