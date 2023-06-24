import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    gameCode: { type: String, required: true, unique: true },
    redPlayer: { type: String, required: true },
    yellowPlayer: { type: String, required: true },
    timeStarted: { type: Date, required: true, default: Date.now },
    isLive:{type: Boolean, required:true, default: true},
    winner:{type: String, default: "None"}
});

export default mongoose.model("game", gameSchema);