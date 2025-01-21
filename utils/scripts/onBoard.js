import Team from "../../models/team.model.js";
import { announceSingle } from "../Announcements.js";

export default async function onBoard(phaseValue) {
  const teams = await Team.find();
  if (!teams || teams.length === 0) {
    console.log("No teams found");
    return;
  }

  for (let team of teams) {
    team.state = "busy";
    team.currentPhase = team.phaseOrder[phaseValue - 1];
    team[team.currentPhase].status = "inProgress";
    team[team.currentPhase].currentTask = team[team.currentPhase].taskOrder[0];

    // too complicated huh😅 - I like it though
    team[team.currentPhase].tasks[team[team.currentPhase].currentTask].status =
      "inProgress";

    await team.save(); // don't want to overload the server
    console.log(
      `Team ${team.name} is now busy and in their first task of phase ${phaseValue}`
    );
    announceSingle(team._id, "rebuild");
  }
  console.log("All teams are now busy and in their first task");
}
