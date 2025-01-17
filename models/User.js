import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
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
    enum: ["user", "admin", "dictator", "leftHand", "rightHand"],
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  avatar: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

export default User;