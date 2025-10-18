export function initTypewriter(cleanups) {
  const elements = document.querySelectorAll('.typewriter-text');
  const timers = [];
  const timeouts = [];

  elements.forEach((el) => {
    const textsAttr = el.getAttribute('data-text');
    if (!textsAttr) return;
    let texts;
    try {
      texts = JSON.parse(textsAttr);
    } catch (error) {
      return;
    }
    if (!Array.isArray(texts) || texts.length === 0) return;

    let index = 0;

    const typeText = () => {
      const text = texts[index];
      let charIndex = 0;

      const intervalId = setInterval(() => {
        el.textContent = text.slice(0, charIndex + 1);
        charIndex += 1;
        if (charIndex >= text.length) {
          clearInterval(intervalId);
          const timeoutId = window.setTimeout(() => deleteText(), 2000);
          timeouts.push(timeoutId);
        }
      }, 150);
      timers.push(intervalId);
    };

    const deleteText = () => {
      const text = texts[index];
      let charIndex = text.length;
      const intervalId = setInterval(() => {
        charIndex -= 1;
        el.textContent = text.slice(0, Math.max(charIndex, 0));
        if (charIndex <= 0) {
          clearInterval(intervalId);
          index = (index + 1) % texts.length;
          typeText();
        }
      }, 150);
      timers.push(intervalId);
    };

    typeText();
  });

  cleanups.push(() => {
    timers.forEach((id) => clearInterval(id));
    timeouts.forEach((id) => clearTimeout(id));
  });
}
