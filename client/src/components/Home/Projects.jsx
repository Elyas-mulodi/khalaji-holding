import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../../services/api";
import { motion } from "framer-motion";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects();
        setProjects(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse">
      <div className="h-80 bg-gray-200 rounded-xl" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <section className="min-h-screen w-full px-20 py-20">
      {/* header */}
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-4xl lg:text-6xl mb-6">پروژه‌ها</h2>
        <p className="opacity-70 max-w-xl mx-auto">
          جدیدترین کارهای ما را بررسی کنید
        </p>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : projects.slice(0, 6).map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                {/* کلیک روی عکس → جزئیات پروژه */}
                <Link to={`/projects/${project.slug}`}>
                  <div className="relative overflow-hidden rounded-xl h-96">
                    <img
                      src={`${import.meta.env.VITE_API_URL.replace("/api", "")}/${
                        project.images?.[0]
                      }`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={project.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                </Link>

                <div className="mt-4">
                  {/* کلیک روی تایتل → جزئیات پروژه */}
                  <Link to={`/projects/${project.slug}`}>
                    <h3 className="text-lg font-medium text-black hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </Link>

                  {/* کلیک روی نام کتگوری → صفحه کتگوری */}
                  {project.category && (
                    <Link
                      to={`/categories/${project.category.slug}`}
                      className="text-sm text-gray-500 hover:text-primary transition-colors inline-block"
                    >
                      {project.category.name}
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
      </div>
    </section>
  );
}