
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'hover' | 'interactive';
  highlight?: 'top' | 'left' | 'none';
}

const GlassCard = ({
  children,
  className,
  variant = 'default',
  highlight = 'none',
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 relative overflow-hidden',
        {
          'hover:translate-y-[-4px]': variant === 'hover',
          'hover:translate-y-[-4px] cursor-pointer': variant === 'interactive',
          'before:absolute before:inset-0 before:rounded-2xl before:border-t-2 before:border-white/30 before:pointer-events-none': highlight === 'top',
          'before:absolute before:inset-0 before:rounded-2xl before:border-l-2 before:border-white/30 before:pointer-events-none': highlight === 'left',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
