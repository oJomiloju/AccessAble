"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";

const Skeleton = () => (
  <div className="bg-gray-300 animate-pulse rounded-xl shadow-md overflow-hidden">
    <div className="w-full h-64 bg-gray-400"></div>
    <div className="p-4 space-y-2">
      <div className="h-6 bg-gray-400 rounded"></div>
      <div className="h-4 bg-gray-400 rounded w-1/2"></div>
      <div className="h-4 bg-gray-400 rounded w-3/4"></div>
    </div>
  </div>
);

const Star = ({ filled }) => (
  <svg
    className={`w-6 h-6 ${filled ? "text-yellow-500" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 .587l3.668 7.429 8.207 1.18-5.937 5.78L19.702 23 12 19.25 4.298 23l1.764-8.024-5.937-5.78 8.207-1.18L12 .587z" />
  </svg>
);

export default function SchoolPage({ params }) {
  const [school, setSchool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchoolData() {
      try {
        const resolvedParams = await params; // Unwrap params
        const schoolName = decodeURIComponent(resolvedParams.schoolName);

        // Fetch school data
        const { data: schoolData, error: schoolError } = await supabase
          .from("universities")
          .select("*")
          .eq("name", schoolName)
          .single();

        if (schoolError) {
          console.error("Error fetching school:", schoolError);
        } else {
          setSchool(schoolData);

          // Fetch reviews
          const { data: reviewsData, error: reviewsError } = await supabase
            .from("reviews")
            .select("*")
            .eq("university_id", schoolData.id);

          if (reviewsError) {
            console.error("Error fetching reviews:", reviewsError);
          } else {
            setReviews(reviewsData || []);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchoolData();
  }, [params]);

  if (loading) return <Skeleton />;

  if (!school) return <div className="text-center py-10">School not found.</div>;

  const renderStars = (rating) => {
    const filledStars = Math.round(rating);
    return Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} filled={index < filledStars} />
    ));
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative mb-8">
        <div
          className="w-full h-64 bg-center bg-cover"
          style={{
            backgroundImage: `url(${school.image_url})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">{school.name}</h1>
            <p className="text-lg mt-2">{school.location}</p>
          </div>
        </div>
      </div>

      <div className="p-6 lg:flex lg:gap-8">
        {/* Ratings Section */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Overall Rating</h2>
          <div className="flex items-center space-x-4 mb-6">
            {renderStars(school.overall_rating || 0)}
            <span className="text-4xl font-bold text-gray-800">
              {school.overall_rating || "N/A"}
            </span>
          </div>

          {/* Rating Breakdown */}
          <h3 className="text-lg font-bold mb-4">Rating Breakdown</h3>
          {["Recreation Center", "Dining Hall", "Main Area"].map((category, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="w-40 text-gray-600">{category}</span>
              <div className="flex space-x-1">
                {renderStars(3)} {/* Replace with actual category ratings */}
              </div>
            </div>
          ))}

          {/* Write Review Button */}
          <div className="mt-6 flex justify-start">
            <button className="bg-gray-900 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-600 transition">
              Write Review
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="lg:w-2/3 space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-800 pt-3">
            {reviews.length ? `Browse ${reviews.length} Reviews` : "No Reviews Yet"}
          </h2>
          {reviews.length ? (
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-gray-800">{review.name}</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="mb-4">{review.comment}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {["Recreation Center", "Dining Hall", "Main Area"].map((category, i) => (
                      <div key={i}>
                        <h3 className="text-sm font-semibold">{category}</h3>
                        <div className="flex space-x-1">
                          {renderStars(review[category.toLowerCase()] || 0)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-gray-50 py-16 px-8 rounded-lg shadow-lg border border-gray-200">
            <div className="flex flex-col items-center space-y-6">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>

              {/* Title */}
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                No Reviews Yet
              </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Be the first to share your experience and help others learn more about this schools Accessibility. Your review could make a big difference!
              </p>

              {/* Call-to-Action Button */}
              <button className="bg-gray-900 hover:bg-gray-600 text-white py-3 px-8 rounded-full shadow-md transition-transform transform hover:scale-105">
                Review
              </button>
            </div>
          </div>

          )}
        </div>
      </div>
    </div>
  );
}
