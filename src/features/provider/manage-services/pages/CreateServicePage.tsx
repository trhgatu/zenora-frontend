import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, createService } from '../services/serviceApi';
import ServiceForm from '../components/ServiceForm';
import { ServiceCategory, ServiceFormData } from '../types/service.types';

const CreateServicePage = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const providerId = user?._id || '';
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    categoryId: '',
    serviceName: '',
    description: '',
    price: '',
    duration: '',
  });

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider' || !providerId) {
      console.log('Auth state:', { token, user, providerId });
      setError('Tài khoản không hợp lệ. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }
    const loadData = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories(token);
        console.log('Categories:', categoriesData);
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: categoriesData[0].id }));
        }
      } catch (err: any) {
        console.error('Lỗi khi tải danh mục:', err);
        setError(err.message || 'Không thể tải danh mục dịch vụ.');
        if (err.message.includes('Phiên đăng nhập')) {
          setTimeout(() => navigate('/provider/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, user, providerId, navigate]);

  const handleCreateService = async (e: React.FormEvent) => {
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
        categoryId: formData.categoryId,
        serviceName: formData.serviceName,
        description: formData.description,
        price: parsedPrice,
        duration: parsedDuration,
        isAvailable: true,
        providerId: providerId,
      };
      console.log('Payload tạo dịch vụ:', payload);
      await createService(token, payload);
      setSuccess('Tạo dịch vụ thành công.');
      setFormData({ categoryId: categories[0]?.id || '', serviceName: '', description: '', price: '', duration: '' });
      setTimeout(() => navigate('/provider/services'), 1000);
    } catch (err: any) {
      console.error('Lỗi khi tạo dịch vụ:', err);
      setError(err.message || 'Không thể tạo dịch vụ.');
      if (err.message.includes('Phiên đăng nhập')) {
        setTimeout(() => navigate('/provider/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tạo dịch vụ</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        <ServiceForm
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          loading={loading}
          onSubmit={handleCreateService}
          onCancel={() => navigate('/provider/services')}
        />
      </div>
    </div>
  );
};

export default CreateServicePage;