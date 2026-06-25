import multer from "multer";
import path from "path";

// ─────────────────────────────────────────
// Storage ترکیبی (عکس + کاتالوگ)
// ─────────────────────────────────────────
const combinedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "images") cb(null, "uploads/images/");
    else if (file.fieldname === "catalogFile") cb(null, "uploads/catalogs/");
    else cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// ─────────────────────────────────────────
// Storage تکی (فقط عکس)
// ─────────────────────────────────────────
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/images/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// ─────────────────────────────────────────
// FileFilter ترکیبی
// ─────────────────────────────────────────
const combinedFilter = (req, file, cb) => {
  if (file.fieldname === "images") {
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("فقط فایل تصویری مجاز است"), false);
  } else if (file.fieldname === "catalogFile") {
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("فقط فایل PDF مجاز است"), false);
  } else {
    cb(new Error("فیلد نامعتبر است"), false);
  }
};

// ─────────────────────────────────────────
// FileFilter تکی (فقط عکس)
// ─────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  file.mimetype.startsWith("image/")
    ? cb(null, true)
    : cb(new Error("فقط فایل تصویری مجاز است"), false);
};

// ─────────────────────────────────────────
// Export ها
// ─────────────────────────────────────────

// برای پروژه‌ها — چند عکس + یه کاتالوگ PDF
export const uploadProjectFiles = multer({
  storage: combinedStorage,
  fileFilter: combinedFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
}).fields([
  { name: "images", maxCount: 10 },
  { name: "catalogFile", maxCount: 1 },
]);

// برای category — چند عکس
export const uploadMultipleImages = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).fields([{ name: "images", maxCount: 10 }]);

// برای about، services — یه عکس
export const uploadSingleImage = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("image");
