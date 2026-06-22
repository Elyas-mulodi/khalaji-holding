import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageOff, ArrowLeft } from "lucide-react";
import { getProjects } from "../../services/api";

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

export default function OngoingProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects({ ongoing: true, limit: 3 });
        setProjects(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="flex items-end justify-between mb-14">
        <div>
          <span className="text-primary text-xs tracking-widest font-medium uppercase">
            در حال اجرا
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-navy mt-3">
            پروژه‌های جاری
          </h2>
        </div>
        <Link
          to="/ongoing"
          className="hidden md:inline-flex items-center gap-2 text-sm text-navy hover:text-primary transition-colors"
        >
          مشاهده همه
          <ArrowLeft size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-72 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                <div className="h-2 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            ))
          : projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <Link to={`/projects/${project.slug}`}>
                  {/* عکس */}
                  <div className="relative overflow-hidden rounded-xl h-72 mb-5">
                    <SafeImage
                      src={project.images?.[0] ? `${BASE_URL}/${project.images[0]}` : null}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />

                    <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-medium px-3 py-1 rounded-full">
                      در حال اجرا
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-navy group-hover:text-primary transition-colors mb-3">
                    {project.title}
                  </h3>
                </Link>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray">پیشرفت پروژه</span>
                    <span className="text-xs font-medium text-primary">
                      {project.progress}٪
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>

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

      <div className="flex justify-center mt-12 md:hidden">
        <Link
          to="/ongoing"
          className="inline-flex items-center gap-2 border border-navy text-navy text-sm font-medium px-8 py-3 hover:bg-navy hover:text-white transition-all duration-300"
        >
          مشاهده همه پروژه‌های جاری
          <ArrowLeft size={16} />
        </Link>
      </div>
    </section>
  );
}