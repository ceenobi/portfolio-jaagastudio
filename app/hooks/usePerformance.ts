import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Hook to detect if animations should be simplified for low-power devices.
 */
export function usePerformance() {
  const shouldReduceMotion = useReducedMotion();
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // Heuristic for low power/performance mode:
    // 1. System-level reduced motion preference
    // 2. Mobile device (based on screen width as a proxy for mobile power vs desktop)
    // 3. Low core count (if supported by browser)
    const isMobile = window.innerWidth < 768;
    const isLowCore = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const isSaveData = (navigator as any).connection?.saveData;
    
    setIsLowPower(!!shouldReduceMotion || isMobile || !!isLowCore || !!isSaveData);
  }, [shouldReduceMotion]);

  return { 
    shouldReduceMotion, 
    isLowPower,
    // Return a function to help with conditional styles
    perfStyle: (normal: any, lowPower: any = {}) => isLowPower ? lowPower : normal
  };
}
