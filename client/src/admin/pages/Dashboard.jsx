import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FolderKanban, Tag, Images, TrendingUp, ArrowLeft } from "lucide-react";
import { getProjects, getCategories, getSliders } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    totalCategories: 0,
    totalSliders: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [allProjects, ongoingProjects, categories, sliders] =
          await Promise.all([
            getProjects({ limit: 100 }),
            getProjects({ ongoing: true, limit: 100 }),
            getCategories(),
            getSliders(),
          ]);

        setStats({
          totalProjects: allProjects.data.total,
          ongoingProjects: ongoingProjects.data.total,
          totalCategories: categories.data.count,
          totalSliders: sliders.data.count,
        });

        setRecentProjects(allProjects.data.data.slice(0, 5));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "کل پروژه‌ها",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "bg-blue-50 text-blue-600",
      link: "/admin/projects",
    },
    {
      title: "پروژه‌های جاری",
      value: stats.ongoingProjects,
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
      link: "/admin/projects",
    },
    {
      title: "دسته‌بندی‌ها",
      value: stats.totalCategories,
      icon: Tag,
      color: "bg-green-50 text-green-600",
      link: "/admin/categories",
    },
    {
      title: "اسلایدرها",
      value: stats.totalSliders,
      icon: Images,
      color: "bg-purple-50 text-purple-600",
      link: "/admin/slider",
    },
  ];

  return (
    <div>
      {/* هدر */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">داشبورد</h1>
        <p className="text-gray text-sm mt-1">خلاصه وضعیت سایت</p>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={card.link}
                className="block bg-white border border-border p-6 hover:border-primary transition-colors duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <ArrowLeft
                    size={16}
                    className="text-gray group-hover:text-primary transition-colors"
                  />
                </div>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-3xl font-bold text-navy mb-1">
                    {card.value}
                  </p>
                )}
                <p className="text-sm text-gray">{card.title}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* پروژه‌های اخیر */}
      <div className="bg-white border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-bold text-navy">پروژه‌های اخیر</h2>
          <Link
            to="/admin/projects"
            className="text-sm text-primary hover:underline"
          >
            مشاهده همه
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4 items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <p className="text-gray text-center py-12 text-sm">
            پروژه‌ای ثبت نشده است
          </p>
        ) : (
          <div className="divide-y divide-border">
            {recentProjects.map((project) => (
              <div
                key={project._id}
                className="flex items-center gap-4 px-6 py-4"
              >
                {/* عکس */}
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {project.images?.[0] ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${project.images[0]}`}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban size={16} className="text-gray-400" />
                    </div>
                  )}
                </div>

                {/* اطلاعات */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy truncate">
                    {project.title}
                  </p>
                  <p className="text-xs text-gray mt-0.5">
                    {project.category?.name || "بدون دسته‌بندی"}
                  </p>
                </div>

                {/* وضعیت */}
                <span
                  className={`text-[10px] font-medium px-3 py-1 rounded-full shrink-0 ${
                    project.ongoing
                      ? "bg-primary/10 text-primary"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {project.ongoing ? "در حال اجرا" : "تکمیل‌شده"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
