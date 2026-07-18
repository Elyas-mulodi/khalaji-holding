import { motion } from "framer-motion";
import ceoImage from "/assets/khalaj.jpg";

const stats = [
  { value: "+200", label: "پروژه تکمیل‌شده" },
  { value: "+15", label: "سال تجربه" },
  { value: "98٪", label: "رضایت مشتری" },
];

export default function About() {
  return (
    <div className="overflow-hidden">
      <section className="relative h-[60vh] w-full overflow-hidden bg-navy flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/90 to-primary/20" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              درباره ما
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto">
              ساختن آینده با اصول کلاسیک و نگاهی مدرن
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm tracking-widest font-medium">
            خلجی هولدینگ
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-navy mt-3 mb-8 leading-tight">
            میراث‌ساز با کیفیت و تعهد
          </h2>
          <p className="text-gray leading-8 text-base md:text-lg">
            خلجی هولدینگ با بیش از یک دهه تجربه در صنعت ساختمان، خدماتی شامل
            اجرای اپوکسی، عایق‌بندی، نما و پروژه‌های ساختمانی را با بالاترین
            استانداردهای کیفی ارائه می‌دهد. هر پروژه برای ما فرصتی است برای خلق
            ارزشی ماندگار؛ از کارخانه‌های صنعتی گرفته تا فضاهای مسکونی و تجاری،
            تیم ما با دقت و تعهد در کنار مشتریان خود است.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 md:order-1"
          >
            <img
              src={ceoImage}
              alt="میلاد خلجی"
              className="w-full h-[500px] object-cover object-top"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 md:order-2"
          >
            <span className="text-primary text-sm tracking-widest font-medium">
              مدیرعامل
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-navy mt-3 mb-6 leading-tight">
              میلاد خلجی
            </h2>
            <p className="text-gray leading-8 mb-4">
              با بیش از یک دهه تجربه در صنعت ساختمان، رویکردی جامع به اجرای
              پروژه‌ها داریم؛ از خدمات صنعتی گرفته تا اجرای نمای تجاری و مسکونی،
              هر پروژه با همان دقت و تعهد انجام می‌شود.
            </p>
            <p className="text-gray leading-8 mb-10">
              تخصص ما در استفاده از مصالح به‌روز و تکنیک‌های اجرایی پیشرفته، این
              امکان را فراهم می‌کند که نتیجه نهایی کاملاً مطابق با انتظارات
              مشتری باشد.
            </p>

            <div className="flex flex-wrap gap-10">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-gray text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
