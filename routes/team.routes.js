import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { safeHandler } from "../middlewares/safeHandler.js";
import Team from "../models/team.model.js";
import ApiError from "../utils/errorClass.js";
import User from "../models/user.model.js";
import { teamRegistrationSchema } from "../utils/zodSchemas.js";
import config from "../config/config.js";
import taskData from "../data/taskData.js";
import isRegistrationActive from "../middlewares/isRegistrationActive.js";
import isEventActive from "../middlewares/isEventActive.js";
import { isValidObjectId } from "mongoose";
import { announceHand, announceSingle } from "../utils/Announcements.js";
import getIstDate from "../utils/getIstDate.js";
import Hand from "../models/hand.model.js";
import powerUpsData from "../data/powerUpsData.js";
import callingCards from "../data/callingCardData.js";
import { agenda } from "../app.js";
import Settings from "../models/settings.model.js";

const router = express.Router();

router.route("/:teamName/users").get(
  checkAuth("admin"),
  safeHandler(async (req, res) => {
    const { teamName } = req.params;
    if (!teamName || teamName.trim() === "") {
      throw new ApiError(400, "Invalid team name", "INVALID_TEAM_NAME");
    }

    const team = await Team.findOne({ name: teamName })
      .populate({
        path: "members",
        select: "-password",
      })
      .lean();
    if (!team) {
      throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
    }

    const users = team.members.map((user) => {
      return user.username;
    });

    console.log(users);

    res.success(200, "Team members successfully fetched", {
      users,
    });
  })
);

router
  .route("/")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      let teams = await Team.find().lean();
      if (!teams || teams.length === 0) {
        throw new ApiError(404, "No team was found", "NO_TEAMS_FOUND");
      }

      teams = teams.map((team) => {
        for (let i = 1; i <= 3; i++) {
          let tasks = team[`phase${i}`]["tasks"];

          Object.keys(taskData[`phase${i}`]).forEach((task) => {
            if (task === "answer") return;
            let taskObj = tasks[task.toString()];
            taskObj["title"] = taskData[`phase${i}`][task].title;
            taskObj["description"] = taskData[`phase${i}`][task].description;
            taskObj["points"] = taskData[`phase${i}`][task].points;
            taskObj["hint"] = taskData[`phase${i}`][task].hint;
            tasks[task.toString()] = taskObj;
          });

          team[`phase${i}`]["tasks"] = tasks;
        }
        return team;
      });

      res.success(200, "All teams successfully fetched", { teams });
    })
  )

  .post(
    isRegistrationActive, // check if registration is active
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      let { name, callingCard } = req.body;
      if (!name || !callingCard || name.trim() === "") {
        throw new ApiError(
          400,
          "Invalid team name or calling card",
          "INVALID_TEAM_NAME_OR_CALLING_CARD"
        );
      }
      name = name.trim();
      callingCard = parseInt(callingCard);
      const teamExists = await Team.findOne({ name });
      if (teamExists) {
        throw new ApiError(
          400,
          "Team with this name already exists",
          "TEAM_EXISTS"
        );
      }

      const team = new Team({
        name,
        callingCard: callingCards[parseInt(callingCard)],
      });
      Object.keys(taskData).forEach((phase) => {
        Object.keys(taskData[phase]).forEach((task) => {
          if (task === "answer") return;
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

      await team.save();

      res.success(201, "Team created successfully", {
        teamName: team.name,
        teamId: team._id,
      });
    })
  )

  .delete(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const teams = await Team.find().populate({
        path: "members",
        select: "-password",
      });
      if (!teams || teams.length === 0) {
        throw new ApiError(404, "No team was found", "NO_TEAMS_FOUND");
      }

      await Promise.all([Team.deleteMany(), User.deleteMany()]); // Also delete any other model that might apply
      res.success(200, "All teams successfully deleted", { teams });
    })
  );

