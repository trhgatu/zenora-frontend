import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      {/* Decorative Wave SVG */}
      <div className="text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 140" className="w-full">
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,74.7C672,96,768,128,864,128C960,128,1056,96,1152,80C1248,64,1344,64,1392,64L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">ZENORA</h3>
            <p className="text-gray-300 mb-4">
              Nền tảng đặt lịch và đánh giá dịch vụ làm đẹp, chăm sóc sức khỏe hàng đầu Việt Nam.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://youtube.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">Về chúng tôi</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">Dịch vụ</Link>
              </li>
              <li>
                <Link to="/promotion" className="text-gray-300 hover:text-white transition-colors">Khuyến mãi</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/career" className="text-gray-300 hover:text-white transition-colors">Tuyển dụng</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Danh mục dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/spa-massage" className="text-gray-300 hover:text-white transition-colors">Spa & Massage</Link>
              </li>
              <li>
                <Link to="/categories/beauty" className="text-gray-300 hover:text-white transition-colors">Làm Đẹp</Link>
              </li>
              <li>
                <Link to="/categories/hair-nail" className="text-gray-300 hover:text-white transition-colors">Tóc & Nail</Link>
              </li>
              <li>
                <Link to="/categories/gym-fitness" className="text-gray-300 hover:text-white transition-colors">Gym & Fitness</Link>
              </li>
              <li>
                <Link to="/categories/dental" className="text-gray-300 hover:text-white transition-colors">Nha Khoa</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-blue-400" />
                <span className="text-gray-300">123 Nguyễn Văn Linh, Quận 7, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3 text-blue-400" />
                <span className="text-gray-300">0123 456 789</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-blue-400" />
                <span className="text-gray-300">support@zenora.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 Zenora. Tất cả quyền được bảo lưu.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm">
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Điều khoản sử dụng</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;