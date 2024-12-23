// app/layout.js
import './globals.css'; // Import global styles
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'My Website',
  description: 'A simple Next.js app with a Navbar and Footer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> 
        <main>{children}</main> 
        <Footer /> 
      </body>
    </html>
  );
}
