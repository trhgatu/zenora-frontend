import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

interface Service {
  id: string;
  categoryId: string;
  providerId: string;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
  mainImage?: string | null;
  subImages?: string[];
  isAvailable: boolean;
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

interface ServiceCategory {
  id: string;
  categoryName: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  createdTime?: string;
  lastUpdatedTime?: string;
  deletedTime?: string | null;
}

interface ApiResponse<T> {
  data: T;
  additionalData: any;
  message: string | null;
  statusCode: number;
  code: string;
}

interface ErrorResponse {
  message?: string;
  statusCode?: number;
  errors?: { [key: string]: string[] };
}

interface ServiceProviderResponse {
  id: string;
  providerId: string;
  businessName: string;
  imageUrl: string;
  description: string;
}

const ProviderServices = () => {
  const { token, user } = useAppSelector(state => state.auth);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate]);

  const fetchCategories = async (authToken: string | null) => {
    try {
      if (!authToken) throw new Error('Phiên đăng nhập hết hạn.');

      const response = await axiosInstance.get('/api/ServiceCategory/get-all', {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { pageNumber: 1, pageSize: 100 },
      });

      const responseData: ApiResponse<{ items: ServiceCategory[] }> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy danh sách danh mục');
      }

      setCategories(responseData.data.items || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchServiceProviderId = async (authToken: string | null) => {
    try {
      if (!authToken || !user?._id) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }

      const response = await axiosInstance.get('/api/ServiceProvider/get-all', {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { pageNumber: 1, pageSize: 100 },
      });

      const responseData: ApiResponse<{ items: ServiceProviderResponse[] }> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy thông tin nhà cung cấp');
      }

      const serviceProviders = responseData.data.items || [];
      const matchingProvider = serviceProviders.find(provider => provider.providerId === user._id);

      if (!matchingProvider) {
        throw new Error('Không tìm thấy nhà cung cấp phù hợp');
      }

      setServiceProviderId(matchingProvider.id);
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
      }
      setError(errorMessage);
      console.error('Lỗi khi lấy ServiceProviderId:', err);
    }
  };

  const fetchServices = async (authToken: string | null) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!authToken || !serviceProviderId) {
        setError('Không tìm thấy thông tin nhà cung cấp.');
        return;
      }

      const response = await axiosInstance.get(`/api/Service/by-provider/${serviceProviderId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { pageNumber: 1, pageSize: 100 },
      });

      const responseData: ApiResponse<Service[]> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy danh sách dịch vụ');
      }

      const fetchedServices = Array.isArray(responseData.data) ? responseData.data : [];
      console.log('Fetched services:', fetchedServices);
      setServices(fetchedServices);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách dịch vụ';

      if (axiosError.response?.status === 404) {
        setServices([]);
        setError(null);
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        }
      }
      setError(errorMessage);
      console.error('Lỗi khi lấy dịch vụ:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }

      const response = await axiosInstance.delete(`/api/Service/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<any> = response.data;
      if (response.status !== 200 || (responseData.statusCode && responseData.statusCode !== 200)) {
        throw new Error(responseData.message || 'Lỗi khi xóa dịch vụ');
      }

      setSuccess('Xóa dịch vụ thành công');
      fetchServices(token);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa dịch vụ';
      if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 404) {
        errorMessage = 'Không tìm thấy dịch vụ để xóa. Vui lòng kiểm tra lại.';
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        }
      }
      setError(errorMessage);
      setSuccess(null);
      console.error('Error deleting service:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user && user.role === 'Provider') {
      fetchCategories(token);
      fetchServiceProviderId(token);
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (serviceProviderId && token) {
      fetchServices(token);
    }
  }, [serviceProviderId, token, location.state]); // Thêm location.state để làm mới khi có state từ CreateService

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Không xác định';
  };

  const formatDuration = (duration: number) => {
    return duration === 0 ? 'Chưa xác định' : `${duration} phút`;
  };

  const filteredServices = showAvailableOnly
    ? services.filter(service => service.isAvailable)
    : services;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý dịch vụ</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Danh sách dịch vụ</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-available"
              checked={showAvailableOnly}
              onCheckedChange={(checked) => setShowAvailableOnly(!!checked)}
            />
            <label htmlFor="show-available" className="text-sm text-gray-600">
              Chỉ hiển thị dịch vụ có sẵn
            </label>
          </div>
        </div>
        {loading ? (
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        ) : filteredServices.length === 0 ? (
          <p className="text-gray-600">
            {showAvailableOnly
              ? 'Không có dịch vụ nào khả dụng. Vui lòng kiểm tra lại.'
              : 'Chưa có dịch vụ nào. Vui lòng tạo dịch vụ mới.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2 text-left">Hình ảnh</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Tên dịch vụ</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Danh mục</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Mô tả</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Giá (VNĐ)</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Thời gian (phút)</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Trạng thái</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {service.mainImage ? (
                        <img
                          src={service.mainImage}
                          alt={service.serviceName}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64';
                          }}
                        />
                      ) : (
                        <span className="text-gray-500">Không có hình ảnh</span>
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{service.serviceName}</td>
                    <td className="border border-gray-200 px-4 py-2">{getCategoryName(service.categoryId)}</td>
                    <td className="border border-gray-200 px-4 py-2">{service.description}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {service.price.toLocaleString('vi-VN')}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{formatDuration(service.duration)}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {service.isAvailable ? 'Có sẵn' : 'Không có sẵn'}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteService(service.id)}
                        className="mr-2"
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

export default ProviderServices;