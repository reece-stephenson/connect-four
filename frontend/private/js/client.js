const wsURL = window.location.host.includes("localhost") ? `ws://${window.location.host}/` : `ws://${window.location.host}/`;
const socket = new WebSocket(wsURL);

let joinCode = "";

const numRows = 6;
const numCols = 7;
let gameBoard;
let gameSection;
let gameOver = false;
let myUsername;

// on socket connection
socket.onopen = () => {
    myUsername = getUserInfo();

    let urlParams = new URLSearchParams(window.location.search);
    let create = urlParams.get('create');
    let join = urlParams.get('join');

    document.getElementById("backBtn").addEventListener("click", function () {
        window.location = './';
    });

    if (create != null) {
        createGame();
    } else if (join != null) {
        document.getElementById("joinGame").classList.remove('hidden');

        document.getElementById("checkCodeBtn").addEventListener('click', () => {
            joinGame();
        });
    } else if (create == null && join == null) {
        window.location = "/";
    }
}

socket.onmessage = async (event) => {
    let response = JSON.parse(event.data);
    switch (response['requestType']) {
        case "GAME CODE":
            displayGameCode(response["joinCode"]);
            break;
        case "JOIN":
            handleJoin(response);
            break;
        case "UPDATE":
            handleUpdate(response);
            break;
        case "GAME OVER":
            handleGameOver(response);
            break;
        default:
            return;
    }
};

async function getUserInfo() {
    let response = await fetch(window.location.origin + "/userInfo", {
        method: "GET",
        credentials: 'include'
    });
    let data = await response.json();

    return data.username;
}

function createGame() {
    socket.send(JSON.stringify({
        requestType: "CREATE"
    }));

    document.getElementById("hostWaiting").classList.remove('hidden');
    document.getElementById("joinCodeHeader").textContent = "Loading Your Game";
}

function displayGameCode(joinCodeIn) {

    document.getElementById("joinCodeHeader").textContent = `Your game pin is`;
    document.getElementById("joinCodeId").textContent = joinCodeIn;
    joinCode = joinCodeIn;

}

function joinGame() {
    joinCode = document.getElementById("joinCodeIdInput").value;
    if (joinCode == "") {
        document.getElementById("errorInput").textContent = "Join Code Can't Be Empty";
        return;
    }
    socket.send(JSON.stringify({
        joinCode: joinCode,
        requestType: "JOIN"
    }));
}

function handleJoin(msg) {
    if (msg['success']) {
        document.getElementById("joinGame").classList.add('hidden');
        document.getElementById("hostWaiting").classList.add('hidden');
        generateScreen(msg['player1'], msg['player2']);
    }
    else {
        document.getElementById("errorInput").textContent = msg['message'];
    }
}

function generateScreen(player1, player2) {

    player1 = decodeURIComponent(player1);
    player2 = decodeURIComponent(player2);

    let playerH = document.getElementById("playerHeader");
    playerH.textContent = `${player1} VS ${player2}`;

    let playerTurn = document.getElementById("playerTurn");
    playerTurn.textContent = `${player1} To Play`;
    generateBoard();

}

function generateBoard() {
    gameSection = document.getElementById("playGame");
    gameSection.classList.remove('hidden');
    gameBoard = document.createElement("table");
    gameBoard.id = "gameTable";
    const boardBody = document.createElement("tbody");

    for (let i = 0; i < numRows; i++) {
        const row = document.createElement("tr");
        row.className = "gameRow";
        for (let j = 0; j < numCols; j++) {
            let cell = document.createElement("td");
            cell.className = "gameCol";
            cell.id = i + ";" + j;
            cell.addEventListener("click", function () {
                movePlayed(cell);
            });
            row.appendChild(cell);
        }
        boardBody.appendChild(row);
    }

    gameBoard.appendChild(boardBody);
    gameSection.appendChild(gameBoard);
}

function handleUpdate(msg) {
    if (!msg['valid']) {
        document.getElementById("errorDisplay").classList.remove('hidden');
        document.getElementById("errorDisplay").textContent = msg['msg'];
    } else {
        document.getElementById("errorDisplay").classList.add('hidden');
        updateScreen(msg['row'], msg['col'], msg['color'], msg['playerTurn']);
        handleGameOver(msg);
    }
}

function updateScreen(rowPlayed, colPlayed, clr, turn) {

    let cellToUpdate = document.getElementById(rowPlayed + ";" + colPlayed);
    cellToUpdate.style.background = clr;
    if (clr == 'red') {
        document.getElementById("playerTurn").style.color = 'yellow';
    } else {
        document.getElementById("playerTurn").style.color = 'red';
    }
    // console.log(turn.find("%20"));
    turn = decodeURIComponent(turn);

    document.getElementById("playerTurn").textContent = `${turn} To Play`;
}

function movePlayed(cell) {
    if (gameOver) {
        document.getElementById("errorDisplay").textContent = "Game is already over";
        return;
    }
    let col = cell.id[2];

    socket.send(JSON.stringify({
        joinCode: joinCode,
        requestType: "MOVE",
        col: col
    }));

}

function handleGameOver(msg) {
    //TODO clear screen and send back to menu
    let winnerName = msg['winner'];
    if (winnerName != "isLive") {
        gameOver = true;
        document.getElementById("backBtn").classList.remove('hidden');
        document.getElementById("playerTurn").classList.add('hidden');
        if (winnerName == "Draw") {
            document.getElementById("playerHeader").textContent = "The game is a draw";
        } else {

            winnerName = decodeURIComponent(winnerName);
            document.getElementById("playerHeader").textContent = `The winner is ${winnerName}`;
        }
    }
}
