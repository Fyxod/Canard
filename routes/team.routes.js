import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { safeHandler } from "../middlewares/safeHandler.js";
import Team from "../models/team.model.js";
import ApiError from "../utils/errorClass.js";
import User from "../models/user.model.js";
import { teamRegistrationSchema } from "../utils/zodSchemas.js";
import config from "../config/config.js";
import taskData from "../data/taskData.js";

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

      const team = await Team.create({ name });
      return res.success(201, "Team created successfully", {
        teamName: team.name,
        teamId: team._id,
      });
    })
  )

  .delete(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const teams = await Team.find().select("-password");
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
      if (req.user.role === "user" && req.user.teamId.toString() !== teamId) {
        throw new ApiError(
          403,
          "You are not allowed to view this team",
          "FORBIDDEN"
        );
      }
      const team = await Team.findById(teamId);
      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }

      return res.success(200, "Team successfully fetched", { team });
    })
  )

  .patch(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { name } = teamRegistrationSchema.parse(req.body);
      const team = await Team.findByIdAndUpdate(
        req.params.teamId,
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

router
  .route("/:teamId/:phaseNo/:taskId") // also decrease left and right hand health
  .post(
    // take a completed parameter too as there are multiple options in the schema
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      let { teamId, phaseNo, taskId, status } = req.params;

      if (["completed", "inProgress", "notStarted"].indexOf(status) === -1) {
        throw new ApiError(400, "Invalid status", "INVALID_STATUS");
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

      const { completed } = req.body;

      if (!isValidObjectId(teamId)) {
        throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
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
      if ([true, false, "true", "false"].indexOf(completed) === -1) {
        // wish I was using ts but don't have the time right now
        throw new ApiError(
          400,
          "Invalid completed value",
          "INVALID_COMPLETED_VALUE"
        );
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
        }

        // if all tasks in the phase have been completed
        else if (phase.completedTasks === phase.taskOrder.length) {
          // completed now obviously
          phase.tasks[taskId].completedAt = new Date();

          // time taken is the time between now and the last task of the phase
          phase.tasks[taskId].timeTaken =
            Date.now() - phase.tasks[taskId - 1].completedAt;

          // phase is completed as all the tasks have been completed
          phase.status = "completed";

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

            // time taken is the time between now and the start of the game
            team.totalTimeTaken =
              team.phase1.timeTaken +
              team.phase2.timeTaken +
              team.phase3.timeTaken;

            // team has completed the game as all the phases have been completed
            team.state = "completed";
          }

          // if all phases have not been completed
          else {
            // set the current team state to be inactive
            team.state = "idle";
          }

          // set the current phase to be inactive
          team.currentPhase = -1;
        }

        // if its not the first or the last task of the phase
        else {
          // completed now obviously
          phase.tasks[taskId].completedAt = new Date();

          // time taken is the time between now and the last task of the phase
          phase.tasks[taskId].timeTaken =
            Date.now() - phase.tasks[taskId - 1].completedAt;
        }
      }

      // if the status is something other than 'completed'
      else {
        phase.tasks[taskId].status = status;
      }
    })
  );
