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
import { ManageCategoryPage, CreateCategoryPage, EditCategoryPage, DetailCategoryPage } from "@/features/admin/manage-categories/pages";
import { ManagePromotionPage } from "@/features/admin/manage-promotions/pages";
import { CreatePromotionPage } from "@/features/admin/manage-promotions/pages/CreatePromotion";

import { ManageRankPage, CreateRankPage, EditRankPage, DetailRankPage } from "@/features/admin/manage-ranks/pages";
import { ManageUserPage, DetailUserPage, EditUserPage } from "@/features/admin/manage-users/pages";
import { ManageServicePage, CreateServicePage, DetailServicePage } from "@/features/admin/manage-services/pages";
import ManageFacilityPage from "./features/admin/manage-facilities/pages/ManageFacility";
import { SpaBranchDetail } from "./features/admin/manage-facilities/pages/SpaBranchDetail";

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
            <Route path={ROUTERS.ADMIN.facility.root}>
              <Route index element={<ManageFacilityPage />} />
              <Route path="show/:id" element={<SpaBranchDetail />} />
            </Route>
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
              <Route path="edit/:id" element={<EditUserPage />} />
              <Route path="detail/:id" element={<DetailUserPage />} />
            </Route>
            <Route path="categories">
              <Route index element={<ManageCategoryPage />} />
              <Route path="create" element={<CreateCategoryPage />} />
              <Route path="edit/:id" element={<EditCategoryPage />} />
              <Route path="detail/:id" element={<DetailCategoryPage />} />
            </Route>
            <Route path="services">
              <Route index element={<ManageServicePage />} />
              <Route path="create" element={<CreateServicePage />} />
              <Route path="detail/:id" element={<DetailServicePage />} />
            </Route>
            <Route path="promotions">
              <Route index element={<ManagePromotionPage />} />
              <Route path="create" element={<CreatePromotionPage />} />

            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;