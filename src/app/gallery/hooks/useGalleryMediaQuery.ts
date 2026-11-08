"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe matchMedia subscription. The server snapshot is always false,
 * so the first client render matches the server before switching to the real
 * preference after mount.
 */
export function useGalleryMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined") return () => {};

      const media = window.matchMedia(query);
      media.addEventListener?.("change", onChange);

      return () => media.removeEventListener?.("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
