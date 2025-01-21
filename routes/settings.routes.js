import express from "express";
import { safeHandler } from "../middlewares/safeHandler.js";
import ApiError from "../utils/errorClass.js";
import Settings from "../models/settings.model.js";
import checkAuth from "../middlewares/authMiddleware.js";
import onBoard from "../utils/scripts/onBoard.js";
import offBoard from "../utils/scripts/offBoard.js";

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
      let { phaseValue, active } = req.body;
      active = parseBoolean(active);

      // checking for missing data
      if (phaseValue === undefined || active === undefined) {
        throw new ApiError(400, "Missing data", "MISSING_DATA");
      }
      if (
        ![1, 2, 3, "1", "2", "3"].includes(phaseValue) ||
        typeof active !== "boolean"
      ) {
        throw new ApiError(400, "Invalid data", "INVALID_DATA");
      }
      phaseValue = parseInt(phaseValue);
      const settings = await Settings.findOne();

      // checking if event is already over
      if (settings.eventStatus === "closed") {
        throw new ApiError(400, "Event is closed", "EVENT_CLOSED");
      }

      // checking if the phase is being tried to set to active and no phase is currently in motion
      if (active === true && settings.currentPhaseValue === -1) {
        // checking if the phaseValue is 1 and the event is upcoming, if true, then starting the event and onboarding the teams
        console.log("in here 1");
        if (phaseValue === 1) {
          if (settings.eventStatus === "upcoming") {
            console.log("in here 2");
            settings.eventStatus = "active";
            settings.currentPhaseValue = phaseValue;
            settings.phaseValueStatus[phaseValue] = "inProgress";
          }
          //phasevalue can be 1 and be tried to set to true only if the event is "upcoming"
          else {
            console.log("in here 3");
            throw new ApiError(400, "Invalid data", "INVALID_DATA");
          }
        }

        // if the phaseValue is something other than 1 (2,3) and be tried to activated
        else if (
          settings.eventStatus === "active" &&
          settings.phasesCompleted === phaseValue - 1
        ) {
          console.log("in here 4");

          settings.phaseValueStatus[phaseValue] = "inProgress";
          settings.currentPhaseValue = phaseValue;
        } else {
          console.log("in here 5");
          throw new ApiError(400, "Invalid data", "INVALID_DATA");
        }
        console.log("in here 6");
        await settings.save();
        onBoard(phaseValue); // onboarding command -- to be completed
      }

      // checking if the phase is being tried to set to inactive and the phase currently in motion is the same as the phaseValue provided in the request
      else if (
        settings.eventStatus === "active" &&
        active === false &&
        settings.currentPhaseValue === phaseValue
      ) {
        console.log("in here 7");
        if (settings.phaseValueStatus[phaseValue] !== "inProgress") {
          console.log("in here 8");
          throw new ApiError(400, "Invalid data", "INVALID_DATA");
        }
        settings.phaseValueStatus[phaseValue] = "completed";
        settings.currentPhaseValue = -1;
        settings.phasesCompleted = phaseValue;
        if (phaseValue === 3) {
          console.log("in here 9");
          settings.eventStatus = "closed";
        }
        await settings.save();
        offBoard(phaseValue); // announce in this only
      } else {
        console.log("in here 10");
        throw new ApiError(400, "Invalid data", "INVALID_DATA");
      }
      console.log("in here 11");
      res.success(200, "Settings updated successfully", {
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
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}
