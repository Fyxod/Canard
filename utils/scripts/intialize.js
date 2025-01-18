import connectMongo from "../../config/db.js";
import Settings from "../../models/settings.model.js";
import mongoose from "mongoose";

async function initialize() {
  await connectMongo();

  await Settings.create({});
    console.log("Settings initialized successfully");
    mongoose.connection.close();
}

// initialize();