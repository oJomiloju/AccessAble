"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import ReviewModal from "@/app/components/ReviewModal";
import toast from "react-hot-toast";
import AuthModal from "@/app/components/AuthModal";

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
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // To toggle between login and sign-up in AuthModal

  useEffect(() => {
    let isMounted = true;

    async function fetchSchoolData() {
      if (!isMounted) return;

      try {
        const resolvedParams = await params;
        const schoolName = decodeURIComponent(resolvedParams.schoolName);

        // Fetch school data
        const { data: schoolData, error: schoolError } = await supabase
          .from("universities")
          .select("*")
          .eq("name", schoolName)
          .single();

        if (!isMounted) return;

        if (schoolError) console.error("Error fetching school:", schoolError);
        else setSchool(schoolData);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(`
            id,
            comment,
            review_date,
            stars,
            recreation_center_rating,
            dining_hall_rating,
            main_area_rating,
            reviewer_id,
            profiles (username)
          `)
          .eq("university_id", schoolData.id);

        if (!isMounted) return;

        if (reviewsError) console.error("Error fetching reviews:", reviewsError);
        else setReviews(reviewsData || []);
      } catch (err) {
        if (!isMounted) return;
        console.error("Unexpected error:", err);
      } finally {
        if (isMounted) setLoading(false);
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
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      }
    }

    fetchSchoolData();
    fetchCurrentUser();

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchCurrentUser();
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [params]);

  if (loading) return <Skeleton />;

  if (!school) return <div className="text-center py-10">School not found.</div>;

  const handleWriteReviewClick = () => {
    if (!currentUser) {
      toast.error("Log in/Sign up REQUIRED");
      setAuthModalOpen(true);
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
        {/* Search Bar */}
      <div className="relative pt-24 px-4">
        <div className="mx-auto lg:mx-0 lg:ml-4 max-w-3xl lg:max-w-full lg:flex lg:justify-start">
          <div className="flex items-center bg-white border border-black rounded-full shadow-md p-4 lg:w-1/2">
            {/* SVG Icon */}
            <div className="mr-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                viewBox="0 0 16 16"
                fill="none"
              >
                <polygon points="0,5 8,9 15,5.5 15,14 16,14 16,5 8,1" fill="currentColor" />
                <polygon points="3,7.059 3,11.5 8,14 13,11.5 13,7.059 8,9.559" fill="currentColor" />
              </svg>
            </div>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for a school..."
              className="flex-grow bg-transparent outline-none text-gray-700 text-lg"
            />
          </div>
        </div>
      </div>



      {/* Header Section */}
      <div className="relative mt-4">
        <div className="w-full h-[440px] bg-center bg-cover" style={{ backgroundImage: `url(${school.image_url})` }}></div>
        <div className="absolute inset-0 flex items-end justify-between p-8 bg-gradient-to-t from-black via-transparent to-transparent">
          <div>
            <h1 className="text-4xl font-bold text-white">{school.name}</h1>
            <p className="text-lg text-gray-300 mt-2">{school.location}</p>
          </div>
        </div>
      </div>

      <div className="p-6 lg:flex lg:gap-8">
        {/* Ratings Section */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6 h-96">
          <h2 className="text-2xl font-bold mb-4">Overall Rating</h2>
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-4xl font-bold text-gray-800">{school.overall_rating || "N/A"}</span>
          </div>
          <h3 className="text-lg font-bold mb-4">Rating Breakdown</h3>
          {["Recreation Center", "Dining Hall", "Student Center"].map((category, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="w-40 text-gray-600">{category}</span>
            </div>
          ))}
          <div className="mt-6 flex justify-start">
            <button
              onClick={handleWriteReviewClick}
              className="bg-gray-900 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-600 transition"
            >
              Write Review
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="lg:w-2/3 space-y-6 h-auto overflow-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 pt-3">
            {reviews.length ? `Browse ${reviews.length} Reviews` : "No Reviews Yet"}
          </h2>
          {reviews.map((review, index) => (
            <div key={index} className="pb-6 border-b-4 border-blue-800 last:border-none">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-lg font-bold text-gray-900 underline mr-2">
                    {review.profiles?.username || "Anonymous"}
                  </p>
                  <p className="text-lg font-bold text-[#133e5f]">
                    | Rating: {review.stars || "N/A"} / 5
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{review.comment || "No comment provided."}</p>
            </div>
          ))}
        </div>
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        universityId={school.id}
        currentUser={currentUser}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        onLoginSuccess={(username) => {
          setCurrentUser((prev) => ({ ...prev, username }));
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}
