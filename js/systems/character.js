/**
 * 角色系统（v1.1 - 体力/装备穿戴/装备数值显示）
 */
import { gameState } from '../engine/state.js';
import { renderer } from '../engine/renderer.js';

export class CharacterSystem {

    // ===== 状态面板（增加体力） =====
    showStatus() {
        const c = gameState.character;
        renderer.divider('═');
        renderer.print(`【${c.name}】 ${c.race} | ${c.origin} | ${c.mainDao}`, 'highlight');
        renderer.divider('─');
        renderer.print(`境界：${gameState.getRealmDisplay()}  等级：Lv.${c.level}`, 'normal');
        renderer.print(`修为：${c.exp} / ${c.expToNext}`, 'normal');
        renderer.print(`生命：${c.hp} / ${c.maxHp}  灵力：${c.mp} / ${c.maxMp}`, 'normal');
        renderer.print(`体力：${c.stamina} / ${c.maxStamina}`, 'normal');
        renderer.blank();
        renderer.print('【六维属性】', 'system');
        renderer.print(`  根骨：${c.attrs.gengu}  悟性：${c.attrs.wuxing}  灵力：${c.attrs.lingli}`, 'normal');
        renderer.print(`  身法：${c.attrs.shenfa}  神识：${c.attrs.shenshi}  气运：${c.attrs.qiyun}`, 'normal');
        renderer.blank();
        // 显示装备加成
        const bonus = this.getEquipBonus();
        if (bonus.attack > 0 || bonus.defense > 0) {
            renderer.print('【装备加成】', 'system');
            if (bonus.attack > 0) renderer.print(`  攻击 +${bonus.attack}`, 'item');
            if (bonus.defense > 0) renderer.print(`  防御 +${bonus.defense}`, 'item');
            if (bonus.hp > 0) renderer.print(`  生命 +${bonus.hp}`, 'item');
            if (bonus.mp > 0) renderer.print(`  灵力 +${bonus.mp}`, 'item');
            renderer.blank();
        }
        renderer.print('【货币】', 'system');
        renderer.print(`  🪙铜钱：${c.copper}  💎灵石：${c.lingshi}  ✨仙玉：${c.xianyu}`, 'normal');
        renderer.blank();
        renderer.print('【隐藏属性】', 'system');
        renderer.print(`  业力：${c.karma}  功德：${c.merit}  心魔：${c.heartDemon}/100`, 'normal');
        renderer.blank();
        renderer.print(`【统计】击杀：${gameState.stats.monstersKilled}  收集：${gameState.stats.itemsCollected}  行走：${gameState.stats.distanceWalked}步`, 'system');
        renderer.divider('═');
    }

    // ===== 背包（增加装备数值显示） =====
    showInventory() {
        const inv = gameState.character.inventory;
        renderer.divider('═');
        renderer.print(`【背包】 ${inv.length} / ${gameState.character.maxInventory}`, 'highlight');
        renderer.divider('─');
        if (inv.length === 0) {
            renderer.print('  空空如也。', 'system');
        } else {
            inv.forEach((item, idx) => {
                let info = `  ${idx + 1}. 【${item.quality || '凡品'}】${item.name}`;
                // 显示数值
                const stats = this._getItemStatsStr(item);
                if (stats) info += `  ${stats}`;
                renderer.print(info, 'item');
            });
        }
        renderer.blank();
        renderer.print('提示：输入"穿 [物品名]"装备武器/防具，输入"用 [物品名]"使用丹药。', 'system');
        renderer.divider('═');
    }

    // ===== 新增：获取物品数值字符串 =====
    _getItemStatsStr(item) {
        const parts = [];
        if (item.attack) parts.push(`攻:${item.attack}`);
        if (item.defense) parts.push(`防:${item.defense}`);
        if (item.hp) parts.push(`HP+${item.hp}`);
        if (item.mp) parts.push(`MP+${item.mp}`);
        if (item.levelReq) parts.push(`需Lv.${item.levelReq}`);
        if (item.effect) {
            if (item.effect.hp) parts.push(`回复HP:${item.effect.hp}`);
            if (item.effect.mp) parts.push(`回复MP:${item.effect.mp}`);
            if (item.effect.exp) parts.push(`修为+${item.effect.exp}`);
        }
        if (item.specialEffect) parts.push(`特效:${item.specialEffect}`);
        return parts.length > 0 ? `[${parts.join(' ')}]` : '';
    }
    // ========================================

