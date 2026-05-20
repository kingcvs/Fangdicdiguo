export const provinces = {
  '华北': [
    { id: 'beijing', name: '北京市', heat: 95, landPrice: 50000, policy: 30, competition: 90 },
    { id: 'tianjin', name: '天津市', heat: 70, landPrice: 15000, policy: 50, competition: 60 },
    { id: 'hebei', name: '河北省', heat: 55, landPrice: 5000, policy: 70, competition: 40 },
    { id: 'shanxi', name: '山西省', heat: 45, landPrice: 3000, policy: 65, competition: 35 },
    { id: 'neimeng', name: '内蒙古', heat: 35, landPrice: 2000, policy: 80, competition: 25 }
  ],
  '华东': [
    { id: 'shanghai', name: '上海市', heat: 98, landPrice: 60000, policy: 25, competition: 95 },
    { id: 'jiangsu', name: '江苏省', heat: 75, landPrice: 8000, policy: 55, competition: 70 },
    { id: 'zhejiang', name: '浙江省', heat: 80, landPrice: 12000, policy: 50, competition: 75 },
    { id: 'anhui', name: '安徽省', heat: 50, landPrice: 4000, policy: 75, competition: 45 },
    { id: 'fujian', name: '福建省', heat: 65, landPrice: 7000, policy: 60, competition: 55 },
    { id: 'jiangxi', name: '江西省', heat: 45, landPrice: 3500, policy: 75, competition: 40 },
    { id: 'shandong', name: '山东省', heat: 60, landPrice: 5000, policy: 65, competition: 50 }
  ],
  '华南': [
    { id: 'guangdong', name: '广东省', heat: 85, landPrice: 10000, policy: 45, competition: 80 },
    { id: 'guangxi', name: '广西', heat: 50, landPrice: 3000, policy: 70, competition: 40 },
    { id: 'hainan', name: '海南省', heat: 55, landPrice: 6000, policy: 60, competition: 45 }
  ],
  '华中': [
    { id: 'henan', name: '河南省', heat: 60, landPrice: 4000, policy: 70, competition: 50 },
    { id: 'hubei', name: '湖北省', heat: 65, landPrice: 5000, policy: 65, competition: 55 },
    { id: 'hunan', name: '湖南省', heat: 55, landPrice: 4500, policy: 70, competition: 45 }
  ],
  '西南': [
    { id: 'chongqing', name: '重庆市', heat: 70, landPrice: 6000, policy: 55, competition: 60 },
    { id: 'sichuan', name: '四川省', heat: 65, landPrice: 5000, policy: 60, competition: 55 },
    { id: 'guizhou', name: '贵州省', heat: 45, landPrice: 2500, policy: 75, competition: 35 },
    { id: 'yunnan', name: '云南省', heat: 50, landPrice: 3000, policy: 70, competition: 40 },
    { id: 'xizang', name: '西藏', heat: 25, landPrice: 1500, policy: 90, competition: 15 }
  ],
  '西北': [
    { id: 'shaanxi', name: '陕西省', heat: 55, landPrice: 4000, policy: 65, competition: 45 },
    { id: 'gansu', name: '甘肃省', heat: 35, landPrice: 2000, policy: 80, competition: 25 },
    { id: 'qinghai', name: '青海省', heat: 30, landPrice: 1500, policy: 85, competition: 20 },
    { id: 'ningxia', name: '宁夏', heat: 30, landPrice: 1800, policy: 85, competition: 20 },
    { id: 'xinjiang', name: '新疆', heat: 35, landPrice: 2000, policy: 80, competition: 25 }
  ],
  '东北': [
    { id: 'liaoning', name: '辽宁省', heat: 50, landPrice: 4500, policy: 70, competition: 40 },
    { id: 'jilin', name: '吉林省', heat: 40, landPrice: 3000, policy: 75, competition: 30 },
    { id: 'heilongjiang', name: '黑龙江', heat: 35, landPrice: 2500, policy: 80, competition: 25 }
  ]
};

