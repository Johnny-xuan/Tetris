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
    dropInterval: 1000,
};

let lastTime = 0;
let dropCounter = 0;

let paused = false;

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
    player.pos.x += dir;
    if (collide(board, player)) {
        player.pos.x -= dir;
    }
}

function playerRotate() {
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
        rowCount *= 2;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (board[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(board, player)) {
        board.forEach(row => row.fill(0));
        player.score = 0;
    }
}

function createPiece(type) {
    if (type === 'I') {
        return [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]];
    } else if (type === 'L') {
        return [[0, 2, 0], [0, 2, 0], [0, 2, 2]];
    } else if (type === 'J') {
        return [[0, 3, 0], [0, 3, 0], [3, 3, 0]];
    } else if (type === 'O') {
        return [[4, 4], [4, 4]];
    } else if (type === 'Z') {
        return [[5, 5, 0], [0, 5, 5], [0, 0, 0]];
    } else if (type === 'S') {
        return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
    } else if (type === 'T') {
        return [[0, 7, 0], [7, 7, 7], [0, 0, 0]];
    }
}

function updateScore() {
    scoreElement.innerText = player.score;
    levelElement.innerText = player.level;
}

document.addEventListener('keydown', event => {
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

playerReset();
updateScore();
update();
