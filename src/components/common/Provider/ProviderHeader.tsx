import React from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { logout } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ROUTERS from '@/constants/router';

const ProviderHeader: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTERS.PROVIDER.auth.login, { replace: true });
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Trang quản lý cơ sở</h1>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500">Xin chào, {user?.name || 'Provider'}</div>
        <Button variant="outline" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </div>
    </header>
  );
};

export default ProviderHeader;