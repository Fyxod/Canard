import mongoose from "mongoose";
import connectMongo from "../../config/db.js";
import Admin from "../../models/admin.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export default async function createSuperAdmin({ purge = false } = {}) {
  // await connectMongo();
  if (purge) {
    await Admin.deleteMany({
      role: "superAdmin",
    });
  }
  const password = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
  const newSuperAdmin = await Admin.create({
    username: "Mlsc27",
    password: password,
    role: "superAdmin",
  });
  console.log("Super Admin created successfully", newSuperAdmin);
  // mongoose.connection.close();
}

// createSuperAdmin();
