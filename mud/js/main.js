/**
 * 游戏主入口 - 初始化 & 主循环
 */
import { gameState } from './engine/state.js';
import { renderer } from './engine/renderer.js';
import { parser } from './engine/parser.js';
import { saveSystem } from './engine/save.js';
import { mapSystem } from './systems/map.js';
import { characterSystem } from './systems/character.js';

// ===== 初始化 =====
function init() {
    bindEvents();
    showTitle();

    // 检查是否有存档
    if (saveSystem.hasAutoSave()) {
        renderer.blank();
        renderer.printSystem('检测到上次的存档。输入"读档"继续，或输入"新游戏"重新开始。');
    } else {
        startNewGame();
    }
}

// ===== 显示标题 =====
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

// ===== 新游戏 =====
function startNewGame() {
    gameState.reset();
    gameState.flags.gameStarted = true;

    renderer.blank();
    renderer.printSystem('═══ 角色创建 ═══');
    renderer.print('你是一名流落长安的孤儿，自幼在街头摸爬滚打。', 'normal');
    renderer.print('今日，你偶然听闻终南山上有仙人传道，心中不禁一动……', 'normal');
    renderer.blank();
    renderer.print('（默认角色：人族·孤儿·剑道。后续版本将开放自定义创建。）', 'system');
    renderer.blank();

    // 初始物品
    gameState.character.inventory.push(
        { name: '生锈的铁剑', type: '武器', attack: 5, quality: '凡品', description: '一把锈迹斑斑的铁剑。' },
        { name: '金创药', type: '丹药', effect: { hp: 50 }, description: '普通外伤药。' },
        { name: '干粮', type: '杂物', description: '几块硬邦邦的干饼。' }
    );
    gameState.character.copper = 50;

    // 进入第一个场景
    renderer.printSystem('═══ 游戏开始 ═══');
    renderer.blank();
    mapSystem.look();
}

// ===== 事件绑定 =====
function bindEvents() {
    const input = document.getElementById('command-input');
    const sendBtn = document.getElementById('send-btn');

    // 回车提交
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleCommand(input.value);
            input.value = '';
        }
    });

    // 按钮提交
    sendBtn.addEventListener('click', () => {
        handleCommand(input.value);
        input.value = '';
        input.focus();
    });

    // 快捷按钮
    document.querySelectorAll('#quick-nav button').forEach(btn => {
        btn.addEventListener('click', () => {
            handleCommand(btn.dataset.cmd);
            input.focus();
        });
    });

    // 点击输出区也聚焦输入框
    document.getElementById('output-area').addEventListener('click', () => {
        input.focus();
    });
}

// ===== 指令处理主函数 =====
function handleCommand(raw) {
    if (!raw || !raw.trim()) return;

    // 回显玩家输入
    renderer.printInput(raw);

    const cmd = parser.parse(raw);

    switch (cmd.type) {
        case 'move':
            mapSystem.move(cmd.direction);
            break;

        case 'system':
            handleSystemCommand(cmd.verb);
            break;

        case 'action':
            handleAction(cmd.verb, cmd.target);
            break;

        case 'unknown':
            // 特殊处理
            if (raw === '新游戏' || raw === '重新开始') {
                startNewGame();
            } else if (raw === '突破') {
                characterSystem.breakthrough();
            } else {
                renderer.print(`你不太明白"${raw}"是什么意思。（输入"帮助"查看可用指令）`);
            }
            break;

        case 'empty':
            break;
    }

    // 自动存档（每10次操作）
    gameState.stats.playTime++;
    if (gameState.stats.playTime % 10 === 0) {
        saveSystem.autoSave();
    }
}

// ===== 系统命令处理 =====
function handleSystemCommand(verb) {
    switch (verb) {
        case 'status':
            characterSystem.showStatus();
            break;
        case 'inventory':
            characterSystem.showInventory();
            break;
        case 'skills':
            renderer.printSystem('技能系统将在后续版本中开放。');
            break;
        case 'map':
            mapSystem.showMap();
            break;
        case 'save':
            saveSystem.save(1);
            break;
        case 'load':
            if (saveSystem.load(1)) {
                mapSystem.look();
            }
            break;
        case 'help':
            showHelp();
            break;
        case 'clear':
            renderer.clear();
            break;
        case 'equip_list':
            renderer.printSystem('装备系统将在后续版本中开放。');
            break;
        default:
            renderer.printError(`未知系统命令：${verb}`);
    }
}

// ===== 动作命令处理 =====
function handleAction(verb, target) {
    switch (verb) {
        case 'look':
            if (target) {
                mapSystem.lookAt(target);
            } else {
                mapSystem.look();
            }
            break;
        case 'take':
            if (target) {
                mapSystem.takeItem(target);
            } else {
                renderer.print('拿什么？');
            }
            break;
        case 'search':
            mapSystem.search();
            break;
        case 'meditate':
            characterSystem.meditate();
            break;
        case 'use':
            if (target) {
                characterSystem.useItem(target);
            } else {
                renderer.print('使用什么？');
            }
            break;
        case 'talk':
            if (target) {
                talkToNPC(target);
            } else {
                renderer.print('和谁说话？');
            }
            break;
        case 'listen':
            renderer.print('你侧耳倾听……只有风声和远处的鸟鸣。');
            break;
        default:
            renderer.print(`你还不会"${verb}"这个动作。`);
    }
}

// ===== 与NPC对话 =====
function talkToNPC(name) {
    const scene = mapSystem.getCurrentScene();
    if (!scene || !scene.npcs) {
        renderer.print('这里没有人可以交谈。');
        return;
    }
    const npc = scene.npcs.find(n => n.name === name || n.alias === name);
    if (npc) {
        if (npc.greeting) {
            renderer.printNPC(npc.name, npc.greeting);
        } else {
            renderer.print(`${npc.name}看了你一眼，没有说话。`);
        }
    } else {
        renderer.print(`这里没有叫"${name}"的人。`);
    }
}

// ===== 帮助信息 =====
function showHelp() {
    renderer.divider('═');
    renderer.print('【指令帮助】', 'highlight');
    renderer.divider('─');
    renderer.print('移动：北/南/东/西/上/下（或 n/s/e/w/u/d）', 'normal');
    renderer.print('查看：看 / 看[目标] / 搜索', 'normal');
    renderer.print('拾取：拿[物品名]', 'normal');
    renderer.print('对话：说[NPC名] / 对话[NPC名]', 'normal');
    renderer.print('修炼：打坐 / 修炼', 'normal');
    renderer.print('突破：突破（修为满时可用）', 'normal');
    renderer.print('使用：用[物品名]', 'normal');
    renderer.print('系统：状态 / 背包 / 地图 / 存档 / 读档 / 帮助 / 清屏', 'normal');
    renderer.divider('─');
    renderer.print('提示：直接输入方向字即可移动，如输入"北"或"n"。', 'system');
    renderer.divider('═');
}

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', init);