import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useLenis } from "lenis/react";
import { scrollToTarget } from "@/shared/lib/scroll";

export const useScrollManager = () => {
  const location = useLocation();
  const lenis = useLenis();
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    const isNewPage = prevPathname.current !== location.pathname;
    prevPathname.current = location.pathname;

    const hash = location.hash.slice(1);

    if (hash) {
      if (isNewPage) {
        scrollToTarget(0, { lenis, immediate: true });
      }

      let attempts = 0;
      const maxAttempts = 35;
      let timeoutId: number;

      const tryScrollToElement = () => {
        const element = document.getElementById(hash);
        if (element) {
          scrollToTarget(element, {
            lenis,
            duration: 1.5,
            offset: -10,
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          timeoutId = window.setTimeout(tryScrollToElement, 50);
        }
      };

      timeoutId = window.setTimeout(tryScrollToElement, isNewPage ? 100 : 20);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      if (isNewPage) {
        scrollToTarget(0, { lenis, immediate: true });
      }
    }
  }, [location.pathname, location.hash, lenis]);
};
