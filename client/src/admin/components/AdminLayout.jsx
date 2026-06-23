import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin } = useAuth();

  return (
    <div className="min-h-screen bg-light flex" dir="rtl">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* محتوای اصلی */}
      <div className="flex-1 lg:mr-64">

        {/* هدر */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-navy hover:text-primary transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3 mr-auto">
            <div className="text-left">
              <p className="text-xs text-gray">پنل مدیریت</p>
              <p className="text-sm font-medium text-navy">
                {admin?.username}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              {admin?.username?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* صفحه */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}