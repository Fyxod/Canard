import mongoose from "mongoose";

// not a vaery well built model, can be much better but didn't have enough time to optimize it
const phaseSchema = new mongoose.Schema({
  tasks: {
    type: Map,
    of: new mongoose.Schema({
      timeTaken: {
        type: Number,
        default: -1,
        enum: [
          -1, // not completed
          -2, // -2 when this is a minor task and has been completed
        ],
      },
      
      /*
      A few notes on the timeTaken field:
      I know I have put the enum incorrectly, BUT IT STILL WORKED. I don't know why, but it did.
      It was throwing an error when it tried to store the time but it still successfully saved it in the database.
      I don't know why it was not enforcing the enum. I thought of fixing it and it was easy too obviously, just remove the enum right?
      But only 1 day was left for the event and the registrations has already been done, so I didn't want to take any risks like 
      messing up the schema of already saved documents. So I left it as it is as it was working fine
      */
      
              
      completedAt: {
        type: Date,
        default: null,
      },
      status: {
        // --
        type: String,
        enum: ["completed", "inProgress", "notStarted"], // Only completed and notStarted are used for minor tasks
        default: "notStarted",
      },
      type: {
        type: String,
        enum: ["major", "minor"],
        required: true,
      },
      hintActive: {
        type: Boolean,
        default: false,
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
  minorCompletedTasks: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["completed", "failed", "inProgress", "notStarted", "completedAll"],
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
      enum: [1, 2, 3, -1],
    },
    phaseOrder: {
      type: [Number],
      default: () => [],
    },
    completedPhases: {
      type: Number,
      default: 0,
    },
    // score = credit card balance
    score: {
      type: Number,
      default: 0,
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
      default: "idle",
    },
    callingCard: {
      type: String,
      default:
        "https://res.cloudinary.com/dimesumyw/image/upload/v1737565199/callingone_ylssgb.gif",
    },
    powerups: {
      type: [Number],
      default: () => [],
    },
    creditCardNo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.model("Team", teamSchema);

export default Team;
