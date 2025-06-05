  import { useEffect } from 'react'
  import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
  import DashboardPage from '@/features/admin/dashboard/pages/Dashboard'
  import { AdminLayout } from '@/layouts'
  import ROUTERS from '@/constants/router'
  import ScrollToTop from '@/components/ScrollToTop'
  import ManagePromotionPage from '@/features/admin/manage-promotions/pages/ManagePromotion'
  import { CreateRolePage, DetailRolePage, EditRolePage, ManageRolePage } from '@/features/admin/manage-roles/pages'
  import { ManageCategoryPage } from '@/features/admin/manage-categories/pages'
  import { ManageServicePage } from '@/features/admin/manage-services/pages/ManageService'
  import { CreateServicePage, DetailServicePage, EditServicePage } from '@/features/admin/manage-services/pages'
  import { CreateRankPage, EditRankPage, ManageRankPage, DetailRankPage } from '@/features/admin/manage-ranks/pages'
  import PrivateRoute from '@/routes/PrivateRoute'
  import PrivateProviderRoute from './routes/PrivateProviderRoute'
  import { AdminLoginPage } from '@/features/admin/auth/page'
  import { useAppDispatch, useAppSelector } from '@/hooks'
  import { restoreAuth } from '@/store/authSlice'
  import { CreateUserPage, EditUserPage, ManageUserPage } from '@/features/admin/manage-users/pages'
  import { CreateCategoryPage } from '@/features/admin/manage-categories/pages/CreateCategory'

  import ProviderLayout from '@/layouts/ProviderLayout'
  import ProviderLoginPage from '@/features/provider/auth/pages/ProviderLoginPage';
  import ProviderDashboard from '@/features/provider/dashboard/pages/ProviderDashboard';
  import ProviderServices from '@/features/provider/manage-services/pages/ProviderServicesPage';
  import CreateService from '@/features/provider/manage-services/pages/CreateServicePage';
  import EditService from '@/features/provider/manage-services/pages/EditServicePage';
  import ProviderManage from '@/features/provider/manage-account/pages/ProviderManage';
  import ProviderPromotions from '@/features/provider/manage-promotions/pages/ProviderPromotions';
  import CreatePromotionPage from '@/features/provider/manage-promotions/pages/CreatePromotionPage';
  import EditPromotionPage from '@/features/provider/manage-promotions/pages/EditPromotionPage';
  import ProviderFlashSales from '@/features/provider/manage-flash-sales/pages/ProviderFlashSales';
  import CreateFlashSalePage from '@/features/provider/manage-flash-sales/pages/CreateFlashSalePage';
  import EditFlashSalePage from '@/features/provider/manage-flash-sales/pages/EditFlashSalePage';
  import ProviderStaff from '@/features/provider/manage-staff/pages/ProviderStaff';
  import EditStaffPage from '@/features/provider/manage-staff/pages/EditStaffPage'
  import CreateStaffPage from '@/features/provider/manage-staff/pages/CreateStaffPage'
  import ProviderImages from '@/features/provider/manage-images/pages/ProviderImages';  
  import ProviderMessages from '@/features/provider/manage-messages/pages/ProviderMessages';
  import ProviderRegisterPage from '@/features/provider/auth/pages/ProviderRegisterPage';
  import ProviderWorkingHour from '@/features/provider/manage-working-hours/pages/ProviderWorkingHour';
  import ProviderSpaLocation from '@/features/provider/manage-branches/pages/ProviderSpaLocation';


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
              <Route path="promotions" element={<ManagePromotionPage />} />
              <Route path="ranks">
                <Route index element={<ManageRankPage />} />
                <Route path="create" element={<CreateRankPage />} />
                <Route path="edit/:id" element={<EditRankPage />} />
                <Route path="detail/:id" element={<DetailRankPage />} />
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
              </Route>
              <Route path="categories">
                <Route index element={<ManageCategoryPage />} />
                <Route path="create" element={<CreateCategoryPage />} />
              </Route>
            </Route>
          </Route>

 {/* Route đăng nhập Provider */}
        <Route path={ROUTERS.PROVIDER.auth.login} element={<ProviderLoginPage />} />
        
        <Route path="/provider/register" element={<ProviderRegisterPage />} />

        {/* Route cho Provider (bảo vệ bằng PrivateProviderRoute) */}
        <Route path={ROUTERS.PROVIDER.root} element={<PrivateProviderRoute />}>
          <Route element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path={ROUTERS.PROVIDER.services} element={<ProviderServices />} />
            <Route path="/provider/services/create" element={<CreateService />} />
            <Route path="/provider/services/edit/:id" element={<EditService />} />
            <Route path={ROUTERS.PROVIDER.manage} element={<ProviderManage />} />
            <Route path="promotions" element={<ProviderPromotions />} />
            <Route path="/provider/promotions/create" element={<CreatePromotionPage />} />
            <Route path="/provider/promotions/edit/:id" element={<EditPromotionPage />} />
            <Route path="flash-sales" element={<ProviderFlashSales />} />
            <Route path="/provider/flash-sales/create" element={<CreateFlashSalePage />} />
            <Route path="/provider/flash-sales/edit/:id" element={<EditFlashSalePage />} />
            <Route path="staff" element={<ProviderStaff />} />
            <Route path="/provider/staff/create" element={<CreateStaffPage />} />
            <Route path="/provider/staff/edit/:id" element={<EditStaffPage />} />
            <Route path="images" element={<ProviderImages />} />
            <Route path="working-hours" element={<ProviderWorkingHour />} />
            <Route path="spa-location" element={<ProviderSpaLocation />} />
            <Route path="messages" element={<ProviderMessages />} />
          </Route>
        </Route>
                
        </Routes>
      </Router>
    )
  }

  export default App
