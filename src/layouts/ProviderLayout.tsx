import { Outlet } from 'react-router-dom';
import ProviderHeader from '../components/common/Provider/ProviderHeader';
import ProviderSidebar from '../components/common/Provider/ProviderSidebar';

const ProviderLayout = () => {
  return (
    <div className="flex h-screen">
      <ProviderSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProviderHeader />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;