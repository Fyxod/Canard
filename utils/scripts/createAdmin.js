import mongoose from "mongoose";
import connectMongo from "../../config/db.js";
import Admin from "../../models/admin.model.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export default async function createAdmin({username, purge = false} = {}) {
  //   await connectMongo();
//   if (purge) {
//     await Admin.deleteMany({
//       role: "admin",
//     });
//   }
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const newAdmin = await Admin.create({
    username: username,
    password: password,
    role: "admin",
  });
  console.log("Admin created successfully", newAdmin);
  //   mongoose.connection.close();
}

// createAdmin("Parth");
