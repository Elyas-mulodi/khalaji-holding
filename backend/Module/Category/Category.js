import express from "express";

import { protect } from "../../Middleware/authMiddleware.js";
import { uploadMultipleImages } from "../../Middleware/upload.js";
import {
  addSubCategory,
  createCategory,
  deleteCategory,
  deleteCategoryImage,
  deleteSubCategory,
  getCategories,
  getCategory,
  getCategoryProjects,
  updateCategory,
  updateSubCategory,
} from "./CategoryCn.js";

const router = express.Router();

// دسته‌بندی‌ها
router.get("/", getCategories);
router.get("/:slug/projects", getCategoryProjects);
router.get("/:slug", getCategory);
router.post("/", protect, uploadMultipleImages, createCategory);
router.put("/:id", protect, uploadMultipleImages, updateCategory);
router.delete("/:id", protect, deleteCategory);
router.delete("/:id/images", protect, deleteCategoryImage);

// زیردسته‌ها
router.post("/:id/subcategories", protect, addSubCategory);
router.put("/:id/subcategories/:subId", protect, updateSubCategory);
router.delete("/:id/subcategories/:subId", protect, deleteSubCategory);

export default router;
