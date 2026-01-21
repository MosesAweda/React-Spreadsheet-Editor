import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
  active?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', active, ...props }, ref) => {
    const classes = [
      'rse-btn',
      `rse-btn-${variant}`,
      size !== 'default' && `rse-btn-${size}`,
      active && 'active',
      className
    ].filter(Boolean).join(' ');

    return <button className={classes} ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';