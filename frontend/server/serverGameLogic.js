import { liveGames } from "./game.js";

const numRows = 6;
const numCols = 7;
const gameArray = new Array(numRows).fill('e').map(() => new Array(numCols).fill('e'));

let turnToPlay;

export function setupGame(client, msg){
    turnToPlay = liveGames.get(msg['joinCode']).players[0].username;
}

export function clientMove(client, msg) {
    if(msg['player'] != turnToPlay)
    {
        client.send(JSON.stringify({
            requestType: "UPDATE",
            valid: false,
            msg: "Not your turn"
        }));
        return;
    }
    let movedPlayed = findFirstEmptyCell(msg['col']);
    let color;
    if(movedPlayed[0] == -1){
        client.send(JSON.stringify({
            requestType: "UPDATE",
            valid: false,
            msg: "Not a valid move"
        }));
        return;
    }else{
        const game = liveGames.get(msg['joinCode']);
        gameArray[movedPlayed[0]][movedPlayed[1]] = turnToPlay;

        if(turnToPlay == game.players[0].username){
            color = 'red';
            turnToPlay = game.players[1].username;
        }else{
            color = 'yellow';
            turnToPlay = game.players[0].username;
        }
        for(const player of game.players){
            player.ws.send(JSON.stringify({
                requestType: "UPDATE",
                valid: true,
                row: movedPlayed[0],
                col: movedPlayed[1],
                color: color
            }));
        }

        let winnerCheck = checkForWinner();

        if(winnerCheck == 'P1'){
            for(const player of game.players){
                player.ws.send(JSON.stringify({
                    requestType: "Game Over",
                    winner: game.players[0].username
                }));
            }
        }else if(winnerCheck == 'P2'){
            for(const player of game.players){
                player.ws.send(JSON.stringify({
                    requestType: "GAME OVER",
                    winner: game.players[1].username
                }));
            }
        }else if(winnerCheck == 'd'){
            for(const player of game.players){
                player.ws.send(JSON.stringify({
                    requestType: "GAME OVER",
                    winner: 'draw'
                }));
            }
        }

        let outText = "";
        for(let i = 0; i< numRows ; i++){
            for (let j = 0; j < numCols; j++) {
                outText+= gameArray[i][j]+' ';

            }
            outText = outText + "\n";
        }
        console.log(outText);
    }
}

function findFirstEmptyCell(col){
  let foundEmptySpot = false;
  let emptyRowIndex = 5;
  while(!foundEmptySpot){
      if(gameArray[emptyRowIndex][col] == 'e'){
          return [emptyRowIndex,col];
      }else if(emptyRowIndex == 0){
          return [-1,-1];
      }
      else{
          emptyRowIndex = emptyRowIndex - 1;
      }
  }
}

function checkForWinner(){
  let draw = true;
  let player;

  for(let r = 0; r < numRows; r++){
      for (let c = 0; c < numCols; c++) {
          player = gameArray[r][c];
          if (player == 'e'){
              draw = false;//We found an empty spot the game is not a draw yet
              continue; // don't check empty slots
          }

          if (c + 3 < numCols &&
              player == gameArray[r][c+1] && // look right
              player == gameArray[r][c+2] &&
              player == gameArray[r][c+3])
          {
              if(draw){
                  return 'd';
              }
              return player;
          }

          if (r + 3 < numRows) {
              if (player == gameArray[r+1][c] && // look up
                  player == gameArray[r+2][c] &&
                  player == gameArray[r+3][c])
              {
                  if(draw){
                      return 'd';
                  }
                  return player;
              }
              if (c + 3 < numCols &&
                  player == gameArray[r+1][c+1] && // look up & right
                  player == gameArray[r+2][c+2] &&
                  player == gameArray[r+3][c+3])
              {
                  if(draw){
                      return 'd';
                  }
                  return player;
              }
              if (c - 3 >= 0 &&
                  player == gameArray[r+1][c-1] && // look up & left
                  player == gameArray[r+2][c-2] &&
                  player == gameArray[r+3][c-3])
              {
                  if(draw){
                      return 'd';
                  }
                  return player;
              }
          }

      }
  }
}