import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fetchPromotions, deletePromotion } from '../services/promotionApi';
import { Promotion } from '../types/promotion.types';

const ProviderPromotions = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const providerId = user?._id || '';
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterTitle, setFilterTitle] = useState<string>('');

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider' || !providerId) {
      console.log('Auth state:', { token, user, providerId });
      setError('Tài khoản không hợp lệ.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    const loadPromotions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPromotions(providerId, token, filterTitle);
        console.log('Promotions:', data);
        setPromotions(data);
        if (data.length === 0 && !filterTitle) {
          setError('Chưa có khuyến mãi nào.');
        }
      } catch (err: any) {
        console.error('Lỗi khi tải khuyến mãi:', err);
        setError(err.message || 'Không thể tải danh sách khuyến mãi.');
        if (err.message.includes('Phiên đăng nhập')) {
          setTimeout(() => navigate('/provider/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    loadPromotions();
  }, [filterTitle, token, user, providerId, navigate]);

  const handleDeletePromotion = async (id: string) => {
    if (!token) {
      setError('Phiên đăng nhập hết hạn.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await deletePromotion(token, id);
      setSuccess('Xóa khuyến mãi thành công.');
      const data = await fetchPromotions(providerId, token, filterTitle);
      console.log('Promotions sau khi xóa:', data);
      setPromotions(data);
    } catch (err: any) {
      console.error('Lỗi khi xóa khuyến mãi:', err);
      setError(err.message || 'Không thể xóa khuyến mãi.');
      if (err.message.includes('Phiên đăng nhập')) {
        setTimeout(() => navigate('/provider/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý khuyến mãi</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Danh sách khuyến mãi</h3>
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="filterTitle">Tìm kiếm theo tiêu đề</Label>
              <Input
                id="filterTitle"
                value={filterTitle}
                onChange={(e) => setFilterTitle(e.target.value)}
                placeholder="Nhập tiêu đề khuyến mãi"
                className="w-64"
              />
            </div>
            <Button onClick={() => navigate('/provider/promotions/create')} disabled={loading}>
              Thêm khuyến mãi
            </Button>
          </div>
        </div>
        {loading ? (
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        ) : promotions.length === 0 ? (
          <p className="text-gray-600">Chưa có khuyến mãi nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2 text-left">Tiêu đề</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Mô tả</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Giảm giá (%)</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Giảm giá (VNĐ)</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Số lượng</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Bắt đầu</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Kết thúc</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">{promotion.title}</td>
                    <td className="border border-gray-200 px-4 py-2">{promotion.description}</td>
                    <td className="border border-gray-200 px-4 py-2">{promotion.discountPercent}</td>
                    <td className="border border-gray-200 px-4 py-2">{promotion.discountAmount.toLocaleString('vi-VN')}</td>
                    <td className="border border-gray-200 px-4 py-2">{promotion.quantity}</td>
                    <td className="border border-gray-200 px-4 py-2">{new Date(promotion.startDate).toLocaleString()}</td>
                    <td className="border border-gray-200 px-4 py-2">{new Date(promotion.endDate).toLocaleString()}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/provider/promotions/edit/${promotion.id}`)}
                        className="mr-2"
                        disabled={loading}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeletePromotion(promotion.id)}
                        disabled={loading}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderPromotions;