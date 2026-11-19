import { useState, type FormEvent } from "react";
import type { CategoryItem } from "@/types/product";
import type { CreateProductInput } from "@/services/productsApi";

interface Props {
  categories: CategoryItem[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (input: CreateProductInput) => Promise<void>;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 text-sm focus:outline-hidden focus:border-blue-600";
const labelClass = "block font-semibold uppercase text-gray-700 mb-1";

export const CreateProductModal = ({ categories, saving, onClose, onSubmit }: Props) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(categories[0]?.slug ?? "groceries");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        price: parseFloat(price) || 0,
        category,
        stock: parseInt(stock, 10) || 0,
        description: description.trim() || "Item added to catalog.",
      });
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to create product.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-gray-200 max-w-md w-full p-6 shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">Add New Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ergonomic Office Chair"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99.99"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="25"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`${inputClass} capitalize`}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
              {categories.length === 0 && <option value="groceries">Groceries</option>}
            </select>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief product description..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
