import HeroSection from '../components/sections/HeroSection.jsx';
import PartnerLogosSection from '../components/sections/PartnerLogosSection.jsx';
import GetStartedSection from '../components/sections/GetStartedSection.jsx';
import ShowcaseSection from '../components/sections/ShowcaseSection.jsx';
import WhySection from '../components/sections/WhySection.jsx';
import MeetSection from '../components/sections/MeetSection.jsx';
import CtaSection from '../components/sections/CtaSection.jsx';
import RoadmapSection from '../components/sections/RoadmapSection.jsx';
import NewsSection from '../components/sections/NewsSection.jsx';
import JoinSection from '../components/sections/JoinSection.jsx';

const USER_STEPS = [
  {
    title: 'Install Xian Wallet',
    description: 'Download the browser extension or Android app to manage your assets and sign transactions securely.',
    links: [
      {
        label: 'Download wallet',
        href: '#wallet-modal',
        onClick: (event) => {
          event.preventDefault();
          window.openWalletModal?.();
        },
      },
    ],
  },
  {
    title: 'Create & secure your account',
    description: 'Generate a new address, back up your seed phrase, and connect hardware wallets for extra protection.',
    links: [
      {
        label: 'Wallet guide',
        href: 'https://docs.xian.org/wallet/overview',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
  {
    title: 'Fund or bridge',
    description: 'Swap SOL for $XIAN on Raydium or move liquidity directly through the official bridge.',
    links: [
      {
        label: 'Use Bridge',
        href: 'https://bridge.xian.org',
        target: '_blank',
        rel: 'noreferrer',
      },
      {
        label: 'Buy on Raydium',
        href: 'https://raydium.io/swap/?inputMint=sol&outputMint=GnaXkbmMV1zGK6bRCQnM9Jd6Jv2Hjw5b2PFVBaKEE5At',
        target: '_blank',
        rel: 'noreferrer',
      },
    ],
  },
  {
    title: 'Try a live app',
    description: 'Mint a name, farm yields, or trade on the native DEX to complete your first transaction.',
    links: [
      {
        label: 'Explore dApps',
        href: '#showcase',
      },
    ],
  },
];

const WHY_ITEMS = [
  {
    icon: 'assets/img/why-icon-1.svg',
    title: 'Self-custody first',
    description: 'Control your keys with the official wallet, hardware support, and human-readable safety prompts.',
  },
  {
    icon: 'assets/img/why-icon-2.svg',
    title: 'Fast & affordable',
    description: 'Transactions finalize in seconds with negligible fees—perfect for everyday swaps, staking, and NFTs.',
  },
  {
    icon: 'assets/img/why-icon-3.svg',
    title: 'Earning opportunities',
    description: 'Access staking yields, liquidity pools, and arbitrage strategies powered by real on-chain activity.',
  },
  {
    icon: 'assets/img/why-icon-4.svg',
    title: 'Ecosystem you can trust',
    description: 'Featured apps are audited by the community and backed by transparent, on-chain treasury flows.',
  },
];

function UsePage() {
  return (
    <>
      <HeroSection page="use" />
      <PartnerLogosSection />
      <GetStartedSection
        title="Start using Xian"
        description="Install the wallet, bridge funds, and confirm your first transaction in just a few guided steps."
        steps={USER_STEPS}
      />
      <ShowcaseSection />
      <WhySection
        heading="Why users choose Xian"
        description="Own your assets, access real yield, and tap into a growing catalog of applications—without learning new tools."
        actions={[
          {
            label: 'Get the Wallet',
            href: '#wallet-modal',
            onClick: (event) => {
              event.preventDefault();
              window.openWalletModal?.();
            },
          },
          {
            label: 'Bridge Funds',
            href: 'https://bridge.xian.org',
            target: '_blank',
            rel: 'noreferrer',
          },
        ]}
        items={WHY_ITEMS}
      />
      <MeetSection />
      <CtaSection
        title="Take your first trip through Xian"
        buttons={[
          {
            label: 'Install Wallet',
            href: '#wallet-modal',
            onClick: (event) => {
              event.preventDefault();
              window.openWalletModal?.();
            },
          },
          {
            label: 'Try Xian DEX',
            href: 'https://dex.xian.org',
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

export default UsePage;
