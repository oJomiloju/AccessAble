import './globals.css'; // Import global styles
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'ACCESSABLE',
  description: 'A simple Next.js app with a Navbar and Footer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          // Apply Tailwind classes for customization
          className: 'bg-[#004087] text-black border border-gray-800  shadow-md',
          duration: 4000, // Default duration for toasts
        }}
        />
        <Navbar />
        <main className="flex-1">{children}</main> {/* Main takes available space */}
        <Footer />
      </body>
    </html>
  );
}
