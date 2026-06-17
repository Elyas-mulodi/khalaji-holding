import express from "express";
import { search } from "./SearchCn.js";

const router = express.Router();

router.get("/", search);

export default router;
