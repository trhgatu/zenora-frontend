import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories, fetchServices, updateService } from '../services/serviceApi';
import ServiceForm from '../components/ServiceForm';
import { Service, ServiceCategory, ServiceFormData } from '../types/service.types';

export const EditServicePage = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const providerId = user?._id || '';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    categoryId: '',
    serviceName: '',
    description: '',
    price: '',
    duration: '',
    isAvailable: false,
  });

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider' || !providerId || !id) {
      console.log('Auth state:', { token, user, providerId });
      setError('Tài khoản không hợp lệ hoặc không tìm thấy dịch vụ.');
      setTimeout(() => navigate('/provider/login'), 2000);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, services] = await Promise.all([
          fetchCategories(token),
          fetchServices(token, providerId),
        ]);
        console.log('Categories:', categoriesData);
        console.log('Services:', services);
        setCategories(categoriesData);
        const service = services.find((s: Service) => s.id === id);
        if (!service) {
          setError('Dịch vụ không tồn tại.');
          setTimeout(() => navigate('/provider/services'), 2000);
          return;
        }
        setFormData({
          categoryId: service.categoryId,
          serviceName: service.serviceName,
          description: service.description,
          price: service.price.toString(),
          duration: service.duration.toString(),
          isAvailable: service.isAvailable,
        });
      } catch (err: any) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError(err.message || 'Không thể tải dữ liệu dịch vụ.');
        if (err.message.includes('Phiên đăng nhập')) {
          setTimeout(() => navigate('/provider/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, user, providerId, id, navigate]);

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.serviceName || !formData.description || !formData.price || !formData.duration) {
      setError('Vui lòng nhập đầy đủ thông tin dịch vụ.');
      return;
    }

    const parsedPrice = parseFloat(formData.price);
    const parsedDuration = parseInt(formData.duration, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Đơn giá phải lớn hơn 0.');
      return;
    }
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      setError('Thời gian phải lớn hơn 0.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const payload = {
        id: id!,
        serviceName: formData.serviceName,
        description: formData.description,
        price: parsedPrice,
        duration: parsedDuration,
        isAvailable: formData.isAvailable || false,
        categoryId: formData.categoryId,
      };
      console.log('Payload cập nhật dịch vụ:', payload);
      await updateService(token, payload);
      setSuccess('Cập nhật dịch vụ thành công.');
      setTimeout(() => navigate('/provider/services'), 1000);
    } catch (err: any) {
      console.error('Lỗi khi cập nhật dịch vụ:', err);
      setError(err.message || 'Không thể cập nhật dịch vụ.');
      if (err.message.includes('Phiên đăng nhập')) {
        setTimeout(() => navigate('/provider/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Chỉnh sửa dịch vụ</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        {loading ? (
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        ) : (
          <ServiceForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            loading={loading}
            onSubmit={handleUpdateService}
            onCancel={() => navigate('/provider/services')}
            isEditMode
          />
        )}
      </div>
    </div>
  );
};
