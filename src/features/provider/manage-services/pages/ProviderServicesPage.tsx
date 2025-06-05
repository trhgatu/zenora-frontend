import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { fetchCategories, fetchServices, deleteService } from '../services/serviceApi';
import { Service, ServiceCategory } from '../types/service.types';

const ProviderServicesPage = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const providerId = user?._id || '';
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider' || !providerId) {
      console.log('Auth state:', { token, user, providerId });
      setError('Tài khoản không hợp lệ. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      setLoading(false);
      return;
    }
    const loadData = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories(token);
        console.log('Categories:', categoriesData);
        setCategories(categoriesData);
        setSelectedCategoryId('');
        const servicesData = await fetchServices(token, providerId);
        console.log('Danh sách dịch vụ:', servicesData);
        setServices(servicesData);
        if (servicesData.length === 0) {
          setError('Chưa có dịch vụ nào. Vui lòng thêm dịch vụ mới.');
        }
      } catch (err: any) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError(err.message || 'Không thể tải danh sách dịch vụ.');
        if (err.message.includes('Phiên đăng nhập')) {
          setTimeout(() => navigate('/provider/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, user, providerId, navigate, location.state]);

  const handleDeleteService = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await deleteService(token, id);
      setSuccess('Xóa dịch vụ thành công');
      const data = await fetchServices(token, providerId);
      console.log('Danh sách dịch vụ sau khi xóa:', data);
      setServices(data);
    } catch (err: any) {
      console.error('Lỗi khi xóa dịch vụ:', err);
      setError(err.message || 'Không thể xóa dịch vụ.');
      if (err.message.includes('Phiên đăng nhập')) {
        setTimeout(() => navigate('/provider/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.categoryName : 'Không xác định';
  };

  const formatDuration = (duration: number | undefined) => {
    if (duration === undefined || duration === null || isNaN(duration)) {
      return 'Không xác định';
    }
    return `${duration} phút`;
  };

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategoryId ? service.categoryId === selectedCategoryId : true;
    const matchesAvailability = showAvailableOnly ? service.isAvailable : true;
    console.log('Dịch vụ:', service, 'Matches Category:', matchesCategory, 'Matches Availability:', matchesAvailability);
    return matchesCategory && matchesAvailability;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý dịch vụ</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
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
                disabled={loading}
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
                disabled={loading}
              />
              <label htmlFor="show-available" className="text-sm text-gray-600">
                Chỉ hiển thị dịch vụ có sẵn
              </label>
            </div>
            <Button
              onClick={() => navigate('/provider/services/create')}
              disabled={loading}
            >
              Thêm dịch vụ mới
            </Button>
          </div>
        </div>
        {loading ? (
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        ) : filteredServices.length === 0 ? (
          <p className="text-gray-600">
            {showAvailableOnly || selectedCategoryId
              ? 'Không có dịch vụ nào phù hợp với bộ lọc.'
              : 'Chưa có dịch vụ nào. Vui lòng thêm dịch vụ mới.'}
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
                        onClick={() => navigate(`/provider/services/edit/${service.id}`)}
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
      </div>
    </div>
  );
};

export default ProviderServicesPage;