    // ===== 新增：装备穿戴系统 =====
    equipItem(itemName) {
        const c = gameState.character;
        const inv = c.inventory;

        // 无目标时自动选第一个可装备物品
        let targetName = itemName;
        if (!targetName) {
            const equippable = inv.find(i => this._isEquippable(i));
            if (!equippable) {
                renderer.print('背包中没有可装备的物品。');
                return;
            }
            targetName = equippable.name;
            renderer.print(`（自动选择：${targetName}）`, 'system');
        }

        const idx = inv.findIndex(i => i.name === targetName);
        if (idx === -1) {
            renderer.print(`背包中没有"${targetName}"。`);
            return;
        }

        const item = inv[idx];
        if (!this._isEquippable(item)) {
            renderer.print(`${item.name}不是可装备的物品。`);
            return;
        }

        // 检查等级需求
        if (item.levelReq && c.level < item.levelReq) {
            renderer.printError(`需要等级 Lv.${item.levelReq} 才能装备${item.name}（当前Lv.${c.level}）`);
            return;
        }

        // 确定装备槽位
        const slot = this._getEquipSlot(item);
        if (!slot) {
            renderer.printError(`无法确定${item.name}的装备位置。`);
            return;
        }

        // 如果该槽位已有装备，先卸下
        if (c.equipment[slot]) {
            const old = c.equipment[slot];
            c.inventory.push(old);
            renderer.print(`  卸下：${old.name}`, 'system');
        }

        // 装备
        inv.splice(idx, 1);
        c.equipment[slot] = item;

        // 应用属性加成
        this._applyEquipStats(item, 1);

        renderer.print(`  ✨ 装备成功：${item.name}`, 'item');
        const stats = this._getItemStatsStr(item);
        if (stats) renderer.print(`    属性：${stats}`, 'item');
    }

    unequipItem(itemName) {
        const c = gameState.character;
        const equip = c.equipment;

        if (!itemName) {
            renderer.print('卸下什么？请输入"卸下 [物品名]"。');
            return;
        }

        // 找到对应槽位
        let slot = null;
        for (const [key, val] of Object.entries(equip)) {
            if (val && val.name === itemName) {
                slot = key;
                break;
            }
        }

        if (!slot) {
            renderer.print(`你没有装备"${itemName}"。`);
            return;
        }

        const item = equip[slot];
        if (c.inventory.length >= c.maxInventory) {
            renderer.printError('背包已满，无法卸下！');
            return;
        }

        // 移除属性加成
        this._applyEquipStats(item, -1);

        equip[slot] = null;
        c.inventory.push(item);
        renderer.print(`  已卸下：${item.name}`, 'system');
    }

    // 显示装备栏
    showEquipList() {
        const equip = gameState.character.equipment;
        renderer.divider('═');
        renderer.print('【装备栏】', 'highlight');
        renderer.divider('─');

        const slotNames = {
            weapon: '武器', head: '头冠', body: '衣甲',
            shoulderL: '左护肩', shoulderR: '右护肩',
            wristL: '左护腕', wristR: '右护腕',
            belt: '腰带', legs: '下裳', boots: '靴子',
            ring1: '戒指①', ring2: '戒指②', fabao: '法宝'
        };

        for (const [slot, name] of Object.entries(slotNames)) {
            const item = equip[slot];
            if (item) {
                const stats = this._getItemStatsStr(item);
                renderer.print(`  ${name}：【${item.quality || '凡品'}】${item.name} ${stats}`, 'item');
            } else {
                renderer.print(`  ${name}：（空）`, 'system');
            }
        }

        renderer.blank();
        const bonus = this.getEquipBonus();
        renderer.print(`  总加成 → 攻击+${bonus.attack} 防御+${bonus.defense} HP+${bonus.hp} MP+${bonus.mp}`, 'highlight');
        renderer.divider('═');
    }

    _isEquippable(item) {
        return item.type === '武器' || item.type === '防具' || item.type === '法宝' ||
               item.type === '头冠' || item.type === '靴子' || item.type === '戒指';
    }

    _getEquipSlot(item) {
        if (item.type === '武器') return 'weapon';
        if (item.type === '防具') return 'body';
        if (item.type === '头冠') return 'head';
        if (item.type === '靴子') return 'boots';
        if (item.type === '戒指') return gameState.character.equipment.ring1 ? 'ring2' : 'ring1';
        if (item.type === '法宝') return 'fabao';
        if (item.slot) return item.slot; // 自定义槽位
        return null;
    }

    _applyEquipStats(item, multiplier) {
        const c = gameState.character;
        if (item.attack) c.attrs._bonusAttack = (c.attrs._bonusAttack || 0) + item.attack * multiplier;
        if (item.defense) c.attrs._bonusDefense = (c.attrs._bonusDefense || 0) + item.defense * multiplier;
        if (item.hp) { c.maxHp += item.hp * multiplier; c.hp = Math.min(c.hp, c.maxHp); }
        if (item.mp) { c.maxMp += item.mp * multiplier; c.mp = Math.min(c.mp, c.maxMp); }
    }

