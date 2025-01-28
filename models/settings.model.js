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
    phaseValue: {
      1: {
        status: {
          type: String,
          enum: ["completed", "inProgress", "notStarted"],
          default: "notStarted",
        },
        startTime: {
          type: Date,
          default: null,
        },
        endTime: {
          type: Date,
          default: null,
        },
      },
      2: {
        status: {
          type: String,
          enum: ["completed", "inProgress", "notStarted"],
          default: "notStarted",
        },
        startTime: {
          type: Date,
          default: null,
        },
        endTime: {
          type: Date,
          default: null,
        },
      },
      3: {
        status: {
          type: String,
          enum: ["completed", "inProgress", "notStarted"],
          default: "notStarted",
        },
        startTime: {
          type: Date,
          default: null,
        },
        endTime: {
          type: Date,
          default: null,
        },
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
