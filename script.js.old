const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');

const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

const BLOCK_SIZE = 24;
const WIDTH = 10;
const HEIGHT = 20;

canvas.width = WIDTH * BLOCK_SIZE;
canvas.height = HEIGHT * BLOCK_SIZE;

nextCanvas.width = 4 * BLOCK_SIZE;
nextCanvas.height = 4 * BLOCK_SIZE;

context.scale(BLOCK_SIZE, BLOCK_SIZE);
nextContext.scale(BLOCK_SIZE, BLOCK_SIZE);

const COLORS = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

const SHAPES = {
    'I': [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    'O': [[1, 1], [1, 1]],
    'T': [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    'S': [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    'Z': [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    'J': [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    'L': [[1, 0, 0], [1, 1, 1], [0, 0, 0]]
};

let board = createBoard();
let player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
    level: 1,
    linesCleared: 0,
    dropInterval: 1000,
};

let lastTime = 0;
let dropCounter = 0;

let paused = false;
let gameOver = false;

const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

function createBoard() {
    return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(board, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = COLORS[value];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function update(time = 0) {
    if (gameOver) {
        return; // Stop game loop if game is over
    }

    if (!paused) {
        const deltaTime = time - lastTime;
        lastTime = time;

        dropCounter += deltaTime;
        if (dropCounter > player.dropInterval) {
            playerDrop();
        }

        draw();
    }
    requestAnimationFrame(update);
}

function playerDrop() {
    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        merge(board, player);
        playerReset();
        boardSweep();
    }
    dropCounter = 0;
}

function playerMove(dir) {
    if (gameOver) return; // Prevent movement if game is over
    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate() {
    if (gameOver) return; // Prevent rotation if game is over
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix);
    while (collide(board, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    matrix.forEach(row => row.reverse());
}

function collide(board, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function boardSweep() {
    let rowCount = 1;
    outer: for (let y = board.length - 1; y > 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }

        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;

        player.score += rowCount * 10;
        player.linesCleared++;
        rowCount *= 2;

        // Check for level up
        if (player.linesCleared % 10 === 0 && player.level < 3) { // Level up every 10 lines, max 3 levels
            player.level++;
            player.dropInterval -= 150; // Decrease drop interval (increase speed)
        }
    }
    updateScore(); // Update score and level after sweep
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (board[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(board, player)) {
        // Game Over
        board.forEach(row => row.fill(0));
        gameOver = true;
        finalScoreElement.innerText = player.score;
        gameOverOverlay.classList.remove('hidden');
    } else {
        updateScore(); // Update score and level after reset
    }
}

function createPiece(type) {
    if (type === 'I') {
        return [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]];
    } else if (type === 'L') {
        return [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']];
    } else if (type === 'J') {
        return [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]];
    } else if (type === 'O') {
        return [['O', 'O'], ['O', 'O']];
    } else if (type === 'Z') {
        return [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]];
    } else if (type === 'S') {
        return [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]];
    } else if (type === 'T') {
        return [[0, 'T', 0], ['T', 'T', 'T'], [0, 0, 0]];
    }
}

function updateScore() {
    scoreElement.innerText = player.score;
    levelElement.innerText = player.level;
}

document.addEventListener('keydown', event => {
    if (gameOver || paused) return; // Prevent input if game is over or paused

    if (event.keyCode === 37) {
        playerMove(-1);
    } else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    } else if (event.keyCode === 38) {
        playerRotate();
    } else if (event.keyCode === 80) {
        paused = !paused;
    }
});

restartButton.addEventListener('click', () => {
    gameOver = false;
    gameOverOverlay.classList.add('hidden');
    board.forEach(row => row.fill(0));
    player.score = 0;
    player.level = 1;
    player.linesCleared = 0;
    player.dropInterval = 1000; // Reset speed
    playerReset(); // Spawn first piece
    update(); // Restart game loop
});

playerReset();
updateScore();
update();

document.getElementById('moveLeft').addEventListener('click', () => {
    if (gameOver || paused) return;
    playerMove(-1);
});
document.getElementById('moveRight').addEventListener('click', () => {
    if (gameOver || paused) return;
    playerMove(1);
});
document.getElementById('moveDown').addEventListener('click', () => {
    if (gameOver || paused) return;
    playerDrop();
});
document.getElementById('rotate').addEventListener('click', () => {
    if (gameOver || paused) return;
    playerRotate();
});
document.getElementById('pauseBtn').addEventListener('click', () => {
    if (gameOver) return; // Cannot pause if game is over
    paused = !paused;
});
