import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import axiosInstance from '@/services/axios';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface Staff {
  id: string;
  branchId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  gender: string;
  yearsOfExperience: number;
  serviceCategoryIds: string[];
  createdTime: string;
  lastUpdatedTime: string;
  deletedTime: string | null;
}

interface Branch {
  id: string;
  branchName: string;
}

interface ServiceCategory {
  id: string;
  categoryName: string;
}

interface PaginatedResponse {
  items: Staff[];
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
  message?: string;
  statusCode?: number;
  errors?: any;
}

const ProviderStaff = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [filterName, setFilterName] = useState<string>('');
  const [filterBranchId, setFilterBranchId] = useState<string>('');
  const [filterServiceCategoryId, setFilterServiceCategoryId] = useState<string>(''); // Bộ lọc theo danh mục dịch vụ

  const [newStaff, setNewStaff] = useState({
    branchId: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    avatarUrl: '',
    gender: '',
    yearsOfExperience: 0,
    serviceCategoryIds: [] as string[],
  });

  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    if (user._id) {
      fetchBranches();
      fetchServiceCategories();
      fetchStaff();
    } else {
      setError('Không tìm thấy thông tin nhà cung cấp từ tài khoản. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate, currentPage, filterBranchId, filterName, filterServiceCategoryId]);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse<Branch[]>>('/api/SpaBranchLocation/by-provider/' + user?._id, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách chi nhánh');
      }

      setBranches(response.data.data || []);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách chi nhánh');
    }
  };

  const fetchServiceCategories = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse<{ items: ServiceCategory[] }>>('/api/ServiceCategory/get-all', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pageNumber: 1, pageSize: 100 },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách danh mục dịch vụ');
      }

      setServiceCategories(response.data.data.items || []);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách danh mục dịch vụ');
    }
  };

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?._id) {
        throw new Error('Không tìm thấy ID nhà cung cấp. Vui lòng đăng nhập lại.');
      }

      const response = await axiosInstance.get('/api/Staff/get-all', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          pageNumber: currentPage,
          pageSize: pageSize,
        },
      });

      const responseData: ApiResponse<PaginatedResponse> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy danh sách nhân viên');
      }

      let fetchedStaff = responseData.data.items || [];

      // Lọc theo chi nhánh nếu có
      if (filterBranchId) {
        fetchedStaff = await fetchStaffByBranch(filterBranchId);
      }

      // Lọc theo danh mục dịch vụ nếu có
      if (filterServiceCategoryId) {
        fetchedStaff = fetchedStaff.filter(staff =>
          staff.serviceCategoryIds.includes(filterServiceCategoryId)
        );
      }

      // Lọc theo tên nhân viên nếu có
      if (filterName) {
        fetchedStaff = fetchedStaff.filter(staff =>
          staff.fullName.toLowerCase().includes(filterName.toLowerCase())
        );
      }

      setStaffList(fetchedStaff);
      setTotalPages(responseData.data.totalPages || 1);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách nhân viên';
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi lấy danh sách nhân viên. Vui lòng kiểm tra log backend hoặc liên hệ quản trị viên.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffByBranch = async (branchId: string): Promise<Staff[]> => {
    try {
      const response = await axiosInstance.get(`/api/Staff/by-branch/${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<Staff[]> = response.data;
      if (response.status !== 200 || responseData.statusCode !== 200) {
        throw new Error(responseData.message || 'Lỗi khi lấy danh sách nhân viên theo chi nhánh');
      }

      return responseData.data || [];
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách nhân viên theo chi nhánh');
      return [];
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newStaff.branchId ||
      !newStaff.fullName ||
      !newStaff.phoneNumber ||
      !newStaff.email ||
      !newStaff.gender ||
      newStaff.yearsOfExperience < 0 ||
      !newStaff.serviceCategoryIds.length
    ) {
      setError('Vui lòng nhập đầy đủ thông tin nhân viên');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.post('/api/Staff', newStaff, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<Staff> = response.data;
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(responseData.message || 'Lỗi khi thêm nhân viên');
      }

      setSuccess('Thêm nhân viên thành công');
      setNewStaff({
        branchId: '',
        fullName: '',
        phoneNumber: '',
        email: '',
        avatarUrl: '',
        gender: '',
        yearsOfExperience: 0,
        serviceCategoryIds: [],
      });
      setViewMode('list');
      fetchStaff();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi thêm nhân viên';
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi thêm nhân viên. Vui lòng kiểm tra log backend hoặc liên hệ quản trị viên.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStaff = async (staff: Staff) => {
    setEditingStaff(staff);
    setViewMode('edit');
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingStaff) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const payload = {
        id: editingStaff.id,
        branchId: editingStaff.branchId,
        fullName: editingStaff.fullName,
        phoneNumber: editingStaff.phoneNumber,
        email: editingStaff.email,
        avatarUrl: editingStaff.avatarUrl,
        gender: editingStaff.gender,
        yearsOfExperience: editingStaff.yearsOfExperience,
        serviceCategoryIds: editingStaff.serviceCategoryIds,
      };

      const response = await axiosInstance.put('/api/Staff', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<Staff> = response.data;
      if (response.status !== 200) {
        throw new Error(responseData.message || 'Lỗi khi cập nhật nhân viên');
      }

      setSuccess('Cập nhật nhân viên thành công');
      setEditingStaff(null);
      setViewMode('list');
      fetchStaff();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi cập nhật nhân viên';
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi cập nhật nhân viên. Vui lòng kiểm tra log backend hoặc liên hệ quản trị viên.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await axiosInstance.delete(`/api/Staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const responseData: ApiResponse<any> = response.data;
      if (response.status !== 200) {
        throw new Error(responseData.message || 'Lỗi khi xóa nhân viên');
      }

      setSuccess('Xóa nhân viên thành công');
      fetchStaff();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa nhân viên';
      if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server khi xóa nhân viên. Vui lòng kiểm tra log backend hoặc liên hệ quản trị viên.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, isEditing: boolean) => {
    const { name, value } = e.target;
    if (isEditing && editingStaff) {
      setEditingStaff({ ...editingStaff, [name]: value });
    } else {
      setNewStaff({ ...newStaff, [name]: value });
    }
  };

  const handleServiceCategoryChange = (categoryId: string, isEditing: boolean) => {
    if (isEditing && editingStaff) {
      const updatedCategories = editingStaff.serviceCategoryIds.includes(categoryId)
        ? editingStaff.serviceCategoryIds.filter(id => id !== categoryId)
        : [...editingStaff.serviceCategoryIds, categoryId];
      setEditingStaff({ ...editingStaff, serviceCategoryIds: updatedCategories });
    } else {
      const updatedCategories = newStaff.serviceCategoryIds.includes(categoryId)
        ? newStaff.serviceCategoryIds.filter(id => id !== categoryId)
        : [...newStaff.serviceCategoryIds, categoryId];
      setNewStaff({ ...newStaff, serviceCategoryIds: updatedCategories });
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý nhân viên</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

      {viewMode === 'list' ? (
        <div className="bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Danh sách nhân viên</h3>
            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="filterName">Tìm kiếm theo tên</Label>
                <Input
                  id="filterName"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Nhập tên nhân viên"
                  className="w-64"
                />
              </div>
              <div>
                <Label htmlFor="filterBranch">Lọc theo chi nhánh</Label>
                <select
                  id="filterBranch"
                  value={filterBranchId}
                  onChange={(e) => setFilterBranchId(e.target.value)}
                  className="w-64 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả chi nhánh</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.branchName}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="filterServiceCategory">Lọc theo danh mục dịch vụ</Label>
                <select
                  id="filterServiceCategory"
                  value={filterServiceCategoryId}
                  onChange={(e) => setFilterServiceCategoryId(e.target.value)}
                  className="w-64 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả danh mục</option>
                  {serviceCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.categoryName}</option>
                  ))}
                </select>
              </div>
              <Button onClick={() => setViewMode('add')}>
                Thêm nhân viên
              </Button>
            </div>
          </div>
          {loading ? (
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          ) : staffList.length === 0 ? (
            <p className="text-gray-600">Chưa có nhân viên nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-200 px-4 py-2 text-left">Ảnh đại diện</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Tên nhân viên</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Chi nhánh</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Số điện thoại</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Giới tính</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Kinh nghiệm (năm)</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Danh mục dịch vụ</th>
                    <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        {staff.avatarUrl ? (
                          <img
                            src={staff.avatarUrl}
                            alt={staff.fullName}
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64')} // Tăng kích thước lên 64x64
                          />
                        ) : (
                          <img
                            src="https://via.placeholder.com/64"
                            alt="No avatar"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{staff.fullName}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        {branches.find(branch => branch.id === staff.branchId)?.branchName || 'Không xác định'}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">{staff.phoneNumber}</td>
                      <td className="border border-gray-200 px-4 py-2">{staff.email}</td>
                      <td className="border border-gray-200 px-4 py-2">{staff.gender}</td>
                      <td className="border border-gray-200 px-4 py-2">{staff.yearsOfExperience}</td>
                      <td className="border border-gray-200 px-4 py-2">
                        {staff.serviceCategoryIds.map(id => 
                          serviceCategories.find(cat => cat.id === id)?.categoryName || 'Không xác định'
                        ).join(', ')}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEditStaff(staff)}
                          className="mr-2"
                          disabled={loading}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteStaff(staff.id)}
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
          <h3 className="text-lg font-semibold mb-4">{viewMode === 'edit' ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</h3>
          <form onSubmit={viewMode === 'edit' ? handleUpdateStaff : handleStaffSubmit} className="space-y-4">
            <div>
              <Label htmlFor="branchId">Chi nhánh</Label>
              <select
                id="branchId"
                name="branchId"
                value={viewMode === 'edit' ? editingStaff?.branchId : newStaff.branchId}
                onChange={(e) => handleInputChange(e, viewMode === 'edit')}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn chi nhánh</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.branchName}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="fullName">Họ tên</Label>
              <Input
                id="fullName"
                name="fullName"
                value={viewMode === 'edit' ? editingStaff?.fullName : newStaff.fullName}
                onChange={(e) => handleInputChange(e, viewMode === 'edit')}
                placeholder="Nhập họ tên nhân viên"
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={viewMode === 'edit' ? editingStaff?.phoneNumber : newStaff.phoneNumber}
                onChange={(e) => handleInputChange(e, viewMode === 'edit')}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={viewMode === 'edit' ? editingStaff?.email : newStaff.email}
                onChange={(e) => handleInputChange(e, viewMode === 'edit')}
                placeholder="Nhập email"
                required
              />
            </div>
            <div>
              <Label htmlFor="avatarUrl">URL ảnh đại diện</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                value={viewMode === 'edit' ? editingStaff?.avatarUrl : newStaff.avatarUrl}
                onChange={(e) => handleInputChange(e, viewMode === 'edit')}
                placeholder="Nhập URL ảnh đại diện (nếu có)"
              />
              {(viewMode === 'edit' ? editingStaff?.avatarUrl : newStaff.avatarUrl) && (
                <div className="mt-2">
                  <img
                    src={viewMode === 'edit' ? editingStaff?.avatarUrl : newStaff.avatarUrl}
                    alt="Avatar Preview"
                    className="w-32 h-32 rounded-full object-cover" // Tăng kích thước lên 128x128
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/128')} // Tăng kích thước placeholder
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="gender">Giới tính</Label>
              <select
                id="gender"
                name="gender"
                value={viewMode === 'edit' ? editingStaff?.gender : newStaff.gender}
                onChange={(e) => handleInputChange(e, viewMode === 'edit')}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div>
              <Label htmlFor="yearsOfExperience">Số năm kinh nghiệm</Label>
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                value={viewMode === 'edit' ? editingStaff?.yearsOfExperience : newStaff.yearsOfExperience}
                onChange={(e) => handleInputChange(e, viewMode === 'edit')}
                placeholder="Nhập số năm kinh nghiệm"
                min="0"
                required
              />
            </div>
            <div>
              <Label>Danh mục dịch vụ</Label>
              <div className="flex flex-wrap gap-2">
                {serviceCategories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={
                        viewMode === 'edit'
                          ? editingStaff?.serviceCategoryIds.includes(category.id)
                          : newStaff.serviceCategoryIds.includes(category.id)
                      }
                      onCheckedChange={() => handleServiceCategoryChange(category.id, viewMode === 'edit')}
                    />
                    <Label htmlFor={category.id}>{category.categoryName}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={loading}>
                {viewMode === 'edit' ? 'Cập nhật' : 'Thêm nhân viên'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (viewMode === 'edit') {
                    setEditingStaff(null);
                  } else {
                    setNewStaff({
                      branchId: '',
                      fullName: '',
                      phoneNumber: '',
                      email: '',
                      avatarUrl: '',
                      gender: '',
                      yearsOfExperience: 0,
                      serviceCategoryIds: [],
                    });
                  }
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

export default ProviderStaff;