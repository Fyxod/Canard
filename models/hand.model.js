import mongoose from "mongoose";

const handSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["left", "right"],
    },
    health: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const Hand = mongoose.model("Hand", handSchema);

export default Hand;
