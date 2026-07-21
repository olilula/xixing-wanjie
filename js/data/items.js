/**
 * 物品数据模板（首批）
 */
export const ITEM_TEMPLATES = {
    // 消耗品
    jinchuang_yao: {
        name: '金创药',
        type: '丹药',
        quality: '凡品',
        description: '普通的外伤药，涂抹后可止血生肌。',
        effect: { hp: 50 },
        price: 20
    },
    huiqi_dan: {
        name: '回气丹',
        type: '丹药',
        quality: '凡品',
        description: '恢复灵力的基础丹药，散发着淡淡的药香。',
        effect: { mp: 30 },
        price: 30
    },
    bigu_dan: {
        name: '辟谷丹',
        type: '丹药',
        quality: '良品',
        description: '服下后三日不需进食，行旅必备。',
        effect: { hp: 20, mp: 20 },
        price: 50
    },
    xisui_dan: {
        name: '洗髓丹',
        type: '丹药',
        quality: '玄品',
        description: '洗筋伐髓，可重置属性点重新分配。',
        effect: { resetAttrs: true },
        price: 500
    },

    // 材料
    zhixue_cao: {
        name: '止血草',
        type: '材料',
        quality: '凡品',
        description: '最常见的草药，有止血功效。炼丹基础材料。',
        price: 3
    },
    lingzhi: {
        name: '灵芝',
        type: '材料',
        quality: '良品',
        description: '生长在古木根旁的灵药，蕴含天地灵气。',
        price: 30
    },
    huangjing: {
        name: '黄精',
        type: '材料',
        quality: '凡品',
        description: '一种常见的补益药材。',
        price: 5
    },
    tieshi: {
        name: '铁矿石',
        type: '材料',
        quality: '凡品',
        description: '普通的铁矿石，可用于锻造。',
        price: 8
    },
    lingshi_kuang: {
        name: '灵石矿',
        type: '材料',
        quality: '良品',
        description: '蕴含灵气的矿石，修炼和炼器的基础材料。',
        price: 50
    },

    // 武器
    tie_jian: {
        name: '铁剑',
        type: '武器',
        quality: '凡品',
        description: '一把普通的铁剑，平平无奇。',
        attack: 8,
        price: 30
    },
    qingfeng_jian: {
        name: '青锋剑',
        type: '武器',
        quality: '良品',
        description: '剑身泛着青光，削铁如泥，是江湖中人的标配。',
        attack: 15,
        prefix: '锋利的',
        price: 120
    },
    hanbing_jian: {
        name: '寒冰剑',
        type: '武器',
        quality: '灵品',
        description: '剑身寒气逼人，挥动时有冰霜凝结。',
        attack: 28,
        prefix: '寒冰的',
        suffix: '之冰魄',
        specialEffect: '攻击时10%概率冻结目标1回合',
        price: 500
    },

    // 防具
    buyi: {
        name: '粗布衣',
        type: '防具',
        quality: '凡品',
        description: '普通的粗布衣裳，聊胜于无。',
        defense: 3,
        price: 10
    },
    pi_jia: {
        name: '皮甲',
        type: '防具',
        quality: '良品',
        description: '以兽皮制成的轻甲，兼顾防护与灵活。',
        defense: 10,
        price: 80
    },

    // 杂物
    qian_deng: {
        name: '油灯',
        type: '杂物',
        description: '一盏普通的油灯，可在黑暗中照明。',
        price: 5
    },
    sheng_suo: {
        name: '绳索',
        type: '杂物',
        description: '十丈麻绳，攀爬必备。',
        price: 8
    }
};

// 词缀库
export const PREFIXES = [
    { name: '锋利的', attr: 'attack', bonus: 0.12 },
    { name: '坚固的', attr: 'defense', bonus: 0.12 },
    { name: '灵动的', attr: 'shenfa', bonus: 5 },
    { name: '嗜血的', attr: 'lifesteal', bonus: 0.04 },
    { name: '破甲的', attr: 'armorPen', bonus: 0.1 },
    { name: '狂暴的', attr: 'crit', bonus: 0.08 },
    { name: '慈悲的', attr: 'healBonus', bonus: 0.15 },
    { name: '隐匿的', attr: 'stealth', bonus: 0.1 },
];

export const SUFFIXES = [
    { name: '之龙力', attr: 'gengu', bonus: 3 },
    { name: '之疾风', attr: 'shenfa', bonus: 3 },
    { name: '之磐石', attr: 'maxHp', bonus: 30 },
    { name: '之灵泉', attr: 'mpRegen', bonus: 5 },
    { name: '之天劫', attr: 'thunderDmg', bonus: 10 },
    { name: '之贪婪', attr: 'dropRate', bonus: 0.05 },
];