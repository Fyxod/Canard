import mongoose from "mongoose";
import connectMongo from "../../config/db.js";
import taskData from "../../data/taskData.js";
import Team from "../../models/team.model.js";

function generateEqualPhaseAndTaskOrders(
  teamCount,
  phase1TaskCount,
  phase2TaskCount,
  phase3TaskCount
) {
  const phases = [1, 2, 3];
  const taskCounts = {
    1: phase1TaskCount,
    2: phase2TaskCount,
    3: phase3TaskCount,
  };

  const orders = [];

  for (let i = 0; i < teamCount; i++) {
    const phaseOffset = i % phases.length;
    const phaseOrder = phases
      .slice(phaseOffset)
      .concat(phases.slice(0, phaseOffset));

    const taskOrders = {};
    for (const phase of phases) {
      const taskCount = taskCounts[phase];
      const tasks = Array.from({ length: taskCount }, (_, index) => index + 1);
      const taskOffset = i % taskCount;
      taskOrders[phase] = tasks
        .slice(taskOffset)
        .concat(tasks.slice(0, taskOffset));
    }

    // convert [1, 2, 3] to [101, 102, 103]
    for (let i = 1; i <= 3; i++) {
      taskOrders[i] = taskOrders[i].map((task) => i * 100 + task);
    }

    orders.push({ phaseOrder, ...taskOrders });
  }

  return orders;
}

async function assignOrders() {
  await connectMongo();
  const teams = await Team.find({});
  if (!teams || teams.length === 0) {
    console.log("No teams found");
    return;
  }
  const teamCount = teams.length;

  const phase1TaskCount = Object.keys(taskData.phase1).length;
  const phase2TaskCount = Object.keys(taskData.phase2).length;
  const phase3TaskCount = Object.keys(taskData.phase3).length;

  const orders = generateEqualPhaseAndTaskOrders(
    teamCount,
    phase1TaskCount,
    phase2TaskCount,
    phase3TaskCount
  );

  console.log(orders);

  const updateTeams = async () => {
    await Promise.all(
      teams.map(async (team, index) => {
        const order = orders[index];

        team.phaseOrder = order.phaseOrder;
        team.phase1.taskOrder = order[1];
        team.phase2.taskOrder = order[2];
        team.phase3.taskOrder = order[3];

        await team.save();
      })
    );
    console.log("All teams updated successfully");
  };

  await updateTeams();
  mongoose.connection.close();
}

assignOrders();