    getEquipBonus() {
        const equip = gameState.character.equipment;
        let bonus = { attack: 0, defense: 0, hp: 0, mp: 0 };
        for (const item of Object.values(equip)) {
            if (item) {
                bonus.attack += item.attack || 0;
                bonus.defense += item.defense || 0;
                bonus.hp += item.hp || 0;
                bonus.mp += item.mp || 0;
            }
        }
        return bonus;
    }
    // ========================================

    // ===== 打坐修炼（消耗体力） =====
    meditate() {
        const c = gameState.character;

        // 检查体力
        const staminaCost = 10;
        if (!gameState.isStaminaEnough(staminaCost)) {
            renderer.printError(`体力不足！打坐需要 ${staminaCost} 点体力（当前：${c.stamina}/${c.maxStamina}）`);
            renderer.print('  提示：输入"休息"或"吃 [食物]"恢复体力。', 'system');
            return;
        }

        // 消耗体力
        gameState.consumeStamina(staminaCost);

        let gain = 10 + c.attrs.wuxing * 2;
        c.exp += gain;

        renderer.print(`你盘膝而坐，吐纳天地灵气……`, 'normal');
        renderer.print(`  修为 +${gain}（当前：${c.exp}/${c.expToNext}）`, 'system');
        renderer.print(`  体力 -${staminaCost}（剩余：${c.stamina}/${c.maxStamina}）`, 'system');

        // 打坐同时少量恢复体力（静心养神）
        const staminaRestore = 5;
        gameState.restoreStamina(staminaRestore);
        renderer.print(`  静心养神，体力 +${staminaRestore}`, 'system');

        if (c.exp >= c.expToNext) {
            renderer.print(`  你感到体内灵气充盈，似乎可以尝试突破了！`, 'highlight');
            renderer.print(`  （输入"突破"尝试突破境界）`, 'system');
        }

        gameState.advanceTime(1);

        if (Math.random() < 0.05 + c.attrs.qiyun * 0.005) {
            renderer.blank();
            renderer.print(`  忽然间，你心中灵光一闪，对${c.mainDao}有了新的感悟！`, 'highlight');
            const bonusExp = Math.floor(gain * 0.5);
            c.exp += bonusExp;
            renderer.print(`  额外修为 +${bonusExp}（顿悟！）`, 'item');
        }
    }

    // ===== 新增：休息（恢复体力） =====
    rest() {
        const c = gameState.character;
        const restore = 30;
        gameState.restoreStamina(restore);
        gameState.advanceTime(1);

        renderer.print('你找了个安全的地方坐下休息，闭目养神……', 'normal');
        renderer.print(`  体力 +${restore}（当前：${c.stamina}/${c.maxStamina}）`, 'item');

        // 少量恢复HP/MP
        const hpRestore = Math.floor(c.maxHp * 0.1);
        const mpRestore = Math.floor(c.maxMp * 0.1);
        c.hp = Math.min(c.maxHp, c.hp + hpRestore);
        c.mp = Math.min(c.maxMp, c.mp + mpRestore);
        renderer.print(`  生命 +${hpRestore}，灵力 +${mpRestore}`, 'system');
    }

    // ===== 新增：吃东西（恢复体力） =====
    eat(itemName) {
        const c = gameState.character;
        const inv = c.inventory;

        let targetName = itemName;
        if (!targetName) {
            // 自动选第一个食物
            const food = inv.find(i => i.type === '食物' || i.type === '杂物' && i.edible);
            if (!food) {
                renderer.print('背包中没有可食用的物品。');
                return;
            }
            targetName = food.name;
            renderer.print(`（自动选择：${targetName}）`, 'system');
        }

        const idx = inv.findIndex(i => i.name === targetName);
        if (idx === -1) {
            renderer.print(`背包中没有"${targetName}"。`);
            return;
        }

        const item = inv[idx];
        if (item.type !== '食物' && !item.edible) {
            renderer.print(`${item.name}不能吃。`);
            return;
        }

        const staminaRestore = item.staminaRestore || 20;
        gameState.restoreStamina(staminaRestore);

        renderer.print(`你吃下了${item.name}。`, 'normal');
        renderer.print(`  体力 +${staminaRestore}（当前：${c.stamina}/${c.maxStamina}）`, 'item');

        if (item.effect && item.effect.hp) {
            c.hp = Math.min(c.maxHp, c.hp + item.effect.hp);
            renderer.print(`  生命 +${item.effect.hp}`, 'item');
        }

        inv.splice(idx, 1);
        renderer.print(`  （${item.name}已消耗）`, 'system');
    }

