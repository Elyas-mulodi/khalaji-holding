import jwt from "jsonwebtoken";
import Admin from "./AuthMd.js";

// Generate JWT
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "نام کاربری و رمز عبور الزامی است",
      });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "اطلاعات وارد شده صحیح نیست",
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "اطلاعات وارد شده صحیح نیست",
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(admin._id),
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get admin
export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "ادمین یافت نشد",
      });
    }
    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// admin seed
export const seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ username: "khalaji" });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "ادمین قبلاً ایجاد شده است",
      });
    }
    const admin = await Admin.create({
      username: "khalaji",
      password: "khalaji123",
    });

    res.status(201).json({
      success: true,
      message: "ادمین با موفقیت ایجاد شد",
      admin: {
        id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
