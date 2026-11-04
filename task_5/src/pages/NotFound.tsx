import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto my-16 text-center space-y-5">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 text-2xl font-bold">
        404
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="text-sm text-gray-600 mt-2">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          Back to Home
        </Link>
        <Link
          to="/products"
          className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium text-sm px-4 py-2 rounded-md transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
