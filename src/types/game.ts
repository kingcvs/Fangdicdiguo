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
  creditRating: 'AAA' | 'AA' | 'A' | 'B' | 'C'
  cash: number
  totalAssets: number
  totalLiabilities: number
  monthlyProfit: number
  brand: Brand
  executives: Executive[]
  employees: Employee[]
  threeRedLines: ThreeRedLines
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
}

// 土地市场挂土地
export interface MarketLand {
  id: string
  province: string
  city: string
  district: string
  area: number // 占地面积（平方米）
  floorAreaRatio: number // 容积率
  buildingDensity: number // 建筑密度
  greeningRate: number // 绿化率
  landUse: '住宅' | '商业' | '综合体' | '工业'
  useYears: number // 土地使用年限
  basePrice: number // 挂牌价格
  currentPrice: number // 当前价格（受资质信用影响）
  pricePerSquare: number // 楼面地价
  discountRate: number // 折扣率（基于资质信用）
  tags: string[]
  expireDate: { year: number; month: number; day: number } // 过期时间
}

// 土地市场规模配置
export interface LandMarketConfig {
  maxLandCount: number // 市场最大土地数量
  refreshIntervalDays: number // 刷新间隔天数
  priceMultiplierByQualification: Record<number, number> // 资质对应的价格系数
  maxAreaByQualification: Record<number, number> // 资质对应的最大可开发面积（平方米）
  discountRateByCredit: Record<string, number> // 信用等级对应的折扣率
}

export interface Project {
  id: string
  landId: string
  name: string
  status: 'planning' | 'construction' | 'presale' | 'completed'
  constructionProgress: number
  fiveCertificates: {
    landUsePermit: boolean
    constructionPlanningPermit: boolean
    constructionPermit: boolean
    presalePermit: boolean
    completionPermit: boolean
  }
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
