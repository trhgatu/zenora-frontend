import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/features/user/home/pages';
import { FacilityDetailPage } from '@/features/user/facility/pages';
import DashboardPage from '@/features/admin/dashboard/pages/Dashboard';
import { LoginPage, RegisterPage } from '@/features/user/auth/pages';
import { AdminLayout, MainLayout } from '@/layouts';
import ROUTERS from '@/constants/router';
import ScrollToTop from '@/components/ScrollToTop';
import ManageFacilityPage from '@/features/admin/manage-facilities/pages/ManageFacility';
import ManageUserPage from '@/features/admin/manage-users/pages/ManageUser';
import ManagePromotionPage from '@/features/admin/manage-promotions/pages/ManagePromotion';

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path={ROUTERS.USER.home} element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTERS.USER.facilityDetail.replace(':id', ':id')} element={<FacilityDetailPage />} />
          <Route path={ROUTERS.USER.login} element={<LoginPage />} />
          <Route path={ROUTERS.USER.register} element={<RegisterPage />} />
        </Route>

        <Route path={ROUTERS.ADMIN.root} element={<AdminLayout />}>
          <Route index element={<Navigate to={ROUTERS.ADMIN.dashboard} replace />} />
          <Route path={ROUTERS.ADMIN.dashboard} element={<DashboardPage />} />
          <Route path={ROUTERS.ADMIN.facility} element={<ManageFacilityPage />} />
          <Route path={ROUTERS.ADMIN.user} element={<ManageUserPage />} />
          <Route path={ROUTERS.ADMIN.promotion} element={<ManagePromotionPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;