import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicRouter = Router();

publicRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/welcomeScreen.html'));
});

publicRouter.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/registerScreen.html'));
});

export default publicRouter;
