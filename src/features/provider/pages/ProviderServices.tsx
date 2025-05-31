import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

interface ServiceProviderResponse {
  id: string;
  providerId: string;
  businessName: string;
  imageUrl: string;
  description: string;
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

const ProviderServices = () => {
  const { token, user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editPrice, setEditPrice] = useState<string>(''); // State tạm thời cho price
  const [editDuration, setEditDuration] = useState<string>(''); // State tạm thời cho duration
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(''); // State để lưu danh mục được chọn
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list'); // Quản lý chế độ hiển thị

  // State cho form tạo dịch vụ mới
  const [newServiceName, setNewServiceName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');

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
      if (responseData.data.items.length > 0) {
        setSelectedCategoryId(responseData.data.items[0].id); // Bộ lọc danh mục mặc định
        setNewCategoryId(responseData.data.items[0].id); // Form tạo dịch vụ mặc định
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Lỗi khi lấy danh sách danh mục dịch vụ');
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

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryId || !newServiceName || !newDescription || !newPrice || !newDuration) {
      setError('Vui lòng nhập đầy đủ thông tin dịch vụ');
      return;
    }

    const parsedPrice = parseFloat(newPrice);
    const parsedDuration = parseInt(newDuration, 10);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Đơn giá phải là một số hợp lệ và lớn hơn 0');
      return;
    }

    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      setError('Thời gian phải là một số hợp lệ và lớn hơn 0');
      return;
    }

    if (!serviceProviderId) {
      setError('Không tìm thấy thông tin nhà cung cấp. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    const selectedCategory = categories.find(category => category.id === newCategoryId);
    if (!selectedCategory) {
      setError('Danh mục dịch vụ không hợp lệ. Vui lòng chọn lại.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }

      const payload = {
        categoryId: newCategoryId,
        serviceName: newServiceName,
        description: newDescription,
        price: parsedPrice,
        duration: parsedDuration,
        isAvailable: true,
        providerId: serviceProviderId,
      };

      console.log('Payload gửi lên API:', payload);

      const response = await axiosInstance.post('/api/Service/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Lỗi khi tạo dịch vụ');
      }

      console.log('Dịch vụ được tạo:', response.data);

      setSuccess('Tạo dịch vụ thành công');
      setViewMode('list');
      setNewServiceName('');
      setNewDescription('');
      setNewPrice('');
      setNewDuration('');
      fetchServices(token);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi tạo dịch vụ';
      if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        } else {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
        console.error('Error details:', axiosError.response?.data);
      } else if (axiosError.response?.status === 404) {
        errorMessage = 'Danh mục hoặc nhà cung cấp không tồn tại. Vui lòng kiểm tra lại.';
      }
      setError(errorMessage);
      console.error('Error creating service:', axiosError);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setEditPrice(service.price.toString());
    setEditDuration(service.duration.toString());
    setViewMode('edit');
  };

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingService) return;

    const { id, serviceName, description, categoryId, isAvailable } = editingService;

    if (!serviceName || !description || !editPrice || !editDuration || !categoryId) {
      setError('Vui lòng nhập đầy đủ thông tin dịch vụ');
      return;
    }

