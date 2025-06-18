import React from 'react';
import '../styles/loading-spinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export function LoadingSpinner({ 
  size = 'medium',
  color = '#4F46E5' // Using our primary color from Tailwind config
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="loading-spinner-container">
      <div className={`loading-spinner ${sizeClasses[size]}`}>
        <div className="boxes-container">
          <div className="box box1" style={{ backgroundColor: color }}></div>
          <div className="box box2" style={{ backgroundColor: color }}></div>
          <div className="box box3" style={{ backgroundColor: color }}></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
} 