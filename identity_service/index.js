import { config } from "dotenv";
import { connect } from "./config/database.js";
import express from "express";
import createCredentialsHandler from "./handlers/create-credentials.js";
import exchangeCredentialsHandler from "./handlers/exchange-credentials.js";
import bearer from "./middleware/verify-bearer.js";
import RateLimit from "express-rate-limit";
import cors from "cors";

config();
connect();
const app = express();

const port = process.env.PORT || 4001;

app.listen(port, () => console.log(
    `server running on port ${port} in ${process.env.NODE_ENV} mode`
));

app.use(cors({
    credentials: true,
    origin: `${process.env.APP_URL}`
}));

// apply rate limiter to all requests
app.use(RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    message: 'You have exceeded the request limit, please try again later.'
}));

app.post("/create-credentials", createCredentialsHandler);
app.post("/exchange-credentials", exchangeCredentialsHandler);
app.get("/check-authentication", bearer, (request, response) => response.send("`You're authenticated!"));
