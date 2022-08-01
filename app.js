  /////////////////////////////
 // Variables and constants //
/////////////////////////////

const rows = 6;
const columns = 7;
const winningNum = 4;

let winner = "Nobody";

const newBoard = [
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
]

let gameState = {
    player1: {
        name: "",
        color: "r",
        lastMove: [],
        createPlayer: function(color, name) {
            this.color = color;
            this.name = name;
        },
        undoLastMove: function() {
            gameState.board[this.lastMove[0]][this.lastMove[1]] = "";
            this.lastMove = [];
            gameState.turn -= 1;
        },
    },
    player2: {
        name: "Computer",
        color: "y",
        isComputer: true,
        lastMove: [],
        createPlayer: function(name) {
            if (name) {
                this.name = name;
                this.isComputer = false;
            } else {
                this.name = "Computer";
                this.isComputer = true;
            }
            gameState.player1.color === 'r' ? this.color = 'y' : this.color = 'r';
        },
        undoLastMove: function() {
            gameState.board[this.lastMove[0]][this.lastMove[1]] = "";
            this.lastMove = [];
            gameState.turn -= 1;
        },
    },
    board: [
        ['','','','','','',''],
        ['','','','','','',''],
        ['','','','','','',''],
        ['','','','','','',''],
        ['','','','','','',''],
        ['','','','','','',''],
    ],
    turn: 1,
    isP1Turn: true,
    numOfPlayers: 1,
    reset: function () {
        this.board = [
            ['','','','','','',''],
            ['','','','','','',''],
            ['','','','','','',''],
            ['','','','','','',''],
            ['','','','','','',''],
            ['','','','','','',''],
        ];
        this.turn = 1;
        this.player1.lastMove = [];
        this.player2.lastMove = [];
        this.player1.color === 'r' ? this.isP1Turn = true : this.isP1Turn = false;
        updateBoard();
        setPrompt(-1);
        board.classList.remove("disabled");
        menuBtn.classList.remove("disabled");
    }
}

themes = {
    default: {
        c1: 'r',
        c2: 'y',
        c3: 'b',
    },
    grey: {
        c1: 'g1',
        c2: 'g2',
        c3: 'g3',
    }
}

  ///////////////////
 // DOM selection //
///////////////////

let board = document.getElementById("board");
let prompt = document.getElementById("prompt");
let p1token = document.getElementById("p1token");
let p2token = document.getElementById("p2token");
let p1name = document.getElementById("p1name");
let p2name = document.getElementById("p2name");
let currPlayerToken = document.getElementById("currPlayer");
let currPlayerName = document.getElementById("curr-player-name");
let undoBtn = document.getElementById("undo");
let menuBtn = document.getElementById("menu");

board.addEventListener("click", (event) => {
    if (event.target.className === 'square') {
        gameState.isP1Turn ? setPiece(event.target.dataset.column, gameState.player1.color) : setPiece(event.target.dataset.column, gameState.player2.color);
    }
});

board.classList.add("disabled");

menuBtn.addEventListener("click", () => {
    setPrompt(4);
})

undoBtn.addEventListener("click", () => {
    if (gameState.player1.lastMove || gameState.player2.lastMove) {
        if (gameState.isP1Turn && gameState.player2.isComputer) {
            gameState.player2.undoLastMove();
            gameState.player1.undoLastMove();
        } else if (gameState.isP1Turn) {
            gameState.player2.undoLastMove();
            switchPlayer();
        } else {
            gameState.player1.undoLastMove();
            switchPlayer();
        }
        updateBoard();
    }
});

  ///////////////
 // Functions //
///////////////

/**
 * 
 */
function newGame() {
    gameState.board = clearBoard();
    gameState.turn = 1;
    gameState.player1.lastMove = [];
    gameState.player2.lastMove = [];
    gameState.player1.color === 'r' ? this.isP1Turn = true : this.isP1Turn = false;
    gameState.player1.name = '';
    gameState.player2.name = '';
    p1token.classList.remove(gameState.player1.color);
    p2token.classList.remove(gameState.player2.color);
    updateBoard();
    setPrompt(0);
}

const clearBoard = () => [
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
];

