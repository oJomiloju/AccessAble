'use client';

import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import supabase from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState(null); // Store the username
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false); // Sign out modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete account modal
  const [userId, setUserId] = useState(null); // State to store the user ID


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error fetching session:', sessionError.message);
          return;
        }
  
        const userId = sessionData?.user?.id;
        
  
        if (userId) {
          // Fetch the username from the profiles table
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
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Unexpected error fetching username:', err.message);
      }
    };
  
    fetchSession();
  
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const userId = session.user.id;
  
        // Fetch the username from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', userId)
          .single();
  
        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          setUsername(null);
          setIsLoggedIn(false);
          return;
        }
  
        setUsername(profile.username); // Set the username in state
        setUserId(userId);
        setIsLoggedIn(true);
      } else {
        setUsername(null);
        setIsLoggedIn(false);
      }
    });
  
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await toast.promise(
      (async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          setUsername(null);
          setIsLoggedIn(false);
          setIsSignOutModalOpen(false);
        } catch (err) {
          console.error('Error signing out:', err.message);
          throw err;
        }
      })(),
      {
        loading: 'Signing out...',
        success: 'Log out successful!',
        error: (err) => `Error: ${err.message || 'An unexpected error occurred'}`,
      }
    );
  };

  const handleDeleteAccount = async () => {
    try {
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
        
      }
      // Call the Supabase RPC function directly
      const { data, error } = await supabase.rpc('delete_user', { user_id: userId });
  
      if (error) {
        throw new Error(error.message || 'Failed to delete account.');
      }
  
      toast.success('Account deleted successfully!');
      setUsername(null); // Clear username in Navbar state
      setIsLoggedIn(false); // Update login state
      setIsSignOutModalOpen(false); // Close modal
  
      // Optionally reload the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Error deleting account:', err.message);
      console.log(userId);
      toast.error(`Error: ${err.message}`);
    }
  };
  

  

  return (
    <div className="relative z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <nav className="bg-[#bcd2e3] h-20 px-3 py-2 flex justify-between items-center fixed top-0 left-0 right-0">
        <a href="/"> <img className="bg-transparent h-52 bg-contain" src="/images/AccessAble_1.png" alt="AccessAble logo" /></a>

        <div className="hidden md:flex space-x-6 items-center">
          <a
            href="/about"
            className="relative group inline-flex items-center justify-center px-4 py-2 text-md font-medium text-gray-800 bg-white border border-gray-300 rounded-full hover:text-white hover:border-transparent overflow-hidden transition-all duration-300 ease-in-out"
          >
            <span className="relative z-10">About</span>
            <span className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
          </a>

          {isLoggedIn ? (
            <div className="relative group">
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
              <span className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
            </button>
          )}
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          onLoginSuccess={(username) => {
            setUsername(username);
            setIsLoggedIn(true);
            setIsAuthModalOpen(false);
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }}
        />

        {isSignOutModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className="bg-white p-6 rounded-3xl shadow-xl max-w-sm w-full text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsSignOutModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Hey {username || 'User'}</h2>
              <p className="text-gray-500 mb-6">Are you sure you want to log out?</p>
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
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full py-3 bg-red-600 text-white rounded-full text-lg hover:bg-red-700 transition duration-300"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <div
              className="bg-white p-6 rounded-3xl shadow-xl max-w-sm w-full text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Delete Account</h2>
              <p className="text-gray-500 mb-6">Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="space-y-4">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-3 bg-red-600 text-white rounded-full text-lg hover:bg-red-700 transition duration-300"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
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
