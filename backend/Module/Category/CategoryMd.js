import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: { type: String, trim: true },
  description: { type: String, default: null },
});

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام دسته‌بندی الزامی است"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    longDescription: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      required: [true, "اسلاگ دسته‌بندی الزامی است"],
      unique: true,
      trim: true,
    },
    images: [
      {
        type: String,
        default: null,
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subCategories: [subCategorySchema],
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
