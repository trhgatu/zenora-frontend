import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { login } from '@/store/authSlice';
import { toast } from 'react-toastify';

const ProviderLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector(state => state.auth);



  useEffect(() => {
    if (isAuthenticated) {
      // Chuyển hướng đến trang chủ Provider (/provider) sau khi đăng nhập thành công
      navigate('/provider', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      const resultAction = await dispatch(login({ email, password }));

      if (login.rejected.match(resultAction)) {
        const errorMsg = (resultAction.payload as string) || 'Đăng nhập thất bại';
        const lowerCaseMsg = errorMsg.toLowerCase();

        // Hiển thị thông báo cụ thể
        if (
          lowerCaseMsg.includes('invalid') ||
          lowerCaseMsg.includes('unauthorized') ||
          lowerCaseMsg.includes('sai') ||
          lowerCaseMsg.includes('không đúng')
        ) {
          toast.error('Sai mật khẩu hoặc email');
        } else if (lowerCaseMsg.includes('không phải là provider')) {
          toast.error('Tài khoản của bạn không có quyền truy cập');
        } else {
          toast.error(errorMsg); // fallback
        }
      }
    } catch (err) {
      console.error('Unexpected error during login:', err);
      toast.error('Lỗi đăng nhập. Vui lòng thử lại.');
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Nhà cung cấp Đăng nhập</h2>
        <div className="relative">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
          />
          <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(c) => setRememberMe(!!c)} />
          <label htmlFor="remember-me" className="text-sm text-gray-600">
            Ghi nhớ đăng nhập
          </label>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </div>
  );
};

export default ProviderLoginPage;