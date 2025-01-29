import connectMongo from "../config/db.js";
import Game from "../models/game.model.js";
import User from "../models/user.model.js";

async function test(){
    await connectMongo();
    for(let i=0; i<80; i++){
        const game = await Game.findOne();
        await Game.deleteOne({ _id: game._id });
        console.log(i, "deleted");
    }
}

// test();