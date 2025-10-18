const LABELS = {
  show: 'Show Code',
  hide: 'Hide Code',
};

function findElements(button) {
  if (!(button instanceof HTMLElement)) {
    return {};
  }

  const container = button.closest('.contract-example');
  const codeBlock = container ? container.querySelector('.code-block') : null;
  return { container, codeBlock };
}

function updateLabel(button, expanded) {
  const label = button.querySelector('span');
  if (label) {
    label.textContent = expanded ? LABELS.hide : LABELS.show;
  }
  button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

function toggleCode(button) {
  if (!(button instanceof HTMLElement)) {
    return;
  }

  const { codeBlock } = findElements(button);
  if (!codeBlock) {
    return;
  }

  const expanded = !codeBlock.classList.contains('expanded');
  codeBlock.classList.toggle('expanded', expanded);
  button.classList.toggle('open', expanded);
  updateLabel(button, expanded);
}

export function registerCodeToggle() {
  const toggle = (button) => toggleCode(button);
  window.toggleCode = toggle;

  const button = document.getElementById('toggle-code');
  if (button instanceof HTMLElement) {
    updateLabel(button, button.classList.contains('open'));
    const { codeBlock } = findElements(button);
    if (codeBlock && !codeBlock.id) {
      codeBlock.id = 'contract-code-block';
      button.setAttribute('aria-controls', codeBlock.id);
    }
  }

  return () => {
    if (window.toggleCode === toggle) {
      delete window.toggleCode;
    }
  };
}
