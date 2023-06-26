import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { config } from "dotenv";
import { connect } from "./database/database.js";
import publicRouter from "./routes/public.route.js";
import privateRouter from "./routes/private.route.js";
import RateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import bearer from "./middleware/verify-bearer.js";
import cors from "cors";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
connect();
const app = express();

app.use(cors({
    credentials: true,
    origin: '*'
}));

app.use(express.json());
app.use(cookieParser());

// apply rate limiter to all requests
app.use(RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50,
    message: 'You have exceeded the request limit, please try again later.'
}));

app.use('/welcome', express.static(__dirname + '/public'));
app.use('/welcome', publicRouter);

app.use('/', bearer, express.static(__dirname + '/private'));
app.use('/', bearer, privateRouter);

export default app;
