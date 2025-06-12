import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import WorkingHourForm from '../components/WorkingHourForm';
import {
  fetchWorkingHours,
  createWorkingHour,
  updateWorkingHour,
  fetchWorkingHourById,
  deleteWorkingHour,
} from '../services/workingHourApi';
import { WorkingHour, ApiResponse } from '../types/workingHour.types';
import axiosInstance from '@/services/axios';

const ProviderWorkingHours = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [filteredWorkingHours, setFilteredWorkingHours] = useState<WorkingHour[]>([]);
  const [workingHourData, setWorkingHourData] = useState<WorkingHour>({
    dayOfWeek: 0,
    openingTime: '08:00',
    closingTime: '17:00',
    isWorking: true,
    providerId: '',
    spaBranchLocationId: '',
  });
  const [branches, setBranches] = useState<{ id: string; branchName: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [searchBranch, setSearchBranch] = useState<string>('');

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    if (user?._id) {
      setWorkingHourData((prev) => ({ ...prev, providerId: user._id }));
      fetchBranches();
      fetchWorkingHoursList();
    } else {
      setError('Không tìm thấy thông tin nhà cung cấp.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate, currentPage]);

  const fetchBranches = async () => {
    try {
      const response = await axiosInstance.get<ApiResponse<{ id: string; branchName: string }[]>>(
        `/api/SpaBranchLocation/by-provider/${user?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBranches(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách chi nhánh');
      console.error('Lỗi khi tải chi nhánh:', err);
    }
  };

  const fetchWorkingHoursList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWorkingHours(token!, currentPage, pageSize);
      setWorkingHours(data.items);
      setFilteredWorkingHours(data.items);
      setTotalPages(data.totalPages);
      if (data.items.length === 0) {
        setError('Chưa có giờ làm việc nào.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách giờ làm việc');
      console.error('Lỗi khi tải giờ làm việc:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await createWorkingHour(token!, workingHourData);
      setSuccess('Tạo giờ làm việc thành công');
      setViewMode('list');
      resetWorkingHourData();
      fetchWorkingHoursList();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tạo giờ làm việc');
      console.error('Lỗi khi tạo giờ làm việc:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await updateWorkingHour(token!, workingHourData);
      setSuccess('Cập nhật giờ làm việc thành công');
      setViewMode('list');
      resetWorkingHourData();
      fetchWorkingHoursList();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật giờ làm việc');
      console.error('Lỗi khi cập nhật giờ làm việc:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWorkingHourById(token!, id);
      setWorkingHourData(data);
      setViewMode('edit');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải chi tiết giờ làm việc');
      console.error('Lỗi khi tải chi tiết:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await deleteWorkingHour(token!, id);
      setSuccess('Xóa giờ làm việc thành công');
      fetchWorkingHoursList();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa giờ làm việc');
      console.error('Lỗi khi xóa giờ làm việc:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchBranch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchBranch(searchTerm);

    const filtered = workingHours.filter((hour) => {
      const branch = branches.find((b) => b.id === hour.spaBranchLocationId);
      return branch?.branchName.toLowerCase().includes(searchTerm);
    });

    setFilteredWorkingHours(filtered);
  };

  const resetWorkingHourData = () => {
    setWorkingHourData({
      dayOfWeek: 0,
      openingTime: '08:00',
      closingTime: '17:00',
      isWorking: true,
      providerId: user?._id || '',
      spaBranchLocationId: '',
    });
  };

  const getDayName = (day: number) => {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return days[day] || 'Không xác định';
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.branchName : 'Không xác định';
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý giờ làm việc</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        {viewMode === 'create' || viewMode === 'edit' ? (
          <WorkingHourForm
            workingHourData={workingHourData}
            setWorkingHourData={setWorkingHourData}
            handleSubmit={viewMode === 'create' ? handleCreate : handleUpdate}
            loading={loading}
            isEditing={viewMode === 'edit'}
            onCancel={() => {
              setViewMode('list');
              resetWorkingHourData();
            }}
            branches={branches}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Danh sách giờ làm việc</h3>
              <div className="flex items-center space-x-4">
                <div>
                  <Label htmlFor="searchBranch">Tìm kiếm theo chi nhánh</Label>
                  <Input
                    id="searchBranch"
                    value={searchBranch}
                    onChange={handleSearchBranch}
                    placeholder="Nhập tên chi nhánh"
                    className="w-64"
                  />
                </div>
                <Button
                  onClick={() => setViewMode('create')}
                  disabled={loading || branches.length === 0}
                >
                  Thêm giờ làm việc
                </Button>
              </div>
            </div>
            {loading ? (
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            ) : filteredWorkingHours.length === 0 ? (
              <p className="text-gray-500">Chưa có giờ làm việc nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2 text-left">Chi nhánh</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Ngày</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Giờ mở cửa</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Giờ đóng cửa</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Trạng thái</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkingHours.map((hour) => (
                      <tr key={hour.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{getBranchName(hour.spaBranchLocationId)}</td>
                        <td className="border border-gray-200 px-4 py-2">{getDayName(hour.dayOfWeek)}</td>
                        <td className="border border-gray-200 px-4 py-2">{hour.openingTime}</td>
                        <td className="border border-gray-200 px-4 py-2">{hour.closingTime}</td>
                        <td className="border border-gray-200 px-4 py-2">{hour.isWorking ? 'Làm việc' : 'Nghỉ'}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEdit(hour.id!)}
                            className="mr-2"
                            disabled={loading}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(hour.id!)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderWorkingHours;