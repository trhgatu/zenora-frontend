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
  import 'react-toastify/dist/ReactToastify.css'
  import ProviderLayout from '@/layouts/ProviderLayout'
  import { ToastContainer } from 'react-toastify';
  // import ProviderLoginPage from '../src/features/provider/pages/ProviderLoginPage'
  // import ProviderDashboard from '../src/features/provider/pages/ProviderDashboard'
  // import ProviderServices from '../src/features/provider/pages/ProviderServices'
  // import CreateService from './features/provider/pages/CreateService'
  import ProviderLoginPage from '@/features/provider/pages/ProviderLoginPage';
  import ProviderDashboard from '@/features/provider/pages/ProviderDashboard';
  import ProviderServices from '@/features/provider/pages/ProviderServices';
  import CreateService from '@/features/provider/pages/CreateService';
  import ProviderManage from '@/features/provider/pages/ProviderManage';
  import ServiceProviderInformation from '@/features/provider/pages/ServiceProviderInformation';
  import ProviderPromotions from '@/features/provider/pages/ProviderPromotions';
  import ProviderStaff from '@/features/provider/pages/ProviderStaff';
  import ProviderImages from '@/features/provider/pages/ProviderImages';  



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

        {/* Route cho Provider (bảo vệ bằng PrivateProviderRoute) */}
        <Route path={ROUTERS.PROVIDER.root} element={<PrivateProviderRoute />}>
          <Route element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path={ROUTERS.PROVIDER.services} element={<ProviderServices />} />
            <Route path={ROUTERS.PROVIDER.service.create} element={<CreateService />} />
            <Route path={ROUTERS.PROVIDER.manager.managerProvider} element={<ServiceProviderInformation />} />
            <Route path="promotions" element={<ProviderPromotions />} />
            <Route path="staff" element={<ProviderStaff />} />
            <Route path="images" element={<ProviderImages />} />
          </Route>
        </Route>
                
        </Routes>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    )
  }

  export default App
