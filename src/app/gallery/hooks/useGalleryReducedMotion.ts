"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

const subscribe = () => () => {};

/**
 * Framer Motion resolves the user's motion preference on the client only. Gate
 * it behind a hydration-safe "mounted" signal so the server HTML and the first
 * client render match, then switch to the real preference after hydration.
 */
export function useGalleryReducedMotion() {
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  return mounted && Boolean(reduceMotion);
}
