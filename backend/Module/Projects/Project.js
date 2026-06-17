import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
} from "./ProjectCn.js";
import { protect } from "../../middleware/authMiddleware.js";
import { uploadProjectFiles } from "../../Middleware/upload.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", protect, uploadProjectFiles, createProject);
router.put("/:id", protect, uploadProjectFiles, updateProject);
router.delete("/:id", protect, deleteProject);
router.delete("/:id/images", protect, deleteProjectImage);