router
  .route("/:teamId")
  .get(
    checkAuth("user"),
    safeHandler(async (req, res) => {
      // console.log(req.headers)
      // console.log(req.user)
      const { teamId } = req.params;
      if (!isValidObjectId(teamId)) {
        throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
      }
      if (req.user.role === "user" && req.user.teamId.toString() !== teamId) {
        throw new ApiError(
          403,
          "You are not allowed to view this team",
          "FORBIDDEN"
        );
      }

      // I know I shoudnt be sending the users along with the team but just making things easier for the frontend devs
      const team = await Team.findById(teamId)
        .populate({
          path: "members",
          select: "-password",
        })
        .lean();
      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }
      for (let i = 1; i <= 3; i++) {
        let tasks = team[`phase${i}`]["tasks"];

        Object.keys(taskData[`phase${i}`]).forEach((task) => {
          if (task === "answer") return;
          let taskObj = tasks[task.toString()];
          taskObj["title"] = taskData[`phase${i}`][task].title;
          taskObj["description"] = taskData[`phase${i}`][task].description;
          taskObj["points"] = taskData[`phase${i}`][task].points;
          taskObj["hint"] = taskData[`phase${i}`][task].hint;
          tasks[task.toString()] = taskObj;
        });

        team[`phase${i}`]["tasks"] = tasks;
      }

      res.success(200, "Team successfully fetched", { team });
    })
  )

  .patch(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { teamId } = req.params;
      if (!isValidObjectId(teamId)) {
        throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
      }
      const { name } = teamRegistrationSchema.parse(req.body);
      const team = await Team.findByIdAndUpdate(
        teamId,
        { name },
        { new: true }
      );

      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }

      res.success(200, "Team updated successfully", {
        teamName: team.name,
        teamId: team._id,
      });
    })
  )

  .delete(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      if (!isValidObjectId(req.params.teamId)) {
        throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
      }
      const team = await Team.findById(req.params.teamId).populate({
        path: "members",
        select: "-password",
      });

      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }

      await Promise.all([
        Team.findByIdAndDelete(req.params.teamId),
        User.deleteMany({ team: req.params.teamId }),
      ]); // Also delete any other model that might apply

      res.success(200, "Team deleted successfully", { team });
    })
  );

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

router.patch(
  "/:teamId/:phaseNo/:taskId/hint",
  checkAuth("admin"),
  safeHandler(async (req, res) => {
    let { teamId, phaseNo, taskId } = req.params;
    let { hintUsed } = req.body;

    hintUsed = parseBoolean(hintUsed);

    if (typeof hintUsed !== "boolean") {
      throw new ApiError(400, "Invalid hintUsed", "INVALID_HINTUSED");
    }

    if (!isValidObjectId(teamId)) {
      throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
    }

    if (/^-?\d+$/.test(phaseNo.trim()) && /^-?\d+$/.test(taskId.trim())) {
      phaseNo = parseInt(phaseNo.trim(), 10);
      // taskId = parseInt(taskId.trim(), 10);
    } else {
      throw new ApiError(
        400,
        "Invalid phase number or task id",
        "INVALID_PHASE_NUMBER_OR_TASK_ID"
      );
    }

    if (phaseNo < 1 || phaseNo > 3) {
      throw new ApiError(
        400,
        "Invalid phase number.\nCan only be 1,2,3",
        "INVALID_PHASE_NUMBER"
      );
    }
    if (
      taskId.toString().length !== 3 ||
      parseInt(taskId.toString()[0]) !== phaseNo
    ) {
      throw new ApiError(400, "Invalid task id", "INVALID_TASK_ID");
    }

    const taskType = taskData[`phase${phaseNo}`][parseInt(taskId)]?.type;
    if (taskType !== "major" && taskType !== "minor") {
      throw new ApiError(400, "Invalid task type", "INVALID_TASK_ID");
    }

    const team = await Team.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
    }

    if (team.currentPhase === -1) {
      throw new ApiError(400, "Canard not started yet", "GAME_NOT_STARTED");
    }
    if (team.currentPhase !== phaseNo) {
      throw new ApiError(
        400,
        "Invalid phase number.\nCurrent phase is different",
        "INVALID_PHASE_NUMBER"
      );
    }

    if (team.currentPhase === -1) {
      throw new ApiError(400, "Canard not started yet", "GAME_NOT_STARTED");
    }
    if (team.currentPhase !== phaseNo) {
      throw new ApiError(
        400,
        "Invalid phase number.\nCurrent phase is different",
        "INVALID_PHASE_NUMBER"
      );
    }

    const phase = team[`phase${phaseNo}`];

    if (!phase) {
      throw new ApiError(404, "Phase not found", "PHASE_NOT_FOUND");
    }
    // if (phase.status === "completed") {
    //   throw new ApiError(
    //     400,
    //     "Phase has already been completed",
    //     "PHASE_COMPLETED"
    //   );
    // }

    if (team.state === "blocked") {
      throw new ApiError(400, "Team is blocked", "TEAM_BLOCKED");
    }
    if (team.state === "idle") {
      throw new ApiError(
        400,
        "No phase currently assigned to team",
        "TEAM_IDLE"
      );
    }

    if (taskType === "major" && phase.currentTask !== parseInt(taskId)) {
      throw new ApiError(
        400,
        "Invalid task id.\nCurrent task is different",
        "INVALID_TASK_ID"
      );
    }

    const task = phase.tasks.get(taskId);
    task.hintUsed = hintUsed;
    phase.tasks.set(taskId, task);
    team[`phase${phaseNo}`] = phase;
    await team.save();

    res.success(200, "Hint status updated successfully", { team });
  })
);

