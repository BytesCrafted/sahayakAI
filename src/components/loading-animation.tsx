// src/components/loading-animation.tsx
"use client";

import Lottie from "lottie-react";
import animationData from "../../public/loading.json";

interface LoadingAnimationProps {
  className?: string;
}

export function LoadingAnimation({ className }: LoadingAnimationProps) {
  return (
    <div className={className}>
      <Lottie animationData={animationData} loop={true} style={{ height: 150, width: 150 }}/>
    </div>
  );
}
