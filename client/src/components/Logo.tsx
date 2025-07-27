import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="text-3xl font-bold">
        <span className="text-gray-800">Pharma</span>
        <span className="text-pharma-blue">Connect</span>
        <div className="relative ml-1 inline-block">
          <div className="w-8 h-8 rounded-full border-2 border-pharma-blue relative bg-white">
            <div className="absolute -top-1 -right-1 transform rotate-45 w-5 h-5 flex items-center justify-center bg-pharma-blue text-white rounded-full">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
