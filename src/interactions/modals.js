import { parseMarkdown, renderLabels } from './roadmapContent.js';

export function openCardModal(cardId, title, description, labels) {
  const modal = document.getElementById('cardModal');
  if (!modal) return;

  const modalTitle = document.getElementById('modalTitle');
  const modalLabels = document.getElementById('modalLabels');
  const modalDescription = document.getElementById('modalDescription');

  if (modalTitle) modalTitle.textContent = title;
  if (modalLabels) modalLabels.innerHTML = labels && labels.length ? renderLabels(labels) : '';
  if (modalDescription) modalDescription.innerHTML = parseMarkdown(description);

  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
  document.body.style.overflow = 'hidden';
}

export function closeCardModal() {
  const modal = document.getElementById('cardModal');
  if (!modal) return;
  modal.classList.remove('show');
  window.setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

export function openWalletModal() {
  const modal = document.getElementById('walletModal');
  if (!modal) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
  document.body.style.overflow = 'hidden';
}

export function closeWalletModal() {
  const modal = document.getElementById('walletModal');
  if (!modal) return;
  modal.classList.remove('show');
  window.setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

export function openExchangeModal() {
  const modal = document.getElementById('exchangeModal');
  if (!modal) return;
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('show'));
  document.body.style.overflow = 'hidden';
}

export function closeExchangeModal() {
  const modal = document.getElementById('exchangeModal');
  if (!modal) return;
  modal.classList.remove('show');
  window.setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }, 300);
}

export function initModalShortcuts(cleanups) {
  const keyHandler = (event) => {
    if (event.key !== 'Escape') return;
    closeCardModal();
    closeWalletModal();
    closeExchangeModal();
  };

  document.addEventListener('keydown', keyHandler);
  cleanups.push(() => document.removeEventListener('keydown', keyHandler));
}

export function registerModalGlobals() {
  window.openCardModal = openCardModal;
  window.closeCardModal = closeCardModal;
  window.openWalletModal = openWalletModal;
  window.closeWalletModal = closeWalletModal;
  window.openExchangeModal = openExchangeModal;
  window.closeExchangeModal = closeExchangeModal;

  return () => {
    if (window.openCardModal === openCardModal) delete window.openCardModal;
    if (window.closeCardModal === closeCardModal) delete window.closeCardModal;
    if (window.openWalletModal === openWalletModal) delete window.openWalletModal;
    if (window.closeWalletModal === closeWalletModal) delete window.closeWalletModal;
    if (window.openExchangeModal === openExchangeModal) delete window.openExchangeModal;
    if (window.closeExchangeModal === closeExchangeModal) delete window.closeExchangeModal;
  };
}
