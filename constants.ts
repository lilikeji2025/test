
import { CategoryId, CategoryConfig, Trait, QuizQuestion } from './types';

export const INITIAL_COINS = 20;

export const CATEGORIES: Record<Exclude<CategoryId, CategoryId.POOL>, CategoryConfig> = {
  [CategoryId.MUST_HAVE]: {
    id: CategoryId.MUST_HAVE,
    title: "绝对核心 (Must Have)",
    description: "底线不可触碰，价格翻倍",
    borderColor: "border-purple-500",
    iconColor: "text-purple-400",
    bgColor: "bg-purple-900/20",
    costMultiplier: 2, // Cost x2
    acceptsType: 'positive'
  },
  [CategoryId.BONUS]: {
    id: CategoryId.BONUS,
    title: "加分项 (Bonus)",
    description: "多多益善，原价购买",
    borderColor: "border-amber-400",
    iconColor: "text-amber-300",
    bgColor: "bg-amber-900/20",
    costMultiplier: 1, // Cost x1
    acceptsType: 'positive'
  },
  [CategoryId.DEAL_BREAKER]: {
    id: CategoryId.DEAL_BREAKER,
    title: "绝对雷点 (Deal Breaker)",
    description: "最多选3个，不退不补",
    borderColor: "border-red-500",
    iconColor: "text-red-400",
    bgColor: "bg-red-900/20",
    limit: 3,
    costMultiplier: 0, // No cost/refund
    acceptsType: 'negative'
  },
  [CategoryId.FLAW]: {
    id: CategoryId.FLAW,
    title: "可接受缺点 (Acceptable)",
    description: "忍受缺点赚取金币",
    borderColor: "border-slate-500 border-dashed",
    iconColor: "text-slate-400",
    bgColor: "bg-slate-800/40",
    costMultiplier: -1, // Refund value
    acceptsType: 'negative'
  }
};

export const FALLBACK_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    question: '如果在婚后第五年，对方因为意外导致家庭经济陷入危机，你会？',
    options: [
      { id: 'a', text: '既然当初选了经济条件，现在没了就离婚' },
      { id: 'b', text: '动用自己的积蓄共渡难关' },
      { id: 'c', text: '接受生活降级，精神支持' }
    ]
  },
  {
    id: 'q2',
    question: '你最不能忍受对方在哪个方面对你隐瞒？',
    options: [
      { id: 'a', text: '过往的情感经历' },
      { id: 'b', text: '真实的财务状况' },
      { id: 'c', text: '内心的负面情绪' }
    ]
  },
  {
    id: 'q3',
    question: '如果必须放弃一个你选中的“核心”特质来换取对方永远不出轨，你选哪个？',
    options: [
      { id: 'a', text: '放弃外貌相关的特质' },
      { id: 'b', text: '放弃物质相关的特质' },
      { id: 'c', text: '绝不放弃，出轨就离' }
    ]
  }
];

