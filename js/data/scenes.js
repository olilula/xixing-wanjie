/**
 * 场景数据（v2.0 - 增加怪物/遇敌率/安全区标记）
 */
export const SCENES = {

    changan_south_gate: {
        id: 'changan_south_gate',
        area: '南赡部洲·长安',
        name: '长安·南城门',
        safe: true,
        encounterRate: 0,
        description: `巍峨的长安城南门矗立眼前，城墙高数丈，青砖斑驳，尽显大唐气象。
城门洞开，人流如织。守门的唐军将士披甲执锐，目光警惕地扫视着来往行人。
城门外是一条宽阔的官道，向南延伸至终南山方向。`,
        exits: { north: 'changan_main_street', south: 'guandao_south', east: 'changan_east_market', west: 'changan_west_market' },
        npcs: [{ name: '守门将士', alias: '将士', description: '一名身披明光铠的唐军将士。', greeting: '进城出示路引，出城登记姓名。最近城外不太平，小心些。' }],
        items: [],
        monsters: [],
        examine: { '城墙': '城墙高约四丈，以夯土为芯、青砖包砌。', '官道': '官道以碎石铺就，向南直通终南山。' },
        event: '一阵急促的马蹄声从南方传来，一骑快马扬尘而过，马上之人满身血污，高喊着"妖……妖怪……"',
        eventChance: 0.2
    },

    changan_main_street: {
        id: 'changan_main_street',
        area: '南赡部洲·长安',
        name: '长安·朱雀大街',
        safe: true,
        encounterRate: 0,
        description: `朱雀大街是长安城的中轴要道，宽逾百步，两旁店铺林立，旗幡招展。
酒楼、茶肆、绸缎庄、药铺、书斋……各色招牌令人目不暇接。`,
        exits: { south: 'changan_south_gate', north: 'changan_palace_gate', east: 'changan_east_market', west: 'changan_west_market' },
        npcs: [
            { name: '卖糖葫芦的老头', alias: '老头', description: '一个鹤发童颜的老头。', greeting: '客官，来串糖葫芦？两文钱一串！' },
            { name: '说书先生', alias: '先生', description: '一个身着青衫的中年文士。', greeting: '且听我道来——话说那齐天大圣……' }
        ],
        items: [{ name: '铜钱', type: '货币', quality: '凡品', description: '地上散落着几枚开元通宝。', value: 5 }],
        monsters: [],
        searchResult: '你在人群缝隙中发现地上有几枚铜钱。',
        searchOnce: true,
        searchItem: { name: '铜钱×5', type: '货币', value: 5 }
    },

    changan_east_market: {
        id: 'changan_east_market',
        area: '南赡部洲·长安',
        name: '长安·东市',
        safe: true,
        encounterRate: 0,
        description: `东市是长安最繁华的商贸之地，占地数百亩，店铺逾千。
叫卖声、讨价还价声、算盘声交织成一片喧嚣。`,
        exits: { west: 'changan_main_street', south: 'changan_south_gate' },
        npcs: [{ name: '药铺掌柜', alias: '掌柜', description: '一个精瘦的中年人。', greeting: '客官抓药？本店金创药、回气丹，童叟无欺！' }],
        items: [],
        monsters: []
    },

    changan_west_market: {
        id: 'changan_west_market',
        area: '南赡部洲·长安',
        name: '长安·西市',
        safe: true,
        encounterRate: 0,
        description: `西市较东市更为杂乱，三教九流汇聚于此。
有卖兵器的铁匠铺、算命的瞎眼道人、还有几个鬼鬼祟祟的黑市贩子。`,
        exits: { east: 'changan_main_street' },
        npcs: [
            { name: '铁匠王大锤', alias: '铁匠', description: '一个膀大腰圆的汉子。', greeting: '要买兵器？我王大锤的手艺，长安城排第二没人敢排第一！' },
            { name: '黑市贩子', alias: '贩子', description: '一个贼眉鼠眼的瘦子。', greeting: '嘘……小声点。兄弟，要不要来点好东西？' }
        ],
        items: [],
        monsters: []
    },

    changan_palace_gate: {
        id: 'changan_palace_gate',
        area: '南赡部洲·长安',
        name: '长安·承天门',
        safe: true,
        encounterRate: 0,
        description: `承天门是皇宫正门，门前广场开阔，两排石狮威严矗立。
宫墙高耸，琉璃瓦在阳光下金光闪闪。`,
        exits: { south: 'changan_main_street' },
        npcs: [{ name: '禁军统领', alias: '统领', description: '一名身披金甲的将领。', greeting: '此乃宫禁重地，闲杂人等不得靠近！' }],
        items: [],
        monsters: []
    },

    guandao_south: {
        id: 'guandao_south',
        area: '南赡部洲·长安郊外',
        name: '官道·南段',
        safe: false,
        encounterRate: 0.2,
        monsterArea: '长安郊外',
        description: `出了长安南门，官道笔直向南延伸，两旁是金黄的麦田和零星的村落。
远处终南山的轮廓在薄雾中若隐若现。`,
        exits: { north: 'changan_south_gate', south: 'zhongnan_foothill', east: 'weishui_river', west: 'wilderness_west' },
        npcs: [],
        items: [{ name: '止血草', type: '材料', quality: '凡品', description: '一株普通草药。' }],
        monsters: [
            { name: '野狼', level: 2, hp: 40, attack: 8, defense: 2, critRate: 0.05, expReward: 15, copperReward: 5, description: '一头灰毛野狼，龇着獠牙。', skills: [], drops: [{ name: '狼皮', type: '材料', quality: '凡品', description: '一张完整的狼皮。', dropRate: 0.6 }] }
        ],
        event: '前方官道上，一辆牛车陷在了泥坑里。',
        eventChance: 0.25
    },

    zhongnan_foothill: {
        id: 'zhongnan_foothill',
        area: '南赡部洲·终南山',
        name: '终南山·山脚',
        safe: false,
        encounterRate: 0.25,
        monsterArea: '终南山',
        description: `终南山自古便是修道圣地，山脚处古木参天，溪水潺潺。
空气中灵气明显比山下浓郁，深吸一口，神清气爽。`,
        exits: { north: 'guandao_south', up: 'zhongnan_daoguan' },
        npcs: [{ name: '采药童子', alias: '童子', description: '一个扎着总角的小童。', greeting: '施主也是来采药的吗？师父说今日灵气充沛呢。' }],
        items: [{ name: '灵芝', type: '材料', quality: '良品', description: '一株紫色灵芝。' }],
        monsters: [
            { name: '山蟒', level: 4, hp: 70, attack: 11, defense: 3, critRate: 0.07, expReward: 28, copperReward: 10, description: '一条碗口粗的花蟒。', skills: [{ name: '毒液喷射', power: 5, effect: 'poison', poisonDmg: 4 }], skillRate: 0.3, drops: [{ name: '蛇皮', type: '材料', quality: '凡品', description: '蟒蛇皮。', dropRate: 0.6 }, { name: '蛇胆', type: '材料', quality: '良品', description: '蟒蛇蛇胆。', dropRate: 0.25 }] }
        ],
        searchResult: '你在灌木丛中发现了几株黄精。'
    },

    zhongnan_daoguan: {
        id: 'zhongnan_daoguan',
        area: '南赡部洲·终南山',
        name: '终南山·清虚观',
        safe: true,
        encounterRate: 0,
        description: `清虚观是终南山上一座小道观，虽不宏大，却清幽雅致。
观前有一棵千年古松，枝干虬结如龙。`,
        exits: { down: 'zhongnan_foothill' },
        npcs: [{ name: '清虚道人', alias: '道人', description: '一位鹤发白须的老道。', greeting: '无量天尊。施主远道而来，可是有缘。' }],
        items: [],
        monsters: [],
        event: '清虚道人忽然睁开双眼："施主印堂发亮，近日恐有奇遇。"',
        eventChance: 0.3
    },

    weishui_river: {
        id: 'weishui_river',
        area: '南赡部洲·长安郊外',
        name: '渭水·渡口',
        safe: false,
        encounterRate: 0.2,
        monsterArea: '渭水',
        description: `渭水滔滔，水面宽阔，在日光下泛着粼粼波光。
渡口处停着几条乌篷船，一个老艄公坐在船头抽着旱烟。`,
        exits: { west: 'guandao_south' },
        npcs: [{ name: '老艄公', alias: '艄公', description: '一个皮肤黝黑的老头。', greeting: '过河？五文钱一位。最近水里不太平……' }],
        items: [],
        monsters: [
            { name: '玄龟', level: 4, hp: 90, attack: 9, defense: 12, critRate: 0.02, expReward: 30, copperReward: 12, description: '一只磨盘大的黑龟。', skills: [], canHeal: true, drops: [{ name: '龟壳', type: '材料', quality: '良品', description: '坚硬的龟壳。', dropRate: 0.5 }] }
        ],
        event: '水面"哗啦"一声巨响，一个巨大的黑影从水下掠过！',
        eventChance: 0.15
    },

    wilderness_west: {
        id: 'wilderness_west',
        area: '南赡部洲·长安郊外',
        name: '荒野·西坡',
        safe: false,
        encounterRate: 0.35,
        monsterArea: '长安郊外',
        description: `离开官道向西，是一片荒凉的丘陵地带。
枯黄的野草在风中摇曳，偶尔能听到远处传来狼嚎。`,
        exits: { east: 'guandao_south', north: 'wilderness_cave' },
        npcs: [],
        items: [],
        monsters: [
            { name: '野狼', level: 2, hp: 40, attack: 8, defense: 2, critRate: 0.05, expReward: 15, copperReward: 5, description: '一头灰毛野狼。', skills: [], drops: [{ name: '狼皮', type: '材料', quality: '凡品', dropRate: 0.6 }] },
            { name: '山贼', level: 3, hp: 55, attack: 11, defense: 4, critRate: 0.06, expReward: 20, copperReward: 25, description: '一个满脸横肉的汉子，手持鬼头刀。', skills: [{ name: '劈砍', power: 8, effect: null }], skillRate: 0.25, drops: [{ name: '鬼头刀', type: '武器', quality: '凡品', attack: 10, levelReq: 2, description: '山贼用的鬼头刀。', dropRate: 0.2 }] }
        ],
        event: '远处的草丛中，两盏幽绿色的眼睛亮了起来……',
        eventChance: 0.35
    },

    wilderness_cave: {
        id: 'wilderness_cave',
        area: '南赡部洲·长安郊外',
        name: '荒野·无名山洞',
        safe: false,
        encounterRate: 0.3,
        monsterArea: '长安郊外',
        description: `山洞内阴暗潮湿，空气中弥漫着腐臭和霉味。
洞穴深处传来"滴答滴答"的水声，以及某种沉重的呼吸声。`,
        exits: { south: 'wilderness_west' },
        npcs: [],
        items: [
            { name: '青锋剑', type: '武器', quality: '良品', attack: 15, levelReq: 3, description: '剑身泛着青光。', specialEffect: '暴击率+5%' },
            { name: '皮甲', type: '防具', quality: '良品', defense: 10, hp: 20, levelReq: 2, description: '以兽皮制成的轻甲。' },
            { name: '金创药', type: '丹药', quality: '凡品', effect: { hp: 50 }, description: '普通外伤药。' },
            { name: '肉干', type: '食物', quality: '凡品', staminaRestore: 30, edible: true, description: '风干的兽肉。' }
        ],
        monsters: [
            { name: '洞穴蝙蝠王', level: 3, hp: 55, attack: 10, defense: 3, critRate: 0.08, expReward: 25, copperReward: 10, description: '一只翼展近丈的巨大蝙蝠。', skills: [{ name: '超声波', power: 6, effect: 'stun' }], skillRate: 0.2, drops: [{ name: '蝙蝠翼', type: '材料', quality: '凡品', dropRate: 0.7 }, { name: '回气丹', type: '丹药', quality: '凡品', effect: { mp: 30 }, dropRate: 0.3 }] }
        ],
        searchResult: '你在洞壁缝隙中摸到了一个布包。',
        searchOnce: true,
        searchItem: { name: '铜钱×10', type: '货币', value: 10 },
        event: '洞穴深处传来一声低沉的咆哮……',
        eventChance: 0.4
    }
};
