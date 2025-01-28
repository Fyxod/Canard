import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "admin",
      enum: ["admin", "superAdmin"],
    },
    taskId:{
      type: String,
      required: true,
      enum: [
        "101", "102", "103", "104", "105", "106", "107", "108",
        "201", "202", "203", "204", "205", "206", "207", "208",
        "301", "302", "303", "304", "305", "306", "307", "308",
        "-1"
      ],
      default: "-1"
    }
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
