import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ProviderSidebar: React.FC = () => {
  const location = useLocation();
  const navItems = [
    { label: 'Dịch vụ', path: '/provider/services' },
    { label: 'Tạo dịch vụ', path: '/provider/service/create' },
    { label: 'Quản lý thông tin', path: '/provider/manage' },
  ];

  return (
    <aside className="w-64 h-full bg-white shadow-lg p-6">
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm font-medium ${
              location.pathname === item.path ? 'text-blue-600' : 'text-gray-700'
            } hover:text-blue-500 transition`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default ProviderSidebar;