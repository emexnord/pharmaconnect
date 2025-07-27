import Logo from "./Logo";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="mb-8">
        <Logo />
      </div>
      <h2 className="text-xl font-medium text-gray-800 mb-1">
        Setting up your access...
      </h2>
      <p className="text-gray-600 mb-8">This will only take a moment.</p>

      <div className="relative">
        <div className="h-2 w-64 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-pharma-green animate-pulse rounded-full"
            style={{ width: "75%" }}
          ></div>
        </div>
      </div>

      <div className="mt-8">
        <div className="w-10 h-10 border-4 border-pharma-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
