/**
 * 文字渲染器（v1.1 - 状态栏增加体力显示）
 */
export class Renderer {
    constructor() {
        this.outputEl = document.getElementById('text-output');
        this.maxLines = 500;
    }

    print(text, type = 'normal') {
        const p = document.createElement('p');
        p.className = `text-${type}`;
        p.innerHTML = text;
        this.outputEl.appendChild(p);
        this._trim();
        this._scrollToBottom();
    }

    divider(char = '─', len = 50) {
        this.print(char.repeat(len), 'divider');
    }

    blank() {
        this.print('&nbsp;', 'normal');
    }

    printScene(scene) {
        this.divider('═');
        this.print(`【${scene.area}·${scene.name}】`, 'highlight');
        this.blank();
        const paragraphs = scene.description.split('\n');
        paragraphs.forEach(p => {
            if (p.trim()) this.print(p.trim(), 'scene');
        });
        this.blank();
        if (scene.npcs && scene.npcs.length > 0) {
            scene.npcs.forEach(npc => {
                this.print(`这里有一个 <span class="text-npc">${npc.name}</span>。`, 'normal');
            });
        }
        if (scene.items && scene.items.length > 0) {
            scene.items.forEach(item => {
                this.print(`地上有 <span class="text-item">${item.name}</span>。`, 'normal');
            });
        }
        if (scene.exits) {
            const exitStr = Object.entries(scene.exits)
                .map(([dir]) => `[${this._dirName(dir)}]`)
                .join(' ');
            this.print(`出口：${exitStr}`, 'exit');
        }
        this.divider('═');
    }

    printCombat(text) { this.print(text, 'combat'); }

    printItemGet(itemName, count = 1) {
        const countStr = count > 1 ? ` ×${count}` : '';
        this.print(`  获得：<span class="text-item">${itemName}</span>${countStr}`, 'item');
    }

    printSystem(text) { this.print(`[系统] ${text}`, 'system'); }
    printError(text) { this.print(`[!] ${text}`, 'error'); }
    printNPC(name, text) { this.print(`<span class="text-npc">${name}</span>说："${text}"`, 'npc'); }
    printInput(cmd) { this.print(`&gt; ${cmd}`, 'input-echo'); }

    clear() { this.outputEl.innerHTML = ''; }

    // ===== 新增：更新顶部状态栏 =====
    updateStatusBar(gameState) {
        const c = gameState.character;
        const w = gameState.world;

        document.getElementById('char-info').textContent =
            `${c.name} | ${gameState.getRealmDisplay()} Lv.${c.level}`;

        document.getElementById('hp-mp-info').textContent =
            `HP:${c.hp}/${c.maxHp} MP:${c.mp}/${c.maxMp}`;

        document.getElementById('stamina-info').textContent =
            `体力:${c.stamina}/${c.maxStamina}`;

        document.getElementById('resource-info').textContent =
            `🪙${c.copper} | 💎${c.lingshi}`;

        document.getElementById('time-info').textContent =
            gameState.getTimeDisplay();
    }
    // ==================================

    _dirName(dir) {
        const map = {
            north: '北', south: '南', east: '东', west: '西',
            up: '上', down: '下', enter: '进', exit: '出',
            northeast: '东北', northwest: '西北',
            southeast: '东南', southwest: '西南'
        };
        return map[dir] || dir;
    }

    _scrollToBottom() {
        const area = document.getElementById('output-area');
        requestAnimationFrame(() => { area.scrollTop = area.scrollHeight; });
    }

    _trim() {
        while (this.outputEl.children.length > this.maxLines) {
            this.outputEl.removeChild(this.outputEl.firstChild);
        }
    }
}

export const renderer = new Renderer();
