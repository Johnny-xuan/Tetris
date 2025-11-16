# CYBER BLOCKS - 赛博朋克俄罗斯方块 2.0

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0-ff00ff.svg)]()
[![Status](https://img.shields.io/badge/status-商业化版本-00ff00.svg)]()

这是一个完全重构的**商业化标准**俄罗斯方块游戏，融合了赛博朋克主题、现代游戏机制和丰富的视觉/音效系统。

## 在线体验

**立即游玩：** [https://web-tetris-by-johnny.netlify.app/](https://web-tetris-by-johnny.netlify.app/)

## 核心特性 v2.0

### 游戏机制增强
- Hard Drop（硬降）：空格键一键落底，快速放置方块
- Ghost Piece（幽灵方块）：半透明预览显示方块落地位置
- Hold功能：C键保留当前方块，战略性更强
- 15级难度系统：渐进式速度提升，挑战性更高
- 标准计分系统：Single/Double/Triple/Tetris 分别计分
- Combo连击系统：连续消行获得额外奖励
- 方块渐变渲染：带高光和阴影的精美方块

### 视觉系统
- 粒子特效系统：
  - 消行爆炸效果
  - Tetris（4行）特殊爆炸
  - Hard Drop冲击波
  - 关卡提升烟花
  - Combo连击粒子

### 音频系统
- 完整音效（Web Audio API合成）：
  - 方块移动/旋转音效
  - 方块落地音效
  - 消行音效（1-4行不同音效）
  - Hard Drop和Hold音效
  - 关卡提升音效
  - 游戏结束音效
  - Combo连击音效

### 主题系统
- 5套完整主题：
  1. 赛博朋克（Cyberpunk）- 霓虹青+洋红
  2. 经典复古（Retro）- Game Boy绿色风格
  3. 未来霓虹（Neon）- 粉+绿霓虹配色
  4. 暗黑模式（Dark）- 纯黑+紫色
  5. 彩虹糖果（Candy）- 明亮糖果色系
- 流畅主题切换：0.5秒过渡动画

### 数据持久化
- 本地高分榜：Top 10最高分记录
- 统计数据追踪：
  - 总游戏局数
  - 总消行数
  - 最佳Combo
  - 最高等级
  - 游戏总时长
- 自动保存：游戏结束自动保存记录
- 设置保存：主题、音量等偏好设置

### 响应式设计
- 桌面端优化：完整键盘控制
- 移动端优化：触摸按钮和自适应布局
- Hold和Next显示：更好的UI布局

## 操作指南

### 键盘控制 (桌面端)
| 按键 | 功能 |
|------|------|
| ← → | 左右移动方块 |
| ↑ | 旋转方块 |
| ↓ | 软降（加速下落） |
| SPACE | Hard Drop（一键落底） |
| C | Hold（保留方块） |
| P / ESC | 暂停/继续 |

### 触摸控制 (移动端)
- ◄ ► - 左右移动
- ▼ - 软降
- ↻ - 旋转
- HOLD - 保留方块
- DROP - Hard Drop
- PAUSE - 暂停

## 计分规则

```
消除1行（Single）: 100 × 关卡
消除2行（Double）: 300 × 关卡
消除3行（Triple）: 500 × 关卡
消除4行（Tetris）: 800 × 关卡

软降: 1分/格
硬降: 2分/格
Combo奖励: 50 × 连击数 × 关卡
```

## 技术架构

### 前端技术栈
- HTML5 + CSS3：现代Web标准
- 原生JavaScript (ES6+)：模块化架构
- Canvas API：高性能2D渲染
- Web Audio API：实时音效合成

### 模块化结构
```
/js
├── main.js          # 主入口
├── game.js          # 游戏核心逻辑
├── renderer.js      # 渲染引擎
├── input.js         # 输入处理
├── audio.js         # 音频管理
├── particles.js     # 粒子系统
├── storage.js       # 数据持久化
├── themes.js        # 主题管理
└── constants.js     # 游戏常量
```

### 性能优化
- requestAnimationFrame游戏循环
- Canvas离屏渲染优化
- 粒子系统自动清理
- 事件监听器优化

## 本地运行

### 方法1：直接打开
```bash
git clone https://github.com/Johnny-xuan/Tetris.git
cd Tetris
# 直接在浏览器中打开 index.html
```

### 方法2：本地服务器
```bash
# Python 3
python3 -m http.server 8000

# 访问 http://localhost:8000
```

## 版本历史

### v2.0 - 商业化升级 (2025-11-15)
- 全面重构代码架构（模块化）
- 新增Hard Drop、Ghost Piece、Hold功能
- 完整音效系统（11种音效）
- 粒子特效系统
- 5套主题系统
- 数据持久化和高分榜
- 15级难度系统
- 标准计分和Combo系统
- 方块渐变渲染
- 完整统计数据追踪

### v1.0 - 初始版本
- 基础俄罗斯方块功能
- 赛博朋克主题
- 3级难度系统
- 移动端支持

## 未来计划

- 背景音乐系统（3首BGM）
- 成就系统（30+成就）
- 多游戏模式（马拉松、Sprint、限时）
- 在线排行榜
- 社交分享功能
- PWA支持（离线游戏）
- 自定义按键映射
- 游戏回放系统

## 许可证

MIT License - 自由使用和修改

## 作者

Johnny Xuan

## 致谢

- 感谢经典俄罗斯方块的灵感
- 感谢赛博朋克艺术风格
- 使用Web Audio API生成音效

---

**享受游戏！Have Fun!**
