const LABEL_COLORS = {
  green: '#61bd4f',
  yellow: '#f2d600',
  orange: '#ff9f1a',
  red: '#eb5a46',
  purple: '#c377e0',
  blue: '#0079bf',
  sky: '#00c2e0',
  lime: '#51e898',
  pink: '#ff78cb',
  black: '#4d4d4d',
  null: '#b3bac5',
};

export function renderLabels(labels) {
  if (!labels || !labels.length) return '';

  return `
    <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
      ${labels
        .map((label) => {
          const color = LABEL_COLORS[label.color] || LABEL_COLORS.null;
          const name = label.name || 'Unlabeled';
          return `
            <span class="roadmap-label" style="
              display: inline-block;
              background: ${color};
              color: white;
              padding: 0.2rem 0.5rem;
              border-radius: 12px;
              font-size: 0.75rem;
              font-weight: 500;
              margin-right: 0.5rem;
              margin-bottom: 0.25rem;
              text-shadow: 0 1px 1px rgba(0,0,0,0.3);
              white-space: nowrap;
            " title="${name}">${name}</span>
          `;
        })
        .join('')}
    </div>
  `;
}

export function parseMarkdown(text) {
  if (!text) return '<p>No description available.</p>';
  let html = text;

  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  html = html.replace(/^[\s]*[-*+] (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, (match) => `<ul>${match}</ul>`);
  html = html.replace(/^[\s]*\d+\. (.+)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, (match) =>
    match.includes('<ul>') ? match : `<ol>${match}</ol>`
  );
  html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');

  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }

  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<\/ul>\s*<ul>/g, '');
  html = html.replace(/<\/ol>\s*<ol>/g, '');
  return html;
}
