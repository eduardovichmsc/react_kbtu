import type { To } from "react-router";
import type { useLenis } from "lenis/react";

export const scrollToTarget = (
  target: number | string | HTMLElement,
  options?: {
    lenis?: ReturnType<typeof useLenis>;
    duration?: number;
    offset?: number;
    immediate?: boolean;
    easing?: (t: number) => number;
    onComplete?: () => void;
  },
) => {
  const {
    lenis,
    duration = 1.5,
    offset = 0,
    immediate = false,
    easing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    onComplete,
  } = options || {};

  // если доступен Lenis
  if (lenis) {
    lenis.scrollTo(target, {
      duration: immediate ? 0 : duration,
      offset,
      immediate,
      easing,
      onComplete,
    });
    return;
  }

  // native fallback
  if (typeof target === "number") {
    window.scrollTo({
      top: Math.max(0, target + offset),
      behavior: immediate ? "auto" : "smooth",
    });
    if (onComplete) {
      setTimeout(onComplete, immediate ? 0 : duration * 1000);
    }
  } else {
    const el =
      typeof target === "string"
        ? document.querySelector(target.startsWith("#") ? target : `#${target}`)
        : target;

    if (el) {
      if (immediate) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (onComplete) {
        setTimeout(onComplete, immediate ? 0 : duration * 1000);
      }
    }
  }
};

// путь, хеш и параметры
export const parseDestination = (
  destination: To | undefined,
  currentPathname: string,
) => {
  if (!destination) {
    return {
      isExternal: false,
      targetPath: currentPathname,
      targetHash: "",
      targetSearch: "",
      fullPath: "",
    };
  }

  // если передан { pathname, hash, search }
  if (typeof destination === "object") {
    const pathname = destination.pathname || currentPathname;
    const hash = (destination.hash || "").replace(/^#/, "");
    const search = destination.search || "";
    return {
      isExternal: false,
      targetPath: pathname,
      targetHash: hash,
      targetSearch: search,
      fullPath: `${pathname}${search}${hash ? `#${hash}` : ""}`,
    };
  }

  const destStr = String(destination);

  // внешние ссылки
  const isExternal =
    /^(https?:)?\/\//.test(destStr) ||
    destStr.startsWith("mailto:") ||
    destStr.startsWith("tel:");

  if (isExternal) {
    return {
      isExternal: true,
      targetPath: "",
      targetHash: "",
      targetSearch: "",
      fullPath: destStr,
    };
  }

  // локальный, например, "#shop"
  if (destStr.startsWith("#")) {
    return {
      isExternal: false,
      targetPath: currentPathname,
      targetHash: destStr.slice(1),
      targetSearch: "",
      fullPath: `${currentPathname}${destStr}`,
    };
  }

  // полный путь с хэшем и поиском
  // /catalog?page=1#filters"
  // "/#shop"
  const [pathAndQuery, hash = ""] = destStr.split("#");
  const [pathname, search = ""] = pathAndQuery.split("?");

  return {
    isExternal: false,
    targetPath: pathname || "/",
    targetHash: hash,
    targetSearch: search ? `?${search}` : "",
    fullPath: destStr,
  };
};
