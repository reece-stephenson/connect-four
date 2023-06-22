import { config } from "dotenv";
import { connect } from "./config/database.js";
import express from "express";
import createCredentialsHandler from "./handlers/create-credentials.js";
import exchangeCredentialsHandler from "./handlers/exchange-credentials.js";
import bearer from "./middleware/verify-bearer.js";
import RateLimit from "express-rate-limit";

config();
connect();
const app = express();

const port = process.env.PORT || 4001;

app.listen(port, () => console.log(`Listening on port ${port}`));


// set up rate limiter
var limiter = RateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20
});

// apply rate limiter to all requests
app.use(limiter);

app.post("/create-credentials", createCredentialsHandler);
app.post("/exchange-credentials", exchangeCredentialsHandler);
app.get("/check-authentication", bearer, (request, response) => response.send("`You're authenticated!"));
