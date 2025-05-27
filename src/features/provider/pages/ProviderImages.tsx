import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';

interface Image {
  id: string;
  url: string;
  type: string;
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
  const { token } = useAppSelector(state => state.auth);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get('/api/Image', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách hình ảnh');
      }

      setImages(response.data || []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách hình ảnh');
      } else {
        setError('Lỗi không xác định khi lấy danh sách hình ảnh');
      }
    }
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

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setError('Vui lòng chọn hình ảnh');
      return;
    }

    try {
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

      const response = await axiosInstance.post('/api/Image', {
        url: cloudinaryData.secure_url,
        type: 'customer_service_image',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi upload hình ảnh');
      }

      setSuccess('Upload hình ảnh thành công');
      setError(null);
      setImageFile(null);
      setImagePreview(null);
      fetchImages();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi upload hình ảnh');
      } else {
        setError('Lỗi không xác định khi upload hình ảnh');
      }
      setSuccess(null);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/api/Image/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi xóa hình ảnh');
      }

      setSuccess('Xóa hình ảnh thành công');
      setError(null);
      fetchImages();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi xóa hình ảnh');
      } else {
        setError('Lỗi không xác định khi xóa hình ảnh');
      }
      setSuccess(null);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý hình ảnh làm đẹp</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      <div className="bg-white p-6 rounded shadow-md mb-6">
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
          <Button type="submit">Upload hình ảnh</Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">Danh sách hình ảnh</h3>
        {images.length === 0 ? (
          <p className="text-gray-600">Chưa có hình ảnh nào.</p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="border p-4 rounded flex flex-col items-center">
                <img src={image.url} alt="Customer Service" className="w-full h-32 object-cover mb-2" />
                <Button variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                  Xóa
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderImages;