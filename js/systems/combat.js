/**
 * 战斗系统 - 回合制
 * 流程：进入战斗 → 玩家行动 → 敌人行动 → 判定 → 循环
 */
import { gameState } from '../engine/state.js';
import { renderer } from '../engine/renderer.js';
import { characterSystem } from './character.js';

export class CombatSystem {

    constructor() {
        this.inCombat = false;
        this.enemies = [];       // 当前战斗中的敌人列表
        this.turn = 0;           // 当前回合数
        this.playerDefending = false; // 玩家是否在防御
        this.fleeAttempts = 0;   // 逃跑尝试次数
        this.combatLog = [];     // 战斗日志
    }

    // ===== 进入战斗 =====
    startCombat(enemyData) {
        if (this.inCombat) {
            renderer.printError('你已经在战斗中了！');
            return false;
        }

        // 检查体力
        if (!gameState.isStaminaEnough(15)) {
            renderer.printError('体力不足，无法进入战斗！（需要15点体力）');
            return false;
        }

        // 深拷贝敌人数据（避免修改原始数据）
        const enemy = JSON.parse(JSON.stringify(enemyData));
        enemy.currentHp = enemy.hp;
        enemy.statusEffects = []; // 中毒/冰冻/眩晕等

        this.inCombat = true;
        this.enemies = [enemy];
        this.turn = 1;
        this.playerDefending = false;
        this.fleeAttempts = 0;
        this.combatLog = [];

        // 战斗开始描述
        renderer.blank();
        renderer.divider('⚔');
        renderer.print(`【战斗开始】`, 'highlight');
        renderer.print(`  ${enemy.description || `一只${enemy.name}出现了！`}`, 'combat');
        renderer.print(`  ${enemy.name}  Lv.${enemy.level}  HP:${enemy.currentHp}/${enemy.hp}`, 'combat');
        renderer.divider('─');
        renderer.print('  你的回合。输入指令：', 'system');
        renderer.print('  [攻击] [技能] [用 物品名] [防御] [逃跑]', 'system');
        renderer.divider('⚔');

        gameState.combat.inCombat = true;
        return true;
    }

    // ===== 处理玩家战斗指令 =====
    handleCombatCommand(raw) {
        if (!this.inCombat) return false;

        const input = raw.trim().toLowerCase();

        // 攻击
        if (input === '攻击' || input === '打' || input === 'a' || input === 'attack') {
            this.playerAttack();
            return true;
        }

        // 防御
        if (input === '防御' || input === '防' || input === 'defend' || input === 'd') {
            this.playerDefend();
            return true;
        }

        // 逃跑
        if (input === '逃跑' || input === '跑' || input === 'flee' || input === 'f') {
            this.playerFlee();
            return true;
        }

        // 技能（占位）
        if (input === '技能' || input === 'skill') {
            renderer.print('  你尚未习得任何战斗技能。（后续版本开放）', 'system');
            return true; // 不消耗回合
        }

        // 使用物品
        if (input.startsWith('用') || input.startsWith('使用') || input.startsWith('use')) {
            const itemName = raw.replace(/^(用|使用|use)\s*/, '').trim();
            this.playerUseItem(itemName);
            return true;
        }

        // 查看敌人
        if (input === '看' || input === '查看' || input === 'look') {
            this.showEnemyStatus();
            return true; // 不消耗回合
        }

        renderer.print('  战斗中可用：[攻击] [防御] [用 物品] [逃跑] [看]', 'system');
        return true; // 不消耗回合
    }

