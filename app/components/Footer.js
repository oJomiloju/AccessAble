'use client'; // Required for using React hooks in Next.js App Router

const Footer = () => {
    return (
      <footer className="bg-[#bcd2e3] text-gray-900 py-6">
        <div className="container mx-auto px-4 text-center">
          {/* Brand Name */}
          <p className="text-lg font-bold mb-4">AccessAble</p>
  
          {/* Links */}
          <div className="flex justify-center space-x-6 mb-4">
            <a href="/" className="hover:underline">
              Home
            </a>
            <a href="/about" className="hover:underline">
              About
            </a>
            <a href="/contact" className="hover:underline">
              Contact
            </a>
          </div>
  
          {/* Copyright */}
          <p className="text-sm text-gray-900">
            © {new Date().getFullYear()} AccessAble. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  