import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, MapPin, Edit, Trash, Plus } from 'lucide-react';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu từ Esgoo API
interface EsgooResponse<T> {
  error: number;
  error_text: string;
  data: T[];
}

interface Province {
  id: string;
  full_name: string;
  postalCode?: string;
}

interface District {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

interface WorkingHour {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
}

interface SpaBranchLocation {
  id: string;
  providerId?: string;
  branchName: string;
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: string;
  provinceId: string;
  districtId: string;
  provinceName?: string;
  districtName?: string;
  workingHours?: WorkingHour[];
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
  errors?: { [key: string]: string[] };
}

const ProviderSpaLocation = () => {
  const { token, user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  const [branches, setBranches] = useState<SpaBranchLocation[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<SpaBranchLocation[]>([]);
  const [editingBranch, setEditingBranch] = useState<SpaBranchLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [searchAddress, setSearchAddress] = useState<string>('');

  const [newBranchData, setNewBranchData] = useState({
    branchName: '',
    street: '',
    district: '',
    city: '',
    postalCode: '',
    country: 'Vietnam',
    provinceId: '',
    districtId: '',
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  // Dữ liệu tỉnh mặc định nếu API không hoạt động
  const defaultProvinces: Province[] = [
    { id: "01", full_name: "Hà Nội", postalCode: "100000" },
    { id: "79", full_name: "Hồ Chí Minh", postalCode: "700000" },
    { id: "48", full_name: "Đà Nẵng", postalCode: "550000" },
    { id: "31", full_name: "Hải Phòng", postalCode: "180000" },
    { id: "92", full_name: "Cần Thơ", postalCode: "900000" },
  ];

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    if (user._id) {
      setProviderId(user._id);
    } else {
      setError('Không tìm thấy thông tin nhà cung cấp từ tài khoản. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate]);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get<EsgooResponse<Province>>('https://esgoo.net/api-tinhthanh/4/0.htm');
      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách tỉnh từ Esgoo API: Phản hồi không thành công');
      }

      const responseData = response.data;
      if (responseData.error !== 0) {
        throw new Error(responseData.error_text || 'Lỗi khi lấy danh sách tỉnh từ API');
      }

      const fetchedProvinces = responseData.data || [];
      if (fetchedProvinces.length === 0) {
        throw new Error('Danh sách tỉnh trả về rỗng');
      }

      const provincesWithPostalCode = fetchedProvinces.map((province, index) => ({
        ...province,
        postalCode: `10${index.toString().padStart(3, '0')}`,
      }));
      setProvinces(provincesWithPostalCode);
      if (provincesWithPostalCode.length > 0 && viewMode === 'create') {
        setNewBranchData((prev) => ({
          ...prev,
          provinceId: provincesWithPostalCode[0].id,
          city: provincesWithPostalCode[0].full_name,
          postalCode: provincesWithPostalCode[0].postalCode || '',
        }));
      }
    } catch (err) {
      console.error('Error fetching provinces:', err);
      setError('Không thể lấy danh sách tỉnh từ API. Sử dụng dữ liệu mặc định.');
      // Sử dụng dữ liệu mặc định nếu API thất bại
      setProvinces(defaultProvinces);
      if (defaultProvinces.length > 0 && viewMode === 'create') {
        setNewBranchData((prev) => ({
          ...prev,
          provinceId: defaultProvinces[0].id,
          city: defaultProvinces[0].full_name,
          postalCode: defaultProvinces[0].postalCode || '',
        }));
      }
    }
  };

  const fetchDistricts = async (selectedProvinceId: string) => {
    try {
      const response = await axios.get<EsgooResponse<District>>(
        `https://esgoo.net/api-tinhthanh/2/${selectedProvinceId}.htm`
      );
      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách quận từ Esgoo API');
      }

      const responseData = response.data;
      if (responseData.error !== 0) {
        throw new Error(responseData.error_text || 'Lỗi khi lấy danh sách quận');
      }

      const fetchedDistricts = responseData.data || [];
      setDistricts(fetchedDistricts);
      if (fetchedDistricts.length > 0 && viewMode === 'create') {
        setNewBranchData((prev) => ({ ...prev, districtId: fetchedDistricts[0].id, district: fetchedDistricts[0].full_name }));
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError('Không thể lấy danh sách quận. Vui lòng thử lại sau.');
    }
  };

  const fetchWards = async (selectedDistrictId: string) => {
    try {
      const response = await axios.get<EsgooResponse<Ward>>(
        `https://esgoo.net/api-tinhthanh/3/${selectedDistrictId}.htm`
      );
      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách phường/xã từ Esgoo API');
      }

      const responseData = response.data;
      if (responseData.error !== 0) {
        throw new Error(responseData.error_text || 'Lỗi khi lấy danh sách phường/xã');
      }

      const fetchedWards = responseData.data || [];
      setWards(fetchedWards);
      if (fetchedWards.length > 0 && viewMode === 'create') {
        setNewBranchData((prev) => ({ ...prev, wardId: fetchedWards[0].id }));
      }
    } catch (err) {
      console.error('Error fetching wards:', err);
      setError('Không thể lấy danh sách phường/xã. Vui lòng thử lại sau.');
    }
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token || !providerId) {
        setError('Không tìm thấy thông tin nhà cung cấp.');
        return;
      }

      const response = await axiosInstance.get<ApiResponse<SpaBranchLocation[]>>(`/api/SpaBranchLocation/by-provider/${providerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách chi nhánh spa');
      }

      const fetchedBranches = Array.isArray(response.data.data) ? response.data.data : [];
      setBranches(fetchedBranches);
      setFilteredBranches(fetchedBranches);
      if (fetchedBranches.length === 0) {
        setError('Không có chi nhánh nào được tìm thấy cho nhà cung cấp này.');
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách chi nhánh spa';

      if (axiosError.response?.status === 404) {
        setBranches([]);
        setFilteredBranches([]);
        setError('Không có chi nhánh nào được tìm thấy cho nhà cung cấp này.');
      } else if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        }
      }
      setError(errorMessage);
      console.error('Lỗi khi lấy chi nhánh:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBranch = (branch: SpaBranchLocation) => {
    setEditingBranch(branch);
    setViewMode('edit');

    if (branch.provinceId) {
      fetchDistricts(branch.provinceId);
      if (branch.districtId) {
        fetchWards(branch.districtId);
      }
    }
  };

  const handleUpdateBranch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBranch) return;

    const { id } = editingBranch;
    const payload = {
      id,
      providerId: editingBranch.providerId || providerId || '',
      branchName: editingBranch.branchName,
      street: editingBranch.street,
      district: editingBranch.district,
      city: editingBranch.city,
      postalCode: editingBranch.postalCode,
      country: editingBranch.country,
      provinceId: editingBranch.provinceId,
      districtId: editingBranch.districtId,
    };

    if (
      !payload.providerId ||
      !payload.branchName ||
      !payload.street ||
      !payload.district ||
      !payload.city ||
      !payload.postalCode ||
      !payload.country ||
      !payload.provinceId ||
      !payload.districtId
    ) {
      setError('Vui lòng nhập đầy đủ thông tin chi nhánh');
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

      const response = await axiosInstance.put('/api/SpaBranchLocation/update', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi cập nhật chi nhánh spa');
      }

      setSuccess('Cập nhật chi nhánh spa thành công');
      setEditingBranch(null);
      setViewMode('list');
      fetchBranches();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi cập nhật chi nhánh spa';
      if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        }
      }
      setError(errorMessage);
      console.error('Error updating branch:', axiosError);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !providerId ||
      !newBranchData.branchName ||
      !newBranchData.street ||
      !newBranchData.district ||
      !newBranchData.city ||
      !newBranchData.postalCode ||
      !newBranchData.country ||
      !newBranchData.provinceId ||
      !newBranchData.districtId
    ) {
      setError('Vui lòng nhập đầy đủ thông tin chi nhánh');
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

      const payload = {
        providerId: providerId,
        branchName: newBranchData.branchName,
        street: newBranchData.street,
        district: newBranchData.district,
        city: newBranchData.city,
        postalCode: newBranchData.postalCode,
        country: newBranchData.country,
        provinceId: newBranchData.provinceId,
        districtId: newBranchData.districtId,
      };

      const response = await axiosInstance.post<SpaBranchLocation>('/api/SpaBranchLocation/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Lỗi khi tạo chi nhánh spa');
      }

      setBranches((prev) => [...prev, response.data]);
      setSuccess('Tạo chi nhánh spa thành công');
      setViewMode('list');
      resetNewBranchData();
      fetchBranches();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi tạo chi nhánh spa';
      if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          errorMessage = Object.values(axiosError.response.data.errors).flat().join(', ');
        }
      }
      setError(errorMessage);
      console.error('Error creating branch:', axiosError);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/provider/login'), 2000);
        return;
      }

      const response = await axiosInstance.delete(`/api/SpaBranchLocation/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi xóa chi nhánh spa');
      }

      setSuccess('Xóa chi nhánh spa thành công');
      fetchBranches();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xóa chi nhánh spa';
      if (axiosError.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.';
        setTimeout(() => navigate('/provider/login'), 2000);
      } else if (axiosError.response?.status === 404) {
        errorMessage = 'Không tìm thấy chi nhánh để xóa. Vui lòng kiểm tra lại.';
      }
      setError(errorMessage);
      console.error('Error deleting branch:', axiosError);
    } finally {
      setLoading(false);
    }
  };

  const resetNewBranchData = () => {
    setNewBranchData({
      branchName: '',
      street: '',
      district: '',
      city: '',
      postalCode: provinces.length > 0 ? provinces[0].postalCode || '' : '',
      country: 'Vietnam',
      provinceId: provinces.length > 0 ? provinces[0].id : '',
      districtId: '',
    });
    setDistricts([]);
    setWards([]);
  };

  const handleNewBranchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBranchData((prev) => ({ ...prev, [name]: value }));

    if (name === 'provinceId') {
      const selectedProvince = provinces.find((province) => province.id === value);
      setNewBranchData((prev) => ({
        ...prev,
        city: selectedProvince ? selectedProvince.full_name : '',
        postalCode: selectedProvince ? selectedProvince.postalCode || '' : '',
        districtId: '',
        district: '',
      }));
      setDistricts([]);
      setWards([]);
      if (value) {
        fetchDistricts(value);
      }
    } else if (name === 'districtId') {
      const selectedDistrict = districts.find((district) => district.id === value);
      setNewBranchData((prev) => ({
        ...prev,
        district: selectedDistrict ? selectedDistrict.full_name : '',
      }));
      setWards([]);
      if (value) {
        fetchWards(value);
      }
    }
  };

