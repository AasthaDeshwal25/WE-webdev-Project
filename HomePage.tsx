import React from "react";

const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative text-center p-6">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          Book Your Outdoor Adventure
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl">
          Let us help you find the most scenic places, thrilling activities, and customized experiences. 
          Don’t wait for adventure—it’s waiting for you!
        </p>
        <div className="mt-6 flex space-x-4">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg font-bold transition">
            Book Now
          </button>
          <button className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-lg shadow-lg font-bold transition">
            How It Works
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
