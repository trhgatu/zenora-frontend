import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'
import ROUTERS from '@/constants/router'

const PrivateRoute = () => {
  const { isAuthenticated, isInitialized, user } = useAppSelector(state => state.auth)

  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Đang kiểm tra đăng nhập...</div>
  }

  if (!isAuthenticated || user?.role !== 'Admin') {
    return <Navigate to={ROUTERS.ADMIN.auth.login} replace />
  }
  return <Outlet />
}

export default PrivateRoute
