import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import HomePage from '@/features/home/pages/HomePage';
import FacilityDetailPage from '@/features/facility/pages/FacilityDetailPage';
import DashboardPage from '@/features/admin/pages/Dashboard';
import FacilityManagePage from '@/features/admin/pages/FacilityManage';
import { LoginPage, RegisterPage } from '@/features/auth/pages';
import { AdminLayout } from '@/layouts/AdminLayout';
import ROUTERS from '@/constants/router';

function App() {
  return (
    <Router>
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
          <Route path={ROUTERS.ADMIN.facility} element={<FacilityManagePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;