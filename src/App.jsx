import { useEffect } from 'react';
import PageWrapper from './components/PageWrapper.jsx';
import { initPageInteractions } from './interactions/index.js';

function App() {
  useEffect(() => {
    const cleanup = initPageInteractions();
    return () => {
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);

  return <PageWrapper />;
}

export default App;
