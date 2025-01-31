import mongoose from "mongoose";
import connectMongo from "../config/db.js";
import User from "../models/user.model.js";

async function countAvatars() {
  await connectMongo();
  const users = await User.find();
  let avatarCount = 0;
  for (let user of users) {
    if (user.avatar) {
      avatarCount++;
    }
  }
  console.log(`Total users with avatars: ${avatarCount}`);
  mongoose.connection.close();
}

// countAvatars();
