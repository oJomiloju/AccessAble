const Contact = () => {
    return (
      <section className="bg-[#FAFAFA] text-gray-800">
        {/* Hero Section */}
        <div className="bg-[#bcd2e3] py-16 text-center">
          <h1 className="text-4xl font-bold mb-4 mt-5">Contact Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? We're here to help. Reach out to us anytime, and we'll get back to you as soon as possible.
          </p>
        </div>
  
        {/* Contact Form Section */}
        <div className="container mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
          <form className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
            <div className="mb-6">
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows="5"
                placeholder="Write your message here"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-200"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-[#007BFF] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
  
        {/* Contact Details Section */}
        <div className="bg-[#f0f8ff] py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Contact Details</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              Whether you prefer email, phone, or social media, you can reach us in multiple ways. We're excited to hear from you!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold mb-2">Email Us</h4>
                <p>contact@accessable.com</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold mb-2">Call Us</h4>
                <p>+1 (800) 123-4567</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold mb-2">Follow Us</h4>
                <p>
                  <a href="#" className="hover:underline text-blue-600">
                    Twitter
                  </a>{" "}
                  |{" "}
                  <a href="#" className="hover:underline text-blue-600">
                    Instagram
                  </a>{" "}
                  |{" "}
                  <a href="#" className="hover:underline text-blue-600">
                    Facebook
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Contact;
  