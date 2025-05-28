import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '@/features/admin/dashboard/pages/Dashboard'
import { AdminLayout } from '@/layouts'
import ROUTERS from '@/constants/router'
import ScrollToTop from '@/components/ScrollToTop'
import { ManagePromotionPage, DetailPromotionPage, EditPromotionPage } from '@/features/admin/manage-promotions/pages'
import { CreateRolePage, DetailRolePage, EditRolePage, ManageRolePage } from '@/features/admin/manage-roles/pages'
import { ManageCategoryPage } from '@/features/admin/manage-categories/pages'
import { ManageServicePage } from '@/features/admin/manage-services/pages/ManageService'
import { CreateServicePage, DetailServicePage, EditServicePage } from '@/features/admin/manage-services/pages'
import { CreateRankPage, EditRankPage, ManageRankPage, DetailRankPage } from '@/features/admin/manage-ranks/pages'
import PrivateRoute from '@/routes/PrivateRoute'
import { AdminLoginPage } from '@/features/admin/auth/page'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { restoreAuth } from '@/store/authSlice'
import { CreateUserPage, DetailUserPage, EditUserPage, ManageUserPage } from '@/features/admin/manage-users/pages'
import { CreateCategoryPage } from '@/features/admin/manage-categories/pages/CreateCategory'

function App() {
  const dispatch = useAppDispatch()
  const { isInitialized } = useAppSelector(state => state.auth)

  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải trạng thái đăng nhập...
      </div>
    )
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path={ROUTERS.ADMIN.auth.login} element={<AdminLoginPage />} />
        <Route path={ROUTERS.ADMIN.root} element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to={ROUTERS.ADMIN.dashboard} replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="categories" element={<ManageCategoryPage />} />
            <Route path="ranks">
              <Route index element={<ManageRankPage />} />
              <Route path="create" element={<CreateRankPage />} />
              <Route path="edit/:id" element={<EditRankPage />} />
              <Route path="detail/:id" element={<DetailRankPage />} />
            </Route>
            <Route path="promotions">
              <Route index element={<ManagePromotionPage />} />
              <Route path="detail/:id" element={<DetailPromotionPage />} />
              <Route path="edit/:id" element={<EditPromotionPage />} />
            </Route>
            <Route path="services">
              <Route index element={<ManageServicePage />} />
              <Route path="create" element={<CreateServicePage />} />
              <Route path="edit/:id" element={<EditServicePage />} />
              <Route path="detail/:id" element={<DetailServicePage />} />
            </Route>
            <Route path="roles">
              <Route index element={<ManageRolePage />} />
              <Route path="create" element={<CreateRolePage />} />
              <Route path="edit/:id" element={<EditRolePage />} />
              <Route path="detail/:id" element={<DetailRolePage />} />
            </Route>
            <Route path="users">
              <Route index element={<ManageUserPage />} />
              <Route path="create" element={<CreateUserPage />} />
              <Route path="edit/:id" element={<EditUserPage />} />
              <Route path="detail/:id" element={<DetailUserPage />} />
            </Route>
            <Route path="categories">
              <Route index element={<ManageCategoryPage />} />
              <Route path="create" element={<CreateCategoryPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
