// src/components/loading-animation.tsx
"use client";

import Lottie from "lottie-react";
import defaultAnimation from "../../public/loading.json";
import geminiAnimation from "../../public/gemini_loading.json";

interface LoadingAnimationProps {
  className?: string;
  animationType?: 'default' | 'gemini';
}

export function LoadingAnimation({ className, animationType = 'default' }: LoadingAnimationProps) {
  const animationData = animationType === 'gemini' ? geminiAnimation : defaultAnimation;
  return (
    <div className={className}>
      <Lottie animationData={animationData} loop={true} style={{ height: 150, width: 150 }}/>
    </div>
  );
}
