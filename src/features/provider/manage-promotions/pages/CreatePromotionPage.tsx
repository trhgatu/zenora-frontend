import { useState } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createPromotion } from '../services/promotionApi';
import { ServiceFormData } from '../types/promotion.types';

const CreatePromotionPage = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const providerId = user?._id || '';
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    discountPercent: '',
    discountAmount: '',
    quantity: '',
    startDate: '',
    endDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user || user.role !== 'Provider' || !providerId) {
      setError('Tài khoản không hợp lệ.');
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

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.');
      return;
    }
    if (startDate < currentDate) {
      setError('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại (06:39 PM +07, Tuesday, June 03, 2025).');
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
        title: formData.title.trim(),
        description: formData.description.trim(),
        discountPercent,
        discountAmount,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        providerId,
      };
      console.log('Payload tạo khuyến mãi:', payload);
      const response = await createPromotion(token, payload);
      console.log('Phản hồi API:', response);
      setSuccess('Thêm khuyến mãi thành công.');
      setFormData({
        title: '',
        description: '',
        discountPercent: '',
        discountAmount: '',
        quantity: '',
        startDate: '',
        endDate: '',
      });
      setTimeout(() => navigate('/provider/promotions'), 1000);
    } catch (err: any) {
      console.error('Lỗi khi tạo khuyến mãi:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      let errorMessage = err.response?.data?.message || err.message || 'Không thể thêm khuyến mãi.';
      if (err.response?.status === 400) {
        errorMessage = err.response.data.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Dữ liệu không hợp lệ.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ.';
        setTimeout(() => navigate('/provider/login'), 2000);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Thêm khuyến mãi mới</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
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
            <Button type="submit" disabled={loading}>Thêm khuyến mãi</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/provider/promotions')}>
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePromotionPage;