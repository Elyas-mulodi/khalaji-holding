import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { loginAdmin } from "../../services/api";
import logo from "../../assets/logo-transformed.png";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginAdmin(form);
      login(res.data.token, res.data.admin);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "خطا در ورود");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* لوگو */}
        <div className="text-center mb-10">
          <img
            src={logo}
            alt="خلجی هولدینگ"
            className="h-20 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-navy">پنل مدیریت</h1>
          <p className="text-gray text-sm mt-1">خلاجی هولدینگ</p>
        </div>

        {/* فرم */}
        <div className="bg-white p-8 shadow-sm border border-border">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-5">
            {/* نام کاربری */}
            <div>
              <label className="block text-xs text-gray mb-1.5">
                نام کاربری
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray"
                />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  placeholder="نام کاربری"
                  className="w-full border border-border pr-10 pl-4 py-3 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* رمز عبور */}
            <div>
              <label className="block text-xs text-gray mb-1.5">رمز عبور</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="رمز عبور"
                  className="w-full border border-border pr-10 pl-10 py-3 text-sm outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray hover:text-navy transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* دکمه ورود */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-navy text-white py-3 text-sm font-medium hover:bg-navy/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  در حال ورود...
                </span>
              ) : (
                "ورود به پنل"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
