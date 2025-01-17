"use client"; // Required for React hooks in Next.js App Router

import { useState, useEffect } from "react";
import supabase from "@/app/lib/supabaseClient";

const SchoolSearch = () => {
  const [school, setSchool] = useState(""); // Input field value
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [placeholder, setPlaceholder] = useState("Search your campus or university"); // Placeholder text

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth <= 640) {
        setPlaceholder("   Search your campus");
      } else {
        setPlaceholder("Search your campus or university");
      }
    };

    // Set the initial placeholder
    updatePlaceholder();

    // Update the placeholder on window resize
    window.addEventListener("resize", updatePlaceholder);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

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
    window.location.href = `/schools/${encodeURIComponent(selectedSchool.name)}`;
  };

  return (
    <div
      className="text-gray-800 py-20 font-serif bg-cover bg-center bg-no-repeat h-screen sm:bg-contain sm:bg-center"
      style={{
        backgroundImage: `url('/images/BGimage.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <div className="flex flex-col container mx-auto px-4 text-center pt-16 h-[90vh]">
        {/* Heading */}
        <h2 className="text-5xl font-sans font-semibold mb-6 mt-30 text-[#083d77] ">
          Accessibility, your way.
        </h2>
        <h2 className="text-center text-lg text-[#083d77]">
          Share your experience and help others learn more about a school's accessibility.
          <br /> Your review could make a big difference!
        </h2>

        <h2 className="text-center text-lg text-[#083d77] mt-20">
          Rate your campus, Read reviews, Contribute to change.
        </h2>

        {/* Search Box */}
        <div className="relative max-w-lg w-full mx-auto h-48">
          <div className="relative">
            {/* Input Field */}
            <input
              type="text"
              placeholder={placeholder}
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full pl-16 py-4 border border-[#083d77] rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder:text-[#88a0b7] placeholder:font-serif placeholder:text-2xl"
              onFocus={() => setShowDropdown(true)} // Show dropdown on focus
            />


            



            {/* SVG Icon */}
            <div className="absolute inset-y-0 left-4 flex items-center text-[#083d77]">
              <svg
                height="24"
                viewBox="0 0 512 512"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-600"
              >
                <polygon
                  points="32 192 256 64 480 192 256 320 32 192"
                  style={{
                    fill: "none",
                    stroke: "#000",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "32px",
                  }}
                />
                <polyline
                  points="112 240 112 368 256 448 400 368 400 240"
                  style={{
                    fill: "none",
                    stroke: "#000",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "32px",
                  }}
                />
                <line
                  x1="480"
                  x2="480"
                  y1="368"
                  y2="192"
                  style={{
                    fill: "none",
                    stroke: "#000",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "32px",
                  }}
                />
                <line
                  x1="256"
                  x2="256"
                  y1="320"
                  y2="448"
                  style={{
                    fill: "none",
                    stroke: "#000",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: "32px",
                  }}
                />
              </svg>
            </div>
          </div>

          {/* Dropdown */}
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

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute top-0 right-0 mt-3 mr-6 text-gray-500">
              Searching...
            </div>
          )}

          {/* No Results */}
          {!loading && searchResults.length === 0 && school.trim() !== "" && (
            <div className="absolute w-full bg-white shadow-md rounded-lg mt-2 z-50">
              <p className="px-4 py-2 text-left text-gray-600">No results found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolSearch;