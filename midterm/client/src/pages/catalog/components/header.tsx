import { Breadcrumbs } from "@/shared/components/breadcrumbs";

export interface CatalogHeaderProps {
  isLoading: boolean;
  totalCount: number;
  totalCatalogPositions: number;
}

export const CatalogHeader = ({
  isLoading,
  totalCount,
  totalCatalogPositions,
}: CatalogHeaderProps) => {
  return (
    <>
      {/* breadcrumbs */}
      <Breadcrumbs items={[{ label: "Каталог" }]} />

      {/* header */}
      <div className="mb-8 md:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#e3e1dc]">
              Каталог
            </h1>
          </div>
          <div className="text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-2">
            {isLoading && (
              <span className="w-2 h-2 rounded-full bg-[#bfb3a0] animate-pulse" />
            )}
            <span>
              Показано{" "}
              <span className="text-[#bfb3a0] font-semibold">{totalCount}</span>{" "}
              из {totalCatalogPositions} позиций
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogHeader;
