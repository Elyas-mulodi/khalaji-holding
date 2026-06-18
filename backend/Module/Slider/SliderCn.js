import Slider from "./sliderMd.js";
import fs from "fs";
import path from "path";
import { __dirname } from "../../app.js";

export const getSliders = async (req, res) => {
  try {
    const filter = {};

    if (req.query.section) {
      filter.section = req.query.section;
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    const sliders = await Slider.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sliders.length,
      data: sliders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "اسلایدر یافت نشد",
      });
    }

    res.status(200).json({
      success: true,
      data: slider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSlider = async (req, res) => {
  try {
    const { title, description, section, isActive } = req.body;

    const image = req.files?.image
      ? req.files.image[0].path.replace(/\\/g, "/")
      : null;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "تصویر اسلایدر الزامی است",
      });
    }

    const slider = await Slider.create({
      title,
      description,
      section,
      isActive: isActive === "true",
      image,
    });

    res.status(201).json({
      success: true,
      message: "اسلایدر ساخته شد",
      data: slider,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "اسلایدر یافت نشد",
      });
    }

    const updateData = { ...req.body };

    if (req.files?.image) {
      // delete old image
      if (slider.image) {
        const fullPath = path.join(__dirname, slider.image);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }

      updateData.image = req.files.image[0].path.replace(/\\/g, "/");
    }

    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === "true";
    }

    const updated = await Slider.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "اسلایدر آپدیت شد",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        success: false,
        message: "اسلایدر یافت نشد",
      });
    }

    if (slider.image) {
      const fullPath = path.join(__dirname, slider.image);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await slider.deleteOne();

    res.status(200).json({
      success: true,
      message: "اسلایدر حذف شد",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};