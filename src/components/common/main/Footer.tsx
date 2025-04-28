// src/components/common/Footer.tsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="text-3xl font-bold text-white">
              Zenora
            </Link>
            <p className="mt-2 text-sm text-gray-400">The best place for relaxation.</p>
          </div>

          {/* Navigation Links */}
          <div>
            <h5 className="font-bold text-lg text-white mb-4">Quick Links</h5>
            <ul>
              <li>
                <Link to="/" className="hover:text-green-400 transition-colors text-gray-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-green-400 transition-colors text-gray-400">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-green-400 transition-colors text-gray-400">
                  Facilities
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-green-400 transition-colors text-gray-400">
                  Promotions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="font-bold text-lg text-white mb-4">Contact Us</h5>
            <p className="text-gray-400">Email: support@zenora.com</p>
            <p className="text-gray-400">Phone: +123-456-7890</p>
          </div>

          {/* Social Media Links */}
          <div>
            <h5 className="font-bold text-lg text-white mb-4">Follow Us</h5>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-400">
          &copy; 2025 Zenora. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
