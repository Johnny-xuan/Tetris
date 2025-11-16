// 主题系统
export const THEMES = {
    cyberpunk: {
        name: '赛博朋克',
        colors: {
            background: '#0a0a1a',
            primary: '#00FFFF',
            secondary: '#FF00FF',
            accent: '#00AAFF',
            text: '#00FFFF',
            scoreValue: '#FF00FF',
            comboValue: '#FFD700',
            blocks: {
                'I': '#00FFFF',
                'O': '#FFFF00',
                'T': '#AA00FF',
                'S': '#00FF00',
                'Z': '#FF0000',
                'J': '#0000FF',
                'L': '#FF8800'
            }
        },
        shadows: '0 0 15px rgba(0, 255, 255, 0.6), 0 0 30px rgba(0, 170, 255, 0.4)'
    },
    retro: {
        name: '经典复古',
        colors: {
            background: '#8bac0f',
            primary: '#306230',
            secondary: '#0f380f',
            accent: '#9bbc0f',
            text: '#0f380f',
            scoreValue: '#306230',
            comboValue: '#0f380f',
            blocks: {
                'I': '#0f380f',
                'O': '#0f380f',
                'T': '#0f380f',
                'S': '#0f380f',
                'Z': '#0f380f',
                'J': '#0f380f',
                'L': '#0f380f'
            }
        },
        shadows: '2px 2px 4px rgba(0, 0, 0, 0.3)'
    },
    neon: {
        name: '未来霓虹',
        colors: {
            background: '#1a001a',
            primary: '#FF6EC7',
            secondary: '#39FF14',
            accent: '#FFFF00',
            text: '#FF6EC7',
            scoreValue: '#39FF14',
            comboValue: '#FFFF00',
            blocks: {
                'I': '#FF00FF',
                'O': '#FFFF00',
                'T': '#FF6EC7',
                'S': '#39FF14',
                'Z': '#FF1493',
                'J': '#00BFFF',
                'L': '#FF8C00'
            }
        },
        shadows: '0 0 20px rgba(255, 110, 199, 0.8), 0 0 40px rgba(57, 255, 20, 0.5)'
    },
    dark: {
        name: '暗黑模式',
        colors: {
            background: '#121212',
            primary: '#FFFFFF',
            secondary: '#B0B0B0',
            accent: '#BB86FC',
            text: '#FFFFFF',
            scoreValue: '#BB86FC',
            comboValue: '#03DAC6',
            blocks: {
                'I': '#6200EE',
                'O': '#BB86FC',
                'T': '#03DAC6',
                'S': '#018786',
                'Z': '#CF6679',
                'J': '#3700B3',
                'L': '#9C27B0'
            }
        },
        shadows: '0 0 10px rgba(187, 134, 252, 0.3)'
    },
    candy: {
        name: '彩虹糖果',
        colors: {
            background: '#FFF5E1',
            primary: '#FF69B4',
            secondary: '#FFD700',
            accent: '#FF1493',
            text: '#FF1493',
            scoreValue: '#FF69B4',
            comboValue: '#FFD700',
            blocks: {
                'I': '#FF1493',
                'O': '#FFD700',
                'T': '#FF69B4',
                'S': '#00FA9A',
                'Z': '#FF6347',
                'J': '#1E90FF',
                'L': '#FF8C00'
            }
        },
        shadows: '0 0 15px rgba(255, 105, 180, 0.5)'
    }
};

export class ThemeManager {
    constructor() {
        this.currentTheme = 'cyberpunk';
    }

    // 应用主题
    applyTheme(themeName) {
        if (!THEMES[themeName]) {
            console.warn(`Theme ${themeName} not found`);
            return;
        }

        this.currentTheme = themeName;
        const theme = THEMES[themeName];
        const root = document.documentElement;

        // 应用CSS变量
        root.style.setProperty('--bg-color', theme.colors.background);
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--secondary-color', theme.colors.secondary);
        root.style.setProperty('--accent-color', theme.colors.accent);
        root.style.setProperty('--text-color', theme.colors.text);
        root.style.setProperty('--score-value-color', theme.colors.scoreValue);
        root.style.setProperty('--combo-value-color', theme.colors.comboValue);
        root.style.setProperty('--box-shadow', theme.shadows);

        // 更新body背景色
        document.body.style.backgroundColor = theme.colors.background;
    }

    // 获取当前主题的方块颜色
    getBlockColors() {
        return THEMES[this.currentTheme].colors.blocks;
    }

    // 获取主题列表
    getThemeList() {
        return Object.keys(THEMES).map(key => ({
            id: key,
            name: THEMES[key].name
        }));
    }

    // 获取当前主题
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// 导出全局主题管理器
export const themeManager = new ThemeManager();
