import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';

interface Promotion {
  id: string;
  name: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
}

interface ErrorResponse {
  data?: any;
  additionalData?: any;
  message?: string;
  statusCode?: number;
  code?: string;
  detail?: string;
  errors?: any;
}

const ProviderPromotions = () => {
  const { token } = useAppSelector(state => state.auth);
  
  const [promotionName, setPromotionName] = useState('');
  const [promotionDescription, setPromotionDescription] = useState('');
  const [promotionDiscount, setPromotionDiscount] = useState('');
  const [promotionStartDate, setPromotionStartDate] = useState('');
  const [promotionEndDate, setPromotionEndDate] = useState('');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchPromotions = async () => {
    try {
      const response = await axiosInstance.get('/api/Promotion', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách khuyến mãi');
      }

      setPromotions(response.data || []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách khuyến mãi');
      } else {
        setError('Lỗi không xác định khi lấy danh sách khuyến mãi');
      }
    }
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promotionName || !promotionDescription || !promotionDiscount || !promotionStartDate || !promotionEndDate) {
      setError('Vui lòng nhập đầy đủ thông tin khuyến mãi');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/Promotion', {
        name: promotionName,
        description: promotionDescription,
        discount: parseFloat(promotionDiscount),
        startDate: promotionStartDate,
        endDate: promotionEndDate,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi thêm khuyến mãi');
      }

      setSuccess('Thêm khuyến mãi thành công');
      setError(null);
      setPromotionName('');
      setPromotionDescription('');
      setPromotionDiscount('');
      setPromotionStartDate('');
      setPromotionEndDate('');
      fetchPromotions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi thêm khuyến mãi');
      } else {
        setError('Lỗi không xác định khi thêm khuyến mãi');
      }
      setSuccess(null);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/api/Promotion/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi xóa khuyến mãi');
      }

      setSuccess('Xóa khuyến mãi thành công');
      setError(null);
      fetchPromotions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi xóa khuyến mãi');
      } else {
        setError('Lỗi không xác định khi xóa khuyến mãi');
      }
      setSuccess(null);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý khuyến mãi</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Thêm khuyến mãi</h3>
        <form onSubmit={handlePromotionSubmit} className="space-y-4">
          <div>
            <Label htmlFor="promotionName">Tên khuyến mãi</Label>
            <Input
              id="promotionName"
              value={promotionName}
              onChange={(e) => setPromotionName(e.target.value)}
              placeholder="Nhập tên khuyến mãi"
            />
          </div>
          <div>
            <Label htmlFor="promotionDescription">Mô tả</Label>
            <Textarea
              id="promotionDescription"
              value={promotionDescription}
              onChange={(e) => setPromotionDescription(e.target.value)}
              placeholder="Nhập mô tả khuyến mãi"
            />
          </div>
          <div>
            <Label htmlFor="promotionDiscount">Mức giảm giá (%)</Label>
            <Input
              id="promotionDiscount"
              type="number"
              value={promotionDiscount}
              onChange={(e) => setPromotionDiscount(e.target.value)}
              placeholder="Nhập mức giảm giá"
            />
          </div>
          <div>
            <Label htmlFor="promotionStartDate">Ngày bắt đầu</Label>
            <Input
              id="promotionStartDate"
              type="datetime-local"
              value={promotionStartDate}
              onChange={(e) => setPromotionStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="promotionEndDate">Ngày kết thúc</Label>
            <Input
              id="promotionEndDate"
              type="datetime-local"
              value={promotionEndDate}
              onChange={(e) => setPromotionEndDate(e.target.value)}
            />
          </div>
          <Button type="submit">Thêm khuyến mãi</Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">Danh sách khuyến mãi</h3>
        {promotions.length === 0 ? (
          <p className="text-gray-600">Chưa có khuyến mãi nào.</p>
        ) : (
          <div className="space-y-4">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h4 className="text-md font-semibold">{promotion.name}</h4>
                  <p className="text-gray-600">{promotion.description}</p>
                  <p className="text-gray-600">Mức giảm giá: {promotion.discount}%</p>
                  <p className="text-gray-600">Bắt đầu: {new Date(promotion.startDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Kết thúc: {new Date(promotion.endDate).toLocaleDateString()}</p>
                </div>
                <Button variant="destructive" onClick={() => handleDeletePromotion(promotion.id)}>
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderPromotions;