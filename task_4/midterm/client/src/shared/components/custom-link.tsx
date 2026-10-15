import React from "react";
import { Link, useLocation } from "react-router";
import { useLenis } from "lenis/react";
import { scrollToTarget } from "@/shared/lib/scroll";
import { useScrollManager } from "@/shared/hooks/use-scroll-manager";

export interface CustomLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
}

export const ScrollManager = () => {
  useScrollManager();
  return null;
};

export const CustomLink = ({
  to,
  href,
  onClick,
  children,
  className,
  ...rest
}: CustomLinkProps) => {
  const location = useLocation();
  const lenis = useLenis();

  const target = to || href || "";
  const isExternal =
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("tel:");

  if (isExternal) {
    return (
      <a href={target} onClick={onClick} className={className} {...rest}>
        {children}
      </a>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    const [path, hash] = target.split("#");
    const isCurrentPage = !path || path === "/" || path === location.pathname;

    if (hash && isCurrentPage) {
      const element = document.getElementById(hash);
      if (element) {
        e.preventDefault();
        scrollToTarget(element, { lenis, duration: 1.5, offset: -10 });
        window.history.pushState(null, "", `#${hash}`);
      }
    }
  };

  return (
    <Link to={target} onClick={handleClick} className={className} {...rest}>
      {children}
    </Link>
  );
};

export default CustomLink;
