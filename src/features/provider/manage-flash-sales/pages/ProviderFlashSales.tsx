import { useState, useEffect, ChangeEvent } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import { fetchFlashSales, deleteFlashSale } from '../services/flashSaleApi';
import { fetchServices } from '../services/serviceApi';
import { FlashSale, Service, ServiceProviderResponse, PaginatedResponse, ApiResponse, ErrorResponse } from '../types/flashSale.types';

const ProviderFlashSales = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [filteredFlashSales, setFilteredFlashSales] = useState<FlashSale[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);
  const [filterServiceName, setFilterServiceName] = useState<string>('');

  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [formServiceId, setFormServiceId] = useState<string>('');
  const [formDiscountPercent, setFormDiscountPercent] = useState<string>('');
  const [formDiscountAmount, setFormDiscountAmount] = useState<string>('');
  const [formQuantity, setFormQuantity] = useState<string>('');
  const [formStartDate, setFormStartDate] = useState<string>('');
  const [formEndDate, setFormEndDate] = useState<string>('');
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate]);

  const fetchServiceProviderId = async (authToken: string | null) => {
    try {
      if (!authToken || !user?._id) {
        setError('Phiên đăng nhập hết hạn.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }
      console.log('User ID:', user._id);
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
      const matchingProvider = serviceProviders.find((provider: ServiceProviderResponse) => provider.providerId === user._id);
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
      setLoading(true);
      fetchServices(serviceProviderId, token)
        .then(data => {
          setServices(data);
          if (data.length === 0) {
            setError('Chưa có dịch vụ nào. Vui lòng thêm dịch vụ trước khi tạo flash sale.');
          } else {
            setError(null);
          }
        })
        .catch(err => {
          setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
          console.error('Lỗi khi lấy dịch vụ:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [serviceProviderId, token]);

  useEffect(() => {
    if (serviceProviderId && token && services.length > 0) {
      setLoading(true);
      fetchFlashSales(token, currentPage, pageSize)
        .then(data => {
          const providerServiceIds = services.map(service => service.id);
          const filteredByProvider = data.items.filter((flashSale: FlashSale) => providerServiceIds.includes(flashSale.serviceId));
          setFlashSales(filteredByProvider);
          setFilteredFlashSales(filteredByProvider);
          setTotalPages(data.totalPages);
          if (filteredByProvider.length === 0) {
            setError('Chưa có flash sale nào. Hãy tạo flash sale đầu tiên!');
          } else {
            setError(null);
          }
        })
        .catch(err => {
          setError('Không thể tải danh sách flash sale. Vui lòng thử lại sau.');
          console.error('Lỗi khi lấy flash sale:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [serviceProviderId, token, services, currentPage, viewMode, location.state]);

  useEffect(() => {
    if (filterServiceName) {
      const filtered = flashSales.filter((flashSale: FlashSale) => {
        const service = services.find(s => s.id === flashSale.serviceId);
        return service && service.serviceName.toLowerCase().includes(filterServiceName.toLowerCase());
      });
      setFilteredFlashSales(filtered);
      if (filtered.length === 0 && flashSales.length > 0) {
        setError('Không tìm thấy flash sale nào khớp với tên dịch vụ.');
      } else {
        setError(null);
      }
    } else {
      setFilteredFlashSales(flashSales);
      if (flashSales.length === 0 && services.length > 0) {
        setError('Chưa có flash sale nào. Hãy tạo flash sale đầu tiên!');
      } else {
        setError(null);
      }
    }
  }, [filterServiceName, flashSales, services]);

  const handleFlashSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formServiceId || !formDiscountPercent || !formDiscountAmount || !formQuantity || !formStartDate || !formEndDate) {
      setError('Vui lòng nhập đầy đủ thông tin flash sale');
      return;
    }

    const discountPercent = parseFloat(formDiscountPercent);
    const discountAmount = parseFloat(formDiscountAmount);
    const quantity = parseInt(formQuantity, 10);

    if (isNaN(discountPercent) || discountPercent < 0) {
      setError('Mức giảm giá (%) phải là số hợp lệ và không âm');
      return;
    }
    if (isNaN(discountAmount) || discountAmount < 0) {
      setError('Mức giảm giá (VNĐ) phải là số hợp lệ và không âm');
      return;
    }
    if (isNaN(quantity) || quantity < 0) {
      setError('Số lượng phải là số hợp lệ và không âm');
      return;
    }

    const startDate = new Date(formStartDate);
    const endDate = new Date(formEndDate);
    const currentDate = new Date('2025-06-04T01:10:00+07:00');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.');
      return;
    }
    if (startDate < currentDate) {
      setError('Ngày bắt đầu phải từ ngày hiện tại (01:10 AM +07, Wednesday, June 04, 2025) trở đi.');
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
        serviceId: formServiceId,
        discountPercent,
        discountAmount,
        quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      console.log('Payload gửi lên API:', payload);

      if (editingFlashSale) {
        await axiosInstance.put('/api/ServicePromotion', { ...payload, id: editingFlashSale.id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axiosInstance.post('/api/ServicePromotion', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setSuccess(`${editingFlashSale ? 'Cập nhật' : 'Thêm'} flash sale thành công`);
      setFormServiceId('');
      setFormDiscountPercent('');
      setFormDiscountAmount('');
      setFormQuantity('');
      setFormStartDate('');
      setFormEndDate('');
      setEditingFlashSale(null);
      setViewMode('list');
    } catch (err: any) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || `Lỗi khi ${editingFlashSale ? 'cập nhật' : 'thêm'} flash sale`;
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi xử lý flash sale.';
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ.';
        setTimeout(() => navigate('/provider/login'), 2000);
      }
      setError(errorMessage);
      console.error('Lỗi khi xử lý flash sale:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFlashSale = (flashSale: FlashSale) => {
    setEditingFlashSale(flashSale);
    setFormServiceId(flashSale.serviceId);
    setFormDiscountPercent(flashSale.discountPercent.toString());
    setFormDiscountAmount(flashSale.discountAmount.toString());
    setFormQuantity(flashSale.quantity.toString());
    setFormStartDate(flashSale.startDate.slice(0, 16));
    setFormEndDate(flashSale.endDate.slice(0, 16));
    setViewMode('edit');
  };

  const handleDeleteFlashSale = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await deleteFlashSale(token!, id);
      setSuccess('Xóa flash sale thành công');
    } catch (err: any) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa flash sale';
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi xóa flash sale.';
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ.';
        setTimeout(() => navigate('/provider/login'), 2000);
      }
      setError(errorMessage);
      console.error('Lỗi khi xóa flash sale:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.serviceName : 'Không xác định';
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý Flash Sale</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      {viewMode === 'list' ? (
        <div className="bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Danh sách Flash Sale</h3>
            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="filterServiceName">Tìm kiếm theo tên dịch vụ</Label>
                <Input
                  id="filterServiceName"
                  value={filterServiceName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterServiceName(e.target.value)}
                  placeholder="Nhập tên dịch vụ"
                  className="w-64"
                />
              </div>
              {services.length > 0 ? (
                <Button onClick={() => setViewMode('add')} disabled={loading}>
                  Thêm Flash Sale
                </Button>
              ) : (
                <Button disabled>Không có dịch vụ để thêm Flash Sale</Button>
              )}
            </div>
          </div>
          {loading ? (
            <p className="text-gray-500">Đang tải dữ liệu...</p>
          ) : filteredFlashSales.length === 0 ? (
            <p className="text-gray-500">{services.length > 0 ? 'Chưa có flash sale nào. Hãy tạo flash sale đầu tiên!' : 'Chưa có dịch vụ nào. Vui lòng thêm dịch vụ trước.'}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Dịch vụ</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Giảm giá (%)</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Giảm giá (VNĐ)</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Số lượng</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Bắt đầu</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Kết thúc</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlashSales.map((flashSale) => (
                    <tr key={flashSale.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{getServiceName(flashSale.serviceId)}</td>
                      <td className="border border-gray-200 px-4 py-2">{flashSale.discountPercent}</td>
                      <td className="border border-gray-200 px-4 py-2">{flashSale.discountAmount.toLocaleString('vi-VN')}</td>
                      <td className="border border-gray-200 px-4 py-2">{flashSale.quantity}</td>
                      <td className="border border-gray-200 px-4 py-2">{new Date(flashSale.startDate).toLocaleString()}</td>
                      <td className="border border-gray-200 px-4 py-2">{new Date(flashSale.endDate).toLocaleString()}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEditFlashSale(flashSale)}
                          className="mr-2"
                          disabled={loading}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteFlashSale(flashSale.id)}
                          disabled={loading}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trang trước
                </Button>
                <span>Trang {currentPage} / {totalPages}</span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-4">{viewMode === 'edit' ? 'Chỉnh sửa Flash Sale' : 'Thêm Flash Sale mới'}</h3>
          <form onSubmit={handleFlashSaleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="serviceId">Dịch vụ</Label>
              <select
                id="serviceId"
                value={formServiceId}
                onChange={(e) => setFormServiceId(e.target.value)}
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
                value={formDiscountPercent}
                onChange={(e) => setFormDiscountPercent(e.target.value)}
                placeholder="Nhập mức giảm giá (%)"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="discountAmount">Mức giảm giá (VNĐ)</Label>
              <Input
                id="discountAmount"
                type="number"
                value={formDiscountAmount}
                onChange={(e) => setFormDiscountAmount(e.target.value)}
                placeholder="Nhập mức giảm giá (VNĐ)"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                value={formQuantity}
                onChange={(e) => setFormQuantity(e.target.value)}
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
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading || services.length === 0}>
                {viewMode === 'edit' ? 'Cập nhật' : 'Thêm Flash Sale'}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setEditingFlashSale(null);
                setFormServiceId('');
                setFormDiscountPercent('');
                setFormDiscountAmount('');
                setFormQuantity('');
                setFormStartDate('');
                setFormEndDate('');
                setViewMode('list');
              }}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProviderFlashSales;