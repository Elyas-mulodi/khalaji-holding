import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, ArrowLeft } from "lucide-react";

const info = [
  {
    icon: Phone,
    label: "مدیریت",
    value: "0936-836-4316",
    href: "tel:09368364316",
  },
  {
    icon: Phone,
    label: "پشتیبانی",
    value: "0915-356-4421",
    href: "tel:09153564421",
  },
  { icon: MapPin, label: "آدرس", value: "تهران، ایران", href: null },
  {
    icon: Mail,
    label: "ایمیل",
    value: "info@khalaji.ir",
    href: "mailto:info@khalaji.ir",
  },
];

export default function Banner() {
  return (
    <section className="bg-navy py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-primary text-xs tracking-widest font-medium uppercase">
            درباره خلجی هولدینگ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
            بیش از یک دهه تجربه در صنعت ساختمان
          </h2>
          <p className="text-white/60 leading-8 text-sm md:text-base mb-10">
            خلجی هولدینگ با تکیه بر دانش فنی و تجربه اجرایی، خدماتی شامل
            اپوکسی، عایق‌بندی، نما و پروژه‌های ساختمانی را با بالاترین
            استانداردهای کیفی ارائه می‌دهد.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-3 bg-primary text-white text-sm font-medium px-8 py-3 hover:bg-primary/90 transition-all duration-300 group"
          >
            بیشتر بدانید
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {info.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-white/10 p-6 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-full border border-primary/40 flex items-center justify-center mb-4">
                  <Icon size={16} className="text-primary" />
                </div>
                <p className="text-white/40 text-xs tracking-wide mb-1">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    dir="ltr"
                    className="text-white font-medium text-sm hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-white font-medium text-sm">{item.value}</p>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
