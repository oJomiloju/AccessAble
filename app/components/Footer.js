'use client'; // Required for using React hooks in Next.js App Router
import logo from "@/public/images/AccessAble_1.png";
import Image from 'next/image'; // Import the Next.js Image component

const Footer = () => {
  return (
    <footer className="bg-[#FAFAFA] text-gray-900 py-6">
      <div className="container mx-auto px-4 text-center">
        {/* Brand Name Image */}
        <div className="flex justify-center mb-4">
          <Image
            src={logo} // Use the imported image
            alt="AccessAble Logo"
            width={150} // Set a fixed width
            height={80} // Height will adjust based on aspect ratio
            priority // Optimize loading
          />
        </div>

        {/* Links */}
        <div className="flex justify-center space-x-6 mb-4">
          <a href="/" className="hover:underline text-[#004087] font-semibold">
            Home
          </a>
          <a href="/about" className="hover:underline text-[#004087] font-semibold">
            About
          </a>
          <a href="/contact" className="hover:underline text-[#004087] font-semibold">
            Contact
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-[#004087] font-semibold mt-4">
          © {new Date().getFullYear()} AccessAble. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
