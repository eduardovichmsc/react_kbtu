import { useState, useId } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { api } from "@/shared/api";
import type { Product, CreateProductPayload, FormValues } from "@/shared/types";

const INITIAL_VALUES: FormValues = {
  name: "",
  category: "Ceramics",
  priceValue: "25000",
  specs: "",
  img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
  description: "",
  materials: "",
  dimensions: "",
  origin: "Казахстан",
  inStock: true,
};

export interface AddProductFormProps {
  onSuccess: (product: Product) => void;
  onError: (error: string | null) => void;
}

export const AddProductForm = ({ onSuccess, onError }: AddProductFormProps) => {
  const formId = useId();
  const [form, setForm] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setForm((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));

    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    onError(null);
  };

  const handleReset = () => {
    setForm(INITIAL_VALUES);
    setErrors({});
    onError(null);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormValues, string>> = {};

    if (!form.name.trim()) newErrors.name = "Укажите название предмета";
    if (!form.category.trim()) newErrors.category = "Укажите категорию";
    if (!form.priceValue || Number(form.priceValue) <= 0) {
      newErrors.priceValue = "Укажите стоимость больше 0 ₸";
    }
    if (!form.specs.trim()) newErrors.specs = "Укажите краткую характеристику";
    if (!form.img.trim()) newErrors.img = "Укажите ссылку на изображение";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    onError(null);

    const priceNum = Number(form.priceValue);
    const payload: CreateProductPayload = {
      name: form.name.trim(),
      price: `${priceNum.toLocaleString("ru-RU")} ₸`,
      priceValue: priceNum,
      category: form.category,
      specs: form.specs.trim(),
      img: form.img.trim(),
      gallery: [form.img.trim()],
      description: form.description.trim() || undefined,
      materials: form.materials.trim() || undefined,
      dimensions: form.dimensions.trim() || undefined,
      origin: form.origin.trim() || undefined,
      inStock: form.inStock,
      featured: false,
    };

    try {
      const created = await api.createProduct(payload);
      onSuccess(created);
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : "Не удалось сохранить товар на сервере",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-6 bg-[#121110] p-6 md:p-10 border border-white/10"
    >
      <div className="border-b border-white/10 pb-4 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-[#bfb3a0]">
          Параметры объекта
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="text-[11px] uppercase tracking-wider text-neutral-500 hover:text-neutral-300 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Сбросить
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${formId}-name`}
          className="text-xs uppercase tracking-widest text-neutral-400"
        >
          Название предмета
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="напр., Скульптурная ваза Horizon"
          className={`w-full bg-[#1a1918] border px-4 py-3 text-sm text-[#e3e1dc] focus:outline-none transition-colors ${
            errors.name
              ? "border-rose-500/70 focus:border-rose-500"
              : "border-white/10 focus:border-[#bfb3a0]"
          }`}
        />
        {errors.name && (
          <span className="text-xs text-rose-400">{errors.name}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-category`}
            className="text-xs uppercase tracking-widest text-neutral-400"
          >
            Категория
          </label>
          <input
            id={`${formId}-category`}
            name="category"
            type="text"
            value={form.category}
            onChange={handleChange}
            placeholder="напр., Ceramics, Lighting или Декор"
            className={`w-full bg-[#1a1918] border px-4 py-3 text-sm text-[#e3e1dc] focus:outline-none transition-colors ${
              errors.category
                ? "border-rose-500/70 focus:border-rose-500"
                : "border-white/10 focus:border-[#bfb3a0]"
            }`}
          />
          {errors.category && (
            <span className="text-xs text-rose-400">{errors.category}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-priceValue`}
            className="text-xs uppercase tracking-widest text-neutral-400"
          >
            Стоимость (₸)
          </label>
          <input
            id={`${formId}-priceValue`}
            name="priceValue"
            type="number"
            min="0"
            step="500"
            value={form.priceValue}
            onChange={handleChange}
            placeholder="напр., 38500"
            className={`w-full bg-[#1a1918] border px-4 py-3 text-sm text-[#e3e1dc] focus:outline-none transition-colors ${
              errors.priceValue
                ? "border-rose-500/70 focus:border-rose-500"
                : "border-white/10 focus:border-[#bfb3a0]"
            }`}
          />
          {errors.priceValue && (
            <span className="text-xs text-rose-400">{errors.priceValue}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${formId}-specs`}
          className="text-xs uppercase tracking-widest text-neutral-400"
        >
          Спецификация
        </label>
        <input
          id={`${formId}-specs`}
          name="specs"
          type="text"
          value={form.specs}
          onChange={handleChange}
          placeholder="напр., Шамот / Ручная лепка / 28 см"
          className={`w-full bg-[#1a1918] border px-4 py-3 text-sm text-[#e3e1dc] focus:outline-none transition-colors ${
            errors.specs
              ? "border-rose-500/70 focus:border-rose-500"
              : "border-white/10 focus:border-[#bfb3a0]"
          }`}
        />
        {errors.specs && (
          <span className="text-xs text-rose-400">{errors.specs}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${formId}-img`}
          className="text-xs uppercase tracking-widest text-neutral-400"
        >
          Ссылка на фото
        </label>
        <input
          id={`${formId}-img`}
          name="img"
          type="url"
          value={form.img}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/..."
          className={`w-full bg-[#1a1918] border px-4 py-3 text-sm text-[#e3e1dc] focus:outline-none transition-colors ${
            errors.img
              ? "border-rose-500/70 focus:border-rose-500"
              : "border-white/10 focus:border-[#bfb3a0]"
          }`}
        />
        {errors.img && (
          <span className="text-xs text-rose-400">{errors.img}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${formId}-description`}
          className="text-xs uppercase tracking-widest text-neutral-400"
        >
          Описание
        </label>
        <textarea
          id={`${formId}-description`}
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Тактильные свойства, назначение и концепция..."
          className="w-full bg-[#1a1918] border border-white/10 px-4 py-3 text-sm text-[#e3e1dc] focus:outline-none focus:border-[#bfb3a0] transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-materials`}
            className="text-[11px] uppercase tracking-wider text-neutral-400"
          >
            Материалы
          </label>
          <input
            id={`${formId}-materials`}
            name="materials"
            type="text"
            value={form.materials}
            onChange={handleChange}
            placeholder="Массив дуба"
            className="w-full bg-[#1a1918] border border-white/10 px-3 py-2 text-xs text-[#e3e1dc] focus:outline-none focus:border-[#bfb3a0]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-dimensions`}
            className="text-[11px] uppercase tracking-wider text-neutral-400"
          >
            Размеры
          </label>
          <input
            id={`${formId}-dimensions`}
            name="dimensions"
            type="text"
            value={form.dimensions}
            onChange={handleChange}
            placeholder="H: 30 cm, D: 14 cm"
            className="w-full bg-[#1a1918] border border-white/10 px-3 py-2 text-xs text-[#e3e1dc] focus:outline-none focus:border-[#bfb3a0]"
          />
        </div>
        {/* 
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${formId}-origin`}
            className="text-[11px] uppercase tracking-wider text-neutral-400"
          >
            Происхождение
          </label>
          <input
            id={`${formId}-origin`}
            name="origin"
            type="text"
            value={form.origin}
            onChange={handleChange}
            placeholder="Казахстан / Дания"
            className="w-full bg-[#1a1918] border border-white/10 px-3 py-2 text-xs text-[#e3e1dc] focus:outline-none focus:border-[#bfb3a0]"
          />
        </div> */}
      </div>

      <div className="pt-4 border-t border-white/10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#bfb3a0] hover:bg-white text-black text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>Опубликовать предмет</>
          )}
        </button>
      </div>
    </form>
  );
};
