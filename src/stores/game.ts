import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, Company, Player, Land, Project, City, ResearchProject, CityResearch, MarketLand, LandMarketConfig, ProjectType, QualityLevel, ProjectTypeConfig, QualityLevelConfig, DevelopmentPlan, FiveCertificates, ProjectPhases, PhaseDetail, CertificateStatus, ProjectStatus, ConstructionPhase, QualificationRequirement, IPORequirement, StockInfo, FinancialStatements, BalanceSheet, IncomeStatement, CashFlowStatement } from '@/types/game'

// 从原始localStorage key读取数据
const OLD_SAVE_KEY = 'real-estate-save'
const SAVE_KEY_PREFIX = 'real-estate-save-'
const AUTO_SAVE_KEY = 'real-estate-save-auto'

// 城市研究项目数据
const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: 'infra_metro',
    name: '地铁规划研究',
    description: '研究城市地铁线路规划，提升区域交通便利性',
    category: 'infrastructure',
    cost: 5000000,
    researchPoints: 100,
    duration: 3,
    priceBoost: 5,
    requirements: [],
    icon: '🚇'
  },
  {
    id: 'infra_highway',
    name: '高速路网研究',
    description: '研究城市高速公路网络，改善区域通达性',
    category: 'infrastructure',
    cost: 3000000,
    researchPoints: 60,
    duration: 2,
    priceBoost: 3,
    requirements: [],
    icon: '🛣️'
  },
  {
    id: 'infra_park',
    name: '公园绿地规划',
    description: '研究城市公园绿地布局，提升居住环境品质',
    category: 'infrastructure',
    cost: 2000000,
    researchPoints: 40,
    duration: 1,
    priceBoost: 2,
    requirements: [],
    icon: '🌳'
  },
  {
    id: 'policy_talent',
    name: '人才引进政策',
    description: '研究人才引进政策，吸引高素质人口流入',
    category: 'policy',
    cost: 8000000,
    researchPoints: 150,
    duration: 4,
    priceBoost: 8,
    requirements: ['infra_metro'],
    icon: '🎓'
  },
  {
    id: 'policy_tax',
    name: '税收优惠政策',
    description: '研究税收优惠政策，吸引企业投资入驻',
    category: 'policy',
    cost: 6000000,
    researchPoints: 120,
    duration: 3,
    priceBoost: 6,
    requirements: [],
    icon: '💰'
  },
  {
    id: 'marketing_brand',
    name: '城市品牌营销',
    description: '研究城市品牌营销策略，提升城市知名度',
    category: 'marketing',
    cost: 4000000,
    researchPoints: 80,
    duration: 2,
    priceBoost: 4,
    requirements: [],
    icon: '📢'
  },
  {
    id: 'quality_school',
    name: '学区资源整合',
    description: '研究优质学区资源整合，提升教育配套价值',
    category: 'quality',
    cost: 10000000,
    researchPoints: 200,
    duration: 5,
    priceBoost: 12,
    requirements: ['policy_talent'],
    icon: '🏫'
  },
  {
    id: 'quality_hospital',
    name: '医疗资源升级',
    description: '研究医疗资源升级方案，提升医疗配套水平',
    category: 'quality',
    cost: 7000000,
    researchPoints: 140,
    duration: 4,
    priceBoost: 7,
    requirements: [],
    icon: '🏥'
  },
  {
    id: 'tech_smart',
    name: '智慧城市建设',
    description: '研究智慧城市建设方案，提升居住体验',
    category: 'technology',
    cost: 12000000,
    researchPoints: 250,
    duration: 6,
    priceBoost: 15,
    requirements: ['quality_school', 'policy_talent'],
    icon: '🏙️'
  },
  {
    id: 'tech_green',
    name: '绿色建筑标准',
    description: '研究绿色建筑标准，打造生态宜居城市',
    category: 'technology',
    cost: 5000000,
    researchPoints: 100,
    duration: 3,
    priceBoost: 5,
    requirements: ['infra_park'],
    icon: '🌱'
  }
]

// 城市数据
const CITIES_DATA: City[] = [
  {
    id: 'beijing',
    name: '北京',
    description: '政治文化中心，高端市场',
    province: '北京',
    avgPrice: 80000,
    developmentLevel: 85,
    potential: 75,
    population: 21890000,
    gdp: 4161000000000,
    tags: ['一线城市', '政治中心', '文化中心'],
    research: {
      cityId: 'beijing',
      completedProjects: [],
      inProgressProject: null,
      progress: 0
    }
  },
  {
    id: 'shanghai',
    name: '上海',
    description: '经济金融中心，国际化大都市',
    province: '上海',
    avgPrice: 78000,
    developmentLevel: 88,
    potential: 80,
    population: 24890000,
    gdp: 4720000000000,
    tags: ['一线城市', '经济中心', '国际化'],
    research: {
      cityId: 'shanghai',
      completedProjects: [],
      inProgressProject: null,
      progress: 0
    }
  },
  {
    id: 'guangzhou',
    name: '广州',
    description: '华南中心，商贸活跃',
    province: '广东',
    avgPrice: 45000,
    developmentLevel: 75,
    potential: 70,
    population: 18810000,
    gdp: 2883900000000,
    tags: ['一线城市', '商贸中心', '华南'],
    research: {
      cityId: 'guangzhou',
      completedProjects: [],
      inProgressProject: null,
      progress: 0
    }
  },
  {
    id: 'shenzhen',
    name: '深圳',
    description: '科技创新中心，年轻活力',
    province: '广东',
    avgPrice: 70000,
    developmentLevel: 82,
    potential: 85,
    population: 17560000,
    gdp: 3460600000000,
    tags: ['一线城市', '科技中心', '年轻'],
    research: {
      cityId: 'shenzhen',
      completedProjects: [],
      inProgressProject: null,
      progress: 0
    }
  },
  {
    id: 'hangzhou',
    name: '杭州',
    description: '电商之都，宜居城市',
    province: '浙江',
    avgPrice: 38000,
    developmentLevel: 72,
    potential: 78,
    population: 12370000,
    gdp: 1875300000000,
    tags: ['新一线', '电商', '宜居'],
    research: {
      cityId: 'hangzhou',
      completedProjects: [],
      inProgressProject: null,
      progress: 0
    }
  },
  {
    id: 'chengdu',
    name: '成都',
    description: '西南中心，休闲宜居',
    province: '四川',
    avgPrice: 20000,
    developmentLevel: 65,
    potential: 72,
    population: 21190000,
    gdp: 2081700000000,
    tags: ['新一线', '西南中心', '休闲'],
    research: {
      cityId: 'chengdu',
      completedProjects: [],
      inProgressProject: null,
      progress: 0
    }
  },
  {
    id: 'wuhan',
    name: '武汉',
    description: '九省通衢，中部崛起',
    province: '湖北',
    avgPrice: 18000,
    developmentLevel: 62,
    potential: 68,
    population: 13730000,
    gdp: 1886600000000,
    tags: ['新一线', '中部中心', '交通枢纽'],
    research: {
      cityId: 'wuhan',
      completedProjects: [],
      inProgressProject: null,
      progress: 0
    }
  },
  {
    id: 'xian',
    name: '西安',
    description: '古都新韵，西部核心',
    province: '陕西',
    avgPrice: 15000,
    developmentLevel: 58,
    potential: 65,
    population: 13160000,
    gdp: 1148600000000,
    tags: ['新一线', '西部中心', '历史名城'],
    research: {
      cityId: 'xian',
      completedProjects: [],
      inProgressProject: null,
      progress: 0
    }
  }
]

// 土地市场配置
const LAND_MARKET_CONFIG: LandMarketConfig = {
  maxLandCount: 6,
  refreshIntervalDays: 15,
  priceMultiplierByQualification: {
    1: 0.7,
    2: 0.85,
    3: 1.0,
    4: 1.15
  },
  maxAreaByQualification: {
    1: Infinity,
    2: 2500000,
    3: 1500000,
    4: 500000
  },
  discountRateByCredit: {
    'AAA': 0.70,
    'AA': 0.80,
    'A': 0.90,
    'B': 1.00,
    'C': 1.10
  }
}

// 土地用途类型
type LandUseType = '住宅' | '商业' | '综合体' | '工业'

// 土地用途配置
const LAND_USE_CONFIG: Record<LandUseType, { floorAreaRatio: [number, number]; buildingDensity: [number, number]; greeningRate: [number, number]; useYears: number; priceMultiplier: number }> = {
  '住宅': { floorAreaRatio: [2.0, 3.5], buildingDensity: [0.2, 0.35], greeningRate: [0.30, 0.45], useYears: 70, priceMultiplier: 1.0 },
  '商业': { floorAreaRatio: [3.0, 6.0], buildingDensity: [0.3, 0.5], greeningRate: [0.20, 0.35], useYears: 40, priceMultiplier: 1.3 },
  '综合体': { floorAreaRatio: [3.5, 5.5], buildingDensity: [0.35, 0.5], greeningRate: [0.25, 0.35], useYears: 50, priceMultiplier: 1.2 },
  '工业': { floorAreaRatio: [1.0, 2.5], buildingDensity: [0.4, 0.6], greeningRate: [0.15, 0.25], useYears: 50, priceMultiplier: 0.6 }
}

// 土地标签池
const LAND_TAG_POOL = ['地铁旁', '江景房', '学区房', 'CBD核心', '新城规划', '旧改项目', 'TOD项目', '景观资源', '产业配套', '政策倾斜', '价格洼地', '升值潜力大']

// 项目类型配置
const PROJECT_TYPE_CONFIGS: ProjectTypeConfig[] = [
  { type: '住宅', baseCostPerSqm: 3000, priceMultiplier: 1.0, constructionPeriod: 24, minArea: 10000 },
  { type: '别墅', baseCostPerSqm: 5000, priceMultiplier: 1.5, constructionPeriod: 30, minArea: 5000 },
  { type: '公寓', baseCostPerSqm: 2500, priceMultiplier: 0.9, constructionPeriod: 18, minArea: 8000 },
  { type: '商业', baseCostPerSqm: 4000, priceMultiplier: 1.2, constructionPeriod: 24, minArea: 15000 },
  { type: '写字楼', baseCostPerSqm: 4500, priceMultiplier: 1.3, constructionPeriod: 28, minArea: 20000 },
  { type: '购物中心', baseCostPerSqm: 5000, priceMultiplier: 1.4, constructionPeriod: 32, minArea: 30000 },
  { type: '综合体', baseCostPerSqm: 4500, priceMultiplier: 1.25, constructionPeriod: 36, minArea: 25000 },
  { type: '产业园', baseCostPerSqm: 2000, priceMultiplier: 0.8, constructionPeriod: 20, minArea: 50000 }
]

// 品味配置
const QUALITY_LEVEL_CONFIGS: QualityLevelConfig[] = [
  { level: '高端', costMultiplier: 1.5, priceMultiplier: 1.8, brandBoost: 10, description: '高端品质，顶级配置，品牌溢价高' },
  { level: '中端', costMultiplier: 1.0, priceMultiplier: 1.0, brandBoost: 5, description: '标准品质，性价比适中，市场主流' },
  { level: '低端', costMultiplier: 0.7, priceMultiplier: 0.8, brandBoost: 0, description: '经济品质，成本控制，快速回款' }
]

// 施工阶段配置
const CONSTRUCTION_PHASE_CONFIG: Record<ConstructionPhase, { name: string; progressRange: [number, number]; duration: number }> = {
  'foundation': { name: '基础施工', progressRange: [0, 15], duration: 3 },
  'structure': { name: '主体结构', progressRange: [15, 45], duration: 8 },
  'enclosure': { name: '围护结构', progressRange: [45, 60], duration: 4 },
  'interior': { name: '内部装修', progressRange: [60, 80], duration: 5 },
  'equipment': { name: '设备安装', progressRange: [80, 90], duration: 2 },
  'landscape': { name: '景观绿化', progressRange: [90, 95], duration: 1 },
  'completion': { name: '竣工验收', progressRange: [95, 100], duration: 1 }
}

// 五证办理配置
const CERTIFICATE_CONFIG: Record<string, { name: string; cost: number; duration: number; requiredPhase?: string }> = {
  'landUsePermit': { name: '土地使用证', cost: 50000, duration: 1 },
  'constructionPlanningPermit': { name: '建设工程规划许可证', cost: 100000, duration: 2 },
  'constructionPermit': { name: '建设工程施工许可证', cost: 80000, duration: 1, requiredPhase: 'planning' },
  'presalePermit': { name: '商品房预售许可证', cost: 150000, duration: 2, requiredPhase: 'structure' },
  'completionAcceptance': { name: '竣工验收备案', cost: 200000, duration: 1, requiredPhase: 'completion' }
}

// 资质升级要求配置（参考真实中国房地产资质升级流程）
const QUALIFICATION_REQUIREMENTS: QualificationRequirement[] = [
  {
    level: 4,
    name: '四级资质',
    registeredCapital: 10000000, // 1000万
    totalAssets: 20000000, // 2000万
    completedProjects: 1,
    totalSoldArea: 50000, // 5万㎡
    socialReputation: 30,
    technicalPersonnel: 10,
    notes: ['初始资质', '可承接5万㎡以下项目']
  },
  {
    level: 3,
    name: '三级资质',
    registeredCapital: 50000000, // 5000万
    totalAssets: 100000000, // 1亿
    completedProjects: 3,
    totalSoldArea: 200000, // 20万㎡
    socialReputation: 50,
    technicalPersonnel: 30,
    notes: ['注册资本≥5000万', '净资产≥1亿', '3年以上经营经历']
  },
  {
    level: 2,
    name: '二级资质',
    registeredCapital: 200000000, // 2亿
    totalAssets: 400000000, // 4亿
    completedProjects: 5,
    totalSoldArea: 500000, // 50万㎡
    socialReputation: 70,
    technicalPersonnel: 50,
    notes: ['注册资本≥2亿', '净资产≥4亿', '5年以上经营经历']
  },
  {
    level: 1,
    name: '一级资质',
    registeredCapital: 500000000, // 5亿
    totalAssets: 1000000000, // 10亿
    completedProjects: 10,
    totalSoldArea: 1000000, // 100万㎡
    socialReputation: 90,
    technicalPersonnel: 100,
    notes: ['注册资本≥5亿', '净资产≥10亿', '8年以上经营经历', '连续5年无安全事故']
  }
]

// IPO上市要求配置
const IPO_REQUIREMENTS: IPORequirement = {
  minYears: 3, // 成立满3年
  minRegisteredCapital: 50000000, // 注册资本≥5000万
  minTotalAssets: 100000000, // 总资产≥1亿
  minRevenue: 80000000, // 近3年累计营收≥8000万
  minProfit: 30000000, // 近3年累计利润≥3000万
  minProjects: 3, // 完成项目≥3个
  auditStatus: '无保留意见',
  governanceStatus: '完善'
}

// 银行货款利率配置
const BANK_LOAN_CONFIG = {
  baseRate: 0.049, // 基准利率4.9%
  termLengths: [6, 12, 24, 36, 60], // 贷款期限（月）
  rateAdjustments: {
    // 资质等级调整
    qualificationLevel: {
      1: -0.02, // 一级资质利率下调2%
      2: -0.01, // 二级资质利率下调1%
      3: 0,     // 三级资质不变
      4: 0.015  // 四级资质利率上浮1.5%
    },
    // 信用等级调整
    creditRating: {
      'AAA': -0.03, // AAA利率下调3%
      'AA': -0.02,  // AA利率下调2%
      'A': -0.01,  // A利率下调1%
      'B': 0,      // B不变
      'C': 0.02    // C利率上浮2%
    },
    // 贷款期限调整（期限越长利率越高）
    termLength: {
      6: -0.005,
      12: 0,
      24: 0.01,
      36: 0.02,
      60: 0.03
    }
  },
  maxLoanAmountRatio: 0.7, // 最高可贷金额为总资产的70%
  earlyRepaymentPenalty: 0.01 // 提前还款罚息1%
}

export interface SaveSlot {
  id: string
  name: string
  timestamp: Date
  gameTime: { year: number; month: number }
  companyName: string
  cash: number
  totalAssets: number
}

