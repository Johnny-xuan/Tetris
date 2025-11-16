// 主入口文件
import { Game } from './game.js';
import { InputHandler } from './input.js';
import { themeManager } from './themes.js';
import { storageManager } from './storage.js';
import { audioManager } from './audio.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('tetris');
    const nextCanvas = document.getElementById('next');

    if (!canvas || !nextCanvas) {
        console.error('Canvas elements not found!');
        return;
    }

    // 加载保存的设置
    const settings = storageManager.getSettings();

    // 应用主题
    themeManager.applyTheme(settings.theme);

    // 应用音频设置
    audioManager.setSfxVolume(settings.sfxVolume);
    audioManager.setMusicVolume(settings.musicVolume);
    if (!settings.sfxEnabled) audioManager.toggleSfx();
    if (!settings.musicEnabled) audioManager.toggleMusic();

    // 创建游戏实例
    const game = new Game(canvas, nextCanvas);

    // 传递存储管理器给游戏
    game.storageManager = storageManager;
    game.themeManager = themeManager;

    // 设置输入处理
    new InputHandler(game);

    // 开始游戏
    game.start();

    // 初始化帮助模态框
    initHelpModal();

    // 显示统计信息
    const stats = storageManager.getStats();
    console.log('=== CYBER BLOCKS ===');
    console.log('Total Games:', stats.totalGames);
    console.log('Best Score:', storageManager.getTopScore('classic'));
    console.log('Total Lines:', stats.totalLines);
    console.log('Best Combo:', stats.bestCombo);
    console.log('Best Level:', stats.bestLevel);
    console.log('==================');
});

// 初始化帮助模态框
function initHelpModal() {
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.getElementById('closeHelp');

    if (!helpBtn || !helpModal || !closeHelp) {
        return;
    }

    // 打开帮助模态框
    helpBtn.addEventListener('click', () => {
        helpModal.classList.remove('hidden');
    });

    // 关闭帮助模态框
    closeHelp.addEventListener('click', () => {
        helpModal.classList.add('hidden');
    });

    // 点击模态框外部关闭
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.add('hidden');
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
            helpModal.classList.add('hidden');
        }
    });
}
