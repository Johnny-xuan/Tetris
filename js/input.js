// 输入处理系统
import { KEYS } from './constants.js';

export class InputHandler {
    constructor(game) {
        this.game = game;
        this.setupKeyboard();
        this.setupMobileControls();
    }

    // 设置键盘事件
    setupKeyboard() {
        document.addEventListener('keydown', (event) => {
            if (this.game.gameOver || this.game.paused) {
                if (event.keyCode === KEYS.P || event.keyCode === KEYS.ESC) {
                    this.game.togglePause();
                }
                return;
            }

            switch (event.keyCode) {
                case KEYS.LEFT:
                    this.game.movePlayer(-1);
                    break;
                case KEYS.RIGHT:
                    this.game.movePlayer(1);
                    break;
                case KEYS.DOWN:
                    this.game.softDrop();
                    break;
                case KEYS.UP:
                    this.game.rotatePlayer();
                    break;
                case KEYS.SPACE:
                    this.game.hardDrop();
                    break;
                case KEYS.C:
                    this.game.holdPiece();
                    break;
                case KEYS.P:
                case KEYS.ESC:
                    this.game.togglePause();
                    break;
            }
        });
    }

    // 设置移动端控制
    setupMobileControls() {
        const buttons = {
            moveLeft: document.getElementById('moveLeft'),
            moveRight: document.getElementById('moveRight'),
            moveDown: document.getElementById('moveDown'),
            rotate: document.getElementById('rotate'),
            pauseBtn: document.getElementById('pauseBtn'),
            hardDrop: document.getElementById('hardDrop'),
            hold: document.getElementById('hold')
        };

        if (buttons.moveLeft) {
            buttons.moveLeft.addEventListener('click', () => {
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.movePlayer(-1);
                }
            });
        }

        if (buttons.moveRight) {
            buttons.moveRight.addEventListener('click', () => {
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.movePlayer(1);
                }
            });
        }

        if (buttons.moveDown) {
            buttons.moveDown.addEventListener('click', () => {
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.softDrop();
                }
            });
        }

        if (buttons.rotate) {
            buttons.rotate.addEventListener('click', () => {
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.rotatePlayer();
                }
            });
        }

        if (buttons.pauseBtn) {
            buttons.pauseBtn.addEventListener('click', () => {
                if (!this.game.gameOver) {
                    this.game.togglePause();
                }
            });
        }

        if (buttons.hardDrop) {
            buttons.hardDrop.addEventListener('click', () => {
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.hardDrop();
                }
            });
        }

        if (buttons.hold) {
            buttons.hold.addEventListener('click', () => {
                if (!this.game.gameOver && !this.game.paused) {
                    this.game.holdPiece();
                }
            });
        }
    }
}
