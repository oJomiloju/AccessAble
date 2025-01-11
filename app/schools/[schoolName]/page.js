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
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Input field value
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility

  // Check if user is logged in when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching current user:", error);
      } else if (user) {
        setCurrentUser(user);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchSchools = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("universities")
          .select("*")
          .ilike("name", `%${searchTerm}%`);

        if (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        } else {
          setSearchResults(data);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setSearchResults([]);
      }
    };

    const debounceFetch = setTimeout(fetchSchools, 300);
    return () => clearTimeout(debounceFetch);
  }, [searchTerm]);

  const handleSelection = (selectedSchool) => {
    setSearchTerm(selectedSchool.name);
    setShowDropdown(false);
    window.location.href = `/schools/${encodeURIComponent(selectedSchool.name)}`;
  };

  // Fetch average ratings for the university
  const fetchAverageRatings = async (universityId) => {
    try {
      const { data, error } = await supabase.rpc("get_average_ratings", {
        university_id_input: universityId,
      });
  
      console.log("Supabase RPC Response:", { data, error }); // Debugging
  
      if (error || !data) {
        console.error("Error fetching average ratings via RPC:", error || "No data returned");
        return {
          recreation_center_avg: null,
          dining_hall_avg: null,
          student_center_avg: null,
        };
      }
  
      return data[0];
    } catch (err) {
      console.error("Unexpected error fetching average ratings via RPC:", err);
      return {
        recreation_center_avg: null,
        dining_hall_avg: null,
        student_center_avg: null,
      };
    }
  };
  

  useEffect(() => {
    let isMounted = true;
  
    async function fetchSchoolData() {
      if (!isMounted) return;
  
      try {
        const resolvedParams = await params;
        const schoolName = decodeURIComponent(resolvedParams.schoolName);
  
        const { data: schoolData, error: schoolError } = await supabase
          .from("universities")
          .select("*")
          .eq("name", schoolName)
          .single();
  
        if (!isMounted) return;
  
        if (schoolError) {
          console.error("Error fetching school:", schoolError);
        } else {
          const averages = await fetchAverageRatings(schoolData.id);
          console.log("Fetched averages:", averages); // Debugging
          setSchool({
            ...schoolData,
            averages,
          });
        }
  
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
  
        if (reviewsError) {
          console.error("Error fetching reviews:", reviewsError);
        } else {
          setReviews(reviewsData || []);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Unexpected error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
  
    fetchSchoolData();
  
    return () => {
      isMounted = false;
    };
  }, [params]);

  const handleWriteReviewClick = () => {
    if (!currentUser) {
      toast.error("Log in/Sign up REQUIRED");
      setAuthModalOpen(true); // Open the AuthModal
      return;
    }
    setModalOpen(true);
  };

  if (loading) return <Skeleton />;

  if (!school)
    return (
      <div className="text-center py-10">
        <h2>No school found. Please use the search bar above.</h2>
      </div>
    );

  return (
    <div className="min-h-screen">

      {/* Search Bar */}
      <div className="relative pt-24 px-4 ">
        <div className=" lg:mx-0 lg:ml-[400px] max-w-3xl lg:max-w-full lg:flex lg:justify-start">
          <div className="relative flex items-center bg-white border border-black rounded-full shadow-md p-3 lg:w-1/2">
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
            {/* Input Field */}
            <input
              type="text"
              placeholder="Search for a school..."
              className="flex-grow bg-transparent outline-none text-gray-700 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
          </div>

          {/* Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <ul
              className="absolute bg-white shadow-md rounded-lg mt-1 z-50 max-h-64 overflow-y-auto w-full lg:w-1/2 border border-gray-300"
              style={{ top: "100%" }} // Ensure dropdown starts just below the input field
            >
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

          {/* No Results */}
          {!loading && searchResults.length === 0 && searchTerm.trim() !== "" && (
            <div
              className="absolute bg-white shadow-md rounded-lg mt-1 z-50 w-full lg:w-1/2 border border-gray-300"
              style={{ top: "100%" }} // Ensure dropdown starts just below the input field
            >
              <p className="px-4 py-2 text-left text-gray-600">No results found</p>
            </div>
          )}
        </div>
      </div>

      {/* Header Section */}
      <div className="relative mt-4">
        <div className="w-full h-[440px] bg-center bg-cover " style={{ backgroundImage: `url(${school.image_url})` }}></div>
        <div className="absolute inset-0 flex items-end justify-between p-8 bg-gradient-to-t from-black via-transparent to-transparent">
          <div>
            <h1 className="text-4xl font-bold text-white">{school.name}</h1>
            <p className="text-lg text-gray-300 mt-2">{school.location}</p>
          </div>
        </div>
      </div>
      <div className="p-6 lg:flex lg:gap-8">
        {/* Ratings Section */}
        <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-6 h-96">
          <h2 className="text-2xl font-bold mb-4">Overall Rating</h2>
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-4xl font-bold text-gray-800">{school.overall_rating || "N/A"}</span>
          </div>
          <h3 className="text-lg font-bold mb-4">Rating Breakdown</h3>
          {[
            { category: "Rec Center", value: school?.averages?.recreation_center_avg },
            { category: "Dining Hall", value: school?.averages?.dining_hall_avg },
            { category: "Student Center", value: school?.averages?.student_center_avg },
          ].map(({ category, value }, index) => (
          <div key={index} className="flex items-center mb-2">
            <span className="w-40 text-gray-600">{`${category}: ${
              value && typeof value === "number" ? value.toFixed(1) : "N/A"
            }`}</span>
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

          {reviews.length > 0 ? (
            reviews.map((review, index) => {
              const reviewDate = new Date(review.review_date);
              const today = new Date();
              const isToday = reviewDate.toDateString() === today.toDateString();

              const formattedDate = isToday
                ? `${reviewDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}, Today`
                : reviewDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

              return (
                <div key={index} className="pb-6 border-b-2 border-blue-800 last:border-none">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-lg font-bold text-gray-900 underline mr-2">
                        {review.profiles?.username || "deleted user"}
                      </p>
                      <p className="text-base font-bold text-[#133e5f]">
                        Rating: {review.stars || "N/A"} / 5
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {review.comment || "No comment provided."}
                  </p>
                  <p className="text-xs text-gray-500 italic">Posted: {formattedDate}</p>
                </div>
              );
            })
          ) : (
            <div className="text-center bg-gray-50 py-16 px-8 rounded-lg shadow-lg border border-gray-200">
              <div className="flex flex-col items-center space-y-6">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
                  No Reviews Yet
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
                  Be the first to share your experience!
                </p>
                <button
                  onClick={handleWriteReviewClick}
                  className="bg-gray-900 hover:bg-gray-600 text-white py-3 px-8 rounded-full shadow-md transition-transform transform hover:scale-105"
                >
                  Write a Review
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
