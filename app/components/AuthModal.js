'use client';

import React from 'react';
import { useState } from 'react';
import supabase from '../lib/supabaseClient'; 
import toast, { Toaster } from 'react-hot-toast';


const AuthModal = ({ isOpen, onClose, isLogin, setIsLogin , onLoginSuccess}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');

  const signUp = async (email, password, username) => {
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({ email, password });
  
      console.log('SignUp response:', signUpData, error);
  
      if (error) {
        console.error('SignUp error:', error.message);
        return { user: null, error };
      }
  
      // Fetch user after sign-up if not available
      let userId = signUpData.user?.id;
      if (!userId) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Error fetching session:', sessionError.message);
          throw sessionError;
        }
        userId = sessionData?.user?.id;
      }
  
      if (!userId) {
        throw new Error('Unable to fetch user ID after sign-up.');
      }
  
      // Insert profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: userId, email, username }]);
  
      if (profileError) {
        console.error('Error inserting profile:', profileError.message);
        throw profileError;
      }
  
      console.log('Profile successfully created:', profile);
      return { user: { id: userId, email }, profile, error: null };
    } catch (err) {
      console.error('Unexpected error during signUp:', err.message);
      return { user: null, error: err };
    }
  };
  
  

 const signIn = async (email , password) => {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password});
    return { user, error };
  };

 const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { user, error };
  };

  
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(''); // Clear any previous messages
    
    // Wrap the async operation in toast.promise
    await toast.promise(
      (async () => {
        setIsLoading(true); // Show loading state
        
        let response;
        if (isLogin) {
          // Log the user in
          console.log('Logging in with:', email, password);
          response = await signIn(email, password);
        } else {
          // Sign the user up and insert into profiles table
          console.log('Signing up with:', email, password, username);
          response = await signUp(email, password, username); // Pass username to the function
        }
  
        if (response.error) {
          // Throw an error to trigger the toast error state
          throw new Error(response.error.message);
        }
  
        let fetchedUsername = username; // Use entered username for signup
  
        // Fetch username for login
        if (isLogin) {
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = sessionData?.user?.id;
  
          if (userId) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', userId)
              .single();
  
            if (profileError) {
              throw new Error('Error fetching profile: ' + profileError.message);
            }
  
            fetchedUsername = profile.username; // Fetch username from database
          }
        }
  
        // Pass the username to the onLoginSuccess callback
        onLoginSuccess(fetchedUsername);
  
        // If successful, close the modal
        setMessage('Success! You are now registered.');
        onClose();
      })(),
      {
        loading: isLogin ? 'Logging in...' : 'Signing up...',
        success: isLogin
          ? 'Logged in successfully!'
          : 'Account created successfully!',
        error: (err) => `Error: ${err.message || 'Unexpected error occurred'}`,
      }
    ).finally(() => {
      setIsLoading(false); // Always stop the loading spinner
    });
  };
  

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
  };

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
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <input
                type="text"
                value={username} //this is what links it to the react useState variable
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Full Name or Username"
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="email"
              value = {email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Email (case sensitive)"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Password (case sensitive)"
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
                onClick={() => {

                  setIsLogin(false);
                  resetForm();
                }}
                className="text-[#497c4b] font-bold cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </>

          ) : (
            <>
              Already have an account?{' '}
              <span
                onClick={() => {
                  setIsLogin(true);
                  resetForm();
                }}
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
