import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  ImageOff,
  Search,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getProjects,
  getCategories,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
} from "../../services/api";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  category: "",
  subCategory: "",
  location: "",
  yearBuilt: "",
  ongoing: false,
  progress: 0,
  features: false,
};

export default function AdminProjects() {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projRes, catRes] = await Promise.all([
        getProjects({ limit: 100 }),
        getCategories(),
      ]);
      setProjects(projRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditProject(null);
    setForm(emptyForm);
    setImages([]);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditProject(project);
    setForm({
      title: project.title || "",
      slug: project.slug || "",
      description: project.description || "",
      category: project.category?._id || "",
      subCategory: project.subCategory || "",
      location: project.location || "",
      yearBuilt: project.yearBuilt || "",
      ongoing: project.ongoing || false,
      progress: project.progress || 0,
      features: project.features || false,
    });
    setImages([]);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.slug || !form.category) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val);
      });
      images.forEach((img) => formData.append("images", img));

      if (editProject) {
        await adminUpdateProject(token, editProject._id, formData);
      } else {
        await adminCreateProject(token, formData);
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteProject(token, deleteId);
      setDeleteId(null);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const activeCategory = categories.find((c) => c._id === form.category);

  const filteredProjects = projects.filter(
    (p) =>
      p.title?.includes(search) ||
      p.category?.name?.includes(search) ||
      p.location?.includes(search),
  );

  return (
    <div>
      {/* هدر */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">پروژه‌ها</h1>
          <p className="text-gray text-sm mt-1">{projects.length} پروژه</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 hover:bg-navy/90 transition-colors"
        >
          <Plus size={16} />
          پروژه جدید
        </button>
      </div>

      {/* سرچ */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو در پروژه‌ها..."
          className="w-full border border-border pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* جدول */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse h-16 bg-gray-200 rounded" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light border-b border-border">
              <tr>
                <th className="text-right px-4 py-3 text-xs text-gray font-medium">
                  تصویر
                </th>
                <th className="text-right px-4 py-3 text-xs text-gray font-medium">
                  عنوان
                </th>
                <th className="text-right px-4 py-3 text-xs text-gray font-medium hidden md:table-cell">
                  دسته‌بندی
                </th>
                <th className="text-right px-4 py-3 text-xs text-gray font-medium hidden md:table-cell">
                  وضعیت
                </th>
                <th className="text-right px-4 py-3 text-xs text-gray font-medium">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProjects.map((project) => (
                <tr
                  key={project._id}
                  className="hover:bg-light transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                      {project.images?.[0] ? (
                        <img
                          src={`${BASE_URL}/${project.images[0]}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff size={14} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy">{project.title}</p>
                    <p className="text-xs text-gray mt-0.5">{project.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-gray">
                      {project.category?.name || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                        project.ongoing
                          ? "bg-primary/10 text-primary"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {project.ongoing ? "در حال اجرا" : "تکمیل‌شده"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(project)}
                        className="w-8 h-8 flex items-center justify-center text-gray hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(project._id)}
                        className="w-8 h-8 flex items-center justify-center text-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <p className="text-center text-gray text-sm py-12">
              پروژه‌ای یافت نشد
            </p>
          )}
        </div>
      )}

      {/* Modal ساخت/ویرایش */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl my-8"
            >
              {/* هدر modal */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-bold text-navy">
                  {editProject ? "ویرایش پروژه" : "پروژه جدید"}
                </h2>
                <button onClick={() => setModalOpen(false)}>
                  <X size={20} className="text-gray hover:text-navy" />
                </button>
              </div>

              {/* فرم */}
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* ردیف ۱ — عنوان + اسلاگ */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      عنوان *
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="عنوان پروژه"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      اسلاگ *
                    </label>
                    <input
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="project-slug"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* توضیحات */}
                <div>
                  <label className="block text-xs text-gray mb-1">
                    توضیحات
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                    placeholder="توضیحات پروژه..."
                  />
                </div>

                {/* ردیف ۲ — دسته‌بندی + ساب‌کتگوری */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      دسته‌بندی *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value,
                          subCategory: "",
                        })
                      }
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                    >
                      <option value="">انتخاب دسته‌بندی</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      زیردسته
                    </label>
                    <select
                      value={form.subCategory}
                      onChange={(e) =>
                        setForm({ ...form, subCategory: e.target.value })
                      }
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                      disabled={!activeCategory?.subCategories?.length}
                    >
                      <option value="">انتخاب زیردسته</option>
                      {activeCategory?.subCategories?.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ردیف ۳ — لوکیشن + سال */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      موقعیت
                    </label>
                    <input
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="تهران، ایران"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      سال اجرا
                    </label>
                    <input
                      type="number"
                      value={form.yearBuilt}
                      onChange={(e) =>
                        setForm({ ...form, yearBuilt: e.target.value })
                      }
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="1402"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* ردیف ۴ — وضعیت + پیشرفت + ویژه */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="ongoing"
                      checked={form.ongoing}
                      onChange={(e) =>
                        setForm({ ...form, ongoing: e.target.checked })
                      }
                      className="w-4 h-4 accent-primary"
                    />
                    <label htmlFor="ongoing" className="text-sm text-navy">
                      در حال اجرا
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">
                      پیشرفت (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.progress}
                      onChange={(e) =>
                        setForm({ ...form, progress: e.target.value })
                      }
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="features"
                      checked={form.features}
                      onChange={(e) =>
                        setForm({ ...form, features: e.target.checked })
                      }
                      className="w-4 h-4 accent-primary"
                    />
                    <label htmlFor="features" className="text-sm text-navy">
                      پروژه ویژه
                    </label>
                  </div>
                </div>
              </div>
              {/* آپلود عکس‌ها */}
              <div>
                <label className="block text-xs text-gray mb-1">
                  تصاویر پروژه
                  {editProject?.images?.length > 0 && (
                    <span className="mr-2 text-primary">
                      ({editProject.images.length} تصویر موجود)
                    </span>
                  )}
                </label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary transition-colors p-6 cursor-pointer">
                  <Upload size={18} className="text-gray" />
                  <span className="text-sm text-gray">
                    {images.length > 0
                      ? `${images.length} فایل انتخاب شده`
                      : "انتخاب تصاویر"}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImages(Array.from(e.target.files))}
                  />
                </label>

                {/* پیش‌نمایش عکس‌های انتخاب‌شده */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="relative h-20 overflow-hidden rounded-lg"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`preview-${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() =>
                            setImages(images.filter((_, idx) => idx !== i))
                          }
                          className="absolute top-1 left-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* فوتر modal */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 text-sm text-gray hover:text-navy transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting || !form.title || !form.slug || !form.category
                  }
                  className="px-6 py-2 bg-navy text-white text-sm hover:bg-navy/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "در حال ذخیره..."
                    : editProject
                      ? "ذخیره تغییرات"
                      : "ایجاد پروژه"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal تایید حذف */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 max-w-sm w-full"
            >
              <h3 className="font-bold text-navy mb-2">حذف پروژه</h3>
              <p className="text-gray text-sm mb-6">
                آیا مطمئن هستید؟ این عملیات قابل بازگشت نیست.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 text-sm text-gray hover:text-navy"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
