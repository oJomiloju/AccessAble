'use client';

import React from 'react';

const AuthModal = ({ isOpen, onClose, isLogin, setIsLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {/* Form */}
        <form>
          {!isLogin && (
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Username"
              />
            </div>
          )}
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
            className="w-full py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {/* Toggle Link */}
        <p className="text-center mt-4 text-gray-600">
          {isLogin ? (
            <>
              Don’t have an account?{' '}
              <span
                onClick={() => setIsLogin(false)}
                className="text-[#497c4b] font-bold cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setIsLogin(true)}
                className="text-[#497c4b] font-bold cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
