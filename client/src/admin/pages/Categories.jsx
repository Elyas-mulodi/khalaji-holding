import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "../../services/api";


const emptyForm = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  order: 0,
};

export default function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // ساب‌کتگوری
  const [subForm, setSubForm] = useState({ name: "", description: "" });
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [subEditId, setSubEditId] = useState(null);
  const [activeCatForSub, setActiveCatForSub] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditCategory(null);
    setForm(emptyForm);
    setImages([]);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditCategory(cat);
    setForm({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      longDescription: cat.longDescription || "",
      order: cat.order || 0,
    });
    setImages([]);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      images.forEach((img) => formData.append("images", img));

      if (editCategory) {
        await adminUpdateCategory(token, editCategory._id, formData);
      } else {
        await adminCreateCategory(token, formData);
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteCategory(token, deleteId);
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  // ─── ساب‌کتگوری ───
  const openSubCreate = (cat) => {
    setActiveCatForSub(cat);
    setSubEditId(null);
    setSubForm({ name: "", description: "" });
    setSubModalOpen(true);
  };

  const openSubEdit = (cat, sub) => {
    setActiveCatForSub(cat);
    setSubEditId(sub._id);
    setSubForm({ name: sub.name, description: sub.description || "" });
    setSubModalOpen(true);
  };

  const handleSubSubmit = async () => {
    if (!subForm.name || !activeCatForSub) return;
    setSubmitting(true);
    try {
      if (subEditId) {
        await fetch(
          `${import.meta.env.VITE_API_URL}/categories/${activeCatForSub._id}/subcategories/${subEditId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(subForm),
          }
        );
      } else {
        await fetch(
          `${import.meta.env.VITE_API_URL}/categories/${activeCatForSub._id}/subcategories`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(subForm),
          }
        );
      }
      setSubModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubDelete = async (cat, subId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/categories/${cat._id}/subcategories/${subId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/* هدر */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">دسته‌بندی‌ها</h1>
          <p className="text-gray text-sm mt-1">{categories.length} دسته‌بندی</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 hover:bg-navy/90 transition-colors"
        >
          <Plus size={16} />
          دسته‌بندی جدید
        </button>
      </div>

      {/* لیست */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse h-20 bg-gray-200 rounded" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white border border-border">

              {/* ردیف اصلی */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* عکس */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {cat.images?.[0] ? (
                    <img
                      src={`${import.meta.env.VITE_API_IMAGE_URL}${cat.images[0]}`}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-light" />
                  )}
                </div>

                {/* اطلاعات */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy">{cat.name}</p>
                  <p className="text-xs text-gray mt-0.5">
                    {cat.subCategories?.length || 0} زیردسته • {cat.slug}
                  </p>
                </div>

                {/* دکمه‌ها */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openSubCreate(cat)}
                    className="text-xs text-primary border border-primary/30 px-3 py-1.5 hover:bg-primary/10 transition-colors"
                  >
                    + زیردسته
                  </button>
                  <button
                    onClick={() => openEdit(cat)}
                    className="w-8 h-8 flex items-center justify-center text-gray hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(cat._id)}
                    className="w-8 h-8 flex items-center justify-center text-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  {cat.subCategories?.length > 0 && (
                    <button
                      onClick={() => setExpandedId(expandedId === cat._id ? null : cat._id)}
                      className="w-8 h-8 flex items-center justify-center text-gray hover:text-navy rounded-lg transition-colors"
                    >
                      {expandedId === cat._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                </div>
              </div>

              {/* ساب‌کتگوری‌ها */}
              <AnimatePresence>
                {expandedId === cat._id && cat.subCategories?.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="px-5 py-3 space-y-2">
                      {cat.subCategories.map((sub) => (
                        <div
                          key={sub._id}
                          className="flex items-center justify-between py-2 border-b border-border last:border-0"
                        >
                          <div>
                            <p className="text-sm text-navy">{sub.name}</p>
                            {sub.description && (
                              <p className="text-xs text-gray mt-0.5">{sub.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openSubEdit(cat, sub)}
                              className="w-7 h-7 flex items-center justify-center text-gray hover:text-primary rounded transition-colors"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => handleSubDelete(cat, sub._id)}
                              className="w-7 h-7 flex items-center justify-center text-gray hover:text-red-500 rounded transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* Modal ساخت/ویرایش دسته‌بندی */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-lg"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-bold text-navy">
                  {editCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
                </h2>
                <button onClick={() => setModalOpen(false)}>
                  <X size={20} className="text-gray" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray mb-1">نام *</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="نام دسته‌بندی"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray mb-1">اسلاگ *</label>
                    <input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="category-slug"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray mb-1">توضیح کوتاه</label>
                  <input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray mb-1">توضیح کامل</label>
                  <textarea
                    value={form.longDescription}
                    onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                    rows={3}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray mb-1">ترتیب نمایش</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray mb-1">
                    تصاویر
                    {editCategory?.images?.length > 0 && (
                      <span className="mr-2 text-primary">
                        ({editCategory.images.length} تصویر موجود)
                      </span>
                    )}
                  </label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary transition-colors p-5 cursor-pointer">
                    <Upload size={16} className="text-gray" />
                    <span className="text-sm text-gray">
                      {images.length > 0 ? `${images.length} فایل` : "انتخاب تصاویر"}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImages(Array.from(e.target.files))}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 text-sm text-gray hover:text-navy"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !form.name || !form.slug}
                  className="px-6 py-2 bg-navy text-white text-sm hover:bg-navy/90 disabled:opacity-60"
                >
                  {submitting ? "در حال ذخیره..." : editCategory ? "ذخیره" : "ایجاد"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal ساب‌کتگوری */}
      <AnimatePresence>
        {subModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSubModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white w-full max-w-sm"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-bold text-navy">
                  {subEditId ? "ویرایش زیردسته" : "زیردسته جدید"}
                  <span className="text-sm font-normal text-gray mr-2">
                    ({activeCatForSub?.name})
                  </span>
                </h2>
                <button onClick={() => setSubModalOpen(false)}>
                  <X size={20} className="text-gray" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs text-gray mb-1">نام *</label>
                  <input
                    value={subForm.name}
                    onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="نام زیردسته"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray mb-1">توضیحات</label>
                  <textarea
                    value={subForm.description}
                    onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                    rows={2}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
                <button
                  onClick={() => setSubModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray hover:text-navy"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSubSubmit}
                  disabled={submitting || !subForm.name}
                  className="px-5 py-2 bg-navy text-white text-sm hover:bg-navy/90 disabled:opacity-60"
                >
                  {submitting ? "در حال ذخیره..." : subEditId ? "ذخیره" : "افزودن"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal حذف */}
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
              <h3 className="font-bold text-navy mb-2">حذف دسته‌بندی</h3>
              <p className="text-gray text-sm mb-6">
                آیا مطمئن هستید؟ اگه پروژه‌ای داشته باشد، حذف انجام نمی‌شود.
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