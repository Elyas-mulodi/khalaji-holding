import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff } from "lucide-react";
import { getCategories, getProjects } from "../../services/api";


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

export default function FeaturedProjects() {
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        const cats = res.data.data;
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setActiveSubCategory(null);
    fetchProjectsData(activeCategory._id, null);
  }, [activeCategory]);

  useEffect(() => {
    if (!activeCategory) return;
    fetchProjectsData(activeCategory._id, activeSubCategory?._id || null);
  }, [activeSubCategory]);

  const fetchProjectsData = async (categoryId, subCategoryId) => {
    setLoadingProjects(true);
    try {
      const params = { category: categoryId, limit: 6 };
      if (subCategoryId) params.subCategory = subCategoryId;
      const res = await getProjects(params);
      setProjects(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
  };

  const handleSubCategoryClick = (sub) => {
    if (activeSubCategory?._id === sub._id) {
      setActiveSubCategory(null); 
    } else {
      setActiveSubCategory(sub);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="text-center mb-12">
        <span className="text-primary text-xs tracking-widest font-medium uppercase">
          خدمات ما
        </span>
        <h2 className="text-3xl md:text-5xl font-bold text-navy mt-3">
          دسته‌بندی پروژه‌ها
        </h2>
      </div>

      {loadingCategories ? (
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategoryClick(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
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

      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.div
            key={activeCategory._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-navy">
                پروژه‌های {activeCategory.name}
              </h3>
              <Link
                to={`/categories/${activeCategory.slug}`}
                className="text-sm text-primary hover:underline"
              >
                مشاهده همه
              </Link>
            </div>

            {activeCategory.subCategories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                <button
                  onClick={() => setActiveSubCategory(null)}
                  className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-all duration-300 ${
                    !activeSubCategory
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-gray hover:border-primary hover:text-primary"
                  }`}
                >
                  همه
                </button>
                {activeCategory.subCategories.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => handleSubCategoryClick(sub)}
                    className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-all duration-300 ${
                      activeSubCategory?._id === sub._id
                        ? "border-primary text-primary bg-primary/10"
                        : "border-border text-gray hover:border-primary hover:text-primary"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            {loadingProjects ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-72 bg-gray-200 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <p className="text-gray text-center py-16">
                پروژه‌ای برای این دسته‌بندی ثبت نشده است
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="group"
                  >
                    <Link to={`/projects/${project.slug}`}>
                      <div className="overflow-hidden rounded-xl h-72 mb-4">
                        <SafeImage
                          src={project.images?.[0] ? `${import.meta.env.VITE_API_IMAGE_URL}${project.images[0]}` : null}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <h4 className="text-lg font-medium text-navy group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}