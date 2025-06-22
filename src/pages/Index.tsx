/**
 * Default index page used for new projects. Replace this with the user's actual index page.
 */
function Index() {
  return (
    // Skeleton, replace with actual page
    <div className="flex flex-col items-center justify-center h-screen space-y-2">
      <div className="w-full max-w-4xl mx-auto px-8 py-8 animate-pulse">
        <div className="flex justify-center mb-8">
          <span className="text-sm text-gray-400 font-medium px-6 py-2 bg-gray-100 rounded-full">
            Your project will appear here
          </span>
        </div>

        {/* Title skeleton */}
        <div className="mb-8">
          <div className="h-7 bg-gray-200 rounded-md w-1/3 mb-4"></div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
        </div>
      </div>
    </div>
  );
}

export default Index;
