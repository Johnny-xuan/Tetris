// 数据持久化系统
export class StorageManager {
    constructor() {
        this.storageKey = 'cyberBlocksData';
        this.data = this.load();
    }

    // 加载数据
    load() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load data:', e);
        }

        // 默认数据结构
        return {
            settings: {
                theme: 'cyberpunk',
                sfxVolume: 0.3,
                musicVolume: 0.5,
                sfxEnabled: true,
                musicEnabled: true
            },
            stats: {
                totalGames: 0,
                totalLines: 0,
                totalScore: 0,
                totalPlayTime: 0,
                totalTetris: 0,
                bestCombo: 0,
                bestLevel: 0
            },
            highScores: {
                classic: [],
                marathon: [],
                sprint: [],
                timeAttack: []
            },
            achievements: {
                unlocked: [],
                progress: {}
            }
        };
    }

    // 保存数据
    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            return true;
        } catch (e) {
            console.error('Failed to save data:', e);
            return false;
        }
    }

    // 获取设置
    getSettings() {
        return this.data.settings;
    }

    // 更新设置
    updateSettings(settings) {
        this.data.settings = { ...this.data.settings, ...settings };
        this.save();
    }

    // 获取统计数据
    getStats() {
        return this.data.stats;
    }

    // 更新统计数据
    updateStats(stats) {
        this.data.stats = { ...this.data.stats, ...stats };
        this.save();
    }

    // 添加游戏记录
    addGameRecord(mode, score, level, lines, duration) {
        // 更新统计
        this.data.stats.totalGames++;
        this.data.stats.totalLines += lines;
        this.data.stats.totalScore += score;
        this.data.stats.totalPlayTime += duration;
        this.data.stats.bestLevel = Math.max(this.data.stats.bestLevel, level);

        // 添加到高分榜
        if (!this.data.highScores[mode]) {
            this.data.highScores[mode] = [];
        }

        this.data.highScores[mode].push({
            score,
            level,
            lines,
            date: new Date().toISOString(),
            duration
        });

        // 按分数排序并只保留前10名
        this.data.highScores[mode].sort((a, b) => b.score - a.score);
        this.data.highScores[mode] = this.data.highScores[mode].slice(0, 10);

        this.save();
    }

    // 获取高分榜
    getHighScores(mode = 'classic') {
        return this.data.highScores[mode] || [];
    }

    // 获取最高分
    getTopScore(mode = 'classic') {
        const scores = this.getHighScores(mode);
        return scores.length > 0 ? scores[0].score : 0;
    }

    // 更新最佳Combo
    updateBestCombo(combo) {
        if (combo > this.data.stats.bestCombo) {
            this.data.stats.bestCombo = combo;
            this.save();
        }
    }

    // 成就系统
    unlockAchievement(achievementId) {
        if (!this.data.achievements.unlocked.includes(achievementId)) {
            this.data.achievements.unlocked.push(achievementId);
            this.save();
            return true;
        }
        return false;
    }

    getUnlockedAchievements() {
        return this.data.achievements.unlocked;
    }

    isAchievementUnlocked(achievementId) {
        return this.data.achievements.unlocked.includes(achievementId);
    }

    // 清空数据（重置）
    reset() {
        if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
            localStorage.removeItem(this.storageKey);
            this.data = this.load();
            return true;
        }
        return false;
    }

    // 导出数据
    export() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cyber-blocks-save.json';
        link.click();
        URL.revokeObjectURL(url);
    }

    // 导入数据
    import(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            this.data = { ...this.data, ...imported };
            this.save();
            return true;
        } catch (e) {
            console.error('Failed to import data:', e);
            return false;
        }
    }
}

// 导出全局存储管理器
export const storageManager = new StorageManager();
