const numRows = 6;
const numCols = 7;
const gameArray = new Array(numRows).fill('e').map(() => new Array(numCols).fill('e'));
let gameBoard;

let turnToPlay = "P1";
let winner = 'e';

let player1 = "P1";
let player2 = "P2";

function initGameInfo()
{
    const header = document.createElement("h1");
    header.textContent = `${player1} VS ${player2}`;
    document.body.appendChild(header);
}

function generateBoard()
{
    gameBoard = document.createElement("table");
    const boardBody = document.createElement("tbody");

    for(let i = 0; i< numRows ; i++){
        const row = document.createElement("tr");
        for (let j = 0; j < numCols; j++) {
            let cell = document.createElement("td");
            cell.id = i+";"+j;
            cell.addEventListener("click", function(){
                movePlayed(cell);
            });
            row.appendChild(cell);
        }
        boardBody.appendChild(row);
    }

    gameBoard.appendChild(boardBody);
    document.body.appendChild(gameBoard);
}

function findFirstEmptyCell(row,col){
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

function updateBoard(rowPlayed,colPlayed){

    gameArray[rowPlayed][colPlayed] = turnToPlay;
    let cellToUpdate = document.getElementById(rowPlayed+";"+colPlayed);

    if(turnToPlay == "P1"){
        cellToUpdate.style.background = 'red';
    }else{
        cellToUpdate.style.background = 'yellow';
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

// Checking for game win and game turn logic here
function updateGameState(){
    if(winner == "P1")
    {
        setTimeout(function(){
            alert(`${player1} has won`);
        }, 500);
    }
    else if(winner == "P2")
    {
        setTimeout(function(){
            alert(`${player2} has won`);
        }, 500);
    }else if(winner == 'd')
    {
        setTimeout(function(){
            alert("Game is a draw");
        }, 500);
    }else{
        if(turnToPlay == "P1"){
            turnToPlay = "P2";
        }else{
            turnToPlay = "P1";
        }
    }
}

function movePlayed(cell)
{

    let row = cell.id[0];
    let col = cell.id[2];

    let movedPlayed = findFirstEmptyCell(row,col);
    if(movedPlayed[0] == -1){
        alert("Cannot Play Here");
        return;
    }else{
        updateBoard(movedPlayed[0],movedPlayed[1]);
        winner = checkForWinner();
    }

    updateGameState();
    let outText = "";
    for(let i = 0; i< numRows ; i++){
        for (let j = 0; j < numCols; j++) {
            outText+= gameArray[i][j]+' ';

        }
        outText = outText + "\n";
    }
    console.log(outText);
}

document.addEventListener('DOMContentLoaded', function () {
    initGameInfo();
    generateBoard();
});