    const parsedPrice = parseFloat(editPrice);
    const parsedDuration = parseInt(editDuration, 10);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Đơn giá phải là một số hợp lệ và lớn hơn 0');
      return;
    }

    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      setError('Thời gian phải là một số hợp lệ và lớn hơn 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }

      const payload = {
        id,
        serviceName,
        description,
        price: parsedPrice,
        duration: parsedDuration,
        isAvailable,
        categoryId,
      };

      console.log('Payload gửi lên API để cập nhật:', payload);

      const response = await axiosInstance.put(`/api/Service/update`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi cập nhật dịch vụ');
      }

      setSuccess('Cập nhật dịch vụ thành công');
      setEditingService(null);
      setEditPrice('');
      setEditDuration('');
      setViewMode('list');
      fetchServices(token);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi cập nhật dịch vụ';
      if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        } else {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
        console.error('Error details:', axiosError.response?.data);
      } else if (axiosError.response?.status === 404) {
        errorMessage = 'Dịch vụ không tồn tại. Vui lòng kiểm tra lại.';
      }
      setError(errorMessage);
      console.error('Error updating service:', axiosError);
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
  }, [serviceProviderId, token, location.state]);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Không xác định';
  };

  const formatDuration = (duration: number | undefined) => {
    if (duration === undefined || duration === null || isNaN(duration)) {
      return 'Không xác định';
    }
    return `${duration} phút`;
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategoryId ? service.categoryId === selectedCategoryId : true;
    const matchesAvailability = showAvailableOnly ? service.isAvailable : true;
    return matchesCategory && matchesAvailability;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý dịch vụ</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        {viewMode === 'create' ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Tạo dịch vụ mới</h3>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div>
                <Label htmlFor="category">Danh mục dịch vụ</Label>
                {loading ? (
                  <p className="text-gray-600">Đang tải danh mục dịch vụ...</p>
                ) : categories.length === 0 ? (
                  <p className="text-gray-600">Không có danh mục dịch vụ nào. Vui lòng liên hệ quản trị viên để tạo danh mục.</p>
                ) : (
                  <select
                    id="category"
                    value={newCategoryId}
                    onChange={(e) => setNewCategoryId(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <Label htmlFor="serviceName">Tên dịch vụ</Label>
                <Input
                  id="serviceName"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Nhập tên dịch vụ"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Nhập mô tả dịch vụ"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Đơn giá (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Nhập đơn giá"
                  required
                  min="1"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="duration">Thời gian (phút)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="Nhập thời gian"
                  required
                  min="1"
                  step="1"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading || categories.length === 0 || !serviceProviderId}>
                  {loading ? 'Đang tạo...' : 'Tạo dịch vụ'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setViewMode('list');
                    setNewServiceName('');
                    setNewDescription('');
                    setNewPrice('');
                    setNewDuration('');
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        ) : viewMode === 'edit' && editingService ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa dịch vụ</h3>
            <form onSubmit={handleUpdateService} className="space-y-4">
              <div>
                <Label htmlFor="serviceName">Tên dịch vụ</Label>
                <Input
                  id="serviceName"
                  value={editingService.serviceName}
                  onChange={(e) => setEditingService({ ...editingService, serviceName: e.target.value })}
                  placeholder="Nhập tên dịch vụ"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Danh mục dịch vụ</Label>
                <select
                  id="category"
                  value={editingService.categoryId}
                  onChange={(e) => setEditingService({ ...editingService, categoryId: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Nhập mô tả dịch vụ"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Đơn giá (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Nhập đơn giá"
                  required
                  min="1"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="duration">Thời gian (phút)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  placeholder="Nhập thời gian"
                  required
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <Label htmlFor="isAvailable">Trạng thái</Label>
                <Checkbox
                  id="isAvailable"
                  checked={editingService.isAvailable}
                  onCheckedChange={(checked) => setEditingService({ ...editingService, isAvailable: !!checked })}
                />
                <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-600">
                  Có sẵn
                </label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingService(null);
                    setEditPrice('');
                    setEditDuration('');
                    setViewMode('list');
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Danh sách dịch vụ</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="categoryFilter">Lọc theo danh mục</Label>
                  <select
                    id="categoryFilter"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
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
                <Button onClick={() => setViewMode('create')}>
                  Thêm dịch vụ mới
                </Button>
              </div>
            </div>
            {loading ? (
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            ) : filteredServices.length === 0 ? (
              <p className="text-gray-600">
                {showAvailableOnly || selectedCategoryId
                  ? 'Không có dịch vụ nào phù hợp với bộ lọc. Vui lòng kiểm tra lại.'
                  : 'Chưa có dịch vụ nào. Vui lòng tạo dịch vụ mới.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2 text-left">Tên dịch vụ</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Danh mục</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Mô tả</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Giá (VNĐ)</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Thời gian (phút)</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{service.serviceName}</td>
                        <td className="border border-gray-200 px-4 py-2">{getCategoryName(service.categoryId)}</td>
                        <td className="border border-gray-200 px-4 py-2">{service.description}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          {service.price.toLocaleString('vi-VN')}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">{formatDuration(service.duration)}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditService(service)}
                            className="mr-2"
                            disabled={loading}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteService(service.id)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderServices;