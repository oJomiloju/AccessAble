'use client';

import React from 'react';
import { useState } from 'react';
import { signUp , signIn } from '../lib/auth';
import supabase from '../lib/supabaseClient';         

const AuthModal = ({ isOpen, onClose, isLogin, setIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');

  
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      let response;
      if (isLogin) {
        console.log('Logging in with:', email, password); //debug code
        response = await signIn(email, password);
      } else {
        console.log('Signing ip with:', email, password); //debug code
        response = await signUp(email, password);
        console.log('SignUp response:', response);
        if (!response.error) //adding user to DB if we are signingUp instead of logging in
        {
          console.log('Sign up successful, inserting profile...');
          
          const {error: profileError} = await supabase
            .from('profiles')
            .insert({
              user_id: response.user?.id,
              email: response.user?.email,
              username: username,
            });

          if (profileError) throw profileError;
        }
      }

      if (response.error) {
        console.error('Error during signUp:', response.error);
        throw response.error;
      }
      setMessage('Success');
      onClose();
    } catch (err) {
      setMessage(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
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
                placeholder="Username"
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="email"
              value = {email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              className="w-full p-2 bg-white text-gray-800 border border-black placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Email"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
