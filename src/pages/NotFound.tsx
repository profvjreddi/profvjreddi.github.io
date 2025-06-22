import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 * Default 404 page, displayed when a user attempts to access a non-existent route.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 not found: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-gray-600">Page not found</p>
      <button
        onClick={() => (window.location.href = "/")}
        className="px-4 py-2 mt-8 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        Return home
      </button>
    </div>
  );
};

export default NotFound;
