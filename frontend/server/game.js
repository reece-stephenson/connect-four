import Game from "../model/game.js";

export const liveGames = new Map();

function Player(ws, username, email, isHost) {
  this.ws = ws;
  this.username = username;
  this.email = email;
  this.isHost = isHost;
}

async function codeInUse(joinCode){
  const existingGame = await Game.findOne({ gameCode: joinCode });
  if (existingGame) {
      return false;
  }
  return true;
}

export async function createGame(startingPlayer, gameOptions) {
  let joinCode;
  do{
    let getRandomCode = () => Math.random().toString(36).slice(2, 3).toUpperCase();
    joinCode = getRandomCode();

  }while(!(await codeInUse(joinCode)))

  let user = gameOptions['player'];

  let game = {
    gameCode: joinCode,
    players: [new Player(startingPlayer, user, user, true)],
    started: false,
  };
  liveGames.set(joinCode, game);

  startingPlayer.send(JSON.stringify({
    requestType: "GAME CODE",
    joinCode: joinCode
  }));

  // startingPlayer.on("close", doSomething(joinCode));
}

export async function joinGame(socket, gameOptions) {
  let joinCode = gameOptions['joinCode'];
  let user = gameOptions['player'];
  const game = liveGames.get(joinCode);
  if (game === undefined) { //Incorrect joinCode
    socket.send(JSON.stringify({
      requestType: "JOIN",
      success: false,
      message: "Game does not exist."
    }))
  } else if(game.players.length >= 2){ //But game is full
    socket.send(JSON.stringify({
      requestType: "JOIN",
      message: "Game already full",
      success: false
    }));
  }
  else{//Success
    game.players.push(new Player(socket, user, user, false));
    for(const player of game.players){
      player.ws.send(JSON.stringify({
        requestType: "JOIN",
        success: true,
        message: `Successfully Joined Game with player: ${user['email']}`,
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