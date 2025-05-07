// src/components/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <Outlet />
      </main>
    </div>
  );
};