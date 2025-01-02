'use client';

import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import supabase from '../lib/supabaseClient';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState(null); // Store the username
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  // Fetch the current user's username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error fetching session:', sessionError.message);
          return;
        }

        const userId = sessionData?.user?.id;

        if (userId) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userId)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError.message);
            return;
          }

          setUsername(profile.username); // Set the username in state
          setIsLoggedIn(true); // Mark user as logged in
        }
      } catch (err) {
        console.error('Unexpected error fetching username:', err.message);
      }
    };

    fetchUsername();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUsername(null); // Clear username
      setIsLoggedIn(false); // Mark user as logged out
    } catch (err) {
      console.error('Error signing out:', err.message);
    }
  };

  return (
    <div className="relative z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <nav className="bg-[#c2c295] px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0">
        {/* App Name */}
        <div className="text-3xl font-serif font-bold">
          <a href="/">AccessAble</a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <a href="/about" className="text-lg hover:underline">About</a>
          {isLoggedIn ? (
            <div className="relative group">
              <button className="text-lg font-bold">Welcome, {username}!</button>
              <div className="absolute hidden group-hover:block bg-white border border-gray-300 shadow-lg rounded mt-2">
                <button
                  onClick={handleSignOut}
                  className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              className="px-4 py-2 border border-black rounded-full text-lg hover:bg-black hover:text-white transition duration-300"
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsLogin(true);
              }}
            >
              Login
            </button>
          )}
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
            {isLoggedIn ? (
              <div className="relative group">
                <button className="text-2xl font-bold">Welcome, {username}!</button>
                <div className="absolute hidden group-hover:block bg-white border border-gray-300 shadow-lg rounded mt-2">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-black hover:bg-gray-100 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          onLoginSuccess={(username) => {
            setUsername(username); // Set username in Navbar
            setIsLoggedIn(true); // Mark user as logged in
            setIsAuthModalOpen(false); // Close modal
          }}
        />
      </nav>
    </div>
  );
};

export default Navbar;
