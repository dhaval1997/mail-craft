import React from "react";
import { useSelector } from "react-redux";

const LoadingSpinner = () => {
  const isLoading = useSelector((state) => state.general.isLoading);

  return isLoading ? (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white opacity-90">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-600"></div>
    </div>
  ) : null;
};

export default LoadingSpinner;
