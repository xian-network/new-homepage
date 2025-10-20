import { useEffect, useState } from 'react';

function Minimap() {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const sections = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'partner-logos', label: 'Partners', icon: '🤝' },
    { id: 'empower', label: 'Python Power', icon: '🐍' },
    { id: 'get-started', label: 'Get Started', icon: '🚀' },
    { id: 'showcase', label: 'Showcase', icon: '✨' },
    { id: 'why', label: 'Why Xian', icon: '💡' },
    { id: 'meet', label: 'Meet Team', icon: '👥' },
    { id: 'cta', label: 'Join Us', icon: '📢' },
    { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'join', label: 'Community', icon: '🌐' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show minimap after scrolling past hero
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 200);
      }

      // Find active section
      const sectionElements = sections.map(section => ({
        ...section,
        element: document.querySelector(`.${section.id}`) || document.getElementById(section.id)
      })).filter(section => section.element);

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.element && scrollPosition >= section.element.offsetTop) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`.${sectionId}`) || document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="minimap">
      <div className="minimap-header">
        <span className="minimap-title">Navigation</span>
      </div>
      <nav className="minimap-nav">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`minimap-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => scrollToSection(section.id)}
            title={section.label}
          >
            <span className="minimap-icon">{section.icon}</span>
            <span className="minimap-label">{section.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Minimap;