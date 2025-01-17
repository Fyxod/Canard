import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema({
  tasks: {
    type: [
      {
        taskId: {
          type: Number,
          required: true,
        },
        completed: {
          type: Boolean,
          required: true,
          default: false,
        },
        timeTaken: {
          type: Number,
          required: true,
        },
        completedAt: {
          type: Date,
          required: true,
        },
      },
    ],
    default: () => [],
  },
  score: {
    type: Number,
    default: -1,
  },
  timeTaken: {
    type: Number,
    default: -1,
  },
  taskOrder: {
    type: [Number],
    default: () => [],
  },
  status: {
    type: String,
    enum: ["completed","failed","inProgress", "notStarted"],
  },
});

const teamSchema = new mongoose.Schema({
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
  totalScore: {
    type: Number,
    default: -1,
  },
  totalTimeTaken: {
    type: Number,
    default: -1,
  },
  state: {
    type: String,
    enum: ["busy", "idle", "completed", "blocked"],
  },
});

const Team = mongoose.model("Team", teamSchema);

export default Team;
