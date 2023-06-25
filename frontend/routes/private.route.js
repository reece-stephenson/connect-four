import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateRouter = Router();

privateRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/menuScreen.html'));
});

privateRouter.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/gameScreen.html'));
});

export default privateRouter;
