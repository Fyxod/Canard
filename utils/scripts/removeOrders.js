import connectMongo from "../../config/db.js";
import Team from "../../models/team.model.js";

async function removeOrders() {
  await connectMongo();
  const teams = await Team.find({});
  for (let team of teams) {
    team.phaseOrder = [];
    team.phase1.taskOrder = [];
    team.phase2.taskOrder = [];
    team.phase3.taskOrder = [];

    await team.save();
    console.log(`Orders removed for team ${team.name}`);
  }
}

removeOrders();

/* 
During Day 2 there were a lot of tasks that were not updated by the admins on the app(human error, not the backend's fault)
but I noted them down to be compiled with the results at the end of the day. The teams were still complaining that they had 
completed the tasks but it had not been updated on the app. Frankly we didn't have the time to update it and it was not necessary 
to anymore. So I wrote a script to remove all the orders from the teams so they could not even see the status of the tasks 
whether it had been completed or not😉🤫
*/
