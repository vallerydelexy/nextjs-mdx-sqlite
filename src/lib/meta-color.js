'use client'
import { useMemo, useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { META_THEME_COLORS } from "@/config/site";

export function useMetaColor() {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // Initialize mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const metaColor = useMemo(() => {
    return resolvedTheme !== "dark"
      ? META_THEME_COLORS.light
      : META_THEME_COLORS.dark;
  }, [resolvedTheme]);

  const setMetaColor = useCallback((color) => {
    if (!isMounted || typeof document === 'undefined') return;
    
    // Safely handle meta tag updates
    try {
      const metaThemeTag = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeTag) {
        const newMetaTag = document.createElement('meta');
        newMetaTag.name = 'theme-color';
        newMetaTag.content = color;
        document.head.appendChild(newMetaTag);
      } else {
        metaThemeTag.setAttribute('content', color);
      }
    } catch (e) {
      // Silently fail on server
      console.debug('Meta color update skipped (not client side)');
    }
  }, [isMounted]);

  // Only run effect on client side
  useEffect(() => {
    if (isMounted) {
      setMetaColor(metaColor);
    }
  }, [isMounted, metaColor, setMetaColor]);

  return {
    metaColor,
    setMetaColor: isMounted ? setMetaColor : () => {},
  };
}