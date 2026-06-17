import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";



const app = express();

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());



app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use((req, res, next) => {
  return res.status(404).json({
    message: "Route Not Found",
    success: false,
  });
});

export default app;