import { liveGames } from "./game.js";
import Game from "../model/game.js";

const numRows = 6;
const numCols = 7;
let gameArray = new Array(numRows).fill('e').map(() => new Array(numCols).fill('e'));

let turnToPlay = undefined;

export async function clientMove(client, msg,username) {
    //First check valid game code
    const game = liveGames.get(msg['joinCode']);
    if (game === null) {
        client.send(JSON.stringify({
            requestType: "UPDATE",
            valid: false,
            msg: "Not in valid game"
        }));
        return;
    }

    if (undefined === turnToPlay) {
        turnToPlay = game.players[0].username;
    }
    //Check that correct playing is making the move
    if (username != turnToPlay) {
        client.send(JSON.stringify({
            requestType: "UPDATE",
            valid: false,
            msg: "Not your turn"
        }));
        return;
    }
    let movedPlayed = findFirstEmptyCell(msg['col']);
    let color;
    //Check that the player made a valid move(space in column)
    if (movedPlayed[0] == -1) {
        client.send(JSON.stringify({
            requestType: "UPDATE",
            valid: false,
            msg: "Not a valid move"
        }));
        return;
    } else {
        gameArray[movedPlayed[0]][movedPlayed[1]] = turnToPlay;//update gameArray

        if (turnToPlay == game.players[0].username) {
            turnToPlay = game.players[1].username;
            color = 'red';
        } else {
            turnToPlay = game.players[0].username;
            color = 'yellow';
        }

        let winnerCheck = checkForWinner();

        if (winnerCheck != "isLive") {//The game is over, need to save and close
            endGame(msg['joinCode'], winnerCheck);
        }

        for (const player of game.players) {
            player.ws.send(JSON.stringify({
                requestType: "UPDATE",
                valid: true,
                row: movedPlayed[0],
                col: movedPlayed[1],
                color: color,
                playerTurn: turnToPlay,
                winner: winnerCheck
            }));
        }
    }
}

function checkForWinner() {
    let draw = true;
    let player;

    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            player = gameArray[r][c];
            if (player == 'e') {
                draw = false;//We found an empty spot the game is not a draw yet
                continue; // don't check empty slots
            }

            if (c + 3 < numCols &&
                player == gameArray[r][c + 1] && // look right
                player == gameArray[r][c + 2] &&
                player == gameArray[r][c + 3]) {
                if (draw) {
                    return 'Draw';
                }
                return player;
            }

            if (r + 3 < numRows) {
                if (player == gameArray[r + 1][c] && // look up
                    player == gameArray[r + 2][c] &&
                    player == gameArray[r + 3][c]) {
                    if (draw) {
                        return 'Draw';
                    }
                    return player;
                }
                if (c + 3 < numCols &&
                    player == gameArray[r + 1][c + 1] && // look up & right
                    player == gameArray[r + 2][c + 2] &&
                    player == gameArray[r + 3][c + 3]) {
                    if (draw) {
                        return 'Draw';
                    }
                    return player;
                }
                if (c - 3 >= 0 &&
                    player == gameArray[r + 1][c - 1] && // look up & left
                    player == gameArray[r + 2][c - 2] &&
                    player == gameArray[r + 3][c - 3]) {
                    if (draw) {
                        return 'Draw';
                    }
                    return player;
                }
            }

        }
    }
    return "isLive";
}

export function updateGameState(client, msg) {
    const game = liveGames.get(msg['joinCode']);
    if (game === null) {
        client.send(JSON.stringify({
            requestType: "GAME OVER",
            valid: false,
            msg: "Not in valid game"
        }));
        return;
    }

    let winnerCheck = checkForWinner();
    for (const player of game.players) {
        player.ws.send(JSON.stringify({
            requestType: "GAME OVER",
            winner: winnerCheck
        }));
    }

    if (winnerCheck != "isLive") {//The game is over, need to save and close
        endGame(msg['joinCode'], winnerCheck);
    }

}

async function endGame(joinCode, winnerIn) {
    await Game.updateOne(
        { gameCode: joinCode },
        {
            $set: {
                isLive: false,
                winner: winnerIn
            }
        }
    )
    liveGames.delete(joinCode);
    turnToPlay = undefined;

    gameArray = new Array(numRows).fill('e').map(() => new Array(numCols).fill('e'));

}

function findFirstEmptyCell(col) {
    let foundEmptySpot = false;
    let emptyRowIndex = 5;
    while (!foundEmptySpot) {
        if (gameArray[emptyRowIndex][col] == 'e') {
            return [emptyRowIndex, col];
        } else if (emptyRowIndex == 0) {
            return [-1, -1];
        }
        else {
            emptyRowIndex = emptyRowIndex - 1;
        }
    }
}
