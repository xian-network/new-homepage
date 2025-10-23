import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';

export function render(page = 'home') {
  return renderToString(
    <React.StrictMode>
      <App page={page} />
    </React.StrictMode>
  );
}
