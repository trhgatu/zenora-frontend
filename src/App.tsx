import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from '@/features/user/home/pages'
import { FacilityDetailPage } from '@/features/user/facility/pages'
import DashboardPage from '@/features/admin/dashboard/pages/Dashboard'
import { LoginPage, RegisterPage } from '@/features/user/auth/pages'
import { AdminLayout, MainLayout } from '@/layouts'
import ROUTERS from '@/constants/router'
import ScrollToTop from '@/components/ScrollToTop'
import ManageFacilityPage from '@/features/admin/manage-facilities/pages/ManageFacility'
import ManageUserPage from '@/features/admin/manage-users/pages/ManageUser'
import ManagePromotionPage from '@/features/admin/manage-promotions/pages/ManagePromotion'
import { CreateRolePage, EditRolePage, ManageRolePage } from '@/features/admin/manage-roles/pages'
import { ManageCategoryPage } from '@/features/admin/manage-categories/pages/ManageCategory'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path={ROUTERS.USER.home} element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTERS.USER.facilityDetail} element={<FacilityDetailPage />} />
          <Route path={ROUTERS.USER.login} element={<LoginPage />} />
          <Route path={ROUTERS.USER.register} element={<RegisterPage />} />
        </Route>

        <Route path={ROUTERS.ADMIN.root} element={<AdminLayout />}>
          <Route index element={<Navigate to={ROUTERS.ADMIN.dashboard} replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="facilities" element={<ManageFacilityPage />} />
          <Route path="categories" element={<ManageCategoryPage />} />
          <Route path="users" element={<ManageUserPage />} />
          <Route path="promotions" element={<ManagePromotionPage />} />

          <Route path="roles">
            <Route index element={<ManageRolePage />} />
            <Route path="create" element={<CreateRolePage />} />
             <Route path="edit/:id" element={<EditRolePage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
