import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa6';
import { requestOtp, signUp, verifyOtp } from '@/services/auth';

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRequestOtp = async () => {
    if (!email) return setError('Vui lòng nhập email');
    try {
      await requestOtp(email);
      setOtpSent(true);
      setResendCooldown(60);
      const countdown = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) return clearInterval(countdown), 0;
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể gửi OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword || !otp)
      return setError('Vui lòng điền đầy đủ thông tin');
    if (password !== confirmPassword) return setError('Mật khẩu không khớp');
    if (!agreeTerms) return setError('Vui lòng đồng ý với điều khoản');

    try {
      setIsLoading(true);
      setError(null);
      await verifyOtp({ email, otpCode: otp, ipAddress: '127.0.0.1', deviceInfo: 'web-browser' });
      await signUp({ fullName, email, password });
      alert('Đăng ký thành công');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 bg-gradient-to-b from-blue-50 to-gray-100 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight animate-fadeInUp">Đăng ký tài khoản</h2>
          <p className="mt-3 text-lg text-gray-600 animate-fadeInUp animation-delay-200">
            Tạo tài khoản mới để trải nghiệm dịch vụ spa tốt nhất cùng Zenora!
          </p>
        </div>

        <div className="bg-white p-10 rounded-2xl shadow-xl transform transition-all duration-500 hover:shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-fadeInUp">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2">Họ và tên</label>
              <div className="relative">
                <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" className="pl-12 py-6 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" required />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <User size={20} />
                </div>
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">Email</label>
              <div className="relative">
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" className="pl-12 py-6 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" required />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            {otpSent && (
              <div className="mb-5">
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-800 mb-2">Mã OTP</label>
                <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Nhập mã OTP" className="py-6 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" required />
                <div className="text-sm mt-2 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-cyan-600 hover:text-cyan-800 hover:underline px-0 font-semibold"
                    onClick={handleRequestOtp}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Gửi lại OTP (${resendCooldown}s)` : 'Gửi lại OTP'}
                  </Button>
                </div>
              </div>
            )}

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">Mật khẩu</label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-12 pr-12 py-6 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" required />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock size={20} />
                </div>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">Xác nhận mật khẩu</label>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="pl-12 pr-12 py-6 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" required />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock size={20} />
                </div>
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!otpSent && (
              <Button type="button" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={handleRequestOtp}>Gửi OTP</Button>
            )}

            <div className="flex items-center mb-6 mt-6">
              <Checkbox id="agree-terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked === true)} />
              <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-700">
                Tôi đồng ý với <Link to="/terms" className="text-cyan-600 hover:text-cyan-800 font-semibold">Điều khoản sử dụng</Link>
              </label>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" disabled={isLoading}>
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký ngay'}
            </Button>
          </form>

          <div className="relative flex items-center justify-center mt-8 mb-6">
            <div className="absolute border-t border-gray-200 w-full"></div>
            <div className="relative bg-white px-4 text-sm text-gray-600 font-medium">Hoặc đăng ký với</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <FaFacebookF className="mr-2 text-blue-600" size={20} /> Facebook
            </Button>
            <Button variant="outline" className="flex items-center justify-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <FaGithub className="mr-2 text-gray-800" size={20} /> Github
            </Button>
            <Button variant="outline" className="flex items-center justify-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <FaGoogle className="mr-2 text-red-600" size={20} /> Google
            </Button>
          </div>

          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link to="/login" className="text-cyan-600 hover:text-cyan-800 font-semibold">Đăng nhập ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}