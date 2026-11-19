import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/utils/cn";

export const FavoriteButton = ({
  productId,
  withLabel = false,
}: {
  productId: number;
  withLabel?: boolean;
}) => {
  const { enabled, isFavorite, toggle } = useFavorites();
  if (!enabled) return null;
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={active}
      title={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "border text-xs px-2 py-1 cursor-pointer transition-colors bg-white",
        active
          ? "border-rose-300 text-rose-600 bg-rose-50"
          : "border-gray-300 text-gray-500 hover:text-rose-600"
      )}
    >
      {active ? "♥" : "♡"}
      {withLabel && <span className="ml-1">{active ? "Favorited" : "Favorite"}</span>}
    </button>
  );
};
