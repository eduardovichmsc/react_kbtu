import type { FormEvent } from "react";

export interface ProductsSearchProps {
  handleSearchSubmit: (e: FormEvent) => void;
  searchInput: string;
  search: string;
  setSearchInput: (value: string) => void;
  updateParams: (newEntries: Record<string, string | null>) => void;
}

export const ProductsSearch = ({
  handleSearchSubmit,
  searchInput,
  search,
  setSearchInput,
  updateParams,
}: ProductsSearchProps) => {
  return (
    <form onSubmit={handleSearchSubmit} className="flex gap-2">
      <input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        type="text"
        placeholder="Search products by title, brand, or keyword..."
        className="flex-1 px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 transition-colors cursor-pointer"
      >
        Search
      </button>
      {(searchInput || search) && (
        <button
          type="button"
          onClick={() => {
            setSearchInput("");
            updateParams({ q: null });
          }}
          className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-2 text-sm cursor-pointer"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  );
};
