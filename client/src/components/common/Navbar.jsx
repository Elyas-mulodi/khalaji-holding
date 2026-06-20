import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import logo from "../../assets/logo-transformed.png";

const navLinks = [
  { title: "خانه", path: "/" },
  { title: "پروژه‌ها", path: "/projects" },
  { title: "درباره ما", path: "/about" },
  { title: "تماس با ما", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
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

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <img src={logo} alt="خلجی هولدینگ" className="h-25 w-auto -my-4" />
          </Link>

          {/* desktop menu */}
          <ul className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`
    relative
    inline-block
    text-md
    font-medium
    text-navy
    transition-colors
    duration-300
    group
    ${pathname === link.path ? "text-primary" : "hover:text-primary"}
  `}
                >
                  {link.title}

                  <span
                    className={`
      absolute
      -bottom-2
      right-0
      h-[2px]
      rounded-full
      bg-primary
      transition-all
      duration-500
      ${
        pathname === link.path || pathname.startsWith(link.path + "/")
          ? "w-full"
          : "w-0 group-hover:w-full"
      }
    `}
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* دکمه سرچ دسکتاپ */}
          <button
            onClick={() => setSearchOpen(true)}
            className={`hidden md:flex items-center justify-center w-10 h-10 transition-colors duration-300 ${
              scrolled
                ? "text-navy hover:text-primary"
                : "text-black hover:text-primary"
            }`}
          >
            <Search size={20} />
          </button>

          {/* همبرگر موبایل */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className={scrolled ? "text-navy p-2" : "text-black p-2"}
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-2 "
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className={`block w-6 h-0.5 transition-colors ${
                  scrolled ? "bg-black" : "bg-black"
                }`}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`block w-6 h-0.5 transition-colors ${
                  scrolled ? "bg-black" : "bg-black"
                }`}
              />
              <motion.span
                animate={
                  menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                }
                className={`block w-6 h-0.5 transition-colors ${
                  scrolled ? "bg-black" : "bg-black"
                }`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* منو موبایل */}
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
                    pathname === link.path ? "text-primary" : "text-navy"
                  }`}
                >
                  {link.title}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* اورلی سرچ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-navy/95 backdrop-blur-sm flex items-start justify-center pt-32"
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
                  className="w-full bg-transparent border-b-2 border-primary text-white text-xl py-3 px-2 outline-none placeholder:text-white/50"
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
