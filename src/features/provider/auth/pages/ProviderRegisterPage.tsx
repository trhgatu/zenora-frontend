import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Phone, Building, MapPin } from 'lucide-react';
import axiosInstance from '@/services/axios';
import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  statusCode?: number;
  errors?: { [key: string]: string[] } | string[];
}

interface OpenApiProvince {
  code: string;
  name: string;
  division_type: string;
}

interface OpenApiDistrict {
  code: string;
  name: string;
  province_code: string;
}

interface ServiceCategory {
  id: string;
  categoryName: string;
}

const ProviderRegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactPosition, setContactPosition] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [serviceCategoryIds, setServiceCategoryIds] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<OpenApiProvince[]>([]);
  const [districts, setDistricts] = useState<OpenApiDistrict[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhoneNumber = (phone: string) => /^[0-9]{10}$/.test(phone);
  const isValidUUID = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  // Lấy danh sách tỉnh
  const fetchProvinces = async () => {
    try {
      const response = await axios.get<OpenApiProvince[]>('https://provinces.open-api.vn/api/p/');
      if (response.status !== 200) throw new Error('Lỗi khi lấy danh sách tỉnh');
      const fetchedProvinces = response.data || [];
      if (fetchedProvinces.length === 0) throw new Error('Danh sách tỉnh rỗng');
      console.log('Danh sách tỉnh:', fetchedProvinces);
      setProvinces(fetchedProvinces);
    } catch (err) {
      console.error('Error fetching provinces:', err);
      setError('Không thể lấy danh sách tỉnh.');
    }
  };

  // Lấy danh sách quận
  const fetchDistricts = async (selectedProvinceId: string) => {
    try {
      const response = await axios.get<{ code: string; name: string; districts: OpenApiDistrict[] }>(
        `https://provinces.open-api.vn/api/p/${selectedProvinceId}?depth=2`
      );
      if (response.status !== 200) throw new Error('Lỗi khi lấy danh sách quận');
      const fetchedDistricts = response.data.districts || [];
      console.log(`Danh sách quận cho tỉnh ${selectedProvinceId}:`, fetchedDistricts);
      setDistricts(fetchedDistricts);
      if (fetchedDistricts.length > 0) {
        setDistrictId(fetchedDistricts[0].code);
      } else {
        setDistrictId('');
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError('Không thể lấy danh sách quận.');
      setDistricts([]);
    }
  };

  // Lấy danh sách danh mục dịch vụ
  const fetchServiceCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/ServiceCategory/get-all', {
        params: { pageNumber: 1, pageSize: 100 },
      });
      console.log('Service categories response:', response.data);
      if (response.status !== 200) throw new Error(`Lỗi khi lấy danh sách danh mục: ${response.status}`);
      let items = response.data.data?.items || response.data.items || response.data;
      if (!Array.isArray(items)) {
        console.warn('Dữ liệu danh mục không phải mảng, thử lấy trực tiếp response.data:', response.data);
        items = Array.isArray(response.data) ? response.data : [];
      }
      if (items.length === 0) {
        setError('Không có danh mục dịch vụ nào được tìm thấy.');
      } else {
        console.log('Danh mục dịch vụ:', items);
        setServiceCategories(items);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Không thể lấy danh sách danh mục dịch vụ.';
      setError(errorMessage);
      console.error('Error fetching service categories:', axiosError.response?.data || axiosError);
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchServiceCategories();
  }, []);

  useEffect(() => {
    if (provinceId) {
      fetchDistricts(provinceId);
    } else {
      setDistricts([]);
      setDistrictId('');
    }
  }, [provinceId]);

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    setServiceCategoryIds(prev =>
      checked ? [...prev, categoryId] : prev.filter(id => id !== categoryId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (
        !fullName ||
        !email ||
        !businessName ||
        !contactPosition ||
        !phoneNumber ||
        !addressDetail ||
        !provinceId ||
        !districtId ||
        serviceCategoryIds.length === 0
      ) {
        throw new Error('Vui lòng nhập đầy đủ thông tin.');
      }

      if (!isValidEmail(email)) throw new Error('Email không hợp lệ.');
      if (!isValidPhoneNumber(phoneNumber)) throw new Error('Số điện thoại không hợp lệ (10 số).');
      if (!serviceCategoryIds.every(id => isValidUUID(id))) throw new Error('ID danh mục dịch vụ không hợp lệ.');

      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        businessName: businessName.trim(),
        contactPosition: contactPosition.trim(),
        phoneNumber: phoneNumber.trim(),
        addressDetail: addressDetail.trim(),
        provinceId,
        districtId,
        serviceCategoryIds,
      };

      console.log('Provider Payload:', payload);

      const response = await axiosInstance.post('/api/request-provider/create', payload);
      console.log('Provider Response:', response.data);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.message || 'Lỗi khi đăng ký nhà cung cấp');
      }

      setSuccess('Đăng ký thành công! Vui lòng chờ admin duyệt.');
      setTimeout(() => navigate('/provider/login'), 2000);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi đăng ký nhà cung cấp';
      if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.errors) {
          const errors = axiosError.response.data.errors;
          if (Array.isArray(errors)) {
            errorMessage = errors.join('; ');
          } else if (typeof errors === 'object') {
            errorMessage = Object.entries(errors)
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('; ');
          }
        } else if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (axiosError.response?.status === 500) {
        errorMessage = 'Lỗi server, vui lòng thử lại sau hoặc liên hệ quản trị viên.';
      }
      setError(errorMessage);
      console.error('Error registering provider:', axiosError.response?.data || axiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Đăng ký nhà cung cấp</h2>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Họ và tên
              </Label>
              <div className="relative mt-1">
                <Input
                  id="fullName"
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                Tên doanh nghiệp
              </Label>
              <div className="relative mt-1">
                <Input
                  id="businessName"
                  placeholder="Nhập tên spa/cửa hàng"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="contactPosition" className="text-sm font-medium text-gray-700">
                Chức vụ liên hệ
              </Label>
              <div className="relative mt-1">
                <Input
                  id="contactPosition"
                  placeholder="Nhập chức vụ (VD: Quản lý)"
                  value={contactPosition}
                  onChange={(e) => setContactPosition(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Số điện thoại
              </Label>
              <div className="relative mt-1">
                <Input
                  id="phoneNumber"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="addressDetail" className="text-sm font-medium text-gray-700">
                Địa chỉ chi tiết
              </Label>
              <div className="relative mt-1">
                <Input
                  id="addressDetail"
                  placeholder="Nhập địa chỉ chi tiết"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="provinceId" className="text-sm font-medium text-gray-700">
                Tỉnh/Thành phố
              </Label>
              <select
                id="provinceId"
                value={provinceId}
                onChange={(e) => setProvinceId(e.target.value)}
                className="w-full border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map(province => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Label htmlFor="districtId" className="text-sm font-medium text-gray-700">
                Quận/Huyện
              </Label>
              <select
                id="districtId"
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!provinceId}
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map(district => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Danh mục dịch vụ</Label>
            <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-4">
              {serviceCategories.length === 0 ? (
                <p className="text-gray-600 text-sm">Không có danh mục dịch vụ</p>
              ) : (
                serviceCategories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={serviceCategoryIds.includes(category.id)}
                      onCheckedChange={(checked) => handleCategoryToggle(category.id, !!checked)}
                    />
                    <label htmlFor={`category-${category.id}`} className="text-sm text-gray-600">
                      {category.categoryName}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <Link to="/provider/login" className="text-blue-600 hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderRegisterPage;