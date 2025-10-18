export function initFab(cleanups) {
  const fab = document.getElementById('buyFab');
  const menu = document.getElementById('fabMenu');
  if (!fab || !menu) return;

  const toggle = () => {
    const expanded = fab.getAttribute('aria-expanded') === 'true';
    const nextState = !expanded;
    fab.setAttribute('aria-expanded', String(nextState));
    menu.classList.toggle('open', nextState);
    fab.classList.toggle('open', nextState);
  };

  const outsideClick = (event) => {
    if (!fab.contains(event.target) && !menu.contains(event.target)) {
      fab.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      fab.classList.remove('open');
    }
  };

  fab.addEventListener('click', toggle);
  document.addEventListener('click', outsideClick);

  cleanups.push(() => {
    fab.removeEventListener('click', toggle);
    document.removeEventListener('click', outsideClick);
  });
}
