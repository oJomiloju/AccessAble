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
              {/* Profile SVG on larger screens */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 rounded-full bg-gray-300 p-1 cursor-pointer hidden md:block"
                viewBox="0 0 32 32"
                onClick={() => setIsSignOutModalOpen(true)}
              >
                <path d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16ZM16,4a5,5,0,1,1-5,5A5,5,0,0,1,16,4Z"/>
                <path d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18ZM6.06,28A9,9,0,0,1,15,20h2a9,9,0,0,1,8.94,8Z"/>
              </svg>
              {/* Username on smaller screens */}
              <button className="text-lg font-bold md:hidden" onClick={() => setIsSignOutModalOpen(true)}>
                Welcome, {username}!
              </button>
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

        {/* Mobile Menu Modal */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#c2c295] flex flex-col items-center justify-center z-50 p-4">
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
              <div className="relative group mb-6">
                <button
                  className="text-2xl font-bold"
                  onClick={() => setIsSignOutModalOpen(true)} // Open sign-out modal
                >
                  Welcome, {username}!
                </button>
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

        {/* Sign-out Confirmation Modal */}
        {isSignOutModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h2 className="text-xl font-semibold mb-6">
                Hello, {username ? username : 'Guest'}, would you like to log out?
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => setIsSignOutModalOpen(false)}
                  className="w-full px-6 py-3 bg-gray-300 text-gray-800 rounded-full text-lg hover:bg-gray-400 transition duration-300"
                >
                  Naah, Just Kidding
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-full text-lg hover:bg-blue-600 transition duration-300"
                >
                  Yes, Log Me Out
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