export const useGameStore = defineStore('game', () => {
  const gameState = ref<GameState | null>(null)
  const isLoading = ref(false)
  const hasOldSave = ref(false)
  const saveSlots = ref<SaveSlot[]>([])
  
  // Getters
  const isInGame = computed(() => gameState.value?.isInGame ?? false)
  const company = computed(() => gameState.value?.company)
  const cash = computed(() => company.value?.cash ?? 0)
  const totalAssets = computed(() => company.value?.totalAssets ?? 0)
  const landReserves = computed(() => gameState.value?.landReserves ?? [])
  const projects = computed(() => gameState.value?.projects ?? [])
  const researchPoints = computed(() => company.value?.researchPoints ?? 0)
  const cityResearches = computed(() => company.value?.cityResearches ?? [])
  const allCities = ref<City[]>(JSON.parse(JSON.stringify(CITIES_DATA)))
  const allResearchProjects = ref<ResearchProject[]>(RESEARCH_PROJECTS)
  
  // 检查是否有旧存档
  function checkOldSave() {
    try {
      const saveData = localStorage.getItem(OLD_SAVE_KEY)
      hasOldSave.value = !!saveData
      return saveData
    } catch (e) {
      hasOldSave.value = false
      return null
    }
  }
  
  // 转换旧存档到新格式
  function convertOldSave(oldSave: any): GameState {
    // 基础转换逻辑
    return {
      version: '3.0.0',
      isInGame: true,
      gameTime: {
        year: oldSave.date?.getFullYear() || 2008,
        month: oldSave.date?.getMonth() || 0,
        day: oldSave.date?.getDate() || 1
      },
      company: convertOldCompany(oldSave.company),
      player: convertOldPlayer(oldSave.player),
      landReserves: convertOldLand(oldSave.land || []),
      projects: convertOldProjects(oldSave.projects || []),
      aiCompetitors: [],
      macroEconomy: {
        gdpGrowthRate: oldSave.macroData?.gdpGrowth || 5,
        interestRate: oldSave.market?.interestRate || 0.05,
        urbanizationRate: 50,
        population: 1400000000,
        housingPriceIndex: oldSave.market?.housingPriceIndex || 1.0
      },
      policies: [],
      achievements: oldSave.achievements?.map((a: any) => ({
        id: a.id,
        name: a.name,
        description: a.description,
        unlocked: a.unlocked,
        unlockDate: a.unlockDate?.toISOString() || null
      })) || []
    }
  }
  
  function convertOldCompany(oldCompany: any): Company {
    return {
      id: 'company_1',
      name: oldCompany.name || '房地产公司',
      registrationProvince: oldCompany.city?.name || '北京',
      registrationCity: oldCompany.city?.name || '北京',
      establishmentDate: '2008-01-01',
      creditCode: '91110000MA001ABCDE',
      legalRepresentative: '创始人',
      registeredAddress: oldCompany.city?.name || '北京市朝阳区',
      enterpriseType: oldCompany.type === 'limited' ? 'limited' : 'one-person',
      registeredCapital: oldCompany.capital || 50000000,
      paidInCapital: oldCompany.capital || 50000000,
      shareholders: (oldCompany.shareholders || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        sharePercentage: s.sharePercentage,
        isPlayer: s.type === 'FOUNDER'
      })),
      qualificationLevel: oldCompany.qualificationLevel || 4,
      creditRating: oldCompany.creditLevel || 'C',
      cash: oldCompany.cash || 0,
      totalAssets: oldCompany.totalAssets || 0,
      totalLiabilities: oldCompany.liabilities || 0,
      monthlyProfit: oldCompany.monthlyProfit || 0,
      brand: {
        score: oldCompany.brandValue || 50,
        level: 'unknown'
      },
      executives: [],
      employees: (oldCompany.employees || []).map((e: any) => ({
        id: e.id,
        position: e.type || '员工',
        name: e.name,
        salary: e.salary
      })),
      threeRedLines: {
        assetLiabilityRatio: oldCompany.redLineStatus?.assetLiabilityRatio || 0,
        netDebtRatio: oldCompany.redLineStatus?.netDebtRatio || 0,
        cashShortTermDebtRatio: oldCompany.redLineStatus?.cashShortTermDebtRatio || 2.0
      },
      researchPoints: oldCompany.researchPoints || 50,
      cityResearches: oldCompany.cityResearches || CITIES_DATA.map(city => ({
        cityId: city.id,
        completedProjects: [],
        inProgressProject: null,
        progress: 0
      }))
    }
  }
  
  function convertOldPlayer(oldPlayer: any): Player {
    return {
      nickname: oldPlayer?.name || '创业者',
      personalAssets: [],
      relationships: [],
      abilities: {
        negotiation: oldPlayer?.skills?.negotiation || 50,
        management: oldPlayer?.skills?.leadership || 50,
        riskPrediction: oldPlayer?.skills?.finance || 50,
        publicRelations: oldPlayer?.skills?.marketing || 50
      },
      socialStatus: {
        level: 1,
        titles: [],
        reputation: oldPlayer?.reputation || 50
      },
      risks: {
        taxRisk: 0,
        briberyRisk: 0,
        publicOpinionRisk: 0,
        healthRisk: 0
      }
    }
  }
  
  function convertOldLand(oldLand: any[]): Land[] {
    return oldLand.map((l: any) => ({
      id: l.id,
      province: l.city || '北京',
      city: l.city || '北京',
      district: '城区',
      area: l.area || 0,
      floorAreaRatio: l.floorAreaRatio || 2.0,
      buildingDensity: 0.3,
      greeningRate: 0.3,
      landUse: l.type || '住宅',
      useYears: 70,
      acquisitionPrice: l.price || 0,
      acquisitionDate: l.acquiredDate?.toISOString() || '2008-01-01',
      status: l.status === 'pending' ? 'pending' : 'pending',
      currentValue: l.price || 0,
      tags: []
    }))
  }
  
  function convertOldProjects(oldProjects: any[]): Project[] {
    return oldProjects.map((p: any) => ({
      id: p.id,
      landId: 'land_' + p.id,
      name: p.name,
      status: p.status === '施工' ? 'construction' : 'planning',
      constructionProgress: p.currentStage || 0,
      fiveCertificates: {
        landUsePermit: false,
        constructionPlanningPermit: false,
        constructionPermit: false,
        presalePermit: false,
        completionPermit: false
      }
    }))
  }
  
  function createNewGame(registrationData: any) {
    isLoading.value = true
    
    // 计算实缴资本
    const paidCapital = Math.floor((registrationData.registeredCapital || 50000000) * (registrationData.paidRatio || 20) / 100)
    
    // 创建初始游戏状态
    gameState.value = {
      version: '3.0.0',
      isInGame: true,
      gameTime: {
        year: 2008,
        month: 0,
        day: 1
      },
      company: {
        id: 'company_1',
        name: registrationData.fullCompanyName || '我的房地产公司',
        registrationProvince: registrationData.provinceName || '北京',
        registrationCity: registrationData.provinceName || '北京',
        establishmentDate: '2008-01-01',
        creditCode: registrationData.creditCode || '91110000MA001ABCDE',
        legalRepresentative: registrationData.legalRepresentative || '创始人',
        registeredAddress: registrationData.registeredAddress || (registrationData.provinceName ? `${registrationData.provinceName}市朝阳区` : '北京市朝阳区'),
        enterpriseType: registrationData.enterpriseType || 'limited',
        registeredCapital: registrationData.registeredCapital || 50000000,
        paidInCapital: paidCapital,
        shareholders: (registrationData.shareholders || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          sharePercentage: s.ratio,
          isPlayer: s.isPlayer,
          capital: s.capital
        })),
        qualificationLevel: 4,
        creditRating: 'C',
        cash: paidCapital,
        totalAssets: paidCapital,
        totalLiabilities: 0,
        monthlyProfit: 0,
        brand: {
          score: 50,
          level: 'unknown'
        },
        executives: [],
        employees: [],
        threeRedLines: {
          assetLiabilityRatio: 0,
          netDebtRatio: 0,
          cashShortDebtRatio: 2.0
        },
        researchPoints: 50,
        cityResearches: CITIES_DATA.map(city => ({
          cityId: city.id,
          completedProjects: [],
          inProgressProject: null,
          progress: 0
        }))
      },
      player: {
        nickname: registrationData.legalRepresentative || '创业者',
        personalAssets: [],
        relationships: [],
        abilities: {
          negotiation: 50,
          management: 50,
          riskPrediction: 50,
          publicRelations: 50
        },
        socialStatus: {
          level: 1,
          titles: [],
          reputation: 50
        },
        risks: {
          taxRisk: 0,
          briberyRisk: 0,
          publicOpinionRisk: 0,
          healthRisk: 0
        }
      },
      landReserves: [],
      projects: [],
      aiCompetitors: [],
      macroEconomy: {
        gdpGrowthRate: 5,
        interestRate: 0.05,
        urbanizationRate: 50,
        population: 1400000000,
        housingPriceIndex: 1.0
      },
      policies: [],
      achievements: [],
      landMarket: {
        lands: [],
        lastRefreshTime: { year: 2008, month: 0, day: 1 }
      }
    }

    // 初始化土地市场
    if (gameState.value) {
      refreshLandMarket()
    }
    
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
  
  function loadSave() {
    const oldSaveData = checkOldSave()
    if (oldSaveData) {
      try {
        isLoading.value = true
        const parsed = JSON.parse(oldSaveData)
        // 转换日期对象
        if (parsed.date) {
          parsed.date = new Date(parsed.date)
        }
        gameState.value = convertOldSave(parsed)
        isLoading.value = false
        return true
      } catch (e) {
        console.error('Failed to load old save:', e)
        isLoading.value = false
        return false
      }
    }
    return false
  }
  
  function updateState(updates: Partial<GameState>) {
    if (gameState.value) {
      gameState.value = { ...gameState.value, ...updates }
    }
  }
  
  function exitGame() {
    gameState.value = null
  }

  // 获取所有存档
  function getAllSaves() {
    const slots: SaveSlot[] = []
    try {
      // 获取自动存档
      const autoSave = localStorage.getItem(AUTO_SAVE_KEY)
      if (autoSave) {
        const parsed = JSON.parse(autoSave)
        slots.push({
          id: 'auto',
          name: '自动存档',
          timestamp: new Date(parsed.timestamp),
          gameTime: parsed.gameTime,
          companyName: parsed.companyName,
          cash: parsed.cash,
          totalAssets: parsed.totalAssets
        })
      }
      
      // 获取手动存档槽1-5
      for (let i = 1; i <= 5; i++) {
        const saveData = localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`)
        if (saveData) {
          const parsed = JSON.parse(saveData)
          slots.push({
            id: `slot-${i}`,
            name: `存档 ${i}`,
            timestamp: new Date(parsed.timestamp),
            gameTime: parsed.gameTime,
            companyName: parsed.companyName,
            cash: parsed.cash,
            totalAssets: parsed.totalAssets
          })
        }
      }
      
      slots.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      saveSlots.value = slots
    } catch (e) {
      console.error('Failed to get saves:', e)
    }
  }

  // 保存游戏
  function saveGame(slotId: string = 'auto', slotName?: string) {
    if (!gameState.value) return false
    
    try {
      const saveData = {
        version: '3.0.0',
        timestamp: new Date().toISOString(),
        gameTime: gameState.value.gameTime,
        gameState: gameState.value,
        companyName: gameState.value.company.name,
        cash: gameState.value.company.cash,
        totalAssets: gameState.value.company.totalAssets
      }
      
      const key = slotId === 'auto' ? AUTO_SAVE_KEY : `${SAVE_KEY_PREFIX}${slotId.split('-')[1]}`
      localStorage.setItem(key, JSON.stringify(saveData))
      
      // 更新存档列表
      getAllSaves()
      return true
    } catch (e) {
      console.error('Failed to save game:', e)
      return false
    }
  }

  // 加载存档
  function loadSaveGame(slotId: string) {
    try {
      const key = slotId === 'auto' ? AUTO_SAVE_KEY : `${SAVE_KEY_PREFIX}${slotId.split('-')[1]}`
      const saveData = localStorage.getItem(key)
      
      if (saveData) {
        const parsed = JSON.parse(saveData)
        gameState.value = parsed.gameState
        return true
      }
    } catch (e) {
      console.error('Failed to load save:', e)
    }
    return false
  }

  // 删除存档
  function deleteSave(slotId: string) {
    try {
      const key = slotId === 'auto' ? AUTO_SAVE_KEY : `${SAVE_KEY_PREFIX}${slotId.split('-')[1]}`
      localStorage.removeItem(key)
      getAllSaves()
      return true
    } catch (e) {
      console.error('Failed to delete save:', e)
      return false
    }
  }

  // 自动保存
  function autoSave() {
    if (gameState.value && gameState.value.isInGame) {
      saveGame('auto', '自动存档')
    }
  }

  // 获取城市研究数据
  function getCityResearch(cityId: string): CityResearch | undefined {
    return company.value?.cityResearches.find(r => r.cityId === cityId)
  }

  // 获取城市已完成研究的总价格加成
  function getCityPriceBoost(cityId: string): number {
    const research = getCityResearch(cityId)
    if (!research) return 0
    return research.completedProjects.reduce((total, projectId) => {
      const project = RESEARCH_PROJECTS.find(p => p.id === projectId)
      return total + (project?.priceBoost || 0)
    }, 0)
  }

  // 获取城市可用的研究项目
  function getAvailableResearchProjects(cityId: string): ResearchProject[] {
    const research = getCityResearch(cityId)
    if (!research) return RESEARCH_PROJECTS.filter(p => p.requirements.length === 0)
    
    return RESEARCH_PROJECTS.filter(project => {
      if (research.completedProjects.includes(project.id)) return false
      if (research.inProgressProject === project.id) return false
      return project.requirements.every(req => research.completedProjects.includes(req))
    })
  }

  // 开始研究项目
  function startResearch(cityId: string, projectId: string): boolean {
    if (!company.value || !gameState.value) return false
    
    const project = RESEARCH_PROJECTS.find(p => p.id === projectId)
    if (!project) return false
    
    const cityResearchIndex = company.value.cityResearches.findIndex(r => r.cityId === cityId)
    if (cityResearchIndex === -1) return false
    
    const cityResearch = company.value.cityResearches[cityResearchIndex]
    
    if (cityResearch.inProgressProject) return false
    if (cityResearch.completedProjects.includes(projectId)) return false
    if (!project.requirements.every(req => cityResearch.completedProjects.includes(req))) return false
    if (company.value.cash < project.cost) return false
    if (company.value.researchPoints < project.researchPoints) return false
    
    const updatedCompany = { ...company.value }
    updatedCompany.cash -= project.cost
    updatedCompany.researchPoints -= project.researchPoints
    updatedCompany.cityResearches = [...updatedCompany.cityResearches]
    updatedCompany.cityResearches[cityResearchIndex] = {
      ...cityResearch,
      inProgressProject: projectId,
      progress: 0
    }
    
    gameState.value = {
      ...gameState.value,
      company: updatedCompany
    }
    
    return true
  }

  // 推进研究进度（每月调用）
  function advanceResearch(): void {
    if (!company.value || !gameState.value) return
    
    const updatedCompany = { ...company.value }
    let hasChanges = false
    
    updatedCompany.cityResearches = updatedCompany.cityResearches.map(cityResearch => {
      if (!cityResearch.inProgressProject) return cityResearch
      
      const project = RESEARCH_PROJECTS.find(p => p.id === cityResearch.inProgressProject)
      if (!project) return cityResearch
      
      const newProgress = cityResearch.progress + (100 / project.duration)
      hasChanges = true
      
      if (newProgress >= 100) {
        return {
          ...cityResearch,
          completedProjects: [...cityResearch.completedProjects, cityResearch.inProgressProject],
          inProgressProject: null,
          progress: 0
        }
      }
      
      return {
        ...cityResearch,
        progress: newProgress
      }
    })
    
    if (hasChanges) {
      gameState.value = {
        ...gameState.value,
        company: updatedCompany
      }
    }
  }

  // 增加研究点
  function addResearchPoints(amount: number): void {
    if (!company.value || !gameState.value) return
    
    const updatedCompany = {
      ...company.value,
      researchPoints: company.value.researchPoints + amount
    }
    
    gameState.value = {
      ...gameState.value,
      company: updatedCompany
    }
  }

  // ========== 土地市场相关函数 ==========

  // 计算游戏日期差（天数）
  function daysBetween(date1: { year: number; month: number; day: number }, date2: { year: number; month: number; day: number }): number {
    const d1 = new Date(date1.year, date1.month, date1.day)
    const d2 = new Date(date2.year, date2.month, date2.day)
    return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24))
  }

  // 添加天数到日期
  function addDays(date: { year: number; month: number; day: number }, days: number): { year: number; month: number; day: number } {
    const d = new Date(date.year, date.month, date.day + days)
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() }
  }

  // 获取公司资质等级对应的最大可开发面积
  function getMaxLandArea(): number {
    const qualification = gameState.value?.company?.qualificationLevel || 4
    return LAND_MARKET_CONFIG.maxAreaByQualification[qualification] || 500000
  }

  // 获取公司资质等级对应的价格系数
  function getQualificationPriceMultiplier(): number {
    const qualification = gameState.value?.company?.qualificationLevel || 4
    return LAND_MARKET_CONFIG.priceMultiplierByQualification[qualification] || 1.0
  }

  // 获取公司信用等级对应的折扣率
  function getCreditDiscountRate(): number {
    const credit = gameState.value?.company?.creditRating || 'C'
    return LAND_MARKET_CONFIG.discountRateByCredit[credit] || 1.0
  }

  // 生成随机数
  function random(min: number, max: number): number {
    return Math.random() * (max - min) + min
  }

  // 生成随机整数
  function randomInt(min: number, max: number): number {
    return Math.floor(random(min, max + 1))
  }

  // 随机选择数组元素
  function randomPick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  // 随机选择多个不重复的元素
  function randomPickMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  // 生成单块土地
  function generateLand(): MarketLand {
    const cityData = randomPick(CITIES_DATA)
    const districts = ['朝阳', '海淀', '丰台', '浦东', '天河', '福田', '锦江', '西湖', '鼓楼', '江岸']
    const district = randomPick(districts)
    const landUse = randomPick(['住宅', '住宅', '住宅', '商业', '综合体', '工业'] as LandUseType[])
    const useConfig = LAND_USE_CONFIG[landUse]

    const maxArea = getMaxLandArea()

    let area: number
    const minArea = 10000
    if (maxArea === Infinity) {
      area = randomInt(minArea, 500000)
    } else {
      area = randomInt(minArea, Math.min(maxArea, 500000))
    }

    const basePrice = cityData.avgPrice * useConfig.priceMultiplier * random(0.8, 1.2)

    const floorAreaRatio = random(useConfig.floorAreaRatio[0], useConfig.floorAreaRatio[1])
    const pricePerSquare = basePrice / floorAreaRatio

    const qualificationMultiplier = getQualificationPriceMultiplier()
    const creditDiscount = getCreditDiscountRate()
    const discountRate = qualificationMultiplier * creditDiscount

    const currentPrice = Math.round(basePrice * discountRate)

    const tagCount = randomInt(1, 3)
    const tags = randomPickMultiple(LAND_TAG_POOL, tagCount)

    const gameTime = gameState.value?.gameTime || { year: 2008, month: 0, day: 1 }
    const expireDate = addDays(gameTime, LAND_MARKET_CONFIG.refreshIntervalDays)

    return {
      id: 'land_market_' + Date.now() + '_' + randomInt(1000, 9999),
      province: cityData.name,
      city: cityData.name,
      district,
      area,
      floorAreaRatio: Math.round(floorAreaRatio * 100) / 100,
      buildingDensity: Math.round(random(useConfig.buildingDensity[0], useConfig.buildingDensity[1]) * 100) / 100,
      greeningRate: Math.round(random(useConfig.greeningRate[0], useConfig.greeningRate[1]) * 100) / 100,
      landUse,
      useYears: useConfig.useYears,
      basePrice: Math.round(basePrice),
      currentPrice,
      pricePerSquare: Math.round(pricePerSquare),
      discountRate: Math.round(discountRate * 100) / 100,
      tags,
      expireDate
    }
  }

  // 刷新土地市场
  function refreshLandMarket() {
    if (!gameState.value) return

    const gameTime = gameState.value.gameTime
    gameState.value.landMarket.lastRefreshTime = { ...gameTime }

    const newLands: MarketLand[] = []
    const count = LAND_MARKET_CONFIG.maxLandCount

    for (let i = 0; i < count; i++) {
      newLands.push(generateLand())
    }

    gameState.value.landMarket.lands = newLands
  }

  // 检查并刷新土地市场（基于游戏时间）
  function checkAndRefreshLandMarket() {
    if (!gameState.value) return

    const gameTime = gameState.value.gameTime
    const lastRefresh = gameState.value.landMarket.lastRefreshTime
    const daysPassed = daysBetween(lastRefresh, gameTime)

    if (daysPassed >= LAND_MARKET_CONFIG.refreshIntervalDays) {
      refreshLandMarket()
    }
  }

  // 购买土地
  function purchaseLand(landId: string): boolean {
    if (!gameState.value || !company.value) return false

    const land = gameState.value.landMarket.lands.find(l => l.id === landId)
    if (!land) return false

    if (company.value.cash < land.currentPrice) {
      return false
    }

    const maxArea = getMaxLandArea()
    if (land.area > maxArea) {
      return false
    }

    // 扣除现金
    const updatedCompany = { ...company.value }
    updatedCompany.cash -= land.currentPrice
    gameState.value.company = updatedCompany

    // 添加到土地储备
    const newLand: Land = {
      id: 'land_' + Date.now(),
      province: land.province,
      city: land.city,
      district: land.district,
      area: land.area,
      floorAreaRatio: land.floorAreaRatio,
      buildingDensity: land.buildingDensity,
      greeningRate: land.greeningRate,
      landUse: land.landUse,
      useYears: land.useYears,
      acquisitionPrice: land.currentPrice,
      acquisitionDate: new Date().toISOString(),
      status: 'pending',
      currentValue: land.currentPrice,
      tags: land.tags
    }

    gameState.value.landReserves.push(newLand)
    gameState.value.landMarket.lands = gameState.value.landMarket.lands.filter(l => l.id !== landId)

    return true
  }

  // 获取土地市场数据
  function getLandMarketLands() {
    return gameState.value?.landMarket?.lands || []
  }

  function getLandMarketLastRefresh() {
    return gameState.value?.landMarket?.lastRefreshTime || { year: 2008, month: 0, day: 1 }
  }

  // 获取下次刷新时间
  function getNextRefreshTime(): { year: number; month: number; day: number } {
    const lastRefresh = getLandMarketLastRefresh()
    return addDays(lastRefresh, LAND_MARKET_CONFIG.refreshIntervalDays)
  }

  // 获取距离下次刷新的天数
  function getDaysToNextRefresh(): number {
    const gameTime = gameState.value?.gameTime || { year: 2008, month: 0, day: 1 }
    const nextRefresh = getNextRefreshTime()
    return daysBetween(gameTime, nextRefresh)
  }

  // ========== 开发规划相关函数 ==========

  // 获取项目类型配置
  function getProjectTypeConfigs(): ProjectTypeConfig[] {
    return PROJECT_TYPE_CONFIGS
  }

  // 获取品味配置
  function getQualityLevelConfigs(): QualityLevelConfig[] {
    return QUALITY_LEVEL_CONFIGS
  }

  // 获取施工阶段配置
  function getConstructionPhaseConfig() {
    return CONSTRUCTION_PHASE_CONFIG
  }

  // 获取五证配置
  function getCertificateConfig() {
    return CERTIFICATE_CONFIG
  }

  // 计算开发成本
  function calculateDevelopmentCost(land: Land, projectType: ProjectType, qualityLevel: QualityLevel): number {
    const typeConfig = PROJECT_TYPE_CONFIGS.find(c => c.type === projectType)
    const qualityConfig = QUALITY_LEVEL_CONFIGS.find(c => c.level === qualityLevel)
    
    if (!typeConfig || !qualityConfig) return 0
    
    const totalArea = land.area * land.floorAreaRatio // 总建筑面积
    const baseCost = totalArea * typeConfig.baseCostPerSqm
    const qualityCost = baseCost * qualityConfig.costMultiplier
    
    // 加上土地成本
    const totalCost = qualityCost + land.acquisitionPrice
    
    return Math.round(totalCost)
  }

  // 计算预估收益
  function calculateEstimatedRevenue(land: Land, projectType: ProjectType, qualityLevel: QualityLevel): number {
    const typeConfig = PROJECT_TYPE_CONFIGS.find(c => c.type === projectType)
    const qualityConfig = QUALITY_LEVEL_CONFIGS.find(c => c.level === qualityLevel)

    if (!typeConfig || !qualityConfig) return 0

    const city = CITIES_DATA.find(c => c.name === land.city)
    const basePrice = city?.avgPrice || 10000

    const totalArea = land.area * land.floorAreaRatio
    const pricePerSqm = basePrice * typeConfig.priceMultiplier * qualityConfig.priceMultiplier
    const brandBoost = (company.value?.brand?.score || 0) / 100 * qualityConfig.brandBoost

    // 获取宏观经济指数
    const macroEconomy = gameState.value?.macroEconomy || {
      gdpGrowthRate: 5,
      interestRate: 0.05,
      urbanizationRate: 50,
      population: 1400000000,
      housingPriceIndex: 1.0
    }

    // 基础收益
    const baseRevenue = totalArea * pricePerSqm * (1 + brandBoost)

    // 应用宏观经济指数调整（基于房价指数）
    const macroAdjustedRevenue = baseRevenue * macroEconomy.housingPriceIndex

    // 限制最高收益为基数的130%
    const maxRevenue = baseRevenue * 1.3
    const finalRevenue = Math.min(macroAdjustedRevenue, maxRevenue)

    return Math.round(finalRevenue)
  }

  // 计算建设周期
  function calculateConstructionPeriod(projectType: ProjectType, qualityLevel: QualityLevel): number {
    const typeConfig = PROJECT_TYPE_CONFIGS.find(c => c.type === projectType)
    const qualityConfig = QUALITY_LEVEL_CONFIGS.find(c => c.level === qualityLevel)
    
    if (!typeConfig || !qualityConfig) return 24
    
    // 高端项目周期更长
    const periodMultiplier = qualityLevel === '高端' ? 1.3 : qualityLevel === '低端' ? 0.8 : 1.0
    
    return Math.round(typeConfig.constructionPeriod * periodMultiplier)
  }

  // 设置土地开发规划
  function setLandDevelopmentPlan(landId: string, plan: DevelopmentPlan): boolean {
    if (!gameState.value) return false
    
    const landIndex = gameState.value.landReserves.findIndex(l => l.id === landId)
    if (landIndex === -1) return false
    
    const land = gameState.value.landReserves[landIndex]
    
    // 检查项目类型是否适合土地用途
    const validTypes = getValidProjectTypes(land.landUse)
    if (!validTypes.includes(plan.projectType)) return false
    
    // 检查面积是否满足要求
    const typeConfig = PROJECT_TYPE_CONFIGS.find(c => c.type === plan.projectType)
    if (typeConfig && land.area * land.floorAreaRatio < typeConfig.minArea) return false
    
    // 设置开发规划
    gameState.value.landReserves[landIndex] = {
      ...land,
      developmentPlan: plan
    }
    
    return true
  }

  // 获取土地可开发的项目类型
  function getValidProjectTypes(landUse: string): ProjectType[] {
    const typeMap: Record<string, ProjectType[]> = {
      '住宅': ['住宅', '别墅', '公寓'],
      '商业': ['商业', '写字楼', '购物中心'],
      '综合体': ['综合体', '商业', '写字楼', '购物中心', '公寓'],
      '工业': ['产业园']
    }
    return typeMap[landUse] || ['住宅']
  }

  // 确认开发（创建项目）
  function confirmDevelopment(landId: string): boolean {
    if (!gameState.value || !company.value) return false
    
    const landIndex = gameState.value.landReserves.findIndex(l => l.id === landId)
    if (landIndex === -1) return false
    
    const land = gameState.value.landReserves[landIndex]
    if (!land.developmentPlan) return false
    
    const plan = land.developmentPlan
    const totalCost = calculateDevelopmentCost(land, plan.projectType, plan.qualityLevel)
    
    // 检查资金
    if (company.value.cash < totalCost * 0.3) { // 至少需要30%启动资金
      return false
    }
    
    // 创建初始五证状态
    const initialCertificates: FiveCertificates = {
      landUsePermit: { obtained: false, pending: false, progress: 0 },
      constructionPlanningPermit: { obtained: false, pending: false, progress: 0 },
      constructionPermit: { obtained: false, pending: false, progress: 0 },
      presalePermit: { obtained: false, pending: false, progress: 0 },
      completionAcceptance: { obtained: false, pending: false, progress: 0 }
    }
    
    // 创建初始阶段状态
    const initialPhases: ProjectPhases = {
      planning: { status: 'in_progress', progress: 0 },
      design: { status: 'pending', progress: 0 },
      approval: { status: 'pending', progress: 0 },
      construction: { status: 'pending', progress: 0 },
      presale: { status: 'pending', progress: 0 },
      delivery: { status: 'pending', progress: 0 }
    }
    
    // 创建项目
    const newProject: Project = {
      id: 'project_' + Date.now(),
      landId: land.id,
      name: plan.projectName,
      city: land.city,
      district: land.district,
      status: 'planning',
      projectType: plan.projectType,
      qualityLevel: plan.qualityLevel,
      constructionProgress: 0,
      currentPhase: 'foundation',
      fiveCertificates: initialCertificates,
      phases: initialPhases,
      totalCost: totalCost,
      estimatedRevenue: calculateEstimatedRevenue(land, plan.projectType, plan.qualityLevel),
      startDate: new Date().toISOString(),
      estimatedCompletionDate: new Date(Date.now() + plan.constructionPeriod * 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalArea: land.area * land.floorAreaRatio,
      soldArea: 0,
      unsoldArea: land.area * land.floorAreaRatio,
      avgPricePerSqm: Math.round(calculateEstimatedRevenue(land, plan.projectType, plan.qualityLevel) / (land.area * land.floorAreaRatio))
    }
    
    // 更新土地状态
    gameState.value.landReserves[landIndex] = {
      ...land,
      status: 'developing'
    }
    
    // 添加项目
    gameState.value.projects.push(newProject)
    
    // 扣除初始成本（规划阶段成本）
    const planningCost = totalCost * 0.05
    gameState.value.company = {
      ...company.value,
      cash: company.value.cash - planningCost
    }
    
    return true
  }

  // 办理证照
  function applyForCertificate(projectId: string, certificateType: string): boolean {
    if (!gameState.value || !company.value) return false
    
    const projectIndex = gameState.value.projects.findIndex(p => p.id === projectId)
    if (projectIndex === -1) return false
    
    const project = gameState.value.projects[projectIndex]
    const certConfig = CERTIFICATE_CONFIG[certificateType]
    
    if (!certConfig) return false
    
    // 检查证照是否已获取或正在办理
    const cert = project.fiveCertificates[certificateType as keyof FiveCertificates]
    if (cert.obtained || cert.pending) return false
    
    // 检查前置阶段
    if (certConfig.requiredPhase) {
      const phase = project.phases[certConfig.requiredPhase as keyof ProjectPhases]
      if (phase.status !== 'completed') return false
    }
    
    // 检查资金
    if (company.value.cash < certConfig.cost) return false
    
    // 开始办理证照
    const updatedCertificates = { ...project.fiveCertificates }
    updatedCertificates[certificateType as keyof FiveCertificates] = {
      obtained: false,
      pending: true,
      progress: 0,
      cost: certConfig.cost
    }
    
    gameState.value.projects[projectIndex] = {
      ...project,
      fiveCertificates: updatedCertificates
    }
    
    // 扣除费用
    gameState.value.company = {
      ...company.value,
      cash: company.value.cash - certConfig.cost
    }
    
    return true
  }

  // 推进证照办理进度
  function advanceCertificates(): void {
    if (!gameState.value) return
    
    gameState.value.projects.forEach((project, index) => {
      const updatedCertificates = { ...project.fiveCertificates }
      let hasChanges = false
      
      Object.keys(updatedCertificates).forEach(key => {
        const cert = updatedCertificates[key as keyof FiveCertificates]
        if (cert.pending && !cert.obtained) {
          const certConfig = CERTIFICATE_CONFIG[key]
          if (certConfig) {
            const newProgress = (cert.progress || 0) + (100 / certConfig.duration)
            hasChanges = true
            
            if (newProgress >= 100) {
              updatedCertificates[key as keyof FiveCertificates] = {
                obtained: true,
                pending: false,
                progress: 100,
                obtainDate: new Date().toISOString(),
                cost: cert.cost
              }
            } else {
              updatedCertificates[key as keyof FiveCertificates] = {
                ...cert,
                progress: newProgress
              }
            }
          }
        }
      })
      
      if (hasChanges) {
        gameState.value.projects[index] = {
          ...project,
          fiveCertificates: updatedCertificates
        }
      }
    })
  }

  // 推进项目阶段
  function advanceProjectPhase(projectId: string): boolean {
    if (!gameState.value || !company.value) return false
    
    const projectIndex = gameState.value.projects.findIndex(p => p.id === projectId)
    if (projectIndex === -1) return false
    
    const project = gameState.value.projects[projectIndex]
    
    // 检查当前阶段是否完成
    const currentPhaseDetail = project.phases[project.status as keyof ProjectPhases]
    if (currentPhaseDetail.status !== 'completed') return false
    
    // 确定下一阶段
    const phaseOrder: ProjectStatus[] = ['planning', 'design', 'approval', 'construction', 'presale', 'delivery', 'completed']
    const currentIndex = phaseOrder.indexOf(project.status)
    if (currentIndex === -1 || currentIndex >= phaseOrder.length - 1) return false
    
    const nextStatus = phaseOrder[currentIndex + 1]
    
    // 检查证照要求
    if (nextStatus === 'construction') {
      if (!project.fiveCertificates.constructionPermit.obtained) return false
    }
    if (nextStatus === 'presale') {
      if (!project.fiveCertificates.presalePermit.obtained) return false
    }
    
    // 更新项目状态
    const updatedPhases = { ...project.phases }
    updatedPhases[nextStatus as keyof ProjectPhases] = {
      status: 'in_progress',
      progress: 0,
      startDate: new Date().toISOString()
    }
    
    gameState.value.projects[projectIndex] = {
      ...project,
      status: nextStatus,
      phases: updatedPhases
    }
    
    return true
  }

  // 推进施工进度
  function advanceConstruction(): void {
    if (!gameState.value || !company.value) return
    
    gameState.value.projects.forEach((project, index) => {
      if (project.status !== 'construction') return
      
      // 计算进度增量（每月推进约3-5%）
      const progressIncrement = 3 + Math.random() * 2
      const newProgress = Math.min(100, project.constructionProgress + progressIncrement)
      
      // 确定当前施工阶段
      let currentPhase: ConstructionPhase = 'foundation'
      for (const [phase, config] of Object.entries(CONSTRUCTION_PHASE_CONFIG)) {
        if (newProgress >= config.progressRange[0] && newProgress < config.progressRange[1]) {
          currentPhase = phase as ConstructionPhase
          break
        }
        if (newProgress >= 95) {
          currentPhase = 'completion'
        }
      }
      
      // 更新施工阶段进度
      const updatedPhases = { ...project.phases }
      updatedPhases.construction = {
        ...updatedPhases.construction,
        progress: newProgress,
        status: newProgress >= 100 ? 'completed' : 'in_progress'
      }
      
      gameState.value.projects[index] = {
        ...project,
        constructionProgress: newProgress,
        currentPhase,
        phases: updatedPhases
      }
      
      // 施工完成后自动进入交付阶段
      if (newProgress >= 100) {
        advanceProjectPhase(project.id)
      }
    })
  }

  // 获取项目详情
  function getProjectById(projectId: string): Project | undefined {
    return gameState.value?.projects.find(p => p.id === projectId)
  }

  // 获取土地详情
  function getLandById(landId: string): Land | undefined {
    return gameState.value?.landReserves.find(l => l.id === landId)
  }

  // ========== 研究点计算 ==========
  // 每开发并且售卖完成10万面积增加50点研究点
  function calculateResearchPointsFromSoldArea(): number {
    const completedProjects = projects.value.filter(p => p.status === 'completed' || p.status === 'presale' || p.status === 'delivery')
    const totalSoldArea = completedProjects.reduce((sum, p) => sum + (p.soldArea || 0), 0)
    return Math.floor(totalSoldArea / 100000) * 50
  }

  // 获取当前研究点（基础50 + 销售面积奖励）
  function getTotalResearchPoints(): number {
    const basePoints = company.value?.researchPoints || 50
    const soldAreaPoints = calculateResearchPointsFromSoldArea()
    return basePoints + soldAreaPoints
  }

  // ========== 资质升级进度 ==========
  function getQualificationProgress(): QualificationProgress | null {
    if (!company.value) return null
    const currentLevel = company.value.qualificationLevel || 4
    const nextLevel = currentLevel - 1 as 1 | 2 | 3 | 4

    if (nextLevel < 1) {
      return {
        currentLevel: 1,
        progress: 100,
        requirements: {
          registeredCapital: { current: company.value.registeredCapital, required: company.value.registeredCapital },
          totalAssets: { current: company.value.totalAssets, required: company.value.totalAssets },
          completedProjects: { current: projects.value.filter(p => p.status === 'completed').length, required: 999 },
          totalSoldArea: { current: company.value.totalSoldArea || 0, required: 9999999 },
          socialReputation: { current: player.value?.socialStatus?.reputation || 0, required: 100 },
          technicalPersonnel: { current: company.value.technicalPersonnel || 0, required: 100 }
        },
        canUpgrade: false
      }
    }

    const requirements = QUALIFICATION_REQUIREMENTS.find(q => q.level === nextLevel)
    if (!requirements) return null

    const completedProjects = projects.value.filter(p => p.status === 'completed').length
    const totalSoldArea = company.value.totalSoldArea || 0
    const socialReputation = player.value?.socialStatus?.reputation || 0
    const technicalPersonnel = company.value.technicalPersonnel || 0

    return {
      currentLevel,
      progress: 0,
      requirements: {
        registeredCapital: { current: company.value.registeredCapital, required: requirements.registeredCapital },
        totalAssets: { current: company.value.totalAssets, required: requirements.totalAssets },
        completedProjects: { current: completedProjects, required: requirements.completedProjects },
        totalSoldArea: { current: totalSoldArea, required: requirements.totalSoldArea },
        socialReputation: { current: socialReputation, required: requirements.socialReputation },
        technicalPersonnel: { current: technicalPersonnel, required: requirements.technicalPersonnel }
      },
      canUpgrade: company.value.registeredCapital >= requirements.registeredCapital &&
        company.value.totalAssets >= requirements.totalAssets &&
        completedProjects >= requirements.completedProjects &&
        totalSoldArea >= requirements.totalSoldArea &&
        socialReputation >= requirements.socialReputation &&
        technicalPersonnel >= requirements.technicalPersonnel
    }
  }

  // 申请资质升级
  function applyQualificationUpgrade(): boolean {
    const progress = getQualificationProgress()
    if (!progress || !progress.canUpgrade || !company.value) return false

    gameState.value = {
      ...gameState.value!,
      company: {
        ...company.value,
        qualificationLevel: (company.value.qualificationLevel - 1) as 1 | 2 | 3 | 4
      }
    }
    return true
  }

  // ========== 银行贷款相关 ==========
  function getLoanInterestRate(termMonths: number): number {
    const qualification = company.value?.qualificationLevel || 4
    const credit = company.value?.creditRating || 'C'
    const qualAdjustment = BANK_LOAN_CONFIG.rateAdjustments.qualificationLevel[qualification] || 0
    const creditAdjustment = BANK_LOAN_CONFIG.rateAdjustments.creditRating[credit as keyof typeof BANK_LOAN_CONFIG.rateAdjustments.creditRating] || 0
    const termAdjustment = BANK_LOAN_CONFIG.rateAdjustments.termLength[termMonths as keyof typeof BANK_LOAN_CONFIG.rateAdjustments.termLength] || 0
    return BANK_LOAN_CONFIG.baseRate + qualAdjustment + creditAdjustment + termAdjustment
  }

  function getMaxLoanAmount(): number {
    return (company.value?.totalAssets || 0) * BANK_LOAN_CONFIG.maxLoanAmountRatio
  }

  // ========== IPO相关 ==========
  function getIPORequirements() {
    return IPO_REQUIREMENTS
  }

  function checkIPOEligibility(): { eligible: boolean; reasons: string[] } {
    const reasons: string[] = []
    if (!company.value) return { eligible: false, reasons: ['公司不存在'] }

    const gameTime = gameState.value?.gameTime
    const establishedDate = new Date(company.value.establishmentDate)
    const yearsSinceEstablishment = gameTime ? (gameTime.year - establishedDate.getFullYear()) : 0

    if (yearsSinceEstablishment < IPO_REQUIREMENTS.minYears) {
      reasons.push(`成立年限不足，需满${IPO_REQUIREMENTS.minYears}年`)
    }
    if (company.value.registeredCapital < IPO_REQUIREMENTS.minRegisteredCapital) {
      reasons.push(`注册资本不足，需≥${IPO_REQUIREMENTS.minRegisteredCapital / 100000000}亿`)
    }
    if (company.value.totalAssets < IPO_REQUIREMENTS.minTotalAssets) {
      reasons.push(`总资产不足，需≥${IPO_REQUIREMENTS.minTotalAssets / 100000000}亿`)
    }
    const completedProjects = projects.value.filter(p => p.status === 'completed').length
    if (completedProjects < IPO_REQUIREMENTS.minProjects) {
      reasons.push(`完成项目不足，需≥${IPO_REQUIREMENTS.minProjects}个`)
    }

    return { eligible: reasons.length === 0, reasons }
  }

  // 上市
  function listCompany(): boolean {
    const eligibility = checkIPOEligibility()
    if (!eligibility.eligible || !company.value) return false

    const baseSharePrice = 10 // 基础股价10元
    const totalShares = company.value.registeredCapital / 1 // 1元1股

    gameState.value = {
      ...gameState.value!,
      company: {
        ...company.value,
        stockInfo: {
          listed: true,
          listingDate: new Date().toISOString(),
          totalShares: totalShares,
          sharePrice: baseSharePrice,
          marketCap: totalShares * baseSharePrice,
          peRatio: 15,
          sharesInCirculation: Math.floor(totalShares * 0.75), // 75%流通股
          sharesRestricted: Math.floor(totalShares * 0.25) // 25%限售股
        }
      }
    }
    return true
  }

  // 发行股票
  function issueShares(percentage: number): boolean {
    if (!company.value?.stockInfo?.listed) return false
    const newShares = Math.floor(company.value.stockInfo.totalShares * (percentage / 100))
    gameState.value = {
      ...gameState.value!,
      company: {
        ...company.value,
        stockInfo: {
          ...company.value.stockInfo,
          totalShares: company.value.stockInfo.totalShares + newShares,
          marketCap: (company.value.stockInfo.totalShares + newShares) * company.value.stockInfo.sharePrice
        }
      }
    }
    return true
  }

  // 股票回购
  function buybackShares(percentage: number): boolean {
    if (!company.value?.stockInfo?.listed || company.value.cash < 0) return false
    const sharesToBuyback = Math.floor(company.value.stockInfo.totalShares * (percentage / 100))
    const cost = sharesToBuyback * company.value.stockInfo.sharePrice
    if (company.value.cash < cost) return false

    gameState.value = {
      ...gameState.value!,
      company: {
        ...company.value,
        cash: company.value.cash - cost,
        stockInfo: {
          ...company.value.stockInfo,
          totalShares: company.value.stockInfo.totalShares - sharesToBuyback,
          marketCap: (company.value.stockInfo.totalShares - sharesToBuyback) * company.value.stockInfo.sharePrice
        }
      }
    }
    return true
  }

  // 增发股票
  function additionalShareOffering(percentage: number, price: number): boolean {
    if (!company.value?.stockInfo?.listed) return false
    const newShares = Math.floor(company.value.stockInfo.totalShares * (percentage / 100))
    const proceeds = newShares * price

    gameState.value = {
      ...gameState.value!,
      company: {
        ...company.value,
        cash: company.value.cash + proceeds,
        stockInfo: {
          ...company.value.stockInfo,
          totalShares: company.value.stockInfo.totalShares + newShares,
          sharePrice: price,
          marketCap: (company.value.stockInfo.totalShares + newShares) * price
        }
      }
    }
    return true
  }

  // ========== 财务报表 ==========
  function generateFinancialStatements(): FinancialStatements {
    if (!company.value) {
      return {
        balanceSheet: createEmptyBalanceSheet(),
        incomeStatement: createEmptyIncomeStatement(),
        cashFlowStatement: createEmptyCashFlowStatement()
      }
    }

    const completedProjects = projects.value.filter(p => p.status === 'completed')
    const developingProjects = projects.value.filter(p => p.status !== 'completed' && p.status !== 'planning')
    const landValue = landReserves.value.reduce((sum, l) => sum + l.currentValue, 0)

    // 资产负债表
    const balanceSheet: BalanceSheet = {
      currentAssets: {
        cash: company.value.cash,
        accountsReceivable: 0,
        inventory: developingProjects.reduce((sum, p) => sum + (p.unsoldArea * p.avgPricePerSqm), 0),
        prepaidExpenses: 0,
        otherCurrentAssets: 0
      },
      fixedAssets: {
        land: landValue,
        buildings: completedProjects.reduce((sum, p) => sum + p.totalArea * 5000, 0), // 假设竣工房产5000元/㎡
        equipment: 0,
        constructionInProgress: developingProjects.reduce((sum, p) => sum + p.totalCost, 0),
        accumulatedDepreciation: 0
      },
      intangibleAssets: {
        landUseRights: landValue * 0.1,
        software: 0,
        goodwill: 0
      },
      totalAssets: company.value.totalAssets,
      currentLiabilities: {
        accountsPayable: 0,
        advanceReceipts: completedProjects.reduce((sum, p) => sum + (p.unsoldArea * p.avgPricePerSqm * 0.3), 0), // 预收款
        taxesPayable: 0,
        shortTermLoans: 0,
        otherCurrentLiabilities: 0
      },
      longTermLiabilities: {
        longTermLoans: 0,
        bondsPayable: 0,
        deferredTaxLiabilities: 0
      },
      totalLiabilities: company.value.totalLiabilities,
      paidInCapital: company.value.paidInCapital,
      capitalReserve: 0,
      surplusReserve: company.value.totalAssets - company.value.paidInCapital - company.value.totalLiabilities,
      retainedEarnings: company.value.monthlyProfit * 12
    }

    // 利润表
    const incomeStatement: IncomeStatement = {
      revenue: completedProjects.reduce((sum, p) => sum + (p.soldArea * p.avgPricePerSqm), 0),
      costOfGoodsSold: completedProjects.reduce((sum, p) => sum + p.totalCost, 0),
      grossProfit: completedProjects.reduce((sum, p) => sum + (p.soldArea * p.avgPricePerSqm - p.totalCost), 0),
      operatingExpenses: 0,
      sellingExpenses: company.value.employees.reduce((sum, e) => sum + e.salary * 12, 0) * 0.1,
      administrativeExpenses: company.value.employees.reduce((sum, e) => sum + e.salary * 12, 0) * 0.2,
      operatingProfit: company.value.monthlyProfit * 12,
      nonOperatingIncome: 0,
      nonOperatingExpenses: 0,
      profitBeforeTax: company.value.monthlyProfit * 12,
      incomeTax: company.value.monthlyProfit * 12 * 0.25,
      netProfit: company.value.monthlyProfit * 12 * 0.75
    }

    // 现金流量表
    const cashFlowStatement: CashFlowStatement = {
      operatingActivities: {
        cashReceivedFromCustomers: completedProjects.reduce((sum, p) => sum + (p.soldArea * p.avgPricePerSqm), 0),
        cashPaidToSuppliers: completedProjects.reduce((sum, p) => sum + p.totalCost, 0),
        cashPaidToEmployees: company.value.employees.reduce((sum, e) => sum + e.salary * 12, 0),
        taxesPaid: company.value.monthlyProfit * 12 * 0.25,
        netCashFromOperating: company.value.monthlyProfit * 12 * 0.75
      },
      investingActivities: {
        purchaseOfFixedAssets: landValue * 0.5,
        purchaseOfIntangibleAssets: 0,
        netCashFromInvesting: -landValue * 0.5
      },
      financingActivities: {
        proceedsFromLoans: 0,
        repaymentOfLoans: 0,
        dividendsPaid: 0,
        netCashFromFinancing: 0
      },
      netChangeInCash: company.value.monthlyProfit * 12 * 0.75 - landValue * 0.5,
      beginningCash: company.value.cash - company.value.monthlyProfit * 12 * 0.75,
      endingCash: company.value.cash
    }

    return { balanceSheet, incomeStatement, cashFlowStatement }
  }

  function createEmptyBalanceSheet(): BalanceSheet {
    return {
      currentAssets: { cash: 0, accountsReceivable: 0, inventory: 0, prepaidExpenses: 0, otherCurrentAssets: 0 },
      fixedAssets: { land: 0, buildings: 0, equipment: 0, constructionInProgress: 0, accumulatedDepreciation: 0 },
      intangibleAssets: { landUseRights: 0, software: 0, goodwill: 0 },
      totalAssets: 0,
      currentLiabilities: { accountsPayable: 0, advanceReceipts: 0, taxesPayable: 0, shortTermLoans: 0, otherCurrentLiabilities: 0 },
      longTermLiabilities: { longTermLoans: 0, bondsPayable: 0, deferredTaxLiabilities: 0 },
      totalLiabilities: 0,
      paidInCapital: 0, capitalReserve: 0, surplusReserve: 0, retainedEarnings: 0, totalEquity: 0
    }
  }

  function createEmptyIncomeStatement(): IncomeStatement {
    return {
      revenue: 0, costOfGoodsSold: 0, grossProfit: 0, operatingExpenses: 0,
      sellingExpenses: 0, administrativeExpenses: 0, operatingProfit: 0,
      nonOperatingIncome: 0, nonOperatingExpenses: 0, profitBeforeTax: 0, incomeTax: 0, netProfit: 0
    }
  }

  function createEmptyCashFlowStatement(): CashFlowStatement {
    return {
      operatingActivities: { cashReceivedFromCustomers: 0, cashPaidToSuppliers: 0, cashPaidToEmployees: 0, taxesPaid: 0, netCashFromOperating: 0 },
      investingActivities: { purchaseOfFixedAssets: 0, purchaseOfIntangibleAssets: 0, netCashFromInvesting: 0 },
      financingActivities: { proceedsFromLoans: 0, repaymentOfLoans: 0, dividendsPaid: 0, netCashFromFinancing: 0 },
      netChangeInCash: 0, beginningCash: 0, endingCash: 0
    }
  }

  // ========== 宏观经济 ==========
  function getMacroEconomy() {
    return gameState.value?.macroEconomy || {
      gdpGrowthRate: 5,
      interestRate: 0.05,
      urbanizationRate: 50,
      population: 1400000000,
      housingPriceIndex: 1.0
    }
  }

  // 更新宏观经济（每游戏月）
  function advanceMacroEconomy(): void {
    if (!gameState.value) return
    const economy = gameState.value.macroEconomy
    // 随机波动
    economy.gdpGrowthRate = Math.max(2, Math.min(12, economy.gdpGrowthRate + (Math.random() - 0.5) * 0.5))
    economy.interestRate = Math.max(0.03, Math.min(0.08, economy.interestRate + (Math.random() - 0.5) * 0.002))
    economy.urbanizationRate = Math.min(80, economy.urbanizationRate + Math.random() * 0.1)
    economy.housingPriceIndex = Math.max(0.5, Math.min(2.0, economy.housingPriceIndex + (Math.random() - 0.5) * 0.05))

    gameState.value = { ...gameState.value, macroEconomy: { ...economy } }
  }

  return { 
    gameState, 
    isLoading, 
    hasOldSave,
    saveSlots,
    isInGame,
    company,
    cash,
    totalAssets,
    landReserves,
    projects,
    researchPoints,
    cityResearches,
    allCities,
    allResearchProjects,
    createNewGame, 
    loadSave, 
    updateState,
    exitGame,
    checkOldSave,
    getAllSaves,
    saveGame,
    loadSaveGame,
    deleteSave,
    autoSave,
    getCityResearch,
    getCityPriceBoost,
    getAvailableResearchProjects,
    startResearch,
    advanceResearch,
    addResearchPoints,
    // 土地市场
    refreshLandMarket,
    checkAndRefreshLandMarket,
    purchaseLand,
    getLandMarketLands,
    getLandMarketLastRefresh,
    getNextRefreshTime,
    getDaysToNextRefresh,
    getMaxLandArea,
    getQualificationPriceMultiplier,
    getCreditDiscountRate,
    // 开发规划
    getProjectTypeConfigs,
    getQualityLevelConfigs,
    getConstructionPhaseConfig,
    getCertificateConfig,
    calculateDevelopmentCost,
    calculateEstimatedRevenue,
    calculateConstructionPeriod,
    setLandDevelopmentPlan,
    getValidProjectTypes,
    confirmDevelopment,
    applyForCertificate,
    advanceCertificates,
    advanceProjectPhase,
    advanceConstruction,
    getProjectById,
    getLandById,
    // 研究点计算
    calculateResearchPointsFromSoldArea,
    getTotalResearchPoints,
    // 资质升级
    getQualificationProgress,
    applyQualificationUpgrade,
    // 银行贷款
    getLoanInterestRate,
    getMaxLoanAmount,
    // IPO
    getIPORequirements,
    checkIPOEligibility,
    listCompany,
    issueShares,
    buybackShares,
    additionalShareOffering,
    // 财务报表
    generateFinancialStatements,
    // 宏观经济
    getMacroEconomy,
    advanceMacroEconomy
  }
})
