import { initBurgerMenu } from './burgerMenu.js';
import { initTypewriter } from './typewriter.js';
import { initOrbitingSun } from './orbitingSun.js';
import { initDropdowns } from './dropdowns.js';
import { initNewsSlider } from './newsSlider.js';
import { loadTokens } from './tokens.js';
import { initPieChart } from './pieChart.js';
import { loadTrelloRoadmap, initRoadmapInteractions } from './roadmap.js';
import { initModalShortcuts, registerModalGlobals } from './modals.js';
import { registerCodeToggle } from './codeToggle.js';
import { initFab } from './fab.js';
import { initReferralTracker } from './referral.js';

export function initPageInteractions() {
  const cleanups = [];

  const registerCleanup = (cleanup) => {
    if (typeof cleanup === 'function') {
      cleanups.push(cleanup);
    }
  };

  const safeRun = (label, callback) => {
    try {
      callback();
    } catch (error) {
      console.error(`Failed to initialize ${label}`, error);
    }
  };

  safeRun('modal globals', () => {
    registerCleanup(registerModalGlobals());
  });

  safeRun('burger menu', () => initBurgerMenu(cleanups));
  safeRun('typewriter', () => initTypewriter(cleanups));
  safeRun('orbiting sun', () => initOrbitingSun(cleanups));
  safeRun('dropdowns', () => initDropdowns(cleanups));
  safeRun('news slider', () => initNewsSlider(cleanups));
  safeRun('token loader', loadTokens);
  safeRun('pie chart', () => initPieChart(cleanups));
  safeRun('trello roadmap loader', loadTrelloRoadmap);
  safeRun('roadmap interactions', () => initRoadmapInteractions(cleanups));
  safeRun('modal shortcuts', () => initModalShortcuts(cleanups));
  safeRun('floating action buttons', () => initFab(cleanups));
  safeRun('referral tracker', initReferralTracker);

  safeRun('code toggle', () => {
    registerCleanup(registerCodeToggle());
  });

  return () => {
    cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error('Failed to cleanup interaction', error);
      }
    });
  };
}
