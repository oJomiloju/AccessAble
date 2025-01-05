"use client";
import React, { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

const ReviewModal = ({ isOpen, onClose, universityId, currentUser }) => {
  const [categoryRatings, setCategoryRatings] = useState({
    recreation_center_rating: 1,
    dining_hall_rating: 1,
    main_area_rating: 1,
  }); // Ratings for individual categories
  const [comment, setComment] = useState(""); // User's comment
  const [overallRating, setOverallRating] = useState(0); // Dynamically calculated overall rating

  const categories = [
    { key: "recreation_center_rating", label: "Recreation Center" },
    { key: "dining_hall_rating", label: "Dining Hall" },
    { key: "main_area_rating", label: "Student Center" },
  ];

  // Recalculate the overall rating whenever category ratings change
  useEffect(() => {
    const totalRating =
      categoryRatings.recreation_center_rating +
      categoryRatings.dining_hall_rating +
      categoryRatings.main_area_rating;

    const calculatedOverall = totalRating / 3; // Average of the three ratings
    setOverallRating(Number(calculatedOverall.toFixed(1))); // Round to 1 decimal place
  }, [categoryRatings]);

  const handleSubmit = async () => {
    if (comment.trim() === "") {
      alert("Please provide a comment!");
      return;
    }

    try {
      const { data, error } = await supabase.from("reviews").insert([
        {
          university_id: universityId, // Link review to the university
          reviewer_id: currentUser.id, // Foreign key to auth.users via profiles table
          stars: overallRating, // Use the calculated overall rating
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
        onClose(); // Close modal after submission
        window.location.reload(); // Reload to update
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-[#bcd2e3] rounded-lg shadow-lg w-full max-w-xl sm:p-28 md:p-12 h-full overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
  
        {/* Inner Scrollable Content */}
        <div className="max-h-full overflow-y-auto">
          {/* Modal Title */}
          <h2 className="text-2xl font-bold mb-6 text-center">Write a Review</h2>
  
          {/* Category Ratings */}
          <div className="mb-6">
            <h3 className="block text-gray-700 font-medium mb-3">Rate Specific Categories:</h3>
            {categories.map(({ key, label }) => (
              <div key={key} className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">{label}</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={categoryRatings[key]}
                  onChange={(e) =>
                    setCategoryRatings((prev) => ({
                      ...prev,
                      [key]: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="text-gray-600 text-sm mt-1">
                  {categoryRatings[key]} / 5
                </div>
              </div>
            ))}
          </div>
  
          {/* Dynamically Calculated Overall Rating */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Your Overall Rating</label>
            <div className="text-3xl font-bold text-blue-600 text-center">
              {overallRating} / 5
            </div>
          </div>
  
          {/* Comment Section */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Share your experience
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your comment here..."
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {comment.trim() === "" && (
              <p className="text-red-500 text-sm mt-1">Comment is required</p>
            )}
          </div>
  
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className={`bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition ${
                comment.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={comment.trim() === ""}
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default ReviewModal;
