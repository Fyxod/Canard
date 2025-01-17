import express from "express";

import { checkAuth } from "../middlewares/auth.middleware.js";

import { safeHandler } from "../middlewares/safeHandler.js";
import Admin from "../models/admin.model.js";
import { generateToken } from "../utils/jwtFuncs.js";

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
      role: "admin",
      username: admin.username,
    });
    return res.success(200, "Admin successfully logged in", { adminToken });
  })
);

router.post(
  "/",
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
