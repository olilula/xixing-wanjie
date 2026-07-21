/**
 * 场景数据 - 首批10个场景（长安周边）
 * 后续批次会扩展到670+
 */
export const SCENES = {

    // ===== 长安城 =====
    changan_south_gate: {
        id: 'changan_south_gate',
        area: '南赡部洲·长安',
        name: '长安·南城门',
        description: `巍峨的长安城南门矗立眼前，城墙高数丈，青砖斑驳，尽显大唐气象。
城门洞开，人流如织。守门的唐军将士披甲执锐，目光警惕地扫视着来往行人。
城门外是一条宽阔的官道，向南延伸至终南山方向。
城门上方"长安"二字铁画银钩，据说是太宗皇帝亲笔所书。`,
        exits: {
            north: 'changan_main_street',
            south: 'guandao_south',
            east: 'changan_east_market',
            west: 'changan_west_market'
        },
        npcs: [
            {
                name: '守门将士',
                alias: '将士',
                description: '一名身披明光铠的唐军将士，面容严肃，腰悬横刀。',
                greeting: '进城出示路引，出城登记姓名。最近城外不太平，小心些。'
            }
        ],
        items: [],
        examine: {
            '城墙': '城墙高约四丈，以夯土为芯、青砖包砌，墙头每隔百步有一座敌楼。',
            '官道': '官道以碎石铺就，宽可并行四辆马车，向南直通终南山。'
        },
        event: '一阵急促的马蹄声从南方传来，一骑快马扬尘而过，马上之人满身血污，高喊着"妖……妖怪……"便冲入了城中。',
        eventChance: 0.2
    },

    changan_main_street: {
        id: 'changan_main_street',
        area: '南赡部洲·长安',
        name: '长安·朱雀大街',
        description: `朱雀大街是长安城的中轴要道，宽逾百步，两旁店铺林立，旗幡招展。
酒楼、茶肆、绸缎庄、药铺、书斋……各色招牌令人目不暇接。
街心行人摩肩接踵，有挑担的货郎、骑马的官员、化缘的僧人、卖艺的江湖客。
空气中混杂着脂粉香、酒肉香和淡淡的檀香味。`,
        exits: {
            south: 'changan_south_gate',
            north: 'changan_palace_gate',
            east: 'changan_east_market',
            west: 'changan_west_market'
        },
        npcs: [
            {
                name: '卖糖葫芦的老头',
                alias: '老头',
                description: '一个鹤发童颜的老头，扛着一根插满糖葫芦的草靶子，笑眯眯地看着你。',
                greeting: '客官，来串糖葫芦？两文钱一串，酸甜可口！'
            },
            {
                name: '说书先生',
                alias: '先生',
                description: '一个身着青衫的中年文士，正站在茶肆门口绘声绘色地讲着什么。',
                greeting: '且听我道来——话说那齐天大圣，一个筋斗十万八千里……'
            }
        ],
        items: [
            {
                name: '铜钱',
                type: '货币',
                description: '地上散落着几枚开元通宝。',
                value: 5
            }
        ],
        searchResult: '你在人群缝隙中发现地上有几枚被人遗落的铜钱。',
        searchOnce: true,
        searchItem: { name: '铜钱×5', type: '货币', value: 5 }
    },

    changan_east_market: {
        id: 'changan_east_market',
        area: '南赡部洲·长安',
        name: '长安·东市',
        description: `东市是长安最繁华的商贸之地，占地数百亩，店铺逾千。
这里汇聚了天下奇货：西域的香料、南海的珍珠、蜀中的锦缎、关外的皮毛。
叫卖声、讨价还价声、算盘声交织成一片喧嚣。
市场中央有一座钟楼，每到午时便钟声大作，提醒商贩开市。`,
        exits: {
            west: 'changan_main_street',
            south: 'changan_south_gate'
        },
        npcs: [
            {
                name: '药铺掌柜',
                alias: '掌柜',
                description: '一个精瘦的中年人，站在"回春堂"药铺柜台后，正在拨弄算盘。',
                greeting: '客官抓药？还是买现成的丹药？本店金创药、回气丹，童叟无欺！'
            }
        ],
        items: [],
        examine: {
            '钟楼': '钟楼高三层，顶层悬一口巨钟，据说是前朝遗物，钟声可传十里。',
            '药铺': '回春堂，长安老字号。门口挂着"悬壶济世"的匾额。'
        }
    },

    changan_west_market: {
        id: 'changan_west_market',
        area: '南赡部洲·长安',
        name: '长安·西市',
        description: `西市较东市更为杂乱，三教九流汇聚于此。
有卖兵器的铁匠铺、算命的瞎眼道人、卖假药的游方郎中，还有几个鬼鬼祟祟的黑市贩子。
空气中弥漫着铁锈味和劣质酒气。角落里有人在大声赌博，引来一圈看客。`,
        exits: {
            east: 'changan_main_street'
        },
        npcs: [
            {
                name: '铁匠王大锤',
                alias: '铁匠',
                description: '一个膀大腰圆的汉子，正在炉前挥锤打铁，火星四溅。',
                greeting: '要买兵器？还是拿旧家伙来修？我王大锤的手艺，长安城排第二没人敢排第一！'
            },
            {
                name: '黑市贩子',
                alias: '贩子',
                description: '一个贼眉鼠眼的瘦子，缩在墙角，怀里抱着个布包，眼神闪烁。',
                greeting: '嘘……小声点。兄弟，要不要来点好东西？保证来路……呃，保证品质上乘。'
            }
        ],
        items: [],
        event: '忽然一阵骚动，几个巡城捕快冲了过来，黑市贩子们如鸟兽散。',
        eventChance: 0.15
    },

    changan_palace_gate: {
        id: 'changan_palace_gate',
        area: '南赡部洲·长安',
        name: '长安·承天门',
        description: `承天门是皇宫正门，门前广场开阔，两排石狮威严矗立。
宫墙高耸，琉璃瓦在阳光下金光闪闪。门前禁军森严，三步一岗五步一哨。
寻常百姓不得靠近，只能在广场外围远远观望。
据说当今圣上近日龙体欠安，朝中大事皆由太子监国。`,
        exits: {
            south: 'changan_main_street'
        },
        npcs: [
            {
                name: '禁军统领',
                alias: '统领',
                description: '一名身披金甲的将领，手持长枪，目光如电。',
                greeting: '此乃宫禁重地，闲杂人等不得靠近！速速离去！'
            }
        ],
        items: [],
        examine: {
            '石狮': '两尊汉白玉石狮，高约两丈，雕工精湛，狮口含珠，栩栩如生。',
            '宫墙': '宫墙高五丈，以糯米汁混合石灰砌成，坚如磐石。'
        }
    },

    // ===== 城外 =====
    guandao_south: {
        id: 'guandao_south',
        area: '南赡部洲·长安郊外',
        name: '官道·南段',
        description: `出了长安南门，官道笔直向南延伸，两旁是金黄的麦田和零星的村落。
远处终南山的轮廓在薄雾中若隐若现，山腰处白云缭绕。
路旁每隔十里有一座凉亭，供行人歇脚。
偶尔有商队赶着骡马经过，铃铛声清脆悦耳。`,
        exits: {
            north: 'changan_south_gate',
            south: 'zhongnan_foothill',
            east: 'weishui_river',
            west: 'wilderness_west'
        },
        npcs: [],
        items: [
            {
                name: '止血草',
                type: '材料',
                description: '一株生长在路边的普通草药，有止血之效。'
            }
        ],
        event: '前方官道上，一辆牛车陷在了泥坑里，赶车的老农正急得满头大汗。',
        eventChance: 0.25
    },

    zhongnan_foothill: {
        id: 'zhongnan_foothill',
        area: '南赡部洲·终南山',
        name: '终南山·山脚',
        description: `终南山自古便是修道圣地，山脚处古木参天，溪水潺潺。
一条青石小径蜿蜒上山，石径两旁长满了青苔和野花。
空气中灵气明显比山下浓郁，深吸一口，神清气爽。
山腰处隐约可见一座道观的飞檐翘角，偶尔传来悠扬的钟声。`,
        exits: {
            north: 'guandao_south',
            up: 'zhongnan_daoguan'
        },
        npcs: [
            {
                name: '采药童子',
                alias: '童子',
                description: '一个扎着总角的小童，背着个小竹篓，正在路边辨认草药。',
                greeting: '施主也是来山上采药的吗？师父说今日山中灵气充沛，适合修炼呢。'
            }
        ],
        items: [
            {
                name: '灵芝',
                type: '材料',
                description: '一株生长在老树根旁的紫色灵芝，散发着淡淡的药香。'
            }
        ],
        searchResult: '你在灌木丛中发现了几株黄精和一棵何首乌。'
    },

    zhongnan_daoguan: {
        id: 'zhongnan_daoguan',
        area: '南赡部洲·终南山',
        name: '终南山·清虚观',
        description: `清虚观是终南山上一座小道观，虽不宏大，却清幽雅致。
观前有一棵千年古松，枝干虬结如龙。观内供奉着太上老君像，香烟袅袅。
一位白须老道正在院中打坐，身旁放着一柄拂尘和一卷竹简。
观后有一片竹林，风吹过时沙沙作响，如天籁之音。`,
        exits: {
            down: 'zhongnan_foothill'
        },
        npcs: [
            {
                name: '清虚道人',
                alias: '道人',
                description: '一位鹤发白须的老道，面容清癯，双目微阖，似在入定。',
                greeting: '无量天尊。施主远道而来，可是有缘。且坐下喝杯清茶，待老道为你指点迷津。'
            }
        ],
        items: [],
        examine: {
            '古松': '这棵古松少说也有千年树龄，树干需三人合抱，树皮上刻着几行模糊的小字。',
            '竹简': '竹简上以古篆刻着几行文字，似乎是某种功法口诀，但你看不太懂。'
        },
        event: '清虚道人忽然睁开双眼，目光如电地看向你："施主印堂发亮，近日恐有奇遇。切记，遇水则止，逢林莫入。"',
        eventChance: 0.3
    },

    weishui_river: {
        id: 'weishui_river',
        area: '南赡部洲·长安郊外',
        name: '渭水·渡口',
        description: `渭水滔滔，水面宽阔，在日光下泛着粼粼波光。
渡口处停着几条乌篷船，一个老艄公坐在船头抽着旱烟。
河岸上芦苇丛生，偶有水鸟掠过水面，发出清脆的鸣叫。
对岸隐约可见一片集市，那是通往东边的要道。`,
        exits: {
            west: 'guandao_south'
        },
        npcs: [
            {
                name: '老艄公',
                alias: '艄公',
                description: '一个皮肤黝黑的老头，戴着斗笠，正慢悠悠地抽着旱烟。',
                greeting: '过河？五文钱一位。不过最近水里不太平，前几日有人看见水里有大家伙……'
            }
        ],
        items: [],
        examine: {
            '河水': '渭水此处宽约百丈，水流湍急，深处呈墨绿色，看不见底。',
            '芦苇': '芦苇丛中似乎有什么东西在动，但看不清楚。'
        },
        event: '忽然，水面"哗啦"一声巨响，一个巨大的黑影从水下掠过，激起数丈高的水花！老艄公脸色大变："是水妖！快退后！"',
        eventChance: 0.15
    },

    wilderness_west: {
        id: 'wilderness_west',
        area: '南赡部洲·长安郊外',
        name: '荒野·西坡',
        description: `离开官道向西，是一片荒凉的丘陵地带。
枯黄的野草在风中摇曳，几棵歪脖子树立在坡顶，像佝偻的老人。
这里人迹罕至，偶尔能听到远处传来狼嚎。
北面的山坡上有一个黑黢黢的山洞，不知通向何处。`,
        exits: {
            east: 'guandao_south',
            north: 'wilderness_cave'
        },
        npcs: [],
        items: [],
        examine: {
            '山洞': '洞口约一人高，里面黑漆漆的，隐隐有一股腥臭味飘出。地上有新鲜的爪印。',
            '歪脖子树': '树干上刻着几个歪歪扭扭的字："前方有虎，速退！"',
        },
        event: '你踩到了一根枯枝，"咔嚓"一声在寂静中格外刺耳。远处的草丛中，两盏幽绿色的眼睛亮了起来……',
        eventChance: 0.35
    },

    wilderness_cave: {
        id: 'wilderness_cave',
        area: '南赡部洲·长安郊外',
        name: '荒野·无名山洞',
        description: `山洞内阴暗潮湿，空气中弥漫着腐臭和霉味。
借着微弱的光线，你看到洞壁上有一些模糊的刻痕，似乎是某种记号。
地上散落着兽骨和破旧的衣物碎片，角落里有一堆干草，像是某种生物的巢穴。
洞穴深处传来"滴答滴答"的水声，以及……某种沉重的呼吸声。`,
        exits: {
            south: 'wilderness_west'
        },
        npcs: [],
        items: [
            {
                name: '生锈的铁剑',
                type: '武器',
                description: '一把锈迹斑斑的铁剑，剑身上有缺口，但勉强还能用。',
                attack: 5,
                quality: '凡品'
            },
            {
                name: '金创药',
                type: '丹药',
                description: '一小瓶金创药，可治疗外伤。',
                effect: { hp: 50 }
            }
        ],
        searchResult: '你在洞壁缝隙中摸到了一个布包，里面有几枚铜钱和一块干粮。',
        searchOnce: true,
        searchItem: { name: '铜钱×10', type: '货币', value: 10 },
        event: '洞穴深处传来一声低沉的咆哮，地面微微震颤。有什么东西……醒了。',
        eventChance: 0.4
    }
};