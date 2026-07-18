import React, { useEffect, useState } from "react";
import { getSliders } from "../../services/api";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await getSliders("home");
        setSlides(res.data.data);
      } catch (error) {
        console.log("خطا در دریافت اسلایدر", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [slides]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy">
        <p className="text-white/60">اسلایدری یافت نشد</p>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-navy">
      <AnimatePresence>
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={`${import.meta.env.VITE_API_IMAGE_URL}${slide.image}`}
            alt={slide.title}
            className="w-full h-full object-cover brightness-85
                 contrast-110
                 saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-navy/50" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{
              opacity: 0,
              y: 40,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -30,
              filter: "blur(10px)",
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className="max-w-4xl"
          > */}

        <div className="flex items-center justify-center gap-5 mb-6">
          <h1
            className="
          text-3xl 
          md:text-4xl 
          lg:text-5xl
          font-light
          text-white
          leading-[1.15]
          mb-2
        "
          >
            KHALAJI HOLDING
          </h1>
        </div>
        {slide.description && (
          <p
            className="
            text-base
            md:text-xl
            text-white/75
            max-w-2xl
            mx-auto
          "
          >
            {slide.description}
          </p>
        )}
        {/* </motion.div>
        </AnimatePresence> */}
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current ? "w-8 bg-primary" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70"
      >
        <span className="text-xs tracking-widest">اسکرول</span>
        <ChevronDown size={18} />
      </motion.div>
    </section>
  );
}
