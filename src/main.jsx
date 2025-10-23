import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

const rootElement = document.getElementById('root');
if (typeof window !== 'undefined') {
  window.__BASE_URL__ = import.meta.env.BASE_URL;
}

const initialPage =
  (typeof document !== 'undefined' && document.body?.dataset?.page) ||
  (typeof window !== 'undefined' && window.__APP_PAGE__) ||
  'home';

const app = (
  <React.StrictMode>
    <App page={initialPage} />
  </React.StrictMode>
);

if (rootElement?.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else if (rootElement) {
  createRoot(rootElement).render(app);
}
