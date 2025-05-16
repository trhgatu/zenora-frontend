import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, Facebook, Github } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from '@/services/auth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setLoginError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      setLoginError(null);

      const response = await signIn({ email, password });
      const token = response.data?.token || response.data;
      localStorage.setItem('accessToken', token);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập của bạn.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen px-4 bg-gradient-to-b from-blue-50 to-gray-100 py-12">
      <div className="max-w-md mx-auto">
        {/* Logo and header */}
        <div className="text-center mb-10">
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight animate-fadeInUp">Đăng nhập</h2>
          <p className="mt-3 text-lg text-gray-600 animate-fadeInUp animation-delay-200">
            Chào mừng bạn trở lại Zenora! Đăng nhập để tiếp tục trải nghiệm.
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white p-10 rounded-2xl shadow-xl transform transition-all duration-500 hover:shadow-2xl">
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm animate-fadeInUp">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-12 py-6 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            {/* Password field */}
            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-12 pr-12 py-6 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Lock size={20} />
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                  Nhớ tài khoản
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-800 font-semibold">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập ngay'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center mt-8 mb-6">
            <div className="absolute border-t border-gray-200 w-full"></div>
            <div className="relative bg-white px-4 text-sm text-gray-600 font-medium">
              Hoặc đăng nhập với
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <Facebook size={20} className="mr-2 text-blue-600" />
              <span>Facebook</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <Github size={20} className="mr-2 text-gray-800" />
              <span>Github</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <FaGoogle size={20} className="mr-2 text-red-600" />
              <span>Google</span>
            </Button>
          </div>

          {/* Register link */}
          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link to="/register" className="text-cyan-600 hover:text-cyan-800 font-semibold">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};