import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

const rootElement = document.getElementById('root');
if (typeof window !== 'undefined') {
  window.__BASE_URL__ = import.meta.env.BASE_URL;
}
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (rootElement?.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else if (rootElement) {
  createRoot(rootElement).render(app);
}
