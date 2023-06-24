import { WebSocketServer } from "ws";
import { createGame, joinGame } from "./game.js";
import { setupGame, clientMove, updateGameState } from "./serverGameLogic.js";
import JSONWebToken from "jsonwebtoken";
import http from "http";
import Token from "../model/token.js";
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

const wss = new WebSocketServer({
  verifyClient: async function (info, cb) {
    var token = info.req.headers.cookie;
    token = token.replace('token=', '')

    if (!token)
      cb(false, 401, 'Unauthorized')
    else {
      // Decode our token so we can 
      const decoded = JSONWebToken.decode(token, { complete: true });

      if (!decoded || !decoded.header.kid) {
        // No kid, no pass, we didn't generate this
        cb(false, 401, 'Unauthorized')
        return;
      }

      const verifiedToken = await Token.findOne({ jwtKey: decoded.header.kid });

      if (!verifiedToken) {
        // No token, no pass
        cb(false, 401, 'Unauthorized')
        return;
      }

      if (!(verifiedToken && verifiedToken.algorithm && verifiedToken.publicKey)) {
        // No key information to compare to
        cb(false, 401, 'Unauthorized')
        return;
      }

      const verified = await new Promise(
        resolve => JSONWebToken.verify(
          token,
          verifiedToken.publicKey,
          {
            algorithms: [
              // Only allow the one that was stored with the key 
              verifiedToken.algorithm
            ]
          },
          (error, verified) => resolve(error ? undefined : verified)
        )
      );
      if (!verified) {
        // Not valid 
        cb(false, 401, 'Unauthorized')
        return;
      }

      cb(true);
    }
  },
  server: server
});

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
  console.log("Client connected!");
  ws.on("message", (msg) => parseMessage(JSON.parse(msg), ws));
});