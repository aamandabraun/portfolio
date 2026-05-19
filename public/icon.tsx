import React from 'react';

export default function BolhaNavbar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <radialGradient id="gradAzul" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7DD3FC" stopOpacity={1} />
          <stop offset="70%" stopColor="#7DD3FC" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#7DD3FC" stopOpacity={0} />
        </radialGradient>

        <radialGradient id="gradRosa" cx="65%" cy="35%" r="45%">
          <stop offset="0%" stopColor="#f874fd" stopOpacity={0.9} />
          <stop offset="60%" stopColor="#f874fd" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#f874fd" stopOpacity={0} />
        </radialGradient>

        <radialGradient id="gradAmarelo" cx="35%" cy="65%" r="45%">
          <stop offset="0%" stopColor="#e8fb3c" stopOpacity={0.77} />
          <stop offset="60%" stopColor="#e8fb3c" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#e8fb3c" stopOpacity={0} />
        </radialGradient>
      </defs>

      <circle cx={100} cy={100} r={90} fill="url(#gradAzul)" />
      <circle cx={100} cy={100} r={90} fill="url(#gradRosa)" />
      <circle cx={100} cy={100} r={90} fill="url(#gradAmarelo)" />
    </svg>
  );
}