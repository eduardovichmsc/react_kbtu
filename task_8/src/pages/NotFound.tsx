import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="max-w-md mx-auto my-16 text-center space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="text-sm text-gray-600 mt-2">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
      </div>

      <div className="flex justify-center gap-3">
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 transition-colors shadow-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
