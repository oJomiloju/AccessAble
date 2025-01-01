import './globals.css'; // Import global styles
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'ACCESSABLE',
  description: 'A simple Next.js app with a Navbar and Footer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main> {/* Main takes available space */}
        <Footer />
      </body>
    </html>
  );
}
