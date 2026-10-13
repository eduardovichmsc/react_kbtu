import React, { forwardRef, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, type To } from "react-router";
import { useLenis } from "lenis/react";

/**
 * Universal CustomLink Props
 */
export interface CustomLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Целевой путь: строка ("/catalog", "/#shop", "#shop") или объект React Router { pathname, hash, search } */
  to?: To;
  /** Альтернатива 'to' для совместимости со стандартными HTML-ссылками */
  href?: string;
  /** Включить плавный скролл (по умолчанию true) */
  smooth?: boolean;
  /** Длительность скролла в секундах (по умолчанию 1.5) */
  duration?: number;
  /** Вертикальный отступ в пикселях (полезно при fixed/sticky header) */
  offset?: number;
  /** Включить автоматический скролл (по умолчанию true) */
  scroll?: boolean;
  /** Заменить текущую запись в истории браузера */
  replace?: boolean;
  /** Пользовательское состояние для передачи в React Router navigate */
  state?: unknown;
  /** CSS-класс для активного состояния ссылки (опционально) */
  activeClassName?: string;
  /** Колбэк завершения скролла */
  onScrollComplete?: () => void;
  /** Дочерние элементы */
  children?: React.ReactNode;
}

/**
 * Универсальная функция плавного скролла:
 * - Использует Lenis, если он активен в приложении.
 * - Имеет fallback на нативный DOM API (window.scrollTo / element.scrollIntoView).
 */
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

  // 1. Lenis (если доступен)
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

  // 2. Нативный fallback
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
        ? document.querySelector(
            target.startsWith("#") ? target : `#${target}`,
          )
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

/**
 * Парсер пути, хэша и параметров (поддерживает как строку, так и объект To)
 */
export const parseDestination = (destination: To | undefined, currentPathname: string) => {
  if (!destination) {
    return {
      isExternal: false,
      targetPath: currentPathname,
      targetHash: "",
      targetSearch: "",
      fullPath: "",
    };
  }

  // Если передан объект { pathname, hash, search }
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

  // Внешние ссылки
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

  // Локальный якорь (например, "#shop")
  if (destStr.startsWith("#")) {
    return {
      isExternal: false,
      targetPath: currentPathname,
      targetHash: destStr.slice(1),
      targetSearch: "",
      fullPath: `${currentPathname}${destStr}`,
    };
  }

  // Полный путь с возможным хэшем и поиском (например, "/catalog?page=1#filters" или "/#shop")
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

/**
 * Хук useScrollManager:
 * Отслеживает смену страниц и якорных хэшей в приложении.
 * При переходе с другой страницы на якорь (например, /catalog -> /#shop) плавно скроллит к элементу.
 * При переходе без якоря скроллит в начало страницы.
 */
export const useScrollManager = () => {
  const location = useLocation();
  const lenis = useLenis();
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    const isNewPage = prevPathname.current !== location.pathname;
    prevPathname.current = location.pathname;

    const hash = location.hash ? location.hash.replace(/^#/, "") : "";

    if (hash) {
      // При смене страницы сначала сбрасываем скролл в 0, чтобы плавно прокручивать сверху вниз
      if (isNewPage) {
        scrollToTarget(0, { lenis, immediate: true });
      }

      let attempts = 0;
      const maxAttempts = 35; // до ~1.75 сек ожидания рендера компонента
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
      // Ссылка без якоря: скроллим наверх
      if (isNewPage) {
        scrollToTarget(0, { lenis, immediate: true });
      }
    }
  }, [location.pathname, location.hash, lenis]);
};

/**
 * Компонент ScrollManager для размещения в корневом Layout (например, MainLayout)
 */
export const ScrollManager: React.FC = () => {
  useScrollManager();
  return null;
};

