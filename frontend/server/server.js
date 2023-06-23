import { WebSocketServer } from "ws";
import { createGame, joinGame } from "./game.js";
import { setupGame,clientMove,updateGameState } from "./serverGameLogic.js";
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

function parseMessage(msg, ws) {
  switch (msg['requestType']) {
    case "CREATE":
      createGame(ws, msg);
      break;
    case "JOIN":
      joinGame(ws, msg);
      break;
    case "SETUP":
      setupGame(ws, msg);
      break;
    case "MOVE":
      clientMove(ws, msg);
      break;
    case "STATE":
      updateGameState(ws, msg);
      break;
    default:
      return;
  }

}

wss.on("connection", (ws) => {
  ws.on("message", (msg) => parseMessage(JSON.parse(msg), ws));
});