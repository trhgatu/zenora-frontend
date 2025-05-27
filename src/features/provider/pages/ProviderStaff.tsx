import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';

interface Staff {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  providerId: string;
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

const ProviderStaff = () => {
  const { user, token } = useAppSelector(state => state.auth);
  
  const [staffName, setStaffName] = useState('');
  const [staffSpecialty, setStaffSpecialty] = useState('');
  const [staffExperience, setStaffExperience] = useState('');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      const response = await axiosInstance.get('/api/Staff', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách thợ');
      }

      setStaffList(response.data || []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi lấy danh sách thợ');
      } else {
        setError('Lỗi không xác định khi lấy danh sách thợ');
      }
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffSpecialty || !staffExperience) {
      setError('Vui lòng nhập đầy đủ thông tin thợ');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/Staff', {
        name: staffName,
        specialty: staffSpecialty,
        experience: parseInt(staffExperience),
        providerId: user?._id || '',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi thêm thông tin thợ');
      }

      setSuccess('Thêm thông tin thợ thành công');
      setError(null);
      setStaffName('');
      setStaffSpecialty('');
      setStaffExperience('');
      fetchStaff();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi thêm thông tin thợ');
      } else {
        setError('Lỗi không xác định khi thêm thông tin thợ');
      }
      setSuccess(null);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/api/Staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi xóa thông tin thợ');
      }

      setSuccess('Xóa thông tin thợ thành công');
      setError(null);
      fetchStaff();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(axiosError.response?.data?.message || 'Lỗi khi xóa thông tin thợ');
      } else {
        setError('Lỗi không xác định khi xóa thông tin thợ');
      }
      setSuccess(null);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Quản lý thông tin thợ</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}

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
              value={staffExperience} // Sửa lỗi: bỏ ký tự "|"
              onChange={(e) => setStaffExperience(e.target.value)}
              placeholder="Nhập số năm kinh nghiệm"
            />
          </div>
          <Button type="submit">Thêm thông tin thợ</Button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-4">Danh sách thợ</h3>
        {staffList.length === 0 ? (
          <p className="text-gray-600">Chưa có thông tin thợ nào.</p>
        ) : (
          <div className="space-y-4">
            {staffList.map((staff) => (
              <div key={staff.id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h4 className="text-md font-semibold">{staff.name}</h4>
                  <p className="text-gray-600">Chuyên môn: {staff.specialty}</p>
                  <p className="text-gray-600">Kinh nghiệm: {staff.experience} năm</p>
                </div>
                <Button variant="destructive" onClick={() => handleDeleteStaff(staff.id)}>
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

export default ProviderStaff;