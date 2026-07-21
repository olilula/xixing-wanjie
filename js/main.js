/**
 * 游戏主入口（v1.1 - 新指令路由/体力/装备）
 */
import { gameState } from './engine/state.js';
import { renderer } from './engine/renderer.js';
import { parser } from './engine/parser.js';
import { saveSystem } from './engine/save.js';
import { mapSystem } from './systems/map.js';
import { characterSystem } from './systems/character.js';

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
    renderer.print('（默认角色：人族·孤儿·剑道。后续版本将开放自定义创建。）', 'system');
    renderer.blank();

    // 初始物品（增加数值）
    gameState.character.inventory.push(
        {
            name: '生锈的铁剑', type: '武器', quality: '凡品',
            attack: 5, levelReq: 1,
            description: '一把锈迹斑斑的铁剑，剑身有缺口，但勉强还能用。'
        },
        {
            name: '粗布衣', type: '防具', quality: '凡品',
            defense: 3, levelReq: 1,
            description: '普通的粗布衣裳，聊胜于无。'
        },
        {
            name: '金创药', type: '丹药', quality: '凡品',
            effect: { hp: 50 },
            description: '普通外伤药，涂抹后可止血生肌。'
        },
        {
            name: '干粮', type: '食物', quality: '凡品',
            staminaRestore: 25, edible: true,
            description: '几块硬邦邦的干饼，能填饱肚子。'
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

function handleCommand(raw) {
    if (!raw || !raw.trim()) return;

    renderer.printInput(raw);
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

    // 每次操作后更新状态栏
    updateStatusBar();
}

// ===== 新增：快捷指令处理（默认目标） =====
function handleQuickCommand(verb) {
    switch (verb) {
        case 'talk':
            mapSystem.talkToNPC(null); // null = 默认第一个NPC
            break;
        case 'take':
            mapSystem.takeItem(null); // null = 默认第一个物品
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
// ========================================

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
            characterSystem.showEquipList();
            break;
        case 'newgame':
            startNewGame();
            break;
        default:
            renderer.printError(`未知命令：${verb}`);
    }
}

function handleAction(verb, target) {
    switch (verb) {
        case 'look':
            if (target) mapSystem.lookAt(target);
            else mapSystem.look();
            break;
        case 'take':
            mapSystem.takeItem(target);
            break;
        case 'search':
            mapSystem.search();
            break;
        case 'meditate':
            characterSystem.meditate();
            break;
        case 'rest':
            characterSystem.rest();
            break;
        case 'eat':
            characterSystem.eat(target);
            break;
        case 'use':
            characterSystem.useItem(target);
            break;
        case 'equip':
            characterSystem.equipItem(target);
            break;
        case 'unequip':
            characterSystem.unequipItem(target);
            break;
        case 'talk':
            mapSystem.talkToNPC(target);
            break;
        case 'attack':
            handleAttack(target);
            break;
        case 'breakthrough':
            characterSystem.breakthrough();
            break;
        case 'listen':
            renderer.print('你侧耳倾听……只有风声和远处的鸟鸣。');
            break;
        default:
            renderer.print(`你还不会"${verb}"这个动作。`);
    }
}

// ===== 新增：攻击处理（占位，第2批实现完整战斗） =====
function handleAttack(target) {
    const scene = mapSystem.getCurrentScene();

    // 检查场景中是否有怪物
    if (!scene || !scene.monsters || scene.monsters.length === 0) {
        renderer.print('这里没有可以攻击的目标。');
        return;
    }

    const enemy = target
        ? scene.monsters.find(m => m.name === target)
        : scene.monsters[0];

    if (!enemy) {
        renderer.print(`这里没有"${target}"。`);
        return;
    }

    // 检查体力
    if (!gameState.isStaminaEnough(15)) {
        renderer.printError('体力不足！战斗需要至少15点体力。');
        return;
    }

    renderer.print(`你握紧武器，向${enemy.name}发起攻击！`, 'combat');
    renderer.printSystem('（完整战斗系统将在第2批代码中实现，当前为简化版）');
    renderer.blank();

    // 简化战斗
    gameState.consumeStamina(15);
    const bonus = characterSystem.getEquipBonus();
    const playerAtk = 10 + gameState.character.attrs.gengu + bonus.attack;
    const dmg = playerAtk + Math.floor(Math.random() * 5);

    renderer.printCombat(`  你造成了 ${dmg} 点伤害！`);
    renderer.print(`  体力 -15（剩余：${gameState.character.stamina}）`, 'system');

    // 简单击杀判定
    if (!enemy.hp) enemy.hp = 50;
    enemy.hp -= dmg;

    if (enemy.hp <= 0) {
        renderer.printCombat(`  ${enemy.name}被击败了！`);
        gameState.stats.monstersKilled++;
        // 移除怪物
        const idx = scene.monsters.indexOf(enemy);
        if (idx > -1) scene.monsters.splice(idx, 1);
        // 奖励
        const expGain = enemy.expReward || 20;
        gameState.character.exp += expGain;
        renderer.print(`  获得修为 +${expGain}`, 'item');
        if (enemy.drops) {
            enemy.drops.forEach(d => {
                gameState.character.inventory.push(d);
                renderer.printItemGet(d.name);
            });
        }
    } else {
        renderer.printCombat(`  ${enemy.name}还剩 ${enemy.hp} 点生命，它怒吼着向你扑来！`);
        const enemyDmg = (enemy.attack || 8) + Math.floor(Math.random() * 3);
        const defense = characterSystem.getEquipBonus().defense;
        const actualDmg = Math.max(1, enemyDmg - defense);
        gameState.character.hp -= actualDmg;
        renderer.printCombat(`  你受到了 ${actualDmg} 点伤害！（HP:${gameState.character.hp}/${gameState.character.maxHp}）`);

        if (gameState.character.hp <= 0) {
            gameState.character.hp = 1;
            renderer.printError('你险些丧命！勉强稳住身形……');
        }
    }
}
// ========================================

function showHelp() {
    renderer.divider('═');
    renderer.print('【指令帮助】', 'highlight');
    renderer.divider('─');
    renderer.print('移动：北/南/东/西/上/下（或 n/s/e/w/u/d）', 'normal');
    renderer.print('查看：看 / 看[目标] / 搜索', 'normal');
    renderer.print('拾取：拿[物品名] / 拾取（自动选第一个）', 'normal');
    renderer.print('对话：说[NPC名] / 对话（自动选第一个）', 'normal');
    renderer.print('攻击：攻击[怪物名] / 攻击（自动选第一个）', 'normal');
    renderer.print('修炼：打坐 / 修炼（消耗体力）', 'normal');
    renderer.print('休息：休息（恢复体力）', 'normal');
    renderer.print('饮食：吃[食物名]（恢复体力）', 'normal');
    renderer.print('装备：穿[装备名] / 卸下[装备名] / 装备栏', 'normal');
    renderer.print('使用：用[物品名]（丹药等）', 'normal');
    renderer.print('突破：突破（修为满时可用，消耗体力）', 'normal');
    renderer.print('系统：状态 / 背包 / 地图 / 存档 / 读档 / 帮助 / 清屏', 'normal');
    renderer.divider('─');
    renderer.print('体力系统：打坐-10 战斗-15 突破-20 | 休息+30 食物+20~40', 'system');
    renderer.divider('═');
}

// ===== 更新状态栏 =====
function updateStatusBar() {
    renderer.updateStatusBar(gameState);
}

document.addEventListener('DOMContentLoaded', init);