export const enterpriseTypes = [
  {
    id: 'limited',
    name: '有限责任公司',
    recommended: true,
    description: '股东以出资额为限承担有限责任',
    maxShareholders: 50,
    canUpgrade: true,
    financingDifficulty: '中等',
    pros: [
      '股东仅承担有限责任，风险可控',
      '可引入多位股东，分担风险',
      '后续可升级为股份有限公司',
      '融资渠道丰富'
    ],
    cons: [
      '注册流程相对复杂',
      '需要完善的公司治理结构'
    ]
  },
  {
    id: 'one-person',
    name: '一人有限责任公司',
    recommended: false,
    description: '股东仅玩家一人，100%持股',
    maxShareholders: 1,
    canUpgrade: false,
    financingDifficulty: '高',
    pros: [
      '决策效率高，一人说了算',
      '股权结构简单清晰',
      '无需与其他股东协调'
    ],
    cons: [
      '需承担无限连带责任风险',
      '后续无法进行股权融资',
      '银行贷款难度较高'
    ]
  },
  {
    id: 'partnership',
    name: '合伙企业',
    recommended: false,
    description: '普通合伙人承担无限连带责任',
    maxShareholders: 50,
    canUpgrade: false,
    financingDifficulty: '极高',
    pros: [
      '无需缴纳企业所得税，仅缴个人所得税',
      '税务负担相对较低',
      '设立流程简单'
    ],
    cons: [
      '普通合伙人承担无限连带责任',
      '无法上市',
      '股权流动性差'
    ]
  }
];

export const capitalCities = {
  beijing: '北京市',
  tianjin: '天津市',
  hebei: '石家庄市',
  shanxi: '太原市',
  neimeng: '呼和浩特市',
  shanghai: '上海市',
  jiangsu: '南京市',
  zhejiang: '杭州市',
  anhui: '合肥市',
  fujian: '福州市',
  jiangxi: '南昌市',
  shandong: '济南市',
  guangdong: '广州市',
  guangxi: '南宁市',
  hainan: '海口市',
  henan: '郑州市',
  hubei: '武汉市',
  hunan: '长沙市',
  chongqing: '重庆市',
  sichuan: '成都市',
  guizhou: '贵阳市',
  yunnan: '昆明市',
  xizang: '拉萨市',
  shaanxi: '西安市',
  gansu: '兰州市',
  qinghai: '西宁市',
  ningxia: '银川市',
  xinjiang: '乌鲁木齐市',
  liaoning: '沈阳市',
  jilin: '长春市',
  heilongjiang: '哈尔滨市'
};

export const fees = {
  registration: 1000,
  seal: 500,
  taxEquipment: 200,
  engineerSalary: 3000,
  accountantSalary: 2500
};

export const banks = [
  { id: 'icbc', name: '工商银行', rate: 0, description: '利率基准，开发贷+0.1%' },
  { id: 'ccb', name: '建设银行', rate: -0.1, description: '利率最低，开发贷基准' },
  { id: 'abc', name: '农业银行', rate: 0, description: '利率基准，开发贷+0.1%' },
  { id: 'boc', name: '中国银行', rate: 0.1, description: '利率较高，开发贷+0.2%' }
];

export function generateCreditCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let code = '91110000MA';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  code += '1XB';
  return code;
}

export function getCapitalCity(provinceId) {
  return capitalCities[provinceId] || '省会城市';
}

export function generateExistingNames() {
  const surnames = ['华', '中', '国', '金', '银', '地', '产', '恒', '盛', '远', '宏', '伟', '星', '辰', '海', '天', '地', '和', '安', '福'];
  const middles = ['城', '兴', '旺', '隆', '发', '达', '盛', '元', '亨', '利', '丰', '泰', '锦', '绣', '鹏', '程'];
  const names = [];
  
  for (let i = 0; i < 100; i++) {
    const name = surnames[Math.floor(Math.random() * surnames.length)] + 
                 middles[Math.floor(Math.random() * middles.length)] +
                 middles[Math.floor(Math.random() * middles.length)];
    if (!names.includes(name)) {
      names.push(name);
    }
  }
  
  return names;
}

export const registrationSteps = [
  { step: 1, title: '选择注册地区', icon: '📍' },
  { step: 2, title: '公司核名', icon: '✏️' },
  { step: 3, title: '选择企业性质', icon: '🏢' },
  { step: 4, title: '设置股权架构', icon: '👥' },
  { step: 5, title: '注册资本与实缴', icon: '💰' },
  { step: 6, title: '工商注册登记', icon: '📋' },
  { step: 7, title: '刻章', icon: '🔏' },
  { step: 8, title: '银行开户', icon: '🏦' },
  { step: 9, title: '税务登记', icon: '📝' },
  { step: 10, title: '房地产开发资质', icon: '📜' },
  { step: 11, title: '公司成立', icon: '🎉' }
];
