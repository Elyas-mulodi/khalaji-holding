import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

      {/* عدد ۴۰۴ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8"
      >
        <span className="text-[180px] md:text-[240px] font-bold text-border leading-none select-none">
          404
        </span>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-2xl md:text-3xl font-bold text-navy">
            صفحه یافت نشد
          </span>
        </motion.div>
      </motion.div>

      {/* توضیح */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-gray max-w-md leading-7 mb-10"
      >
        صفحه‌ای که دنبالش می‌گردید وجود ندارد یا حذف شده است.
      </motion.p>

      {/* دکمه‌ها */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center gap-4"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-8 py-3 hover:bg-navy/90 transition-all duration-300"
        >
          <Home size={16} />
          صفحه اصلی
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 border border-navy text-navy text-sm font-medium px-8 py-3 hover:bg-navy hover:text-white transition-all duration-300"
        >
          پروژه‌ها
          <ArrowLeft size={16} />
        </Link>
      </motion.div>
    </div>
  );
}