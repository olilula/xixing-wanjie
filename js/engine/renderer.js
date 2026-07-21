/**
 * 文字渲染器 - 负责所有文字输出
 */
export class Renderer {
    constructor() {
        this.outputEl = document.getElementById('text-output');
        this.maxLines = 500; // 最大保留行数
    }

    // 输出一段文字（带类型）
    print(text, type = 'normal') {
        const p = document.createElement('p');
        p.className = `text-${type}`;
        p.innerHTML = text;
        this.outputEl.appendChild(p);
        this._trim();
        this._scrollToBottom();
    }

    // 输出分隔线
    divider(char = '─', len = 50) {
        this.print(char.repeat(len), 'divider');
    }

    // 输出空行
    blank() {
        this.print('&nbsp;', 'normal');
    }

    // 输出场景描述（带格式）
    printScene(scene) {
        this.divider('═');
        this.print(`【${scene.area}·${scene.name}】`, 'highlight');
        this.blank();
        // 描述文字逐段输出
        const paragraphs = scene.description.split('\n');
        paragraphs.forEach(p => {
            if (p.trim()) this.print(p.trim(), 'scene');
        });
        this.blank();
        // NPC
        if (scene.npcs && scene.npcs.length > 0) {
            scene.npcs.forEach(npc => {
                this.print(`这里有一个 <span class="text-npc">${npc.name}</span>。`, 'normal');
            });
        }
        // 物品
        if (scene.items && scene.items.length > 0) {
            scene.items.forEach(item => {
                this.print(`地上有 <span class="text-item">${item.name}</span>。`, 'normal');
            });
        }
        // 出口
        if (scene.exits) {
            const exitStr = Object.entries(scene.exits)
                .map(([dir, target]) => `[${this._dirName(dir)}]`)
                .join(' ');
            this.print(`出口：${exitStr}`, 'exit');
        }
        this.divider('═');
    }

    // 输出战斗信息
    printCombat(text) {
        this.print(text, 'combat');
    }

    // 输出物品获得
    printItemGet(itemName, count = 1) {
        const countStr = count > 1 ? ` ×${count}` : '';
        this.print(`  获得：<span class="text-item">${itemName}</span>${countStr}`, 'item');
    }

    // 输出系统消息
    printSystem(text) {
        this.print(`[系统] ${text}`, 'system');
    }

    // 输出错误
    printError(text) {
        this.print(`[!] ${text}`, 'error');
    }

    // 输出NPC对话
    printNPC(name, text) {
        this.print(`<span class="text-npc">${name}</span>说："${text}"`, 'npc');
    }

    // 输出玩家输入回显
    printInput(cmd) {
        this.print(`&gt; ${cmd}`, 'input-echo');
    }

    // 清屏
    clear() {
        this.outputEl.innerHTML = '';
    }

    // 方向名映射
    _dirName(dir) {
        const map = {
            north: '北', south: '南', east: '东', west: '西',
            up: '上', down: '下', enter: '进', exit: '出',
            northeast: '东北', northwest: '西北',
            southeast: '东南', southwest: '西南'
        };
        return map[dir] || dir;
    }

    // 滚动到底部
    _scrollToBottom() {
        const area = document.getElementById('output-area');
        requestAnimationFrame(() => {
            area.scrollTop = area.scrollHeight;
        });
    }

    // 限制最大行数
    _trim() {
        while (this.outputEl.children.length > this.maxLines) {
            this.outputEl.removeChild(this.outputEl.firstChild);
        }
    }
}

export const renderer = new Renderer();