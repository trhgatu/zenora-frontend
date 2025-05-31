import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Phone, Building, MapPin, Eye, EyeOff, Key, Lock, Plus, X } from 'lucide-react';
import axiosInstance from '@/services/axios';
import axios from 'axios';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message?: string;
  statusCode?: number;
  errors?: { [key: string]: string[] };
}

interface ApiResponse<T> {
  data: T;
  additionalData: any;
  message: string | null;
  statusCode: number;
  code: string;
}

// Định nghĩa kiểu dữ liệu từ Esgoo API
interface EsgooResponse<T> {
  error: number;
  error_text: string;
  data: T[];
}

interface Province {
  id: string;
  full_name: string;
}

interface District {
  id: string;
  full_name: string;
}

interface ServiceCategory {
  id: string;
  categoryName: string;
}

const ProviderRegisterPage = () => {
  const [step, setStep] = useState<1 | 2>(1); // Quản lý bước: 1 - Đăng ký tài khoản, 2 - Đăng ký nhà cung cấp

  // State cho đăng ký tài khoản (Bước 1)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpIpAddress, setOtpIpAddress] = useState<string | null>(null);
  const [otpDeviceInfo, setOtpDeviceInfo] = useState<string | null>(null);
  const [otpReminder, setOtpReminder] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State cho đăng ký nhà cung cấp (Bước 2)
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [descriptionImages, setDescriptionImages] = useState<string[]>([]);
  const [descriptionImageInput, setDescriptionImageInput] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [serviceCategoryIds, setServiceCategoryIds] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);

  // State chung cho cả hai bước
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Hàm kiểm tra email hợp lệ
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Hàm kiểm tra password hợp lệ (tối thiểu 6 ký tự)
  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  // Lấy danh sách tỉnh từ Esgoo API
  const fetchProvinces = async () => {
    try {
      const response = await axios.get<EsgooResponse<Province>>('https://esgoo.net/api-tinhthanh/4/0.htm');

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách tỉnh từ Esgoo API');
      }

      const responseData = response.data;
      if (responseData.error !== 0) {
        throw new Error(responseData.error_text || 'Lỗi khi lấy danh sách tỉnh');
      }

      const fetchedProvinces = responseData.data || [];
      setProvinces(fetchedProvinces);
      if (fetchedProvinces.length > 0) {
        setProvinceId(fetchedProvinces[0].id);
      }
    } catch (err) {
      console.error('Error fetching provinces:', err);
      setError('Không thể lấy danh sách tỉnh. Vui lòng thử lại sau.');
    }
  };

  // Lấy danh sách quận dựa trên tỉnh từ Esgoo API
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
      if (fetchedDistricts.length > 0) {
        setDistrictId(fetchedDistricts[0].id);
      } else {
        setDistrictId('');
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
      setError('Không thể lấy danh sách quận. Vui lòng thử lại sau.');
    }
  };

  // Lấy danh sách danh mục dịch vụ
  const fetchServiceCategories = async () => {
    try {
      const response = await axiosInstance.get('/api/ServiceCategory/get-all', {
        params: { pageNumber: 1, pageSize: 100 },
      });

      if (response.status !== 200) {
        throw new Error('Lỗi khi lấy danh sách danh mục');
      }

      const responseData: ApiResponse<{ items: ServiceCategory[] }> = response.data;
      if (!responseData || !responseData.data || !Array.isArray(responseData.data.items)) {
        throw new Error('Dữ liệu danh mục dịch vụ không hợp lệ');
      }

      setServiceCategories(responseData.data.items);
    } catch (err) {
      console.error('Error fetching service categories:', err);
      setError('Không thể lấy danh sách danh mục dịch vụ. Vui lòng thử lại sau.');
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchServiceCategories();
  }, []);

  useEffect(() => {
    if (provinceId) {
      fetchDistricts(provinceId);
    }
  }, [provinceId]);

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    setServiceCategoryIds((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  // Thêm URL ảnh mô tả vào danh sách descriptionImages
  const addDescriptionImage = () => {
    if (descriptionImageInput.trim()) {
      setDescriptionImages((prev) => [...prev, descriptionImageInput.trim()]);
      setDescriptionImageInput(''); // Xóa input sau khi thêm
    }
  };

  // Xóa URL ảnh mô tả khỏi danh sách descriptionImages
  const removeDescriptionImage = (index: number) => {
    setDescriptionImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Yêu cầu gửi mã OTP
  const requestOtp = async (email: string) => {
    try {
      setOtpLoading(true);
      setOtpError(null);
      setOtpReminder(null);

      // Lấy thông tin IP và thiết bị khi gửi OTP
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = ipResponse.data.ip || 'unknown';
      const deviceInfo = navigator.userAgent;

      setOtpIpAddress(ipAddress);
      setOtpDeviceInfo(deviceInfo);

      const response = await axiosInstance.post('/api/Auth/request-otp', { email });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Lỗi khi gửi mã OTP');
      }

      setOtpSent(true);
      setOtpReminder('Mã OTP đã được gửi đến email của bạn. Vui lòng nhập mã ngay vì OTP sẽ hết hạn sau 2 phút.');
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi gửi mã OTP';
      if (axiosError.response?.status === 400) {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra email.';
      } else if (axiosError.response?.status === 429) {
        errorMessage = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
      }
      setOtpError(errorMessage);
      console.error('Error requesting OTP:', axiosError);
    } finally {
      setOtpLoading(false);
    }
  };

  // Xác minh OTP và tiến hành đăng ký tài khoản (Bước 1)
  const verifyOtpAndRegisterAccount = async () => {
    try {
      setOtpLoading(true);
      setOtpError(null);
      setOtpReminder(null);

      if (!otpCode) {
        throw new Error('Vui lòng nhập mã OTP');
      }

      const otpPayload = {
        email,
        otpCode: otpCode.trim(),
        ipAddress: otpIpAddress || 'unknown',
        deviceInfo: otpDeviceInfo || navigator.userAgent,
      };

      console.log('OTP Payload:', otpPayload);

      const otpResponse = await axiosInstance.post('/api/Auth/verify-otp', otpPayload);

      if (otpResponse.status !== 200) {
        throw new Error(otpResponse.data?.message || 'Xác minh OTP không thành công');
      }

      console.log('OTP Verification Response:', otpResponse.data);

      // Bước 1: Đăng ký tài khoản
      const signUpPayload = {
        fullName,
        email,
        password,
      };

      // Kiểm tra dữ liệu trước khi gửi
      if (!isValidEmail(email)) {
        throw new Error('Email không hợp lệ. Vui lòng kiểm tra lại.');
      }
      if (!isValidPassword(password)) {
        throw new Error('Mật khẩu không hợp lệ. Mật khẩu phải có ít nhất 6 ký tự.');
      }
      if (!fullName.trim()) {
        throw new Error('Họ và tên không được để trống.');
      }

      console.log('Sign-up Payload:', signUpPayload);

      const signUpResponse = await axiosInstance.post('/api/Auth/sign-up', signUpPayload);

      if (signUpResponse.status !== 200 && signUpResponse.status !== 201) {
        throw new Error(signUpResponse.data?.message || 'Lỗi khi đăng ký tài khoản. Vui lòng kiểm tra lại thông tin.');
      }

      console.log('Sign-up Response:', signUpResponse.data);

      // Chuyển sang bước 2: Đăng ký nhà cung cấp
      setSuccess('Đăng ký tài khoản thành công! Vui lòng hoàn tất thông tin nhà cung cấp.');
      setStep(2);
      setOtpSent(false);
      setOtpCode('');
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi xác minh OTP hoặc đăng ký';
      if (axiosError.response?.status === 400 || axiosError.response?.status === 409) {
        errorMessage = axiosError.response?.data?.message || 'Email đã tồn tại. Vui lòng sử dụng email khác.';
      } else if (axiosError.response?.status === 403) {
        errorMessage = 'IP hoặc thiết bị không hợp lệ. Vui lòng gửi lại OTP và thử lại.';
      }
      setOtpError(errorMessage);
      console.error('Error verifying OTP or registering:', axiosError);
    } finally {
      setOtpLoading(false);
    }
  };

  // Đăng ký nhà cung cấp (Bước 2)
  const registerProvider = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Kiểm tra dữ liệu trước khi gửi
      if (
        !businessName ||
        !phoneNumber ||
        !description ||
        !imageUrl ||
        !openTime ||
        !closeTime ||
        !addressDetail ||
        !postalCode ||
        !provinceId ||
        !districtId ||
        serviceCategoryIds.length === 0
      ) {
        throw new Error('Vui lòng nhập đầy đủ thông tin nhà cung cấp');
      }

      // Kiểm tra fullName có tồn tại không
      if (!fullName || !fullName.trim()) {
        throw new Error('Họ và tên không được để trống. Vui lòng quay lại bước 1 để nhập lại thông tin.');
      }

      // Kiểm tra email có tồn tại không
      if (!email || !isValidEmail(email)) {
        throw new Error('Email không hợp lệ hoặc không tồn tại. Vui lòng quay lại bước 1 để nhập lại email.');
      }

      const providerPayload = {
        businessName,
        phoneNumber,
        description,
        imageUrl,
        descriptionImages,
        openTime,
        closeTime,
        addressDetail,
        postalCode,
        provinceId,
        districtId,
        serviceCategoryIds,
      };

      console.log('Provider Payload:', providerPayload);

      const providerResponse = await axiosInstance.post('/api/request-provider/create', providerPayload);

      if (providerResponse.status !== 200 && providerResponse.status !== 201) {
        throw new Error(providerResponse.data?.message || 'Lỗi khi gửi yêu cầu trở thành provider');
      }

      console.log('Provider Response:', providerResponse.data);

      setSuccess('Đăng ký thành công! Vui lòng chờ admin duyệt yêu cầu của bạn.');
      setTimeout(() => navigate('/provider/login'), 2000);
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      let errorMessage = axiosError.response?.data?.message || 'Lỗi khi đăng ký nhà cung cấp';
      if (axiosError.response?.status === 400) {
        if (axiosError.response?.data?.message?.includes('Email đã tồn tại')) {
          errorMessage = 'Email đã tồn tại trong hệ thống. Vui lòng quay lại bước 1 để sử dụng email khác.';
        } else {
          errorMessage = axiosError.response?.data?.message || 'Thông tin nhà cung cấp không hợp lệ. Vui lòng kiểm tra lại.';
        }
      } else if (axiosError.response?.status === 404) {
        errorMessage = 'Email hoặc họ tên không tồn tại trong hệ thống. Vui lòng quay lại bước 1 để đăng ký tài khoản.';
      }
      setError(errorMessage);
      console.error('Error registering provider:', axiosError);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit cho bước 1 (Đăng ký tài khoản)
  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin đăng ký tài khoản');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (otpSent) {
      // Nếu đã gửi OTP, tiến hành xác minh và đăng ký tài khoản
      await verifyOtpAndRegisterAccount();
    } else {
      // Nếu chưa gửi OTP, gửi yêu cầu OTP
      await requestOtp(email);
    }
  };

  // Xử lý submit cho bước 2 (Đăng ký nhà cung cấp)
  const handleProviderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerProvider();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        {step === 1 ? (
          <form onSubmit={handleAccountSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Đăng ký tài khoản</h2>

            {/* Thông báo lỗi, thành công, và nhắc nhở OTP */}
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
            {otpReminder && (
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded" role="alert">
                {otpReminder}
              </div>
            )}

            {/* Grid layout cho các trường nhập liệu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ và tên */}
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
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Email */}
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
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="relative">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="relative">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Mã OTP và nút gửi OTP */}
              <div className="relative">
                <Label htmlFor="otpCode" className="text-sm font-medium text-gray-700">
                  Mã OTP
                </Label>
                <div className="flex items-center gap-3 mt-1">
                  <div className="relative flex-1">
                    <Input
                      id="otpCode"
                      placeholder="Nhập mã OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                  {!otpSent ? (
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                      onClick={() => requestOtp(email)}
                      disabled={otpLoading || !email || !isValidEmail(email)}
                    >
                      {otpLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-md transition duration-200"
                      onClick={() => requestOtp(email)}
                      disabled={otpLoading}
                    >
                      {otpLoading ? 'Đang gửi...' : 'Gửi lại OTP'}
                    </Button>
                  )}
                </div>
                {otpError && <div className="text-red-500 text-sm mt-2">{otpError}</div>}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
                disabled={loading || otpLoading || !otpSent}
              >
                {loading || otpLoading ? 'Đang xử lý...' : 'Xác minh và Tiếp tục'}
              </Button>
            </div>

            {/* Liên kết đăng nhập */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/provider/login" className="text-blue-600 hover:underline font-medium">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleProviderSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Đăng ký nhà cung cấp</h2>

            {/* Thông báo lỗi và thành công */}
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

            {/* Grid layout cho các trường nhập liệu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên doanh nghiệp */}
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
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Số điện thoại */}
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
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>

              {/* Giờ mở cửa */}
              <div className="relative">
                <Label htmlFor="openTime" className="text-sm font-medium text-gray-700">
                  Giờ mở cửa
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="openTime"
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Giờ đóng cửa */}
              <div className="relative">
                <Label htmlFor="closeTime" className="text-sm font-medium text-gray-700">
                  Giờ đóng cửa
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="closeTime"
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Mô tả
              </Label>
              <div className="relative mt-1">
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả về spa/cửa hàng của bạn"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Ảnh đại diện (imageUrl) */}
            <div>
              <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
                URL ảnh đại diện
              </Label>
              <div className="relative mt-1">
                <Input
                  id="imageUrl"
                  placeholder="Nhập URL ảnh đại diện của spa"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Danh sách ảnh mô tả (descriptionImages) */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Danh sách URL ảnh mô tả</Label>
              <div className="flex items-center gap-3 mt-1">
                <Input
                  placeholder="Nhập URL ảnh mô tả"
                  value={descriptionImageInput}
                  onChange={(e) => setDescriptionImageInput(e.target.value)}
                  className="flex-1 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <Button
                  type="button"
                  onClick={addDescriptionImage}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                  disabled={!descriptionImageInput.trim()}
                >
                  <Plus size={20} />
                </Button>
              </div>
              {descriptionImages.length > 0 && (
                <div className="mt-2 space-y-2">
                  {descriptionImages.map((imgUrl, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 truncate">{imgUrl}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeDescriptionImage(index)}
                        className="p-1"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Địa chỉ chi tiết */}
            <div>
              <Label htmlFor="addressDetail" className="text-sm font-medium text-gray-700">
                Địa chỉ chi tiết
              </Label>
              <div className="relative mt-1">
                <Textarea
                  id="addressDetail"
                  placeholder="Nhập địa chỉ chi tiết"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Grid layout cho mã bưu điện, tỉnh và quận */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Mã bưu điện */}
              <div>
                <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                  Mã bưu điện
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="postalCode"
                    placeholder="Nhập mã bưu điện"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tỉnh/Thành phố */}
              <div>
                <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                  Tỉnh/Thành phố
                </Label>
                <select
                  id="province"
                  value={provinceId}
                  onChange={(e) => setProvinceId(e.target.value)}
                  className="w-full border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {/* Quận/Huyện */}
              <div>
                <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                  Quận/Huyện
                </Label>
                <select
                  id="district"
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!provinceId}
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
            </div>

            {/* Danh mục dịch vụ */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Danh mục dịch vụ</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-4">
                {serviceCategories.length === 0 ? (
                  <p className="text-gray-600 text-sm">Không có danh mục dịch vụ</p>
                ) : (
                  serviceCategories.map((category) => (
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

            {/* Nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
                disabled={loading}
              >
                {loading ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded-md transition duration-200"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Quay lại
              </Button>
            </div>

            {/* Liên kết đăng nhập */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/provider/login" className="text-blue-600 hover:underline font-medium">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProviderRegisterPage;