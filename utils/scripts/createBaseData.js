import connectMongo from "../../config/db.js";
import Settings from "../../models/settings.model.js";
import mongoose from "mongoose";
import { addSampleData } from "./addSampleData.js";
import createLeftRightHand from "./createLeftRightHand.js";
import createSuperAdmin from "./createSuperAdmin.js";
import createAdmin from "./createAdmin.js";

async function initializeTesting({ purge = false } = {}) {
  await connectMongo();

  await Promise.all([
    Settings.create({}),
    addSampleData({ purge: purge }),
    createLeftRightHand({ purge: purge }),
    createSuperAdmin({ purge: purge }),
    createAdmin({ username: "Parth", purge: purge }),
    createAdmin({ username: "omrajpal", purge: purge }),
    createAdmin({ username: "admin3", purge: purge }),
  ]);
  console.log("Data initialized successfully");
  mongoose.connection.close();
}

// initializeTesting({ purge: true });
