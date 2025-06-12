  import { useEffect } from 'react'
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

  import ROUTERS from '@/constants/router'
  import ScrollToTop from '@/components/ScrollToTop'
  import PrivateProviderRoute from './routes/PrivateProviderRoute'
  import { useAppDispatch, useAppSelector } from '@/hooks'
  import { restoreAuth } from '@/store/authSlice'
  import ProviderLayout from '@/layouts/ProviderLayout'
  import ProviderLoginPage from '@/features/provider/auth/pages/ProviderLoginPage';
  import ProviderDashboard from '@/features/provider/dashboard/pages/ProviderDashboard';
  import { ProviderServicesPage, DetailServicePage, EditServicePage, CreateServicePage } from '@/features/provider/manage-services/pages'
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
  import { ManageAppointmentPage, ShowAppointmentPage } from '@/features/provider/manage-Appointment/pages';

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
        <Route path={ROUTERS.PROVIDER.auth.login} element={<ProviderLoginPage />} />
        <Route path="/provider/register" element={<ProviderRegisterPage />} />
        <Route path={ROUTERS.PROVIDER.root} element={<PrivateProviderRoute />}>
          <Route element={<ProviderLayout />}>
            <Route index element={<ProviderDashboard />} />
            <Route path={ROUTERS.PROVIDER.services} element={<ProviderServicesPage />} />
            <Route path="/provider/services/create" element={<CreateServicePage />} />
            <Route path="/provider/services/edit/:id" element={<EditServicePage />} />
            <Route path="/provider/services/detail/:id" element={<DetailServicePage />} />
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
           <Route path="appointments">
              <Route index element={<ManageAppointmentPage />} />
              <Route path="show/:id" element={<ShowAppointmentPage />} />
            </Route>
          </Route>
        </Route>

        </Routes>
      </Router>
    )
  }

  export default App
