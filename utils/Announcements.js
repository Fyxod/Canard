import { io } from "../app.js";
import Team from "../models/team.model.js";
// may also send a mail to the admins confirming shit?

export function announceSingle(teamId, message) {
  console.log(teamId, message)
  io.emit(`${teamId}`, message);
}

export async function announceAll(message) {
  const teams = await Team.find();
  for (const team of teams) {
    io.emit(`all/${team._id}`, message);
    // Wait for half a second before moving on to the next team
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

export async function announceHand(teamId){ // make om add this to app
  const teams = await Team.find();

  for(const team of teams){
    if (team._id !== teamId){
      io.emit(`hand/${team._id}`, "rebuild");

    // Wait for half a second before moving on to the next team
    await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
}