import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import viteConfig from '../vite.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

async function buildStaticHtml() {
  const base = viteConfig?.base ?? './';
  globalThis.__BASE_URL__ = base;
  const vite = await createServer({
    root: projectRoot,
    logLevel: 'error',
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
    const appHtml = await render();

    const indexPath = path.resolve(projectRoot, 'dist/index.html');
    let indexHtml = await readFile(indexPath, 'utf-8');

    const placeholder = '<div id="root"><!--app-html--></div>';
    if (!indexHtml.includes(placeholder)) {
      throw new Error('Root placeholder not found in dist/index.html');
    }

    const hydratedHtml = `<div id="root">${appHtml}</div>`;
    indexHtml = indexHtml.replace(placeholder, hydratedHtml);

    await writeFile(indexPath, indexHtml, 'utf-8');
    console.log('Pre-rendered static HTML written to dist/index.html');
  } finally {
    await vite.close();
  }
}

buildStaticHtml().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
