import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/hooks'
import ROUTERS from '@/constants/router'

const PrivateRoute = () => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth)

  if (!isAuthenticated || user?.role !== 'Admin') {
    return <Navigate to={ROUTERS.ADMIN.auth.login} replace />
  }

  return <Outlet />
}

export default PrivateRoute
