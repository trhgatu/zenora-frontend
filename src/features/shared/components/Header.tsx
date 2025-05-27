import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaHeart, FaBell, FaBookmark } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
  const location = useLocation();
  const navigate = useNavigate();

  // Chuẩn hóa pathname
  const currentPath = (location.pathname || '/').replace(/\/+$/, '').toLowerCase();

  // Theo dõi sự thay đổi của localStorage bằng custom event
  useEffect(() => {
    // Kiểm tra trạng thái ban đầu
    setIsLoggedIn(!!localStorage.getItem('accessToken'));

    // Lắng nghe sự kiện custom để phát hiện thay đổi của accessToken
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // Debug: Log để kiểm tra giá trị pathname và trạng thái đăng nhập
  useEffect(() => {
    console.log('Current pathname:', currentPath);
    console.log('Is logged in:', isLoggedIn);
  }, [currentPath, isLoggedIn]);

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Danh mục', path: '/categories' },
    { name: 'Khuyến mãi', path: '/promotion' },
    { name: 'Giới thiệu', path: '/about' },
  ];

  const getActivePath = () => {
    const matchedItem = navItems.find(item => item.path.toLowerCase() === currentPath);
    return matchedItem ? matchedItem.path : '/';
  };

  const activePath = getActivePath();

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Xóa accessToken khi đăng xuất
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    setIsUserMenuOpen(false); // Đóng dropdown menu ngay lập tức
    setIsMenuOpen(false); // Đóng menu mobile nếu đang mở
    window.dispatchEvent(new Event('authChange')); // Kích hoạt sự kiện custom
    navigate('/login'); // Điều hướng về trang đăng nhập
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">ZENORA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activePath === item.path
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white">
                    <FaUser />
                  </div>
                </button>
              </div>

              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {isLoggedIn ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Tài khoản của tôi
                      </Link>
                      <Link to="/bookmarks" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaBookmark className="mr-2" /> Đã lưu
                      </Link>
                      <Link to="/favorites" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaHeart className="mr-2" /> Yêu thích
                      </Link>
                      <Link to="/notifications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <FaBell className="mr-2" /> Thông báo
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Đăng nhập
                      </Link>
                      <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  activePath === item.path
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white">
                  <FaUser />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{isLoggedIn ? 'Người dùng' : 'Khách'}</div>
                {isLoggedIn && <div className="text-sm font-medium text-gray-500">user@example.com</div>}
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Tài khoản của tôi
                  </Link>
                  <Link to="/bookmarks" className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    <FaBookmark className="mr-2" /> Đã lưu
                  </Link>
                  <Link to="/favorites" className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    <FaHeart className="mr-2" /> Yêu thích
                  </Link>
                  <Link to="/notifications" className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    <FaBell className="mr-2" /> Thông báo
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;