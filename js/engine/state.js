/**
 * 游戏全局状态管理（v1.1 - 增加体力系统）
 */
export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.character = {
            name: '无名',
            race: '人族',
            origin: '孤儿',
            mainDao: '剑道',
            subDao1: null,
            subDao2: null,
            level: 1,
            realm: '炼气期',
            realmLayer: 1,
            exp: 0,
            expToNext: 100,
            attrs: {
                gengu: 8,
                wuxing: 10,
                lingli: 7,
                shenfa: 9,
                shenshi: 8,
                qiyun: 7
            },
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            // ===== 新增：体力系统 =====
            stamina: 100,
            maxStamina: 100,
            // ============================
            copper: 50,
            lingshi: 0,
            xianyu: 0,
            gongde: 0,
            karma: 0,
            merit: 0,
            heartDemon: 0,
            causality: 0,
            skills: [],
            equipment: {
                weapon: null,
                head: null,
                body: null,
                shoulderL: null,
                shoulderR: null,
                wristL: null,
                wristR: null,
                belt: null,
                legs: null,
                boots: null,
                ring1: null,
                ring2: null,
                fabao: null
            },
            inventory: [],
            maxInventory: 30,
            reputation: {
                tang: 0,
                tianting: 0,
                lingshan: 0,
                yaoyu: 0,
                longgong: 0,
                difu: 0
            }
        };

        this.world = {
            currentScene: 'changan_south_gate',
            day: 1,
            season: '春',
            shichen: '卯',
            weather: '晴',
            timeTicks: 0,
        };

        this.flags = {
            gameStarted: false,
            mainQuestChapter: 0,
            mainQuestStep: 0,
            visitedScenes: [],
            triggeredEvents: [],
            killedMonsters: {},
            npcRelation: {},
            questsActive: [],
            questsCompleted: [],
            achievements: [],
            explorationPercent: {},
        };

        this.combat = {
            inCombat: false,
            enemies: [],
            turn: 0,
            playerTurn: true,
            log: []
        };

        this.stats = {
            playTime: 0,
            monstersKilled: 0,
            itemsCollected: 0,
            distanceWalked: 0,
            deaths: 0,
        };
    }

    getRealmDisplay() {
        const layerNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
        return `${this.character.realm}${layerNames[this.character.realmLayer - 1] || this.character.realmLayer}层`;
    }

    getTimeDisplay() {
        const w = this.world;
        return `第${w.day}日·${w.season}·${w.shichen}时·${w.weather}`;
    }

    advanceTime(ticks = 1) {
        const shichenList = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
        this.world.timeTicks += ticks;

        if (this.world.timeTicks >= 12) {
            this.world.timeTicks = 0;
            this.world.day++;
            const seasons = ['春','夏','秋','冬'];
            const seasonIdx = Math.floor((this.world.day - 1) / 30) % 4;
            this.world.season = seasons[seasonIdx];
            this._randomWeather();
        }

        const currentIdx = shichenList.indexOf(this.world.shichen);
        const newIdx = (currentIdx + ticks) % 12;
        this.world.shichen = shichenList[newIdx];
    }

    _randomWeather() {
        const weathers = ['晴','晴','晴','阴','阴','雨','雨','雷','雾','风沙'];
        if (this.world.season === '夏') weathers.push('雷','雷','雨');
        if (this.world.season === '冬') weathers.push('雪','雪');
        if (this.world.season === '春') weathers.push('雾','雨');
        this.world.weather = weathers[Math.floor(Math.random() * weathers.length)];
    }

    // ===== 新增：体力相关方法 =====
    consumeStamina(amount) {
        const c = this.character;
        if (c.stamina < amount) {
            return false; // 体力不足
        }
        c.stamina -= amount;
        return true;
    }

    restoreStamina(amount) {
        const c = this.character;
        c.stamina = Math.min(c.maxStamina, c.stamina + amount);
    }

    isStaminaEnough(amount) {
        return this.character.stamina >= amount;
    }
    // ================================

    serialize() {
        return JSON.stringify({
            character: this.character,
            world: this.world,
            flags: this.flags,
            stats: this.stats
        });
    }

    deserialize(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            this.character = data.character;
            this.world = data.world;
            this.flags = data.flags;
            this.stats = data.stats;
            // 兼容旧存档：补充体力字段
            if (this.character.stamina === undefined) {
                this.character.stamina = 100;
                this.character.maxStamina = 100;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
}

export const gameState = new GameState();
