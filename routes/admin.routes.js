import express from "express";
import { safeHandler } from "../middlewares/safeHandler.js";
import Admin from "../models/admin.model.js";
import { generateToken } from "../utils/jwtFuncs.js";
import bcrypt from "bcrypt";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/login",
  safeHandler(async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.error(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.error(401, "Invalid credentials", "INVALID_CREDENTIALS");
    }
    const adminToken = generateToken({
      id: admin._id,
      role: admin.role,
      username: admin.username,
    });
    res.cookie("userToken", adminToken); // http true secure true all that
    return res.success(200, "Admin successfully logged in", {
      userToken: adminToken,
    });
  })
);

router
  .route("/")
  .get(
    checkAuth("superadmin"),
    safeHandler(async (req, res) => {
      const admins = await Admin.find();
      if (!admins || admins.length === 0) {
        return res.error(404, "No admins found", "NO_ADMINS_FOUND");
      }
      return res.success(200, "Admins fetched successfully", { admins });
    })
  )

  .post(
    checkAuth("superadmin"),
    safeHandler(async (req, res) => {
      const { username, password } = req.body;
      const adminExists = await Admin.findOne({ username });
      if (adminExists) {
        return res.error(400, "Admin already exists", "ADMIN_EXISTS");
      }
      const hash = await bcrypt.hash(password, 10);
      const admin = await Admin.create({ username, password: hash });
      return res.success(201, "Admin created successfully", { admin });
    })
  );

export default router;