const changeTheme = (theme) => {
    if (['r','g1'].includes(gameState.player1.color)) {
        p1Color = theme.c1;
        p2Color = theme.c2;
    } else {
        p1Color = theme.c2;
        p2Color = theme.c1;
    }

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (gameState.board[row][col] === gameState.player1.color) gameState.board[row][col] = c1;
            else if (gameState.board[row][col] === gameState.player2.color) gameState.board[row][col] = c2;
        }
    }

    board.classList.add(theme.c3);
}

/**
 * Game play for computer.
 * Computer will play winning move if possible or prevent player from playing winning move.
 * Computer will try to prevent player from controlling the center.
 * Computer is more likely to build or obstruct than to play just any random moves.
 */
function computerPlay() {
    let possMoves = [];
    let essMove = false;
    let move = 3;

    if (gameState.board[5][3] && gameState.board[getRow(3) + 1][3] === gameState.player1.color) {
        if (getRow(2) === getRow(3) + 1) {
            move = 2;
            essMove = true;
        }
        else if (getRow(4) === getRow(3) + 1) {
            move = 4;
            essMove = true;
        };
    }

    if (gameState.player2.lastMove) {
        let prevRow = gameState.player2.lastMove[0];
        let prevCol = gameState.player2.lastMove[1];
        if (prevRow > 0 && gameState.board[prevRow - 1][prevCol] !== gameState.player1.color) possMoves.push(prevCol);
        let newRow = getRow(prevCol - 1);
        if (newRow >= 0 && (newRow === prevRow || newRow === prevRow - 1 || newRow === prevRow + 1)) possMoves.push(prevCol - 1);
        newRow = getRow(prevCol + 1);
        if (newRow >= 0 && (newRow === prevRow || newRow === prevRow - 1 || newRow === prevRow + 1)) possMoves.push(prevCol + 1);
    }

    for (let col = 0; col < columns; col++) {
        let row = getRow(col);
        if (row >= 0) {
            possMoves.push(col);
            if (isVictory(row, col, gameState.player2.color)){ 
                move = col;
                essMove = true;
            } else if (isVictory(row, col, gameState.player1.color)) { 
                move = col;
                essMove = true;
            } 
            if (twoInRow(col, row, gameState.player1.color) || twoInRow(col, row, gameState.player2.color)) {
                possMoves.push(col);
                possMoves.push(col);
            } 
            if (col === 3) {
                possMoves.push(col);
            }
        }
    }
    
    if (!essMove) move = possMoves[Math.floor(Math.random() * possMoves.length)];
    setPiece(move, gameState.player2.color);
}

/**
 * Get the lowest unfilled row on board for given column
 * @param {number} col 
 * @returns {number} row
 */
const getRow = (col) => {
    let row = rows - 1;
    let filled = true;
    while (row >= 0 && filled) {
        if (!gameState.board[row][col]) {
            filled = false;
            break;
        }
        --row;
    }
    if (filled) row = -1;
    return row;
}

/**
 * Recursively check for an ascending diagonal victory based on a given position and color.
 * 
 * @param {number} row 
 * @param {number} col 
 * @param {string} color 
 * @param {number} total 
 * @param {string} direction 
 * @returns {boolean} victory
 */
function isAscDiagVictory(row, col, color, total=0, direction="minus") {
    if (total > winningNum) return true;

    if (direction === "plus"){
        if(row < 0 || col >= columns || !isPlayersPiece(row, col, color)) return false;
        else {
            row -= 1;
            col += 1;
            total++;
        }
    }
    else if (row >= rows || col < 0 || !isPlayersPiece(row, col, color)) {
        direction = "plus";
        row = row - total;
        col = col + total;
    }
    else {
        row += 1;
        col -= 1;
        total++;
    }
    return isAscDiagVictory(row, col, color, total, direction)
}

/**
 * Recursively check for a descending diagonal victory based on a given position and color.
 * 
 * @param {number} row 
 * @param {number} col 
 * @param {string} color 
 * @param {number} total 
 * @param {string} direction 
 * @returns 
 */
