const LABELS = {
  show: 'Show Demo',
  hide: 'Hide Demo',
};

function findElements(button) {
  if (!(button instanceof HTMLElement)) {
    return {};
  }

  const container = button.closest('.contract-example');
  const contractBody = container ? container.querySelector('.contract-body') : null;
  const codeBlock = contractBody ? contractBody.querySelector('.code-block') : null;
  return { container, contractBody, codeBlock };
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

  const { contractBody, codeBlock } = findElements(button);
  if (!contractBody) {
    return;
  }

  const expanded = contractBody.hasAttribute('hidden');
  if (expanded) {
    contractBody.removeAttribute('hidden');
    contractBody.setAttribute('aria-hidden', 'false');
  } else {
    contractBody.setAttribute('hidden', '');
    contractBody.setAttribute('aria-hidden', 'true');
  }

  if (codeBlock) {
    codeBlock.classList.toggle('expanded', expanded);
  }

  button.classList.toggle('open', expanded);
  updateLabel(button, expanded);
}

export function registerCodeToggle() {
  const toggle = (button) => toggleCode(button);
  window.toggleCode = toggle;

  const button = document.getElementById('toggle-code');
  if (button instanceof HTMLElement) {
    const { contractBody, codeBlock } = findElements(button);
    const expanded = contractBody ? !contractBody.hasAttribute('hidden') : button.classList.contains('open');
    button.classList.toggle('open', expanded);
    updateLabel(button, expanded);

    if (contractBody) {
      if (!contractBody.id) {
        contractBody.id = 'contract-demo-body';
      }
      contractBody.setAttribute('aria-hidden', expanded ? 'false' : 'true');
      button.setAttribute('aria-controls', contractBody.id);
    }

    if (codeBlock) {
      codeBlock.classList.toggle('expanded', expanded);
    }
  }

  return () => {
    if (window.toggleCode === toggle) {
      delete window.toggleCode;
    }
  };
}
