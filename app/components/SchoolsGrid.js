'use client'; // Required for using React hooks in Next.js App Router

const SchoolsGrid = () => {
  // Placeholder data for schools
  const schools = [
    { name: 'University of Texas', reviews: 11, location: 'Dallas, TX' },
    { name: 'Southern Methodist University', reviews: 8, location: 'Dallas, TX' },
    { name: 'Dallas College', reviews: 5, location: 'Dallas, TX' },
    { name: 'Texas Woman\'s University', reviews: 4, location: 'Dallas, TX' },
    { name: 'University of North Texas', reviews: 7, location: 'Denton, TX' },
    { name: 'Hardin-Simmons University', reviews: 3, location: 'Abilene, TX' },
    { name: 'Texas Christian University', reviews: 9, location: 'Fort Worth, TX' },
    { name: 'Jarvis Christian College', reviews: 2, location: 'Hawkins, TX' },
    { name: 'Prairie View A&M University', reviews: 6, location: 'Prairie View, TX' },
    { name: 'Texas A&M University', reviews: 12, location: 'College Station, TX' },
    { name: 'Baylor University', reviews: 10, location: 'Waco, TX' },
  ];

  return (
    <section className="bg-[#FAFAFA] py-10">
      <div className="container mx-auto px-4">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school, index) => (
            <div
              key={index}
              className="bg-[#c2c295] rounded-lg shadow-md overflow-hidden"
            >
              {/* Image */}
              <img
                src="https://images.shiksha.com/mediadata/images/1651754674phpGZbT0Q.jpeg"
                alt={school.name}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800 truncate">
                  {school.name}
                </h3>

                {/* Reviews */}
                <p className="text-sm text-gray-700">{school.reviews} reviews</p>

                {/* Location */}
                <p className="text-sm text-gray-700 flex items-center mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 2c3.866 0 7 3.134 7 7 0 5.25-7 13-7 13s-7-7.75-7-13c0-3.866 3.134-7 7-7z"
                    />
                    <circle cx="12" cy="9" r="2" />
                  </svg>
                  {school.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolsGrid;

