'use client';

import { useState } from 'react';
import AuthModal from './AuthModal'; // Adjust the path based on your project structure

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

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
            setIsLogin(true);
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
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
    </nav>
  );
};

export default Navbar;
