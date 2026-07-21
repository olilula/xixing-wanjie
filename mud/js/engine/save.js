/**
 * 存档系统 - 基于 LocalStorage
 */
import { gameState } from './state.js';
import { renderer } from './renderer.js';

const SAVE_PREFIX = 'xixing_wanjie_save_';
const MAX_SLOTS = 3;

export class SaveSystem {

    // 保存到指定槽位
    save(slot = 1) {
        if (slot < 1 || slot > MAX_SLOTS) {
            renderer.printError(`存档槽位无效（1-${MAX_SLOTS}）`);
            return false;
        }
        try {
            const data = gameState.serialize();
            const meta = {
                name: gameState.character.name,
                realm: gameState.getRealmDisplay(),
                day: gameState.world.day,
                scene: gameState.world.currentScene,
                timestamp: Date.now()
            };
            localStorage.setItem(SAVE_PREFIX + slot, data);
            localStorage.setItem(SAVE_PREFIX + slot + '_meta', JSON.stringify(meta));
            renderer.printSystem(`存档成功！[槽位${slot}] ${meta.name} | ${meta.realm} | 第${meta.day}日`);
            return true;
        } catch (e) {
            renderer.printError(`存档失败：${e.message}`);
            return false;
        }
    }

    // 从指定槽位读取
    load(slot = 1) {
        if (slot < 1 || slot > MAX_SLOTS) {
            renderer.printError(`读档槽位无效（1-${MAX_SLOTS}）`);
            return false;
        }
        try {
            const data = localStorage.getItem(SAVE_PREFIX + slot);
            if (!data) {
                renderer.printError(`槽位${slot}没有存档。`);
                return false;
            }
            const success = gameState.deserialize(data);
            if (success) {
                renderer.printSystem(`读档成功！欢迎回来，${gameState.character.name}。`);
                return true;
            } else {
                renderer.printError('存档数据损坏，无法读取。');
                return false;
            }
        } catch (e) {
            renderer.printError(`读档失败：${e.message}`);
            return false;
        }
    }

    // 列出所有存档
    listSaves() {
        renderer.printSystem('═══ 存档列表 ═══');
        let hasAny = false;
        for (let i = 1; i <= MAX_SLOTS; i++) {
            const metaStr = localStorage.getItem(SAVE_PREFIX + i + '_meta');
            if (metaStr) {
                hasAny = true;
                const meta = JSON.parse(metaStr);
                const date = new Date(meta.timestamp).toLocaleString('zh-CN');
                renderer.print(`  [${i}] ${meta.name} | ${meta.realm} | 第${meta.day}日 | ${date}`, 'item');
            } else {
                renderer.print(`  [${i}] （空）`, 'system');
            }
        }
        if (!hasAny) {
            renderer.print('  暂无存档。', 'system');
        }
    }

    // 删除存档
    deleteSave(slot) {
        localStorage.removeItem(SAVE_PREFIX + slot);
        localStorage.removeItem(SAVE_PREFIX + slot + '_meta');
        renderer.printSystem(`槽位${slot}存档已删除。`);
    }

    // 自动存档
    autoSave() {
        try {
            const data = gameState.serialize();
            localStorage.setItem(SAVE_PREFIX + 'auto', data);
        } catch (e) {
            // 静默失败
        }
    }

    // 检查是否有自动存档
    hasAutoSave() {
        return !!localStorage.getItem(SAVE_PREFIX + 'auto');
    }

    // 加载自动存档
    loadAutoSave() {
        const data = localStorage.getItem(SAVE_PREFIX + 'auto');
        if (data) {
            return gameState.deserialize(data);
        }
        return false;
    }
}

export const saveSystem = new SaveSystem();