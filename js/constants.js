// 游戏常量定义
export const BLOCK_SIZE = 24;
export const WIDTH = 10;
export const HEIGHT = 20;

// 方块颜色（十六进制）
export const COLORS = {
    'I': '#00FFFF',  // cyan
    'O': '#FFFF00',  // yellow
    'T': '#AA00FF',  // purple
    'S': '#00FF00',  // green
    'Z': '#FF0000',  // red
    'J': '#0000FF',  // blue
    'L': '#FF8800',  // orange
    'ghost': 'rgba(255, 255, 255, 0.3)'
};

// 方块形状定义
export const SHAPES = {
    'I': [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    'O': [[1, 1], [1, 1]],
    'T': [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    'S': [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    'Z': [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    'J': [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    'L': [[1, 0, 0], [1, 1, 1], [0, 0, 0]]
};

// 关卡速度配置（毫秒）
export const LEVEL_SPEEDS = {
    1: 1000,
    2: 900,
    3: 800,
    4: 700,
    5: 600,
    6: 500,
    7: 450,
    8: 400,
    9: 350,
    10: 300,
    11: 250,
    12: 200,
    13: 170,
    14: 140,
    15: 100
};

// 计分规则
export const SCORING = {
    SINGLE: 100,      // 1行
    DOUBLE: 300,      // 2行
    TRIPLE: 500,      // 3行
    TETRIS: 800,      // 4行
    SOFT_DROP: 1,     // 软降每格
    HARD_DROP: 2,     // 硬降每格
    COMBO_BONUS: 50   // Combo奖励
};

// 关卡升级所需行数
export const LINES_PER_LEVEL = {
    1: 10, 2: 10, 3: 10, 4: 10, 5: 10,
    6: 10, 7: 10, 8: 10, 9: 10,
    10: 15, 11: 15, 12: 15, 13: 15, 14: 15, 15: 15
};

// 按键配置
export const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    DOWN: 40,
    UP: 38,
    SPACE: 32,
    C: 67,
    P: 80,
    ESC: 27
};
