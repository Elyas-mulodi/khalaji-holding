import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Phone, Headset, Check } from "lucide-react";
import logo from "../../assets/logo-transformed.png";

const navLinks = [
  { title: "خانه", path: "/" },
  { title: "پروژه‌ها", path: "/projects" },
  { title:"دسته بندی ها" ,path :"/category"},
  { title: "درباره ما", path: "/about" },
];

const PHONES = [
  { label: "مدیریت", number: "0936-836-4316", icon: Phone },
  { label: "پشتیبانی", number: "0915-356-4421", icon: Headset },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const handleCopyPhone = (number, index) => {
    navigator.clipboard.writeText(number.replace(/-/g, ""));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-4 py-1.5 text-xs transition-colors duration-500 ${
          scrolled ? "bg-white/95 backdrop-blur-md" : "bg-white/80 backdrop-blur-md"
        }`}
      >
        {PHONES.map((phone, index) => {
          const isCopied = copiedIndex === index;
          return (
            <button
              key={phone.label}
              onClick={() => handleCopyPhone(phone.number, index)}
              className="flex items-center gap-1.5 text-black"
            >
              <span className="text-[10px] opacity-70">{phone.label}:</span>
              <span dir="ltr" className="font-semibold">
                {isCopied ? "کپی شد" : phone.number}
              </span>
            </button>
          );
        })}
      </div>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-7 lg:top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-md ${
          scrolled ? "bg-white/95 shadow-sm py-3" : "bg-white/10 py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="relative z-10">
            <img src={logo} alt="خلجی هولدینگ" className="h-25 w-auto -my-4" />
          </Link>

          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative inline-block text-md font-medium transition-colors duration-300 group ${
                    pathname === link.path
                      ? "text-primary"
                      : "text-black hover:text-primary"
                  }`}
                >
                  {link.title}
                  <span
                    className={`absolute -bottom-2 right-0 h-[2px] rounded-full bg-primary transition-all duration-500 ${
                      pathname === link.path ||
                      pathname.startsWith(link.path + "/")
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-5">
            {PHONES.map((phone, index) => {
              const Icon = phone.icon;
              const isCopied = copiedIndex === index;
              return (
                <button
                  key={phone.label}
                  onClick={() => handleCopyPhone(phone.number, index)}
                  className="flex items-center gap-2.5 group cursor-pointer"
                  title="برای کپی کلیک کنید"
                >
                  <span className="w-9 h-9 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    {isCopied ? (
                      <Check size={15} className="text-white" />
                    ) : (
                      <Icon
                        size={15}
                        className="text-black transition-colors duration-300"
                      />
                    )}
                  </span>
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-[10px] tracking-wide text-gray">
                      {isCopied ? "کپی شد" : phone.label}
                    </span>
                    <span
                      dir="ltr"
                      className="text-sm font-semibold transition-colors duration-300 text-black group-hover:text-primary"
                    >
                      {phone.number}
                    </span>
                  </div>
                </button>
              );
            })}

            <span className="w-px h-8 bg-border" />

            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 transition-colors duration-300 text-navy hover:text-primary"
            >
              <Search size={20} />
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-black"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-2"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="block w-6 h-0.5 bg-black"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-0.5 bg-black"
              />
              <motion.span
                animate={
                  menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                className="block w-6 h-0.5 bg-black"
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 bottom-0 z-40 bg-white flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`text-2xl font-medium transition-colors ${
                    pathname === link.path ? "text-primary" : "text-black"
                  }`}
                >
                  {link.title}
                </Link>
              </motion.div>
            ))}

            <div className="flex flex-col items-center gap-3 mt-2">
              {PHONES.map((phone, index) => {
                const isCopied = copiedIndex === index;
                return (
                  <motion.button
                    key={phone.label}
                    onClick={() => handleCopyPhone(phone.number, index)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (navLinks.length + index) * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-xs text-gray">{phone.label}</span>
                    <span
                      dir="ltr"
                      className="text-lg font-semibold text-primary"
                    >
                      {isCopied ? "کپی شد" : phone.number}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black backdrop-blur-sm flex items-start justify-center pt-32"
            onClick={() => setSearchOpen(false)}
          >
            <motion.form
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSearch}
              className="w-full max-w-xl px-6"
            >
              <div className="relative">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی پروژه یا دسته‌بندی..."
                  className="w-full bg-transparent border-b-2 border-primary text-black text-xl py-3 px-2 outline-none placeholder:text-black/50"
                />
                <Search
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-primary"
                  size={20}
                />
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}