// 渲染引擎
import { BLOCK_SIZE, WIDTH, HEIGHT } from './constants.js';

// 默认颜色
const DEFAULT_COLORS = {
    'I': '#00FFFF',
    'O': '#FFFF00',
    'T': '#AA00FF',
    'S': '#00FF00',
    'Z': '#FF0000',
    'J': '#0000FF',
    'L': '#FF8800',
    'ghost': 'rgba(255, 255, 255, 0.3)'
};

export class Renderer {
    constructor(canvas, nextCanvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.nextCanvas = nextCanvas;
        this.nextContext = nextCanvas.getContext('2d');
        this.blockColors = DEFAULT_COLORS;

        // 设置Canvas尺寸
        this.canvas.width = WIDTH * BLOCK_SIZE;
        this.canvas.height = HEIGHT * BLOCK_SIZE;
        this.nextCanvas.width = 4 * BLOCK_SIZE;
        this.nextCanvas.height = 4 * BLOCK_SIZE;

        // 缩放上下文
        this.context.scale(BLOCK_SIZE, BLOCK_SIZE);
        this.nextContext.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    // 绘制游戏板
    drawBoard(board) {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, WIDTH, HEIGHT);
        this.drawMatrix(board, { x: 0, y: 0 });
    }

    // 绘制方块矩阵
    drawMatrix(matrix, offset, isGhost = false) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const color = this.getBlockColor(value);
                    this.drawBlock(x + offset.x, y + offset.y, color, isGhost);
                }
            });
        });
    }

    // 设置主题颜色
    setBlockColors(colors) {
        this.blockColors = { ...DEFAULT_COLORS, ...colors };
    }

    // 获取方块颜色
    getBlockColor(value) {
        return this.blockColors[value] || DEFAULT_COLORS[value] || '#FFFFFF';
    }

    // 绘制单个方块（带渐变效果）
    drawBlock(x, y, color, isGhost = false) {
        const ctx = this.context;

        if (isGhost) {
            // Ghost piece - 半透明轮廓
            ctx.strokeStyle = this.blockColors.ghost || 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 0.05;
            ctx.strokeRect(x + 0.05, y + 0.05, 0.9, 0.9);
        } else {
            // 创建渐变效果
            const gradient = ctx.createLinearGradient(x, y, x + 1, y + 1);
            gradient.addColorStop(0, this.lightenColor(color, 30));
            gradient.addColorStop(1, color);

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, 1, 1);

            // 添加高光效果
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(x + 0.05, y + 0.05, 0.4, 0.4);

            // 添加边框
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 0.05;
            ctx.strokeRect(x, y, 1, 1);
        }
    }

    // 颜色加亮函数
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }

    // 绘制下一个方块
    drawNextPiece(matrix) {
        this.nextContext.fillStyle = '#000';
        this.nextContext.fillRect(0, 0, 4, 4);

        if (!matrix) return;

        const offset = {
            x: (4 - matrix[0].length) / 2,
            y: (4 - matrix.length) / 2
        };

        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    const color = this.getBlockColor(value);
                    this.drawBlockInNextCanvas(x + offset.x, y + offset.y, color);
                }
            });
        });
    }

    // 在下一个方块画布上绘制方块
    drawBlockInNextCanvas(x, y, color) {
        const ctx = this.nextContext;

        // 创建渐变效果
        const gradient = ctx.createLinearGradient(x, y, x + 1, y + 1);
        gradient.addColorStop(0, this.lightenColor(color, 30));
        gradient.addColorStop(1, color);

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, 1, 1);

        // 添加高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x + 0.05, y + 0.05, 0.4, 0.4);

        // 添加边框
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 0.05;
        ctx.strokeRect(x, y, 1, 1);
    }

    // 清屏
    clear() {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, WIDTH, HEIGHT);
    }
}
