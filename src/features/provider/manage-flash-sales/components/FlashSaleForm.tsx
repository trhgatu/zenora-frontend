import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createFlashSale, updateFlashSale } from '../services/flashSaleApi';
import { fetchFlashSales } from '../services/flashSaleApi';
import { FlashSale, Service } from '../types/flashSale.types';

interface FlashSaleFormProps {
  services: Service[];
  editingFlashSale: FlashSale | null;
  setViewMode: (mode: 'list' | 'add' | 'edit') => void;
  setFlashSales: (flashSales: FlashSale[]) => void;
  setFilteredFlashSales: (flashSales: FlashSale[]) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setLoading: (loading: boolean) => void;
  token: string | null; // Token có thể null
  providerId: string;
}

const FlashSaleForm = ({
  services,
  editingFlashSale,
  setViewMode,
  setFlashSales,
  setFilteredFlashSales,
  setError,
  setSuccess,
  setLoading,
  token,
  providerId,
}: FlashSaleFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    serviceId: editingFlashSale?.serviceId || '',
    discountPercent: editingFlashSale?.discountPercent.toString() || '',
    discountAmount: editingFlashSale?.discountAmount.toString() || '',
    quantity: editingFlashSale?.quantity.toString() || '',
    startDate: editingFlashSale?.startDate.slice(0, 16) || '',
    endDate: editingFlashSale?.endDate.slice(0, 16) || '',
  });
  const [localLoading, setLocalLoading] = useState<boolean>(false);

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
    const currentDate = new Date('2025-06-04T01:00:00+07:00');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.');
      return;
    }
    if (startDate < currentDate) {
      setError('Ngày bắt đầu phải từ ngày hiện tại (01:00 AM +07, Wednesday, June 04, 2025) trở đi.');
      return;
    }
    if (endDate <= startDate) {
      setError('Ngày kết thúc phải sau ngày bắt đầu.');
      return;
    }

    try {
      setLocalLoading(true);
      setLoading(true);
      setError(null);
      setSuccess(null);
      const payload = {
        ...(editingFlashSale ? { id: editingFlashSale.id } : {}),
        serviceId: formData.serviceId,
        discountPercent,
        discountAmount,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      console.log('Payload flash sale:', payload);
      const response = editingFlashSale
        ? await updateFlashSale(token, payload as { id: string; serviceId: string; discountPercent: number; discountAmount: number; quantity: number; startDate: string; endDate: string })
        : await createFlashSale(token, payload);
      console.log('Phản hồi API:', response);
      setSuccess(`${editingFlashSale ? 'Cập nhật' : 'Thêm'} flash sale thành công.`);
      setFormData({
        serviceId: '',
        discountPercent: '',
        discountAmount: '',
        quantity: '',
        startDate: '',
        endDate: '',
      });
      const updatedFlashSales = await fetchFlashSales(token, 1, 100);
      console.log('Flash Sales cập nhật:', updatedFlashSales);
      setFlashSales(updatedFlashSales.items); // Sử dụng items từ PaginatedResponse
      setFilteredFlashSales(updatedFlashSales.items);
      setViewMode('list');
    } catch (err: any) {
      console.error('Lỗi khi xử lý flash sale:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      let errorMessage = err.response?.data?.message || err.message || 'Không thể xử lý flash sale.';
      if (err.response?.status === 400) {
        errorMessage = err.response.data.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Dữ liệu không hợp lệ.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (err.response?.status === 404) {
        errorMessage = 'Không tìm thấy dịch vụ hoặc nhà cung cấp.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Lỗi server, vui lòng thử lại sau.';
      }
      setError(errorMessage);
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h3 className="text-lg font-semibold mb-4">{editingFlashSale ? 'Chỉnh sửa Flash Sale' : 'Thêm Flash Sale mới'}</h3>
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
          <Button type="submit" disabled={localLoading || services.length === 0}>
            {editingFlashSale ? 'Cập nhật' : 'Thêm Flash Sale'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                serviceId: '',
                discountPercent: '',
                discountAmount: '',
                quantity: '',
                startDate: '',
                endDate: '',
              });
              setViewMode('list');
            }}
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FlashSaleForm;