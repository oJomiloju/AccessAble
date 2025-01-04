'use client';

import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import supabase from '../lib/supabaseClient';
import { ImageConfigContext } from 'next/dist/shared/lib/image-config-context.shared-runtime';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState(null); // Store the username
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false); // Sign out modal

  // Fetch the current user's username when the component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        console.log('Session Data:', sessionData);

        if (sessionError) {
          console.error('Error fetching session:', sessionError.message);
          return;
        }

        const userId = sessionData?.user?.id;

        if (userId) {
          // Fetch profile for the current user
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

    fetchSession();

    // Listen for changes in the authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUsername(session.user.email); // You can replace this with `session.user.username` if needed
      } else {
        setIsLoggedIn(false);
        setUsername(null);
      }
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUsername(null); // Clear username
      setIsLoggedIn(false); // Mark user as logged out
      setIsSignOutModalOpen(false); // Close sign-out modal
    } catch (err) {
      console.error('Error signing out:', err.message);
    }
  };

  return (
    <div className="relative z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <nav className="bg-[#bcd2e3] h-20 px-3 py-2 flex justify-between items-center fixed top-0 left-0 right-0">
        {/* App Name */}
        
          <a href="/"> <img className="bg-transparent h-52 bg-contain"   src = '\images\AccessAble_1.png' alt='AccessAble logo'  ></img></a>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {/* Enhanced "About" Button */}
            <a
              href="/about"
              className="relative group inline-flex items-center justify-center px-4 py-2 text-md font-medium text-gray-800 bg-white border border-gray-300 rounded-full hover:text-white hover:border-transparent overflow-hidden transition-all duration-300 ease-in-out"
            >
              <span className="relative z-10">About</span>
              <span
                className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"
              ></span>
            </a>

            {isLoggedIn ? (
        <div className="relative group">
          {/* New Profile SVG on larger screens */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-12 w-10 text-gray-700 bg-white p-1 rounded-full cursor-pointer hover:scale-110 hover:text-gray-900 transition-transform duration-300 hidden md:block"
                onClick={() => setIsSignOutModalOpen(true)}
              >
                <g id="about">
                  <path d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16ZM16,4a5,5,0,1,1-5,5A5,5,0,0,1,16,4Z" />
                  <path d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18ZM6.06,28A9,9,0,0,1,15,20h2a9,9,0,0,1,8.94,8Z" />
                </g>
              </svg>
              {/* Username button on smaller screens */}
              {/* Profile SVG on smaller screens */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-10 w-10 text-gray-700 bg-white p-1 rounded-full cursor-pointer hover:scale-110 hover:text-gray-900 transition-transform duration-300 md:hidden"
                onClick={() => setIsSignOutModalOpen(true)}
              >
                <g id="about">
                  <path d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16ZM16,4a5,5,0,1,1-5,5A5,5,0,0,1,16,4Z" />
                  <path d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18ZM6.06,28A9,9,0,0,1,15,20h2a9,9,0,0,1,8.94,8Z" />
                </g>
              </svg>

            </div>
          ) : (
            <button
              className="relative group inline-flex items-center justify-center px-4 py-2 text-md font-medium text-gray-800 bg-white border border-gray-300 rounded-full hover:text-white hover:border-transparent overflow-hidden transition-all duration-300 ease-in-out"
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsLogin(true);
              }}
            >
              <span className="relative z-10">Login</span>
              <span
                className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"
              ></span>
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

        {/* Mobile Menu Modal */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#bcd2e3] flex flex-col items-center justify-center z-50">
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
              className="text-4xl font-bold mb-6 hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            {isLoggedIn ? (
              <div className="relative group mb-6 flex flex-col items-center">
              {/* Profile SVG on smaller screens */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-20 w-24 bg-white p-1 rounded-full cursor-pointer hover:scale-110 hover:text-gray-900 transition-transform duration-300 md:hidden"
                onClick={() => setIsSignOutModalOpen(true)}
              >
                <g id="about">
                  <path d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16ZM16,4a5,5,0,1,1-5,5A5,5,0,0,1,16,4Z" />
                  <path d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18ZM6.06,28A9,9,0,0,1,15,20h2a9,9,0,0,1,8.94,8Z" />
                </g>
              </svg>
            
              {/* Welcome message */}
              <div className="text-md font-medium text-gray-700 mt-2 text-center">
                {/*Welcome, {username || 'Guest'}*/}
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
            window.location.reload();
          }}
        />

        {/* Sign-out Confirmation Modal */}
        {isSignOutModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsSignOutModalOpen(false)} // Close modal when clicking outside
          >
            <div
              className="bg-white p-6 rounded-3xl shadow-xl max-w-sm w-full text-center relative"
              onClick={(e) => e.stopPropagation()} // Prevent modal click from propagating to the overlay
            >
              {/* Close Button */}
              <button
                onClick={() => setIsSignOutModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>

              {/* Icon at the Top */}
              <div className="flex justify-center items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 text-blue-500"
                    viewBox="0 0 32 32"
                  >
                    <g id="about">
                      <path d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16ZM16,4a5,5,0,1,1-5,5A5,5,0,0,1,16,4Z" />
                      <path d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18ZM6.06,28A9,9,0,0,1,15,20h2a9,9,0,0,1,8.94,8Z" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Modal Title */}
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Hello, {username ? username : "Guest"}
              </h2>
              <p className="text-gray-500 mb-6">Are you sure you want to log out?</p>

              {/* Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 bg-black text-white rounded-full text-lg hover:bg-gray-800 transition duration-300"
                >
                  Yes, Log Out
                </button>
                <button
                  onClick={() => setIsSignOutModalOpen(false)}
                  className="w-full py-3 bg-gray-100 text-gray-700 rounded-full text-lg hover:bg-gray-200 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}




      </nav>
    </div>
  );
};

export default Navbar;
