import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: { type: String, default: null },
    password: { type: String },
    salt: {type: String},
    token: { type: String },
});

export default mongoose.model("user", userSchema);