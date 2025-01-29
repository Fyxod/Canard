import Team from "../../models/team.model.js";
import { announceSingle } from "../Announcements.js";
import config from "../../config/config.js";
import getIstDate from "../getIstDate.js";
import Settings from "../../models/settings.model.js";

export default async function offBoard(phaseValue) {
  const teams = await Team.find({});
  if (!teams || teams.length === 0) {
    console.log("No teams found");
    return;
  }

  const settings = await Settings.findOne();

  for (let team of teams) {
    // this is the case when the phase is either "completed" or "inProgress"
    if (team.state === "busy") {
      // change the team state to idle
      team.state = "idle";
      const temp = team.currentPhase;
      // getting the current phase
      const currentPhase = `phase${team.currentPhase}`;

      // setting the current task to -1
      team[currentPhase].currentTask = -1;
      team.currentPhase = -1;

      // changing the phase status to failed if it is still in progress
      if (team[currentPhase].status === "inProgress") {
        team[currentPhase].status = "failed";
        team[currentPhase].completedAt = null;
        team[currentPhase].timeTaken =
          getIstDate() - settings.phaseValue[phaseValue].startTime; // phaseValue = team.phaseOrder.indexOf(phaseNo) + 1
        team.completedPhases = team.completedPhases + 1;

        // if all the phases are over
        if (team.completedPhases === 3) {
          team.state = "completed";

          team.totalTimeTaken =
            team.phase1.timeTaken +
            team.phase2.timeTaken +
            team.phase3.timeTaken;

          team.completedAt = getIstDate();
        }
      }

      await team.save();
      console.log(`Team ${team.name} is now idle`);

      if (team[`phase${temp}`].status === "failed") {
        announceSingle(team._id, {
          type: "completion",
          message: `Sorry, you were unable to complete phase ${temp} in time.`,
        });
      } else {
        announceSingle(team._id, {
          type: "completion",
          message: `Phase ${temp}'s time is over😊.`,
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}