    // ===== 玩家普通攻击 =====
    playerAttack() {
        const c = gameState.character;
        const enemy = this.enemies[0];
        if (!enemy || enemy.currentHp <= 0) return;

        renderer.blank();
        renderer.print(`── 第${this.turn}回合 · 你的行动 ──`, 'system');

        // 计算攻击
        const bonus = characterSystem.getEquipBonus();
        const baseAtk = 5 + c.attrs.gengu * 1.5 + c.level * 2 + bonus.attack;

        // 暴击判定（身法影响）
        const critRate = 0.05 + c.attrs.shenfa * 0.008;
        const isCrit = Math.random() < critRate;

        // 命中判定
        const hitRate = 0.85 + c.attrs.shenfa * 0.005 - enemy.level * 0.01;
        const isHit = Math.random() < Math.min(0.98, hitRate);

        if (!isHit) {
            renderer.printCombat(`  你挥剑斩向${enemy.name}——但被它灵巧地躲开了！`);
        } else {
            // 伤害计算
            let dmg = Math.floor(baseAtk - enemy.defense * 0.5 + Math.random() * 6);
            if (isCrit) {
                dmg = Math.floor(dmg * 1.8);
                renderer.printCombat(`  💥 暴击！你的剑划出一道凌厉的弧光！`);
            }
            dmg = Math.max(1, dmg);

            enemy.currentHp -= dmg;
            renderer.printCombat(`  你对${enemy.name}造成了 ${dmg} 点伤害！${isCrit ? '（暴击！）' : ''}`);
            renderer.printCombat(`  ${enemy.name} HP：${Math.max(0, enemy.currentHp)}/${enemy.hp}`);

            // 吸血特效（如果有）
            if (bonus.lifesteal) {
                const heal = Math.floor(dmg * bonus.lifesteal);
                c.hp = Math.min(c.maxHp, c.hp + heal);
                renderer.printCombat(`  你汲取了 ${heal} 点生命。`);
            }
        }

        // 检查敌人是否死亡
        if (enemy.currentHp <= 0) {
            this.enemyDefeated(enemy);
            return;
        }

        // 敌人回合
        this.enemyTurn();
    }

    // ===== 玩家防御 =====
    playerDefend() {
        this.playerDefending = true;
        renderer.blank();
        renderer.print(`── 第${this.turn}回合 · 你的行动 ──`, 'system');
        renderer.printCombat(`  你举剑横于胸前，摆出防御姿态。（本回合受到伤害减半）`);

        // 防御时少量恢复
        const mpRestore = Math.floor(gameState.character.maxMp * 0.05);
        gameState.character.mp = Math.min(gameState.character.maxMp, gameState.character.mp + mpRestore);
        renderer.print(`  灵力 +${mpRestore}（调息）`, 'system');

        this.enemyTurn();
    }

    // ===== 玩家使用物品 =====
    playerUseItem(itemName) {
        const c = gameState.character;
        const inv = c.inventory;

        if (!itemName) {
            // 自动选第一个丹药
            const potion = inv.find(i => i.type === '丹药' || i.type === '消耗品');
            if (!potion) {
                renderer.print('  背包中没有可使用的物品。', 'system');
                return; // 不消耗回合
            }
            itemName = potion.name;
        }

        const idx = inv.findIndex(i => i.name === itemName);
        if (idx === -1) {
            renderer.print(`  背包中没有"${itemName}"。`, 'system');
            return;
        }

        const item = inv[idx];
        renderer.blank();
        renderer.print(`── 第${this.turn}回合 · 你的行动 ──`, 'system');

        if (item.type === '丹药' || item.type === '消耗品') {
            if (item.effect) {
                if (item.effect.hp) {
                    c.hp = Math.min(c.maxHp, c.hp + item.effect.hp);
                    renderer.printCombat(`  你服下${item.name}，恢复 ${item.effect.hp} HP。（HP:${c.hp}/${c.maxHp}）`);
                }
                if (item.effect.mp) {
                    c.mp = Math.min(c.maxMp, c.mp + item.effect.mp);
                    renderer.printCombat(`  灵力恢复 ${item.effect.mp}。（MP:${c.mp}/${c.maxMp}）`);
                }
                if (item.effect.stamina) {
                    gameState.restoreStamina(item.effect.stamina);
                    renderer.printCombat(`  体力恢复 ${item.effect.stamina}。`);
                }
            }
            inv.splice(idx, 1);
            renderer.print(`  （${item.name}已消耗）`, 'system');
        } else if (item.type === '食物' || item.edible) {
            const restore = item.staminaRestore || 20;
            gameState.restoreStamina(restore);
            renderer.printCombat(`  你匆忙吃下${item.name}，体力 +${restore}。`);
            inv.splice(idx, 1);
        } else {
            renderer.print(`  ${item.name}在战斗中无法使用。`, 'system');
            return; // 不消耗回合
        }

        this.enemyTurn();
    }

    // ===== 玩家逃跑 =====
    playerFlee() {
        this.fleeAttempts++;
        const c = gameState.character;
        const enemy = this.enemies[0];

        // 逃跑成功率：身法越高越容易跑，尝试越多越难
        let fleeRate = 0.4 + c.attrs.shenfa * 0.02 - this.fleeAttempts * 0.1;
        fleeRate = Math.max(0.1, Math.min(0.9, fleeRate));

        renderer.blank();
        renderer.print(`── 第${this.turn}回合 · 你的行动 ──`, 'system');
        renderer.printCombat(`  你转身试图逃跑……（成功率${Math.floor(fleeRate * 100)}%）`);

        if (Math.random() < fleeRate) {
            renderer.printCombat(`  你成功脱离了战斗！`);
            renderer.print('  你气喘吁吁地跑远了……', 'normal');
            this.endCombat(false);
        } else {
            renderer.printCombat(`  逃跑失败！${enemy.name}挡住了你的去路！`);
            // 逃跑失败，敌人免费攻击一次
            this.enemyTurn(true);
        }
    }

    // ===== 敌人回合 =====
    enemyTurn(freeAttack = false) {
        const c = gameState.character;
        const enemy = this.enemies[0];
        if (!enemy || enemy.currentHp <= 0) return;

        if (!freeAttack) {
            renderer.blank();
            renderer.print(`── ${enemy.name}的行动 ──`, 'system');
        }

        // 检查敌人状态效果
        let stunned = false;
        if (enemy.statusEffects) {
            for (let i = enemy.statusEffects.length - 1; i >= 0; i--) {
                const eff = enemy.statusEffects[i];
                if (eff.type === 'stun') {
                    stunned = true;
                    renderer.printCombat(`  ${enemy.name}处于眩晕状态，无法行动！`);
                    enemy.statusEffects.splice(i, 1);
                } else if (eff.type === 'poison') {
                    const poisonDmg = eff.value;
                    enemy.currentHp -= poisonDmg;
                    renderer.printCombat(`  ${enemy.name}受到毒素侵蚀，损失 ${poisonDmg} HP。`);
                    eff.duration--;
                    if (eff.duration <= 0) enemy.statusEffects.splice(i, 1);
                    if (enemy.currentHp <= 0) {
                        this.enemyDefeated(enemy);
                        return;
                    }
                } else if (eff.type === 'freeze') {
                    stunned = true;
                    renderer.printCombat(`  ${enemy.name}被冰冻，无法行动！`);
                    eff.duration--;
                    if (eff.duration <= 0) enemy.statusEffects.splice(i, 1);
                }
            }
        }

        if (stunned) {
            this._endRound();
            return;
        }

        // 敌人AI选择行动
        const action = this._enemyAI(enemy);

        switch (action) {
            case 'attack': {
                // 命中判定
                const enemyHitRate = 0.8 + enemy.level * 0.01 - c.attrs.shenfa * 0.004;
                const isHit = Math.random() < Math.min(0.95, enemyHitRate);

                if (!isHit) {
                    renderer.printCombat(`  ${enemy.name}向你扑来——你侧身闪避，堪堪躲过！`);
                } else {
                    let dmg = Math.floor(enemy.attack + Math.random() * 4 - this._getPlayerDefense() * 0.4);

                    // 防御减半
                    if (this.playerDefending) {
                        dmg = Math.floor(dmg * 0.5);
                        renderer.printCombat(`  你的防御姿态抵消了部分伤害！`);
                    }

                    // 敌人暴击
                    const enemyCrit = Math.random() < (enemy.critRate || 0.05);
                    if (enemyCrit) {
                        dmg = Math.floor(dmg * 1.5);
                        renderer.printCombat(`  💥 ${enemy.name}发动了猛烈一击！`);
                    }

                    dmg = Math.max(1, dmg);
                    c.hp -= dmg;
                    renderer.printCombat(`  ${enemy.name}对你造成了 ${dmg} 点伤害！${enemyCrit ? '（暴击）' : ''}`);
                    renderer.printCombat(`  你的HP：${Math.max(0, c.hp)}/${c.maxHp}`);
                }
                break;
            }
            case 'skill': {
                // 敌人技能
                const skill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
                renderer.printCombat(`  ${enemy.name}使用了【${skill.name}】！`);

                let dmg = Math.floor(skill.power + enemy.attack * 0.5 - this._getPlayerDefense() * 0.3);
                if (this.playerDefending) dmg = Math.floor(dmg * 0.5);
                dmg = Math.max(1, dmg);
                c.hp -= dmg;
                renderer.printCombat(`  你受到了 ${dmg} 点伤害！`);

                // 附加效果
                if (skill.effect === 'poison') {
                    renderer.printCombat(`  你感到一阵眩晕……（中毒3回合，每回合-${skill.poisonDmg}HP）`);
                    // 给玩家加中毒（简化处理）
                    c._poison = { duration: 3, value: skill.poisonDmg || 5 };
                }
                if (skill.effect === 'stun') {
                    renderer.printCombat(`  你被震得头晕目眩！（下回合无法行动）`);
                    c._stunned = true;
                }
                break;
            }
            case 'heal': {
                const healAmt = Math.floor(enemy.hp * 0.15);
                enemy.currentHp = Math.min(enemy.hp, enemy.currentHp + healAmt);
                renderer.printCombat(`  ${enemy.name}舔舐伤口，恢复了 ${healAmt} HP。（HP:${enemy.currentHp}/${enemy.hp}）`);
                break;
            }
        }

        // 检查玩家是否死亡
        if (c.hp <= 0) {
            this.playerDefeated();
            return;
        }

        this._endRound();
    }

    // ===== 敌人AI =====
    _enemyAI(enemy) {
        // 低血量时可能治疗
        if (enemy.canHeal && enemy.currentHp < enemy.hp * 0.3 && Math.random() < 0.4) {
            return 'heal';
        }
        // 有技能时概率使用
        if (enemy.skills && enemy.skills.length > 0 && Math.random() < (enemy.skillRate || 0.25)) {
            return 'skill';
        }
        return 'attack';
    }

    // ===== 回合结束处理 =====
    _endRound() {
        this.playerDefending = false;
        this.turn++;

        // 玩家中毒处理
        const c = gameState.character;
        if (c._poison && c._poison.duration > 0) {
            c.hp -= c._poison.value;
            renderer.printCombat(`  毒素侵蚀，你损失 ${c._poison.value} HP。（剩余${c._poison.duration - 1}回合）`);
            c._poison.duration--;
            if (c._poison.duration <= 0) delete c._poison;
            if (c.hp <= 0) {
                this.playerDefeated();
                return;
            }
        }

        // 玩家眩晕
        if (c._stunned) {
            delete c._stunned;
            renderer.printCombat(`  你从眩晕中恢复过来。`);
        }

        // 显示下回合提示
        renderer.blank();
        renderer.print(`── 第${this.turn}回合 · 你的行动 ──`, 'system');
        renderer.print(`  [攻击] [防御] [用 物品] [逃跑]`, 'system');
    }

    // ===== 敌人被击败 =====
    enemyDefeated(enemy) {
        renderer.blank();
        renderer.divider('─');
        renderer.printCombat(`  ⚔ ${enemy.name}倒下了！战斗胜利！`);
        renderer.divider('─');

        const c = gameState.character;

        // 经验奖励
        const expGain = enemy.expReward || 20;
        c.exp += expGain;
        renderer.print(`  修为 +${expGain}`, 'item');

        // 铜钱奖励
        const copperGain = (enemy.copperReward || 5) + Math.floor(Math.random() * 10);
        c.copper += copperGain;
        renderer.print(`  铜钱 +${copperGain}`, 'item');

        // 掉落物品
        if (enemy.drops && enemy.drops.length > 0) {
            renderer.blank();
            renderer.print('  【战利品】', 'system');
            enemy.drops.forEach(drop => {
                // 掉落概率
                const dropRate = drop.dropRate || 1.0;
                if (Math.random() < dropRate) {
                    const item = { ...drop };
                    delete item.dropRate;
                    c.inventory.push(item);
                    renderer.printItemGet(item.name);
                    gameState.stats.itemsCollected++;
                }
            });
        }

        // 稀有掉落
        if (enemy.rareDrop && Math.random() < (enemy.rareDropRate || 0.1)) {
            const rare = { ...enemy.rareDrop };
            c.inventory.push(rare);
            renderer.print(`  ✨ 稀有掉落！`, 'highlight');
            renderer.printItemGet(rare.name);
        }

        // 统计
        gameState.stats.monstersKilled++;
        if (!gameState.flags.killedMonsters[enemy.name]) {
            gameState.flags.killedMonsters[enemy.name] = 0;
        }
        gameState.flags.killedMonsters[enemy.name]++;

        // 检查升级
        if (c.exp >= c.expToNext) {
            renderer.blank();
            renderer.print(`  你感到体内灵气充盈，可以尝试突破了！（输入"突破"）`, 'highlight');
        }

        renderer.blank();
        this.endCombat(true);
    }

    // ===== 玩家被击败 =====
    playerDefeated() {
        const c = gameState.character;
        renderer.blank();
        renderer.divider('─');
        renderer.printCombat(`  你眼前一黑，倒在了地上……`);
        renderer.printCombat(`  【你被击败了】`);
        renderer.divider('─');

        // 死亡惩罚
        c.hp = Math.floor(c.maxHp * 0.3);
        c.mp = Math.floor(c.maxMp * 0.3);
        c.stamina = Math.floor(c.maxStamina * 0.5);

        // 损失铜钱
        const copperLoss = Math.floor(c.copper * 0.1);
        c.copper -= copperLoss;

        // 损失修为
        const expLoss = Math.floor(c.exp * 0.1);
        c.exp -= expLoss;

        gameState.stats.deaths++;

        renderer.print(`  你在昏迷中失去了：`, 'system');
        renderer.print(`    铜钱 -${copperLoss}  修为 -${expLoss}`, 'combat');
        renderer.print(`  你被路过的樵夫救起，醒来时已在安全之处。`, 'normal');

        // 回到安全场景
        gameState.world.currentScene = 'changan_south_gate';

        renderer.blank();
        this.endCombat(false);
    }

    // ===== 结束战斗 =====
    endCombat(victory) {
        this.inCombat = false;
        this.enemies = [];
        this.turn = 0;
        this.playerDefending = false;
        this.fleeAttempts = 0;
        gameState.combat.inCombat = false;

        if (victory) {
            renderer.print('  战斗结束。你收剑入鞘，继续前行。', 'normal');
        }
        renderer.blank();
    }

    // ===== 显示敌人状态 =====
    showEnemyStatus() {
        const enemy = this.enemies[0];
        if (!enemy) return;
        renderer.blank();
        renderer.print(`  【${enemy.name}】 Lv.${enemy.level}`, 'combat');
        renderer.print(`  HP：${enemy.currentHp}/${enemy.hp}`, 'combat');
        renderer.print(`  攻击：${enemy.attack}  防御：${enemy.defense}`, 'combat');
        if (enemy.statusEffects && enemy.statusEffects.length > 0) {
            const effects = enemy.statusEffects.map(e => e.type).join('、');
            renderer.print(`  状态：${effects}`, 'combat');
        }
        renderer.blank();
    }

    // ===== 获取玩家防御值 =====
    _getPlayerDefense() {
        const c = gameState.character;
        const bonus = characterSystem.getEquipBonus();
        return c.attrs.gengu * 0.5 + bonus.defense + c.level;
    }

    // ===== 是否在战斗中 =====
    isInCombat() {
        return this.inCombat;
    }
}

export const combatSystem = new CombatSystem();
