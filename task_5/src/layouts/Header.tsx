import { NavLink } from "react-router";

export const Header = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-blue-600 font-semibold text-sm px-3 py-2"
      : "text-gray-600 hover:text-gray-900 text-sm px-3 py-2 hover:bg-gray-100 transition-colors";

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

        <div className="flex items-center gap-3">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "bg-gray-900 text-white text-sm font-medium px-4 py-2"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium px-4 py-2 transition-colors"
            }
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export const NavBar = Header;
