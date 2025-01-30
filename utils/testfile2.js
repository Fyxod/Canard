import mongoose from "mongoose";
import connectMongo from "../config/db.js";
import Game from "../models/game.model.js";
import User from "../models/user.model.js";

async function createGames() {
  await connectMongo();
  await Game.deleteMany({});

  const users = await User.find();

  for (let user of users) {
    const game = await Game.create({ user: user._id, team: user.team });
    user.game = game._id;
    await user.save();
    console.log(`Game created for user ${user.username}`);
  }
  mongoose.connection.close();
}

createGames();
