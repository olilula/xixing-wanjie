/**
 * 角色系统 - 属性/状态/修炼
 */
import { gameState } from '../engine/state.js';
import { renderer } from '../engine/renderer.js';

export class CharacterSystem {

    // 显示角色状态
    showStatus() {
        const c = gameState.character;
        renderer.divider('═');
        renderer.print(`【${c.name}】 ${c.race} | ${c.origin} | ${c.mainDao}`, 'highlight');
        renderer.divider('─');
        renderer.print(`境界：${gameState.getRealmDisplay()}  等级：Lv.${c.level}`, 'normal');
        renderer.print(`修为：${c.exp} / ${c.expToNext}`, 'normal');
        renderer.print(`生命：${c.hp} / ${c.maxHp}  灵力：${c.mp} / ${c.maxMp}`, 'normal');
        renderer.blank();
        renderer.print('【六维属性】', 'system');
        renderer.print(`  根骨：${c.attrs.gengu}  悟性：${c.attrs.wuxing}  灵力：${c.attrs.lingli}`, 'normal');
        renderer.print(`  身法：${c.attrs.shenfa}  神识：${c.attrs.shenshi}  气运：${c.attrs.qiyun}`, 'normal');
        renderer.blank();
        renderer.print('【货币】', 'system');
        renderer.print(`  🪙铜钱：${c.copper}  💎灵石：c.lingshi}  ✨仙玉：${c.xianyu}`, 'normal');
        renderer.blank();
        renderer.print('【隐藏属性】', 'system');
        renderer.print(`  业力：${c.karma}  功德：${c.merit}  心魔：${c.heartDemon}/100`, 'normal');
        renderer.blank();
        renderer.print(`【统计】击杀：${gameState.stats.monstersKilled}  收集：${gameState.stats.itemsCollected}  行走：${gameState.stats.distanceWalked}步`, 'system');
        renderer.divider('═');
    }

    // 显示背包
    showInventory() {
        const inv = gameState.character.inventory;
        renderer.divider('═');
        renderer.print(`【背包】 ${inv.length} / ${gameState.character.maxInventory}`, 'highlight');
        renderer.divider('─');
        if (inv.length === 0) {
            renderer.print('  空空如也。', 'system');
        } else {
            inv.forEach((item, idx) => {
                const typeStr = item.type ? `[${item.type}]` : '';
                renderer.print(`  ${idx + 1}. ${item.name} ${typeStr}`, 'item');
            });
        }
        renderer.divider('═');
    }

    // 打坐修炼
    meditate() {
        const c = gameState.character;
        const scene = gameState.world.currentScene;

        // 基础修为获取
        let gain = 10 + c.attrs.wuxing * 2;

        // 环境加成（简化：某些场景有灵气加成）
        // TODO: 后续从场景数据读取
        const bonusMsg = '';

        c.exp += gain;
        renderer.print(`你盘膝而坐，吐纳天地灵气……`, 'normal');
        renderer.print(`  修为 +${gain}（当前：${c.exp}/${c.expToNext}）`, 'system');

        // 检查是否可以突破
        if (c.exp >= c.expToNext) {
            renderer.print(`  你感到体内灵气充盈，似乎可以尝试突破了！`, 'highlight');
            renderer.print(`  （输入"突破"尝试突破境界）`, 'system');
        }

        // 推进时间
        gameState.advanceTime(1);

        // 小概率顿悟
        if (Math.random() < 0.05 + c.attrs.qiyun * 0.005) {
            renderer.blank();
            renderer.print(`  忽然间，你心中灵光一闪，对${c.mainDao}有了新的感悟！`, 'highlight');
            c.exp += Math.floor(gain * 0.5);
            renderer.print(`  额外修为 +${Math.floor(gain * 0.5)}（顿悟！）`, 'item');
        }
    }

    // 突破
    breakthrough() {
        const c = gameState.character;
        if (c.exp < c.expToNext) {
            renderer.print('修为尚未圆满，无法突破。');
            renderer.print(`  当前：${c.exp} / ${c.expToNext}`, 'system');
            return;
        }

        // 计算成功率
        let rate = 60 + c.attrs.wuxing * 1.5 - c.karma * 0.5;
        rate = Math.max(20, Math.min(95, rate));

        renderer.print(`你凝神聚气，尝试突破${gameState.getRealmDisplay()}的瓶颈……`, 'normal');
        renderer.print(`  成功率：${Math.floor(rate)}%`, 'system');
        renderer.blank();

        const roll = Math.random() * 100;
        if (roll < rate) {
            // 成功
            c.exp -= c.expToNext;
            c.realmLayer++;
            c.expToNext = Math.floor(c.expToNext * 1.5);

            // 每3层升一个大境界
            if (c.realmLayer > 3) {
                c.realmLayer = 1;
                this._advanceRealm();
            }

            // 属性提升
            c.maxHp += 20;
            c.hp = c.maxHp;
            c.maxMp += 10;
            c.mp = c.maxMp;
            c.level++;

            renderer.print(`  ✨ 突破成功！`, 'highlight');
            renderer.print(`  你已踏入【${gameState.getRealmDisplay()}】！`, 'highlight');
            renderer.print(`  生命上限 +20，灵力上限 +10`, 'item');
        } else {
            // 失败
            c.exp = Math.floor(c.exp * 0.7);
            renderer.print(`  灵气在经脉中横冲直撞，突破失败！`, 'combat');
            renderer.print(`  修为倒退……（剩余：${c.exp}/${c.expToNext}）`, 'system');

            // 小概率走火入魔
            if (Math.random() < 0.1) {
                c.heartDemon += 10;
                renderer.print(`  你感到一阵心神不宁……心魔值 +10`, 'combat');
            }
        }
    }

    // 升大境界
    _advanceRealm() {
        const c = gameState.character;
        const realms = ['炼气期','筑基期','金丹期','元婴期','化神期','合体期','大乘期','渡劫期','真仙境'];
        const idx = realms.indexOf(c.realm);
        if (idx < realms.length - 1) {
            c.realm = realms[idx + 1];
            renderer.print(`  🌟 大境界突破！你已踏入【${c.realm}】！`, 'highlight');
        }
    }

    // 使用物品
    useItem(itemName) {
        const inv = gameState.character.inventory;
        const idx = inv.findIndex(i => i.name === itemName);
        if (idx === -1) {
            renderer.print(`背包中没有"${itemName}"。`);
            return;
        }

        const item = inv[idx];
        if (item.type === '消耗品' || item.type === '丹药') {
            // 使用效果
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
            }
            // 消耗
            inv.splice(idx, 1);
            renderer.print(`  （${item.name}已消耗）`, 'system');
        } else {
            renderer.print(`${item.name}不能直接使用。`);
        }
    }
}

export const characterSystem = new CharacterSystem();