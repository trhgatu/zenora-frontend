import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface ServiceImage {
  id: string;
  serviceProviderId: string;
  imageUrl: string;
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

interface ServiceProvider {
  id: string;
  providerUserId?: string;
  userId?: string;
  providerId?: string;
  businessName: string;
  imageUrl: string;
  description: string;
}

interface PaginatedResponse {
  items: ServiceImage[] | ServiceProvider[];
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

const ProviderImages = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const [images, setImages] = useState<ServiceImage[]>([]);
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // State để điều khiển chế độ hiển thị
  const [viewMode, setViewMode] = useState<'list' | 'add'>('list');

  // State cho form thêm hình ảnh
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider' || !user?._id) {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    fetchServiceProviderId();
  }, [token, user, navigate]);

  const fetchServiceProviderId = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/ServiceProvider/get-all', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNumber: 1, pageSize: 100 },
      });

      if (!response?.data || typeof response.data !== 'object') {
        console.error('Dữ liệu trả về từ API get-all không hợp lệ:', response?.data);
        throw new Error('Dữ liệu trả về từ API không hợp lệ');
      }

      const responseData: ApiResponse<PaginatedResponse> = response.data;
      console.log('Dữ liệu trả về từ API get-all:', responseData);

      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy thông tin nhà cung cấp');
      }

      if (!responseData?.data || !Array.isArray(responseData.data.items)) {
        console.error('Dữ liệu nhà cung cấp không hợp lệ:', responseData?.data);
        throw new Error('Dữ liệu nhà cung cấp không hợp lệ, thiếu data hoặc items không phải mảng');
      }

      const serviceProviders = responseData.data.items;
      console.log('Danh sách ServiceProviders:', serviceProviders);

      const userId = user?._id;
      console.log('User ID đang tìm kiếm:', userId);

      const matchingProvider = serviceProviders.find(provider => {
        if (!provider || !userId) return false;
        const providerUserId = (provider as any).providerUserId || (provider as any).userId || (provider as any).providerId;
        console.log('So sánh providerUserId:', providerUserId, 'với userId:', userId);
        return providerUserId === userId;
      });

      if (!matchingProvider) {
        console.error('Không tìm thấy nhà cung cấp phù hợp với user._id:', userId);
        throw new Error('Không tìm thấy nhà cung cấp phù hợp với tài khoản của bạn (user._id: ' + userId + '). Vui lòng kiểm tra cơ sở dữ liệu hoặc liên hệ quản trị viên để tạo ServiceProvider tương ứng.');
      }

      setServiceProviderId(matchingProvider.id);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy thông tin nhà cung cấp';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi lấy thông tin nhà cung cấp. Vui lòng kiểm tra log backend tại beautyspaapi20250516125713-h6h7bee3h7gyenhy.canadacentral-01.azurewebsites.net hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy nhà cung cấp qua API /api/ServiceProvider/get-all. Vui lòng kiểm tra lại thông tin tài khoản hoặc liên hệ quản trị viên.';
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi lấy thông tin nhà cung cấp: ' + (err instanceof Error ? err.message : String(err)));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    if (!serviceProviderId) {
      setError('Không tìm thấy ID nhà cung cấp. Vui lòng thử lại sau.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get(`/api/ServiceImage/by-provider/${serviceProviderId}/paged`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          size: pageSize,
        },
      });

      if (!response?.data || typeof response.data !== 'object') {
        console.error('Dữ liệu trả về từ API không hợp lệ:', response?.data);
        throw new Error('Dữ liệu trả về từ API không hợp lệ');
      }

      const responseData: ApiResponse<PaginatedResponse> = response.data;
      console.log('Dữ liệu trả về từ API fetchImages:', responseData);

      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy danh sách hình ảnh');
      }

      if (!responseData.data || typeof responseData.data !== 'object') {
        console.error('Cấu trúc dữ liệu không hợp lệ, thiếu data:', responseData.data);
        setImages([]);
        setTotalPages(1);
        return;
      }

      if (!Array.isArray(responseData.data.items)) {
        console.error('responseData.data.items không phải là mảng:', responseData.data.items);
        setImages([]);
        setTotalPages(1);
        return;
      }

      const fetchedImages = responseData.data.items as ServiceImage[];
      console.log('fetchedImages:', fetchedImages);

      const isValidImages = fetchedImages.every(item =>
        item &&
        typeof item === 'object' &&
        'id' in item &&
        'serviceProviderId' in item &&
        'imageUrl' in item &&
        'createdTime' in item &&
        'lastUpdatedTime' in item
      );

      if (!isValidImages) {
        console.error('Dữ liệu hình ảnh không khớp với giao diện ServiceImage:', fetchedImages);
        setImages([]);
        setTotalPages(1);
        return;
      }

      setImages(fetchedImages);
      setTotalPages(typeof responseData.data.totalPages === 'number' ? responseData.data.totalPages : 1);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách hình ảnh';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi lấy danh sách hình ảnh. Vui lòng kiểm tra log backend tại beautyspaapi20250516125713-h6h7bee3h7gyenhy.canadacentral-01.azurewebsites.net hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy nhà cung cấp hoặc hình ảnh. Vui lòng kiểm tra lại thông tin nhà cung cấp (providerId) hoặc liên hệ quản trị viên.';
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi lấy danh sách hình ảnh');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newImageUrl) {
      setError('Vui lòng nhập URL hình ảnh');
      return;
    }

    if (!serviceProviderId) {
      setError('Không tìm thấy ID nhà cung cấp. Vui lòng thử lại sau.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload = {
        serviceProviderId: serviceProviderId,
        imageUrls: [newImageUrl],
      };

      console.log('Payload gửi lên API /api/ServiceImage/multi-create:', payload);

      const response = await axiosInstance.post('/api/ServiceImage/multi-create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<any> = response.data;
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(responseData.message || 'Lỗi khi thêm hình ảnh');
      }

      setSuccess('Thêm hình ảnh thành công');
      setNewImageUrl('');
      setViewMode('list');
      fetchImages();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi thêm hình ảnh';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi thêm hình ảnh. Vui lòng kiểm tra log backend tại beautyspaapi20250516125713-h6h7bee3h7gyenhy.canadacentral-01.azurewebsites.net hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 400) {
          errorMessage = axiosError.response?.data?.detail || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại URL hình ảnh.';
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy endpoint /api/ServiceImage/multi-create. Vui lòng liên hệ quản trị viên để triển khai endpoint này.';
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi thêm hình ảnh');
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Kiểm tra token trước khi gọi API
      if (!token) {
        throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      }

      // Debug thông tin trước khi xóa
      console.log('Xóa hình ảnh với ID:', id);
      console.log('Token:', token);
      console.log('ServiceProviderId của tài khoản:', serviceProviderId);

      // Tìm hình ảnh để kiểm tra quyền sở hữu
      const imageToDelete = images.find(image => image.id === id);
      if (!imageToDelete) {
        throw new Error('Không tìm thấy hình ảnh trong danh sách để xóa.');
      }

      console.log('ServiceProviderId của hình ảnh:', imageToDelete.serviceProviderId);

      if (imageToDelete.serviceProviderId !== serviceProviderId) {
        throw new Error('Hình ảnh không thuộc nhà cung cấp của bạn (ServiceProviderId không khớp).');
      }

      const response = await axiosInstance.delete(`/api/ServiceImage/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<any> = response.data;
      if (response.status !== 200) {
        throw new Error(responseData.message || 'Lỗi khi xóa hình ảnh');
      }

      setSuccess('Xóa hình ảnh thành công');
      fetchImages();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa hình ảnh';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi xóa hình ảnh. Vui lòng kiểm tra log backend tại beautyspaapi20250516125713-h6h7bee3h7gyenhy.canadacentral-01.azurewebsites.net hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy hình ảnh để xóa. Vui lòng thử lại.';
        } else if (axiosError.response?.status === 403) {
          errorMessage = `Bạn không có quyền xóa hình ảnh này (ID: ${id}). Vui lòng kiểm tra quyền truy cập hoặc liên hệ quản trị viên.`;
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi xóa hình ảnh: ' + (err instanceof Error ? err.message : String(err)));
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
    if (token && user && serviceProviderId) {
      fetchImages();
    }
  }, [token, user, serviceProviderId, currentPage]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý hình ảnh</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      {viewMode === 'list' ? (
        <div className="bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Danh sách hình ảnh</h3>
            <Button onClick={() => setViewMode('add')}>
              Thêm hình ảnh
            </Button>
          </div>
          {loading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : images.length === 0 ? (
            <p className="text-gray-600">Chưa có hình ảnh nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Service Provider ID</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">URL</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Thời gian tạo</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Cập nhật cuối</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image) => (
                    <tr key={image.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{image.id}</td>
                      <td className="border border-gray-200 px-4 py-2">{image.serviceProviderId}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <a href={image.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {image.imageUrl}
                        </a>
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{new Date(image.createdTime).toLocaleString()}</td>
                      <td className="border border-gray-200 px-4 py-2">{new Date(image.lastUpdatedTime).toLocaleString()}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteImage(image.id)}
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
          <h3 className="text-lg font-semibold mb-4">Thêm hình ảnh mới</h3>
          <form onSubmit={handleImageSubmit} className="space-y-4">
            <div>
              <Label htmlFor="newImageUrl">URL hình ảnh</Label>
              <Input
                id="newImageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Nhập URL hình ảnh"
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                Thêm hình ảnh
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setNewImageUrl('');
                  setViewMode('list');
                }}
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProviderImages;