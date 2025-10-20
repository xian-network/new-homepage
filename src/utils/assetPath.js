export function assetPath(path) {
  const baseUrl =
    (typeof globalThis !== 'undefined' && globalThis.__BASE_URL__) ||
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ||
    './';
  const base = baseUrl ?? './';
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;
  if (!trimmedBase) {
    return `/${trimmedPath}`;
  }
  if (trimmedBase === '.') {
    return `./${trimmedPath}`;
  }
  return `${trimmedBase}/${trimmedPath}`;
}
