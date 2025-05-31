import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface FlashSale {
  id: string;
  serviceId: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

interface Service {
  id: string;
  serviceName: string;
}

interface ServiceProviderResponse {
  id: string;
  providerId: string;
  businessName: string;
  imageUrl: string;
  description: string;
}

interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

interface ApiResponse<T> {
  data: T;
  additionalData: any;
  message: string | null;
  statusCode: number;
  code: string;
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

const ProviderFlashSales = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [filteredFlashSales, setFilteredFlashSales] = useState<FlashSale[]>([]); // State cho danh sách đã lọc
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);
  const [filterServiceName, setFilterServiceName] = useState<string>(''); // State cho tìm kiếm theo tên dịch vụ

  // State để điều khiển chế độ hiển thị
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');

  // State cho form thêm/chỉnh sửa flash sale
  const [formServiceId, setFormServiceId] = useState<string>('');
  const [formDiscountPercent, setFormDiscountPercent] = useState<string>('');
  const [formDiscountAmount, setFormDiscountAmount] = useState<string>('');
  const [formQuantity, setFormQuantity] = useState<string>('');
  const [formStartDate, setFormStartDate] = useState<string>('');
  const [formEndDate, setFormEndDate] = useState<string>('');

  // State cho chỉnh sửa flash sale
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate]);

  const fetchServiceProviderId = async (authToken: string | null) => {
    try {
      if (!authToken || !user?._id) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }

      console.log('User ID:', user._id); // Debug user._id
      const response = await axiosInstance.get('/api/ServiceProvider/get-all', {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { pageNumber: 1, pageSize: 100 },
      });

      const responseData: ApiResponse<PaginatedResponse<ServiceProviderResponse>> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy thông tin nhà cung cấp');
      }

      const serviceProviders = responseData.data.items || [];
      console.log('Service Providers:', serviceProviders); // Debug service providers
      const matchingProvider = serviceProviders.find(provider => provider.providerId === user._id);

      if (!matchingProvider) {
        throw new Error('Không tìm thấy nhà cung cấp phù hợp');
      }

      setServiceProviderId(matchingProvider.id);
      console.log('ServiceProviderId:', matchingProvider.id); // Debug
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy thông tin nhà cung cấp';

      if (axiosError.response?.status === 404 || errorMessage.includes('Không tìm thấy')) {
        setError('Nhà cung cấp không tồn tại. Vui lòng kiểm tra lại thông tin tài khoản hoặc liên hệ quản trị viên.');
        setServiceProviderId(null);
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        }
      } else if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi lấy thông tin nhà cung cấp. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      }
      setError(errorMessage);
      console.error('Lỗi khi lấy ServiceProviderId:', err);
    }
  };

  const fetchServices = async () => {
    try {
      if (!token || !serviceProviderId) {
        setError('Không tìm thấy thông tin nhà cung cấp.');
        return;
      }

      const response = await axiosInstance.get(`/api/Service/by-provider/${serviceProviderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNumber: 1, pageSize: 100 },
      });

      const responseData: ApiResponse<Service[]> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy danh sách dịch vụ');
      }

      const fetchedServices = Array.isArray(responseData.data) ? responseData.data : [];
      console.log('Fetched services in ProviderFlashSales:', fetchedServices); // Debug
      setServices(fetchedServices);
      if (fetchedServices.length === 0) {
        setError('Không có dịch vụ nào cho nhà cung cấp này. Vui lòng thêm dịch vụ trước.');
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách dịch vụ';

      if (axiosError.response?.status === 404) {
        setServices([]);
        errorMessage = 'Không tìm thấy dịch vụ nào cho nhà cung cấp này. Vui lòng thêm dịch vụ trước.';
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        }
      } else if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi lấy danh sách dịch vụ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      }
      setError(errorMessage);
      console.error('Lỗi khi lấy dịch vụ:', err);
    }
  };

  const fetchFlashSales = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?._id || !serviceProviderId) {
        throw new Error('Không tìm thấy ID nhà cung cấp. Vui lòng đăng nhập lại.');
      }

      const flashSaleResponse = await axiosInstance.get('/api/ServicePromotion/get-all', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNumber: currentPage, pageSize: pageSize },
      });

      const flashSaleData: ApiResponse<PaginatedResponse<FlashSale>> = flashSaleResponse.data;
      if (flashSaleResponse.status !== 200 || flashSaleData.statusCode !== 200) {
        throw new Error(flashSaleData.message || 'Lỗi khi lấy danh sách flash sale');
      }

      const allFlashSales = flashSaleData.data.items || [];
      console.log('All Flash Sales:', allFlashSales); // Debug tất cả flash sale

      const providerServiceIds = services.map(service => service.id);
      console.log('Provider Service IDs:', providerServiceIds); // Debug service IDs

      const filteredByProvider = allFlashSales.filter(flashSale =>
        providerServiceIds.includes(flashSale.serviceId)
      );
      console.log('Filtered Flash Sales (by provider):', filteredByProvider); // Debug flash sale đã lọc theo nhà cung cấp

      setFlashSales(filteredByProvider); // Lưu danh sách gốc để lọc sau này
      setFilteredFlashSales(filteredByProvider); // Khởi tạo danh sách đã lọc
      setTotalPages(flashSaleData.data.totalPages || 1);

      if (filteredByProvider.length === 0) {
        if (allFlashSales.length > 0) {
          setError('Không có flash sale nào thuộc nhà cung cấp hiện tại.');
        } else {
          setError('Chưa có flash sale nào được tạo.');
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách flash sale';

        if (axiosError.response?.status === 404) {
          setFlashSales([]);
          setFilteredFlashSales([]);
          setError('Chưa có flash sale nào được tạo.');
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi lấy danh sách flash sale. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi lấy danh sách flash sale');
      }
    } finally {
      setLoading(false);
    }
  };

  // Lọc flash sale khi filterServiceName thay đổi
  useEffect(() => {
    if (filterServiceName) {
      const filtered = flashSales.filter(flashSale => {
        const service = services.find(s => s.id === flashSale.serviceId);
        return service && service.serviceName.toLowerCase().includes(filterServiceName.toLowerCase());
      });
      setFilteredFlashSales(filtered);
      if (filtered.length === 0 && flashSales.length > 0) {
        setError('Không tìm thấy flash sale nào khớp với tên dịch vụ.');
      } else if (filtered.length > 0) {
        setError(null);
      }
    } else {
      setFilteredFlashSales(flashSales);
      if (flashSales.length === 0) {
        setError('Chưa có flash sale nào được tạo.');
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
      setError('Mức giảm giá (%) phải là một số hợp lệ và không âm');
      return;
    }

    if (isNaN(discountAmount) || discountAmount < 0) {
      setError('Mức giảm giá (số tiền) phải là một số hợp lệ và không âm');
      return;
    }

    if (isNaN(quantity) || quantity < 0) {
      setError('Số lượng phải là một số hợp lệ và không âm');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload = {
        serviceId: formServiceId,
        discountPercent: discountPercent,
        discountAmount: discountAmount,
        quantity: quantity,
        startDate: new Date(formStartDate).toISOString(),
        endDate: new Date(formEndDate).toISOString(),
      };

      console.log('Payload gửi lên API:', payload);

      let response;
      if (editingFlashSale) {
        response = await axiosInstance.put('/api/ServicePromotion', { ...payload, id: editingFlashSale.id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axiosInstance.post('/api/ServicePromotion', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Lỗi khi ${editingFlashSale ? 'cập nhật' : 'thêm'} flash sale`);
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
      fetchFlashSales();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || `Lỗi khi ${editingFlashSale ? 'cập nhật' : 'thêm'} flash sale`;

        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi xử lý flash sale. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        }
        setError(errorMessage);
      } else {
        setError(`Lỗi không xác định khi ${editingFlashSale ? 'cập nhật' : 'thêm'} flash sale`);
      }
      setSuccess(null);
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
    setFormStartDate(flashSale.startDate);
    setFormEndDate(flashSale.endDate);
    setViewMode('edit');
  };

  const handleDeleteFlashSale = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.delete(`/api/ServicePromotion/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi xóa flash sale');
      }

      setSuccess('Xóa flash sale thành công');
      fetchFlashSales();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa flash sale';

        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi xóa flash sale. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi xóa flash sale');
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (token && user && user.role === 'Provider') {
      fetchServiceProviderId(token);
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (serviceProviderId && token) {
      fetchServices();
    }
  }, [serviceProviderId, token]);

  useEffect(() => {
    if (serviceProviderId && token && services.length > 0) {
      fetchFlashSales();
    }
  }, [serviceProviderId, token, services, currentPage, viewMode, location.state]);

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
                  onChange={(e) => setFilterServiceName(e.target.value)}
                  placeholder="Nhập tên dịch vụ"
                  className="w-64"
                />
              </div>
              {services.length > 0 ? (
                <Button onClick={() => setViewMode('add')}>Thêm Flash Sale</Button>
              ) : (
                <Button disabled>Thêm Flash Sale (Cần có dịch vụ)</Button>
              )}
            </div>
          </div>
          {loading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : filteredFlashSales.length === 0 ? (
            <p className="text-gray-600">{error || 'Chưa có flash sale nào.'}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Dịch vụ</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Mức giảm giá (%)</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Mức giảm giá (VNĐ)</th>
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
                value={formDiscountPercent}
                onChange={(e) => setFormDiscountPercent(e.target.value)}
                placeholder="Nhập mức giảm giá (%)"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="discountAmount">Mức giảm giá (số tiền)</Label>
              <Input
                id="discountAmount"
                type="number"
                value={formDiscountAmount}
                onChange={(e) => setFormDiscountAmount(e.target.value)}
                placeholder="Nhập mức giảm giá (số tiền)"
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