router.route("/:teamId/powerups").patch(
  checkAuth("user"),
  safeHandler(async (req, res) => {
    const { teamId } = req.params;
    const { powerups, creditCardNo } = req.body;
    if (!isValidObjectId(teamId)) {
      throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
    }

    if (req.user.teamId !== teamId) {
      throw new ApiError(
        "401",
        "You are not a user of this team",
        "UNAUTHORISED"
      );
    }

    if (!Array.isArray(powerups)) {
      throw new ApiError(400, "Invalid powerups", "INVALID_POWERUPS");
    }

    if (powerups.length === 0) {
      throw new ApiError(400, "No powerups selected", "NO_POWERUPS_SELECTED");
    }

    if (hasDuplicates(powerups)) {
      throw new ApiError(
        400,
        "Duplicate powerups selected",
        "DUPLICATE_POWERUPS"
      );
    }

    if (!creditCardNo || creditCardNo.trim() === "") {
      throw new ApiError(
        400,
        "Invalid credit card number",
        "INVALID_CREDIT_CARD_NO"
      );
    }

    const team = await Team.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
    }

    if (team.creditCardNo.toLowerCase() !== creditCardNo.toLowerCase()) {
      throw new ApiError(
        400,
        "Invalid credit card number",
        "INVALID_CREDIT_CARD_NO"
      );
    }

    // add credit minusing
    let totalCredits = 0;
    powerups.forEach((powerup) => {
      if (!powerUpsData[powerup]) {
        throw new ApiError(400, "Invalid powerup", "INVALID_POWERUP");
      }
      totalCredits += powerUpsData[powerup].credits;
    });

    if (team.score < totalCredits) {
      throw new ApiError(400, "Insufficient credits", "INSUFFICIENT_CREDITS");
    }

    powerups.forEach((powerup) => {
      if (team.powerups.includes(powerup)) {
        throw new ApiError(400, "Powerup already added", "POWERUP_ADDED");
      }
      team.powerups.push(powerup);

      // decrease the credits of the team by the credits of the powerup
      team.score = team.score - powerUpsData[powerup].credits;
    });
    await team.save();
    res.success(200, "Powerups updated successfully", { team });
  })
);

