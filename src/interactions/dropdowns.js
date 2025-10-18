export function initDropdowns(cleanups) {
  const dropdowns = [
    { button: document.querySelector('.buy-btn'), container: document.querySelector('.btn-group') },
    { button: document.querySelector('.get-wallet-btn'), container: document.querySelector('.btn-group2') },
  ];

  dropdowns.forEach(({ button, container }) => {
    if (!button || !container) return;

    const toggle = (event) => {
      event.preventDefault();
      const open = container.classList.toggle('open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const outsideClick = (event) => {
      if (!container.contains(event.target)) {
        container.classList.remove('open');
        button.setAttribute('aria-expanded', 'false');
      }
    };

    button.addEventListener('click', toggle);
    document.addEventListener('click', outsideClick);

    cleanups.push(() => {
      button.removeEventListener('click', toggle);
      document.removeEventListener('click', outsideClick);
    });
  });
}
