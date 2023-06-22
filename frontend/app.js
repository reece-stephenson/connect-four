import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { config } from "dotenv";
import { connect } from "./database/database.js";
import publicRouter from "./routes/public.route.js";
import privateRouter from "./routes/private.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
connect();
const app = express();

app.use('/', express.static(__dirname + '/private'));
app.use('/', publicRouter);
app.use('/', privateRouter);

export default app;