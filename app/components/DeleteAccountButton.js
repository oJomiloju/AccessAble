'use client';

import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const DeleteAccountButton = ({ onSuccess }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching session:', error.message);
          return;
        }

        if (data.session?.user?.id) {
          setCurrentUserId(data.session.user.id);
          setIsSignedIn(true);
        } else {
          setIsSignedIn(false); // User is not signed in
        }
      } catch (err) {
        console.error('Unexpected error fetching session:', err.message);
      }
    };

    fetchUserId();
  }, []);

  const handleDeleteAccount = async () => {
    if (!currentUserId) {
      toast.error('Unable to find your account.');
      return;
    }

    try {
      // Delete the user's account from Supabase
      const { error } = await supabase.auth.admin.deleteUser(currentUserId);

      if (error) {
        console.error('Error deleting account:', error.message);
        toast.error('Failed to delete account. Try again later.');
        return;
      }

      // Additional cleanup (e.g., deleting profile)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', currentUserId);

      if (profileError) {
        console.error('Error deleting profile:', profileError.message);
        toast.error('Failed to clean up profile. Try again later.');
        return;
      }

      toast.success('Account deleted successfully.');
      onSuccess?.(); // Optional callback to handle UI updates after deletion
    } catch (err) {
      console.error('Unexpected error during deletion:', err.message);
      toast.error('An unexpected error occurred.');
    }
  };

  if (!isSignedIn) {
    return (
      <p className="text-center mt-4 text-gray-500">
        You need to be signed in to delete your account.
      </p>
    );
  }

  return (
    <div className="text-center mt-4">
      {confirmDelete ? (
        <>
          <p className="text-red-600 font-bold">Are you sure you want to delete your account?</p>
          <div className="flex justify-center space-x-4 mt-2">
            <button
              onClick={handleDeleteAccount}
              className="py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => setConfirmDelete(true)}
          className="text-red-500 font-bold hover:underline"
        >
          Delete Account
        </button>
      )}
    </div>
  );
};

export default DeleteAccountButton;
