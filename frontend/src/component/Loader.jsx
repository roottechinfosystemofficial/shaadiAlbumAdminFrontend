import React from "react";

export const Loader = ({ message = "jLoading...a", className = "" }) => {
  return (
    <div className={`text-center py-10 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export const BtnLoader = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="w-5 h-5 border-4 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default BtnLoader;
