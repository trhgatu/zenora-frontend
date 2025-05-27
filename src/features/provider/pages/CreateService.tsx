import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

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

interface ApiResponse {
  data: {
    items: ServiceCategory[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
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

const CreateService = () => {
  const { token, user } = useAppSelector(state => state.auth);
  const providerId = user?._id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [subImages, setSubImages] = useState<string[]>([]);
  const [subImageInput, setSubImageInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          setTimeout(() => navigate('/provider/login'), 2000);
          return;
        }

        const response = await axiosInstance.get('/api/ServiceCategory/get-all', {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageNumber: 1, pageSize: 10 },
        });

        if (response.status !== 200) {
          throw new Error(`Lỗi khi lấy danh sách danh mục dịch vụ (Status: ${response.status})`);
        }

        const responseData: ApiResponse = response.data;
        const fetchedCategories = responseData.data?.items || [];

        if (!Array.isArray(fetchedCategories)) {
          throw new Error('Dữ liệu trả về không đúng định dạng: ' + JSON.stringify(response.data));
        }

        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategoryId(fetchedCategories[0].id);
        } else {
          setError('Không có danh mục dịch vụ nào. Vui lòng liên hệ quản trị viên để tạo danh mục.');
        }
      } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách danh mục dịch vụ';
        if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        } else if (axiosError.response?.status === 400) {
          errorMessage = 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy danh mục dịch vụ. Vui lòng kiểm tra endpoint hoặc liên hệ backend.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server. Vui lòng kiểm tra backend.';
        }
        setError(errorMessage);
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token, navigate]);

  const handleAddSubImage = () => {
    if (subImageInput.trim()) {
      setSubImages([...subImages, subImageInput.trim()]);
      setSubImageInput('');
    }
  };

  const handleRemoveSubImage = (index: number) => {
    setSubImages(subImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategoryId || !serviceName || !description || !price || !duration) {
      setError('Vui lòng nhập đầy đủ thông tin dịch vụ');
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedDuration = parseInt(duration, 10);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Đơn giá phải là một số hợp lệ và lớn hơn 0');
      return;
    }

    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      setError('Thời gian phải là một số hợp lệ và lớn hơn 0');
      return;
    }

    if (!providerId) {
      setError('Không tìm thấy thông tin nhà cung cấp. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    const selectedCategory = categories.find(category => category.id === selectedCategoryId);
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
        categoryId: selectedCategoryId,
        serviceName,
        description,
        price: parsedPrice,
        duration: parsedDuration,
        isAvailable: true,
        mainImage: mainImage || null,
        subImages,
        providerId,
      };

      console.log('Payload gửi lên API:', payload);

      const response = await axiosInstance.post('/api/Service/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Lỗi khi tạo dịch vụ');
      }

      setSuccess('Tạo dịch vụ thành công');
      setTimeout(() => navigate('/provider/services', { state: { refresh: true } }), 2000); // Chuyển hướng với state
      setSelectedCategoryId(categories.length > 0 ? categories[0].id : '');
      setServiceName('');
      setDescription('');
      setPrice('');
      setDuration('');
      setMainImage('');
      setSubImages([]);
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Tạo dịch vụ mới</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <div>
          <Label htmlFor="category">Danh mục dịch vụ</Label>
          {loading ? (
            <p className="text-gray-600">Đang tải danh mục dịch vụ...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-600">Không có danh mục dịch vụ nào. Vui lòng liên hệ quản trị viên để tạo danh mục.</p>
          ) : (
            <select
              id="category"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
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
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Nhập tên dịch vụ"
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả dịch vụ"
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Đơn giá (VNĐ)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Nhập thời gian"
            required
            min="1"
            step="1"
          />
        </div>
        <div>
          <Label htmlFor="mainImage">Hình ảnh chính (URL)</Label>
          <Input
            id="mainImage"
            value={mainImage}
            onChange={(e) => setMainImage(e.target.value)}
            placeholder="Nhập URL hình ảnh chính (tùy chọn)"
          />
        </div>
        <div>
          <Label htmlFor="subImages">Hình ảnh phụ (URL)</Label>
          <div className="flex space-x-2">
            <Input
              id="subImages"
              value={subImageInput}
              onChange={(e) => setSubImageInput(e.target.value)}
              placeholder="Nhập URL hình ảnh phụ"
            />
            <Button type="button" onClick={handleAddSubImage}>
              Thêm
            </Button>
          </div>
          {subImages.length > 0 && (
            <ul className="mt-2 space-y-1">
              {subImages.map((img, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{img}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveSubImage(index)}
                  >
                    Xóa
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={loading || categories.length === 0 || !providerId}>
          {loading ? 'Đang tạo...' : 'Tạo dịch vụ'}
        </Button>
      </form>
    </div>
  );
};

export default CreateService;