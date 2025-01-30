// import mongoose from "mongoose";
// import connectMongo from "../config/db.js";
// import Game from "../models/game.model.js";

// async function changeTitle(){
//     await connectMongo();
//     const games = await Game.find();
// let i = 0;
//     for(let game of games){
//         game.shootWithAGun.title = "Nerf Showdown";
//         game.gtaSanAndreas.title = "GTA V";
//         await game.save();
//         console.log(++i)
//     }
//     mongoose.connection.close();
// }

// // changeTitle();