function isDescDiagVictory(row, col, color, total=0, direction="minus") {
    if (total > winningNum) return true;
    
    if (direction === "plus"){
        if(row >= rows || col >= columns || !isPlayersPiece(row, col, color)) return false;
        else {
            row += 1;
            col += 1;
            total++;
            return isDescDiagVictory(row, col, color, total, direction);
        }
    }
    if (row < 0 || col < 0 || !isPlayersPiece(row, col, color)) {
        direction = "plus";
        row = row + total;
        col = col + total;
        return isDescDiagVictory(row, col, color, total, direction);
    }
    row -= 1;
    col -= 1;
    total++;
    return isDescDiagVictory(row, col, color, total, direction)
}

/**
 * Recursively checks for a horizontal victory based on position and color.
 * 
 * @param {number} row 
 * @param {number} col 
 * @param {string} color 
 * @param {number} total 
 * @param {string} direction 
 * @returns {boolean} victory 
 */
function isHorzVictory(row, col, color, total=1, direction = "minus") {
    if (total >= 4) return true;
    
    if (direction === "plus"){
        if (!isPlayersPiece(row, col, color) || col >= columns) return false;
        else {
            total += 1;
            col = col + 1;
            return isHorzVictory(row, col, color, total, direction);
        }
    }
    
    col = col - 1;

    if (!isPlayersPiece(row, col, color) || col < 0) {
        col += total + 1;
        direction = "plus";
        return isHorzVictory(row, col, color, total, direction);
    }
    
    total += 1;
    return isHorzVictory(row, col, color, total, direction);
}

/**
 * Check if piece at given position matches given color
 * 
 * @param {number} row 
 * @param {number} col 
 * @param {string} color 
 * @returns {boolean}
 */
const isPlayersPiece = (row, col, color) => gameState.board[row][col] === color;

/**
 * Check for a vertical victory based on position and color
 * 
 * @param {number} row 
 * @param {number} col 
 * @param {string} color 
 * @returns {boolean} victory
 */
const isVertVictory = (row, col, color) => {
    let total = 0;
    row = row + 1;
    let victory = true;
    for (row; row < rows && total < winningNum -1; row++) {
        if (!isPlayersPiece(row, col, color)){
            victory = false;
            break;
        };
        total++;
    }

    if (total < winningNum -1) victory = false;

    return victory;
    };

/**
 * Check if given position and color makes a victory
 * 
 * @param {number} row 
 * @param {number} col 
 * @param {string} color 
 * @returns {boolean} Is a victory
 */
const isVictory = (row, col, color) => (isVertVictory(row, col, color) || isHorzVictory(row, col, color) || isDescDiagVictory(row, col, color) || isAscDiagVictory(row, col, color));

const setNumOfPlayers = (num) => {
    if (num === 1) {
        gameState.numOfPlayers = 1;
        setPrompt(1);
    } else {
        gameState.numOfPlayers = 2;
        setPrompt(2);
    }
}

/**
 * Place piece in given row and check for victory and respond accordingly
 * 
 * @param {number} col 
 * @param {string} color 
 */
const setPiece = (col, color) => {
    col = Number(col);
    let row = getRow(col);
    if (row >= 0) {
        gameState.board[row][col] = color;
        if (gameState.isP1Turn) gameState.player1.lastMove = [row, col];
        else gameState.player2.lastMove = [row, col];
        if (gameState.turn >= 7 && isVictory(row, col, color)) {
            board.classList.add("disabled");
            gameState.isP1Turn ? winner = gameState.player1.name : winner = gameState.player2.name;
            if (!gameState.isP1Turn && gameState.player2.isComputer) {
                setPrompt(3);
            } else if (gameState.player2.isComputer) {
                setPrompt(5);
            } else {
                prompt.innerHTML = `
                    <span class="material-symbols-outlined" id="btn-close" onClick="setPrompt(-1)">
                    close
                    </span>
                    <h3>${winner} Wins!</h3>
                    <div class="btn-group">
                        <button id="rematch" class="btn-std" onClick="gameState.reset()">Rematch</button>
                        <button id="new-game" class="btn-std" onClick="newGame()">New Game</button>
                    </div>
                `;
                prompt.style.display = "flex";
            }
            updateBoard();
        } else if (gameState.turn >= 42) {
            board.classList.add("disabled");
            setPrompt(6)
        } else {
            gameState.turn += 1;
            switchPlayer();
            updateBoard();
        }
    }
}


