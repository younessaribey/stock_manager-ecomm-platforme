import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../contexts/SiteContext';
import Navbar from '../components/Navbar';

const PublicLayout = ({ children }) => {
  const { siteName } = useSite();

  useEffect(() => {
    if (siteName) document.title = siteName;
  }, [siteName]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Brothers Phone</h3>
              <p className="text-gray-300">
                Your trusted destination for smartphones, tablets, and accessories. Quality devices at unbeatable prices.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-gray-300 hover:text-white">Shipping Policy</Link>
                </li>
                <li>
                  <Link to="/returns" className="text-gray-300 hover:text-white">Returns & Refunds</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <address className="text-gray-300 not-italic">
                <p>📍 4 Convenient Locations</p>
                <p>📧 info@brothersphone.com</p>
                <p>📞 (555) 123-4567</p>
                <p>⏰ Mon-Sat: 9AM - 8PM</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} Brothers Phone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
