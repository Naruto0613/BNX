import React from "react";

interface BnxLogoProps {
  className?: string;
  height?: number | string;
}

export default function BnxLogo({ className = "h-8", height }: BnxLogoProps) {
  // We represent the high-fidelity BNX logo matching the uploaded image.
  // The first letter "B" is open on the left, with slanted tips.
  // The second letter "N" has vertical stems and a slanted bottom on the right stem.
  // The third letter "X" has blue legs on the left and white legs on the right, with a beautiful clean gap at the crossing.
  return (
    <svg
      viewBox="0 0 330 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={height ? { height } : undefined}
    >
      {/* 1. Letter "B" (White) */}
      <path
        d="M 15 20 
           L 70 20 
           C 92 20, 106 32, 106 48 
           C 106 60, 96 68, 84 70 
           C 96 72, 106 80, 106 92 
           C 106 108, 92 120, 70 120 
           L 15 120 
           L 31 104 
           L 68 104 
           C 78 104, 86 98, 86 92 
           C 86 86, 78 80, 68 80 
           L 35 80 
           L 19 64 
           L 68 64 
           C 78 64, 86 58, 86 52 
           C 86 46, 78 40, 68 40 
           L 31 40 
           Z"
        fill="white"
      />

      {/* 2. Letter "N" (White) */}
      {/* Left stem */}
      <rect x="125" y="20" width="16" height="100" fill="white" />
      {/* Diagonal bar */}
      <path
        d="M 125 20 
           L 141 20 
           L 191 104 
           L 175 104 
           Z"
        fill="white"
      />
      {/* Right stem with slanted bottom */}
      <path
        d="M 175 20 
           L 191 20 
           L 191 120 
           L 175 104 
           Z"
        fill="white"
      />

      {/* 3. Letter "X" */}
      {/* Continuous Diagonal: Bottom-Left to Top-Right */}
      {/* Blue portion (lower-left half) */}
      <path
        d="M 215 120 
           L 255 70 
           L 275 70 
           L 235 120 
           Z"
        fill="#0088ff"
      />
      {/* White portion (upper-right half) */}
      <path
        d="M 255 70 
           L 295 20 
           L 315 20 
           L 275 70 
           Z"
        fill="white"
      />

      {/* Broken Diagonal: Top-Left to Bottom-Right */}
      {/* Blue portion (upper-left) */}
      <path
        d="M 215 20 
           L 235 20 
           L 267 60 
           L 247 60 
           Z"
        fill="#0088ff"
      />
      {/* White portion (lower-right) */}
      <path
        d="M 263 80 
           L 283 80 
           L 315 120 
           L 295 120 
           Z"
        fill="white"
      />
    </svg>
  );
}
