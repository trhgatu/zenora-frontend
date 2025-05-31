import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  discountAmount: number;
  quantity: number;
  startDate: string;
  endDate: string;
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

interface PaginatedResponse {
  items: Promotion[];
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

const ProviderPromotions = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // State để điều khiển chế độ hiển thị
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');

  // State cho form thêm/chỉnh sửa promotion
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formDiscountPercent, setFormDiscountPercent] = useState<string>('');
  const [formDiscountAmount, setFormDiscountAmount] = useState<string>('');
  const [formQuantity, setFormQuantity] = useState<string>('');
  const [formStartDate, setFormStartDate] = useState<string>('');
  const [formEndDate, setFormEndDate] = useState<string>('');

  // State cho chỉnh sửa promotion
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  // State cho lọc theo tiêu đề
  const [filterTitle, setFilterTitle] = useState<string>('');

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?._id) {
        throw new Error('Không tìm thấy ID nhà cung cấp. Vui lòng đăng nhập lại.');
      }

      const response = await axiosInstance.get(`/api/Promotion/by-provider/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<Promotion[]> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy danh sách promotion');
      }

      let fetchedPromotions: Promotion[] = [];
      if (Array.isArray(responseData.data)) {
        fetchedPromotions = responseData.data;
      } else {
        throw new Error('Dữ liệu trả về không phải là mảng');
      }

      // Lọc theo tiêu đề nếu có
      if (filterTitle) {
        fetchedPromotions = fetchedPromotions.filter(promotion =>
          promotion.title.toLowerCase().includes(filterTitle.toLowerCase())
        );
      }

      setPromotions(fetchedPromotions);
      setTotalPages(1); // API /by-provider không hỗ trợ phân trang
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách promotion';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi lấy danh sách promotion. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi lấy danh sách promotion');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!formTitle || !formDescription || !formQuantity || !formStartDate || !formEndDate) {
      setError('Vui lòng nhập đầy đủ thông tin promotion (trừ mức giảm giá, chỉ cần nhập một loại)');
      return;
    }

    // Chuyển đổi dữ liệu
    const discountPercent = parseFloat(formDiscountPercent) || 0;
    const discountAmount = parseFloat(formDiscountAmount) || 0;
    const quantity = parseInt(formQuantity, 10);

    // Kiểm tra mức giảm giá: ít nhất một trường phải lớn hơn 0
    if (discountPercent === 0 && discountAmount === 0) {
      setError('Phải nhập ít nhất một loại mức giảm giá (theo % hoặc số tiền)');
      return;
    }

    // Kiểm tra giá trị âm
    if (discountPercent < 0) {
      setError('Mức giảm giá (%) phải không âm');
      return;
    }

    if (discountAmount < 0) {
      setError('Mức giảm giá (số tiền) phải không âm');
      return;
    }

    if (isNaN(quantity) || quantity <= 0) {
      setError('Số lượng phải là một số hợp lệ và lớn hơn 0');
      return;
    }

    // Kiểm tra ngày bắt đầu và ngày kết thúc
    const startDate = new Date(formStartDate);
    const endDate = new Date(formEndDate);
    const currentDate = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setError('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ. Vui lòng kiểm tra định dạng ngày.');
      return;
    }

    if (startDate < currentDate) {
      setError('Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại (03:55 PM +07, Tuesday, May 27, 2025)');
      return;
    }

    if (endDate <= startDate) {
      setError('Ngày kết thúc phải lớn hơn ngày bắt đầu');
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

      if (editingPromotion && !editingPromotion.id) {
        setError('Không tìm thấy ID của promotion để cập nhật. Vui lòng thử lại.');
        return;
      }

      const payload = {
        ...(editingPromotion ? { id: editingPromotion.id } : {}),
        title: formTitle.trim(),
        description: formDescription.trim(),
        discountPercent: discountPercent,
        discountAmount: discountAmount,
        quantity: quantity,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      console.log('Payload gửi lên API:', payload);

      let response;
      if (editingPromotion) {
        // Chế độ chỉnh sửa
        response = await axiosInstance.put('/api/Promotion/update', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Chế độ thêm
        response = await axiosInstance.post('/api/Promotion/create', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data.message || `Lỗi khi ${editingPromotion ? 'cập nhật' : 'thêm'} promotion`);
      }

      setSuccess(`${editingPromotion ? 'Cập nhật' : 'Thêm'} promotion thành công`);
      setFormTitle('');
      setFormDescription('');
      setFormDiscountPercent('');
      setFormDiscountAmount('');
      setFormQuantity('');
      setFormStartDate('');
      setFormEndDate('');
      setEditingPromotion(null);
      setViewMode('list');
      fetchPromotions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || `Lỗi khi ${editingPromotion ? 'cập nhật' : 'thêm'} promotion`;
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi xử lý promotion. Vui lòng kiểm tra log backend tại beautyspaapi20250516125713-h6h7bee3h7gyenhy.canadacentral-01.azurewebsites.net hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        } else if (axiosError.response?.status === 400) {
          if (axiosError.response?.data?.errors) {
            errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
          }
        } else if (axiosError.response?.status === 404) {
          errorMessage = 'Không tìm thấy promotion để cập nhật. Vui lòng thử lại hoặc liên hệ quản trị viên.';
        }
        setError(errorMessage);
      } else {
        setError(`Lỗi không xác định khi ${editingPromotion ? 'cập nhật' : 'thêm'} promotion. Vui lòng thử lại.`);
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormTitle(promotion.title);
    setFormDescription(promotion.description);
    setFormDiscountPercent(promotion.discountPercent.toString());
    setFormDiscountAmount(promotion.discountAmount.toString());
    setFormQuantity(promotion.quantity.toString());
    setFormStartDate(promotion.startDate);
    setFormEndDate(promotion.endDate);
    setViewMode('edit');
  };

  const handleDeletePromotion = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.delete(`/api/Promotion/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi xóa promotion');
      }

      setSuccess('Xóa promotion thành công');
      fetchPromotions();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa promotion';
        if (axiosError.response?.status === 500) {
          errorMessage = 'Lỗi server khi xóa promotion. Vui lòng thử lại sau hoặc liên hệ quản trị viên.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
          setTimeout(() => navigate('/provider/login'), 2000);
        }
        setError(errorMessage);
      } else {
        setError('Lỗi không xác định khi xóa promotion');
      }
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list' && token && user) {
      fetchPromotions();
    }
  }, [viewMode, filterTitle, token, user]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý Promotion</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      {viewMode === 'list' ? (
        <div className="bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Danh sách Promotion</h3>
            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="filterTitle">Tìm kiếm theo tiêu đề</Label>
                <Input
                  id="filterTitle"
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                  placeholder="Nhập tiêu đề khuyến mãi"
                  className="w-64"
                />
              </div>
              <Button onClick={() => setViewMode('add')}>Thêm khuyến mãi</Button>
            </div>
          </div>
          {loading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : promotions.length === 0 ? (
            <p className="text-gray-600">Chưa có promotion nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Tiêu đề</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Mô tả</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Mức giảm giá (%)</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Mức giảm giá (VNĐ)</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Số lượng</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Bắt đầu</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Kết thúc</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => (
                    <tr key={promotion.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">{promotion.title}</td>
                      <td className="border border-gray-200 px-4 py-2">{promotion.description}</td>
                      <td className="border border-gray-200 px-4 py-2">{promotion.discountPercent}</td>
                      <td className="border border-gray-200 px-4 py-2">{promotion.discountAmount.toLocaleString('vi-VN')}</td>
                      <td className="border border-gray-200 px-4 py-2">{promotion.quantity}</td>
                      <td className="border border-gray-200 px-4 py-2">{new Date(promotion.startDate).toLocaleString()}</td>
                      <td className="border border-gray-200 px-4 py-2">{new Date(promotion.endDate).toLocaleString()}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEditPromotion(promotion)}
                          className="mr-2"
                          disabled={loading}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeletePromotion(promotion.id)}
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
      ) : (
        <div className="bg-white p-6 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-4">{viewMode === 'edit' ? 'Chỉnh sửa Promotion' : 'Thêm Promotion mới'}</h3>
          <form onSubmit={handlePromotionSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Nhập tiêu đề khuyến mãi"
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Nhập mô tả khuyến mãi"
              />
            </div>
            <div>
              <Label htmlFor="discountPercent">Mức giảm giá (%)</Label>
              <Input
                id="discountPercent"
                type="number"
                value={formDiscountPercent}
                onChange={(e) => {
                  setFormDiscountPercent(e.target.value);
                  if (e.target.value && parseFloat(e.target.value) > 0) {
                    setFormDiscountAmount('0'); // Đặt mức giảm giá (số tiền) thành 0 nếu mức giảm giá (%) có giá trị
                  }
                }}
                placeholder="Nhập mức giảm giá (%)"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="discountAmount">Mức giảm giá (số tiền)</Label>
              <Input
                id="discountAmount"
                type="number"
                value={formDiscountAmount}
                onChange={(e) => {
                  setFormDiscountAmount(e.target.value);
                  if (e.target.value && parseFloat(e.target.value) > 0) {
                    setFormDiscountPercent('0'); // Đặt mức giảm giá (%) thành 0 nếu mức giảm giá (số tiền) có giá trị
                  }
                }}
                placeholder="Nhập mức giảm giá (số tiền)"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                value={formQuantity}
                onChange={(e) => setFormQuantity(e.target.value)}
                placeholder="Nhập số lượng"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {viewMode === 'edit' ? 'Cập nhật' : 'Thêm Promotion'}
              </Button>
              <Button type="button" variant="outline" onClick={() => {
                setEditingPromotion(null);
                setFormTitle('');
                setFormDescription('');
                setFormDiscountPercent('');
                setFormDiscountAmount('');
                setFormQuantity('');
                setFormStartDate('');
                setFormEndDate('');
                setViewMode('list');
              }}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProviderPromotions;