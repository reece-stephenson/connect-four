const numRows = 6;
const numCols = 7;
const gameArray = new Array(numRows).fill('e').map(() => new Array(numCols).fill('e'));
let gameBoard;

let turnToPlay = 'r';
let winner = 'e';

function generateBoard()
{
    gameBoard = document.getElementById("gameBoard");
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

    if(turnToPlay == 'r'){
        cellToUpdate.style.background = 'red';
    }else{
        cellToUpdate.style.background = 'yellow';
    }
}

function checkForWinner(){
    let draw = true;

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
    if(winner == 'r')
    {
        setTimeout(function(){
            alert("Red has won");
        }, 500);
    }
    else if(winner == 'y')
    {
        setTimeout(function(){
            alert("Yellow has won");
        }, 500);
    }else if(winner == 'd')
    {
        setTimeout(function(){
            alert("Game is a draw");
        }, 500);
    }else{
        if(turnToPlay == 'r'){
            turnToPlay = 'y';
        }else{
            turnToPlay = 'r';
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
    generateBoard();
});
