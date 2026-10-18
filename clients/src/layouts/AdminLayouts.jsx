
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import AdminSidebar from '../components/adminComponents/AdminSidebar.jsx';

const AdminLayouts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full min-w-0 gap-0 bg-gray-50 lg:gap-6 lg:p-6">

      {/* Sidebar: desktop + mobile drawer */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="min-w-0 flex-1 p-3 sm:p-4 lg:p-0">

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className="mb-4 rounded-lg border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-50 lg:hidden"
          aria-label="Open admin sidebar"
        >
          <FaBars size={20} />
        </button>

        <Outlet />

      </div>
    </div>
  );
};

export default AdminLayouts;
