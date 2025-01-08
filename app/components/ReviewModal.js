"use client";
import React, { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

const ReviewModal = ({ isOpen, onClose, universityId, currentUser }) => {
  const [categoryRatings, setCategoryRatings] = useState({
    recreation_center_rating: 1,
    dining_hall_rating: 1,
    main_area_rating: 1,
  });
  const [comment, setComment] = useState("");
  const [overallRating, setOverallRating] = useState(0);

  const categories = [
    { key: "recreation_center_rating", label: "Recreation Center" },
    { key: "dining_hall_rating", label: "Dining Hall" },
    { key: "main_area_rating", label: "Student Center" },
  ];

  useEffect(() => {
    const totalRating =
      categoryRatings.recreation_center_rating +
      categoryRatings.dining_hall_rating +
      categoryRatings.main_area_rating;

    const calculatedOverall = totalRating / 3;
    setOverallRating(Number(calculatedOverall.toFixed(1)));
  }, [categoryRatings]);

  const handleSubmit = async () => {
    if (comment.trim() === "") {
      alert("Please provide a comment!");
      return;
    }

    try {
      const { data, error } = await supabase.from("reviews").insert([
        {
          university_id: universityId,
          reviewer_id: currentUser.id,
          stars: overallRating,
          comment,
          recreation_center_rating: categoryRatings.recreation_center_rating,
          dining_hall_rating: categoryRatings.dining_hall_rating,
          main_area_rating: categoryRatings.main_area_rating,
        },
      ]);

      if (error) {
        console.error("Error submitting review:", error);
      } else {
        console.log("Review submitted successfully:", data);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-overlay"
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4 overflow-y-auto"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-sm md:max-w-lg lg:max-w-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>

        {/* Modal Content */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
            Write a Review
          </h2>

          {/* Category Ratings */}
          <div className="mb-4">
            <h3 className="block text-gray-700 font-semibold mb-2 text-center">
              Rate Specific Categories:
            </h3>
            {categories.map(({ key, label }) => (
              <div key={key} className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">
                  {label}
                </label>
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

          {/* Overall Rating */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1 text-center">
              Your Overall Rating
            </label>
            <div className="text-2xl md:text-3xl font-bold text-blue-600 text-center">
              {overallRating} / 5
            </div>
          </div>

          {/* Comment Section */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">
              Share your experience
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your comment here..."
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
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
