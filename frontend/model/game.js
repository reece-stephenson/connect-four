import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    score: { type: Number },
});

export default mongoose.model("game", gameSchema);