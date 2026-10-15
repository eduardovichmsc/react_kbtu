import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const CatalogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-16 flex flex-col sm:flex-row items-center justify-end gap-6 border-t border-white/10 pt-8">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex justify-center items-center border border-white/10 text-neutral-300 hover:text-white hover:border-[#bfb3a0] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-9 h-9 text-xs transition-all border cursor-pointer ${
                  isActive
                    ? "bg-[#bfb3a0] text-black border-[#bfb3a0] font-bold"
                    : "bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex justify-center items-center border border-white/10 text-neutral-300 hover:text-white hover:border-[#bfb3a0] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Следующая страница"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CatalogPagination;
