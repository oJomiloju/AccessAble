"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import ReviewModal from "@/app/components/ReviewModal";

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



export default function SchoolPage({ params }) {
  const [school, setSchool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 

  useEffect(() => {
    async function fetchSchoolData() {
      try {
        const resolvedParams = await params;
        const schoolName = decodeURIComponent(resolvedParams.schoolName);

        const { data: schoolData, error: schoolError } = await supabase
          .from("universities")
          .select("*")
          .eq("name", schoolName)
          .single();

        if (schoolError) console.error("Error fetching school:", schoolError);
        else setSchool(schoolData);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .eq("university_id", schoolData.id);

        if (reviewsError) console.error("Error fetching reviews:", reviewsError);
        else setReviews(reviewsData || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCurrentUser() {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", session.session.user.id)
            .single();

          if (profileError) console.error("Error fetching profile:", profileError);
          else setCurrentUser({ id: session.session.user.id, ...profile });
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }

    fetchSchoolData();
    fetchCurrentUser();
  }, [params]);

  if (loading) return <Skeleton />;

  if (!school) return <div className="text-center py-10">School not found.</div>;



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
            <span className="text-4xl font-bold text-gray-800">
              {school.overall_rating || "N/A"}
            </span>
          </div>

          {/* Rating Breakdown */}
          <h3 className="text-lg font-bold mb-4">Rating Breakdown</h3>
          {["Recreation Center", "Dining Hall", "Main Area"].map((category, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="w-40 text-gray-600">{category}</span>
            </div>
          ))}

          {/* Write Review Button */}
          <div className="mt-6 flex justify-start">
            <button onClick={() => setModalOpen(true)} className="bg-gray-900 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-600 transition">
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
            <span className="text-sm font-bold text-gray-800">{review.name || "Anonymous"}</span>
            <span className="text-sm text-gray-500">
              {new Date(review.review_date).toLocaleDateString()}
            </span>
          </div>
          <p className="mb-4">{review.comment || "No comment provided."}</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: "recreation_center_rating", label: "Recreation Center" },
              { key: "dining_hall_rating", label: "Dining Hall" },
              { key: "main_area_rating", label: "Main Area" },
            ].map(({ key, label }, i) => (
              <div key={i}>
                <h3 className="text-sm font-semibold">{label}</h3>
                <div className="flex space-x-1">
                  {review[key] || 0}
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
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
          No Reviews Yet
        </h2>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                Be the first to share your experience and help others learn more about this schools Accessibility. Your review could make a big difference!
              </p>

              {/* Call-to-Action Button */}
              <button onClick={() => setModalOpen(true)}  className="bg-gray-900 hover:bg-gray-600 text-white py-3 px-8 rounded-full shadow-md transition-transform transform hover:scale-105">
                Review
              </button>
            </div>
          </div>

          )}
        </div>
      </div>
          <ReviewModal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            universityId={school.id}
            currentUser={currentUser} // Pass the user data here
          />;
    </div>
  );
}
