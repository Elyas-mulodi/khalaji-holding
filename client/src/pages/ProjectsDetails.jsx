import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, FileText, ImageOff } from "lucide-react";
import { getProject } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

// ─────────────────────────────────────────
// کامپوننت تصویر با fallback اسکلتون
// ─────────────────────────────────────────
function ProjectImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
      >
        <ImageOff size={28} className="text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
    />
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(slug);
        setProject(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray">پروژه یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray hover:text-primary transition-colors mb-10"
      >
        <ArrowRight size={16} />
        بازگشت
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        {project.category && (
          <span className="text-primary text-xs tracking-widest font-medium uppercase">
            {project.category.name}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl font-bold text-navy mt-3 mb-6">
          {project.title}
        </h1>

        <p className="text-gray leading-8 max-w-2xl mb-8">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-10">
          {project.location && (
            <div>
              <span className="flex items-center gap-1.5 text-[11px] text-gray tracking-wide uppercase mb-1">
                <MapPin size={12} />
                موقعیت
              </span>
              <p className="text-navy font-medium">{project.location}</p>
            </div>
          )}

          {project.yearBuilt && (
            <div>
              <span className="flex items-center gap-1.5 text-[11px] text-gray tracking-wide uppercase mb-1">
                <Calendar size={12} />
                سال اجرا
              </span>
              <p className="text-navy font-medium">{project.yearBuilt}</p>
            </div>
          )}

          {project.catalogFile && (
            <div>
              <span className="flex items-center gap-1.5 text-[11px] text-gray tracking-wide uppercase mb-1">
                <FileText size={12} />
                کاتالوگ
              </span>
              <a
                href={`${BASE_URL}/${project.catalogFile}`}
                download
                className="text-primary font-medium hover:underline"
              >
                دانلود فایل
              </a>
            </div>
          )}
        </div>
      </motion.div>

      {/* عکس اصلی */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full h-[60vh] md:h-[75vh] overflow-hidden rounded-xl mb-6"
      >
        <ProjectImage
          src={project.images?.[0] ? `${BASE_URL}/${project.images[0]}` : null}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* بقیه عکس‌ها */}
      {project.images?.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
          {project.images.slice(1).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="overflow-hidden rounded-xl h-80"
            >
              <ProjectImage
                src={`${BASE_URL}/${img}`}
                alt={`${project.title} ${i + 2}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* پروژه‌های مرتبط */}
      {project.relatedProjects?.length > 0 && (
        <div className="border-t border-border pt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-10">
            پروژه‌های مرتبط
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {project.relatedProjects.slice(0, 3).map((rp, index) => (
              <motion.div
                key={rp._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/projects/${rp.slug}`}>
                  <div className="overflow-hidden rounded-xl h-72 mb-4">
                    <ProjectImage
                      src={
                        rp.images?.[0] ? `${BASE_URL}/${rp.images[0]}` : null
                      }
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-navy group-hover:text-primary transition-colors">
                    {rp.title}
                  </h3>
                </Link>

                {rp.category && (
                  <Link
                    to={`/categories/${rp.category.slug}`}
                    className="text-sm text-gray hover:text-primary transition-colors"
                  >
                    {rp.category.name}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
