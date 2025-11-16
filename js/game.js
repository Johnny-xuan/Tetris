// 游戏核心逻辑
import { WIDTH, HEIGHT, SHAPES, LEVEL_SPEEDS, SCORING, LINES_PER_LEVEL } from './constants.js';
import { Renderer } from './renderer.js';
import { audioManager } from './audio.js';
import { ParticleSystem } from './particles.js';

export class Game {
    constructor(canvas, nextCanvas) {
        this.renderer = new Renderer(canvas, nextCanvas);
        this.particles = new ParticleSystem(canvas);
        this.storageManager = null;  // 将在main.js中设置
        this.themeManager = null;     // 将在main.js中设置
        this.gameStartTime = Date.now();

        // 游戏状态
        this.board = this.createBoard();
        this.player = {
            pos: { x: 0, y: 0 },
            matrix: null,
            score: 0,
            level: 1,
            linesCleared: 0,
            dropInterval: LEVEL_SPEEDS[1],
        };

        this.nextPiece = null;
        this.heldPiece = null;
        this.canHold = true;
        this.combo = 0;

        this.lastTime = 0;
        this.dropCounter = 0;
        this.paused = false;
        this.gameOver = false;

        // Ghost piece位置
        this.ghostPos = { x: 0, y: 0 };

        // UI元素
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.linesElement = document.getElementById('lines');
        this.comboElement = document.getElementById('combo');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        this.finalScoreElement = document.getElementById('finalScore');
        this.restartButton = document.getElementById('restartButton');

        this.setupRestartButton();
    }

