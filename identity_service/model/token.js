import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    jwtKey: { type: String, unique: true },
    algorithm: { type: String },
    publicKey: { type: String },
    expireAt: { type: Date, default: Date.now }
});

tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("token", tokenSchema);