import { Link, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useFavorites } from "@/hooks/useFavorites";
import { useAllProducts } from "@/hooks/useAllProducts";
import { clearFavorites } from "@/features/favorites/favoritesSlice";
import { resetLocalChanges } from "@/features/products/productsSlice";
import { selectLocalChangesCount } from "@/features/products/productsSelectors";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Profile = () => {
  const { user, logout, loading, isConfigured } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favorites = useFavorites();
  const catalog = useAllProducts();
  const localChanges = useAppSelector(selectLocalChangesCount);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto my-8 px-4">
      <div className="bg-white border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              User Profile
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Authenticated user details and session management
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="self-start sm:self-auto border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing Out..." : "Sign Out"}
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-100 bg-gray-50 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Email Address
              </span>
              <span className="text-sm font-medium text-gray-900 break-all select-all">
                {user.email || "—"}
              </span>
            </div>

            <div className="border border-gray-100 bg-gray-50 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Display Name
              </span>
              <span className="text-sm font-medium text-gray-900">
                {user.displayName || "Not specified"}
              </span>
            </div>
          </div>

          <div className="border border-gray-100 bg-gray-50 p-4">
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              User Unique Identifier (UID)
            </span>
            <span className="font-mono text-xs text-gray-800 break-all select-all bg-white px-2 py-1 border border-gray-200 inline-block w-full">
              {user.uid}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-100 bg-gray-50 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Account Created
              </span>
              <span className="text-sm text-gray-700">
                {user.createdAt ? new Date(user.createdAt).toLocaleString() : "Active session"}
              </span>
            </div>

            <div className="border border-gray-100 bg-gray-50 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Last Sign-In
              </span>
              <span className="text-sm text-gray-700">
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "Just now"}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500">
            <span>
              Authentication Provider:{" "}
              <strong className="text-gray-700 font-medium">
                {isConfigured ? "Firebase Authentication" : "Local Protected Auth Provider"}
              </strong>
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Active Session
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 mt-6">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              My Favorites ({favorites.ids.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Stored per account in Redux and persisted locally.
            </p>
          </div>
          {favorites.ids.length > 0 && (
            <button
              type="button"
              onClick={() => dispatch(clearFavorites(user.uid))}
              className="text-xs text-red-600 hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="p-6">
          {favorites.ids.length === 0 ? (
            <p className="text-sm text-gray-500">
              No favorites yet. Use the ♡ button on any product in the{" "}
              <Link to="/products" className="text-blue-600 hover:underline">
                catalog
              </Link>
              .
            </p>
          ) : catalog.loading && favorites.products.length === 0 ? (
            <LoadingSpinner message="Loading favorites..." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {favorites.products.map((p) => (
                <li key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                  <Link to={`/products/${p.id}`} className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-10 h-10 object-contain bg-gray-50 border border-gray-200 shrink-0"
                    />
                    <span className="font-medium text-gray-900 truncate hover:text-blue-600">
                      {p.title}
                    </span>
                  </Link>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold">${p.price.toFixed(2)}</span>
                    <FavoriteButton productId={p.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {localChanges > 0 && (
        <div className="mt-6 p-4 bg-white border border-gray-200 flex items-center justify-between gap-3 text-xs text-gray-600">
          <span>
            {localChanges} local catalog change(s) (create / update / delete) are stored in
            Redux and re-applied to API data.
          </span>
          <button
            type="button"
            onClick={() => dispatch(resetLocalChanges())}
            className="border border-gray-300 px-3 py-1.5 hover:bg-gray-50 cursor-pointer shrink-0"
          >
            Reset catalog
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;