  const handleEditBranchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingBranch) return;

    const { name, value } = e.target;
    if (name === 'provinceId') {
      const selectedProvince = provinces.find((province) => province.id === value);
      setEditingBranch({
        ...editingBranch,
        provinceId: value,
        city: selectedProvince ? selectedProvince.full_name : '',
        postalCode: selectedProvince ? selectedProvince.postalCode || '' : '',
        districtId: '',
        district: '',
      });
      setDistricts([]);
      setWards([]);
      if (value) {
        fetchDistricts(value);
      }
    } else if (name === 'districtId') {
      const selectedDistrict = districts.find((district) => district.id === value);
      setEditingBranch({
        ...editingBranch,
        districtId: value,
        district: selectedDistrict ? selectedDistrict.full_name : '',
      });
      setWards([]);
      if (value) {
        fetchWards(value);
      }
    } else {
      setEditingBranch({ ...editingBranch, [name]: value });
    }
  };

  const handleSearchAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchAddress(searchTerm);

    const filtered = branches.filter((branch) => {
      const address = `${branch.street} ${branch.district} ${branch.city}`.toLowerCase();
      return address.includes(searchTerm);
    });

    setFilteredBranches(filtered);
  };

  const formatWorkingHours = (workingHours: WorkingHour[] | undefined) => {
    if (!workingHours || workingHours.length === 0) return 'Không có giờ làm việc';
    return workingHours.map((hour) => `${hour.dayOfWeek}: ${hour.openTime} - ${hour.closeTime}`).join('; ');
  };

  useEffect(() => {
    if (providerId && token) {
      fetchBranches();
    }
  }, [providerId, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý chi nhánh spa</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <div className="bg-white p-6 rounded shadow-md">
        {viewMode === 'create' ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Tạo chi nhánh mới</h3>
            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="providerId" className="text-sm font-medium text-gray-700">
                    ID nhà cung cấp
                  </Label>
                  <Input
                    id="providerId"
                    name="providerId"
                    value={providerId || ''}
                    onChange={handleNewBranchInputChange}
                    placeholder="Nhập ID nhà cung cấp"
                    required
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="branchName" className="text-sm font-medium text-gray-700">
                    Tên chi nhánh
                  </Label>
                  <Input
                    id="branchName"
                    name="branchName"
                    value={newBranchData.branchName}
                    onChange={handleNewBranchInputChange}
                    placeholder="Nhập tên chi nhánh"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                  Đường
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={newBranchData.street}
                  onChange={handleNewBranchInputChange}
                  placeholder="Nhập tên đường"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="provinceId" className="text-sm font-medium text-gray-700">
                    Tỉnh/Thành phố
                  </Label>
                  <select
                    id="provinceId"
                    name="provinceId"
                    value={newBranchData.provinceId}
                    onChange={handleNewBranchInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {provinces.length === 0 ? (
                      <option value="">Không có dữ liệu tỉnh</option>
                    ) : (
                      provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.full_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <Label htmlFor="districtId" className="text-sm font-medium text-gray-700">
                    Quận/Huyện
                  </Label>
                  <select
                    id="districtId"
                    name="districtId"
                    value={newBranchData.districtId}
                    onChange={handleNewBranchInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!newBranchData.provinceId}
                  >
                    {districts.length === 0 ? (
                      <option value="">Không có dữ liệu quận</option>
                    ) : (
                      districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.full_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                    Mã bưu điện
                  </Label>
                  <select
                    id="postalCode"
                    name="postalCode"
                    value={newBranchData.postalCode}
                    onChange={handleNewBranchInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!newBranchData.provinceId}
                  >
                    {provinces.length === 0 ? (
                      <option value="">Không có dữ liệu mã bưu điện</option>
                    ) : (
                      provinces.map((province) => (
                        <option key={province.id} value={province.postalCode || ''}>
                          {province.postalCode || 'Không có mã bưu điện'} - {province.full_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Quốc gia
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={newBranchData.country}
                  onChange={handleNewBranchInputChange}
                  placeholder="Nhập quốc gia"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang tạo...' : 'Tạo chi nhánh'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setViewMode('list');
                    resetNewBranchData();
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        ) : viewMode === 'edit' && editingBranch ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa chi nhánh</h3>
            <form onSubmit={handleUpdateBranch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="providerId" className="text-sm font-medium text-gray-700">
                    ID nhà cung cấp
                  </Label>
                  <Input
                    id="providerId"
                    name="providerId"
                    value={editingBranch.providerId || providerId || ''}
                    onChange={handleEditBranchInputChange}
                    placeholder="Nhập ID nhà cung cấp"
                    required
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="branchName" className="text-sm font-medium text-gray-700">
                    Tên chi nhánh
                  </Label>
                  <Input
                    id="branchName"
                    name="branchName"
                    value={editingBranch.branchName}
                    onChange={handleEditBranchInputChange}
                    placeholder="Nhập tên chi nhánh"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                  Đường
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={editingBranch.street}
                  onChange={handleEditBranchInputChange}
                  placeholder="Nhập tên đường"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="provinceId" className="text-sm font-medium text-gray-700">
                    Tỉnh/Thành phố
                  </Label>
                  <select
                    id="provinceId"
                    name="provinceId"
                    value={editingBranch.provinceId}
                    onChange={handleEditBranchInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {provinces.length === 0 ? (
                      <option value="">Không có dữ liệu tỉnh</option>
                    ) : (
                      provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.full_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <Label htmlFor="districtId" className="text-sm font-medium text-gray-700">
                    Quận/Huyện
                  </Label>
                  <select
                    id="districtId"
                    name="districtId"
                    value={editingBranch.districtId}
                    onChange={handleEditBranchInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!editingBranch.provinceId}
                  >
                    {districts.length === 0 ? (
                      <option value="">Không có dữ liệu quận</option>
                    ) : (
                      districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.full_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                    Mã bưu điện
                  </Label>
                  <select
                    id="postalCode"
                    name="postalCode"
                    value={editingBranch.postalCode}
                    onChange={handleEditBranchInputChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!editingBranch.provinceId}
                  >
                    {provinces.length === 0 ? (
                      <option value="">Không có dữ liệu mã bưu điện</option>
                    ) : (
                      provinces.map((province) => (
                        <option key={province.id} value={province.postalCode || ''}>
                          {province.postalCode || 'Không có mã bưu điện'} - {province.full_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Quốc gia
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={editingBranch.country}
                  onChange={handleEditBranchInputChange}
                  placeholder="Nhập quốc gia"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingBranch(null);
                    setViewMode('list');
                  }}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Danh sách chi nhánh spa</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="searchAddress">Tìm kiếm theo địa chỉ</Label>
                  <Input
                    id="searchAddress"
                    value={searchAddress}
                    onChange={handleSearchAddress}
                    placeholder="Nhập địa chỉ (đường, quận, thành phố)"
                    className="w-64"
                  />
                </div>
                <Button
                  onClick={() => {
                    setViewMode('create');
                    resetNewBranchData();
                  }}
                >
                  <Plus size={20} className="mr-2" />
                  Thêm chi nhánh mới
                </Button>
              </div>
            </div>
            {loading ? (
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            ) : filteredBranches.length === 0 ? (
              <p className="text-gray-600">
                {searchAddress ? 'Không tìm thấy chi nhánh phù hợp với địa chỉ.' : 'Chưa có chi nhánh nào. Vui lòng tạo chi nhánh mới.'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2 text-left">Tên chi nhánh</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Địa chỉ</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Tỉnh/Thành phố</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Quận/Huyện</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Mã bưu điện</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Quốc gia</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Giờ làm việc</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBranches.map((branch) => (
                      <tr key={branch.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2">{branch.branchName}</td>
                        <td className="border border-gray-200 px-4 py-2">{branch.street}, {branch.district}</td>
                        <td className="border border-gray-200 px-4 py-2">{branch.city || branch.provinceName}</td>
                        <td className="border border-gray-200 px-4 py-2">{branch.districtName || branch.district}</td>
                        <td className="border border-gray-200 px-4 py-2">{branch.postalCode}</td>
                        <td className="border border-gray-200 px-4 py-2">{branch.country}</td>
                        <td className="border border-gray-200 px-4 py-2">{formatWorkingHours(branch.workingHours)}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEditBranch(branch)}
                            className="mr-2"
                            disabled={loading}
                          >
                            <Edit size={16} className="mr-1" />
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteBranch(branch.id)}
                            disabled={loading}
                          >
                            <Trash size={16} className="mr-1" />
                            Xóa
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderSpaLocation;