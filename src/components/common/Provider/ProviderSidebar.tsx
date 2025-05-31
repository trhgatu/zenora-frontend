import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ProviderSidebar: React.FC = () => {
  const location = useLocation();
  const [isPromotionMenuOpen, setIsPromotionMenuOpen] = useState<boolean>(false);

  const navItems = [
    { label: 'Dịch vụ', path: '/provider/services' },
    {
      label: 'Quản lý khuyến mãi',
      subItems: [
        { label: 'Quản lý Promotion', path: '/provider/promotions' },
        { label: 'Quản lý Flash Sale', path: '/provider/flashsales' },
      ],
    },
    { label: 'Quản lý thông tin thợ', path: '/provider/staff' },
    { label: 'Quản lý hình ảnh', path: '/provider/images' },
    { label: 'Quản lý giờ làm việc', path: '/provider/working-hours' },
    { label: 'Quản lý cơ sở', path: '/provider/spa-location' },
    { label: 'Tin nhắn', path: '/provider/messages' },
  ];

  return (
    <aside className="w-64 h-full bg-white shadow-lg p-6">
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => setIsPromotionMenuOpen(!isPromotionMenuOpen)}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-500 transition w-full"
                >
                  {item.label}
                  {isPromotionMenuOpen ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )}
                </button>
                {isPromotionMenuOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block text-sm font-medium ${
                          location.pathname === subItem.path ? 'text-blue-600' : 'text-gray-700'
                        } hover:text-blue-500 transition`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path!}
                className={`text-sm font-medium ${
                  location.pathname === item.path ? 'text-blue-600' : 'text-gray-700'
                } hover:text-blue-500 transition`}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default ProviderSidebar;