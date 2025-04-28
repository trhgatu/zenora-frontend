// src/components/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '@/components/common/main/Header';
import Footer from '@/components/common/main/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};