const prompts = [
    `
    <h2>Connect 4</h2>
    <div id="game-type-selection">
        <button type="button" class="game-type" onclick="setNumOfPlayers(2)">
            <span class="material-symbols-outlined">
            person
            </span>
            |
            <span class="material-symbols-outlined">
                person
            </span>
        </button>
        <button type="button" class="game-type" onclick="setNumOfPlayers(1)">
            <span class="material-symbols-outlined">
                person
            </span>
                |
            <span class="material-symbols-outlined">
                computer
            </span>
        </button>
    </div>
    `,
    `<span class="material-symbols-outlined" id="back-btn" onClick="setPrompt(0)">
    arrow_back
    </span>
    <h2>Connect 4</h2>
    <form>
        <span class="name">
            <label for="name">Name:</label>
            <input type="text" id="name">
        </span>
        <div id="token-select">
            <label>Choose Color:</label>
            <span id="tokens">
                <input type="radio" id="red-token" name="token-selection" value="r">
                <label for="red-token" class="square r"></label>
                <input type="radio" id="yellow-token" name="token-selection" value="y">
                <label for="yellow-token" class="square y"></label>
            </span>
        </div>
        <span class="random-section">
            <input type="radio" id="random" name="token-selection"></input>
            <label for="random" id="random-label" value="random">random</label>
        </span>
    </form>
    <button type="button" id="play-btn" class="btn-std" onClick="startGame()">Play!</button>
    `,
    `
    <span class="material-symbols-outlined" id="back-btn" onClick="setPrompt(0)">
    arrow_back
    </span>
    <h2>Connect 4</h2>
    <form>
        <span class="name">
            <label for="name">Player 1 Name:</label>
            <input type="text" id="name">
        </span>
        <div id="token-select">
            <label>Choose Color:</label>
            <span id="tokens">
                <input type="radio" id="red-token" name="token-selection" value="r">
                <label for="red-token" class="square r"></label>
                <input type="radio" id="yellow-token" name="token-selection" value="y">
                <label for="yellow-token" class="square y"></label>
            </span>
        </div>
        <span class="random-section">
            <input type="radio" id="random" name="token-selection"></input>
            <label for="random" id="random-label" value="random">random</label>
        </span>
        <span class="name">
            <label for="p2-name">Player 2 Name:</label>
            <input type="text" id="p2-name">
        </span>
    </form>
    <button type="button" id="play-btn" class="btn-std" onClick="startGame()">Play!</button>
    `,
    `
    <span class="material-symbols-outlined" id="btn-close" onClick="setPrompt(-1)">
        close
    </span>
    <h3>YOU LOSE!</h3>
    <div class="btn-group">
        <button id="rematch" class="btn-std" onClick="gameState.reset()">Rematch</button>
        <button id="new-game" class="btn-std" onClick="newGame()">New Game</button>
    </div>
    `,
    `
    <span class="material-symbols-outlined" id="btn-close" onClick="setPrompt(-1)">
        close
    </span>
    <h2>Connect 4</h2>
    <ul>
        <li onClick="newGame()">New Game</li>
        <li onClick="gameState.reset()">Reset Board</li>
        <li>Change Theme</li>
    </ul>
    `,
    `
    <span class="material-symbols-outlined" id="btn-close" onClick="setPrompt(-1)">
        close
    </span>
    <h3>YOU WIN!</h3>
    <div class="btn-group">
        <button id="rematch" class="btn-std" onClick="gameState.reset()">Rematch</button>
        <button id="new-game" class="btn-std" onClick="newGame()">New Game</button>
    </div>
    `,
    `
    <span class="material-symbols-outlined" id="btn-close">
        close
    </span>
    <h3>It's a Draw!</h3>
    <div class="btn-group">
        <button id="rematch" class="btn-std" onClick="gameState.reset()">Rematch</button>
        <button id="new-game" class="btn-std" onClick="newGame()">New Game</button>
    </div>
    `
]

/**
 * Set and display prompt or close prompt.
 * 
 * @param {number} htmlIdx 
 */
const setPrompt = (htmlIdx) => {
    if (htmlIdx < 0) {
        prompt.style.display = "none";
        prompt.innerHTML = "";
    }
    else {
        prompt.innerHTML = prompts[htmlIdx];
        prompt.style.display = "flex";
    }
}

/**
 * Set name for player
 * 
 * @param {string} name 
 * @param {number} player 
 */
const setName  = (name, player) => {
    if (player == 1) {
        gameState.player1.name = name;
    } else {
        gameState.player2.name = name;
    }
}

/**
 * Start new game
 */
const startGame = () => {
    let form = document.querySelector("form");
    let name = form.elements["name"].value;
    let tokenSelection = form.elements["token-selection"].value;

    if (tokenSelection === "on") tokenSelection = ['r','y'][Math.floor(Math.random() * 2)];
    
    gameState.player1.createPlayer(tokenSelection, name);

    if (gameState.player1.color === 'y') gameState.isP1Turn = false;

    if (form.elements["p2-name"]) {
        let p2name = form.elements["p2-name"].value;
        gameState.player2.createPlayer(p2name);
    } else {
        gameState.player2.createPlayer();
    }

    p1token.classList.add(gameState.player1.color);
    p2token.classList.add(gameState.player2.color);

    p1name.innerText = gameState.player1.name;
    p2name.innerText = gameState.player2.name;
    
    setPrompt(-1);
    board.classList.remove("disabled")
    menuBtn.classList.remove("disabled");
    if (!gameState.isP1Turn && gameState.player2.isComputer) computerPlay();
}

/**
 * Switch player in game state
 */
const switchPlayer = () => gameState.isP1Turn ? gameState.isP1Turn = false : gameState.isP1Turn = true;

/**
 * Check for two in a row for given position and color
 * 
 * @param {number} col 
 * @param {number} row 
 * @param {string} color 
 * @returns 
 */
const twoInRow = (col, row, color) => {
    let bool = false;
    if (row < 4) {
        if (gameState.board[row + 1][col - 1] === color && gameState.board[row + 2][col - 2] === color) bool = true;
        if (gameState.board[row + 1][col + 1] === color && gameState.board[row + 2][col + 2] === color) bool = true;
        if (gameState.board[row + 1][col] === color && gameState.board[row + 2][col] === color) bool = true;
    }
    if (col > 1) {
        if (gameState.board[row][col - 1] === color && gameState.board[row][col - 2] === color) bool = true;
    }
    if (col < 5) {
        if (gameState.board[row][col + 1] === color && gameState.board[row][col + 2] === color) bool = true;
    }
    return bool;
}

/**
 * Draw / redraw board
 */
function updateBoard() {
    board.innerText = '';

    for (let row = 0; row < rows; row++) {
        let newRow = document.createElement("span");
        newRow.classList.add("row");
        board.appendChild(newRow);
        for (let column = 0; column < columns; column++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.dataset.row = row;
            square.dataset.column = column;
            if (gameState.board[row][column]) square.classList.add(gameState.board[row][column]);
            newRow.appendChild(square);
        }
    }
    
    updateSidebar();
    if (!gameState.isP1Turn && gameState.player2.isComputer) computerPlay();
}

/**
 * Display current player and enable or disable undo button
 */
function updateSidebar() {
    if (gameState.isP1Turn) {
        currPlayerToken.classList.remove(gameState.player2.color);
        currPlayerToken.classList.add(gameState.player1.color);
        currPlayerName.innerText = gameState.player1.name;
        if (gameState.turn > 2 || !gameState.player2.isComputer) {
            gameState.player2.lastMove.length > 0 ? undoBtn.classList.remove("disabled") : undoBtn.classList.add("disabled");
        }
    } else {
        currPlayerToken.classList.remove(gameState.player1.color);
        currPlayerToken.classList.add(gameState.player2.color);
        currPlayerName.innerText = gameState.player2.name;
        gameState.player1.lastMove.length > 0 ? undoBtn.classList.remove("disabled") : undoBtn.classList.add("disabled");
    }
}

newGame();


  /////////////
 // Testing //
/////////////

const board1 = [
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['y','y','y','','','',''],
    ['r','r','r','','','',''],
]