    // 创建游戏板
    createBoard() {
        return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));
    }

    // 创建方块
    createPiece(type) {
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

    // 随机生成方块
    randomPiece() {
        const pieces = 'ILJOTSZ';
        const type = pieces[Math.floor(Math.random() * pieces.length)];
        return this.createPiece(type);
    }

    // 重置玩家方块
    resetPlayer() {
        this.player.matrix = this.nextPiece || this.randomPiece();
        this.nextPiece = this.randomPiece();
        this.player.pos.y = 0;
        this.player.pos.x = Math.floor(WIDTH / 2) - Math.floor(this.player.matrix[0].length / 2);
        this.canHold = true;

        if (this.collide(this.board, this.player)) {
            // 游戏结束
            this.triggerGameOver();
        } else {
            this.updateGhostPosition();
            this.updateUI();
            this.renderer.drawNextPiece(this.nextPiece);
        }
    }

    // 移动玩家方块
    movePlayer(dir) {
        this.player.pos.x += dir;
        if (this.collide(this.board, this.player)) {
            this.player.pos.x -= dir;
        } else {
            this.updateGhostPosition();
            audioManager.playMove();
        }
    }

    // 旋转玩家方块
    rotatePlayer() {
        const pos = this.player.pos.x;
        let offset = 1;
        this.rotate(this.player.matrix);

        while (this.collide(this.board, this.player)) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix[0].length) {
                this.rotate(this.player.matrix);
                this.player.pos.x = pos;
                return;
            }
        }
        this.updateGhostPosition();
        audioManager.playRotate();
    }

    // 旋转矩阵
    rotate(matrix) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        matrix.forEach(row => row.reverse());
    }

    // 软降（按下键）
    softDrop() {
        this.player.pos.y++;
        if (this.collide(this.board, this.player)) {
            this.player.pos.y--;
            this.merge(this.board, this.player);
            audioManager.playLand();
            this.resetPlayer();
            this.sweep();
        } else {
            this.player.score += SCORING.SOFT_DROP;
            this.updateUI();
        }
        this.dropCounter = 0;
    }

    // 硬降（一键到底）
    hardDrop() {
        let dropDistance = 0;
        while (!this.collide(this.board, this.player)) {
            this.player.pos.y++;
            dropDistance++;
        }
        this.player.pos.y--;
        dropDistance--;

        this.player.score += dropDistance * SCORING.HARD_DROP;
        audioManager.playHardDrop();

        // 创建Hard Drop粒子效果
        this.particles.createHardDropImpact(this.player.pos.x, this.player.pos.y);

        this.merge(this.board, this.player);
        audioManager.playLand();
        this.resetPlayer();
        this.sweep();
        this.dropCounter = 0;
    }

    // Hold功能
    holdPiece() {
        if (!this.canHold) return;

        audioManager.playHold();

        if (this.heldPiece === null) {
            this.heldPiece = this.player.matrix;
            this.resetPlayer();
        } else {
            const temp = this.heldPiece;
            this.heldPiece = this.player.matrix;
            this.player.matrix = temp;
            this.player.pos.y = 0;
            this.player.pos.x = Math.floor(WIDTH / 2) - Math.floor(this.player.matrix[0].length / 2);
        }

        this.canHold = false;
        this.updateGhostPosition();
        this.drawHeldPiece();
    }

    // 绘制Hold方块
    drawHeldPiece() {
        const holdCanvas = document.getElementById('hold');
        if (!holdCanvas) return;

        const holdContext = holdCanvas.getContext('2d');
        const BLOCK_SIZE = 24;

        // 清空canvas
        holdContext.fillStyle = '#000';
        holdContext.fillRect(0, 0, holdCanvas.width, holdCanvas.height);

        if (!this.heldPiece) return;

        // 计算缩放比例
        const scale = BLOCK_SIZE;
        holdContext.save();
        holdContext.scale(scale, scale);

        const offset = {
            x: (4 - this.heldPiece[0].length) / 2,
            y: (4 - this.heldPiece.length) / 2
        };

        // 手动绘制hold方块
        this.heldPiece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const color = this.renderer.constructor.name ?
                        this.getColorFromConstants(value) : '#FFFFFF';
                    this.drawBlockInHoldCanvas(holdContext, x + offset.x, y + offset.y, color);
                }
            });
        });

        holdContext.restore();
    }

    // 获取颜色（支持主题系统）
    getColorFromConstants(value) {
        if (this.themeManager) {
            const themeColors = this.themeManager.getBlockColors();
            return themeColors[value] || '#FFFFFF';
        }

        // 默认颜色
        const colors = {
            'I': '#00FFFF',
            'O': '#FFFF00',
            'T': '#AA00FF',
            'S': '#00FF00',
            'Z': '#FF0000',
            'J': '#0000FF',
            'L': '#FF8800'
        };
        return colors[value] || '#FFFFFF';
    }

    // 在Hold canvas上绘制方块
    drawBlockInHoldCanvas(ctx, x, y, color) {
        // 创建渐变
        const gradient = ctx.createLinearGradient(x, y, x + 1, y + 1);
        gradient.addColorStop(0, this.lightenColorSimple(color, 30));
        gradient.addColorStop(1, color);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, 1, 1);

        // 高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x + 0.05, y + 0.05, 0.4, 0.4);

        // 边框
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 0.05;
        ctx.strokeRect(x, y, 1, 1);
    }

    // 简化的颜色加亮函数
    lightenColorSimple(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }

    // 更新Ghost Piece位置
    updateGhostPosition() {
        this.ghostPos.x = this.player.pos.x;
        this.ghostPos.y = this.player.pos.y;

        while (!this.collide(this.board, { pos: this.ghostPos, matrix: this.player.matrix })) {
            this.ghostPos.y++;
        }
        this.ghostPos.y--;
    }

    // 自动下落
    playerDrop() {
        this.player.pos.y++;
        if (this.collide(this.board, this.player)) {
            this.player.pos.y--;
            this.merge(this.board, this.player);
            audioManager.playLand();
            this.resetPlayer();
            this.sweep();
        }
        this.dropCounter = 0;
    }

    // 碰撞检测
    collide(board, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                    (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    // 合并方块到游戏板
    merge(board, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    board[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    // 清除完整行
    sweep() {
        let linesCleared = 0;
        let clearedLinePositions = [];

        outer: for (let y = this.board.length - 1; y > 0; --y) {
            for (let x = 0; x < this.board[y].length; ++x) {
                if (this.board[y][x] === 0) {
                    continue outer;
                }
            }

            clearedLinePositions.push(y);
            const row = this.board.splice(y, 1)[0].fill(0);
            this.board.unshift(row);
            ++y;
            linesCleared++;
        }

        if (linesCleared > 0) {
            // 创建粒子效果
            const avgY = clearedLinePositions.reduce((a, b) => a + b, 0) / clearedLinePositions.length;
            if (linesCleared === 4) {
                this.particles.createTetrisExplosion(avgY);
            } else {
                this.particles.createLineClearExplosion(avgY, linesCleared);
            }

            // 播放消行音效
            switch (linesCleared) {
                case 1:
                    audioManager.playClear1();
                    break;
                case 2:
                    audioManager.playClear2();
                    break;
                case 3:
                    audioManager.playClear3();
                    break;
                case 4:
                    audioManager.playClear4();
                    break;
            }

            this.updateScore(linesCleared);
            this.combo++;

            // 播放Combo音效和创建Combo粒子
            if (this.combo > 1) {
                audioManager.playCombo(this.combo);
                this.particles.createComboEffect(this.combo);
            }
        } else {
            this.combo = 0;
        }

        this.updateUI();
    }

    // 更新分数
    updateScore(linesCleared) {
        const level = this.player.level;

        switch (linesCleared) {
            case 1:
                this.player.score += SCORING.SINGLE * level;
                break;
            case 2:
                this.player.score += SCORING.DOUBLE * level;
                break;
            case 3:
                this.player.score += SCORING.TRIPLE * level;
                break;
            case 4:
                this.player.score += SCORING.TETRIS * level;
                break;
        }

        // Combo奖励
        if (this.combo > 1) {
            this.player.score += SCORING.COMBO_BONUS * this.combo * level;
        }

        this.player.linesCleared += linesCleared;

        // 检查是否升级
        this.checkLevelUp();
    }

    // 检查是否升级
    checkLevelUp() {
        const currentLevel = this.player.level;
        if (currentLevel >= 15) return; // 最高15级

        const linesNeeded = LINES_PER_LEVEL[currentLevel];
        const totalLinesForNextLevel = Object.keys(LINES_PER_LEVEL)
            .filter(l => l < currentLevel)
            .reduce((sum, l) => sum + LINES_PER_LEVEL[l], 0) + linesNeeded;

        if (this.player.linesCleared >= totalLinesForNextLevel) {
            this.player.level++;
            this.player.dropInterval = LEVEL_SPEEDS[this.player.level];
            audioManager.playLevelUp();
            this.particles.createLevelUpFireworks();
        }
    }

    // 更新UI
    updateUI() {
        if (this.scoreElement) this.scoreElement.innerText = this.player.score;
        if (this.levelElement) this.levelElement.innerText = this.player.level;
        if (this.linesElement) this.linesElement.innerText = this.player.linesCleared;
        if (this.comboElement) {
            this.comboElement.innerText = this.combo > 1 ? `${this.combo}x` : '';
        }
    }

    // 游戏循环
    update(time = 0) {
        if (this.gameOver) return;

        if (!this.paused) {
            const deltaTime = time - this.lastTime;
            this.lastTime = time;

            this.dropCounter += deltaTime;
            if (this.dropCounter > this.player.dropInterval) {
                this.playerDrop();
            }

            // 更新粒子
            this.particles.update(deltaTime);

            this.draw();
        }

        requestAnimationFrame((t) => this.update(t));
    }

    // 绘制游戏画面
    draw() {
        this.renderer.drawBoard(this.board);

        // 绘制Ghost Piece
        if (this.player.matrix) {
            this.renderer.drawMatrix(this.player.matrix, this.ghostPos, true);
        }

        // 绘制当前方块
        if (this.player.matrix) {
            this.renderer.drawMatrix(this.player.matrix, this.player.pos);
        }

        // 绘制粒子效果
        this.particles.draw();
    }

    // 暂停/继续
    togglePause() {
        this.paused = !this.paused;
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.innerText = this.paused ? 'Resume' : 'Pause';
        }
    }

    // 游戏结束
    triggerGameOver() {
        this.gameOver = true;
        this.board.forEach(row => row.fill(0));
        audioManager.playGameOver();

        // 保存游戏记录
        if (this.storageManager) {
            const duration = Math.floor((Date.now() - this.gameStartTime) / 1000);
            this.storageManager.addGameRecord(
                'classic',
                this.player.score,
                this.player.level,
                this.player.linesCleared,
                duration
            );
            this.storageManager.updateBestCombo(this.combo);
        }

        if (this.finalScoreElement) {
            this.finalScoreElement.innerText = this.player.score;
        }
        if (this.gameOverOverlay) {
            this.gameOverOverlay.classList.remove('hidden');
        }
    }

    // 重启游戏
    restart() {
        this.gameOver = false;
        if (this.gameOverOverlay) {
            this.gameOverOverlay.classList.add('hidden');
        }

        this.board = this.createBoard();
        this.player.score = 0;
        this.player.level = 1;
        this.player.linesCleared = 0;
        this.player.dropInterval = LEVEL_SPEEDS[1];
        this.combo = 0;
        this.heldPiece = null;
        this.canHold = true;
        this.particles.clear();
        this.gameStartTime = Date.now();

        this.resetPlayer();
        this.update();
    }

    // 设置重启按钮
    setupRestartButton() {
        if (this.restartButton) {
            this.restartButton.addEventListener('click', () => {
                this.restart();
            });
        }
    }

    // 开始游戏
    start() {
        // 初始化音频系统（需要用户交互）
        document.addEventListener('click', () => {
            audioManager.init();
        }, { once: true });

        document.addEventListener('keydown', () => {
            audioManager.init();
        }, { once: true });

        // 应用主题颜色到渲染器
        if (this.themeManager) {
            this.renderer.setBlockColors(this.themeManager.getBlockColors());
        }

        this.resetPlayer();
        this.updateUI();
        this.update();
    }
}
