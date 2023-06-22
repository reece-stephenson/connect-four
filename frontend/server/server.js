import { WebSocketServer } from "ws";
import { createGame, joinGame, startGame, clientAnswer, nextRound } from "./game.js";
import http from "http";
import { config } from "dotenv";
import app from "../app.js";

config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(
    `server running on http://localhost:${PORT}/auth/login in ${process.env.NODE_ENV} mode`
  );
});

const wss = new WebSocketServer({ server: server });

/**
 * 
 * @param {String} msg 
 * @param {Websocket} ws 
 * 
 * *
 * See MessagingFormat.md for a breakdown of messaging types
 */
function parseMessage(msg, ws) {
  switch (msg['requestType']) {
    case "CREATE":
      createGame(ws, msg);
      break;
    case "JOIN":
      joinGame(ws, msg);
      break;
    case "ANSWER":
      clientAnswer(ws, msg);
      break;
    case "START":
      startGame(msg['joinCode']);
      break;
    case "NEXT ROUND":
      nextRound(msg['joinCode'])
    default:
      return;
  }

}

wss.on("connection", (ws) => {
  ws.on("message", (msg) => parseMessage(JSON.parse(msg), ws));
});