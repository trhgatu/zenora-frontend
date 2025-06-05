import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import { createFlashSale } from '../services/flashSaleApi';
import { fetchServices } from '../services/serviceApi';
import { Service, ServiceProviderResponse, PaginatedResponse, ApiResponse, ErrorResponse } from '../types/flashSale.types';

const CreateFlashSalePage = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const providerId = user?._id || '';
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    discountPercent: '',
    discountAmount: '',
    quantity: '',
    startDate: '',
    endDate: '',
  });
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);

  const fetchServiceProviderId = async (authToken: string | null) => {
    try {
      if (!authToken || !providerId) {
        setError('Phiên đăng nhập hết hạn.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }
      console.log('User ID:', providerId);
      const response = await axiosInstance.get('/api/ServiceProvider/get-all', {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { pageNumber: 1, pageSize: 100 },
      });
      const responseData: ApiResponse<PaginatedResponse<ServiceProviderResponse>> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy thông tin nhà cung cấp');
      }
      const serviceProviders = responseData.data.items || [];
      console.log('Service Providers:', serviceProviders);
      const matchingProvider = serviceProviders.find((provider: ServiceProviderResponse) => provider.providerId === providerId);
      if (!matchingProvider) {
        throw new Error('Không tìm thấy nhà cung cấp phù hợp');
      }
      setServiceProviderId(matchingProvider.id);
      console.log('ServiceProviderId:', matchingProvider.id);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy thông tin nhà cung cấp';
      if (axiosError.response?.status === 404 || errorMessage.includes('Không tìm thấy')) {
        setError('Nhà cung cấp không tồn tại.');
        setServiceProviderId(null);
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
      } else if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi lấy thông tin nhà cung cấp.';
      }
      setError(errorMessage);
      console.error('Lỗi khi lấy ServiceProviderId:', err);
    }
  };

  useEffect(() => {
    if (token && user && user.role === 'Provider') {
      fetchServiceProviderId(token);
    }
  }, [token, user]);

  useEffect(() => {
    if (serviceProviderId && token) {
      fetchServices(serviceProviderId, token).then(setServices);
    }
  }, [serviceProviderId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Phiên đăng nhập hết hạn.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }
    if (!formData.serviceId || !formData.quantity || !formData.startDate || !formData.endDate) {
      setError('Vui lòng nhập đầy đủ thông tin flash sale.');
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
    const currentDate = new Date('2025-06-04T00:54:00+07:00');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.');
      return;
    }
    if (startDate < currentDate) {
      setError('Ngày bắt đầu phải từ ngày hiện tại (12:54 AM +07, Wednesday, June 04, 2025) trở đi.');
      return;
    }
    if (endDate <= startDate) {
      setError('Ngày kết thúc phải sau ngày bắt đầu.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const payload = {
        serviceId: formData.serviceId,
        discountPercent,
        discountAmount,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      console.log('Payload tạo flash sale:', payload);
      const response = await createFlashSale(token, payload);
      console.log('Phản hồi API:', response);
      setSuccess('Thêm flash sale thành công.');
      setFormData({
        serviceId: '',
        discountPercent: '',
        discountAmount: '',
        quantity: '',
        startDate: '',
        endDate: '',
      });
      setTimeout(() => navigate('/provider/flash-sales'), 1000);
    } catch (err: any) {
      console.error('Lỗi khi tạo flash sale:', {
        message: err.message,
        status: err.response?.status,
        response: err.response?.data,
      });
      setError(err.message || 'Không thể thêm flash sale.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Thêm Flash Sale mới</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        {loading ? (
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="serviceId">Dịch vụ</Label>
              <select
                id="serviceId"
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn dịch vụ</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="discountPercent">Mức giảm giá (%)</Label>
              <Input
                id="discountPercent"
                type="number"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, discountAmount: e.target.value })}
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
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading || services.length === 0}>
                Thêm Flash Sale
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/provider/flash-sales')}>
                Hủy
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateFlashSalePage;