import fs from "fs";
import path from "path";
import { __dirname } from "../../app.js";
import Category from "./CategoryMd.js";
import Project from "../Projects/ProjectMd.js";

// Get All
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      order: 1,
    });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get One
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }
    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get category Projects
export const getCategoryProjects = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = { category: category._id };

    if (req.query.ongoing !== undefined) {
      filter.ongoing = req.query.ongoing === "true";
    }

    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === "true";
    }

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .select(
        "title description images location yearBuilt category subCategory isOngoing featured",
      )
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const projectsWithSub = projects.map((project) => {
      const proj = project.toObject();
      if (proj.subCategory) {
        const sub = category.subCategories.find(
          (s) => s._id.toString() === proj.subCategory.toString(),
        );
        proj.subCategory = sub || null;
      }
      return proj;
    });
    res.status(200).json({
      success: true,
      category: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        longDescription: category.longDescription,
        image: category.image,
        subCategories: category.subCategories,
      },
      count: projects.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: projectsWithSub,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// create
export const createCategory = async (req, res) => {
  try {
    const { name, description, slug, subCategories, order } = req.body;

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "اسلاگ وارد شده تکراری است",
      });
    }

    const images = req.files?.images
      ? req.files.images.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    const category = await Category.create({
      name,
      slug,
      description,
      longDescription,
      images,
      order: order || 0,
      subCategories: subCategories ? JSON.parse(subCategories) : [],
    });

    res.status(201).json({
      success: true,
      message: "دسته‌بندی با موفقیت ساخته شد",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }

    const updateData = { ...req.body };

    if (req.files?.images) {
      const newImages = req.files.images.map((file) =>
        file.path.replace(/\\/g, "/"),
      );
      updateData.images = [...category.images, ...newImages];
    }

    if (updateData.subCategories) {
      updateData.subCategories = JSON.parse(updateData.subCategories);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "دسته‌بندی با موفقیت بروزرسانی شد",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// add sub category
export const addSubCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }

    category.subCategories.push({ name, description });
    await category.save();

    res.status(200).json({
      success: true,
      message: "زیر دسته‌بندی با موفقیت اضافه شد",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update sub category
export const updateSubCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }

    const sub = category.subCategories.id(req.params.subId);
    if (!sub) {
      return res.status(404).json({
        success: false,
        message: "زیر دسته‌بندی یافت نشد",
      });
    }

    if (name) sub.name = name;
    if (description) sub.description = description;
    await category.save();

    res.status(200).json({
      success: true,
      message: "زیردسته با موفقیت ویرایش شد",
      data: category.subCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete sub category
export const deleteSubCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }

    category.subCategories = category.subCategories.filter(
      (sub) => sub._id.toString() !== req.params.subId,
    );
    await category.save();

    res.status(200).json({
      success: true,
      message: "زیردسته با موفقیت حذف شد",
      data: category.subCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// dalete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }

    const projectCount = await Project.countDocuments({
      category: category._id,
    });

    if (projectCount > 0) {
      return res.status(400).json({
        success: false,
        message: `این دسته‌بندی دارای ${projectCount} پروژه است. ابتدا پروژه‌ها را منتقل یا حذف کنید`,
      });
    }

    if (category.images && category.images.length > 0) {
      category.images.forEach((img) => {
        const fullPath = path.join(__dirname, img);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "دسته‌بندی با موفقیت حذف شد",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete category images
export const deleteCategoryImage = async (req, res) => {
  try {
    const { imagePath } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "دسته‌بندی یافت نشد",
      });
    }

    if (!category.images.includes(imagePath)) {
      return res.status(404).json({
        success: false,
        message: "تصویر یافت نشد",
      });
    }

    const fullPath = path.join(__dirname, imagePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    category.images = category.images.filter((img) => img !== imagePath);
    await category.save();

    res.status(200).json({
      success: true,
      message: "تصویر با موفقیت حذف شد",
      data: category.images,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
