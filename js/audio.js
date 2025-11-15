// 音频管理系统
export class AudioManager {
    constructor() {
        // 创建AudioContext
        this.audioContext = null;
        this.sfxVolume = 0.3;
        this.musicVolume = 0.5;
        this.sfxEnabled = true;
        this.musicEnabled = true;
        this.initialized = false;
    }

    // 初始化音频上下文（需要用户交互后才能启用）
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('Audio system initialized');
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // 播放移动音效
    playMove() {
        if (!this.sfxEnabled) return;
        this.playTone(200, 0.05, 'square', 0.1);
    }

    // 播放旋转音效
    playRotate() {
        if (!this.sfxEnabled) return;
        this.playTone(300, 0.08, 'square', 0.15);
    }

    // 播放方块落地音效
    playLand() {
        if (!this.sfxEnabled) return;
        this.playTone(150, 0.1, 'triangle', 0.2);
    }

    // 播放消除1行音效
    playClear1() {
        if (!this.sfxEnabled) return;
        this.playSequence([
            { freq: 400, duration: 0.1 },
            { freq: 500, duration: 0.1 }
        ], 'sine', 0.2);
    }

    // 播放消除2行音效
    playClear2() {
        if (!this.sfxEnabled) return;
        this.playSequence([
            { freq: 400, duration: 0.08 },
            { freq: 500, duration: 0.08 },
            { freq: 600, duration: 0.1 }
        ], 'sine', 0.25);
    }

    // 播放消除3行音效
    playClear3() {
        if (!this.sfxEnabled) return;
        this.playSequence([
            { freq: 400, duration: 0.06 },
            { freq: 500, duration: 0.06 },
            { freq: 600, duration: 0.06 },
            { freq: 700, duration: 0.1 }
        ], 'sine', 0.3);
    }

    // 播放消除4行（Tetris）音效
    playClear4() {
        if (!this.sfxEnabled) return;
        this.playSequence([
            { freq: 523, duration: 0.1 },  // C
            { freq: 659, duration: 0.1 },  // E
            { freq: 784, duration: 0.1 },  // G
            { freq: 1047, duration: 0.15 } // C (octave)
        ], 'sine', 0.35);
    }

    // 播放Hold音效
    playHold() {
        if (!this.sfxEnabled) return;
        this.playTone(350, 0.12, 'triangle', 0.15);
    }

    // 播放Hard Drop音效
    playHardDrop() {
        if (!this.sfxEnabled) return;
        this.playSweep(800, 100, 0.15, 'sawtooth', 0.25);
    }

    // 播放升级音效
    playLevelUp() {
        if (!this.sfxEnabled) return;
        this.playSequence([
            { freq: 523, duration: 0.08 },
            { freq: 659, duration: 0.08 },
            { freq: 784, duration: 0.08 },
            { freq: 1047, duration: 0.12 },
            { freq: 784, duration: 0.08 },
            { freq: 1047, duration: 0.15 }
        ], 'square', 0.3);
    }

    // 播放游戏结束音效
    playGameOver() {
        if (!this.sfxEnabled) return;
        this.playSequence([
            { freq: 392, duration: 0.2 },
            { freq: 349, duration: 0.2 },
            { freq: 311, duration: 0.2 },
            { freq: 262, duration: 0.4 }
        ], 'sine', 0.3);
    }

    // 播放Combo音效
    playCombo(comboCount) {
        if (!this.sfxEnabled) return;
        const baseFreq = 400 + (comboCount * 50);
        this.playTone(baseFreq, 0.15, 'square', 0.2);
    }

    // 基础音调播放
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + duration
            );

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.warn('Error playing tone:', e);
        }
    }

    // 播放音符序列
    playSequence(notes, type = 'sine', volume = 0.3) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return;

        let currentTime = this.audioContext.currentTime;

        notes.forEach(note => {
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = note.freq;
                oscillator.type = type;

                gainNode.gain.setValueAtTime(volume * this.sfxVolume, currentTime);
                gainNode.gain.exponentialRampToValueAtTime(
                    0.01,
                    currentTime + note.duration
                );

                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);

                currentTime += note.duration;
            } catch (e) {
                console.warn('Error in sequence:', e);
            }
        });
    }

    // 播放扫频音效
    playSweep(startFreq, endFreq, duration, type = 'sine', volume = 0.3) {
        if (!this.initialized) this.init();
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(
                endFreq,
                this.audioContext.currentTime + duration
            );

            gainNode.gain.setValueAtTime(volume * this.sfxVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                this.audioContext.currentTime + duration
            );

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.warn('Error playing sweep:', e);
        }
    }

    // 设置音效音量
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }

    // 设置音乐音量
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    // 切换音效开关
    toggleSfx() {
        this.sfxEnabled = !this.sfxEnabled;
        return this.sfxEnabled;
    }

    // 切换音乐开关
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        return this.musicEnabled;
    }

    // 获取音效状态
    getSfxEnabled() {
        return this.sfxEnabled;
    }

    // 获取音乐状态
    getMusicEnabled() {
        return this.musicEnabled;
    }
}

// 创建全局音频管理器实例
export const audioManager = new AudioManager();
