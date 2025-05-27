import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import ROUTERS from '@/constants/router';

const PrivateProviderRoute = () => {
  const { isAuthenticated, user, isInitialized } = useAppSelector(state => state.auth);
  const location = useLocation();

  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Đang kiểm tra đăng nhập...</div>;
  }

  if (!isAuthenticated || (user && user.role !== 'Provider')) {
    return <Navigate to={ROUTERS.PROVIDER.auth.login} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateProviderRoute;