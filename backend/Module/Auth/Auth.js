import express from "express";
import { login, getMe, seedAdmin } from "./AuthCn.js";
import { protect } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/seed", seedAdmin);

export default router;
