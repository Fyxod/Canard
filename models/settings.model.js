import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    phasesCompleted: {
      type: Number,
      default: 0,
    },
    registrationsActive: {
      type: Boolean,
      default: false,
    },
    eventStatus: {
      type: String,
      enum: ["upcoming", "active", "closed"],
      default: "upcoming",
    },
    currentPhaseValue: {
      type: Number,
      default: -1,
    },
    phaseValueStatus: {
      1: {
        type: String,
        enum: ["completed", "inProgress", "notStarted"],
        default: "notStarted",
      },
      2: {
        type: String,
        enum: ["completed", "inProgress", "notStarted"],
        default: "notStarted",
      },
      3: {
        type: String,
        enum: ["completed", "inProgress", "notStarted"],
        default: "notStarted",
      },
    },
    announcements: {
      type: [
        {
          message: {
            type: String,
            required: true,
          },
          time: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: () => [],
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
