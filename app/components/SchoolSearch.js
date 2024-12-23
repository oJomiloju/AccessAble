'use client'; // Required for React hooks in Next.js App Router

import { useState } from 'react';

const SchoolSearch = () => {
  const [school, setSchool] = useState('');

  const handleSearch = () => {
    if (school) {
      console.log(`Searching for school: ${school}`);
    } else {
      alert('Please enter a school name');
    }
  };

  return (
    <section className="bg-[#c2c295] text-gray-800 py-20 font-serif">
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-5xl font-bold mb-6">Enter your school to get started</h2>

        {/* Search Box */}
        <div className="flex justify-center items-center space-x-4 max-w-lg mx-auto">
          <div className="relative w-full">
            {/* Input Field */}
            <input
              type="text"
              placeholder="Your school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-12 py-3 border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-600 placeholder:font-serif"
            />
            {/* SVG Icon */}
            <div className="absolute inset-y-0 left-4 flex items-center text-gray-600">
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
                    fill: 'none',
                    stroke: '#000',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '32px',
                  }}
                />
                <polyline
                  points="112 240 112 368 256 448 400 368 400 240"
                  style={{
                    fill: 'none',
                    stroke: '#000',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '32px',
                  }}
                />
                <line
                  x1="480"
                  x2="480"
                  y1="368"
                  y2="192"
                  style={{
                    fill: 'none',
                    stroke: '#000',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '32px',
                  }}
                />
                <line
                  x1="256"
                  x2="256"
                  y1="320"
                  y2="448"
                  style={{
                    fill: 'none',
                    stroke: '#000',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '32px',
                  }}
                />
              </svg>
            </div>
          </div>
          {/* Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition duration-300 font-bold"
          >
            Search
          </button>
        </div>

        
      </div>
    </section>
  );
};

export default SchoolSearch;
