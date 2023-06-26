import { Router } from "express";
import path from "path";
import { fileURLToPath } from 'url';
import request from "request";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicRouter = Router();

publicRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/welcomeScreen.html'));
});

publicRouter.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/../views/registerScreen.html'));
});

publicRouter.post('/signup', (req, res) => {
    request.post(
        {
            url: process.env.ID_URL + '/create-credentials',
            json: req.body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            credentials: 'include'
        },
        function (error, response, body) {
            if (response.statusCode == 200) {
                res.status(response.statusCode).send(body);
            }
            else {
                res.status(response.statusCode).send(body);
            }
        });
});

publicRouter.post('/login', (req, res) => {
    request.post(
        {
            url: process.env.ID_URL + '/exchange-credentials',
            json: req.body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            credentials: 'include'
        },
        function (error, response, body) {
            if (response.statusCode == 200) {
                res.cookie('token', body.token);
                res.cookie('email', body.email);
                res.cookie('username', body.username);

                res.sendStatus(200);
            }
            else {
                res.status(response.statusCode).send(body);
            }
        });
});
export default publicRouter;
