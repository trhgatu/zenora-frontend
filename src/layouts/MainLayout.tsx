// src/components/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '@/components/common/user/Header';
import Footer from '@/components/common/user/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};