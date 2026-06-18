import express from "express";
import { createSlider, deleteSlider, getSlider, getSliders, updateSlider } from "./SliderCn.js";
import { protect } from "../../Middleware/authMiddleware.js";
import { uploadSingleImage } from "../../middleware/upload.js";

const router = express.Router();

router.get("/", getSliders);
router.get("/:id", getSlider);
router.post("/", protect, uploadSingleImage, createSlider);
router.put("/:id", protect, uploadSingleImage, updateSlider);
router.delete("/:id", protect, deleteSlider);

export default router