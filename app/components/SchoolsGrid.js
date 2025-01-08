'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../lib/supabaseClient';

const SkeletonCard = () => (
  <div className="bg-gray-300 animate-pulse rounded-3xl shadow-md overflow-hidden">
    <div className="w-full h-48 bg-gray-400"></div>
    <div className="p-4 space-y-2">
      <div className="h-6 bg-gray-400 rounded"></div>
      <div className="h-4 bg-gray-400 rounded w-1/2"></div>
      <div className="h-4 bg-gray-400 rounded w-3/4"></div>
    </div>
  </div>
);

const SchoolsGrid = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      const { data, error } = await supabase
        .from('universities') // Table name
        .select('*'); // Fetch all columns

      if (error) {
        console.error('Error fetching universities:', error);
      } else {
        setSchools(data || []);
      }
      setLoading(false);
    };

    fetchSchools();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#FAFAFA] py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FAFAFA] py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <Link
              key={school.id}
              href={`/schools/${encodeURIComponent(school.name)}`}
            >
              <div className="bg-[#004087] rounded-3xl shadow-md overflow-hidden cursor-pointer">
                <div className="rounded-t-3xl overflow-hidden">
                  <img
                    loading="lazy"
                    src={school.image_url} // Use the image_url field from your database
                    alt={school.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-sans font-bold text-[#ffedd6] truncate">
                    {school.name}
                  </h3>
                  <p className="text-sm text-[#ffedd6]">
                    {school.total_reviews || 0} reviews
                  </p>
                  <p className="text-sm text-[#ffedd6] flex items-center mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-[#ffedd6]"
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SchoolsGrid;
