import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import authRouter from "./Module/Auth/Auth.js";
import serviceRouter from "./Module/Category/Category.js";
import projectRouter from "./Module/Projects/Project.js";
import searchRouter from "./Module/Search/Search.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/services", serviceRouter);
app.use("/api/projects", projectRouter);
app.use("/api/search",searchRouter);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use((req, res, next) => {
  return res.status(404).json({
    message: "Route Not Found",
    success: false,
  });
});

export default app;
