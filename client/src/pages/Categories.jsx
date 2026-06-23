import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff } from "lucide-react";
import { getCategories } from "../services/api";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

function SafeImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
      >
        <ImageOff size={30} className="text-gray-400" />
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

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();

        setCategories(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
          text-3xl
          md:text-5xl
          font-bold
          text-navy
          mb-5
          "
        >
          دسته‌بندی پروژه‌ها
        </motion.h1>

        <p className="text-gray max-w-xl mx-auto leading-8">
          پروژه‌های ما را بر اساس نوع و حوزه اجرا مشاهده کنید.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <div
              className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-8
          "
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div
                    className="
                h-72
                bg-gray-200
                rounded-xl
                mb-4
                "
                  />

                  <div
                    className="
                h-5
                bg-gray-200
                rounded
                w-2/3
                mb-2
                "
                  />

                  <div
                    className="
                h-3
                bg-gray-200
                rounded
                w-1/2
                "
                  />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-8
          "
            >
              {categories.map((cat, index) => (
                <motion.div
                  key={cat._id}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="group"
                >
                  <Link to={`/categories/${cat.slug}`}>
                    <div
                      className="
                relative
                h-80
                overflow-hidden
                rounded-xl
                mb-5
                "
                    >
                      <SafeImage
                        src={
                          cat.images?.[0]
                            ? `${BASE_URL}/${cat.images[0]}`
                            : null
                        }
                        alt={cat.name}
                        className="
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-110
                  transition-transform
                  duration-700
                  "
                      />

                      <div
                        className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/70
                  to-transparent
                  "
                      />

                      <h2
                        className="
                  absolute
                  bottom-6
                  right-6
                  text-white
                  text-2xl
                  font-bold
                  "
                      >
                        {cat.name}
                      </h2>
                    </div>

                    <p
                      className="
                text-gray
                text-sm
                leading-7
                line-clamp-2
                "
                    >
                      {cat.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
