import checkAuth from "../middlewares/authMiddleware.js";
import { safeHandler } from "../middlewares/safeHandler.js";
import Admin from "../models/admin.model.js";
import Team from "../models/team.model.js";
import bcrypt from "bcrypt";

import express from "express";
import { generateToken } from "../utils/jwtFuncs.js";
import User from "../models/user.model.js";

const router = express.Router();

router
  .route("/")
  .get(
    safeHandler(async (req, res) => {
      res.render("login", { error: null });
    })
  )

  .post(
    safeHandler(async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.render("login", {
          error: "Please provide username and password",
        });
      }
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.render("login", { error: "Invalid username or password" });
      }
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.render("login", { error: "Invalid username or password" });
      }
      const userToken = generateToken({ adminId: admin._id, role: admin.role });
      res.cookie("userToken", userToken, {
        httpOnly: true,
        sameSite: "strict",
      });

      res.redirect("/game/teams");
    })
  );

router
  .route("/teams")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const teams = await Team.find();
      if (!teams || teams.length === 0) {
        throw new ApiError(404, "No teams were found", "NO_TEAMS_FOUND");
      }

      res.render("teams", { teams });
    })
  )

  .post(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { teamName } = req.body;
      if (!teamName) {
        throw new ApiError(400, "Invalid team name", "INVALID_TEAM_NAME");
      }

      const team = await Team.findOne({ name: teamName });
      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }

      res.cookie("teamId", team._id, {
        // httpOnly: true,
        // sameSite: "strict",
      });
      res.cookie("teamName", team.name, {
        // httpOnly: true,
        // sameSite: "strict",
      });

      return res.redirect(`/game/users`);
    })
  );

router.route("/users").get(
  checkAuth("admin"),
  safeHandler(async (req, res) => {
    const teamId = req.cookies.teamId;
    const teamName = req.cookies.teamName;
    if (!teamId || !teamName) {
      throw new ApiError(400, "Team not found", "TEAM_NOT_FOUND");
    }

    const users = await User.find({ team: teamId }).select("-password");
    if (!users || users.length === 0) {
      throw new ApiError(404, "No user was found", "NO_USERS_FOUND");
    }

    res.render("users", { users, teamName });
  })
);

export default router;
