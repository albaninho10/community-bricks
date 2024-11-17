import React from 'react';

interface TextProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  weight?: 'normal' | 'bold';
  color?: string;
}

export const Text: React.FC<TextProps> = ({ children, size = 'medium', weight = 'normal', color }) => {
  const sizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[size];

  const weightClass = weight === 'bold' ? 'font-bold' : 'font-normal';

  const colorClass = color ? `text-${color}` : 'text-black';

  return (
    <span className={`${sizeClass} ${weightClass} ${colorClass}`}>
      {children}
    </span>
  );
};