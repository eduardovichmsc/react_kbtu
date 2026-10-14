import { Link } from "react-router";
import { ArrowLeft, PackageOpen, AlertTriangle } from "lucide-react";
import { PATHS } from "@/shared/config/paths";

export const ProductSkeleton = () => (
  <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-28 md:pt-36 pb-32 px-4 md:px-12">
    <div className="max-w-[1600px] mx-auto animate-pulse">
      <div className="h-6 bg-white/10 w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-7 aspect-[4/5] bg-white/5" />
        <div className="lg:col-span-5 space-y-6">
          <div className="h-8 bg-white/10 w-3/4" />
          <div className="h-12 bg-white/10 w-1/2" />
          <div className="h-32 bg-white/5" />
        </div>
      </div>
    </div>
  </div>
);

export const ProductErrorState = () => (
  <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-40 pb-32 px-4 md:px-12 flex flex-col items-center justify-center text-center">
    <AlertTriangle className="w-14 h-14 stroke-[1.5] text-[#bfb3a0] mb-6" />
    <h1 className="text-3xl md:text-4xl font-serif mb-3">Ошибка загрузки</h1>
    <p className="text-sm text-neutral-400 max-w-md mb-8">
      Не удалось загрузить информацию о товаре с сервера.
    </p>
    <Link
      to={PATHS.catalog}
      className="inline-flex items-center gap-3 px-8 py-4 bg-[#bfb3a0] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Вернуться в каталог
    </Link>
  </div>
);

export const ProductNotFoundState = ({
  title = "Предмет не найден",
  message = "Возможно, этот предмет был снят с производства или ссылка устарела.",
}: {
  title?: string;
  message?: string;
}) => (
  <div className="min-h-screen bg-[#0e0d0c] text-[#e3e1dc] pt-40 pb-32 px-4 md:px-12 flex flex-col items-center justify-center text-center">
    <PackageOpen className="w-16 h-16 stroke-[1] text-neutral-600 mb-6" />
    <h1 className="text-4xl md:text-5xl font-serif mb-4">{title}</h1>
    <p className="text-sm text-neutral-400 max-w-md mb-8">{message}</p>
    <Link
      to={PATHS.catalog}
      className="inline-flex items-center gap-3 px-8 py-4 bg-[#bfb3a0] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Вернуться в каталог
    </Link>
  </div>
);
