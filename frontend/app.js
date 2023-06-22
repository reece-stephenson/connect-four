import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { config } from "dotenv";
import publicRouter from "./routes/public.route.js";
import privateRouter from "./routes/private.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use('/', express.static(__dirname + '/public'));
app.use('/', publicRouter);
app.use('/game', privateRouter);



app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

