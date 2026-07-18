import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Download } from "lucide-react";

const catalogs = [
  {
    id: 1,
    title: "کاتالوگ پوشش پارکینگ",
    description:
      "راهنمای جامع پوشش‌های نمای ساختمان شامل میکروسمنت، میکرواستون، تکسچر و سایر محصولات نمای خلاجی",
    category: "نما",
    file: "/catalogs/parking.pdf",
    color: "from-orange-500/20 to-orange-600/10",
  },
  {
    id: 2,
    title: "کاتالوگ عایق‌بندی",
    description:
      "معرفی کامل سیستم‌های عایق‌بندی صوتی، حرارتی و رطوبتی، شامل مشخصات فنی و روش اجرا",
    category: "عایق‌بندی",
    file: "/catalogs/عایق.pdf",
    color: "from-green-500/20 to-green-600/10",
  },
  {
    id: 3,
    title: "کاتالوگ ماله پروانه",
    description:
      "مشخصات اجرایی و فنی پوشش‌های ماله پروانه، ارملات و V Glass برای فضاهای داخلی و خارجی",
    category: "ماله پروانه",
    file: "/catalogs/trowel.pdf",
    color: "from-purple-500/20 to-purple-600/10",
  },
  {
    id: 4,
    title: "کاتالوگ پوشش کف",
    description:
      "راهنمای پوشش‌های تخصصی بدنه و کف پارکینگ شامل میکروسمنت، اکریلیک و تکسچر با مقاومت بالا",
    category: "پارکینگ",
    file: "/catalogs/poshesh.pdf",
    color: "from-gray-500/20 to-gray-600/10",
  },
];

export default function Catalogs() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="text-primary text-xs tracking-widest font-medium uppercase">
          دانلود رایگان
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-navy mt-3 mb-4">
          کاتالوگ‌ها
        </h1>
        <p className="text-gray max-w-xl mx-auto leading-7">
          کاتالوگ‌های فنی و اجرایی خلاجی هولدینگ را دانلود کنید
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogs.map((catalog, i) => (
          <motion.div
            key={catalog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            onMouseEnter={() => setHoveredId(catalog.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative group cursor-pointer"
            onClick={() => {
              const link = document.createElement("a");
              link.href = catalog.file;
              link.download = catalog.title;
              link.click();
            }}
          >
            <div className={`relative overflow-hidden border border-border bg-gradient-to-br ${catalog.color} p-8 h-full transition-all duration-300 group-hover:border-primary group-hover:shadow-lg`}>

              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <FileText size={24} className="text-primary" />
              </div>

              <span className="text-primary text-xs font-medium tracking-wide">
                {catalog.category}
              </span>

              <h3 className="text-lg font-bold text-navy mt-2 mb-3 leading-tight">
                {catalog.title}
              </h3>

              <AnimatePresence>
                {hoveredId === catalog.id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-gray text-sm leading-6 overflow-hidden"
                  >
                    {catalog.description}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className={`flex items-center gap-2 mt-6 text-sm font-medium transition-colors duration-300 ${
                hoveredId === catalog.id ? "text-primary" : "text-gray"
              }`}>
                <Download size={16} />
                دانلود PDF
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-transform duration-300 origin-right ${
                hoveredId === catalog.id ? "scale-x-100" : "scale-x-0"
              }`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}