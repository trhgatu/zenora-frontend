import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import HomePage from '@/features/home/pages/HomePage';
import FacilityDetailPage from '@/features/facility/pages/FacilityDetailPage';
import DashboardPage from '@/features/admin/pages/Dashboard';
import { LoginPage, RegisterPage } from '@/features/auth/pages';
import { AdminLayout } from '@/layouts/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="facility/:id" element={<FacilityDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;