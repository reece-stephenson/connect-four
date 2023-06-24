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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
connect();
const app = express();

app.use(express.json());
app.use(cookieParser());

// apply rate limiter to all requests
app.use(RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20
}));

app.use('/', express.static(__dirname + '/private'));
app.use('/', express.static(__dirname + '/public'));
app.use('/', publicRouter);
app.use('/', bearer, privateRouter);

export default app;