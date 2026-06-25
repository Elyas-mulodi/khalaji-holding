import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, ChevronDown, X } from "lucide-react";
import { getCategories, getProjects } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

function SafeImage({ src, alt, className }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <ImageOff size={28} className="text-gray-400" />
      </div>
    );
  }
  return (
    <img src={src} alt={alt} onError={() => setError(true)} className={className} />
  );
}

export default function Projects() {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // فیلترها
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null); // null | true | false

  // گرفتن کتگوری‌ها
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingCats(false);
      }
    };
    fetchCategories();
  }, []);

  // گرفتن پروژه‌ها با فیلتر
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const params = { limit: 12 };
        if (activeCategory) params.category = activeCategory._id;
        if (activeSubCategory) params.subCategory = activeSubCategory._id;
        if (activeStatus !== null) params.ongoing = activeStatus;
        const res = await getProjects(params);
        setProjects(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [activeCategory, activeSubCategory, activeStatus]);

  const handleCategoryClick = (cat) => {
    if (activeCategory?._id === cat._id) {
      setActiveCategory(null);
      setActiveSubCategory(null);
    } else {
      setActiveCategory(cat);
      setActiveSubCategory(null);
    }
  };

  const handleSubCategoryClick = (sub) => {
    if (activeSubCategory?._id === sub._id) {
      setActiveSubCategory(null);
    } else {
      setActiveSubCategory(sub);
    }
  };

  const handleStatusClick = (status) => {
    setActiveStatus(activeStatus === status ? null : status);
  };

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveSubCategory(null);
    setActiveStatus(null);
  };

  const hasFilter = activeCategory || activeSubCategory || activeStatus !== null;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

      {/* هدر */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="text-primary text-xs tracking-widest font-medium uppercase">
          نمونه کارها
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-navy mt-3 mb-4">
          پروژه‌های ما
        </h1>
        <p className="text-gray max-w-xl leading-7">
          مجموعه کامل پروژه‌های اجراشده توسط خلجی هولدینگ
        </p>
      </motion.div>

      {/* ─── فیلترها ─── */}
      <div className="mb-10 space-y-4">

        {/* ردیف ۱ — کتگوری‌ها */}
        {loadingCats ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-28 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray ml-2">دسته‌بندی:</span>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory?._id === cat._id
                    ? "bg-navy text-white"
                    : "bg-light text-navy hover:bg-border"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {activeCategory?.subCategories?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 overflow-hidden"
            >
              <span className="text-xs text-gray ml-2">زیرمجموعه:</span>
              {activeCategory.subCategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => handleSubCategoryClick(sub)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
                    activeSubCategory?._id === sub._id
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-gray hover:border-primary hover:text-primary"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray ml-2">وضعیت:</span>
          <button
            onClick={() => handleStatusClick(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
              activeStatus === false
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-gray hover:border-primary hover:text-primary"
            }`}
          >
            تموم‌شده
          </button>
          <button
            onClick={() => handleStatusClick(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
              activeStatus === true
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-gray hover:border-primary hover:text-primary"
            }`}
          >
            در حال اجرا
          </button>

          <AnimatePresence>
            {hasFilter && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-red-400 border border-red-200 hover:bg-red-50 transition-all duration-300 mr-2"
              >
                <X size={12} />
                پاک کردن فیلتر
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loadingProjects ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-72 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </motion.div>
        ) : projects.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-24"
          >
            <p className="text-gray text-lg mb-4">پروژه‌ای یافت نشد</p>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              پاک کردن فیلترها
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group"
              >
                <Link to={`/projects/${project.slug}`}>
                  <div className="relative overflow-hidden rounded-xl h-72 mb-4">
                    <SafeImage
                      src={project.images?.[0] ? `${BASE_URL}/${project.images[0]}` : null}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* badge وضعیت */}
                    {project.ongoing && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-primary text-white text-[10px] font-medium px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        در حال اجرا
                      </div>
                    )}
                  </div>
                </Link>

                <div>
                  <Link to={`/projects/${project.slug}`}>
                    <h3 className="text-base font-medium text-navy group-hover:text-primary transition-colors mb-1">
                      {project.title}
                    </h3>
                  </Link>
                  {project.category && (
                    <Link
                      to={`/categories/${project.category.slug}`}
                      className="text-xs text-gray hover:text-primary transition-colors"
                    >
                      {project.category.name}
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}