    // ===== 突破 =====
    breakthrough() {
        const c = gameState.character;
        if (c.exp < c.expToNext) {
            renderer.print('修为尚未圆满，无法突破。');
            renderer.print(`  当前：${c.exp} / ${c.expToNext}`, 'system');
            return;
        }

        // 突破也消耗体力
        const staminaCost = 20;
        if (!gameState.isStaminaEnough(staminaCost)) {
            renderer.printError(`体力不足！突破需要 ${staminaCost} 点体力。`);
            return;
        }
        gameState.consumeStamina(staminaCost);

        let rate = 60 + c.attrs.wuxing * 1.5 - c.karma * 0.5;
        rate = Math.max(20, Math.min(95, rate));

        renderer.print(`你凝神聚气，尝试突破${gameState.getRealmDisplay()}的瓶颈……`, 'normal');
        renderer.print(`  成功率：${Math.floor(rate)}%  体力消耗：${staminaCost}`, 'system');
        renderer.blank();

        const roll = Math.random() * 100;
        if (roll < rate) {
            c.exp -= c.expToNext;
            c.realmLayer++;
            c.expToNext = Math.floor(c.expToNext * 1.5);

            if (c.realmLayer > 3) {
                c.realmLayer = 1;
                this._advanceRealm();
            }

            c.maxHp += 20;
            c.hp = c.maxHp;
            c.maxMp += 10;
            c.mp = c.maxMp;
            c.maxStamina += 5;
            c.stamina = c.maxStamina;
            c.level++;

            renderer.print(`  ✨ 突破成功！`, 'highlight');
            renderer.print(`  你已踏入【${gameState.getRealmDisplay()}】！`, 'highlight');
            renderer.print(`  生命+20 灵力+10 体力上限+5（全部恢复）`, 'item');
        } else {
            c.exp = Math.floor(c.exp * 0.7);
            renderer.print(`  灵气在经脉中横冲直撞，突破失败！`, 'combat');
            renderer.print(`  修为倒退……（剩余：${c.exp}/${c.expToNext}）`, 'system');

            if (Math.random() < 0.1) {
                c.heartDemon += 10;
                renderer.print(`  你感到一阵心神不宁……心魔值 +10`, 'combat');
            }
        }
    }

    _advanceRealm() {
        const c = gameState.character;
        const realms = ['炼气期','筑基期','金丹期','元婴期','化神期','合体期','大乘期','渡劫期','真仙境'];
        const idx = realms.indexOf(c.realm);
        if (idx < realms.length - 1) {
            c.realm = realms[idx + 1];
            renderer.print(`  🌟 大境界突破！你已踏入【${c.realm}】！`, 'highlight');
        }
    }

    // ===== 使用物品（丹药等） =====
    useItem(itemName) {
        const inv = gameState.character.inventory;

        let targetName = itemName;
        if (!targetName) {
            const usable = inv.find(i => i.type === '丹药' || i.type === '消耗品');
            if (!usable) {
                renderer.print('背包中没有可使用的物品。');
                return;
            }
            targetName = usable.name;
            renderer.print(`（自动选择：${targetName}）`, 'system');
        }

        const idx = inv.findIndex(i => i.name === targetName);
        if (idx === -1) {
            renderer.print(`背包中没有"${targetName}"。`);
            return;
        }

        const item = inv[idx];

        // 如果是装备类，提示用"穿"
        if (this._isEquippable(item)) {
            renderer.print(`${item.name}是装备，请输入"穿 ${item.name}"来装备。`, 'system');
            return;
        }

        if (item.type === '消耗品' || item.type === '丹药') {
            if (item.effect) {
                if (item.effect.hp) {
                    gameState.character.hp = Math.min(
                        gameState.character.maxHp,
                        gameState.character.hp + item.effect.hp
                    );
                    renderer.print(`你服下${item.name}，恢复了 ${item.effect.hp} 点生命。`, 'item');
                }
                if (item.effect.mp) {
                    gameState.character.mp = Math.min(
                        gameState.character.maxMp,
                        gameState.character.mp + item.effect.mp
                    );
                    renderer.print(`灵力恢复了 ${item.effect.mp} 点。`, 'item');
                }
                if (item.effect.exp) {
                    gameState.character.exp += item.effect.exp;
                    renderer.print(`获得修为 +${item.effect.exp}。`, 'item');
                }
                if (item.effect.stamina) {
                    gameState.restoreStamina(item.effect.stamina);
                    renderer.print(`体力恢复了 ${item.effect.stamina} 点。`, 'item');
                }
            }
            inv.splice(idx, 1);
            renderer.print(`  （${item.name}已消耗）`, 'system');
        } else if (item.type === '食物' || item.edible) {
            this.eat(item.name);
        } else {
            renderer.print(`${item.name}不能直接使用。`);
        }
    }
}

export const characterSystem = new CharacterSystem();