/**
 * Универсальный компонент CustomLink:
 * - Работает поверх React Router (`Link`, `useNavigate`).
 * - Если ссылка содержит якорь (`/#shop`, `#shop`):
 *   - На той же странице: сразу плавно прокручивает к секции и обновляет URL.
 *   - На другой странице (например, переход с `/catalog` на `/#shop`): переходит по маршруту,
 *     дожидается монтирования блока и плавно летит к нему сверху вниз.
 * - Если ссылка без якоря (например, `/catalog`, `/`):
 *   - На той же странице: плавно прокручивает наверх к началу страницы.
 *   - На другой странице: открывает страницу с самого верха (`top: 0`).
 * - Поддерживает внешние ссылки, Ctrl/Cmd/Shift клики, `target="_blank"`, `state`, `offset`, `duration`.
 */
export const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  (
    {
      to,
      href,
      smooth = true,
      duration = 1.5,
      offset = 0,
      scroll = true,
      replace = false,
      state,
      activeClassName,
      className,
      onClick,
      onScrollComplete,
      children,
      ...rest
    },
    ref,
  ) => {
    const location = useLocation();
    const navigate = useNavigate();
    const lenis = useLenis();

    const destination = to ?? href;
    const { isExternal, targetPath, targetHash, targetSearch, fullPath } =
      parseDestination(destination, location.pathname);

    // Определение активности ссылки (если передан activeClassName)
    const isActive =
      !isExternal &&
      (location.pathname === targetPath ||
        (targetHash &&
          location.pathname === targetPath &&
          location.hash === `#${targetHash}`));

    const combinedClassName =
      typeof className === "string"
        ? `${className} ${isActive && activeClassName ? activeClassName : ""}`.trim()
        : className;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Пользовательский обработчик onClick
      if (onClick) {
        onClick(e);
      }

      // Не перехватываем системные действия (новые вкладки, спец-клавиши)
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.altKey ||
        e.ctrlKey ||
        e.shiftKey ||
        rest.target === "_blank"
      ) {
        return;
      }

      // Внешние ссылки обрабатываются браузером штатно
      if (isExternal || !fullPath) {
        return;
      }

      e.preventDefault();

      const isCurrentPath = location.pathname === targetPath;

      if (!scroll) {
        // Если автоскролл явно отключен, просто навигируем
        navigate(fullPath, { replace, state });
        return;
      }

      if (targetHash) {
        // Якорная ссылка (#shop или /#shop)
        if (isCurrentPath) {
          // Уже на целевой странице -> плавный скролл к элементу
          scrollToTarget(`#${targetHash}`, {
            lenis,
            duration,
            offset,
            immediate: !smooth,
            onComplete: onScrollComplete,
          });

          // Обновляем hash в адресной строке без полной перезагрузки
          if (location.hash !== `#${targetHash}`) {
            window.history.pushState(
              null,
              "",
              `${targetPath}${targetSearch}#${targetHash}`,
            );
          }
        } else {
          // На другой странице (например, /catalog -> /#shop)
          // Переходим по маршруту, а useScrollManager выполнит плавный скролл
          navigate(`${targetPath}${targetSearch}#${targetHash}`, {
            replace,
            state,
          });
        }
      } else {
        // Ссылка БЕЗ якоря (например, /catalog или /)
        if (isCurrentPath) {
          // Уже на этой странице -> плавно наверх (в начало страницы)
          scrollToTarget(0, {
            lenis,
            duration: Math.min(duration, 1.2),
            immediate: !smooth,
            onComplete: onScrollComplete,
          });
        } else {
          // Переход на другую страницу без якоря
          navigate(`${targetPath}${targetSearch}`, {
            replace,
            state,
          });
        }
      }
    };

    if (isExternal) {
      return (
        <a
          ref={ref}
          href={fullPath}
          onClick={onClick}
          className={combinedClassName}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        ref={ref}
        to={fullPath}
        onClick={handleClick}
        className={combinedClassName}
        {...rest}
      >
        {children}
      </Link>
    );
  },
);

CustomLink.displayName = "CustomLink";

export default CustomLink;
