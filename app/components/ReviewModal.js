'use client';
import React, { useState } from "react";
import supabase from "../lib/supabaseClient";

const ReviewModal = ({ isOpen, onClose, universityId, currentUser }) => {
  const [rating, setRating] = useState(0); // Overall stars rating
  const [categoryRatings, setCategoryRatings] = useState({
    recreation_center_rating: 1,
    dining_hall_rating: 1,
    main_area_rating: 1,
  }); // Ratings for individual categories
  const [comment, setComment] = useState(""); // User comment

  const categories = [
    { key: "recreation_center_rating", label: "Recreation Center" },
    { key: "dining_hall_rating", label: "Dining Hall" },
    { key: "main_area_rating", label: "Main Area" },
  ];

  // Handle submission of the review
  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase.from("reviews").insert([
        {
          university_id: universityId, // Link review to the university
          reviewer_id: currentUser.id, // Foreign key to auth.users via profiles table
          stars: rating, // Overall stars rating
          comment, // User-provided comment
          recreation_center_rating: categoryRatings.recreation_center_rating,
          dining_hall_rating: categoryRatings.dining_hall_rating,
          main_area_rating: categoryRatings.main_area_rating,
        },
      ]);

      if (error) {
        console.error("Error submitting review:", error);
      } else {
        console.log("Review submitted successfully:", data);
        onClose(); // Close the modal after submission
        window.location.reload();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
        <div className="space-y-4">
          {/* Username Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 cursor-not-allowed"
              value={currentUser.username} // Display username from currentUser
              readOnly // Make field non-editable
            />
          </div>

          {/* Overall Rating Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Overall Rating</label>
            <input
              type="number"
              min="1"
              max="5"
              step="0.5"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a rating (1-5)"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>

          {/* Category Ratings */}
          {categories.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-gray-700 font-medium mb-2">{label} Rating</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.5"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${label} rating (1-5)`}
                value={categoryRatings[key]}
                onChange={(e) =>
                  setCategoryRatings((prev) => ({
                    ...prev,
                    [key]: Number(e.target.value),
                  }))
                }
              />
            </div>
          ))}

          {/* Comment Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Comment</label>
            <textarea
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your comment here"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required // Makes the field required
            />
        {comment.trim() === "" && (
        <p className="text-red-500 text-sm mt-1 target">Comment is required</p>
        )}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