const board2 = [
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','y','y','y'],
    ['','','','','r','r','r'],
]

const board3 = [
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','y','r','','',''],
    ['','','y','r','','',''],
    ['','','y','r','','',''],
]

const board4 = [
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','r','y','','',''],
    ['','r','r','y','','',''],
    ['r','y','y','y','','',''],
]

const board5 = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', 'y', 'r', '', 'r'],
    ['', '', '', 'y', 'r', 'r', 'y'],
    ['', '', 'r', 'y', 'y', 'y', 'r'],
]

const board6 = [
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['','','','','','',''],
    ['y','y','','','','',''],
    ['r','r','','r','y','',''],
]

const board7 = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['y', 'r', 'y', '', '', '', ''],
    ['r', 'y', 'r', '', '', '', ''],
    ['y', 'r', 'y', '', '', '', ''],
    ['r', 'r', 'y', '', '', '', ''],
]

const board8 = [
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', 'r', 'y'],
    ['', '', '', '', 'r', 'y', 'r'],
    ['', '', '', '', 'y', 'y', 'y'],
    ['', '', '', '', 'r', 'r', 'r'],
]

const board9 = [
    ['y', 'r', 'y', 'y', 'r', 'y', 'y'],
    ['y', 'y', 'r', 'y', 'r', 'r', 'r'],
    ['y', 'y', 'y', 'r', 'y', 'y', 'y'],
    ['r', 'r', 'y', 'r', 'y', 'r', 'r'],
    ['r', 'y', 'r', 'y', 'r', 'r', 'y'],
    ['r', 'r', 'r', 'y', 'r', 'r', 'y'],
]

const board10 = [
    ['', '', '', '', '', '', ''],
    ['y', 'r', 'r', 'y', 'y', 'r', 'r'],
    ['r', 'y', 'y', 'r', 'r', 'y', 'y'],
    ['y', 'r', 'r', 'y', 'r', 'r', 'r'],
    ['r', 'y', 'y', 'r', 'y', 'y', 'y'],
    ['r', 'y', 'r', 'y', 'r', 'r', 'y'],
]

const board11 = [
    ['r', '', 'r', 'r', 'y', 'y', 'y'],
    ['y', 'r', 'r', 'y', 'y', 'r', 'r'],
    ['r', 'y', 'y', 'r', 'r', 'y', 'y'],
    ['y', 'r', 'r', 'y', 'r', 'r', 'r'],
    ['r', 'y', 'y', 'r', 'y', 'y', 'y'],
    ['r', 'y', 'r', 'y', 'r', 'r', 'y'],
]

const board12 = [
    ['', '', 'r', '', '', '', ''],
    ['', 'y', 'y', 'r', '', '', ''],
    ['y', 'r', 'r', 'r', 'y', '', ''],
    ['y', 'y', 'y', 'r', 'r', '', ''],
    ['r', 'y', 'y', 'y', 'r', '', ''],
    ['r', 'y', 'y', 'r', 'y', '', ''],
]

const testPassedMsg = (num) => console.log(`%cTest ${num} Passed `, 'background-color: #478547; color: white;');
const testFailedMsg = (num, msg) => console.log(`%cTest ${num} Failed: \n${msg}`, 'background-color: #854747; color: white;');
const testHeader = (funcName) => console.log(`\n%cTests for ${funcName}`, 'border: 1px solid white; padding: 2px; font-weight: bold;'); 

const testIsHorzVictory = () => {
    console.time('Execution Time');
    gameState.board = newBoard;
    isHorzVictory(5, 0, 'r') === false ? testPassedMsg(1) : testFailedMsg(1, "False positive for horizontal victory on first move");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board1;
    isHorzVictory(5, 3, 'r') ? testPassedMsg(2) : testFailedMsg(2, "False negative for horizontal victory when piece is placed to the right");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board2;
    isHorzVictory(5, 3, 'r') ? testPassedMsg(3) : testFailedMsg(3, "False negative for horizontal victory when piece is placed to the left");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board6;
    isHorzVictory(5, 2, 'r') ? testPassedMsg(4) : testFailedMsg(4, "False negative for horizontal victory when piece is placed in the middle");
    console.timeEnd('Execution Time');
}

