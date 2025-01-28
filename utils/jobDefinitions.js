import Team from "../models/team.model.js";
import { announceSingle } from "./Announcements.js";

export default (agenda) => {
  agenda.define("hint", async (job) => {
    try {
      // const now = new Date();
      // if (now > job.attrs.nextRunAt) {
      //   return;
      // }

      const { teamName, teamId, phaseNo, taskId, hintTime } = job.attrs.data;
      console.log("Hint job", teamId, phaseNo, taskId, hintTime, teamName);
      const team = await Team.findById(teamId);
      const currentPhase = `phase${phaseNo}`;
      const currentTask = taskId.toString();
      const task = team[currentPhase].tasks.get(currentTask);
      task.hintActive = true;
      team[currentPhase].tasks.set(currentTask, task);
      await team.save();
      announceSingle(teamId, "rebuild");
    } catch (error) {
      console.log(error);
    }
  });
};
