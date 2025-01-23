import Team from "../../models/team.model.js";
import User from "../../models/user.model.js";
import connectMongo from "../../config/db.js";
import mongoose from "mongoose";
import taskData from "../../data/taskData.js";
import sampleAvatars from "../../data/sampleAvatars.js";
import bcrypt from "bcrypt";
import callingCards from "../../data/callingCardData.js";

export async function addSampleData({ purge = false }) {
  // await connectMongo();

  if (purge) {
    await Team.deleteMany({});
    await User.deleteMany({});
  }

  const hash = await bcrypt.hash("password", 10);

  let userCount = 1;
  for (let i = 1; i <= 20; i++) {
    const team = await Team.create({
      name: "Team " + i,
      callingCard:callingCards[1]
    });

    Object.keys(taskData).forEach((phase) => {
      Object.keys(taskData[phase]).forEach((task) => {

        // console.log(taskData[phase][task]?.title)

        if(task === "answer") return;
        team[phase].tasks.set(task, {
          status: "notStarted",
          completedAt: null,
          timeTaken: -1,
          type: taskData[phase][task].type,
          title: taskData[phase][task].title,
          hintUsed: false,
        });
      });
    });

    for (let j = 1; j <= 4; j++) {
      const avatarOrder = randomAvatarOrder();

      const user = await User.create({
        username: "User" + userCount,
        email: "user" + userCount + "@gmail.com",
        password: hash,
        team: team._id,
        avatar: sampleAvatars[avatarOrder[j - 1] - 1],
      });
      team.members.push(user._id);
      console.log("User" + userCount + " created successfully");
      userCount++;
    }
    await team.save();
  }
  // mongoose.connection.close();
}

// addSampleData({ purge: true });

function randomAvatarOrder() {
  const avatarOrder = [1, 2, 3, 4];
  
  for (let i = avatarOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [avatarOrder[i], avatarOrder[j]] = [avatarOrder[j], avatarOrder[i]]; 
  }
  
  return avatarOrder;
}

