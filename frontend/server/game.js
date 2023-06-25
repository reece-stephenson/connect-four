import Game from "../model/game.js";

export const liveGames = new Map();

function Player(ws, username, email, isHost) {
  this.ws = ws;
  this.username = username;
  this.email = email;
  this.isHost = isHost;
}

async function codeInUse(joinCode) {
  const existingGame = await Game.findOne({ gameCode: joinCode, isLive:false});
  if (existingGame) {
    return false;
  }
  return true;
}

export async function createGame(startingPlayerWS, gameOptions,username,email) {
  let joinCode;
  do {
    let getRandomCode = () => Math.random().toString(36).slice(2, 3).toUpperCase();
    joinCode = getRandomCode();

  } while (!(await codeInUse(joinCode)))

  let game = {
    gameCode: joinCode,
    players: [new Player(startingPlayerWS, username, email, true)],
    started: false,
  };
  liveGames.set(joinCode, game);

  startingPlayerWS.send(JSON.stringify({
    requestType: "GAME CODE",
    joinCode: joinCode
  }));

  // startingPlayer.on("close", doSomething(joinCode));
}

export async function joinGame(socket, gameOptions,username,email) {

  let joinCode = gameOptions['joinCode'];
  const game = liveGames.get(joinCode);

  if (game === undefined) { //Incorrect joinCode
    socket.send(JSON.stringify({
      requestType: "JOIN",
      success: false,
      message: "Game does not exist."
    }))
  } else if (game.players.length >= 2) { //But game is full
    socket.send(JSON.stringify({
      requestType: "JOIN",
      success: false,
      message: "Game already full"
    }));
  }else if(game.players[0].email == email){
    socket.send(JSON.stringify({
      requestType: "JOIN",
      success: false,
      message: "Cannot Join Your Own Game"
    }));
  }
  else {//Success
    game.players.push(new Player(socket, username, email, false));
    for (const player of game.players) {
      player.ws.send(JSON.stringify({
        requestType: "JOIN",
        success: true,
        message: `Successfully Joined Game with player: ${email}`,
        player1: game.players[0].username,
        player2: game.players[1].username
      }));
    }

    await Game.create({
      gameCode: joinCode,
      redPlayer: game.players[0].username,
      yellowPlayer: game.players[1].username,
      timeStarted: Date.now(),
      isLive: true
    });

    game.started = true;
    console.log(game);
  }
}
