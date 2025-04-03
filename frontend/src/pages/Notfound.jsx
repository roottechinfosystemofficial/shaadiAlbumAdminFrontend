import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-purple-300 text-center p-6">
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-800 animate-pulse mb-6">
        404
      </h1>
      <h2 className="text-4xl font-bold text-gray-900 mb-3">
        Oh no! Lost in space?
      </h2>
      <p className="text-gray-700 text-lg mb-8 max-w-lg">
        It seems like you've reached a page that doesn't exist. Don't worry,
        let's get you back to safety!
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg text-lg shadow-lg hover:scale-105 transform transition duration-300"
      >
        🚀 Take Me Home
      </Link>
    </div>
  );
};

export default Notfound;
