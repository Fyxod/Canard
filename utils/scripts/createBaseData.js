import connectMongo from "../../config/db.js";
import mongoose from "mongoose";
import { addSampleData } from "./addSampleData.js";
import createLeftRightHand from "./createLeftRightHand.js";
import createSuperAdmin from "./createSuperAdmin.js";
import createAdmin from "./createAdmin.js";
import Admin from "../../models/admin.model.js";
import initializeSettings from "./intializeSettings.js";
import assignOrders from "./assignOrders.js";

async function initializeTesting({ purge = false } = {}) {
  await connectMongo();
  console.log(purge)

  
    await initializeSettings({ purge: purge })
    await addSampleData({ purge: purge })
    await createLeftRightHand({ purge: purge })

    if(purge){
      await Admin.deleteMany({
        role: "admin",
      });
    }

    await createSuperAdmin({ purge: purge })
    await createAdmin({ username: "Parth", purge: purge })
    await createAdmin({ username: "omrajpal", purge: purge })
    await createAdmin({ username: "admin3", purge: purge })
  
  console.log("Data initialized successfully");
  console.log("Assigning orders.....");
  await assignOrders();
  mongoose.connection.close();
}

initializeTesting({ purge: true });
