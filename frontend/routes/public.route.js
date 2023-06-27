import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicRouter = Router();

publicRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../views/welcomeScreen.html"));
});

publicRouter.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname + "/../views/registerScreen.html"));
});

publicRouter.post("/signup", (req, res) => {
  fetch(process.env.ID_URL + "/create-credentials", {
    Method: "POST",
    body: req.body,
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    credentials: "include",
  }).then((error, response, body) => {
    if (response.statusCode == 200) {
      res.status(response.statusCode).send(body);
    } else {
      res.status(response.statusCode).send(body);
    }
  });
});

publicRouter.post("/login", (req, res) => {
  fetch(process.env.ID_URL + "/create-credentials", {
    Method: "POST",
    body: req.body,
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    credentials: "include",
  }).then((error, response, body) => {
    if (response.statusCode == 200) {
      let options = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      };
      res.cookie("token", body.token, options);
      res.cookie("email", body.email, options);
      res.cookie("username", body.username, options);

      res.sendStatus(200);
    } else {
      res.status(response.statusCode).send(body);
    }
  });
});
export default publicRouter;