const testIsVertVictory = () => {
    console.time('Execution Time');
    gameState.board = newBoard;
    isVertVictory(5, 0, 'r') === false ? testPassedMsg(1) : console.log(`%cTest 1 Failed:\nFalse positive for vertical victory on first move`, 'background-color: #854747; color: white;');
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board3;
    isVertVictory(2, 3, 'r') ? testPassedMsg(2) : testFailedMsg(2, "False negative for vertical victory");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board12;
    isVertVictory(0, 3, 'r') ? testPassedMsg(3) : testFailedMsg(3, "False negative for vertical victory when winning piece placed on top row")
    console.timeEnd('Execution Time');
}

const testIsDescDiagVictory = () => {
    console.time('Execution Time');
    gameState.board = newBoard;
    isDescDiagVictory(5, 0, 'r') === false ? testPassedMsg(1) : testFailedMsg(1, "False positive for descending diagonal victory on first move");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board5;
    isDescDiagVictory(2, 3, 'r') ? testPassedMsg(2) : testFailedMsg(2, "False negative for descending diagonal victory when piece placed at top end");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board7;
    isDescDiagVictory(5, 3, 'y') ? testPassedMsg(3) : testFailedMsg(3, "False negative for descending diagonal victory when piece place at bottom end");
    console.timeEnd('Execution Time');
}

const testIsAscDiagVictory = () => {
    console.time('Execution Time');
    gameState.board = newBoard;
    isAscDiagVictory(5, 0, 'r') === false ? testPassedMsg(1) : testFailedMsg(1, "False positive for ascending diagonal victory on first move");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board4;
    isAscDiagVictory(2, 3, 'r') ? testPassedMsg(2) : testFailedMsg(2, "False negative for ascending diagonal victory when piece placed at top end");
    console.timeEnd('Execution Time');
    
    console.time('Execution Time'); 
    gameState.board = board8;
    isAscDiagVictory(5, 3, 'y') ? testPassedMsg(3) : testFailedMsg(3, "False negative for ascending diagonal victory when piece placed at bottom end");
    console.timeEnd('Execution Time');
}

const testComputerPlay = () => {
    console.time('Execution Time');
    gameState.board = board1;
    computerPlay();
    gameState.board[5][3] === 'y' ? testPassedMsg(1) : testFailedMsg(1, "False positive");
    console.timeEnd('Execution Time');
}

const testIsDraw = () => {
    console.time('Execution Time');
    gameState.board = newBoard;
    isDraw() === false ? testPassedMsg(1) : testFailedMsg(1, "False positive");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    gameState.board = board9;
    isDraw() ? testPassedMsg(2) : testFailedMsg(2, "False negative for draw")
    console.timeEnd('Execution Time');
}

const testSetPiece = () => {
    console.time('Execution Time');
    gameState.board = newBoard;
    setPiece(4, 'r');
    gameState.board[5][4] === 'r' ? testPassedMsg(1) : testFailedMsg(1, "piece not placed or not placed in correct position");
    console.timeEnd('Execution Time');
}

const testSetName = () => {
    console.time('Execution Time');
    setName("John Smith", 1);
    gameState.player1.name === "John Smith" ? testPassedMsg(1) : testFailedMsg(1, "Player 1 name was not updated");
    console.timeEnd('Execution Time');

    console.time('Execution Time');
    setName("Jane Smith", 2);
    gameState.player2.name === "Jane Smith" ? testPassedMsg(2) : testFailedMsg(2, "Player 2 name was not updated");
    console.timeEnd('Execution Time');
}

const testAll = () => {
    testHeader("isHorizontalVictory()");
    testIsHorzVictory();

    testHeader("isVertVictory()");
    testIsVertVictory();

    testHeader("isAscDiagVictory()");
    testIsAscDiagVictory();

    testHeader("isDescDiagVictory()");
    testIsDescDiagVictory();

    testHeader("computerPlay()");
    testComputerPlay();

    testHeader("isDraw()");
    testIsDraw();

    testHeader("setPiece()");
    testSetPiece();

    testHeader("setName()");
    testSetName();
}
