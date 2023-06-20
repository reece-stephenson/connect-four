import mongoose from 'mongoose';

export const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to database");
    } catch (error) {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
    }
};