export const INITIAL_TRAITS: Trait[] = [
  // --- 1 Coin Merits (一个金币优点) ---
  { id: '101', label: '主动', emoji: '🔥', tags: ['personality'], value: 1, type: 'positive' },
  { id: '102', label: '中等偏上颜值', emoji: '✨', tags: ['looks'], value: 1, type: 'positive' },
  { id: '103', label: '诚实善良', emoji: '😇', tags: ['personality'], value: 1, type: 'positive' },
  { id: '104', label: '孝顺正直', emoji: '🎋', tags: ['family', 'personality'], value: 1, type: 'positive' },
  { id: '105', label: '尊重对方', emoji: '🤝', tags: ['personality'], value: 1, type: 'positive' },
  { id: '106', label: '负责专一', emoji: '🔒', tags: ['personality', 'red_flag'], value: 1, type: 'positive' },
  { id: '107', label: 'e人', emoji: '🎉', tags: ['personality'], value: 1, type: 'positive' },
  { id: '108', label: '会做饭', emoji: '🍳', tags: ['domestic'], value: 1, type: 'positive' },
  { id: '109', label: '包容脾气', emoji: '🤗', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '110', label: '上进', emoji: '📈', tags: ['resource'], value: 1, type: 'positive' },
  { id: '111', label: '情绪稳定', emoji: '😌', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '112', label: '幽默', emoji: '🤡', tags: ['personality'], value: 1, type: 'positive' },
  { id: '113', label: '家庭和睦', emoji: '🏠', tags: ['family'], value: 1, type: 'positive' },
  { id: '114', label: '父母通情达理', emoji: '👴', tags: ['family'], value: 1, type: 'positive' },
  { id: '115', label: '喜欢运动', emoji: '🏃', tags: ['lifestyle'], value: 1, type: 'positive' },
  { id: '116', label: '共情能力强', emoji: '❤️', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '117', label: '提供情绪价值', emoji: '🍬', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '118', label: '有边界感', emoji: '🚧', tags: ['personality'], value: 1, type: 'positive' },
  { id: '119', label: '自律', emoji: '⏰', tags: ['lifestyle'], value: 1, type: 'positive' },
  { id: '120', label: '解决问题强', emoji: '🛠️', tags: ['resource'], value: 1, type: 'positive' },
  { id: '121', label: '抗压能力强', emoji: '🏋️', tags: ['personality'], value: 1, type: 'positive' },
  { id: '122', label: '好学', emoji: '📚', tags: ['personality'], value: 1, type: 'positive' },
  { id: '123', label: '理性消费', emoji: '💳', tags: ['resource'], value: 1, type: 'positive' },
  { id: '124', label: '有储蓄意识', emoji: '💰', tags: ['resource'], value: 1, type: 'positive' },
  { id: '125', label: '形象管理', emoji: '👔', tags: ['looks'], value: 1, type: 'positive' },
  { id: '126', label: '生育契合', emoji: '👶', tags: ['family'], value: 1, type: 'positive' },
  { id: '127', label: '原生和睦', emoji: '👨‍👩‍👦', tags: ['family'], value: 1, type: 'positive' },
  { id: '128', label: '共同规划', emoji: '🗺️', tags: ['personality'], value: 1, type: 'positive' },
  { id: '129', label: '工作稳定', emoji: '💼', tags: ['resource'], value: 1, type: 'positive' },
  { id: '130', label: '健康达标', emoji: '💪', tags: ['looks'], value: 1, type: 'positive' },
  { id: '131', label: '无负债', emoji: '🆓', tags: ['resource'], value: 1, type: 'positive' },
  { id: '132', label: '不攀比物质', emoji: '💎', tags: ['resource', 'personality'], value: 1, type: 'positive' },
  { id: '133', label: '金钱大方', emoji: '💸', tags: ['resource'], value: 1, type: 'positive' },
  { id: '134', label: '经济共担', emoji: '⚖️', tags: ['resource'], value: 1, type: 'positive' },
  { id: '135', label: '社交干净', emoji: '🧹', tags: ['lifestyle'], value: 1, type: 'positive' },
  { id: '136', label: '恋爱经历少', emoji: '🌱', tags: ['lifestyle'], value: 1, type: 'positive' },
  { id: '137', label: '心思简单', emoji: '🥛', tags: ['personality'], value: 1, type: 'positive' },
  { id: '138', label: '乐观爱笑', emoji: '😄', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '139', label: '不控制', emoji: '🪁', tags: ['personality'], value: 1, type: 'positive' },
  { id: '140', label: '适度陪伴', emoji: '👫', tags: ['lifestyle'], value: 1, type: 'positive' },
  { id: '141', label: '粘人', emoji: '🐨', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '142', label: '平等观念', emoji: '⚖️', tags: ['personality'], value: 1, type: 'positive' },
  { id: '143', label: '不迷信', emoji: '🚫', tags: ['personality'], value: 1, type: 'positive' },
  { id: '144', label: '社会责任感', emoji: '🌍', tags: ['personality'], value: 1, type: 'positive' },
  { id: '145', label: '关心伴侣', emoji: '💓', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '146', label: '会认错', emoji: '🙇', tags: ['personality'], value: 1, type: 'positive' },
  { id: '147', label: '浪漫', emoji: '🌹', tags: ['lifestyle'], value: 1, type: 'positive' },
  { id: '148', label: '动手能力强', emoji: '🔧', tags: ['domestic'], value: 1, type: 'positive' },
  { id: '149', label: '爱干净', emoji: '🧼', tags: ['lifestyle'], value: 1, type: 'positive' },
  { id: '150', label: '成熟稳重', emoji: '🗿', tags: ['personality'], value: 1, type: 'positive' },
  { id: '151', label: '聪明逻辑强', emoji: '🧠', tags: ['resource'], value: 1, type: 'positive' },
  { id: '152', label: '聊得来', emoji: '💬', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '153', label: '节俭', emoji: '🐷', tags: ['resource'], value: 1, type: 'positive' },
  { id: '154', label: '双方没隐私', emoji: '📖', tags: ['lifestyle'], value: 1, type: 'positive' },
  { id: '155', label: '爱思考问题', emoji: '🤔', tags: ['personality'], value: 1, type: 'positive' },
  { id: '156', label: '高情商', emoji: '🎭', tags: ['emotion'], value: 1, type: 'positive' },
  { id: '157', label: '编制内', emoji: '🏛️', tags: ['resource'], value: 1, type: 'positive' },
  { id: '158', label: '同家乡', emoji: '🏡', tags: ['family'], value: 1, type: 'positive' },
  { id: '159', label: '思想独立', emoji: '🦅', tags: ['personality'], value: 1, type: 'positive' },
  { id: '160', label: '消费观一致', emoji: '💳', tags: ['resource'], value: 1, type: 'positive' },
  { id: '161', label: '一线城市户口', emoji: '🌆', tags: ['resource'], value: 1, type: 'positive' },
  { id: '162', label: '年龄小', emoji: '🍼', tags: ['looks'], value: 1, type: 'positive' },
  { id: '163', label: '有车', emoji: '🚗', tags: ['resource'], value: 1, type: 'positive' },

  // --- 2 Coin Merits (两个金币优点) ---
  { id: '201', label: '180+/168+', emoji: '🦒', tags: ['looks'], value: 2, type: 'positive' },
  { id: '202', label: '年入50万+/35万+', emoji: '💰', tags: ['resource'], value: 2, type: 'positive' },
  { id: '203', label: '净资产100万+', emoji: '🏦', tags: ['resource'], value: 2, type: 'positive' },
  { id: '204', label: '班草/班花级颜值', emoji: '🌟', tags: ['looks'], value: 2, type: 'positive' },
  { id: '205', label: '常春藤/985', emoji: '🎓', tags: ['resource'], value: 2, type: 'positive' },
  { id: '206', label: '工资上交', emoji: '💳', tags: ['resource'], value: 2, type: 'positive' },
  { id: '207', label: '永远主动认错', emoji: '🙇‍♂️', tags: ['emotion'], value: 2, type: 'positive' },
  { id: '208', label: '一线城市全款房', emoji: '🏠', tags: ['resource'], value: 2, type: 'positive' },
  { id: '209', label: '某些领域有成就', emoji: '🏆', tags: ['resource'], value: 2, type: 'positive' },
  { id: '210', label: '单纯简单', emoji: '⚪', tags: ['personality'], value: 2, type: 'positive' },

  // --- 1 Coin Flaws (一个金币缺点) - Value 1 (Refunds 1) ---
  { id: '301', label: '玻璃心', emoji: '💔', tags: ['emotion'], value: 1, type: 'negative' },
  { id: '302', label: 'i人', emoji: '🤫', tags: ['personality'], value: 1, type: 'negative' },
  { id: '303', label: '迷信', emoji: '🔮', tags: ['personality'], value: 1, type: 'negative' },
  { id: '304', label: '感情复杂', emoji: '🕸️', tags: ['lifestyle'], value: 1, type: 'negative' },
  { id: '305', label: '逃避问题', emoji: '🏃‍♂️', tags: ['personality'], value: 1, type: 'negative' },
  { id: '306', label: '懒散', emoji: '🦥', tags: ['lifestyle'], value: 1, type: 'negative' },
  { id: '307', label: '<170/<158', emoji: '📏', tags: ['looks'], value: 1, type: 'negative' },
  { id: '308', label: '奢靡', emoji: '🥂', tags: ['resource', 'lifestyle'], value: 1, type: 'negative' },
  { id: '309', label: '中等偏下颜值', emoji: '😐', tags: ['looks'], value: 1, type: 'negative' },
  { id: '310', label: '收入不稳定', emoji: '📉', tags: ['resource'], value: 1, type: 'negative' },
  { id: '311', label: '抠门', emoji: '🤏', tags: ['resource'], value: 1, type: 'negative' },
  { id: '312', label: '高冷傲娇', emoji: '😒', tags: ['personality'], value: 1, type: 'negative' },
  { id: '313', label: '自我为中心', emoji: '🤴', tags: ['personality'], value: 1, type: 'negative' },
  { id: '314', label: '不爱卫生', emoji: '🗑️', tags: ['lifestyle'], value: 1, type: 'negative' },
  { id: '315', label: '没话聊', emoji: '🤐', tags: ['emotion'], value: 1, type: 'negative' },
  { id: '316', label: '离异', emoji: '💔', tags: ['family'], value: 1, type: 'negative' },
  { id: '317', label: '无仪式感', emoji: '📅', tags: ['lifestyle'], value: 1, type: 'negative' },
  { id: '318', label: '工作不稳定', emoji: '⚠️', tags: ['resource'], value: 1, type: 'negative' },
  { id: '319', label: '高彩礼', emoji: '💰', tags: ['resource'], value: 1, type: 'negative' },
  { id: '320', label: '抽烟喝酒', emoji: '🚬', tags: ['lifestyle'], value: 1, type: 'negative' },
  { id: '321', label: '蹦迪纹身', emoji: '🕺', tags: ['lifestyle'], value: 1, type: 'negative' },
  { id: '322', label: '异地恋', emoji: '🚆', tags: ['lifestyle'], value: 1, type: 'negative' },
  { id: '323', label: '年龄大太多', emoji: '👴', tags: ['lifestyle'], value: 1, type: 'negative' },
  { id: '324', label: '绿茶/海王', emoji: '🍵', tags: ['red_flag'], value: 1, type: 'negative' },
  { id: '325', label: '年入<10万/7万', emoji: '📉', tags: ['resource'], value: 1, type: 'negative' },
  { id: '326', label: '大专/民本', emoji: '🎓', tags: ['resource'], value: 1, type: 'negative' },
  { id: '327', label: '净资产<15万/<9万', emoji: '💸', tags: ['resource'], value: 1, type: 'negative' },

  // --- 2 Coin Flaws (两个金币缺点) - Value 2 (Refunds 2) ---
  { id: '401', label: '消费无节制', emoji: '🛍️', tags: ['resource', 'red_flag'], value: 2, type: 'negative' },
  { id: '402', label: '负资产', emoji: '📉', tags: ['resource', 'red_flag'], value: 2, type: 'negative' },
  { id: '403', label: '<166/<154', emoji: '🤏', tags: ['looks'], value: 2, type: 'negative' },
  { id: '404', label: '年入<6万/4.2万', emoji: '🚲', tags: ['resource'], value: 2, type: 'negative' },
  { id: '405', label: '高中及以下学历', emoji: '📝', tags: ['resource'], value: 2, type: 'negative' },
  { id: '406', label: '难看', emoji: '🤢', tags: ['looks'], value: 2, type: 'negative' },
  { id: '407', label: '冷暴力', emoji: '❄️', tags: ['red_flag', 'emotion'], value: 2, type: 'negative' },
  { id: '408', label: '出轨', emoji: '🦊', tags: ['red_flag'], value: 2, type: 'negative' },
  { id: '409', label: '性生活混乱', emoji: '🔞', tags: ['red_flag'], value: 2, type: 'negative' },
  { id: '410', label: '家暴', emoji: '🥊', tags: ['red_flag'], value: 2, type: 'negative' },
  { id: '411', label: '赌博', emoji: '🎲', tags: ['red_flag'], value: 2, type: 'negative' },
  { id: '412', label: '抠搜', emoji: '🦠', tags: ['resource', 'personality'], value: 2, type: 'negative' }
];
