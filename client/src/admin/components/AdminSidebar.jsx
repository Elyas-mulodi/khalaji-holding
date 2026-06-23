import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Tag,
  Images,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../../assets/logo-transformed.png";

const menuItems = [
  { title: "داشبورد", path: "/admin", icon: LayoutDashboard },
  { title: "پروژه‌ها", path: "/admin/projects", icon: FolderKanban },
  { title: "دسته‌بندی‌ها", path: "/admin/categories", icon: Tag },
  { title: "اسلایدر", path: "/admin/slider", icon: Images },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const { logout, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      {/* overlay موبایل */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-navy z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {/* هدر sidebar */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <img src={logo} alt="خلجی هولدینگ" className="h-10 w-auto brightness-0 invert" />
          <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* اطلاعات ادمین */}
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-white/40 text-xs">خوش آمدید</p>
          <p className="text-white font-medium text-sm mt-0.5">
            {admin?.username || "ادمین"}
          </p>
        </div>

        {/* منو */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path ||
              (item.path !== "/admin" && pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.title}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-0 w-1 h-8 bg-primary rounded-l-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* خروج */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={18} />
            خروج از پنل
          </button>
        </div>
      </aside>
    </>
  );
}