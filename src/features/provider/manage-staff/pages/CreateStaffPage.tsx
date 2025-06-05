import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import StaffForm from '../components/StaffForm';
import { fetchBranches, fetchServiceCategories, createStaff } from '../services/staffApi';
import { StaffFormData, Branch, ServiceCategory } from '../types/staff.types';

const CreateStaffPage = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState<StaffFormData>({
    branchId: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    avatarUrl: '',
    gender: '',
    yearsOfExperience: 0,
    serviceCategoryIds: [],
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    if (user._id) {
      setLoading(true);
      Promise.all([
        fetchBranches(user._id, token!).then(data => {
          console.log('Branches fetched:', data);
          setBranches(data);
        }),
        fetchServiceCategories(token!).then(data => {
          console.log('Service categories fetched:', data);
          setServiceCategories(data);
        }),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (
        !staffData.branchId ||
        !staffData.fullName ||
        !staffData.phoneNumber ||
        !staffData.email ||
        !staffData.gender ||
        staffData.yearsOfExperience < 0 ||
        !staffData.serviceCategoryIds.length
      ) {
        throw new Error('Vui lòng nhập đầy đủ thông tin nhân viên');
      }

      console.log('Submitting staff data:', staffData);
      await createStaff(token, staffData);
      setSuccess('Thêm nhân viên thành công');
      setStaffData({
        branchId: '',
        fullName: '',
        phoneNumber: '',
        email: '',
        avatarUrl: '',
        gender: '',
        yearsOfExperience: 0,
        serviceCategoryIds: [],
      });
      setTimeout(() => navigate('/provider/staff'), 1000);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi thêm nhân viên');
      console.error('Lỗi khi thêm nhân viên:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBranchChange = (branchId: string) => {
    const selectedBranch = branches.find(b => b.id === branchId);
    console.log('Selected branch:', selectedBranch);
    if (!selectedBranch) {
      setError('Chi nhánh không hợp lệ.');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Thêm nhân viên mới</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      {loading ? (
        <div className="p-8">Đang tải dữ liệu...</div>
      ) : (
        <StaffForm
          branches={branches}
          serviceCategories={serviceCategories}
          staffData={staffData}
          setStaffData={setStaffData}
          handleSubmit={handleSubmit}
          loading={loading}
          isEditing={false}
          onCancel={() => navigate('/provider/staff')}
          onBranchChange={handleBranchChange}
        />
      )}
    </div>
  );
};

export default CreateStaffPage;