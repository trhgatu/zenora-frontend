import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { restoreAuth } from "@/store/authSlice";
import ScrollToTop from "@/components/ScrollToTop";

// Admin Imports
import { AdminLoginPage } from "@/features/admin/auth/page";
import { AdminLayout } from "@/layouts/AdminLayout";
import ROUTERS from "@/constants/router";
import PrivateRoute from "@/routes/PrivateRoute";
import DashboardPage from "@/features/admin/dashboard/pages/Dashboard";
import { CreateRolePage, EditRolePage, DetailRolePage, ManageRolePage } from "@/features/admin/manage-roles/pages";
import { ManageCategoryPage, CreateCategoryPage } from "@/features/admin/manage-categories/pages";
import { ManagePromotionPage } from "@/features/admin/manage-promotions/pages";
import { ManageRankPage, CreateRankPage, EditRankPage, DetailRankPage } from "@/features/admin/manage-ranks/pages";
// Provider Imports
import { ManageUserPage, CreateUserPage, DetailUserPage, EditUserPage } from "@/features/admin/manage-users/pages";
import { ProviderLayout } from "@/layouts/ProviderLayout";
import { ProviderLoginPage } from "@/features/provider/auth/pages";
import { ProviderDashboardPage } from "@/features/provider/dashboard/pages/Dashboard";
import { ManageServicePage, CreateServicePage, DetailServicePage } from "@/features/admin/manage-services/pages";
/* import { ProviderLoginPage } from "@/features/provider/auth/pages";
import { ProviderDashboardPage } from "@/features/provider/dashboard/pages"; */

function App() {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Đang tải trạng thái đăng nhập...
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path={ROUTERS.ADMIN.auth.login} element={<AdminLoginPage />} />
        <Route path={ROUTERS.ADMIN.root} element={<PrivateRoute allowedRoles={["Admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to={ROUTERS.ADMIN.dashboard} replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="roles">
              <Route index element={<ManageRolePage />} />
              <Route path="create" element={<CreateRolePage />} />
              <Route path="edit/:id" element={<EditRolePage />} />
              <Route path="detail/:id" element={<DetailRolePage />} />
            </Route>
            <Route path="ranks">
              <Route index element={<ManageRankPage />} />
              <Route path="create" element={<CreateRankPage />} />
              <Route path="edit/:id" element={<EditRankPage />} />
              <Route path="detail/:id" element={<DetailRankPage />} />
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
            <Route path="services">
              <Route index element={<ManageServicePage />} />
              <Route path="create" element={<CreateServicePage />} />
              <Route path="detail/:id" element={<DetailServicePage />} />
            </Route>
            <Route path="promotions">
              <Route index element={<ManagePromotionPage />} />
            </Route>
          </Route>
        </Route>

        <Route path={ROUTERS.PROVIDER.auth.login} element={<ProviderLoginPage />} />
        <Route path={ROUTERS.PROVIDER.root} element={<PrivateRoute allowedRoles={["Provider"]} />}>
          <Route element={<ProviderLayout />}>
            <Route index element={<Navigate to={ROUTERS.PROVIDER.dashboard} replace />} />
            <Route path="dashboard" element={<ProviderDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
