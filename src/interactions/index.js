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

  initBurgerMenu(cleanups);
  initTypewriter(cleanups);
  initOrbitingSun(cleanups);
  initDropdowns(cleanups);
  initNewsSlider(cleanups);
  loadTokens();
  initPieChart(cleanups);
  loadTrelloRoadmap();
  initRoadmapInteractions(cleanups);
  initModalShortcuts(cleanups);
  initFab(cleanups);
  initReferralTracker();

  const unregisterModals = registerModalGlobals();
  if (typeof unregisterModals === 'function') {
    cleanups.push(unregisterModals);
  }

  const unregisterCodeToggle = registerCodeToggle();
  if (typeof unregisterCodeToggle === 'function') {
    cleanups.push(unregisterCodeToggle);
  }

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
