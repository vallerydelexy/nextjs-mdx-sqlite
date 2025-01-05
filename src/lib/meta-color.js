'use client'
import { useMemo, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";

import { META_THEME_COLORS } from "@/config/site";

export function useMetaColor() {
  const { resolvedTheme } = useTheme();

  const metaColor = useMemo(() => {
    return resolvedTheme !== "dark"
      ? META_THEME_COLORS.light
      : META_THEME_COLORS.dark;
  }, [resolvedTheme]);

  const setMetaColor = useCallback((color) => {
    if (typeof document !== 'undefined') {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", color);
    }
  }, []);

  // Apply the meta color whenever it changes
  useEffect(() => {
    setMetaColor(metaColor);
  }, [metaColor, setMetaColor]);

  return {
    metaColor,
    setMetaColor,
  };
}