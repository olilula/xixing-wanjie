/**
 * 指令解析器（v1.1 - 增加快捷指令）
 */
export class Parser {
    constructor() {
        this.directions = {
            '北': 'north', 'n': 'north', 'north': 'north',
            '南': 'south', 's': 'south', 'south': 'south',
            '东': 'east', 'e': 'east', 'east': 'east',
            '西': 'west', 'w': 'west', 'west': 'west',
            '上': 'up', 'u': 'up', 'up': 'up',
            '下': 'down', 'd': 'down', 'down': 'down',
            '进': 'enter', '进入': 'enter',
            '出': 'exit', '出去': 'exit',
            '东北': 'northeast', 'ne': 'northeast',
            '西北': 'northwest', 'nw': 'northwest',
            '东南': 'southeast', 'se': 'southeast',
            '西南': 'southwest', 'sw': 'southwest',
        };

        this.verbs = {
            '看': 'look', '观察': 'look', '查看': 'look', 'l': 'look', 'look': 'look',
            '拿': 'take', '拾取': 'take', '捡起': 'take', '取': 'take', 'take': 'take', 'get': 'take',
            '说': 'talk', '对话': 'talk', '交谈': 'talk', 'talk': 'talk',
            '打': 'attack', '攻击': 'attack', '杀': 'attack', 'attack': 'attack', 'kill': 'attack',
            '用': 'use', '使用': 'use', 'use': 'use',
            '买': 'buy', '购买': 'buy', 'buy': 'buy',
            '卖': 'sell', '出售': 'sell', 'sell': 'sell',
            '学': 'learn', '学习': 'learn', 'learn': 'learn',
            '搜': 'search', '搜索': 'search', '搜查': 'search', 'search': 'search',
            '听': 'listen', 'listen': 'listen',
            '坐': 'meditate', '打坐': 'meditate', '修炼': 'meditate', 'meditate': 'meditate',
            '走': 'go', '去': 'go', '前往': 'go',
            // ===== 新增 =====
            '穿': 'equip', '装备': 'equip', '戴上': 'equip', 'equip': 'equip',
            '脱': 'unequip', '卸下': 'unequip', 'unequip': 'unequip',
            '吃': 'eat', '食': 'eat', 'eat': 'eat',
            '休息': 'rest', 'rest': 'rest',
        };

        this.systemCmds = {
            '状态': 'status', '属性': 'status', 'status': 'status', 'st': 'status',
            '背包': 'inventory', '物品': 'inventory', 'inventory': 'inventory', 'inv': 'inventory', 'i': 'inventory',
            '技能': 'skills', '武功': 'skills', 'skills': 'skills',
            '地图': 'map', 'map': 'map', 'm': 'map',
            '存档': 'save', '保存': 'save', 'save': 'save',
            '读档': 'load', '加载': 'load', 'load': 'load',
            '帮助': 'help', 'help': 'help', 'h': 'help', '?': 'help',
            '清屏': 'clear', 'clear': 'clear', 'cls': 'clear',
            '装备栏': 'equip_list',
        };
    }

    parse(input) {
        const raw = input.trim();
        if (!raw) return { type: 'empty', raw };

        const lower = raw.toLowerCase();

        // 1. 方向
        if (this.directions[lower] || this.directions[raw]) {
            return {
                type: 'move',
                direction: this.directions[lower] || this.directions[raw],
                raw
            };
        }

        // 2. 系统命令
        if (this.systemCmds[raw] || this.systemCmds[lower]) {
            return {
                type: 'system',
                verb: this.systemCmds[raw] || this.systemCmds[lower],
                raw
            };
        }

        // 3. 快捷指令（无目标，使用默认目标）
        const quickCmds = {
            '对话': { type: 'quick', verb: 'talk' },
            '拾取': { type: 'quick', verb: 'take' },
            '攻击': { type: 'quick', verb: 'attack' },
            '打坐': { type: 'quick', verb: 'meditate' },
            '休息': { type: 'quick', verb: 'rest' },
        };
        if (quickCmds[raw]) {
            return { ...quickCmds[raw], target: null, raw };
        }

        // 4. 动词 + 目标
        const parts = this._tokenize(raw);
        if (parts.length >= 1) {
            const firstWord = parts[0];
            const verb = this.verbs[firstWord] || this.verbs[firstWord.toLowerCase()];
            if (verb) {
                const target = parts.slice(1).join(' ');
                return {
                    type: 'action',
                    verb,
                    target: target || null,
                    raw
                };
            }
        }

        // 5. "去 + 方向"
        if (raw.startsWith('去') || raw.startsWith('往')) {
            const dirPart = raw.substring(1).trim();
            const dir = this.directions[dirPart];
            if (dir) {
                return { type: 'move', direction: dir, raw };
            }
        }

        // 6. 特殊命令
        if (raw === '突破') {
            return { type: 'action', verb: 'breakthrough', target: null, raw };
        }
        if (raw === '新游戏' || raw === '重新开始') {
            return { type: 'system', verb: 'newgame', raw };
        }

        return { type: 'unknown', raw };
    }

    _tokenize(input) {
        let parts = input.split(/\s+/).filter(p => p);
        if (parts.length > 1) return parts;
        for (const verb of Object.keys(this.verbs)) {
            if (input.startsWith(verb) && input.length > verb.length) {
                return [verb, input.substring(verb.length).trim()];
            }
        }
        return parts;
    }
}

export const parser = new Parser();
