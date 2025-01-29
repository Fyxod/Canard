import connectMongo from "../../config/db.js";
import mongoose from "mongoose";
import { addSampleData } from "./addSampleData.js";
import createLeftRightHand from "./createLeftRightHand.js";
import createSuperAdmin from "./createSuperAdmin.js";
import createAdmin from "./createAdmin.js";
import Admin from "../../models/admin.model.js";
import initializeSettings from "./intializeSettings.js";
import assignOrders from "./assignOrders.js";
import Game from "../../models/game.model.js";

async function initializeTesting({ purge = false } = {}) {
  await connectMongo();
  console.log(purge)

    await Game.deleteMany({});
    await initializeSettings({ purge: purge })
    await addSampleData({ purge: purge })
    await createLeftRightHand({ purge: purge })

    if(purge){
      await Admin.deleteMany({
        role: "admin",
      });
    }

    await createSuperAdmin({ purge: purge })
    await createAdmin({ username: "admin1", purge: purge })
    await createAdmin({ username: "admin2", purge: purge })
    await createAdmin({ username: "admin3", purge: purge })
  
  console.log("Data initialized successfully");
  console.log("Assigning orders.....");
  await assignOrders();
  mongoose.connection.close();
}

initializeTesting({ purge: true });






//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES
//GAME TITLES