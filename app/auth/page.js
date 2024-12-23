'use client'; // Required for using React hooks in Next.js App Router
import { useState } from 'react';

const AuthModals = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <div>
      {/* Buttons */}
      <div className="flex space-x-4">
        {/* Login Button */}
        <button
          className="px-4 py-2 border border-black text-black font-bold rounded-md hover:bg-black hover:text-white transition"
          onClick={() => setIsLoginOpen(true)}
        >
          Login
        </button>
        {/* Sign Up Button */}
        <button
          className="px-4 py-2 border border-black text-black font-bold rounded-md hover:bg-black hover:text-white transition"
          onClick={() => setIsSignupOpen(true)}
        >
          Sign Up
        </button>
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setIsLoginOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Login
            </h2>

            {/* Login Form */}
            <form>
              <div className="mb-4">
                <input
                  type="email"
                  className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Email"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Password"
                />
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {isSignupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={() => setIsSignupOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Sign Up
            </h2>

            {/* Signup Form */}
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Username"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Email"
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModals;
