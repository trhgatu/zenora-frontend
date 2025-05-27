import { useState } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface ErrorResponse {
  data?: any;
  additionalData?: any;
  message?: string;
  statusCode?: number;
  code?: string;
  detail?: string;
  errors?: any;
}

const ProviderManage = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  // State cho dịch vụ
  const [serviceCategoryId, setServiceCategoryId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [serviceMainImage, setServiceMainImage] = useState('');
  const [serviceSubImages, setServiceSubImages] = useState<string[]>([]);
  const [serviceSubImageInput, setServiceSubImageInput] = useState('');

  // State cho khuyến mãi
  const [promotionName, setPromotionName] = useState('');
  const [promotionDescription, setPromotionDescription] = useState('');
  const [promotionDiscount, setPromotionDiscount] = useState('');
  const [promotionStartDate, setPromotionStartDate] = useState('');
  const [promotionEndDate, setPromotionEndDate] = useState('');

  // State cho thông tin thợ
  const [staffName, setStaffName] = useState('');
  const [staffSpecialty, setStaffSpecialty] = useState('');
  const [staffExperience, setStaffExperience] = useState('');

  // State cho hình ảnh
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // State cho thông báo lỗi và thành công
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSubImage = () => {
    if (serviceSubImageInput.trim()) {
      setServiceSubImages([...serviceSubImages, serviceSubImageInput.trim()]);
      setServiceSubImageInput('');
    }
  };

  const handleRemoveSubImage = (index: number) => {
    setServiceSubImages(serviceSubImages.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setImageError('Vui lòng chọn file hình ảnh');
        return;
      }
      setImageFile(file);
      setImageError(null);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceCategoryId || !serviceName || !serviceDescription || !servicePrice || !serviceDuration) {
      setError('Vui lòng nhập đầy đủ thông tin dịch vụ');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          navigate('/provider/login');
        }, 2000);
        return;
      }

      const response = await axiosInstance.post(
        '/api/Service',
        {
          categoryId: serviceCategoryId,
          name: serviceName,
          description: serviceDescription,
          price: parseFloat(servicePrice),
          duration: parseInt(serviceDuration),
          mainImage: serviceMainImage || '',
          subImages: serviceSubImages,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Lỗi khi thêm dịch vụ');
      }

      setSuccess('Thêm dịch vụ thành công');
      setServiceCategoryId('');
      setServiceName('');
      setServiceDescription('');
      setServicePrice('');
      setServiceDuration('');
      setServiceMainImage('');
      setServiceSubImages([]);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi thêm dịch vụ';
        if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => {
            navigate('/provider/login');
          }, 2000);
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi thêm dịch vụ');
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promotionName || !promotionDescription || !promotionDiscount || !promotionStartDate || !promotionEndDate) {
      setError('Vui lòng nhập đầy đủ thông tin khuyến mãi');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          navigate('/provider/login');
        }, 2000);
        return;
      }

      const response = await axiosInstance.post(
        '/api/Promotion',
        {
          name: promotionName,
          description: promotionDescription,
          discount: parseFloat(promotionDiscount),
          startDate: new Date(promotionStartDate).toISOString(),
          endDate: new Date(promotionEndDate).toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Lỗi khi thêm khuyến mãi');
      }

      setSuccess('Thêm khuyến mãi thành công');
      setPromotionName('');
      setPromotionDescription('');
      setPromotionDiscount('');
      setPromotionStartDate('');
      setPromotionEndDate('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi thêm khuyến mãi';
        if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => {
            navigate('/provider/login');
          }, 2000);
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi thêm khuyến mãi');
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffSpecialty || !staffExperience) {
      setError('Vui lòng nhập đầy đủ thông tin thợ');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          navigate('/provider/login');
        }, 2000);
        return;
      }

      const response = await axiosInstance.post(
        '/api/Staff',
        {
          name: staffName,
          specialty: staffSpecialty,
          experience: parseInt(staffExperience),
          providerId: user?._id || '',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Lỗi khi thêm thông tin thợ');
      }

      setSuccess('Thêm thông tin thợ thành công');
      setStaffName('');
      setStaffSpecialty('');
      setStaffExperience('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi thêm thông tin thợ';
        if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => {
            navigate('/provider/login');
          }, 2000);
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi thêm thông tin thợ');
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Vui lòng chọn hình ảnh');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => {
          navigate('/provider/login');
        }, 2000);
        return;
      }

      // Upload hình ảnh lên Cloudinary
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'your_cloudinary_upload_preset');

      const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: formData,
      });
      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryData.secure_url) {
        throw new Error('Không thể upload hình ảnh lên Cloudinary');
      }

      // Lưu URL hình ảnh vào backend
      const response = await axiosInstance.post(
        '/api/Image',
        {
          url: cloudinaryData.secure_url,
          type: 'customer_service_image',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Lỗi khi upload hình ảnh');
      }

      setSuccess('Upload hình ảnh thành công');
      setImageFile(null);
      setImagePreview(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi upload hình ảnh';
        if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => {
            navigate('/provider/login');
          }, 2000);
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi upload hình ảnh');
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý thông tin Provider</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      {/* Form nhập dịch vụ */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Thêm dịch vụ</h3>
        <form onSubmit={handleServiceSubmit} className="space-y-4">
          <div>
            <Label htmlFor="serviceCategoryId">Category ID</Label>
            <Input
              id="serviceCategoryId"
              value={serviceCategoryId}
              onChange={(e) => setServiceCategoryId(e.target.value)}
              placeholder="Nhập Category ID"
            />
          </div>
          <div>
            <Label htmlFor="serviceName">Tên dịch vụ</Label>
            <Input
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Nhập tên dịch vụ"
            />
          </div>
          <div>
            <Label htmlFor="serviceDescription">Mô tả</Label>
            <Textarea
              id="serviceDescription"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Nhập mô tả dịch vụ"
            />
          </div>
          <div>
            <Label htmlFor="servicePrice">Đơn giá (VNĐ)</Label>
            <Input
              id="servicePrice"
              type="number"
              value={servicePrice}
              onChange={(e) => setServicePrice(e.target.value)}
              placeholder="Nhập đơn giá"
            />
          </div>
          <div>
            <Label htmlFor="serviceDuration">Thời gian (phút)</Label>
            <Input
              id="serviceDuration"
              type="number"
              value={serviceDuration}
              onChange={(e) => setServiceDuration(e.target.value)}
              placeholder="Nhập thời gian"
            />
          </div>
          <div>
            <Label htmlFor="serviceMainImage">Hình ảnh chính (URL)</Label>
            <Input
              id="serviceMainImage"
              value={serviceMainImage}
              onChange={(e) => setServiceMainImage(e.target.value)}
              placeholder="Nhập URL hình ảnh chính (tùy chọn)"
            />
          </div>
          <div>
            <Label htmlFor="serviceSubImages">Hình ảnh phụ (URL)</Label>
            <div className="flex space-x-2">
              <Input
                id="serviceSubImages"
                value={serviceSubImageInput}
                onChange={(e) => setServiceSubImageInput(e.target.value)}
                placeholder="Nhập URL hình ảnh phụ"
              />
              <Button type="button" onClick={handleAddSubImage}>
                Thêm
              </Button>
            </div>
            {serviceSubImages.length > 0 && (
              <ul className="mt-2 space-y-1">
                {serviceSubImages.map((img, index) => (
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang thêm...' : 'Thêm dịch vụ'}
          </Button>
        </form>
      </div>

      {/* Form nhập khuyến mãi */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Thêm khuyến mãi</h3>
        <form onSubmit={handlePromotionSubmit} className="space-y-4">
          <div>
            <Label htmlFor="promotionName">Tên khuyến mãi</Label>
            <Input
              id="promotionName"
              value={promotionName}
              onChange={(e) => setPromotionName(e.target.value)}
              placeholder="Nhập tên khuyến mãi"
            />
          </div>
          <div>
            <Label htmlFor="promotionDescription">Mô tả</Label>
            <Textarea
              id="promotionDescription"
              value={promotionDescription}
              onChange={(e) => setPromotionDescription(e.target.value)}
              placeholder="Nhập mô tả khuyến mãi"
            />
          </div>
          <div>
            <Label htmlFor="promotionDiscount">Mức giảm giá (%)</Label>
            <Input
              id="promotionDiscount"
              type="number"
              value={promotionDiscount}
              onChange={(e) => setPromotionDiscount(e.target.value)}
              placeholder="Nhập mức giảm giá"
            />
          </div>
          <div>
            <Label htmlFor="promotionStartDate">Ngày bắt đầu</Label>
            <Input
              id="promotionStartDate"
              type="datetime-local"
              value={promotionStartDate}
              onChange={(e) => setPromotionStartDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="promotionEndDate">Ngày kết thúc</Label>
            <Input
              id="promotionEndDate"
              type="datetime-local"
              value={promotionEndDate}
              onChange={(e) => setPromotionEndDate(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang thêm...' : 'Thêm khuyến mãi'}
          </Button>
        </form>
      </div>

      {/* Form nhập thông tin thợ */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Thêm thông tin thợ</h3>
        <form onSubmit={handleStaffSubmit} className="space-y-4">
          <div>
            <Label htmlFor="staffName">Tên thợ</Label>
            <Input
              id="staffName"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="Nhập tên thợ"
            />
          </div>
          <div>
            <Label htmlFor="staffSpecialty">Chuyên môn</Label>
            <Input
              id="staffSpecialty"
              value={staffSpecialty}
              onChange={(e) => setStaffSpecialty(e.target.value)}
              placeholder="Nhập chuyên môn"
            />
          </div>
          <div>
            <Label htmlFor="staffExperience">Kinh nghiệm (năm)</Label>
            <Input
              id="staffExperience"
              type="number"
              value={staffExperience}
              onChange={(e) => setStaffExperience(e.target.value)}
              placeholder="Nhập số năm kinh nghiệm"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang thêm...' : 'Thêm thông tin thợ'}
          </Button>
        </form>
      </div>

      {/* Form upload hình ảnh */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">Upload hình ảnh làm đẹp</h3>
        <form onSubmit={handleImageSubmit} className="space-y-4">
          <div>
            <Label htmlFor="image">Chọn hình ảnh</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageError && <div className="text-red-500">{imageError}</div>}
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 max-w-xs" />
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Đang upload...' : 'Upload hình ảnh'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProviderManage;