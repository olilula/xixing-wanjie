/**
 * 游戏主入口（v2.0 - 接入战斗系统）
 */
import { gameState } from './engine/state.js';
import { renderer } from './engine/renderer.js';
import { parser } from './engine/parser.js';
import { saveSystem } from './engine/save.js';
import { mapSystem } from './systems/map.js';
import { characterSystem } from './systems/character.js';
import { combatSystem } from './systems/combat.js';

function init() {
    bindEvents();
    showTitle();

    if (saveSystem.hasAutoSave()) {
        renderer.blank();
        renderer.printSystem('检测到上次的存档。输入"读档"继续，或输入"新游戏"重新开始。');
    } else {
        startNewGame();
    }
}

function showTitle() {
    renderer.clear();
    renderer.print(`
<pre style="color:#ffd700;font-size:12px;line-height:1.3;">
╔══════════════════════════════════════════╗
║                                        ║
║        西 行 · 万 劫                   ║
║                                        ║
║   Journey of Ten Thousand Tribulations  ║
║                                        ║
║        ── 单机文字MUD ──               ║
║                                        ║
╚══════════════════════════════════════════╝
</pre>`, 'normal');
    renderer.print('  三界茫茫，万劫轮回。你的西游，由你书写。', 'system');
    renderer.divider('═');
}

function startNewGame() {
    gameState.reset();
    gameState.flags.gameStarted = true;

    renderer.blank();
    renderer.printSystem('═══ 角色创建 ═══');
    renderer.print('你是一名流落长安的孤儿，自幼在街头摸爬滚打。', 'normal');
    renderer.print('今日，你偶然听闻终南山上有仙人传道，心中不禁一动……', 'normal');
    renderer.blank();
    renderer.print('（默认角色：人族·孤儿·剑道）', 'system');
    renderer.blank();

    gameState.character.inventory.push(
        {
            name: '生锈的铁剑', type: '武器', quality: '凡品',
            attack: 5, levelReq: 1,
            description: '一把锈迹斑斑的铁剑。'
        },
        {
            name: '粗布衣', type: '防具', quality: '凡品',
            defense: 3, levelReq: 1,
            description: '普通的粗布衣裳。'
        },
        {
            name: '金创药', type: '丹药', quality: '凡品',
            effect: { hp: 50 },
            description: '普通外伤药。'
        },
        {
            name: '干粮', type: '食物', quality: '凡品',
            staminaRestore: 25, edible: true,
            description: '几块硬邦邦的干饼。'
        }
    );
    gameState.character.copper = 50;

    renderer.printSystem('═══ 游戏开始 ═══');
    renderer.blank();
    mapSystem.look();
    updateStatusBar();
}

function bindEvents() {
    const input = document.getElementById('command-input');
    const sendBtn = document.getElementById('send-btn');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleCommand(input.value);
            input.value = '';
        }
    });

    sendBtn.addEventListener('click', () => {
        handleCommand(input.value);
        input.value = '';
        input.focus();
    });

    document.querySelectorAll('#quick-nav button').forEach(btn => {
        btn.addEventListener('click', () => {
            handleCommand(btn.dataset.cmd);
            input.focus();
        });
    });

    document.getElementById('output-area').addEventListener('click', () => {
        input.focus();
    });
}

// ===== 主指令处理 =====
function handleCommand(raw) {
    if (!raw || !raw.trim()) return;

    renderer.printInput(raw);

    // ===== 战斗中：所有指令交给战斗系统 =====
    if (combatSystem.isInCombat()) {
        combatSystem.handleCombatCommand(raw);
        updateStatusBar();
        return;
    }
    // ==========================================

    const cmd = parser.parse(raw);

    switch (cmd.type) {
        case 'move':
            mapSystem.move(cmd.direction);
            break;
        case 'system':
            handleSystemCommand(cmd.verb);
            break;
        case 'quick':
            handleQuickCommand(cmd.verb);
            break;
        case 'action':
            handleAction(cmd.verb, cmd.target);
            break;
        case 'unknown':
            renderer.print(`你不太明白"${cmd.raw}"是什么意思。（输入"帮助"查看可用指令）`);
            break;
        case 'empty':
            break;
    }

    gameState.stats.playTime++;
    if (gameState.stats.playTime % 10 === 0) {
        saveSystem.autoSave();
    }
    updateStatusBar();
}

function handleQuickCommand(verb) {
    switch (verb) {
        case 'talk':
            mapSystem.talkToNPC(null);
            break;
        case 'take':
            mapSystem.takeItem(null);
            break;
        case 'attack':
            handleAttack(null);
            break;
        case 'meditate':
            characterSystem.meditate();
            break;
        case 'rest':
            characterSystem.rest();
            break;
    }
}

function handleSystemCommand(verb) {
    switch (verb) {
        case 'status': characterSystem.showStatus(); break;
        case 'inventory': characterSystem.showInventory(); break;
        case 'skills': renderer.printSystem('技能系统将在后续版本中开放。'); break;
        case 'map': mapSystem.showMap(); break;
        case 'save': saveSystem.save(1); break;
        case 'load':
            if (saveSystem.load(1)) mapSystem.look();
            break;
        case 'help': showHelp(); break;
        case 'clear': renderer.clear(); break;
        case 'equip_list': characterSystem.showEquipList(); break;
        case 'newgame': startNewGame(); break;
        default: renderer.printError(`未知命令：${verb}`);
    }
}

function handleAction(verb, target) {
    switch (verb) {
        case 'look':
            if (target) mapSystem.lookAt(target);
            else mapSystem.look();
            break;
        case 'take': mapSystem.takeItem(target); break;
        case 'search': mapSystem.search(); break;
        case 'meditate': characterSystem.meditate(); break;
        case 'rest': characterSystem.rest(); break;
        case 'eat': characterSystem.eat(target); break;
        case 'use': characterSystem.useItem(target); break;
        case 'equip': characterSystem.equipItem(target); break;
        case 'unequip': characterSystem.unequipItem(target); break;
        case 'talk': mapSystem.talkToNPC(target); break;
        case 'attack': handleAttack(target); break;
        case 'breakthrough': characterSystem.breakthrough(); break;
        case 'listen': renderer.print('你侧耳倾听……只有风声和远处的鸟鸣。'); break;
        default: renderer.print(`你还不会"${verb}"这个动作。`);
    }
}

// ===== 攻击/进入战斗 =====
function handleAttack(target) {
    const scene = mapSystem.getCurrentScene();

    if (!scene || !scene.monsters || scene.monsters.length === 0) {
        renderer.print('这里没有可以攻击的目标。');
        return;
    }

    let enemy;
    if (!target) {
        enemy = scene.monsters[0];
        renderer.print(`（自动选择目标：${enemy.name}）`, 'system');
    } else {
        enemy = scene.monsters.find(m => m.name === target);
    }

    if (!enemy) {
        renderer.print(`这里没有"${target}"。`);
        return;
    }

    // 进入战斗
    const started = combatSystem.startCombat(enemy);
    if (started) {
        // 从场景中移除怪物（战斗结束后不恢复）
        const idx = scene.monsters.indexOf(enemy);
        if (idx > -1) scene.monsters.splice(idx, 1);
    }
}

function showHelp() {
    renderer.divider('═');
    renderer.print('【指令帮助】', 'highlight');
    renderer.divider('─');
    renderer.print('移动：北/南/东/西/上/下（或 n/s/e/w/u/d）', 'normal');
    renderer.print('查看：看 / 看[目标] / 搜索', 'normal');
    renderer.print('拾取：拿[物品名] / 拾取（自动）', 'normal');
    renderer.print('对话：说[NPC名] / 对话（自动）', 'normal');
    renderer.print('攻击：攻击[怪物名] / 攻击（自动）→ 进入战斗', 'normal');
    renderer.print('修炼：打坐（消耗体力）', 'normal');
    renderer.print('休息：休息（恢复体力）', 'normal');
    renderer.print('饮食：吃[食物名]', 'normal');
    renderer.print('装备：穿[装备名] / 卸下[装备名] / 装备栏', 'normal');
    renderer.print('使用：用[物品名]', 'normal');
    renderer.print('突破：突破（修为满时）', 'normal');
    renderer.print('系统：状态 / 背包 / 地图 / 存档 / 读档 / 帮助 / 清屏', 'normal');
    renderer.divider('─');
    renderer.print('【战斗中指令】', 'highlight');
    renderer.print('  攻击 / 防御 / 用[物品] / 逃跑 / 看（查看敌人）', 'normal');
    renderer.divider('─');
    renderer.print('体力：打坐-10 战斗-15 突破-20 | 休息+30 食物+20~40', 'system');
    renderer.divider('═');
}

function updateStatusBar() {
    renderer.updateStatusBar(gameState);
}

document.addEventListener('DOMContentLoaded', init);
