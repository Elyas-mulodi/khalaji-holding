import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import logo from "../../assets/logo-transformed.png";

const InstagramIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* لوگو و توضیح */}
          <div className="md:col-span-2">
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
                <Link to="/" className="hover:text-primary transition-colors">
                  خانه
                </Link>
              </li>
              <li>
                <Link
                  to="/projects"
                  className="hover:text-primary transition-colors"
                >
                  پروژه‌ها
                </Link>
              </li>
              <li>
                <Link
                  to="/ongoing"
                  className="hover:text-primary transition-colors"
                >
                  پروژه‌های جاری
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  درباره ما
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h4 className="text-primary font-medium mb-5">ارتباط با ما</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0" />
                <span dir="ltr">021-XXXXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0" />
                <span>info@khalaji.ir</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <span>تهران، ایران</span>
              </li>
            </ul>

            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center border border-white/20 hover:border-primary hover:text-primary transition-colors"
              >
                <Send size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* خط جداکننده */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} خلجی هولدینگ. تمامی حقوق محفوظ است. <br />
            Creator : Elyas Mulodi
            
          </p>
        </div>
      </div>
    </footer>
  );
}
