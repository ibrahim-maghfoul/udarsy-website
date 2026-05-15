"use client";

import { useState, useEffect } from "react";

/**
 * Returns true when the device is likely low-end based on CPU core count
 * and reported device memory (Chrome/Android only for deviceMemory).
 * Falls back to false on unsupported browsers — safe to use everywhere.
 */
export function useIsLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    setIsLowEnd(cores <= 4 || memory <= 2);
  }, []);

  return isLowEnd;
}
