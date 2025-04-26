import React from 'react';

export function GoogleVertexIcon({ className = '', size = 24 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 6.3913L17.9443 17.6087H6.05566L12 6.3913Z" fill="#669DF6"/>
      <path d="M12 6.3913V17.6087L17.9443 17.6087L12 6.3913Z" fill="#4285F4"/>
    </svg>
  );
}