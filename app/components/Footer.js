'use client'; // Required for using React hooks in Next.js App Router
import logo from "@/public/images/AccessAble_1.png";
import Image from 'next/image'; // Import the Next.js Image component

const Footer = () => {
  return (
    <footer className="bg-[#bcd2e3] text-gray-900" >
      <div className="flex flex-col justify-center items-center text-center">
        {/* Brand Name Image */}
        <div className="flex bg-transparent bg-contain  w-40 h-20 justify-center items-center"
        >
         
          <Image
            src={logo} // Use the imported image
            alt="AccessAble Logo"
            width={150} // Set a fixed width
            height={50} // Height will adjust based on aspect ratio
          
            priority // Optimize loading
          

          />
        </div>

        {/* Links */}
        <div className="flex justify-center space-x-6 mb-6">
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
        <p className="text-sm text-[#004087] font-semibold mb-2">
          © {new Date().getFullYear()} AccessAble. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;