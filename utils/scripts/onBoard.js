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
    const currentPhase = `phase${team.currentPhase}`;
    team[currentPhase].status = "inProgress";
    team[currentPhase].currentTask = team[currentPhase].taskOrder[0];
    let currentTask = team[`phase${team.currentPhase}`].currentTask;
    currentTask = currentTask.toString();
    let task = team[currentPhase].tasks.get(currentTask);
    task.status = "inProgress";
    team[currentPhase].tasks.set(currentTask, task);
    await team.save(); // don't want to overload the server





    // let currentTask = currentPhase.currentTask;
    // currentTask = currentTask.toString();
    // currentPhase.tasks[currentTask].status = "inProgress";
    // team[`phase${team.currentPhase}`] = currentPhase;
    // await team.save(); // don't want to overload the server








    // team[currentPhase].status = "inProgress";
    // team[currentPhase].currentTask = team[currentPhase].taskOrder[0];
    // let currentTask = team[`phase${team.currentPhase}`].currentTask;
    // currentTask = currentTask.toString();
    // // too complicated huh😅 - I like it though
    // console.log(team[currentPhase]["tasks"]);
    // // team[currentPhase]["tasks"][currentTask].status =
    // //   "inProgress";
    // team[currentPhase].tasks.set(currentTask.status, "inProgress");

    // await team.save(); // don't want to overload the server
    console.log(
      `Team ${team.name} is now busy and in their first task of phase ${phaseValue}`
    );
    announceSingle(team._id, "rebuild");
  }
  console.log("All teams are now busy and in their first task");
}
