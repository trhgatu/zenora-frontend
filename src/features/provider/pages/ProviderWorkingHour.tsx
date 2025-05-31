import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';

// Định nghĩa kiểu ErrorResponse
interface ErrorResponse {
  message?: string;
  statusCode?: number;
  errors?: { [key: string]: string[] };
}

interface WorkingHour {
  id: string;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
  isWorking: boolean;
  providerId: string;
  spaBranchLocationId: string;
}

interface ApiResponse<T> {
  data: T;
  additionalData: any;
  message: string | null;
  statusCode: number;
  code: string;
}

interface ServiceProviderResponse {
  id: string;
  providerId: string;
  businessName: string;
  imageUrl: string;
  description: string;
}

const ProviderWorkingHour: React.FC = () => {
  const { token, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentWorkingHour, setCurrentWorkingHour] = useState<WorkingHour | null>(null);
  const [formData, setFormData] = useState({
    dayOfWeek: 0,
    openingTime: '',
    closingTime: '',
    isWorking: true,
    providerId: '',
    spaBranchLocationId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [serviceProviderId, setServiceProviderId] = useState<string | null>(null);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate]);

  // Lấy thông tin ServiceProviderId
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
      const matchingProvider = serviceProviders.find((provider) => provider.providerId === user._id);

      if (!matchingProvider) {
        throw new Error('Không tìm thấy nhà cung cấp phù hợp');
      }

      setServiceProviderId(matchingProvider.id);
      setFormData((prev) => ({
        ...prev,
        providerId: matchingProvider.providerId,
        spaBranchLocationId: matchingProvider.id, // Giả định spaBranchLocationId là serviceProviderId
      }));
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
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      }
      setError(errorMessage);
      console.error('Lỗi khi lấy ServiceProviderId:', err);
    }
  };

  // Lấy danh sách giờ làm việc
  const fetchWorkingHours = async () => {
    if (!token || !serviceProviderId) return;

    try {
      const response = await axiosInstance.get(`/api/WorkingHour`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNumber, pageSize },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách giờ làm việc');
      }

      const responseData: ApiResponse<{ items: WorkingHour[]; totalPages: number }> = response.data;
      setWorkingHours(responseData.data.items || []);
      setTotalPages(responseData.data.totalPages || 0);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách giờ làm việc';
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      }
      setError(errorMessage);
      console.error('Error fetching working hours:', {
        message: errorMessage,
        status: axiosError.response?.status,
        responseData: axiosError.response?.data,
      });
    }
  };

  // Lấy chi tiết giờ làm việc theo ID
  const fetchWorkingHourById = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/WorkingHour/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy chi tiết giờ làm việc');
      }

      const responseData: ApiResponse<WorkingHour> = response.data;
      setCurrentWorkingHour(responseData.data);
      setFormData({
        dayOfWeek: responseData.data.dayOfWeek,
        openingTime: responseData.data.openingTime,
        closingTime: responseData.data.closingTime,
        isWorking: responseData.data.isWorking,
        providerId: responseData.data.providerId,
        spaBranchLocationId: responseData.data.spaBranchLocationId,
      });
      setIsEditing(true);
      setIsFormVisible(true);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy chi tiết giờ làm việc';
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      }
      setError(errorMessage);
      console.error('Error fetching working hour by ID:', {
        message: errorMessage,
        status: axiosError.response?.status,
        responseData: axiosError.response?.data,
      });
    }
  };

  // Tạo hoặc cập nhật giờ làm việc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);

      // Kiểm tra dữ liệu đầu vào
      if (!formData.providerId || !formData.spaBranchLocationId) {
        setError('Không tìm thấy thông tin nhà cung cấp. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }

      if (!formData.openingTime || !formData.closingTime) {
        setError('Vui lòng nhập giờ mở cửa và giờ đóng cửa.');
        return;
      }

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }

      const payload = {
        ...formData,
        ...(isEditing && currentWorkingHour ? { id: currentWorkingHour.id } : {}),
      };

      console.log('Payload gửi lên API:', payload);

      const response = isEditing
        ? await axiosInstance.put('/api/WorkingHour', payload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : await axiosInstance.post('/api/WorkingHour', payload, {
            headers: { Authorization: `Bearer ${token}` },
          });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(isEditing ? 'Lỗi khi cập nhật giờ làm việc' : 'Lỗi khi tạo giờ làm việc');
      }

      setSuccess(isEditing ? 'Cập nhật giờ làm việc thành công!' : 'Tạo giờ làm việc thành công!');
      setIsEditing(false);
      setCurrentWorkingHour(null);
      setFormData({
        dayOfWeek: 0,
        openingTime: '',
        closingTime: '',
        isWorking: true,
        providerId: formData.providerId,
        spaBranchLocationId: formData.spaBranchLocationId,
      });
      setIsFormVisible(false);
      fetchWorkingHours();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || (isEditing ? 'Lỗi khi cập nhật giờ làm việc' : 'Lỗi khi tạo giờ làm việc');
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        } else {
          errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
        }
      }
      setError(errorMessage);
      console.error('Error saving working hour:', {
        message: errorMessage,
        status: axiosError.response?.status,
        responseData: axiosError.response?.data,
      });
    }
  };

  // Xóa giờ làm việc
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa giờ làm việc này không?')) return;

    try {
      const response = await axiosInstance.delete(`/api/WorkingHour/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi xóa giờ làm việc');
      }

      setSuccess('Xóa giờ làm việc thành công!');
      fetchWorkingHours();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa giờ làm việc';
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      }
      setError(errorMessage);
      console.error('Error deleting working hour:', {
        message: errorMessage,
        status: axiosError.response?.status,
        responseData: axiosError.response?.data,
      });
    }
  };

  useEffect(() => {
    if (token && user && user.role === 'Provider') {
      fetchServiceProviderId(token);
    }
  }, [token, user]);

  useEffect(() => {
    if (serviceProviderId && token) {
      fetchWorkingHours();
    }
  }, [serviceProviderId, token, pageNumber, pageSize]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Quản lý giờ làm việc</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

      {/* Nút thêm mới */}
      <div className="mb-6">
        <Button
          onClick={() => {
            setIsFormVisible(true);
            setIsEditing(false);
            setCurrentWorkingHour(null);
            setFormData({
              dayOfWeek: 0,
              openingTime: '',
              closingTime: '',
              isWorking: true,
              providerId: formData.providerId,
              spaBranchLocationId: formData.spaBranchLocationId,
            });
          }}
          disabled={!serviceProviderId}
        >
          Thêm mới
        </Button>
      </div>

      {/* Form tạo/cập nhật giờ làm việc (hiển thị khi nhấn Thêm mới hoặc Sửa) */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Cập nhật giờ làm việc' : 'Thêm giờ làm việc mới'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dayOfWeek">Ngày trong tuần</Label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={formData.dayOfWeek}
                onChange={(e) => setFormData((prev) => ({ ...prev, dayOfWeek: parseInt(e.target.value) }))}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>Chủ nhật</option>
                <option value={1}>Thứ hai</option>
                <option value={2}>Thứ ba</option>
                <option value={3}>Thứ tư</option>
                <option value={4}>Thứ năm</option>
                <option value={5}>Thứ sáu</option>
                <option value={6}>Thứ bảy</option>
              </select>
            </div>
            <div>
              <Label htmlFor="openingTime">Giờ mở cửa</Label>
              <Input
                id="openingTime"
                name="openingTime"
                type="time"
                value={formData.openingTime}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div>
              <Label htmlFor="closingTime">Giờ đóng cửa</Label>
              <Input
                id="closingTime"
                name="closingTime"
                type="time"
                value={formData.closingTime}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isWorking"
                name="isWorking"
                checked={formData.isWorking}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isWorking: !!checked }))}
              />
              <Label htmlFor="isWorking">Có làm việc</Label>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button type="submit">{isEditing ? 'Cập nhật' : 'Thêm mới'}</Button>
            <Button type="button" variant="outline" onClick={() => setIsFormVisible(false)}>
              Hủy
            </Button>
          </div>
        </form>
      )}

      {/* Danh sách giờ làm việc */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngày trong tuần</TableHead>
            <TableHead>Giờ mở cửa</TableHead>
            <TableHead>Giờ đóng cửa</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workingHours.map((hour) => (
            <TableRow key={hour.id}>
              <TableCell>{['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][hour.dayOfWeek]}</TableCell>
              <TableCell>{hour.openingTime}</TableCell>
              <TableCell>{hour.closingTime}</TableCell>
              <TableCell>{hour.isWorking ? 'Có làm việc' : 'Không làm việc'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => fetchWorkingHourById(hour.id)}>
                  Sửa
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(hour.id)}>
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Phân trang */}
      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber((prev) => prev - 1)}
        >
          Trang trước
        </Button>
        <span>
          Trang {pageNumber} / {totalPages}
        </span>
        <Button
          disabled={pageNumber === totalPages}
          onClick={() => setPageNumber((prev) => prev + 1)}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
};

export default ProviderWorkingHour;