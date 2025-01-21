import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { safeHandler } from "../middlewares/safeHandler.js";
import User from "../models/user.model.js";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../utils/zodSchemas.js";
import ApiError from "../utils/errorClass.js";
import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";
import Team from "../models/team.model.js";
import { generateToken } from "../utils/jwtFuncs.js";
import isRegistrationActive from "../middlewares/isRegistrationActive.js";

const router = express.Router();

router
  .route("/")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const users = await User.find().select("-password");
      if (!users || users.length === 0) {
        throw new ApiError(404, "No user was found", "NO_USERS_FOUND");
      }

      return res.success(200, "All users successfully fetched", { users });
    })
  )

  .post(
    isRegistrationActive,
    safeHandler(async (req, res) => {
      let fields = userRegistrationSchema.parse(req.body);
      // username, email, password, teamId
      if (!isValidObjectId(fields.teamId)) {
        throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
      }

      const userExists = await User.findOne({
        $or: [{ email: fields.email }, { username: fields.username }],
      });

      if (userExists) {
        throw new ApiError(
          400,
          "User with this email or username already exists",
          "USER_EXISTS"
        );
      }

      fields.password = await bcrypt.hash(fields.password, 10);
      fields.team = fields.teamId;
      delete fields.teamId;

      const user = await User.create({
        ...fields,
        role: "user",
      });

      const team = await Team.findById(fields.team);
      if (!team) {
        await User.findByIdAndDelete(user._id);
        throw new ApiError(
          500,
          "Team with this id not found",
          "INVALID_TEAM_ID"
        );
      }
      if (team.members.length >= 4) {
        await User.findByIdAndDelete(user._id);
        throw new ApiError(400, "Team is full", "TEAM_FULL");
      }

      //doing atomic operation instead of team.members.push(user._id) to avoid race conditions although it's not a big deal here and I probably shoudn't do this as it won't happen here but who the fuck cares
      await Team.findByIdAndUpdate(
        fields.team,
        {
          $push: { members: user._id },
        },
        { new: true }
      );

      return res.success(201, "User created successfully", {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        teamId: user.team,
      });
    })
  )

  .delete(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const users = await User.find().select("-password");

      if (!users || users.length === 0) {
        throw new ApiError(404, "No user was found", "NO_USERS_FOUND");
      }

      await User.deleteMany();
      return res.success(200, "All users successfully deleted", { users });
    })
  );

router
  .route("/:userId")
  .get(
    checkAuth("user"),
    safeHandler(async (req, res) => {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id", "INVALID_USER_ID");
      }
      if (req.user.role === "user" && req.user.id.toString() !== userId) {
        throw new ApiError(
          403,
          "You are not allowed to view this user",
          "FORBIDDEN"
        );
      }

      const user = await User.findById(userId).select("-password");
      if (!user) {
        throw new ApiError(404, "User not found", "USER_NOT_FOUND");
      }

      return res.success(200, "User successfully fetched", { user });
    })
  )

  .patch(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id", "INVALID_USER_ID");
      }

      const updates = userUpdateSchema.parse(req.body);

      const filteredUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value != null)
      );
      if (Object.keys(filteredUpdates).length === 0) {
        throw new ApiError(400, "No updates provided", "NO_UPDATES_PROVIDED");
      }

      //updating password
      if (filteredUpdates.password) {
        filteredUpdates.password = await bcrypt.hash(
          filteredUpdates.password,
          10
        );
      }
      //updating team
      if (filteredUpdates.teamId) {
        if (!isValidObjectId(filteredUpdates.teamId)) {
          throw new ApiError(400, "Invalid team id", "INVALID_TEAM_ID");
        }
        filteredUpdates.team = filteredUpdates.teamId;
        delete filteredUpdates.teamId;
        const team = await Team.findByIdAndUpdate(
          filteredUpdates.team,
          {
            $push: { members: userId },
          },
          { new: true }
        );

        if (!team) {
          throw new ApiError(
            500,
            "Team with this id not found",
            "INVALID_TEAM_ID"
          );
        }
      }

      //updating email
      if (filteredUpdates.email) {
        const userExists = await User.findOne({ email: filteredUpdates.email });
        if (userExists) {
          throw new ApiError(
            400,
            "User with this email already exists",
            "USER_EXISTS"
          );
        }
      }

      const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
        new: true,
      });

      const oldTeamId = user.team;

      if (!user) {
        throw new ApiError(404, "User not found", "USER_NOT_FOUND");
      }

      const newUser = await User.findByIdAndUpdate(userId, filteredUpdates, {
        new: true,
      });

      if (filteredUpdates.team) {
        await Team.findByIdAndUpdate(
          oldTeamId,
          {
            $pull: { members: userId },
          },
          { new: true }
        );
      }

      return res.success(200, "User updated successfully", {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        teamId: newUser.team,
      });
    })
  )

  .delete(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { userId } = req.params;
      if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id", "INVALID_USER_ID");
      }

      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new ApiError(404, "User not found", "USER_NOT_FOUND");
      }

      await Team.findByIdAndUpdate(
        user.team,
        {
          $pull: { members: userId },
        },
        { new: true }
      );

      return res.success(200, "User deleted successfully", {
        //putting these checks here because I had some error with findByIdAndDelete before
        userId: user._id || userId,
        username: user.username || "Unknown",
        email: user.email || "Unknown",
        role: user.role || "Unknown",
        teamId: user.team || "Unknown",
      });
    })
  );

router.post(
  "/login",
  safeHandler(async (req, res) => {
    const { username, password } = userLoginSchema.parse(req.body);
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND"); // usually I'll do "Invalid email or password" but since it's a society event, there are chances of things going wrong and I can't take the risk as it'll allow me to efficiently debug during the event if things break
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new ApiError(401, "Invalid password", "INVALID_PASSWORD"); // usually I'll do "Invalid email or password" but since it's a society event, there are chances of things going wrong and I can't take the risk as it'll allow me to efficiently debug during the event if things break
    }

    const userToken = generateToken({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      teamId: user.team,
    });
    res.cookie("userToken", userToken); // http true secure true all that
    return res.success(200, "Login successful", {
      userToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  })
);

export default router;
