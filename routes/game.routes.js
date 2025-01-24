import checkAuth from "../middlewares/authMiddleware.js";
import { safeHandler } from "../middlewares/safeHandler.js";
import Admin from "../models/admin.model.js";
import Team from "../models/team.model.js";
import bcrypt from "bcrypt";
import ApiError from "../utils/errorClass.js";
import express from "express";
import { generateToken } from "../utils/jwtFuncs.js";
import User from "../models/user.model.js";
import Game from "../models/game.model.js";
import { gamesList, schemaKeys } from "../data/gamesData.js";

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
      const { teamId } = req.body;
      if (!teamId) {
        throw new ApiError(400, "Please provide teamId", "TEAM_ID_REQUIRED");
      }

      const team = await Team.findById(teamId);
      if (!team) {
        throw new ApiError(404, "Team not found", "TEAM_NOT_FOUND");
      }

      res.cookie("teamId", team._id);
      res.cookie("teamName", team.name);
      //   console.log(team.name);
      return res.redirect(`/game/users`);
    })
  );

router
  .route("/users")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      console.log(req.cookies);
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
  )
  .post(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { userId } = req.body;
      if (!userId) {
        throw new ApiError(400, "Please provide userId", "USER_ID_REQUIRED");
      }

      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new ApiError(404, "User not found", "USER_NOT_FOUND");
      }

      res.cookie("userId", user._id);
      res.cookie("username", user.username);

      return res.redirect(`/game/games`);
    })
  );

router.route("/games").get(
  checkAuth("admin"),
  safeHandler(async (req, res) => {
    const username = req.cookies.username;
    const teamName = req.cookies.teamName;

    res.render("games", { username: username, games: gamesList, teamName });
  })
)

.post(
  checkAuth("admin"),
  safeHandler(async (req, res) => {
    const { gameKey } = req.body;
    if (!gameKey) {
      throw new ApiError(400, "Please provide gameId", "GAME_ID_REQUIRED");
    }

    res.cookie("gameKey", gameKey);
    return res.redirect(`/game/stats`);
  })
);

router.route("/stats").get(
  checkAuth("admin"),
  safeHandler(async (req, res) => {
    const gameKey = req.cookies.gameKey;
    const username = req.cookies.username;
    const teamName = req.cookies.teamName;
    console.log("GAMEKEY",gameKey)
    const game = schemaKeys[gameKey];
    if (!game) {
      throw new ApiError(404, "Game not found", "GAME_NOT_FOUND");
    }

    res.render("stats", { game, username, teamName });
  })
);
export default router;
