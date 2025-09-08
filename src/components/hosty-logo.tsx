import * as React from 'react';

const HostyLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="100" height="32" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <text
      x="0"
      y="24"
      fontFamily="'Space Grotesk', sans-serif"
      fontSize="28"
      fontWeight="bold"
      fill="hsl(var(--primary))"
    >
      Hosty
    </text>
  </svg>
);

export default HostyLogo;
