import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 12H5" />
      <path d="M14 12h5" />
      <path d="M19 12v2a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-2" />
      <path d="m9 12-1.5-1.5" />
      <path d="m15 12 1.5-1.5" />
      <path d="M12 7.5V12" />
      <path d="M9 6a3 3 0 0 1 6 0" />
      <path d="M12 3v3" />
    </svg>
  ),
};
