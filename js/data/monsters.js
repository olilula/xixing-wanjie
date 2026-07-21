/**
 * 怪物数据 - 首批20种
 * 按区域/等级分组
 */
export const MONSTERS = {

    // ===== 长安郊外（Lv.1-5） =====
    wild_wolf: {
        id: 'wild_wolf',
        name: '野狼',
        level: 2,
        hp: 40,
        attack: 8,
        defense: 2,
        critRate: 0.05,
        expReward: 15,
        copperReward: 5,
        description: '一头灰毛野狼，龇着獠牙，眼中闪着凶光。',
        skills: [],
        drops: [
            { name: '狼皮', type: '材料', quality: '凡品', description: '一张完整的狼皮。', dropRate: 0.6 },
            { name: '狼牙', type: '材料', quality: '凡品', description: '锋利的狼牙，可做暗器。', dropRate: 0.3 }
        ],
        rareDrop: { name: '狼王护符', type: '戒指', quality: '良品', defense: 3, hp: 10, levelReq: 2, description: '以狼牙制成的护符，散发野性气息。' },
        rareDropRate: 0.05,
        area: '长安郊外'
    },

    giant_rat: {
        id: 'giant_rat',
        name: '巨鼠',
        level: 1,
        hp: 25,
        attack: 5,
        defense: 1,
        critRate: 0.03,
        expReward: 8,
        copperReward: 3,
        description: '一只猫那么大的灰鼠，红着眼睛向你吱吱叫。',
        skills: [],
        drops: [
            { name: '鼠尾', type: '材料', quality: '凡品', description: '一条细长的鼠尾。', dropRate: 0.5 }
        ],
        area: '长安郊外'
    },

    wild_boar: {
        id: 'wild_boar',
        name: '野猪',
        level: 3,
        hp: 65,
        attack: 12,
        defense: 4,
        critRate: 0.06,
        expReward: 22,
        copperReward: 8,
        description: '一头獠牙外露的野猪，低头刨地，随时准备冲撞。',
        skills: [
            { name: '冲撞', power: 8, effect: null }
        ],
        skillRate: 0.3,
        drops: [
            { name: '野猪皮', type: '材料', quality: '凡品', description: '厚实的野猪皮。', dropRate: 0.6 },
            { name: '猪肉', type: '食物', quality: '凡品', staminaRestore: 35, edible: true, description: '新鲜的野猪肉。', dropRate: 0.4 }
        ],
        area: '长安郊外'
    },

    cave_bat_king: {
        id: 'cave_bat_king',
        name: '洞穴蝙蝠王',
        level: 3,
        hp: 55,
        attack: 10,
        defense: 3,
        critRate: 0.08,
        expReward: 25,
        copperReward: 10,
        description: '一只翼展近丈的巨大蝙蝠，倒挂在洞顶，双目赤红。',
        skills: [
            { name: '超声波', power: 6, effect: 'stun' }
        ],
        skillRate: 0.2,
        drops: [
            { name: '蝙蝠翼', type: '材料', quality: '凡品', description: '巨大的蝙蝠翅膀。', dropRate: 0.7 },
            { name: '回气丹', type: '丹药', quality: '凡品', effect: { mp: 30 }, description: '恢复灵力的丹药。', dropRate: 0.3 }
        ],
        area: '长安郊外'
    },

    mountain_snake: {
        id: 'mountain_snake',
        name: '山蟒',
        level: 4,
        hp: 70,
        attack: 11,
        defense: 3,
        critRate: 0.07,
        expReward: 28,
        copperReward: 10,
        description: '一条碗口粗的花蟒，盘踞在岩石上，吐着信子。',
        skills: [
            { name: '毒液喷射', power: 5, effect: 'poison', poisonDmg: 4 }
        ],
        skillRate: 0.3,
        drops: [
            { name: '蛇皮', type: '材料', quality: '凡品', description: '完整的大蟒蛇皮。', dropRate: 0.6 },
            { name: '蛇胆', type: '材料', quality: '良品', description: '蟒蛇蛇胆，可入药。', dropRate: 0.25 }
        ],
        rareDrop: { name: '蟒蛇软甲', type: '防具', quality: '良品', defense: 12, hp: 15, levelReq: 3, description: '以蟒蛇皮制成的软甲，轻便坚韧。' },
        rareDropRate: 0.08,
        area: '终南山'
    },

    // ===== 终南山（Lv.3-8） =====
    spirit_fox: {
        id: 'spirit_fox',
        name: '灵狐',
        level: 5,
        hp: 60,
        attack: 13,
        defense: 4,
        critRate: 0.12,
        expReward: 35,
        copperReward: 15,
        description: '一只通体银白的狐狸，九条尾巴在身后摇曳，目光狡黠。',
        skills: [
            { name: '魅惑', power: 4, effect: 'stun' },
            { name: '灵火', power: 10, effect: null }
        ],
        skillRate: 0.35,
        canHeal: true,
        drops: [
            { name: '狐毛', type: '材料', quality: '良品', description: '银白色的狐毛，柔软温暖。', dropRate: 0.5 },
            { name: '灵狐内丹', type: '材料', quality: '玄品', description: '灵狐修炼百年的内丹，蕴含灵气。', dropRate: 0.1 }
        ],
        rareDrop: { name: '狐裘披风', type: '防具', quality: '良品', defense: 8, mp: 20, levelReq: 4, description: '以灵狐毛制成的披风，冬暖夏凉。', slot: 'body' },
        rareDropRate: 0.06,
        area: '终南山'
    },

    stone_golem: {
        id: 'stone_golem',
        name: '石傀儡',
        level: 6,
        hp: 120,
        attack: 14,
        defense: 10,
        critRate: 0.03,
        expReward: 40,
        copperReward: 12,
        description: '一尊由山石凝聚而成的傀儡，高近两丈，行动迟缓但力大无穷。',
        skills: [
            { name: '巨石砸击', power: 15, effect: null }
        ],
        skillRate: 0.25,
        drops: [
            { name: '灵石碎片', type: '材料', quality: '良品', description: '蕴含灵气的石头碎片。', dropRate: 0.6 },
            { name: '铁矿石', type: '材料', quality: '凡品', description: '普通铁矿石。', dropRate: 0.4 }
        ],
        area: '终南山'
    },

    taoist_ghost: {
        id: 'taoist_ghost',
        name: '怨灵',
        level: 5,
        hp: 50,
        attack: 15,
        defense: 2,
        critRate: 0.1,
        expReward: 32,
        copperReward: 8,
        description: '一团幽绿色的鬼火中隐约可见一张扭曲的人脸，发出凄厉的哀嚎。',
        skills: [
            { name: '摄魂', power: 8, effect: 'stun' },
            { name: '阴风', power: 12, effect: null }
        ],
        skillRate: 0.35,
        drops: [
            { name: '魂珠', type: '材料', quality: '良品', description: '凝结的怨气形成的珠子。', dropRate: 0.3 },
            { name: '安神香', type: '消耗品', quality: '凡品', effect: { mp: 20 }, description: '点燃可安定心神。', dropRate: 0.4 }
        ],
        area: '终南山'
    },

    // ===== 渭水（Lv.4-8） =====
    river_turtle: {
        id: 'river_turtle',
        name: '玄龟',
        level: 4,
        hp: 90,
        attack: 9,
        defense: 12,
        critRate: 0.02,
        expReward: 30,
        copperReward: 12,
        description: '一只磨盘大的黑龟，龟壳上刻着天然纹路，双目浑浊而古老。',
        skills: [
            { name: '缩壳防御', power: 0, effect: null }
        ],
        skillRate: 0.2,
        canHeal: true,
        drops: [
            { name: '龟壳', type: '材料', quality: '良品', description: '坚硬的龟壳，可制盾牌。', dropRate: 0.5 },
            { name: '龟苓膏', type: '食物', quality: '良品', staminaRestore: 40, edible: true, effect: { hp: 30 }, description: '以龟血熬制的膏药，大补。', dropRate: 0.3 }
        ],
        area: '渭水'
    },

    water_demon: {
        id: 'water_demon',
        name: '水妖',
        level: 7,
        hp: 100,
        attack: 16,
        defense: 6,
        critRate: 0.08,
        expReward: 50,
        copperReward: 20,
        description: '一个半人半鱼的怪物从水中跃出，浑身鳞片闪着寒光，手持三叉戟。',
        skills: [
            { name: '水柱冲击', power: 12, effect: null },
            { name: '漩涡', power: 8, effect: 'stun' }
        ],
        skillRate: 0.3,
        drops: [
            { name: '鱼鳞甲片', type: '材料', quality: '良品', description: '水妖身上的鳞甲碎片。', dropRate: 0.5 },
            { name: '避水珠', type: '材料', quality: '玄品', description: '一颗泛着蓝光的珠子，可避水。', dropRate: 0.1 }
        ],
        rareDrop: { name: '三叉戟', type: '武器', quality: '灵品', attack: 22, levelReq: 5, description: '水妖的兵器，挥动时有水浪之声。', specialEffect: '攻击时10%概率溅射' },
        rareDropRate: 0.05,
        area: '渭水'
    },

    // ===== 荒野（Lv.2-6） =====
    bandit: {
        id: 'bandit',
        name: '山贼',
        level: 3,
        hp: 55,
        attack: 11,
        defense: 4,
        critRate: 0.06,
        expReward: 20,
        copperReward: 25,
        description: '一个满脸横肉的汉子，手持鬼头刀，拦在路中央。"此路是我开，留下买路财！"',
        skills: [
            { name: '劈砍', power: 8, effect: null }
        ],
        skillRate: 0.25,
        drops: [
            { name: '鬼头刀', type: '武器', quality: '凡品', attack: 10, levelReq: 2, description: '山贼用的鬼头刀，沉重但锋利。', dropRate: 0.2 },
            { name: '碎银', type: '货币', quality: '凡品', value: 15, description: '几两碎银子。', dropRate: 0.5 }
        ],
        area: '长安郊外'
    },

    bandit_leader: {
        id: 'bandit_leader',
        name: '山贼头目',
        level: 6,
        hp: 110,
        attack: 16,
        defense: 7,
        critRate: 0.08,
        expReward: 55,
        copperReward: 60,
        description: '一个独眼大汉，身披虎皮，手持一柄九环大刀，浑身杀气腾腾。',
        skills: [
            { name: '九环刀法', power: 14, effect: null },
            { name: '震慑', power: 5, effect: 'stun' }
        ],
        skillRate: 0.35,
        canHeal: true,
        drops: [
            { name: '九环大刀', type: '武器', quality: '良品', attack: 18, levelReq: 4, description: '刀背嵌有九枚铜环，挥动时哗哗作响。', dropRate: 0.3 },
            { name: '虎皮', type: '材料', quality: '良品', description: '一张完整的虎皮。', dropRate: 0.4 }
        ],
        rareDrop: { name: '山贼宝藏图', type: '杂物', quality: '良品', description: '一张标注了藏宝地点的羊皮地图。' },
        rareDropRate: 0.1,
        area: '长安郊外'
    },

    // ===== 高阶怪物（Lv.8-15） =====
    tiger_demon: {
        id: 'tiger_demon',
        name: '虎妖',
        level: 10,
        hp: 180,
        attack: 22,
        defense: 10,
        critRate: 0.12,
        expReward: 80,
        copperReward: 40,
        description: '一头吊睛白额大虎，额上"王"字隐隐发光，显然已修炼成精。',
        skills: [
            { name: '虎啸', power: 10, effect: 'stun' },
            { name: '利爪撕裂', power: 18, effect: null }
        ],
        skillRate: 0.35,
        canHeal: true,
        drops: [
            { name: '虎骨', type: '材料', quality: '良品', description: '虎妖的骨骼，坚硬如铁。', dropRate: 0.5 },
            { name: '虎妖内丹', type: '材料', quality: '玄品', description: '虎妖修炼数百年的内丹。', dropRate: 0.15 }
        ],
        rareDrop: { name: '虎纹战甲', type: '防具', quality: '玄品', defense: 20, hp: 40, levelReq: 8, description: '以虎妖皮骨炼制的战甲，威猛异常。' },
        rareDropRate: 0.06,
        area: '深山'
    },

    spider_queen: {
        id: 'spider_queen',
        name: '蛛后',
        level: 9,
        hp: 140,
        attack: 18,
        defense: 7,
        critRate: 0.1,
        expReward: 70,
        copperReward: 35,
        description: '一只磨盘大的黑蜘蛛，腹部有诡异的人脸花纹，八条长腿如枪般锋利。',
        skills: [
            { name: '毒丝喷射', power: 8, effect: 'poison', poisonDmg: 6 },
            { name: '蛛网缠绕', power: 5, effect: 'stun' }
        ],
        skillRate: 0.4,
        drops: [
            { name: '蛛丝', type: '材料', quality: '良品', description: '坚韧的蛛丝，可制绳索或衣物。', dropRate: 0.6 },
            { name: '解毒丹', type: '丹药', quality: '良品', effect: { hp: 40 }, description: '可解百毒。', dropRate: 0.3 }
        ],
        rareDrop: { name: '蛛丝软甲', type: '防具', quality: '灵品', defense: 15, hp: 25, shenfa: 5, levelReq: 7, description: '以千年蛛丝织成的软甲，轻若无物。' },
        rareDropRate: 0.07,
        area: '深山'
    },

    skeleton_soldier: {
        id: 'skeleton_soldier',
        name: '骷髅兵',
        level: 6,
        hp: 75,
        attack: 14,
        defense: 8,
        critRate: 0.05,
        expReward: 38,
        copperReward: 10,
        description: '一具穿着残破铠甲的骷髅，眼眶中燃着幽绿色的鬼火，手持锈剑。',
        skills: [
            { name: '骨刺', power: 10, effect: null }
        ],
        skillRate: 0.2,
        drops: [
            { name: '碎骨', type: '材料', quality: '凡品', description: '骷髅的碎骨。', dropRate: 0.6 },
            { name: '锈铁剑', type: '武器', quality: '凡品', attack: 8, levelReq: 3, description: '骷髅兵的佩剑，锈迹斑斑。', dropRate: 0.2 }
        ],
        area: '古墓'
    },

    ghost_general: {
        id: 'ghost_general',
        name: '鬼将',
        level: 12,
        hp: 220,
        attack: 25,
        defense: 12,
        critRate: 0.1,
        expReward: 100,
        copperReward: 50,
        description: '一尊身披黑甲的鬼将，手持方天画戟，周身阴气森森，令人不寒而栗。',
        skills: [
            { name: '幽冥斩', power: 20, effect: null },
            { name: '摄魂夺魄', power: 12, effect: 'stun' },
            { name: '阴兵护体', power: 0, effect: null }
        ],
        skillRate: 0.4,
        canHeal: true,
        drops: [
            { name: '阴铁', type: '材料', quality: '玄品', description: '沾染阴气的铁矿，炼器上品。', dropRate: 0.4 },
            { name: '鬼将令', type: '材料', quality: '玄品', description: '号令阴兵的令牌。', dropRate: 0.15 }
        ],
        rareDrop: { name: '方天画戟（残）', type: '武器', quality: '灵品', attack: 30, levelReq: 10, description: '鬼将的兵器，虽已残破仍威力惊人。', specialEffect: '攻击时15%概率眩晕' },
        rareDropRate: 0.04,
        area: '古墓'
    },

    // ===== 特殊/精英 =====
    golden_core_cultivator: {
        id: 'golden_core_cultivator',
        name: '邪修',
        level: 8,
        hp: 130,
        attack: 20,
        defense: 8,
        critRate: 0.1,
        expReward: 65,
        copperReward: 45,
        description: '一个面色苍白的黑衣人，周身环绕着黑气，手中捏着一枚血色丹药。"嘿嘿，又来一个送死的。"',
        skills: [
            { name: '血煞掌', power: 15, effect: 'poison', poisonDmg: 5 },
            { name: '噬魂术', power: 12, effect: 'stun' }
        ],
        skillRate: 0.4,
        canHeal: true,
        drops: [
            { name: '血煞丹', type: '丹药', quality: '良品', effect: { hp: 60, mp: 30 }, description: '邪修炼制的丹药，效果猛烈。', dropRate: 0.3 },
            { name: '储物袋', type: '杂物', quality: '良品', description: '一个小型储物袋。', dropRate: 0.2 }
        ],
        rareDrop: { name: '噬魂幡', type: '法宝', quality: '玄品', attack: 12, mp: 30, levelReq: 6, description: '一面黑色小幡，挥动时阴风阵阵。', specialEffect: '攻击时吸取5%伤害为MP' },
        rareDropRate: 0.05,
        area: '荒野'
    },

    tree_spirit: {
        id: 'tree_spirit',
        name: '树精',
        level: 7,
        hp: 150,
        attack: 13,
        defense: 14,
        critRate: 0.04,
        expReward: 55,
        copperReward: 15,
        description: '一棵老槐树忽然拔地而起，树干裂开一张大嘴，树枝如手臂般向你抓来。',
        skills: [
            { name: '藤蔓缠绕', power: 6, effect: 'stun' },
            { name: '树根穿刺', power: 14, effect: null }
        ],
        skillRate: 0.3,
        canHeal: true,
        drops: [
            { name: '灵木', type: '材料', quality: '良品', description: '蕴含灵气的木材。', dropRate: 0.6 },
            { name: '树心', type: '材料', quality: '玄品', description: '树精的核心，蕴含大量生机。', dropRate: 0.15 }
        ],
        area: '终南山'
    },

    fire_rat: {
        id: 'fire_rat',
        name: '火鼠',
        level: 8,
        hp: 85,
        attack: 17,
        defense: 5,
        critRate: 0.12,
        expReward: 58,
        copperReward: 20,
        description: '一只通体赤红的巨鼠，毛发间有火焰跳动，所过之处草木皆焦。',
        skills: [
            { name: '烈焰吐息', power: 14, effect: null },
            { name: '火焰冲撞', power: 10, effect: null }
        ],
        skillRate: 0.35,
        drops: [
            { name: '火鼠毛', type: '材料', quality: '良品', description: '不惧火焰的鼠毛，炼器珍品。', dropRate: 0.5 },
            { name: '火灵丹', type: '丹药', quality: '良品', effect: { hp: 50, mp: 20 }, description: '蕴含火灵之力的丹药。', dropRate: 0.25 }
        ],
        rareDrop: { name: '火鼠裘', type: '防具', quality: '灵品', defense: 12, hp: 20, levelReq: 6, description: '以火鼠毛织成的裘衣，可御火寒。', specialEffect: '火系伤害减免20%' },
        rareDropRate: 0.06,
        area: '深山'
    },

    jade_scale_python: {
        id: 'jade_scale_python',
        name: '玉鳞蟒',
        level: 11,
        hp: 200,
        attack: 21,
        defense: 11,
        critRate: 0.09,
        expReward: 90,
        copperReward: 45,
        description: '一条通体覆盖翠绿玉鳞的巨蟒，身长数丈，每片鳞甲都散发着温润的光泽。',
        skills: [
            { name: '玉鳞护体', power: 0, effect: null },
            { name: '蟒尾横扫', power: 16, effect: null },
            { name: '毒雾', power: 8, effect: 'poison', poisonDmg: 7 }
        ],
        skillRate: 0.35,
        canHeal: true,
        drops: [
            { name: '玉鳞', type: '材料', quality: '玄品', description: '如美玉般的蟒蛇鳞片。', dropRate: 0.5 },
            { name: '蟒蛇胆', type: '材料', quality: '玄品', description: '玉鳞蟒的蛇胆，价值连城。', dropRate: 0.2 }
        ],
        rareDrop: { name: '玉鳞剑', type: '武器', quality: '灵品', attack: 26, levelReq: 9, description: '以玉鳞蟒的鳞甲锻成的长剑，剑身翠绿如玉。', specialEffect: '攻击时8%概率附带毒素' },
        rareDropRate: 0.05,
        area: '深山'
    }
};

// 按区域获取怪物列表
export function getMonstersByArea(area) {
    return Object.values(MONSTERS).filter(m => m.area === area);
}

// 按等级范围获取怪物
export function getMonstersByLevel(minLv, maxLv) {
    return Object.values(MONSTERS).filter(m => m.level >= minLv && m.level <= maxLv);
}

// 随机获取一个指定区域的怪物
export function getRandomMonster(area) {
    const list = getMonstersByArea(area);
    if (list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
}
