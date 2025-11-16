// 主题系统
export const THEMES = {
    cyberpunk: {
        name: '赛博朋克',
        gradients: {
            gradient1: '#1a0a2e',
            gradient2: '#16213e',
            gradient3: '#0f3460'
        },
        colors: {
            background: '#0a0a1a',
            primary: '#00FFFF',
            secondary: '#FF00FF',
            accent: '#00AAFF',
            text: '#00FFFF',
            scoreValue: '#FF00FF',
            comboValue: '#FFD700',
            glassBg: 'rgba(255, 255, 255, 0.05)',
            glassBorder: 'rgba(255, 255, 255, 0.1)',
            shadowColor: 'rgba(0, 255, 255, 0.3)',
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
        gradients: {
            gradient1: '#0f380f',
            gradient2: '#306230',
            gradient3: '#8bac0f'
        },
        colors: {
            background: '#8bac0f',
            primary: '#306230',
            secondary: '#0f380f',
            accent: '#9bbc0f',
            text: '#0f380f',
            scoreValue: '#306230',
            comboValue: '#0f380f',
            glassBg: 'rgba(15, 56, 15, 0.3)',
            glassBorder: 'rgba(155, 188, 15, 0.4)',
            shadowColor: 'rgba(48, 98, 48, 0.5)',
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
        gradients: {
            gradient1: '#1a001a',
            gradient2: '#2d1b2d',
            gradient3: '#4a1a4a'
        },
        colors: {
            background: '#1a001a',
            primary: '#FF6EC7',
            secondary: '#39FF14',
            accent: '#FFFF00',
            text: '#FF6EC7',
            scoreValue: '#39FF14',
            comboValue: '#FFFF00',
            glassBg: 'rgba(255, 110, 199, 0.08)',
            glassBorder: 'rgba(255, 110, 199, 0.2)',
            shadowColor: 'rgba(255, 110, 199, 0.4)',
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
        gradients: {
            gradient1: '#000000',
            gradient2: '#1a1a1a',
            gradient3: '#2d1a3d'
        },
        colors: {
            background: '#121212',
            primary: '#FFFFFF',
            secondary: '#B0B0B0',
            accent: '#BB86FC',
            text: '#FFFFFF',
            scoreValue: '#BB86FC',
            comboValue: '#03DAC6',
            glassBg: 'rgba(255, 255, 255, 0.03)',
            glassBorder: 'rgba(187, 134, 252, 0.2)',
            shadowColor: 'rgba(187, 134, 252, 0.3)',
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
        gradients: {
            gradient1: '#FFE5F0',
            gradient2: '#FFB3D9',
            gradient3: '#FF8EC3'
        },
        colors: {
            background: '#FFF5E1',
            primary: '#FF69B4',
            secondary: '#FFD700',
            accent: '#FF1493',
            text: '#FF1493',
            scoreValue: '#FF69B4',
            comboValue: '#FFD700',
            glassBg: 'rgba(255, 255, 255, 0.4)',
            glassBorder: 'rgba(255, 105, 180, 0.3)',
            shadowColor: 'rgba(255, 105, 180, 0.4)',
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
        this.initThemeSwitcher();
    }

    // 初始化主题切换器
    initThemeSwitcher() {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const themeName = btn.getAttribute('data-theme');
                this.applyTheme(themeName);
                this.updateActiveButton(themeName);
            });
        });

        // 设置初始激活状态
        this.updateActiveButton(this.currentTheme);
    }

    // 更新激活按钮状态
    updateActiveButton(themeName) {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === themeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
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

        // 应用CSS变量 - 背景渐变
        root.style.setProperty('--bg-gradient-1', theme.gradients.gradient1);
        root.style.setProperty('--bg-gradient-2', theme.gradients.gradient2);
        root.style.setProperty('--bg-gradient-3', theme.gradients.gradient3);

        // 应用CSS变量 - 颜色
        root.style.setProperty('--bg-color', theme.colors.background);
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--secondary-color', theme.colors.secondary);
        root.style.setProperty('--accent-color', theme.colors.accent);
        root.style.setProperty('--text-color', theme.colors.text);
        root.style.setProperty('--score-value-color', theme.colors.scoreValue);
        root.style.setProperty('--combo-value-color', theme.colors.comboValue);

        // 应用玻璃拟态相关变量
        root.style.setProperty('--glass-bg', theme.colors.glassBg);
        root.style.setProperty('--glass-border', theme.colors.glassBorder);
        root.style.setProperty('--shadow-color', theme.colors.shadowColor);

        root.style.setProperty('--box-shadow', theme.shadows);
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
