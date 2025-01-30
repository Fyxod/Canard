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

router
  .route("/games")
  .get(
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
        throw new ApiError(400, "Please provide gameKey", "GAME_KEY_REQUIRED");
      }

      res.cookie("gameKey", gameKey);
      return res.redirect(`/game/stats`);
    })
  );

router
  .route("/stats")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const gameKey = req.cookies.gameKey;
      const username = req.cookies.username;
      const teamName = req.cookies.teamName;
      const teamId = req.cookies.teamId;
      const userId = req.cookies.userId;
      const user = await User.findById(userId).populate("gameStats").lean();
      const game = schemaKeys[gameKey];
      if (!game) {
        throw new ApiError(404, "Game not found", "GAME_NOT_FOUND");
      }
      res.render("statsList", {
        game,
        username,
        teamName,
        isChecked: user.gameStats[gameKey].creditsGiven,
      });
    })
  )

  .post(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { statKey } = req.body;
      if (!statKey) {
        throw new ApiError(400, "Please provide statKey", "STAT_KEy_REQUIRED");
      }

      res.cookie("statKey", statKey);
      return res.redirect(`/game/input`);
    })
  );

router
  .route("/input")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { error } = req.query;
      const statKey = req.cookies.statKey;
      const username = req.cookies.username;
      const teamName = req.cookies.teamName;
      const gameKey = req.cookies.gameKey;
      const game = schemaKeys[gameKey];

      const stat = game.stats.find((stat) => stat.key === statKey);
      res.cookie("replace", stat.replace || false);

      const user = await User.findById(req.cookies.userId)
        .populate("gameStats")
        .lean();
      if (!user) {
        throw new ApiError(404, "User not found", "USER_NOT_FOUND");
      }

      const gameStats = user.gameStats;
      const currentValue = gameStats[gameKey][statKey] || "not found";
      res.cookie("currentValue", currentValue);
      res.cookie("gameStatsId", gameStats._id);

      if (!stat) {
        throw new ApiError(404, "Stat not found", "STAT_NOT_FOUND");
      }

      res.render("input", {
        stat,
        username,
        teamName,
        game,
        replace: stat.replace || false,
        currentValue,
        error: error || null,
      });
    })
  )

  .post(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      let { value } = req.body;
      value = value.trim();
      console.log(typeof value);
      const gameKey = req.cookies.gameKey;
      const statKey = req.cookies.statKey;
      const replace = parseBoolean(req.cookies.replace);
      console.log(value);
      console.log(replace);
      const gameStats = await Game.findById(req.cookies.gameStatsId);
      if (!gameStats) {
        throw new ApiError(404, "Game stats not found", "GAME_STATS_NOT_FOUND");
      }

      const userFieldType = Game.schema.path(
        `${gameKey}.${statKey}.value`
      ).instance;
      console.log("printing type", userFieldType);
      if (userFieldType === "Number") {
        if (!/^[0-9-]+$/.test(value)) {
          return res.redirect("/game/input?error=Please enter a valid number");
        }
        value = parseInt(value);
      }

      if (replace) {
        gameStats[gameKey][statKey].value = value;
        console.log("hereeeeeeeeeeeeeee");
      } else {
        gameStats[gameKey][statKey].value =
          gameStats[gameKey][statKey].value + value;
      }

      if (statKey === "kills" || statKey === "deaths") {
        gameStats[gameKey][
          "kdRatio"
        ].value = `${gameStats[gameKey]["kills"].value} : ${gameStats[gameKey]["deaths"].value}`;
      }

      await gameStats.save();
      res.redirect("/game/input");
    })
  );

router.post(
  "/credits",
  checkAuth("admin"),
  safeHandler(async (req, res) => {
    let { value } = req.body;
    value = value.trim();
    value = parseBoolean(value);
    console.log(value);
    if (typeof value !== "boolean") {
      throw new ApiError(400, "Please provide a valid value", "INVALID_VALUE");
    }
    console.log(value);
    const userId = req.cookies.userId;
    const teamId = req.cookies.teamId;
    const gameKey = req.cookies.gameKey;
    const user = await User.findById(userId).populate("gameStats");
    const team = await Team.findById(teamId);
    let gameStats = user.gameStats;
    if (!user) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }
    if (gameStats[gameKey].creditsGiven === value) {
      return res.redirect("/game/stats");
    }
    gameStats[gameKey].creditsGiven = value;
    if (value) {
      team.score = team.score + schemaKeys[gameKey].credits;
    } else {
      team.score = team.score - schemaKeys[gameKey].credits;
    }
    await team.save();
    await gameStats.save();
    res.redirect("/game/stats");
  })
);

export default router;

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}
