import express from "express";
import { safeHandler } from "../middlewares/safeHandler.js";
import ApiError from "../utils/errorClass.js";
import Settings from "../models/settings.model.js";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const settings = await Settings.findOne();
      if (!settings) {
        throw new ApiError(404, "No settings were found", "NO_SETTINGS_FOUND");
      }
      return res.success(200, "Settings successfully fetched", { settings });
    })
  )

  // I know I should use cron jobs for the following but I want to have more control over the event
  .post(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { phaseValue, active } = req.body;
      if (phaseValue === undefined || active === undefined) {
        throw new ApiError(400, "Missing data", "MISSING_DATA");
      }
      if (
        typeof phaseValue !== "number" ||
        ![1, 2, 3].includes(phaseValue) ||
        typeof active !== "boolean"
      ) {
        throw new ApiError(400, "Invalid data", "INVALID_DATA");
      }
      const settings = await Settings.findOne();
      if (settings.eventStatus === "closed") {
        throw new ApiError(400, "Event is closed", "EVENT_CLOSED");
      }
      if (active === true && settings.currentPhaseValue === -1) {
        if (phaseValue === 1 && settings.eventStatus === "upcoming") {
          settings.eventStatus = "active";
        } else {
          throw new ApiError(400, "Invalid data", "INVALID_DATA");
        }
        if (settings.eventStatus === "active") {
          settings.phaseValueStatus[phaseValue] = "inProgress";
          settings.currentPhaseValue = phaseValue;
        }
      } else if (
        settings.eventStatus === "active" &&
        active === false &&
        settings.currentPhaseValue === phaseValue
      ) {
        settings.phaseValueStatus[phaseValue] = "completed";
        settings.currentPhaseValue = -1;
        settings.phasesCompleted = phaseValue;
      } else {
        throw new ApiError(400, "Invalid data", "INVALID_DATA");
      }

      await settings.save();
      return res.success(200, "Settings updated successfully", {
        settings,
      });
    })
  );

router.post(
  "/reg",
  checkAuth("admin"),
  safeHandler(async (req, res) => {
    let { active } = req.body;
    if (active === undefined) {
      throw new ApiError(400, "Missing data", "MISSING_DATA");
    }
    active = parseBoolean(active);
    if (typeof active !== "boolean") {
      throw new ApiError(400, "Invalid data", "INVALID_DATA");
    }
    const settings = await Settings.findOne();
    if (settings.eventStatus === "closed") {
      throw new ApiError(400, "Event is closed", "EVENT_CLOSED");
    }
    settings.registrationsActive = active;
    await settings.save();
    return res.success(200, "Settings updated successfully", {
      settings,
    });
  })
);

export default router;

function parseBoolean(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  }