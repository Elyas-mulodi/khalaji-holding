import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff, ArrowRight } from "lucide-react";
import { getCategory, getCategoryProjects } from "../services/api";

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

export default function CategoryProjects() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [loadingCat, setLoadingCat] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [total, setTotal] = useState(0);

  // گرفتن اطلاعات category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategory(slug);
        setCategory(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategory();
    setActiveSubCategory(null);
    window.scrollTo(0, 0);
  }, [slug]);

  // گرفتن پروژه‌ها
  useEffect(() => {
    if (!category) return;
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const params = { limit: 12 };
        if (activeSubCategory) params.subCategory = activeSubCategory._id;
        const res = await getCategoryProjects(slug, params);
        setProjects(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, [category, activeSubCategory]);

  if (loadingCat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray">دسته‌بندی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24">

      {/* هدر با عکس */}
      <div className="relative h-[40vh] w-full overflow-hidden mb-16">
        <SafeImage
          src={category.images?.[0] ? `${BASE_URL}/${category.images[0]}` : null}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-navy/20" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-white/60 text-xs mb-4 hover:text-white transition-colors"
            >
              <ArrowRight size={14} />
              بازگشت به پروژه‌ها
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-white/70 max-w-xl mx-auto text-sm leading-7">
                {category.description}
              </p>
            )}
            <p className="text-primary text-xs mt-3">
              {total} پروژه
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* فیلتر ساب‌کتگوری */}
        {category.subCategories?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 mb-12"
          >
            <button
              onClick={() => setActiveSubCategory(null)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !activeSubCategory
                  ? "bg-navy text-white"
                  : "bg-light text-navy hover:bg-border"
              }`}
            >
              همه
            </button>
            {category.subCategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() =>
                  setActiveSubCategory(
                    activeSubCategory?._id === sub._id ? null : sub
                  )
                }
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSubCategory?._id === sub._id
                    ? "bg-navy text-white"
                    : "bg-light text-navy hover:bg-border"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* توضیحات ساب‌کتگوری انتخاب‌شده */}
        <AnimatePresence mode="wait">
          {activeSubCategory?.description && (
            <motion.p
              key={activeSubCategory._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-gray text-sm leading-7 mb-10 max-w-2xl"
            >
              {activeSubCategory.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* گرید پروژه‌ها */}
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
              <p className="text-gray text-lg">
                پروژه‌ای برای این دسته‌بندی ثبت نشده است
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeSubCategory?._id || "all"}
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

                      {project.ongoing && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-primary text-white text-[10px] font-medium px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          در حال اجرا
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-medium text-navy group-hover:text-primary transition-colors mb-1">
                      {project.title}
                    </h3>
                  </Link>

                  {project.location && (
                    <p className="text-xs text-gray">{project.location}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}