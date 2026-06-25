export interface GameState {
  version: string
  isInGame: boolean
  gameTime: {
    year: number
    month: number
    day: number
  }
  company: Company | null
  player: Player | null
  landReserves: Land[]
  projects: Project[]
  aiCompetitors: AICompetitor[]
  macroEconomy: MacroEconomy
  policies: Policy[]
  achievements: Achievement[]
  // 土地市场
  landMarket: {
    lands: MarketLand[]
    lastRefreshTime: { year: number; month: number; day: number }
  }
}

export interface Company {
  id: string
  name: string
  registrationProvince: string
  registrationCity: string
  establishmentDate: string
  creditCode: string
  legalRepresentative: string
  registeredAddress: string
  enterpriseType: 'limited' | 'one-person' | 'partnership'
  registeredCapital: number
  paidInCapital: number
  shareStructure?: Shareholder[]
  shareholders?: Shareholder[]
  qualificationLevel: 1 | 2 | 3 | 4
  qualificationProgress?: QualificationProgress // 资质升级进度
  creditRating: 'AAA' | 'AA' | 'A' | 'B' | 'C'
  cash: number
  totalAssets: number
  totalLiabilities: number
  monthlyProfit: number
  brand: Brand
  executives: Executive[]
  employees: Employee[]
  threeRedLines: ThreeRedLines
  researchPoints: number
  cityResearches: CityResearch[]
  // 股票相关
  stockInfo?: StockInfo
  totalSoldArea?: number // 累计销售面积（用于研究点计算）
  technicalPersonnel?: number // 技术人员数量
  // 财务数据
  financialStatements?: FinancialStatements
  // 行业执照
  licenses?: BusinessLicense[]
  industryAssociations?: IndustryAssociation[]
  // 治理相关
  organizationStructure?: OrganizationStructure
  riskControlSystem?: RiskControlSystem
  internalAudits?: InternalAudit[]
}

export interface QualificationProgress {
  currentLevel: number
  progress: number // 各项指标完成进度
  requirements: {
    registeredCapital: { current: number; required: number }
    totalAssets: { current: number; required: number }
    completedProjects: { current: number; required: number }
    totalSoldArea: { current: number; required: number }
    socialReputation: { current: number; required: number }
    technicalPersonnel: { current: number; required: number }
  }
  canUpgrade: boolean
}

// 财务报表
export interface FinancialStatements {
  balanceSheet: BalanceSheet
  incomeStatement: IncomeStatement
  cashFlowStatement: CashFlowStatement
}

export interface BalanceSheet {
  // 资产
  currentAssets: {
    cash: number
    accountsReceivable: number
    inventory: number
    prepaidExpenses: number
    otherCurrentAssets: number
  }
  fixedAssets: {
    land: number
    buildings: number
    equipment: number
    constructionInProgress: number
    accumulatedDepreciation: number
  }
  intangibleAssets: {
    landUseRights: number
    software: number
    goodwill: number
  }
  totalAssets: number
  // 负债
  currentLiabilities: {
    accountsPayable: number
    advanceReceipts: number
    taxesPayable: number
    shortTermLoans: number
    otherCurrentLiabilities: number
  }
  longTermLiabilities: {
    longTermLoans: number
    bondsPayable: number
    deferredTaxLiabilities: number
  }
  totalLiabilities: number
  // 所有者权益
  paidInCapital: number
  capitalReserve: number
  surplusReserve: number
  retainedEarnings: number
  totalEquity: number
}

export interface IncomeStatement {
  revenue: number
  costOfGoodsSold: number
  grossProfit: number
  operatingExpenses: number
  sellingExpenses: number
  administrativeExpenses: number
  operatingProfit: number
  nonOperatingIncome: number
  nonOperatingExpenses: number
  profitBeforeTax: number
  incomeTax: number
  netProfit: number
}

export interface CashFlowStatement {
  operatingActivities: {
    cashReceivedFromCustomers: number
    cashPaidToSuppliers: number
    cashPaidToEmployees: number
    taxesPaid: number
    netCashFromOperating: number
  }
  investingActivities: {
    purchaseOfFixedAssets: number
    purchaseOfIntangibleAssets: number
    netCashFromInvesting: number
  }
  financingActivities: {
    proceedsFromLoans: number
    repaymentOfLoans: number
    dividendsPaid: number
    netCashFromFinancing: number
  }
  netChangeInCash: number
  beginningCash: number
  endingCash: number
}

export interface Shareholder {
  id: string
  name: string
  sharePercentage: number
  isPlayer: boolean
  capital?: number
}

export interface Brand {
  score: number
  level: 'unknown' | 'regional' | 'national' | 'national-top' | 'industry-benchmark'
}

export interface Executive {
  id: string
  position: string
  name: string
  ability: number
  loyalty: number
  salary: number
}

