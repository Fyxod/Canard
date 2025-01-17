import Hand from "../../models/Hand";
import connectMongo from "../../config/db";

export default async function createLeftRightHand() {
  await connectMongo();
  const previousHands = await Hand.find({});
  if (!previousHands || previousHands.length === 0) {
    console.log("No hands found");
  } else {
    console.log("previousHands", previousHands);
  }

  await Hand.deleteMany({});
  const leftHand = await Hand.create({
    hand: "left",
  });
  const rightHand = await Hand.create({
    hand: "right",
  });
  console.log("Left and right hand created successfully");
  console.log(leftHand, rightHand);
}

createLeftRightHand();
