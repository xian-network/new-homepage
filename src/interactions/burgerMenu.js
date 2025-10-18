export function initBurgerMenu(cleanups) {
  const btn = document.querySelector('.btn_nav');
  const burger = document.querySelector('.burger');
  const headerWrapper = document.querySelector('.header-wrapper');
  if (!btn || !burger || !headerWrapper) return;

  const body = document.body;
  const bgBlur = document.querySelector('.bg-blur');
  const header = document.querySelector('.header');

  const openMenu = () => {
    burger.classList.add('active');
    headerWrapper.style.display = 'flex';
    body.classList.add('hidden');
    bgBlur?.classList.add('blur');
    header?.classList.add('blur');
  };

  const closeMenu = () => {
    burger.classList.remove('active');
    headerWrapper.style.display = '';
    body.classList.remove('hidden');
    bgBlur?.classList.remove('blur');
    header?.classList.remove('blur');
  };

  const toggleMenu = () => {
    if (window.innerWidth > 992) return;
    if (headerWrapper.style.display === 'flex') {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const clickHandler = (event) => {
    event.preventDefault();
    toggleMenu();
  };

  btn.addEventListener('click', clickHandler);
  cleanups.push(() => btn.removeEventListener('click', clickHandler));

  const closeTargets = headerWrapper.querySelectorAll('a, .main-button');
  const linkHandler = () => closeMenu();
  closeTargets.forEach((el) => el.addEventListener('click', linkHandler));
  cleanups.push(() => closeTargets.forEach((el) => el.removeEventListener('click', linkHandler)));

  const resizeHandler = () => {
    if (window.innerWidth > 992) {
      headerWrapper.style.display = '';
      closeMenu();
    }
  };

  window.addEventListener('resize', resizeHandler);
  cleanups.push(() => window.removeEventListener('resize', resizeHandler));
}
