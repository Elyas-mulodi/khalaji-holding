import { Link } from "react-router-dom";
import { Phone, MapPin, Send } from "lucide-react";
import logo from "/assets/logo-transformed.png";

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
  </svg>
);

const WhatsAppIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.115 1.528 5.845L.057 23.535a.75.75 0 0 0 .908.908l5.69-1.471A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.694 9.694 0 0 1-4.944-1.355l-.355-.21-3.676.949.969-3.558-.23-.366A9.693 9.693 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* لوگو و توضیح */}
          <div className="sm:col-span-2 lg:col-span-2">
            <img
              src={logo}
              alt="خلجی هولدینگ"
              className="h-16 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white/60 text-sm leading-7 max-w-md">
              خلجی هولدینگ، ارائه‌دهنده خدمات تخصصی اپوکسی، عایق‌بندی، نما و
              اجرای پروژه‌های ساختمانی با کیفیت و تعهد بالا.
            </p>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h4 className="text-primary font-medium mb-5">دسترسی سریع</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">خانه</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-primary transition-colors">پروژه‌ها</Link>
              </li>
              <li>
                <Link to="/catalogs" className="hover:text-primary transition-colors">کاتالوگ‌ها</Link>
              </li>
              <li>
                <Link to="/ongoing" className="hover:text-primary transition-colors">پروژه‌های جاری</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">درباره ما</Link>
              </li>
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h4 className="text-primary font-medium mb-5">ارتباط با ما</h4>
            <ul className="space-y-4 text-sm text-white/60">

              {/* شماره ۱ */}
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-primary shrink-0" />
                <span dir="ltr">0936-836-4316</span>
              </li>

              {/* شماره ۲ */}
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-primary shrink-0" />
                <span dir="ltr">0915-356-4421</span>
              </li>

              {/* اینستاگرام */}
              <li className="flex items-center gap-3">
                <span className="text-primary shrink-0">
                  <InstagramIcon size={15} />
                </span>
                <span className="break-all">holding_khalaji_mhd</span>
              </li>

              {/* آدرس */}
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                <span className="leading-6">مشهد، بلوار وکیل‌آباد، هنرستان</span>
              </li>
            </ul>

            {/* آیکون‌های شبکه اجتماعی */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://wa.me/989368364316"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
                title="واتساپ"
              >
                <WhatsAppIcon size={16} />
              </a>
              <a
                href="https://t.me/milad1371s"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
                title="تلگرام"
              >
                <Send size={16} />
              </a>
              <a
                href="https://instagram.com/holding_khalaji_mhd"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
                title="اینستاگرام"
              >
                <InstagramIcon size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center md:text-right">
            © {new Date().getFullYear()} خلجی هولدینگ. تمامی حقوق محفوظ است.
          </p>
          <a
            href="https://t.me/Elyas7vll"
            target="_blank"
            rel="noreferrer"
            className="text-white/20 text-xs"
          >
            Designed & Developed by Elyas Mulodi
          </a>
        </div>
      </div>
    </footer>
  );
}