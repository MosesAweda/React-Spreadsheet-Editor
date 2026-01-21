import React from 'react';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ 
  orientation = 'horizontal', 
  className = '' 
}) => {
  const orientationClass = `rse-separator-${orientation}`;
  
  return (
    <div 
      className={`rse-separator ${orientationClass} ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};