// SHIT STARTS
// SHIT STARTS
// SHIT STARTS
// SHIT STARTS
// SHIT STARTS
router.route("/:teamId/:phaseNo/:taskId").post(
  // take a completed parameter too as there are multiple options in the schema
  checkAuth("admin"),
  isEventActive, // check if event is active
  safeHandler(async (req, res) => {
    let { teamId, phaseNo, taskId } = req.params;
    const { status } = req.body;

    if (req.user.role === "admin" && req.user.taskId !== taskId) {
      throw new ApiError(
        401,
        "You are not allowed to complete this task",
        "FORBIDDEN"
      );
    }

    if (!isValidObjectId(teamId)) {
      throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
    }

    if (/^-?\d+$/.test(phaseNo.trim()) && /^-?\d+$/.test(taskId.trim())) {
      phaseNo = parseInt(phaseNo.trim(), 10);
      // taskId = parseInt(taskId.trim(), 10);
    } else {
      throw new ApiError(
        400,
        "Invalid phase number or task id",
        "INVALID_PHASE_NUMBER_OR_TASK_ID"
      );
    }

    if (phaseNo < 1 || phaseNo > 3) {
      throw new ApiError(
        400,
        "Invalid phase number.\nCan only be 1,2,3",
        "INVALID_PHASE_NUMBER"
      );
    }
    if (
      taskId.toString().length !== 3 ||
      parseInt(taskId.toString()[0]) !== phaseNo
    ) {
      throw new ApiError(400, "Invalid task id", "INVALID_TASK_ID");
    }

    const taskType = taskData[`phase${phaseNo}`][parseInt(taskId)]?.type;
    if (taskType !== "major" && taskType !== "minor") {
      throw new ApiError(400, "Invalid task type", "INVALID_TASK_ID");
    }

    //MAJOR TASK STARTS HERE
    //MAJOR TASK STARTS HERE
    //MAJOR TASK STARTS HERE
    //MAJOR TASK STARTS HERE

    if (taskType === "major") {
      if (["completed", "inProgress", "notStarted"].indexOf(status) === -1) {
        throw new ApiError(400, "Invalid status", "INVALID_STATUS");
      }
      const team = await Team.findById(teamId);
      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }
      if (team.state === "completed") {
        throw new ApiError(
          400,
          "Team has already completed the three phases",
          "COMPLETED"
        );
      }
      if (team.state === "blocked") {
        throw new ApiError(400, "Team is blocked", "TEAM_BLOCKED");
      }
      if (team.state === "idle") {
        throw new ApiError(
          400,
          "No phase currently assigned to team",
          "TEAM_IDLE"
        );
      }
      if (team.currentPhase === -1) {
        throw new ApiError(400, "Canard not started yet", "GAME_NOT_STARTED");
      }
      if (team.currentPhase !== phaseNo) {
        throw new ApiError(
          400,
          "Invalid phase number.\nCurrent phase is different",
          "INVALID_PHASE_NUMBER"
        );
      }

      const phase = team[`phase${phaseNo}`];

      if (!phase) {
        throw new ApiError(404, "Phase not found", "PHASE_NOT_FOUND");
      }
      if (phase.status === "completed") {
        throw new ApiError(
          400,
          "Phase has already been completed",
          "PHASE_COMPLETED"
        );
      }
      if (phase.currentTask !== parseInt(taskId)) {
        throw new ApiError(
          400,
          "Invalid task id.\nCurrent task is different",
          "INVALID_TASK_ID"
        );
      }

      // the following condition will only be applicable if I am using this route to complete the routes but I am apparantly allowing other statuses too so this condition is useless
      // if (phase.tasks[taskId].status === "completed") {
      //   throw new ApiError(
      //     400,
      //     "Task has already been completed",
      //     "TASK_COMPLETED"
      //   );
      // }

      // if (phase.tasks[taskId].type !== "major") {
      //   throw new ApiError(400, "Task is not a major task", "TASK_NOT_MAJOR");
      // }
      if (phase.tasks.get(taskId).type !== "major") {
        throw new ApiError(400, "Task is not a major task", "TASK_NOT_MAJOR");
      }
      console.log(phase.tasks.get(taskId).type);

      // READ FROM HERE //huh.. AGAIN!

      if (status === "completed") {
        // increases the number of completed tasks in a phase by 1
        phase.completedTasks = phase.completedTasks + 1;

        let task = phase.tasks.get(taskId);

        // sets the status of the task to completed
        task.status = "completed";

        // completed now obviously
        task.completedAt = getIstDate();

        // console.log(
        //   "health to be decreased",
        //   taskData[`phase${phaseNo}`][parseInt(taskId)].points
        // );
        // decrease the health of the hands equally by the number of points assigned to those tasks
        // await Hand.updateMany(
        //   {},
        //   {
        //     $inc: {
        //       health: -taskData[`phase${phaseNo}`][parseInt(taskId)].points,
        //     },
        //   }
        // );

        // if its the first task of the phase
        if (phase.completedTasks === 1) {
          const settings = await Settings.findOne();
          console.log("trace 1");
          // time taken is the time between now and the start of the phase as this is the first task of the phase
          task.timeTaken =
            getIstDate() -
            settings.phaseValue[team.phaseOrder.indexOf(phaseNo) + 1].startTime;

          // set the current task to be the next task in the task order
          phase.currentTask = phase.taskOrder[phase.completedTasks];
          console.log(phase.currentTask);
          const currentTask = phase.tasks.get(phase.currentTask.toString());
          console.log(currentTask);
          // setting the next task to be "inProgress"
          currentTask.status = "inProgress";
          phase.tasks.set(phase.currentTask.toString(), currentTask);

          // scheduling hints

          const hintTime =
            taskData[`phase${phaseNo}`][phase.currentTask].hintTime;

          agenda.schedule(new Date(Date.now() + hintTime * 60 * 1000), "hint", {
            teamName: team.name,
            teamId: team._id,
            phaseNo,
            taskId: phase.currentTask,
            hintTime,
          });
        }

        // if all tasks in the phase have been completed
        else if (phase.completedTasks === phase.taskOrder.length) {
          console.log("trace 2");
          // time taken is the time between now and the last task of the phase that was completed
          task.timeTaken =
            getIstDate() -
            phase.tasks.get(
              phase.taskOrder[phase.completedTasks - 2].toString()
            ).completedAt;

          // All the major tasks are completed so setting the currentTask to be -1, minor tasks can also be done until the phase time is over
          phase.currentTask = -1;

          // you can set the majorCompleted variable to be true here if you want to add it to the db
          // phase.majorCompleted = true; // not yet added to the model (probably won't)
        }

        // if its not the first or the last task of the phase
        else {
          console.log("trace 3");
          // time taken is the time between now and the last task of the phase that was completed
          task.timeTaken =
            getIstDate() -
            phase.tasks.get(
              phase.taskOrder[phase.completedTasks - 2].toString()
            ).completedAt;

          // set the current task to be the next task in the task order
          phase.currentTask = phase.taskOrder[phase.completedTasks];
          const currentTask = phase.tasks.get(phase.currentTask.toString());
          // setting the next task to be "inProgress"
          currentTask.status = "inProgress";
          phase.tasks.set(phase.currentTask.toString(), currentTask);

          // scheduling hints

          const hintTime =
            taskData[`phase${phaseNo}`][phase.currentTask].hintTime;

          agenda.schedule(new Date(Date.now() + hintTime * 60 * 1000), "hint", {
            teamId: team._id,
            phaseNo,
            taskId: phase.currentTask,
            hintTime,
          });
        }
        console.log("trace 4");
        phase.tasks.set(taskId, task);
      }

      // if the status is something other than 'completed'

      // condition not handled properly, do add more logic if this might be used
      else {
        throw new ApiError(400, "Invalid status", "INVALID_STATUS");
      }
      console.log("trace 6");
      team[`phase${phaseNo}`] = phase;

      await team.save();
      announceSingle(team._id, {
        type: "completion",
        message: `Your task ${
          taskData[`phase${phaseNo}`][taskId].title
        } of phase ${phaseNo} is completed`,
      });
      announceHand(team._id);
      res.success(200, "Task status updated successfully", { team });
    }

    // MINOR TASK STARTS HERE
    // MINOR TASK STARTS HERE
    // MINOR TASK STARTS HERE
    // MINOR TASK STARTS HERE

    // I wouldn't have created seperate if conditions for minor tasks and instead integrated this into the above logic but I was told about minor tasks too late so I don't want to mess with the above logic as there is very little time left and the code above is already too complicated
    else if (taskType === "minor") {
      const minorTaskId = taskId;
      console.log("trace 20");

      // bruh so many conditions😂, I just kept putting them as they came to my mind. Most of them are useless or just a version of each other

      if (["completed", "notStarted"].indexOf(status) === -1) {
        throw new ApiError(400, "Invalid status", "INVALID_STATUS");
      }

      const team = await Team.findById(teamId);
      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }

      if (team.currentPhase === -1) {
        throw new ApiError(400, "Canard not started yet", "GAME_NOT_STARTED");
      }

      if (team.state === "idle") {
        throw new ApiError(
          400,
          "No phase currently assigned to team",
          "TEAM_IDLE"
        );
      }

      if (team.state === "completed") {
        throw new ApiError(
          400,
          "Team has already completed the three phases",
          "COMPLETED"
        );
      }

      if (team.state === "blocked") {
        throw new ApiError(400, "Team is blocked", "TEAM_BLOCKED");
      }

      if (team.currentPhase !== phaseNo) {
        throw new ApiError(
          400,
          "Invalid phase number.\nCurrent phase is different",
          "INVALID_PHASE_NUMBER"
        );
      }

      const phase = team[`phase${phaseNo}`];

      if (!phase) {
        throw new ApiError(404, "Phase not found", "PHASE_NOT_FOUND");
      }

      if (phase.status === "completedAll") {
        throw new ApiError(
          400,
          "All the minor tasks have already been completed",
          "PHASE_COMPLETEDALL"
        );
      }

      if (phase.tasks.get(minorTaskId).type !== "minor") {
        throw new ApiError(400, "Task is not a minor task", "TASK_NOT_MINOR");
      }
      console.log("trace 21");
      const minorTask = phase.tasks.get(minorTaskId);
      console.log("trace 22");

      if (status === "completed") {
        if (minorTask.status === "completed") {
          throw new ApiError(
            400,
            "Task has already been completed",
            "TASK_COMPLETED"
          );
        }

        console.log("trace 23");
        minorTask.status = "completed";
        minorTask.completedAt = getIstDate();
        minorTask.timeTaken = -2;

        // console.log(
        //   "health to be decreased",
        //   taskData[`phase${phaseNo}`][parseInt(taskId)].points
        // );
        // decrease the health of the hands equally by the number of points assigned to those tasks
        // await Hand.updateMany(
        //   {},
        //   {
        //     $inc: {
        //       health: -taskData[`phase${phaseNo}`][parseInt(taskId)].points,
        //     },
        //   }
        // );

        await Hand.updateMany(
          {},
          {
            $inc: {
              health:
                -taskData[`phase${phaseNo}`][parseInt(minorTaskId)].points,
            },
          }
        );
      }

      // if some other condition other than completed
      else {
        throw new ApiError(400, "Invalid status", "INVALID_STATUS");
      }

      phase.tasks.set(minorTaskId, minorTask);
      phase.minorCompletedTasks = phase.minorCompletedTasks + 1;

      if (
        phase.status === "completed" &&
        Array.from(phase.tasks.values()).every(
          (task) => task.status === "completed"
        )
      ) {
        console.log("trace 25");
        phase.status = "completedAll";
        team.state = "idle";
        team.currentPhase = -1;
      }

      team[`phase${phaseNo}`] = phase;

      await team.save();
      announceSingle(team._id, {
        type: "completion",
        message: `Your task ${
          taskData[`phase${phaseNo}`][taskId].title
        } of phase ${phaseNo} is completed`,
      });

      announceHand(team._id);
      res.success(200, "Task status updated successfully", { team });
    }
  })
);

