/**
 * 游戏全局状态管理
 */
export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        // 角色基础信息
        this.character = {
            name: '无名',
            race: '人族',
            origin: '孤儿',
            mainDao: '剑道',
            subDao1: null,
            subDao2: null,
            level: 1,
            realm: '炼气期',
            realmLayer: 1,  // 1-3层
            exp: 0,
            expToNext: 100,
            // 六维属性
            attrs: {
                gengu: 8,    // 根骨
                wuxing: 10,  // 悟性
                lingli: 7,   // 灵力
                shenfa: 9,   // 身法
                shenshi: 8,  // 神识
                qiyun: 7     // 气运
            },
            hp: 100,
            maxHp: 100,
            mp: 50,
            maxMp: 50,
            // 货币
            copper: 50,     // 铜钱
            lingshi: 0,     // 灵石
            xianyu: 0,      // 仙玉
            gongde: 0,      // 功德
            // 隐藏属性
            karma: 0,       // 业力
            merit: 0,       // 功德（详细）
            heartDemon: 0,  // 心魔值
            causality: 0,   // 因果值
            // 技能
            skills: [],
            // 装备
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
            // 背包
            inventory: [],
            maxInventory: 30,
            // 声望
            reputation: {
                tang: 0,      // 大唐
                tianting: 0,  // 天庭
                lingshan: 0,  // 灵山
                yaoyu: 0,     // 妖域
                longgong: 0,  // 龙宫
                difu: 0       // 地府
            }
        };

        // 世界状态
        this.world = {
            currentScene: 'changan_south_gate',
            day: 1,
            season: '春',   // 春夏秋冬
            shichen: '卯',  // 时辰
            weather: '晴',
            timeTicks: 0,   // 内部计时
        };

        // 游戏标记（剧情进度/事件触发等）
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

        // 战斗状态
        this.combat = {
            inCombat: false,
            enemies: [],
            turn: 0,
            playerTurn: true,
            log: []
        };

        // 统计
        this.stats = {
            playTime: 0,
            monstersKilled: 0,
            itemsCollected: 0,
            distanceWalked: 0,
            deaths: 0,
        };
    }

    // 获取角色显示境界
    getRealmDisplay() {
        const layerNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
        return `${this.character.realm}${layerNames[this.character.realmLayer - 1] || this.character.realmLayer}层`;
    }

    // 获取当前时间显示
    getTimeDisplay() {
        const w = this.world;
        return `第${w.day}日·${w.season}·${w.shichen}时·${w.weather}`;
    }

    // 推进时间
    advanceTime(ticks = 1) {
        const shichenList = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
        this.world.timeTicks += ticks;

        // 每12个tick = 1天
        if (this.world.timeTicks >= 12) {
            this.world.timeTicks = 0;
            this.world.day++;
            // 季节变化（每30天）
            const seasons = ['春','夏','秋','冬'];
            const seasonIdx = Math.floor((this.world.day - 1) / 30) % 4;
            this.world.season = seasons[seasonIdx];
            // 随机天气
            this._randomWeather();
        }

        // 时辰推进
        const currentIdx = shichenList.indexOf(this.world.shichen);
        const newIdx = (currentIdx + ticks) % 12;
        this.world.shichen = shichenList[newIdx];
    }

    _randomWeather() {
        const weathers = ['晴','晴','晴','阴','阴','雨','雨','雷','雾','风沙'];
        // 季节影响
        if (this.world.season === '夏') weathers.push('雷','雷','雨');
        if (this.world.season === '冬') weathers.push('雪','雪');
        if (this.world.season === '春') weathers.push('雾','雨');
        this.world.weather = weathers[Math.floor(Math.random() * weathers.length)];
    }

    // 序列化（用于存档）
    serialize() {
        return JSON.stringify({
            character: this.character,
            world: this.world,
            flags: this.flags,
            stats: this.stats
        });
    }

    // 反序列化（用于读档）
    deserialize(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            this.character = data.character;
            this.world = data.world;
            this.flags = data.flags;
            this.stats = data.stats;
            return true;
        } catch (e) {
            return false;
        }
    }
}

// 全局单例
export const gameState = new GameState();