export interface Employee {
  id: string
  position: string
  name: string
  salary: number
}

// 行业执照
export interface BusinessLicense {
  id: string
  name: string
  type: 'business' | 'qualification' | 'industry' | 'special'
  status: 'pending' | 'valid' | 'expired' | 'revoked'
  issueDate?: string
  expireDate?: string
  issuingAuthority: string
  requirements: string[]
  description: string
  effect?: string
}

// 行业协会
export interface IndustryAssociation {
  id: string
  name: string
  type: 'national' | 'provincial' | 'city'
  joined: boolean
  joinDate?: string
  membershipFee: number
  benefits: string[]
  requirements: string[]
}

// 组织架构
export interface OrganizationStructure {
  departments: Department[]
  totalEmployees: number
}

export interface Department {
  id: string
  name: string
  manager?: Executive
  employees: Employee[]
  budget: number
  description: string
}

// 风控体系
export interface RiskControlSystem {
  level: number
  policies: RiskPolicy[]
  lastAuditDate?: string
  auditFrequency: 'monthly' | 'quarterly' | 'yearly'
}

export interface RiskPolicy {
  id: string
  name: string
  type: 'finance' | 'operation' | 'legal' | 'market'
  status: 'active' | 'inactive'
  effectiveness: number
  description: string
}

// 内部审计
export interface InternalAudit {
  id: string
  name: string
  type: 'financial' | 'operational' | 'compliance' | 'special'
  status: 'planned' | 'in_progress' | 'completed'
  startDate?: string
  endDate?: string
  findings: AuditFinding[]
  recommendations: string[]
}

export interface AuditFinding {
  id: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'resolved'
  department?: string
}

export interface ThreeRedLines {
  assetLiabilityRatio: number
  netDebtRatio: number
  cashShortDebtRatio: number
}

export interface Land {
  id: string
  province: string
  city: string
  district: string
  area: number
  floorAreaRatio: number
  buildingDensity: number
  greeningRate: number
  landUse: string
  useYears: number
  acquisitionPrice: number
  acquisitionDate: string
  status: 'pending' | 'developing' | 'completed' | 'self-held'
  currentValue: number
  tags: string[]
  // 开发规划
  developmentPlan?: DevelopmentPlan
}

// 开发规划
export interface DevelopmentPlan {
  projectType: ProjectType // 项目类型
  qualityLevel: QualityLevel // 开发品味
  projectName: string // 项目名称
  estimatedCost: number // 预估成本
  estimatedRevenue: number // 预估收益
  constructionPeriod: number // 建设周期（月）
}

// 项目类型
export type ProjectType = '住宅' | '商业' | '综合体' | '别墅' | '公寓' | '写字楼' | '购物中心' | '产业园'

// 开发品味等级
export type QualityLevel = '高端' | '中端' | '低端'

// 项目类型配置
export interface ProjectTypeConfig {
  type: ProjectType
  baseCostPerSqm: number // 每平米基础建设成本
  priceMultiplier: number // 售价系数
  constructionPeriod: number // 基础建设周期（月）
  minArea: number // 最小面积要求
  requirements?: string[] // 前置要求
}

// 品味配置
export interface QualityLevelConfig {
  level: QualityLevel
  costMultiplier: number // 成本系数
  priceMultiplier: number // 售价系数
  brandBoost: number // 品牌加成
  description: string // 描述
}

// 土地市场挂牌土地
export interface MarketLand {
  id: string
  province: string
  city: string
  district: string
  area: number
  floorAreaRatio: number
  buildingDensity: number
  greeningRate: number
  landUse: '住宅' | '商业' | '综合体' | '工业'
  useYears: number
  basePrice: number
  currentPrice: number
  pricePerSquare: number
  discountRate: number
  tags: string[]
  expireDate: { year: number; month: number; day: number }
}

// 土地市场规模配置
export interface LandMarketConfig {
  maxLandCount: number
  refreshIntervalDays: number
  priceMultiplierByQualification: Record<number, number>
  maxAreaByQualification: Record<number, number>
  discountRateByCredit: Record<string, number>
}

export interface Project {
  id: string
  landId: string
  name: string
  city: string
  district: string
  status: ProjectStatus
  projectType: ProjectType
  qualityLevel: QualityLevel
  // 建设进度
  constructionProgress: number
  currentPhase: ConstructionPhase
  // 五证办理状态
  fiveCertificates: FiveCertificates
  // 各阶段进度
  phases: ProjectPhases
  // 成本与收益
  totalCost: number
  estimatedRevenue: number
  // 时间信息
  startDate: string
  estimatedCompletionDate: string
  actualCompletionDate?: string
  // 其他信息
  totalArea: number // 总建筑面积
  soldArea: number // 已售面积
  unsoldArea: number // 未售面积
  avgPricePerSqm: number // 平均售价
}

