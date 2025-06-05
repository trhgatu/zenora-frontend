import { useState, useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, MapPin, Edit, Trash, Plus } from 'lucide-react';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu từ API Open API VN
interface OpenApiProvince {
  code: number;
  name: string;
  division_type: string;
}

interface OpenApiDistrict {
  code: number;
  name: string;
  province_code: number;
}

interface OpenApiProvinceResponse {
  code: number;
  name: string;
  districts: OpenApiDistrict[];
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

  const [provinces, setProvinces] = useState<OpenApiProvince[]>([]);
  const [districts, setDistricts] = useState<OpenApiDistrict[]>([]);

  // Dữ liệu tỉnh mặc định nếu API lỗi
  const backupProvinces: OpenApiProvince[] = [
    { code: 1, name: 'Hà Nội', division_type: 'Thành phố' },
    { code: 79, name: 'Hồ Chí Minh', division_type: 'Thành phố' },
    { code: 48, name: 'Đà Nẵng', division_type: 'Thành phố' },
    { code: 31, name: 'Hải Phòng', division_type: 'Thành phố' },
    { code: 92, name: 'Cần Thơ', division_type: 'Thành phố' },
  ];

  useEffect(() => {
    if (!token || !user || user.role !== 'Provider') {
      setError('Tài khoản không hợp lệ hoặc không có quyền truy cập. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
      return;
    }

    if (user._id) {
      setProviderId(user._id);
      console.log('Khởi tạo providerId:', user._id);
      fetchProvinces();
    } else {
      setError('Không tìm thấy thông tin nhà cung cấp từ tài khoản. Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/provider/login'), 2000);
    }
  }, [token, user, navigate]);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get<OpenApiProvince[]>('https://provinces.open-api.vn/api/p/');
      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách tỉnh từ API');
      }

      const fetchedProvinces = response.data || [];
      if (fetchedProvinces.length === 0) {
        throw new Error('Danh sách tỉnh trả về rỗng');
      }

      console.log('Danh sách tỉnh:', fetchedProvinces);
      setProvinces(fetchedProvinces);
    } catch (err) {
      console.error('Lỗi khi lấy tỉnh:', err);
      setError('Không thể lấy danh sách tỉnh từ API. Sử dụng dữ liệu mặc định.');
      setProvinces(backupProvinces);
    }
  };

  const fetchDistricts = async (selectedProvinceId: string) => {
    try {
      const response = await axios.get<OpenApiProvinceResponse>(
        `https://provinces.open-api.vn/api/p/${selectedProvinceId}?depth=2`
      );
      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách quận từ API');
      }

      const fetchedDistricts = response.data.districts || [];
      console.log(`Danh sách quận cho tỉnh ${selectedProvinceId}:`, fetchedDistricts);
      setDistricts(fetchedDistricts);
      if (viewMode === 'create' && fetchedDistricts.length > 0) {
        const defaultDistrict = fetchedDistricts[0];
        setNewBranchData(prev => ({
          ...prev,
          districtId: defaultDistrict.code.toString(),
          district: defaultDistrict.name,
          postalCode: `${selectedProvinceId.padStart(2, '0')}${defaultDistrict.code.toString().padStart(4, '0')}`,
        }));
      }
    } catch (err) {
      console.error('Lỗi khi lấy quận:', err);
      setError('Không thể lấy danh sách quận từ API.');
      setDistricts([]);
      if (viewMode === 'create') {
        setNewBranchData(prev => ({ ...prev, districtId: '', district: '' }));
      }
    }
  };

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token || !providerId) {
        setError('Không tìm thấy thông tin nhà cung cấp hoặc token.');
        console.error('Lỗi: Thiếu token hoặc providerId', { token, providerId });
        return;
      }

      console.log('Gửi yêu cầu lấy chi nhánh:', { providerId, token });
      const response = await axiosInstance.get<ApiResponse<SpaBranchLocation[]>>(
        `/api/SpaBranchLocation/by-provider/${providerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Phản hồi API chi nhánh:', response.data);
      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách chi nhánh spa');
      }

      const fetchedBranches = Array.isArray(response.data.data) ? response.data.data : [];
      setBranches(fetchedBranches);
      setFilteredBranches(fetchedBranches);
      if (fetchedBranches.length === 0) {
        setError('Không có chi nhánh nào được tìm thấy cho nhà cung cấp này.');
        console.warn('Danh sách chi nhánh rỗng:', fetchedBranches);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi lấy danh sách chi nhánh spa';
      console.error('Lỗi chi tiết:', axiosError.response?.data, axiosError.response?.status);

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
    } finally {
      setLoading(false);
    }
  };

  const handleEditBranch = (branch: SpaBranchLocation) => {
    setEditingBranch(branch);
    setViewMode('edit');

    if (branch.provinceId) {
      fetchDistricts(branch.provinceId);
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

      console.log('Gửi yêu cầu cập nhật chi nhánh:', payload);
      const response = await axiosInstance.put('/api/SpaBranchLocation/update', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Phản hồi cập nhật chi nhánh:', response.data);
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
      console.error('Lỗi khi cập nhật chi nhánh:', axiosError);
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

      console.log('Gửi yêu cầu tạo chi nhánh:', payload);
      const response = await axiosInstance.post<SpaBranchLocation>('/api/SpaBranchLocation/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Phản hồi tạo chi nhánh:', response.data);
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
      console.error('Lỗi khi tạo chi nhánh:', axiosError);
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

      console.log('Gửi yêu cầu xóa chi nhánh:', { id });
      const response = await axiosInstance.delete(`/api/SpaBranchLocation/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Phản hồi xóa chi nhánh:', response.data);
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
      console.error('Lỗi khi xóa chi nhánh:', axiosError);
    } finally {
      setLoading(false);
    }
  };

  const resetNewBranchData = () => {
    setNewBranchData({
      branchName: '',
      street: '',
      district: '',
      city: provinces.length > 0 ? provinces[0].name : '',
      postalCode: provinces.length > 0 ? provinces[0].code.toString().padStart(6, '0') : '',
      country: 'Vietnam',
      provinceId: provinces.length > 0 ? provinces[0].code.toString() : '',
      districtId: '',
    });
    setDistricts([]);
    if (provinces.length > 0) {
      fetchDistricts(provinces[0].code.toString());
    }
  };

  const handleNewBranchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBranchData((prev) => ({ ...prev, [name]: value }));

    if (name === 'provinceId') {
      const selectedProvince = provinces.find((province) => province.code.toString() === value);
      setNewBranchData((prev) => ({
        ...prev,
        city: selectedProvince ? selectedProvince.name : '',
        postalCode: selectedProvince ? selectedProvince.code.toString().padStart(6, '0') : '',
        districtId: '',
        district: '',
      }));
      setDistricts([]);
      if (value) {
        console.log('Fetching districts for province:', value);
        fetchDistricts(value);
      }
    } else if (name === 'districtId') {
      const selectedDistrict = districts.find((district) => district.code.toString() === value);
      const postalCode = selectedDistrict
        ? `${newBranchData.provinceId.padStart(2, '0')}${selectedDistrict.code.toString().padStart(4, '0')}`
        : newBranchData.provinceId.padStart(6, '0');
      setNewBranchData((prev) => ({
        ...prev,
        district: selectedDistrict ? selectedDistrict.name : '',
        postalCode,
      }));
    }
  };

  const handleEditBranchInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingBranch) return;

    const { name, value } = e.target;
    if (name === 'provinceId') {
      const selectedProvince = provinces.find((province) => province.code.toString() === value);
      setEditingBranch({
        ...editingBranch,
        provinceId: value,
        city: selectedProvince ? selectedProvince.name : '',
        postalCode: selectedProvince ? selectedProvince.code.toString().padStart(6, '0') : '',
        districtId: '',
        district: '',
      });
      setDistricts([]);
      if (value) {
        fetchDistricts(value);
      }
    } else if (name === 'districtId') {
      const selectedDistrict = districts.find((district) => district.code.toString() === value);
      const postalCode = selectedDistrict
        ? `${editingBranch.provinceId.padStart(2, '0')}${selectedDistrict.code.toString().padStart(4, '0')}`
        : editingBranch.provinceId.padStart(6, '0');
      setEditingBranch({
        ...editingBranch,
        districtId: value,
        district: selectedDistrict ? selectedDistrict.name : '',
        postalCode,
      });
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
    return workingHours
      .map((hour) => `${hour.dayOfWeek}: ${hour.openTime} - ${hour.closeTime}`)
      .join('; ');
  };

  useEffect(() => {
    if (providerId && token) {
      console.log('Kích hoạt fetchBranches với:', { providerId, token });
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
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code.toString()}>
                        {province.name}
                      </option>
                    ))}
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
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code.toString()}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                    Mã bưu điện
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={newBranchData.postalCode}
                    onChange={handleNewBranchInputChange}
                    placeholder="Nhập mã bưu điện"
                    required
                  />
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
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code.toString()}>
                        {province.name}
                      </option>
                    ))}
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
                    <option value="">Chọn quận/huyện</option>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code.toString()}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                    Mã bưu điện
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={editingBranch.postalCode}
                    onChange={handleEditBranchInputChange}
                    placeholder="Nhập mã bưu điện"
                    required
                  />
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
                        <td className="border border-gray-200 px-4 py-2">
                          {branch.street}, {branch.district}
                        </td>
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