import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import { safeHandler } from "../middlewares/safeHandler.js";
import Hand from "../models/hand.model.js";
import createLeftRightHand from "../utils/scripts/createLeftRightHand.js";

const router = express.Router();

router
  .route("/")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const hands = await Hand.find();
      if (!hands || hands.length === 0) {
        throw new ApiError(404, "No hands were found", "NO_HANDS_FOUND");
      }
      const leftHand = hands.find((hand) => hand.type === "left");
      const rightHand = hands.find((hand) => hand.type === "right");

      return res.success(200, "Hands successfully fetched", {
        leftHandHealth: leftHand?.health,
        rightHandHealth: rightHand?.health,
      });
    })
  )

  .post(
    // something left I think in this route?
    // just in case
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      await createLeftRightHand();
      return res.success(201, "Hand successfully created", newHand);
    })
  );

router
  .route("/:type")
  .get(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { type } = req.params;
      if (type !== "left" && type !== "right") {
        throw new ApiError(400, "Invalid hand type", "INVALID_HAND_TYPE");
      }
      const hand = await Hand.findOne({ type });
      if (!hand) {
        throw new ApiError(404, "Hand not found", "HAND_NOT_FOUND");
      }
      return res.success(200, "Hand successfully fetched", hand);
    })
  )

  .post(
    checkAuth("admin"),
    safeHandler(async (req, res) => {
      const { type } = req.params;
      const { health } = req.body;
      if (type !== "left" && type !== "right") {
        throw new ApiError(400, "Invalid hand type", "INVALID_HAND_TYPE");
      }
      const hand = await Hand.findOneAndUpdate(
        { type },
        { $inc: { health: -health } },
        { new: true }
      );
      return res.success(200, "Hand health successfully updated", hand);
    })
  );


export default router;