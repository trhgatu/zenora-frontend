import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { fetchFlashSales, updateFlashSale } from '../services/flashSaleApi';
import { fetchServices } from '../services/serviceApi';
import { FlashSale, Service } from '../types/flashSale.types';

const EditFlashSalePage = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const providerId = user?._id || '';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    serviceId: '',
    discountPercent: '',
    discountAmount: '',
    quantity: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider' || !providerId || !id) {
      console.log('Auth state:', { token, user, providerId });
      setError('Tài khoản không hợp lệ hoặc không tìm thấy flash sale.');
      setTimeout(() => navigate('/provider/login'), 2000);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [servicesData, flashSales] = await Promise.all([
          fetchServices(providerId, token),
          fetchFlashSales(providerId, token),
        ]);
        console.log('Services:', servicesData);
        console.log('FlashSales:', flashSales);
        setServices(servicesData);
        const flashSale = flashSales.find((f: FlashSale) => f.id === id);
        if (!flashSale) {
          setError('Flash sale không tồn tại.');
          setTimeout(() => navigate('/provider/flash-sales'), 2000);
          return;
        }
        setFormData({
          serviceId: flashSale.serviceId,
          discountPercent: flashSale.discountPercent.toString(),
          discountAmount: flashSale.discountAmount.toString(),
          quantity: flashSale.quantity.toString(),
          startDate: flashSale.startDate.slice(0, 16),
          endDate: flashSale.endDate.slice(0, 16),
        });
      } catch (err: any) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError(err.message || 'Không thể tải dữ liệu flash sale.');
        if (err.message.includes('Phiên đăng nhập')) {
          setTimeout(() => navigate('/provider/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, user, providerId, id, navigate]);

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
    const currentDate = new Date('2025-06-03T19:04:00+07:00');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.');
      return;
    }
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
        serviceId: formData.serviceId,
        discountPercent,
        discountAmount,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      console.log('Payload cập nhật flash sale:', payload);
      const response = await updateFlashSale(token, payload);
      console.log('Phản hồi API:', response);
      setSuccess('Cập nhật flash sale thành công.');
      setTimeout(() => navigate('/provider/flash-sales'), 1000);
    } catch (err: any) {
      console.error('Lỗi khi cập nhật flash sale:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      let errorMessage = err.response?.data?.message || err.message || 'Không thể cập nhật flash sale.';
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
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa Flash Sale</h2>
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
                {services.length === 0 ? (
                  <option value="" disabled>Không có dịch vụ nào</option>
                ) : (
                  services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.serviceName}
                    </option>
                  ))
                )}
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
                Cập nhật Flash Sale
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

export default EditFlashSalePage;