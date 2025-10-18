import Swiper from 'swiper';
import 'swiper/css';

export function initNewsSlider(cleanups) {
  const sliderEl = document.querySelector('.news-slider');
  if (!sliderEl) return;

  const swiperInstance = new Swiper('.news-slider', {
    slidesPerView: 2,
    spaceBetween: 90,
    allowTouchMove: true,
    loop: false,
    breakpoints: {
      992: {
        slidesPerView: 2,
        spaceBetween: 90,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
      },
    },
  });

  cleanups.push(() => swiperInstance.destroy(true, true));
}
