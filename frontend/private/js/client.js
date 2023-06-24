const wsURL = window.location.host.includes("localhost") ? `ws://${window.location.host}/` : `wss://${window.location.host}/`;
const socket = new WebSocket(wsURL);

let joinCode = "";

const numRows = 6;
const numCols = 7;
let gameBoard;

// on socket connection
socket.onopen = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let create = urlParams.get('create');
    let join = urlParams.get('join');
    if (create != null) {
        // ! route the person to the create page
        document.getElementById("hostWaiting").classList.remove('hidden');
        createGame();
        document.getElementById('join-code-header').textContent = "Your game pin is";
    } else if (join != null) {
        document.getElementById("joinGame").classList.remove('hidden');
        document.getElementById('join-code-header').textContent = "Enter the game pin to join";

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
            joinCode = response["joinCode"];
            document.getElementById('join-code-header').textContent += "\t" + joinCode;
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

function handleJoin(msg) {
    if (msg['success']) {
        document.getElementById("joinGame").classList.add('hidden');
        document.getElementById("hostWaiting").classList.add('hidden');
        socket.send(JSON.stringify({
            joinCode: joinCode,
            requestType: "SETUP"
        }));
        generateBoard();
    }
    else {
        alert(msg['message']);
        document.getElementById("join-code-header").textContent = msg['message'];
    }
}

function handleGameOver(msg) {
    if (msg['winner'] != "isLive")
        if (msg['winner'] == "Draw") {
            alert("The game is a draw");
        } else {
            alert(`The winner is ${msg['winner']}`);
        }
    // TODO save game details ins db
}

function addPlayerToList(response) {
    document.getElementById('player-list').innerHTML = "";

    let liHeader = document.createElement('li');
    liHeader.textContent = "Players";
    document.getElementById('player-list').appendChild(liHeader);

    for (let i = 1; i < response['players'].length; i++) {
        // create li and append to ul
        let li = document.createElement('li');
        li.textContent = response['players'][i]['name'];
        document.getElementById('player-list').appendChild(li);
    }
}

async function createGame() {
    let user = "P1";
    socket.send(JSON.stringify({
        player: user,
        requestType: "CREATE"
    }));
}

async function joinGame() {
    joinCode = document.getElementById("join-code-id-input").value;
    let user = "P2";
    socket.send(JSON.stringify({
        joinCode: joinCode,
        player: user,
        requestType: "JOIN"
    }));
}

function generateBoard() {
    gameBoard = document.createElement("table");
    const boardBody = document.createElement("tbody");

    for (let i = 0; i < numRows; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < numCols; j++) {
            let cell = document.createElement("td");
            cell.id = i + ";" + j;
            cell.addEventListener("click", function () {
                movePlayed(cell);
            });
            row.appendChild(cell);
        }
        boardBody.appendChild(row);
    }

    gameBoard.appendChild(boardBody);
    document.body.appendChild(gameBoard);
}

function handleUpdate(msg) {
    if (!msg['valid']) {
        alert(msg['msg']);
    } else {
        updateScreen(msg['row'], msg['col'], msg['color'])
    }
}

function updateScreen(rowPlayed, colPlayed, clr) {

    // gameArray[rowPlayed][colPlayed] = turnToPlay;
    let cellToUpdate = document.getElementById(rowPlayed + ";" + colPlayed);
    cellToUpdate.style.background = clr;
}
function movePlayed(cell) {
    let col = cell.id[2];
    let user = prompt();

    socket.send(JSON.stringify({
        joinCode: joinCode,
        player: user,
        requestType: "MOVE",
        col: col
    }));

    socket.send(JSON.stringify({
        joinCode: joinCode,
        requestType: "STATE"
    }));

}
