const About = () => {
  return (
    <section className="bg-[#FAFAFA] text-gray-800">
      {/* Hero Section */}
      <div className="bg-[#bcd2e3] py-16 text-center ">
        <h1 className="text-4xl font-bold mb-4 mt-5">About Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          At AccessAble, we empower students and visitors to navigate college campuses with ease by 
          providing ratings, resources, and insights into campus accessibility.
        </p>
      </div>

      {/* Image and Intro Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mt-12 text-center">
          Your Partner in Campus Accessibility
        </h2>
        <p className="text-lg text-center max-w-4xl mx-auto mt-4 text-gray-600">
          AccessAble ensures you have the information needed to make informed decisions about 
          accessibility at your college or university. From ramps to elevators, restrooms to 
          pathways, we evaluate it all.
        </p>
      </div>

      {/* Impact and Goals Section */}
    <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Left: Image */}
      <div>
        <img
          src="/images/access.webp"
          alt="Accessible campus pathways"
          className="rounded-lg shadow-md"
        />
        <p className="text-center mt-4 font-bold">
          AccessAble evaluates campus accessibility features to empower everyone.
        </p>
      </div>

      {/* Right: Content */}
      <div>
        <h3 className="text-3xl font-bold mb-4">Transforming Campus Accessibility</h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          At AccessAble, we are building a platform that provides detailed, reliable information
          about accessibility features on college campuses. From wheelchair-friendly pathways to
          accessible restrooms and elevators, we evaluate and highlight facilities that make a 
          difference.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed mt-4">
          By enabling students, faculty, and visitors to review and share accessibility insights, 
          AccessAble aims to create an inclusive environment for everyone, whether you're attending 
          a lecture, exploring the library, or enjoying campus life.
        </p>
        <blockquote className="mt-4 bg-[#bcd2e3] p-4 rounded-lg shadow-md">
          "Every student deserves a campus that supports their mobility and independence."
        </blockquote>
      </div>
    </div>


      {/* Why Choose Us Section */}
      <div className=" py-16">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Why Use AccessAble?</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            We simplify the process of understanding campus accessibility, so you can focus on 
            thriving in your academic environment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#bcd2e3] p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold mb-2">Comprehensive Ratings</h4>
              <p>
                Detailed evaluations of ramps, elevators, restrooms, parking, and more, so you know 
                what to expect.
              </p>
            </div>
            <div className="bg-[#bcd2e3] p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold mb-2">Community Feedback</h4>
              <p>
                Real insights from students, staff, and visitors to help create accurate accessibility 
                ratings.
              </p>
            </div>
            <div className="bg-[#bcd2e3] p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-bold mb-2">Accessibility Advocacy</h4>
              <p>
                Promoting awareness and improvements to ensure every campus is designed for inclusivity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet Our Team Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <p className="text-lg text-center max-w-4xl mx-auto mb-12 text-gray-600">
          Behind AccessAble is a dedicated team passionate about making accessibility a priority on 
          campuses nationwide.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Jomi Okuwobi', role: '', img: 'https://via.placeholder.com/150' },
            { name: 'Mo Olagbami', role: '', img: 'https://via.placeholder.com/150' },
            { name: 'Jordan Smith-Acquah', role: '', img: 'https://via.placeholder.com/150' },
            { name: 'Josephine Anokye', role: '', img: 'https://via.placeholder.com/150' },
          ].map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
            >
              <img
                src={member.img}
                alt={member.name}
                className="rounded-full mb-4 w-36 h-36"
              />
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;


