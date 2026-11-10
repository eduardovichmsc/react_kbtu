import { Link } from "react-router";

export const HomeHero = () => (
  <section className="bg-white border border-gray-200 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        Browse our collection of items
      </h1>
      <p className="text-gray-600 text-base leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          to="/products"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 transition-colors"
        >
          Browse Products
        </Link>
        <Link
          to="/dashboard"
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm px-5 py-2.5 transition-colors"
        >
          View Dashboard
        </Link>
        <Link
          to="/about"
          className="text-gray-600 hover:text-gray-900 font-medium text-sm px-3 py-2 transition-colors"
        >
          About
        </Link>
      </div>
    </div>
  </section>
);
