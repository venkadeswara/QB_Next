import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

interface TooltipProps {
  tooltipText: string;
  position?: 'top' | 'right' | 'bottom'; 
  children: React.ReactNode;
  marginClass?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltipText, position = 'top', children, marginClass = '' }) => {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const calculatePosition =useCallback(() => {
    const triggerElement = triggerRef.current;
    if (triggerElement) {
      const rect = triggerElement.getBoundingClientRect();

      let newPosition = { top: 0, left: 0 };

      switch (position) {
        case 'right':
          newPosition = {top: rect.top + (rect.height / 2),left: rect.right + 5,};
          break;
        case 'bottom':
          newPosition = {top: rect.bottom + 15, left: rect.left + (rect.width / 2), };
          break;
        case 'top':
        default:
          newPosition = {top: rect.top -30, left: rect.left + (rect.width / 2), };
          break;
      }

      setTooltipPosition(newPosition);
    }
  },[position]);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('scroll', calculatePosition);
      window.addEventListener('resize', calculatePosition);
    } else {
      window.removeEventListener('scroll', calculatePosition);
      window.removeEventListener('resize', calculatePosition);
    }
  }, [isVisible, calculatePosition]);

  const tooltipContent = isVisible && (
    <div
      style={{
        position: 'fixed',
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        transform: position === 'right' ? 'translateY(-50%)' : 'translateX(-50%)',
        zIndex: 50,
      }}
      className={`bg-gray-500 text-white text-xs rounded py-1 px-2 whitespace-no-wrap ${marginClass}`}
      >
      {tooltipText}
    </div>
  );

  return (
    <div
      ref={triggerRef}
      className="relative group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {ReactDOM.createPortal(tooltipContent, document.body)}
    </div>
  );
};

export default Tooltip;

