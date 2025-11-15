// 粒子系统
import { BLOCK_SIZE } from './constants.js';

class Particle {
    constructor(x, y, vx, vy, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 2;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.vy += 0.5 * deltaTime; // 重力
        this.life -= deltaTime;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

export class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
    }

    // 创建消行爆炸效果
    createLineClearExplosion(lineY, lineCount) {
        const colors = ['#00FFFF', '#FF00FF', '#FFD700', '#00FF00', '#FF0000'];
        const particleCount = 20 * lineCount;

        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = lineY * BLOCK_SIZE + Math.random() * BLOCK_SIZE;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 100; // 向上爆炸
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = Math.random() * 0.5 + 0.5;

            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    // 创建Tetris特殊效果
    createTetrisExplosion(lineY) {
        const colors = ['#FFD700', '#FFA500', '#FF1493', '#00FFFF'];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = lineY * BLOCK_SIZE + Math.random() * (BLOCK_SIZE * 4);
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 150 + 100;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 150;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = Math.random() * 0.8 + 0.7;

            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    // 创建Combo效果
    createComboEffect(comboCount) {
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;
        const particleCount = comboCount * 10;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 100 + comboCount * 20;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = '#FFD700';
            const life = 0.5;

            this.particles.push(new Particle(x, y, vx, vy, color, life));
        }
    }

    // 创建Hard Drop冲击波
    createHardDropImpact(x, y) {
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const px = x * BLOCK_SIZE + Math.random() * BLOCK_SIZE * 4;
            const py = y * BLOCK_SIZE;
            const angle = Math.random() * Math.PI - Math.PI / 2; // 向两侧
            const speed = Math.random() * 150 + 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = '#00FFFF';
            const life = 0.3;

            this.particles.push(new Particle(px, py, vx, vy, color, life));
        }
    }

    // 创建关卡提升烟花
    createLevelUpFireworks() {
        const colors = ['#00FFFF', '#FF00FF', '#FFD700', '#00FF00'];
        const bursts = 5;

        for (let b = 0; b < bursts; b++) {
            setTimeout(() => {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * this.canvas.height * 0.5;
                const particleCount = 50;

                for (let i = 0; i < particleCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 100 + 50;
                    const vx = Math.cos(angle) * speed;
                    const vy = Math.sin(angle) * speed;
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    const life = 0.8;

                    this.particles.push(new Particle(x, y, vx, vy, color, life));
                }
            }, b * 200);
        }
    }

    // 更新所有粒子
    update(deltaTime) {
        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime / 1000); // 转换为秒

            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 绘制所有粒子
    draw() {
        this.particles.forEach(particle => {
            particle.draw(this.ctx);
        });
    }

    // 清空所有粒子
    clear() {
        this.particles = [];
    }
}
