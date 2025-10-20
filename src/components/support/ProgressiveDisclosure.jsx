import { useState } from 'react';

function ProgressiveDisclosure({ 
  title, 
  preview, 
  children, 
  defaultExpanded = false,
  variant = 'default' // 'default', 'card', 'minimal'
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`progressive-disclosure ${variant}`}>
      <button 
        className="progressive-disclosure-trigger"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
      >
        <div className="progressive-disclosure-header">
          <h3 className="progressive-disclosure-title">{title}</h3>
          <svg 
            className={`progressive-disclosure-icon ${isExpanded ? 'expanded' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M6 9l6 6 6-6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>
        {preview && !isExpanded && (
          <p className="progressive-disclosure-preview">{preview}</p>
        )}
      </button>
      
      <div className={`progressive-disclosure-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="progressive-disclosure-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ProgressiveDisclosure;