import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
}

interface TooltipContentProps {
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return <div className="rse-tooltip">{children}</div>;
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  return <>{children}</>;
};

export const TooltipContent: React.FC<TooltipContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`rse-tooltip-content ${className}`}>
      {children}
    </div>
  );
};