import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import StaffForm from '../components/StaffForm';
import { fetchBranches, fetchServiceCategories, updateStaff, fetchStaffById } from '../services/staffApi';
import { Staff, StaffFormData, Branch, ServiceCategory } from '../types/staff.types';

const EditStaffPage = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    if (user._id && id) {
      setLoading(true);
      Promise.all([
        fetchBranches(user._id, token).then(setBranches),
        fetchServiceCategories(token).then(setServiceCategories),
        fetchStaffById(id, token).then(data => {
          setStaffData({
            branchId: data.branchId,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            avatarUrl: data.avatarUrl,
            gender: data.gender,
            yearsOfExperience: data.yearsOfExperience,
            serviceCategoryIds: data.serviceCategoryIds,
          });
          setDataLoaded(true);
        }),
      ])
        .catch(err => {
          setError(err.message || 'Lỗi khi tải dữ liệu');
          console.error('Lỗi khi tải dữ liệu:', err);
        })
        .finally(() => setLoading(false));
    } else {
      setError('Không tìm thấy thông tin nhà cung cấp hoặc ID nhân viên.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate required fields
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

      await updateStaff(token, { id, ...staffData });
      setSuccess('Cập nhật nhân viên thành công');
      setTimeout(() => navigate('/provider/staff'), 1000);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật nhân viên');
      console.error('Lỗi khi cập nhật nhân viên:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!dataLoaded || loading) {
    return <div className="p-8">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Chỉnh sửa nhân viên</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <StaffForm
        branches={branches}
        serviceCategories={serviceCategories}
        staffData={staffData}
        setStaffData={setStaffData}
        handleSubmit={handleSubmit}
        loading={loading}
        isEditing={true}
        onCancel={() => navigate('/provider/staff')}
      />
    </div>
  );
};

export default EditStaffPage;