// 项目状态
export type ProjectStatus = 'planning' | 'design' | 'approval' | 'construction' | 'presale' | 'delivery' | 'completed'

// 施工阶段
export type ConstructionPhase = 
  | 'foundation' // 基础施工
  | 'structure' // 主体结构
  | 'enclosure' // 围护结构
  | 'interior' // 内部装修
  | 'equipment' // 设备安装
  | 'landscape' // 景观绿化
  | 'completion' // 竣工验收

// 五证
export interface FiveCertificates {
  landUsePermit: CertificateStatus // 土地使用证
  constructionPlanningPermit: CertificateStatus // 建设工程规划许可证
  constructionPermit: CertificateStatus // 建设工程施工许可证
  presalePermit: CertificateStatus // 商品房预售许可证
  completionAcceptance: CertificateStatus // 竣工验收备案
}

// 证照状态
export interface CertificateStatus {
  obtained: boolean
  obtainDate?: string
  cost?: number
  pending?: boolean // 正在办理中
  progress?: number // 办理进度
}

// 项目各阶段详情
export interface ProjectPhases {
  // 规划阶段
  planning: PhaseDetail
  // 设计阶段
  design: PhaseDetail
  // 审批阶段
  approval: PhaseDetail
  // 施工阶段
  construction: PhaseDetail
  // 预售阶段
  presale: PhaseDetail
  // 交付阶段
  delivery: PhaseDetail
}

// 阶段详情
export interface PhaseDetail {
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  startDate?: string
  endDate?: string
  cost?: number
  notes?: string
}

export interface Player {
  nickname: string
  personalAssets: PersonalAsset[]
  relationships: Relationship[]
  abilities: Abilities
  socialStatus: SocialStatus
  risks: Risks
}

export interface PersonalAsset {
  id: string
  type: string
  value: number
}

export interface Relationship {
  id: string
  name: string
  level: 'core' | 'important' | 'normal'
  intimacy: number
}

export interface Abilities {
  negotiation: number
  management: number
  riskPrediction: number
  publicRelations: number
}

export interface SocialStatus {
  level: number
  titles: string[]
  reputation: number
}

export interface Risks {
  taxRisk: number
  briberyRisk: number
  publicOpinionRisk: number
  healthRisk: number
}

export interface MacroEconomy {
  gdpGrowthRate: number
  interestRate: number
  urbanizationRate: number
  population: number
  housingPriceIndex: number
}

export interface Policy {
  id: string
  type: 'purchase-restriction' | 'loan-restriction' | 'sale-restriction' | 'three-red-lines'
  province: string | null
  startDate: string
  endDate: string | null
  content: string
}

export interface AICompetitor {
  id: string
  name: string
  strength: number
  strategy: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  unlocked: boolean
  unlockDate: string | null
}

export interface CityResearch {
  cityId: string
  completedProjects: string[]
  inProgressProject: string | null
  progress: number
}

export interface ResearchProject {
  id: string
  name: string
  description: string
  category: 'infrastructure' | 'policy' | 'marketing' | 'quality' | 'technology'
  cost: number
  researchPoints: number
  duration: number
  priceBoost: number
  requirements: string[]
  icon: string
}

export interface City {
  id: string
  name: string
  description: string
  province: string
  avgPrice: number
  developmentLevel: number
  potential: number
  population: number
  gdp: number
  tags: string[]
  research: CityResearch
}

// 资质升级要求
export interface QualificationRequirement {
  level: 1 | 2 | 3 | 4
  name: string
  registeredCapital: number // 注册资本要求
  totalAssets: number // 净资产要求
  completedProjects: number // 完成项目数
  totalSoldArea: number // 累计销售面积
  socialReputation: number // 社会知名度
  technicalPersonnel: number // 技术人员数量
  notes: string[]
}

// 上市要求
export interface IPORequirement {
  minYears: number // 成立年限要求
  minRegisteredCapital: number // 最低注册资本
  minTotalAssets: number // 最低总资产
  minRevenue: number // 最低营收
  minProfit: number // 最低利润
  minProjects: number // 完成项目数
  auditStatus: string // 审计状态
  governanceStatus: string // 公司治理
}

// 股票相关
export interface StockInfo {
  listed: boolean
  listingDate?: string
  totalShares: number // 总股本
  sharePrice: number // 股价
  marketCap: number // 市值
  peRatio: number // 市盈率
  sharesInCirculation: number // 流通股
  sharesRestricted: number // 限售股
}

export interface ShareholderOperation {
  id: string
  type: 'add' | 'remove' | 'transfer' | 'buyback'
  shareholderId: string
  sharePercentage: number
  price?: number
  date: string
  notes?: string
}
