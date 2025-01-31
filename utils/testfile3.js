// import connectMongo from "../config/db.js";
// import Team from "../models/team.model.js";

// async function sort() {
//   await connectMongo();
//   const teams = await Team.find({}, { name: 1, score: 1, _id: 0 }).sort({
//     score: -1,
//   });

//   console.log(teams);
//   mongoose.connection.close();
// }

// sort();
