import express from "express";
import checkAuth from "../middlewares/authMiddleware";
import { safeHandler } from "../middlewares/safeHandler";
import Team from "../models/Team";
import ApiError from "../utils/errorClass";
import User from "../models/user";
import { teamRegistrationSchema } from "../utils/zodSchemas";

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

// router.route("/:teamId/phase/:phaseId").patch(
//   checkAuth("admin"),
//   safeHandler(async (req, res) => {
//     const { tasks, score, timeTaken } = req.body;
//     const team = await Team.findById(req.params.teamId);
//     if (!team) {
//       throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
//     }

//     const phase = team[`phase${req.params.phaseId}`];
//     if (!phase) {
//       throw new ApiError(404, "Phase not found", "PHASE_NOT_FOUND");
//     }

//     const updatedPhase = await Team.findByIdAndUpdate(
//       req.params.teamId,
//       {
//         [`phase${req.params.phaseId}`]: { tasks, score, timeTaken },
//       },
//       { new: true }
//     );

//     return res.success(200, "Phase updated successfully", { updatedPhase });
//   })
// );

router.route('/:teamId/:phaseNo/:taskId') // also decrease left and right hand health
.post(
  checkAuth('admin'),
  safeHandler(async (req, res) => {
    let { teamId, phaseNo, taskId } = req.params;

    if (/^-?\d+$/.test(phaseNo.trim()) && /^-?\d+$/.test(taskId.trim())) {
      phaseNo = parseInt(phaseNo.trim(), 10);
      taskId = parseInt(taskId.trim(), 10);
  } else {
      throw new ApiError(400, 'Invalid phase number or task id', 'INVALID_PHASE_NUMBER_OR_TASK_ID');
  }
  
    const { completed } = req.body;

    if (!isValidObjectId(teamId)) {
      throw new ApiError(400, 'Invalid team id', 'INVALID_TEAM_ID');
    }
    if (phaseNo < 1 || phaseNo  > 3) {
      throw new ApiError(400, 'Invalid phase number.\nCan only be 1,2,3', 'INVALID_PHASE_NUMBER');
    }
    if(taskId.toString().length !== 3 || parseInt(taskId.toString()[0]) !== phaseNo) {
      throw new ApiError(400, 'Invalid task id', 'INVALID_TASK_ID');
    }
    if([true, false, "true", "false"].indexOf(completed) === -1) { // wish I was using ts but don't have the time right now
      throw new ApiError(400, 'Invalid completed value', 'INVALID_COMPLETED_VALUE');
    }
    const team = await Team.findById(teamId);
    if (!team) {
      throw new ApiError(404, 'Team not found', 'TEAM_NOT_FOUND');
    }
    if(team.state === 'completed') {
      throw new ApiError(400, 'Team has already completed the three phases', 'COMPLETED');
    }
    if(team.state === 'blocked') {
      throw new ApiError(400, 'Team is blocked', 'TEAM_BLOCKED');
    }
    if(team.state === 'idle') {
      throw new ApiError(400, 'No phase currently assigned to team', 'TEAM_IDLE');
    }
    
    if(team.currentPhase !== phaseNo) {
      throw new ApiError(400, 'Invalid phase number.\nCurrent phase is different', 'INVALID_PHASE_NUMBER');
    }
    const phase = team[`phase${phaseNo}`];
    if (!phase) {
      throw new ApiError(404, 'Phase not found', 'PHASE_NOT_FOUND');
    }
    if(phase.tasks.length === 0) {
      phase
    }
    const taskIndex = phase.tasks.findIndex(task => task.taskId === taskId);
