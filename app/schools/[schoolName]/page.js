"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";
import ReviewModal from "@/app/components/ReviewModal";
import toast, { Toaster } from "react-hot-toast";
import AuthModal from "@/app/components/AuthModal";

// SearchBar Component
const SearchBar = ({ onSchoolSelect }) => {
  const [school, setSchool] = useState(""); // Input field value
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility

  useEffect(() => {
    const fetchSchools = async () => {
      if (school.trim() === "") {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("universities")
          .select("*")
          .ilike("name", `%${school}%`); // Case-insensitive search

        if (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        } else {
          setSearchResults(data);
          setShowDropdown(true); // Show dropdown when results are found
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchSchools, 300); // Add a delay for better UX
    return () => clearTimeout(debounceFetch); // Cleanup timeout
  }, [school]);

  const handleSelection = (selectedSchool) => {
    setSchool(selectedSchool.name);
    setShowDropdown(false);
    if (onSchoolSelect) onSchoolSelect(selectedSchool); // Trigger the parent handler
  };

  return (
    <div className="relative max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search for a school or university..."
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
        onFocus={() => setShowDropdown(true)} // Show dropdown on focus
      />
      {showDropdown && searchResults.length > 0 && (
        <ul className="absolute w-full bg-white shadow-md rounded-lg mt-2 z-50 max-h-64 overflow-y-auto">
          {searchResults.map((result) => (
            <li
              key={result.id}
              className="px-4 py-2 text-left hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelection(result)}
            >
              {result.name}
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="absolute top-0 right-0 mt-3 mr-6">Loading...</div>}
    </div>
  );
};

export default function SchoolPage({ params }) {
  const [school, setSchool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // To toggle between login and sign-up in AuthModal

  const handleSchoolSelect = (selectedSchool) => {
    window.location.href = `/schools/${encodeURIComponent(selectedSchool.name)}`;
  };

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    async function fetchSchoolData() {
      if (!isMounted) return; // Prevent state updates after unmount

      try {
        const resolvedParams = await params;
        const schoolName = decodeURIComponent(resolvedParams.schoolName);

        // Fetch school data
        const { data: schoolData, error: schoolError } = await supabase
          .from("universities")
          .select("*")
          .eq("name", schoolName)
          .single();

        if (!isMounted) return; // Prevent updates if unmounted

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

        if (!isMounted) return; // Prevent updates if unmounted

        if (reviewsError) console.error("Error fetching reviews:", reviewsError);
        else setReviews(reviewsData || []);
      } catch (err) {
        if (!isMounted) return; // Prevent updates if unmounted
        console.error("Unexpected error:", err);
      } finally {
        if (isMounted) setLoading(false); // Only update if still mounted
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
          setCurrentUser(null); // No user logged in
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

    // Cleanup listener on component unmount
    return () => {
      isMounted = false; // Mark component as unmounted
      //subscription?.unsubscribe();
    };
  }, [params]);

  if (loading) return <div>Loading...</div>;

  if (!school) return <div className="text-center py-10">School not found.</div>;

  const handleWriteReviewClick = () => {
    if (!currentUser) {
      toast.error("Log in/Sign up REQUIRED");
      setAuthModalOpen(true); // Open the AuthModal
      return;
    }
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col bg-[#bcd2e3] min-h-screen overflow">
      {/* Header Section */}
      <div className="flex mt-24 ml-6">
        <h1 className="text-4xl font-bold">{school.name}</h1>
      </div>

      {/* Search Bar */}
      <div className="p-6">
        <SearchBar onSchoolSelect={handleSchoolSelect} />
      </div>

      {/* Ratings Section */}
      <div className="p-6 lg:flex lg:gap-8">
        <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Overall Rating</h2>
          <span className="text-4xl font-bold text-gray-800">
            {school.overall_rating || "N/A"}
          </span>
          <h3 className="text-lg font-bold mb-4">Rating Breakdown</h3>
          {["Recreation Center", "Dining Hall", "Student Center"].map((category, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="w-40 text-gray-600">{category}</span>
            </div>
          ))}
          <button
            onClick={handleWriteReviewClick}
            className="bg-gray-900 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-600 transition"
          >
            Write Review
          </button>
        </div>

        {/* Reviews Section */}
<div className="lg:w-2/3 space-y-6">
  <h2 className="text-3xl font-extrabold text-gray-800 pt-3">
    {reviews.length ? `Browse ${reviews.length} Reviews` : "No Reviews Yet"}
  </h2>
  {reviews.map((review, index) => (
    <div key={index} className="pb-6 border-b-4 border-blue-800 last:border-none">
      {/* Reviewer Information */}
      <div className="flex flex-col space-y-2">
        <p className="text-lg font-bold text-gray-900 underline">
          {review.profiles?.username || "Anonymous"}
        </p>
        <p className="text-sm text-gray-600">
          {new Date(review.review_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Overall Rating */}
      <p className="text-lg font-bold text-[#133e5f] mt-2">
        Rating: {review.stars || "N/A"} / 5
      </p>

      {/* Individual Ratings */}
      <div className="space-y-1 mt-3">
        <p className="text-sm">
          <span className="font-bold">Recreation Center:</span>{" "}
          {review.recreation_center_rating || "N/A"} / 5
        </p>
        <p className="text-sm">
          <span className="font-bold">Dining Hall:</span>{" "}
          {review.dining_hall_rating || "N/A"} / 5
        </p>
        <p className="text-sm">
          <span className="font-bold">Activity Center:</span>{" "}
          {review.main_area_rating || "N/A"} / 5
        </p>
      </div>

      {/* Comment */}
      <p className="text-gray-700 mt-3">
        {review.comment || "No comment provided."}
      </p>
    </div>
  ))}
</div>

      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        universityId={school.id}
        currentUser={currentUser}
      />

      {/* Auth Modal */}
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
