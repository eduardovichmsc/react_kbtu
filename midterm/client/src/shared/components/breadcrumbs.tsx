import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PATHS } from "@/shared/config/paths";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showBack?: boolean;
  className?: string;
}

export const Breadcrumbs = ({
  items = [],
  showBack = false,
  className = "",
}: BreadcrumbsProps) => {
  const navigate = useNavigate();

  // Базовый путь: Главная всегда первая
  const allItems: BreadcrumbItem[] = [
    { label: "Главная", href: PATHS.home },
    ...items,
  ];

  return (
    <div
      className={`flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10 ${className}`}
    >
      <nav
        aria-label="Навигация по разделам"
        className="flex items-center gap-2.5 text-xs uppercase tracking-widest text-neutral-400 flex-wrap"
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <div key={`${item.label}-${index}`} className="flex items-center gap-2.5">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isLast
                      ? "text-[#bfb3a0] truncate max-w-[240px] md:max-w-none"
                      : "text-neutral-400"
                  }
                >
                  {item.label}
                </span>
              )}

              {!isLast && <span className="text-neutral-600">/</span>}
            </div>
          );
        })}
      </nav>

      {showBack && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Назад
        </button>
      )}
    </div>
  );
};

export default Breadcrumbs;
