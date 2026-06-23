import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageOff, Search } from "lucide-react";
import { search } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

function SafeImage({ src, alt, className }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <ImageOff size={24} className="text-gray-400" />
      </div>
    );
  }
  return (
    <img src={src} alt={alt} onError={() => setError(true)} className={className} />
  );
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState({ projects: [], categories: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await search(q);
        setResults({
          projects: res.data.results.projects.data,
          categories: res.data.results.categories.data,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [q]);

  const totalResults = results.projects.length + results.categories.length;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

      {/* هدر */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-2">
          <Search size={20} className="text-primary" />
          <h1 className="text-2xl md:text-4xl font-bold text-navy">
            نتایج جستجو
          </h1>
        </div>
        <p className="text-gray text-sm">
          {loading ? "در حال جستجو..." : `${totalResults} نتیجه برای "${q}"`}
        </p>
      </motion.div>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 py-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray text-lg">نتیجه‌ای یافت نشد</p>
          <p className="text-gray text-sm mt-2">عبارت دیگری جستجو کنید</p>
        </div>
      ) : (
        <div className="space-y-16">

          {/* پروژه‌ها */}
          {results.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-navy mb-6 pb-3 border-b border-border">
                پروژه‌ها
                <span className="text-sm font-normal text-gray mr-2">
                  ({results.projects.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="group"
                  >
                    <Link to={`/projects/${project.slug}`}>
                      <div className="overflow-hidden rounded-xl h-56 mb-3">
                        <SafeImage
                          src={project.images?.[0] ? `${BASE_URL}/${project.images[0]}` : null}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <h3 className="text-base font-medium text-navy group-hover:text-primary transition-colors">
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
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* دسته‌بندی‌ها */}
          {results.categories.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-navy mb-6 pb-3 border-b border-border">
                دسته‌بندی‌ها
                <span className="text-sm font-normal text-gray mr-2">
                  ({results.categories.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.categories.map((cat, i) => (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={`/categories/${cat.slug}`}
                      className="flex items-center gap-4 p-4 border border-border rounded-xl hover:border-primary transition-colors group"
                    >
                      <div className="w-16 h-16 overflow-hidden rounded-lg shrink-0">
                        <SafeImage
                          src={cat.images?.[0] ? `${BASE_URL}/${cat.images[0]}` : null}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-navy group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-xs text-gray mt-1 line-clamp-2">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}