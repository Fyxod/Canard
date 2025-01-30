import mongoose from "mongoose";
import connectMongo from "../../config/db.js";
import Team from "../../models/team.model.js";
import creditcardData from "../../data/creditCardData.js";

async function assignCreditcard() {
  await connectMongo();
  const teams = await Team.find();

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    team.creditCardNo = creditcardData[i];
    await team.save();
    console.log(`Credit Card assigned to ${team.name}`);
  }
  mongoose.connection.close();
}

// assignCreditcard();