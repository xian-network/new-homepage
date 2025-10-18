import { useEffect, useState } from 'react';
import { initPageInteractions } from './interactions/index.js';

const CONTENT_URL = '/page-content.html';

function App() {
  const [content, setContent] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetch(CONTENT_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.status}`);
        }
        return response.text();
      })
      .then((html) => {
        if (isMounted) {
          setContent(html);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!content) return;
    const cleanup = initPageInteractions();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [content]);

  return (
    <div
      className="app"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default App;
