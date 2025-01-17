import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema({
  tasks: {
    type: Map,
    of: new mongoose.Schema({
      timeTaken: {
        type: Number,
        required: true,
      },
      completedAt: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["completed", "inProgress", "notStarted"],
        default: "notStarted",
      },
    }),
    default: () => new Map(),
  },
  timeTaken: {
    type: Number,
    default: -1,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  taskOrder: {
    type: [Number],
    default: () => [],
  },
  currentTask: {
    type: Number,
    default: -1,
  },
  completedTasks: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["completed", "failed", "inProgress", "notStarted"],
    default: "notStarted",
  },
});

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    phase1: { type: phaseSchema, default: () => ({}) },
    phase2: { type: phaseSchema, default: () => ({}) },
    phase3: { type: phaseSchema, default: () => ({}) },
    currentPhase: {
      type: Number,
      default: -1,
      enum: [1, 2, 3],
    },
    phaseOrder: {
      type: [Number],
      default: () => [],
    },
    completedPhases: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: -1,
    },
    totalTimeTaken: {
      type: Number,
      default: -1,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    state: {
      type: String,
      enum: ["busy", "idle", "completed", "blocked"],
    },
    callingCard: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
