import { useState, useEffect, ChangeEvent } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fetchBranches, fetchServiceCategories, fetchStaff, fetchStaffByBranch, deleteStaff } from '../services/staffApi';
import { Staff, Branch, ServiceCategory } from '../types/staff.types';

const ProviderStaff = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [filterName, setFilterName] = useState<string>('');
  const [filterBranchId, setFilterBranchId] = useState<string>('');
  const [filterServiceCategoryId, setFilterServiceCategoryId] = useState<string>('');

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    if (user._id) {
      setLoading(true);
      Promise.all([
        fetchBranches(user._id, token!).then(setBranches),
        fetchServiceCategories(token!).then(setServiceCategories),
      ])
        .catch(err => {
          setError(err.message || 'Lỗi khi tải dữ liệu');
          console.error('Lỗi khi tải dữ liệu:', err);
        })
        .finally(() => setLoading(false));
    } else {
      setError('Không tìm thấy thông tin nhà cung cấp.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate]);

  useEffect(() => {
    if (token && user?._id) {
      const fetchFilteredStaff = async () => {
        setLoading(true);
        setError(null);
        try {
          let fetchedStaff = (await fetchStaff(token, currentPage, pageSize)).items;

          if (filterBranchId) {
            fetchedStaff = await fetchStaffByBranch(filterBranchId, token);
          }

          if (filterServiceCategoryId) {
            fetchedStaff = fetchedStaff.filter(staff =>
              staff.serviceCategoryIds.includes(filterServiceCategoryId)
            );
          }

          if (filterName) {
            fetchedStaff = fetchedStaff.filter(staff =>
              staff.fullName.toLowerCase().includes(filterName.toLowerCase())
            );
          }

          setStaffList(fetchedStaff);
          setTotalPages(Math.ceil(fetchedStaff.length / pageSize) || 1);
          if (fetchedStaff.length === 0) {
            setError('Chưa có nhân viên nào phù hợp với bộ lọc.');
          }
        } catch (err: any) {
          setError(err.message || 'Không thể tải danh sách nhân viên.');
          console.error('Lỗi khi lấy nhân viên:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchFilteredStaff();
    }
  }, [token, user, currentPage, filterBranchId, filterName, filterServiceCategoryId, pageSize]);

  const handleDeleteStaff = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await deleteStaff(token!, id);
      setSuccess('Xóa nhân viên thành công');
      setStaffList(staffList.filter(staff => staff.id !== id));
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa nhân viên');
      console.error('Lỗi khi xóa nhân viên:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.branchName : 'Không xác định';
  };

  const getServiceCategoryNames = (categoryIds: string[]) => {
    return categoryIds
      .map(id => serviceCategories.find(cat => cat.id === id)?.categoryName || 'Không xác định')
      .join(', ');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý nhân viên</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
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
            <Button onClick={() => navigate('/provider/staff/create')} disabled={loading || branches.length === 0}>
              Thêm nhân viên
            </Button>
          </div>
        </div>
        {loading ? (
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        ) : staffList.length === 0 ? (
          <p className="text-gray-500">Chưa có nhân viên nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border-gray-200">
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
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/64')}
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
                    <td className="border border-gray-200 px-4 py-2">{getBranchName(staff.branchId)}</td>
                    <td className="border border-gray-200 px-4 py-2">{staff.phoneNumber}</td>
                    <td className="border border-gray-200 px-4 py-2">{staff.email}</td>
                    <td className="border border-gray-200 px-4 py-2">{staff.gender}</td>
                    <td className="border border-gray-200 px-4 py-2">{staff.yearsOfExperience}</td>
                    <td className="border border-gray-200 px-4 py-2">{getServiceCategoryNames(staff.serviceCategoryIds)}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/provider/staff/edit/${staff.id}`)}
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
    </div>
  );
};

export default ProviderStaff;