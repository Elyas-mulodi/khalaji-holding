import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Upload, ImageOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getSliders,
  adminCreateSlider,
  adminUpdateSlider,
  adminDeleteSlider,
} from "../../services/api";

const BASE_URL = import.meta.env.VITE_API_URL.replace("/api", "");

const emptyForm = {
  title: "",
  description: "",
  section: "home",
  isActive: true,
};

export default function AdminSlider() {
  const { token } = useAuth();
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editSlider, setEditSlider] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await getSliders();
      setSliders(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditSlider(null);
    setForm(emptyForm);
    setImage(null);
    setModalOpen(true);
  };

  const openEdit = (slider) => {
    setEditSlider(slider);
    setForm({
      title: slider.title || "",
      description: slider.description || "",
      section: slider.section || "home",
      isActive: slider.isActive ?? true,
    });
    setImage(null);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title) return;
    if (!editSlider && !image) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("section", form.section);
      formData.append("isActive", form.isActive);
      if (image) formData.append("image", image);

      if (editSlider) {
        await adminUpdateSlider(token, editSlider._id, formData);
      } else {
        await adminCreateSlider(token, formData);
      }

      setModalOpen(false);
      fetchSliders();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteSlider(token, deleteId);
      setDeleteId(null);
      fetchSliders();
    } catch (err) {
      console.log(err);
    }
  };

  const sectionLabel = {
    home: "صفحه اصلی",
    about: "درباره ما",
    projects: "پروژه‌ها",
  };

  return (
    <div>
      {/* هدر */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">اسلایدر</h1>
          <p className="text-gray text-sm mt-1">{sliders.length} اسلاید</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 hover:bg-navy/90 transition-colors"
        >
          <Plus size={16} />
          اسلاید جدید
        </button>
      </div>

      {/* گرید اسلایدرها */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : sliders.length === 0 ? (
        <div className="text-center py-20 text-gray">
          اسلایدری ثبت نشده است
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider) => (
            <motion.div
              key={slider._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border overflow-hidden group"
            >
              {/* عکس */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {slider.image ? (
                  <img
                    src={`${BASE_URL}/${slider.image}`}
                    alt={slider.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff size={28} className="text-gray-400" />
                  </div>
                )}

                {/* badge بخش */}
                <div className="absolute top-3 right-3 bg-navy/80 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full">
                  {sectionLabel[slider.section] || slider.section}
                </div>

                {/* badge وضعیت */}
                <div className={`absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full ${
                  slider.isActive
                    ? "bg-green-500/80 text-white"
                    : "bg-gray-500/80 text-white"
                }`}>
                  {slider.isActive ? "فعال" : "غیرفعال"}
                </div>
              </div>

              {/* اطلاعات */}
              <div className="p-4">
                <h3 className="font-medium text-navy mb-1">{slider.title}</h3>
                {slider.description && (
                  <p className="text-xs text-gray line-clamp-2">
                    {slider.description}
                  </p>
                )}

                {/* دکمه‌ها */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => openEdit(slider)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray hover:text-primary border border-border hover:border-primary py-2 transition-colors"
                  >
                    <Pencil size={12} />
                    ویرایش
                  </button>
                  <button
                    onClick={() => setDeleteId(slider._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray hover:text-red-500 border border-border hover:border-red-300 py-2 transition-colors"
                  >
                    <Trash2 size={12} />
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal ساخت/ویرایش */}
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
              className="bg-white w-full max-w-md"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h2 className="font-bold text-navy">
                  {editSlider ? "ویرایش اسلاید" : "اسلاید جدید"}
                </h2>
                <button onClick={() => setModalOpen(false)}>
                  <X size={20} className="text-gray" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* عنوان */}
                <div>
                  <label className="block text-xs text-gray mb-1">عنوان *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="عنوان اسلاید"
                  />
                </div>

                {/* توضیحات */}
                <div>
                  <label className="block text-xs text-gray mb-1">توضیحات</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* بخش */}
                <div>
                  <label className="block text-xs text-gray mb-1">بخش</label>
                  <select
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full border border-border px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                  >
                    <option value="home">صفحه اصلی</option>
                    <option value="about">درباره ما</option>
                    <option value="projects">پروژه‌ها</option>
                  </select>
                </div>

                {/* وضعیت */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-navy">
                    فعال
                  </label>
                </div>

                {/* آپلود عکس */}
                <div>
                  <label className="block text-xs text-gray mb-1">
                    تصویر {!editSlider && "*"}
                    {editSlider?.image && (
                      <span className="mr-2 text-primary">تصویر موجود است</span>
                    )}
                  </label>

                  {/* پیش‌نمایش عکس انتخاب‌شده */}
                  {image && (
                    <div className="mb-3 relative w-full h-36 overflow-hidden rounded-lg">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => setImage(null)}
                        className="absolute top-2 left-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border hover:border-primary transition-colors p-5 cursor-pointer">
                    <Upload size={16} className="text-gray" />
                    <span className="text-sm text-gray">
                      {image ? image.name : "انتخاب تصویر"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImage(e.target.files[0])}
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
                  disabled={submitting || !form.title || (!editSlider && !image)}
                  className="px-6 py-2 bg-navy text-white text-sm hover:bg-navy/90 disabled:opacity-60"
                >
                  {submitting ? "در حال ذخیره..." : editSlider ? "ذخیره" : "ایجاد"}
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
              <h3 className="font-bold text-navy mb-2">حذف اسلاید</h3>
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