import Project from "./projectMd.js";
import fs from "fs";
import path from "path";
import { __dirname } from "../../app.js";

// Get All
export const getProjects = async (req, res) => {
  try {
    const filter = {};

    if (req.query.ongoing !== undefined) {
      filter.ongoing = req.query.ongoing === "true";
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.features !== undefined) {
      filter.features = req.query.features === "true";
    }

    if (req.query.subCategory) {
      filter.subCategory = req.query.subCategory;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { catalogTitle: searchRegex },
        { catalogDescription: searchRegex },
      ];
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .populate("category", "name slug subCategory")
      .populate("relatedProjects", "title images category")
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get One
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
      .populate("category", "name slug description")
      .populate({
        path: "relatedProjects",
        select: "title images slug category",
        populate: {
          path: "category",
          select: "name slug",
        },
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "پروژه یافت نشد",
      });
    }

    console.log("RELATED:", project.relatedProjects);

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// create
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      features,
      ongoing,
      yearBuilt,
      progress,
      completedAt,
      order,
      slug,
      relatedProjects,
      catalogTitle,
      catalogDescription,
    } = req.body;

    let relatedProjectsParsed = [];

    if (req.body.relatedProjects) {
      try {
        relatedProjectsParsed =
          typeof req.body.relatedProjects === "string"
            ? JSON.parse(req.body.relatedProjects)
            : req.body.relatedProjects;
      } catch (e) {
        relatedProjectsParsed = [];
      }
    }

    const images = req.files?.images
      ? req.files.images.map((file) => file.path.replace(/\\/g, "/"))
      : [];

    const catalogFile = req.files?.catalogFile
      ? req.files.catalogFile[0].path.replace(/\\/g, "/")
      : null;

    const project = await Project.create({
      title,
      category,
      description,
      location,
      yearBuilt,
      catalogTitle,
      catalogDescription,
      catalogFile,
      slug,
      images,
      relatedProjects: relatedProjectsParsed,
      ongoing: ongoing === "true",
      progress: progress || 0,
      completedAt: completedAt || null,
      features: features === "true",
      order: order || 0,
    });
    res.status(201).json({
      success: true,
      message: "پروژه با موفقیت ایجاد شد",
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "پروژه یافت نشد",
      });
    }

    const updateData = { ...req.body };

    if (req.files?.images) {
      const newImages = req.files.images.map((file) =>
        file.path.replace(/\\/g, "/"),
      );
      updateData.images = [...project.images, ...newImages];
    }

    if (req.files?.catalogFile) {
      if (project.catalogFile) {
        const fullPath = path.join(__dirname, project.catalogFile);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }
      updateData.catalogFile = req.files.catalogFile[0].path.replace(
        /\\/g,
        "/",
      );
    }

    if (updateData.relatedProjects) {
      updateData.relatedProjects = JSON.parse(updateData.relatedProjects);
    }

    if (updateData.ongoing !== undefined) {
      updateData.ongoing = updateData.ongoing === "true";
    }

    if (updateData.features !== undefined) {
      updateData.features = updateData.features === "true";
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");
    res.status(200).json({
      success: true,
      message: "پروژه با موفقیت بروزرسانی شد",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "پروژه یافت نشد",
      });
    }

    // حذف عکس‌ها از سرور
    project.images.forEach((imgPath) => {
      const fullPath = path.join(__dirname, imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    // حذف کاتالوگ از سرور
    if (project.catalogFile) {
      const fullPath = path.join(__dirname, project.catalogFile);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "پروژه با موفقیت حذف شد",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete image
export const deleteProjectImage = async (req, res) => {
  try {
    const { imagePath } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "پروژه یافت نشد",
      });
    }

    if (!project.images.includes(imagePath)) {
      return res.status(404).json({
        success: false,
        message: "تصویر یافت نشد",
      });
    }

    const fullPath = path.join(__dirname, imagePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    project.images = project.images.filter((img) => img !== imagePath);
    await project.save();

    res.status(200).json({
      success: true,
      message: "تصویر با موفقیت حذف شد",
      data: project.images,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
