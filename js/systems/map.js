/**
 * 地图/场景系统（v1.1 - 增加默认目标获取）
 */
import { gameState } from '../engine/state.js';
import { renderer } from '../engine/renderer.js';
import { SCENES } from '../data/scenes.js';

export class MapSystem {

    getCurrentScene() {
        return SCENES[gameState.world.currentScene] || null;
    }

    getScene(id) {
        return SCENES[id] || null;
    }

    // ===== 新增：获取默认目标 =====
    getDefaultNPC() {
        const scene = this.getCurrentScene();
        if (scene && scene.npcs && scene.npcs.length > 0) {
            return scene.npcs[0];
        }
        return null;
    }

    getDefaultItem() {
        const scene = this.getCurrentScene();
        if (scene && scene.items && scene.items.length > 0) {
            return scene.items[0];
        }
        return null;
    }

    getDefaultEnemy() {
        const scene = this.getCurrentScene();
        if (scene && scene.monsters && scene.monsters.length > 0) {
            return scene.monsters[0];
        }
        return null;
    }
    // ================================

    move(direction) {
        const scene = this.getCurrentScene();
        if (!scene) {
            renderer.printError('当前场景数据异常。');
            return false;
        }

        if (!scene.exits || !scene.exits[direction]) {
            renderer.print('这个方向没有路。');
            return false;
        }

        const targetId = scene.exits[direction];
        const targetScene = SCENES[targetId];

        if (!targetScene) {
            renderer.printError(`目标场景不存在：${targetId}`);
            return false;
        }

        if (targetScene.requireFlag && !gameState.flags[targetScene.requireFlag]) {
            renderer.print(targetScene.lockedMsg || '这条路似乎被什么挡住了，暂时无法通过。');
            return false;
        }

        gameState.world.currentScene = targetId;

        if (!gameState.flags.visitedScenes.includes(targetId)) {
            gameState.flags.visitedScenes.push(targetId);
        }

        gameState.advanceTime(1);
        gameState.stats.distanceWalked++;

        renderer.printScene(targetScene);
        this._triggerSceneEvent(targetScene);

        return true;
    }

    look() {
        const scene = this.getCurrentScene();
        if (scene) {
            renderer.printScene(scene);
        }
    }

    lookAt(target) {
        const scene = this.getCurrentScene();
        if (!scene) return;

        if (scene.npcs) {
            const npc = scene.npcs.find(n => n.name === target || n.alias === target);
            if (npc) {
                renderer.print(npc.description || `你仔细打量${npc.name}，看不出什么特别的。`, 'normal');
                if (npc.greeting) {
                    renderer.printNPC(npc.name, npc.greeting);
                }
                return;
            }
        }

        if (scene.items) {
            const item = scene.items.find(i => i.name === target);
            if (item) {
                renderer.print(item.description || `那是${item.name}。`, 'item');
                return;
            }
        }

        if (scene.examine && scene.examine[target]) {
            renderer.print(scene.examine[target], 'normal');
            return;
        }

        renderer.print(`你没有看到"${target}"。`);
    }

    search() {
        const scene = this.getCurrentScene();
        if (!scene) return;

        if (scene.searchResult) {
            renderer.print(scene.searchResult, 'normal');
            if (scene.searchOnce && !gameState.flags['searched_' + gameState.world.currentScene]) {
                gameState.flags['searched_' + gameState.world.currentScene] = true;
                if (scene.searchItem) {
                    renderer.printItemGet(scene.searchItem.name);
                    gameState.character.inventory.push(scene.searchItem);
                }
            }
        } else {
            const msgs = [
                '你仔细搜索了一番，什么也没发现。',
                '你四处查看，只有寻常的景物。',
                '你翻找了角落，一无所获。',
                '你凝神感知，此地并无异常。'
            ];
            renderer.print(msgs[Math.floor(Math.random() * msgs.length)]);
        }
    }

    takeItem(itemName) {
        const scene = this.getCurrentScene();
        if (!scene || !scene.items || scene.items.length === 0) {
            renderer.print('这里没有什么可拿的。');
            return;
        }

        // ===== 修改：支持默认目标 =====
        let targetName = itemName;
        if (!targetName) {
            targetName = scene.items[0].name;
            renderer.print(`（自动选择：${targetName}）`, 'system');
        }
        // ================================

        const idx = scene.items.findIndex(i => i.name === targetName);
        if (idx === -1) {
            renderer.print(`这里没有"${targetName}"。`);
            return;
        }

        if (gameState.character.inventory.length >= gameState.character.maxInventory) {
            renderer.printError('背包已满！');
            return;
        }

        const item = scene.items.splice(idx, 1)[0];
        gameState.character.inventory.push(item);
        gameState.stats.itemsCollected++;
        renderer.printItemGet(item.name);
    }

    talkToNPC(name) {
        const scene = this.getCurrentScene();
        if (!scene || !scene.npcs || scene.npcs.length === 0) {
            renderer.print('这里没有人可以交谈。');
            return;
        }

        // ===== 修改：支持默认目标 =====
        let npc;
        if (!name) {
            npc = scene.npcs[0];
            renderer.print(`（自动选择：${npc.name}）`, 'system');
        } else {
            npc = scene.npcs.find(n => n.name === name || n.alias === name);
        }
        // ================================

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

    _triggerSceneEvent(scene) {
        if (scene.event && !gameState.flags.triggeredEvents.includes(scene.id + '_event')) {
            const chance = scene.eventChance || 0.3;
            if (Math.random() < chance) {
                gameState.flags.triggeredEvents.push(scene.id + '_event');
                renderer.blank();
                renderer.print(scene.event, 'system');
            }
        }
    }

    showMap() {
        const scene = this.getCurrentScene();
        renderer.divider('═');
        renderer.print(`【当前位置】${scene.area}·${scene.name}`, 'highlight');
        renderer.blank();
        if (scene.exits) {
            renderer.print('可前往：', 'system');
            const dirNames = {
                north:'北', south:'南', east:'东', west:'西',
                up:'上', down:'下', enter:'进', exit:'出'
            };
            Object.entries(scene.exits).forEach(([dir, targetId]) => {
                const target = SCENES[targetId];
                const visited = gameState.flags.visitedScenes.includes(targetId);
                const name = visited ? (target ? target.name : '???') : '（未探索）';
                renderer.print(`  [${dirNames[dir] || dir}] → ${name}`, 'normal');
            });
        }
        renderer.blank();
        renderer.print(`探索进度：已访问 ${gameState.flags.visitedScenes.length} 个区域`, 'system');
        renderer.divider('═');
    }
}

export const mapSystem = new MapSystem();
