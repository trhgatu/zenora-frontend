import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { fetchPromotions, updatePromotion } from '../services/promotionApi';
import { ServiceFormData, Promotion } from '../types/promotion.types';

const EditPromotionPage = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const providerId = user?._id || '';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    discountPercent: '',
    discountAmount: '',
    quantity: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider' || !providerId || !id) {
      console.log('Auth state:', { token, user, providerId });
      setError('Tài khoản không hợp lệ hoặc không tìm thấy khuyến mãi.');
      setTimeout(() => navigate('/provider/login'), 2000);
      setLoading(false);
      return;
    }

    const loadPromotion = async () => {
      try {
        setLoading(true);
        setError(null);
        const promotions = await fetchPromotions(providerId, token);
        console.log('Promotions:', promotions);
        const promotion = promotions.find((p: Promotion) => p.id === id);
        if (!promotion) {
          setError('Khuyến mãi không tồn tại.');
          setTimeout(() => navigate('/provider/promotions'), 2000);
          return;
        }
        setFormData({
          title: promotion.title,
          description: promotion.description,
          discountPercent: promotion.discountPercent.toString(),
          discountAmount: promotion.discountAmount.toString(),
          quantity: promotion.quantity.toString(),
          startDate: promotion.startDate.slice(0, 16),
          endDate: promotion.endDate.slice(0, 16),
        });
      } catch (err: any) {
        console.error('Lỗi khi tải khuyến mãi:', err);
        setError(err.message || 'Không thể tải dữ liệu khuyến mãi.');
        if (err.message.includes('Phiên đăng nhập')) {
          setTimeout(() => navigate('/provider/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    loadPromotion();
  }, [token, user, providerId, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Phiên đăng nhập hết hạn.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }
    if (!formData.title || !formData.description || !formData.quantity || !formData.startDate || !formData.endDate) {
      setError('Vui lòng nhập đầy đủ thông tin khuyến mãi.');
      return;
    }

    const discountPercent = parseFloat(formData.discountPercent) || 0;
    const discountAmount = parseFloat(formData.discountAmount) || 0;
    const quantity = parseInt(formData.quantity, 10);

    if (discountPercent === 0 && discountAmount === 0) {
      setError('Phải nhập ít nhất một loại mức giảm giá (% hoặc số tiền).');
      return;
    }
    if (discountPercent < 0 || discountAmount < 0 || isNaN(quantity) || quantity <= 0) {
      setError('Giá trị giảm giá và số lượng phải hợp lệ.');
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const currentDate = new Date();

    if (startDate < currentDate) {
      setError('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại.');
      return;
    }
    if (endDate <= startDate) {
      setError('Ngày kết thúc phải lớn hơn ngày bắt đầu.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const payload = {
        id: id!,
        title: formData.title.trim(),
        description: formData.description.trim(),
        discountPercent,
        discountAmount,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        providerId,
      };
      console.log('Payload cập nhật khuyến mãi:', payload);
      await updatePromotion(token, payload);
      setSuccess('Cập nhật khuyến mãi thành công.');
      setTimeout(() => navigate('/provider/promotions'), 1000);
    } catch (err: any) {
      console.error('Lỗi khi cập nhật khuyến mãi:', err);
      setError(err.message || 'Không thể cập nhật khuyến mãi.');
      if (err.message.includes('Phiên đăng nhập')) {
        setTimeout(() => navigate('/provider/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa khuyến mãi</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        {loading ? (
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề khuyến mãi"
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả khuyến mãi"
              />
            </div>
            <div>
              <Label htmlFor="discountPercent">Mức giảm giá (%)</Label>
              <Input
                id="discountPercent"
                type="number"
                value={formData.discountPercent}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, discountPercent: value, discountAmount: value ? '0' : formData.discountAmount });
                }}
                placeholder="Nhập mức giảm giá (%)"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="discountAmount">Mức giảm giá (VNĐ)</Label>
              <Input
                id="discountAmount"
                type="number"
                value={formData.discountAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, discountAmount: value, discountPercent: value ? '0' : formData.discountPercent });
                }}
                placeholder="Nhập mức giảm giá (VNĐ)"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Nhập số lượng"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>Cập nhật khuyến mãi</Button>
              <Button type="button" variant="outline" onClick={() => navigate('/provider/promotions')}>
                Hủy
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPromotionPage;