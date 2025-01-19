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
import announceCompletion from "../utils/Announcement.js";
import announceSingle from "../utils/Announcement.js";

const router = express.Router();

router
  .route("/")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const teams = await Team.find();
      if (!teams || teams.length === 0) {
        throw new ApiError(404, "No team was found", "NO_TEAMS_FOUND");
      }

      return res.success(200, "All teams successfully fetched", { teams });
    })
  )

  .post(
    isRegistrationActive, // check if registration is active
    safeHandler(async (req, res) => {
      const { name } = teamRegistrationSchema.parse(req.body);
      const teamExists = await Team.findOne({ name });
      if (teamExists) {
        throw new ApiError(
          400,
          "Team with this name already exists",
          "TEAM_EXISTS"
        );
      }

      const team = new Team({ name });
      Object.keys(taskData).forEach((phase) => {
        Object.keys(taskData[phase]).forEach((task) => {
          team[phase].tasks.set(task, {
            status: "notStarted",
            completedAt: null,
            timeTaken: -1,
            type: taskData[phase][task].type,
          });
        });
      });

      await team.save();

      return res.success(201, "Team created successfully", {
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
      return res.success(200, "All teams successfully deleted", { teams });
    })
  );

router
  .route("/:teamId")
  .get(
    checkAuth("user"),
    safeHandler(async (req, res) => {
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
      const team = await Team.findById(teamId).populate({
        path: "members",
        select: "-password",
      });
      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }

      return res.success(200, "Team successfully fetched", { team });
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

      return res.success(200, "Team updated successfully", {
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

      return res.success(200, "Team deleted successfully", { team });
    })
  );

// for completing major tasks of the phase
router.route("/:teamId/:phaseNo/:taskId").post(
  // take a completed parameter too as there are multiple options in the schema
  checkAuth("admin"),
  isEventActive, // check if event is active
  safeHandler(async (req, res) => {
    let { teamId, phaseNo, taskId } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(teamId)) {
      throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
    }

    if (/^-?\d+$/.test(phaseNo.trim()) && /^-?\d+$/.test(taskId.trim())) {
      phaseNo = parseInt(phaseNo.trim(), 10);
      taskId = parseInt(taskId.trim(), 10);
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

    const taskType = taskData[`phase${phaseNo}`][taskId]?.type;

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
      if (phase.currentTask !== taskId) {
        throw new ApiError(
          400,
          "Invalid task id.\nCurrent task is different",
          "INVALID_TASK_ID"
        );
      }

      // READ FROM HERE //huh.. AGAIN!

      if (status === "completed") {
        // increases the number of completed tasks in a phase by 1
        phase.completedTasks = phase.completedTasks + 1;

        // sets the status of the task to completed
        phase.tasks[taskId].status = "completed";

        // decrease the health of the hands equally by the number of points assigned to those tasks
        Hand.updateMany(
          {},
          { $inc: { health: -taskData[`phase${phaseNo}`][taskId].points } }
        );

        // if its the first task of the phase
        if (phase.completedTasks === 1) {
          // completed now obviously
          phase.tasks[taskId].completedAt = new Date();

          // time taken is the time between now and the start of the phase as this is the first task of the phase
          phase.tasks[taskId].timeTaken =
            Date.now() -
            config.phaseStartTime[team.phaseOrder.indexOf(phaseNo) + 1];

          // set the current task to be the next task in the task order
          phase.currentTask = phase.taskOrder[phase.completedTasks];
        }

        // if all tasks in the phase have been completed
        else if (phase.completedTasks === phase.taskOrder.length) {
          // phase is completed as all the tasks have been completed
          phase.status = "completed";

          phase.currentTask = -1;

          // set the current phase to be inactive
          team.currentPhase = -1;

          // completed now obviously
          phase.tasks[taskId].completedAt = new Date();

          // time taken is the time between now and the last task of the phase
          phase.tasks[taskId].timeTaken =
            Date.now() -
            phase.tasks[phase.taskOrder[phase.completedTasks - 2]].completedAt;

          // phase completed now obviously
          phase.completedAt = new Date();

          // time taken is the time between now and the start of the phase
          phase.timeTaken =
            Date.now() -
            config.phaseStartTime[team.phaseOrder.indexOf(phaseNo) + 1];

          // increase the number of completed phases in the team by 1
          team.completedPhases = team.completedPhases + 1;

          // if all phases have been completed
          if (team.completedPhases === 3) {
            // completed now obviously
            team.completedAt = new Date();

            // team has completed the game as all the phases have been completed
            team.state = "completed";

            // time taken is the time between now and the start of the game
            team.totalTimeTaken =
              team.phase1.timeTaken +
              team.phase2.timeTaken +
              team.phase3.timeTaken;

            // announcement
            announceSingle(
              teamId,
              "Congratulations! You have completed all the three phases and today's game!"
            );
          }

          // if all phases have not been completed
          else {
            // set the current team state to be inactive
            team.state = "idle";

            //announcement
            announceSingle(
              teamId,
              `Congratulations! You have completed Phase ${phaseNo}!`
            );
          }
        }

        // if its not the first or the last task of the phase
        else {
          // completed now obviously
          phase.tasks[taskId].completedAt = new Date();

          // time taken is the time between now and the last task of the phase
          phase.tasks[taskId].timeTaken =
            Date.now() - phase.tasks[taskId - 1].completedAt;

          // set the current task to be the next task in the task order
          phase.currentTask = phase.taskOrder[phase.completedTasks];
        }
      }

      // if the status is something other than 'completed'
      else {
        phase.tasks[taskId].status = status;
      }
    }

    // MINOR TASK STARTS HERE
    // MINOR TASK STARTS HERE
    // MINOR TASK STARTS HERE
    // MINOR TASK STARTS HERE

    // I wouldn't have created seperate if conditions for minor tasks and instead integrated this into the above logic but I was told about minor tasks too late so I don't want to mess with the above logic as there is very little time left and the code above is already too complicated
    else if (taskType === "minor") {
      const minorTaskId = taskId;

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

      // if (team.state === "completed") {
      //   throw new ApiError(
      //     400,
      //     "Team has already completed the three phases",
      //     "COMPLETED"
      //   );
      // }

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

      if (status === "completed") {
        phase.tasks[minorTaskId].status = "completed";
        phase.tasks[minorTaskId].completedAt = new Date();
        phase.tasks[minorTaskId].timeTaken = -2;
      }

      if (
        phase.status === "completed" &&
        Object.values(phase.tasks).every((task) => task.status === "completed") //check if this works, not sure
      ) {
        phase.status = "completedAll";
        team.state = "idle";
        team.currentPhase = -1;
      }
    }
  })
);

// for giving answer of the phase (only possible after completing all the majot tasks of the event)
router.post(
  "/:teamId/:phaseNo/answer",
  checkAuth("admin"),
  isEventActive,
  safeHandler(async (req, res) => {
    const { teamId, phaseNo } = req.params;
    const { answer } = req.body;

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
      Object.values(phase.tasks).every((task) =>
        task.type === "major" ? task.status === "completed" : true
      )
    ) {
      throw new ApiError(
        400,
        "All the major tasks of the phase have not been completed yet",
        "TASKS_NOT_COMPLETED"
      );
    }

    if (phase.answer !== taskData[`phase${phaseNo}`].answer) {
      throw new ApiError(400, "Invalid answer", "INVALID_ANSWER");
    }

    phase.status = "completed";
    await phase.save();

    res.success(200, "Answer submitted successfully", { phase });
  })
);
