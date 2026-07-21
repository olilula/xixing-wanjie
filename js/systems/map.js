/**
 * 地图/场景系统
 */
import { gameState } from '../engine/state.js';
import { renderer } from '../engine/renderer.js';
import { SCENES } from '../data/scenes.js';

export class MapSystem {

    // 获取当前场景数据
    getCurrentScene() {
        return SCENES[gameState.world.currentScene] || null;
    }

    // 获取场景（按ID）
    getScene(id) {
        return SCENES[id] || null;
    }

    // 移动到指定方向
    move(direction) {
        const scene = this.getCurrentScene();
        if (!scene) {
            renderer.printError('当前场景数据异常。');
            return false;
        }

        // 检查出口是否存在
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

        // 检查是否需要条件
        if (targetScene.requireFlag && !gameState.flags[targetScene.requireFlag]) {
            renderer.print(targetScene.lockedMsg || '这条路似乎被什么挡住了，暂时无法通过。');
            return false;
        }

        // 移动
        gameState.world.currentScene = targetId;

        // 记录已访问
        if (!gameState.flags.visitedScenes.includes(targetId)) {
            gameState.flags.visitedScenes.push(targetId);
        }

        // 推进时间
        gameState.advanceTime(1);
        gameState.stats.distanceWalked++;

        // 渲染新场景
        renderer.printScene(targetScene);

        // 触发场景事件（如果有）
        this._triggerSceneEvent(targetScene);

        return true;
    }

    // 查看当前场景
    look() {
        const scene = this.getCurrentScene();
        if (scene) {
            renderer.printScene(scene);
        }
    }

    // 查看特定目标
    lookAt(target) {
        const scene = this.getCurrentScene();
        if (!scene) return;

        // 查看NPC
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

        // 查看物品
        if (scene.items) {
            const item = scene.items.find(i => i.name === target);
            if (item) {
                renderer.print(item.description || `那是${item.name}。`, 'item');
                return;
            }
        }

        // 查看场景特殊对象
        if (scene.examine && scene.examine[target]) {
            renderer.print(scene.examine[target], 'normal');
            return;
        }

        renderer.print(`你没有看到"${target}"。`);
    }

    // 搜索场景
    search() {
        const scene = this.getCurrentScene();
        if (!scene) return;

        if (scene.searchResult) {
            renderer.print(scene.searchResult, 'normal');
            // 一次性搜索
            if (scene.searchOnce && !gameState.flags['searched_' + gameState.world.currentScene]) {
                gameState.flags['searched_' + gameState.world.currentScene] = true;
                if (scene.searchItem) {
                    renderer.printItemGet(scene.searchItem.name);
                    // TODO: 加入背包
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

    // 拾取物品
    takeItem(itemName) {
        const scene = this.getCurrentScene();
        if (!scene || !scene.items) {
            renderer.print('这里没有什么可拿的。');
            return;
        }

        const idx = scene.items.findIndex(i => i.name === itemName);
        if (idx === -1) {
            renderer.print(`这里没有"${itemName}"。`);
            return;
        }

        // 检查背包空间
        if (gameState.character.inventory.length >= gameState.character.maxInventory) {
            renderer.printError('背包已满！');
            return;
        }

        const item = scene.items.splice(idx, 1)[0];
        gameState.character.inventory.push(item);
        gameState.stats.itemsCollected++;
        renderer.printItemGet(item.name);
    }

    // 触发场景事件
    _triggerSceneEvent(scene) {
        if (scene.event && !gameState.flags.triggeredEvents.includes(scene.id + '_event')) {
            // 概率触发
            const chance = scene.eventChance || 0.3;
            if (Math.random() < chance) {
                gameState.flags.triggeredEvents.push(scene.id + '_event');
                renderer.blank();
                renderer.print(scene.event, 'system');
            }
        }
    }

    // 显示简易地图
    showMap() {
        const scene = this.getCurrentScene();
        renderer.divider('═');
        renderer.print(`【当前位置】${scene.area}·${scene.name}`, 'highlight');
        renderer.blank();

        // 显示已探索的相邻区域
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