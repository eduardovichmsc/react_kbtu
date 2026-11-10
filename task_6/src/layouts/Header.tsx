import { NavLink, useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-600 font-semibold text-sm px-3 py-2"
      : "text-gray-600 hover:text-gray-900 text-sm px-3 py-2 hover:bg-gray-100 transition-colors";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5"
                    : "flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 transition-colors"
                }
                title={user.email || user.uid}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="max-w-[120px] sm:max-w-[180px] truncate">
                  {user.displayName || user.email || "Profile"}
                </span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium px-3 py-1.5 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "bg-gray-900 text-white text-sm font-medium px-3 sm:px-4 py-2"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-3 sm:px-4 py-2 transition-colors"
                }
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive
                    ? "bg-blue-700 text-white text-sm font-medium px-3 sm:px-4 py-2"
                    : "bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 sm:px-4 py-2 transition-colors"
                }
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export const NavBar = Header;
export default Header;