// for giving answer of the phase (only possible after completing all the major tasks of the event)
router.post(
  // add completedAll for minor tasks completion before submitting answer
  "/:teamId/:phaseNo/",
  // checkAuth("admin"),
  isEventActive,
  safeHandler(async (req, res) => {
    let { teamId, phaseNo } = req.params;
    let { answer } = req.body;
    answer = answer.trim();
    if (!isValidObjectId(teamId)) {
      throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
    }

    if (/^-?\d+$/.test(phaseNo.trim())) {
      phaseNo = parseInt(phaseNo.trim(), 10);
    } else {
      throw new ApiError(400, "Invalid phase number", "INVALID_PHASE_NUMBER");
    }

    if (
      answer === undefined ||
      answer === null ||
      answer.trim() === "" ||
      typeof answer !== "string"
    ) {
      throw new ApiError(400, "Invalid answer", "INVALID_ANSWER");
    }

    if (phaseNo < 1 || phaseNo > 3) {
      throw new ApiError(
        400,
        "Invalid phase number.\nCan only be 1,2,3",
        "INVALID_PHASE_NUMBER"
      );
    }

    const team = await Team.findById(teamId);
    if (!team) {
      throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
    }

    if (team.state === "idle") {
      throw new ApiError(
        400,
        "No phase currently assigned to team",
        "TEAM_IDLE"
      );
    }

    if (team.currentPhase === -1) {
      throw new ApiError(400, "Canard not started yet", "GAME_NOT_STARTED");
    }

    if (team.currentPhase !== phaseNo) {
      throw new ApiError(
        400,
        "Invalid phase number.\nCurrent phase is different",
        "INVALID_PHASE_NUMBER"
      );
    }

    const phase = team[`phase${phaseNo}`];

    if (!phase) {
      throw new ApiError(404, "Phase not found", "PHASE_NOT_FOUND");
    }

    if (phase.status === "completed" || phase.status === "completedAll") {
      throw new ApiError(
        400,
        "Phase has already been completed",
        "PHASE_COMPLETED"
      );
    }

    if (
      !Array.from(phase.tasks.values()).every((task) =>
        task.type === "major" ? task.status === "completed" : true
      )
    ) {
      throw new ApiError(
        400,
        "All the major tasks of the phase have not been completed yet",
        "TASKS_NOT_COMPLETED"
      );
    }

    if (
      answer.toLowerCase() !== taskData[`phase${phaseNo}`].answer.toLowerCase()
    ) {
      throw new ApiError(400, "Invalid answer", "INVALID_ANSWER");
    }

    phase.status = "completed";

    // if the minor tasks have been completed as well
    if (
      Array.from(phase.tasks.values()).every(
        (task) => task.status === "completed"
      )
    ) {
      phase.status = "completedAll";
    }

    team.completedPhases = team.completedPhases + 1;

    // phase completed now obviously
    phase.completedAt = getIstDate();

    const settings = await Settings.findOne();

    // time taken is the time between now and the start of the phase
    phase.timeTaken =
      getIstDate() -
      settings.phaseValue[team.phaseOrder.indexOf(phaseNo) + 1].startTime;

    // if all phases have been completed
    if (team.completedPhases === 3) {
      // completed now obviously
      team.completedAt = getIstDate();

      team.totalTimeTaken =
        team.phase1.timeTaken + team.phase2.timeTaken + team.phase3.timeTaken;
    }

    team[`phase${phaseNo}`] = phase;

    await team.save();

    res.success(200, "Answer submitted successfully", { phase });

    announceSingle(team._id, {
      type: "completion",
      message: `Your phase ${phaseNo} is completed`,
    });
  })
);

export default router;

function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}
