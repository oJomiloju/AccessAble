"use client";

import React, { useState, useEffect } from "react";

const schools = [
  { name: 'University of Texas at Arlington', reviews: 11, location: 'Arlington, TX', image: '/uni_images/uta_picture.jpg' },
  { name: 'University of Texas at Dallas', reviews: 11, location: 'Richardson, TX', image: '/uni_images/utd.jpg' },
  { name: 'University of North Texas', reviews: 8, location: 'Denton, TX', image: '/uni_images/unt.jpg' },
  { name: 'University of Texas at Austin', reviews: 5, location: 'Austin, TX', image: '/uni_images/utaustin.jpg' },
  { name: 'Texas Woman\'s University', reviews: 4, location: 'Denton, TX', image: '/uni_images/texasWomens.jpg' },
  { name: 'Texas Christian University', reviews: 7, location: 'Fort Worth, TX', image: '/uni_images/tcu.jpg' },
  { name: 'Baylor University', reviews: 3, location: 'Waco, TX', image: '/uni_images/baylor.jpg' },
  { name: 'Dallas Baptist University', reviews: 9, location: 'Dallas, TX', image: '/uni_images/dbu.jpg' },
  { name: 'Tarrant County College - Southeast Campus', reviews: 2, location: 'Arlington, TX', image: '/uni_images/tccsoutheast.jpg' },
  { name: 'Tarrant County College - Trinity River', reviews: 6, location: 'Fort Worth, TX', image: '/uni_images/tccTR.jpg' },
];

const reviews = [
  {
    name: "Euphegenia Doubtfire",
    stars: 3,
    comment: "The recreation center is great, but the dining hall needs more options.",
    date: "Posted 8 months ago",
    breakdown: { recreation: 4, dining: 2, main: 3 },
  },
  {
    name: "Luisa",
    stars: 2.7,
    comment: "The main area accessibility is excellent, but parking is far.",
    date: "Posted 8 months ago",
    breakdown: { recreation: 4, dining: 2, main: 4 },
  },
];

const stats = {
  visitors: 5,
  freshmen: 15,
  sophomores: 10,
  juniors: 7,
  seniors: 4,
};

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

  useEffect(() => {
    async function fetchParams() {
      const resolvedParams = await params;
      const schoolName = resolvedParams.schoolName;
      const matchedSchool = schools.find((s) => s.name === decodeURIComponent(schoolName));
      setSchool(matchedSchool || null);
    }

    fetchParams();
  }, [params]);

  if (!school) return <div>Loading...</div>;

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative mb-8">
        <div
          className="w-full h-64 bg-center bg-cover "
          style={{
            backgroundImage: `url(${school.image})`,
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
            <Star filled={true} />
            <span className="text-4xl font-bold text-gray-800">2.9</span>
          </div>

          {/* Rating Breakdown */}
          <h3 className="text-lg font-bold mb-4">Rating Breakdown</h3>
          {["Recreation Center", "Dining Hall", "Main Area"].map((category, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="w-40 text-gray-600">{category}</span>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} filled={starIndex < 3} />
                ))}
              </div>
            </div>
          ))}

          {/* Student Stats Section */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Student Stats</h3>
            {Object.keys(stats).map((key, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="w-24 text-gray-700 capitalize">{key}</span>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${stats[key] * 5}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-gray-700">{stats[key]}</span>
              </div>
            ))}
          </div>

          {/* Write Review Button */}
          <div className="mt-6 flex justify-start">
            <button className="bg-gray-900 text-white py-2 px-6 rounded-full shadow-md hover:bg-gray-600 transition">
              Write Review
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="lg:w-2/3 space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-800 pt-3">Browse {reviews.length} Reviews</h2>
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
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            filled={starIndex < review.breakdown[category.toLowerCase().replace(" ", "")]}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
