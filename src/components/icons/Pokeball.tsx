import React from 'react';

interface PokeballProps {
  className?: string;
}

export const Pokeball: React.FC<PokeballProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
      <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
      <circle cx="12" cy="12" r="3" />
      <line x1="2" y1="12" x2="22" y2="12" />
    </svg>
  );
};