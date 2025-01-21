import connectMongo from "../../config/db.js";
import Settings from "../../models/settings.model.js";
import mongoose from "mongoose";

async function initializeSettings({ purge = false } = {}) {
  // await connectMongo();
  if (purge) {
    await Settings.deleteMany({});
  }
  await Settings.create({});
  console.log("Settings initialized successfully");
  // mongoose.connection.close();
}

// initializeSettings();
