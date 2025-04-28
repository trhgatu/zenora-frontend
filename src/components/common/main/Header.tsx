// src/components/common/Header.tsx
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-white">
          Zenora
        </Link>

        {/* Navigation Menu */}
        <nav>
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="hover:text-green-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-green-400 transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link to="/facilities" className="hover:text-green-400 transition-colors">
                Facilities
              </Link>
            </li>
            <li>
              <Link to="/promotions" className="hover:text-green-400 transition-colors">
                Promotions
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-green-400 transition-colors">
                Book Now
              </Link>
            </li>
          </ul>
        </nav>

        {/* Call to Action (Optional, eg. Login/Register) */}
        <div>
          <Link
            to="/login"
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
