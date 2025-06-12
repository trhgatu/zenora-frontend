import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { logout } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ROUTERS from '@/constants/router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axiosInstance from '@/services/axios';

const ProviderHeader: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTERS.PROVIDER.auth.login, { replace: true });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/api/Auth/change-password', {
        currentPassword,
        newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      setIsDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      toast.error('Lỗi khi đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.');
      console.error('Change password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Trang quản lý cơ sở</h1>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-500">Xin chào, {user?.name || 'Provider'}</div>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Đổi mật khẩu
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default ProviderHeader;