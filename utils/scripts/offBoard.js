import Team from "../../models/team.model.js";
import announceSingle from "../Announcement.js";

export default async function offBoard(phaseValue) {
  const teams = await Team.find({});
  if (!teams || teams.length === 0) {
    console.log("No teams found");
    return;
  }
  for (let team of teams) {
    // tasks to be done common for all phaseValues
    if (team.state === "busy") {
      team.state = "idle";
      const currentPhase = team.currentPhase;
      team[`phase${currentPhase}`].status = "failed";
      team[`phase${currentPhase}`].completedAt = -1;
      team[`phase${currentPhase}`].timeTaken =
        Date.now() - config.phaseStartTime[phaseValue]; // phaseValue = team.phaseOrder.indexOf(phaseNo) + 1
      team[`phase${currentPhase}`].currentTask = -1;
      team.completedPhases = team.completedPhases + 1;
      team.currentPhase = -1;
    // ANNOUNCEMENT FOR TEAM THAT THE TIME IS UP AND PHASE IS FAILED
      // offboarding tasks to be done based on phaseValue = 3
      if (team.completedPhases === 3) {
        team.state = "completed";
        team.totalTimeTaken =
          team.phase1.timeTaken + team.phase2.timeTaken + team.phase3.timeTaken;
        team.completedAt = Date.now();
        // Announce game completion
        announceSingle(team._id, "Time is up! \n Game is over!\n Please return to the OAT and wait for results");
      }
      else{
        announceSingle(team._id, "Time is up! \n Please return to the OAT to start the next phase");
      }
        await team.save();
    }
  }
}
