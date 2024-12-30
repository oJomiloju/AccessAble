'use client'; // Required for using React hooks in Next.js App Router

import { useState } from 'react';
import {signUp, signIn, signOut} from '@/app/lib/auth'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for the hamburger menu
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State for the modal
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Sign Up

  return (
    <nav className="bg-[#c2c295] px-6 py-4 flex justify-between items-center">
      {/* App Name */}
      <div className="text-3xl font-serif font-bold">
        <a href="/">AccessAble</a>
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6 items-center">
        <a href="/about" className="text-lg hover:underline">
          About
        </a>
        <button
          className="px-4 py-2 border border-black rounded-full text-lg hover:bg-black hover:text-white transition duration-300"
          onClick={() => {
            setIsAuthModalOpen(true);
            setIsLogin(true); // Default to Login
          }}
        >
          Login
        </button>
      </div>

      {/* Hamburger Icon for Mobile */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus:outline-none"
        >
          {!isMobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#c2c295] flex flex-col items-center justify-center z-50">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
          <a
            href="/about"
            className="text-2xl font-bold mb-6 hover:underline"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </a>
          <button
            className="text-2xl font-bold mb-6 hover:underline"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsAuthModalOpen(true);
              setIsLogin(true);
            }}
          >
            Login
          </button>
        </div>
      )}

      {/* Auth Modal */}
        {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                onClick={() => setIsAuthModalOpen(false)}
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
        )}
    </nav>
  );
};


export default Navbar;
