import type { FormEvent } from "react";

export interface ProductsSearchProps {
  handleSearchSubmit: (e: FormEvent) => void;
  searchInput: string;
  search: string;
  setSearchInput: (value: string) => void;
  onClear: () => void;
  pending: boolean;
}

export const ProductsSearch = ({
  handleSearchSubmit,
  searchInput,
  search,
  setSearchInput,
  onClear,
  pending,
}: ProductsSearchProps) => {
  return (
    <form onSubmit={handleSearchSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="search"
          aria-label="Search products"
          placeholder="Search products by title, brand, or keyword..."
          className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
        />
        {pending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            typing…
          </span>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 transition-colors cursor-pointer"
      >
        Search
      </button>
      {(searchInput || search) && (
        <button
          type="button"
          onClick={onClear}
          className="border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-2 text-sm cursor-pointer"
          title="Clear search"
        >
          ✕
        </button>
      )}
    </form>
  );
};
