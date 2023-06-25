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

privateRouter.get('/userInfo', (req, res) => {
    let usernameVal = req.cookies.username;
    let emailVal = req.cookies.email;

    res.status(200).send({ username: usernameVal,
                           email: emailVal});

});

export default privateRouter;
