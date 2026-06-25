import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, Company, Player, Land, Project, MarketLand, LandMarketConfig } from '@/types/game'

// 从原始localStorage key读取数据
const OLD_SAVE_KEY = 'real-estate-save'
const SAVE_KEY_PREFIX = 'real-estate-save-'
const AUTO_SAVE_KEY = 'real-estate-save-auto'

// 土地市场配置
const LAND_MARKET_CONFIG: LandMarketConfig = {
  maxLandCount: 6, // 市场最大土地数量
  refreshIntervalDays: 15, // 刷新间隔天数
  // 资质对应的价格系数（数字越小资质越高）
  priceMultiplierByQualification: {
    1: 0.7,  // 一级资质70%价格
    2: 0.85, // 二级资质85%价格
    3: 1.0,  // 三级资质原价
    4: 1.15  // 四级资质115%价格
  },
  // 资质对应的最大可开发面积（平方米）
  // 一级资质可开发任意规模，不设限
  maxAreaByQualification: {
    1: Infinity,
    2: 2500000, // 25万㎡ (25公顷)
    3: 1500000, // 15万㎡ (15公顷)
    4: 500000   // 5万㎡ (5公顷)
  },
  // 信用等级对应的折扣率
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

// 城市数据
const CITIES_DATA = [
  { name: '北京', districts: ['朝阳', '海淀', '丰台', '石景山', '通州', '大兴', '昌平'], basePrice: 50000, priceLevel: 1.5 },
  { name: '上海', districts: ['浦东', '黄浦', '徐汇', '长宁', '静安', '普陀', '虹口'], basePrice: 48000, priceLevel: 1.45 },
  { name: '广州', districts: ['天河', '海珠', '越秀', '白云', '番禺', '黄埔', '南沙'], basePrice: 28000, priceLevel: 1.2 },
  { name: '深圳', districts: ['福田', '罗湖', '南山', '宝安', '龙岗', '龙华', '坪山'], basePrice: 45000, priceLevel: 1.4 },
  { name: '成都', districts: ['锦江', '青羊', '金牛', '武侯', '成华', '双流', '郫都'], basePrice: 12000, priceLevel: 1.0 },
  { name: '杭州', districts: ['上城', '下城', '西湖', '滨江', '萧山', '余杭', '临平'], basePrice: 25000, priceLevel: 1.15 },
  { name: '南京', districts: ['玄武', '秦淮', '建邺', '鼓楼', '栖霞', '江宁', '浦口'], basePrice: 22000, priceLevel: 1.1 },
  { name: '武汉', districts: ['江岸', '江汉', '汉阳', '武昌', '青山', '洪山', '东湖'], basePrice: 15000, priceLevel: 1.05 },
  { name: '西安', districts: ['新城', '碑林', '莲湖', '雁塔', '灞桥', '长安', '临潼'], basePrice: 10000, priceLevel: 1.0 },
  { name: '重庆', districts: ['渝中', '江北', '南岸', '沙坪坝', '九龙坡', '大渡口', '巴南'], basePrice: 11000, priceLevel: 1.02 }
]

// 土地用途配置
const LAND_USE_CONFIG: Record<LandUseType, { floorAreaRatio: [number, number]; buildingDensity: [number, number]; greeningRate: [number, number]; useYears: number; priceMultiplier: number }> = {
  '住宅': { floorAreaRatio: [2.0, 3.5], buildingDensity: [0.2, 0.35], greeningRate: [0.30, 0.45], useYears: 70, priceMultiplier: 1.0 },
  '商业': { floorAreaRatio: [3.0, 6.0], buildingDensity: [0.3, 0.5], greeningRate: [0.20, 0.35], useYears: 40, priceMultiplier: 1.3 },
  '综合体': { floorAreaRatio: [3.5, 5.5], buildingDensity: [0.35, 0.5], greeningRate: [0.25, 0.35], useYears: 50, priceMultiplier: 1.2 },
  '工业': { floorAreaRatio: [1.0, 2.5], buildingDensity: [0.4, 0.6], greeningRate: [0.15, 0.25], useYears: 50, priceMultiplier: 0.6 }
}

// 土地标签池
const LAND_TAG_POOL = ['地铁旁', '江景房', '学区房', 'CBD核心', '新城规划', '旧改项目', 'TOD项目', '景观资源', '产业配套', '政策倾斜', '价格洼地', '升值潜力大']

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
      }
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
        }
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
    const city = randomPick(CITIES_DATA)
    const district = randomPick(city.districts)
    const landUse = randomPick(['住宅', '住宅', '住宅', '商业', '综合体', '工业'] as LandUseType[]) // 住宅权重更高
    const useConfig = LAND_USE_CONFIG[landUse]

    // 根据资质确定最大面积
    const maxArea = getMaxLandArea()

    // 生成符合资质的土地面积
    let area: number
    const minArea = 10000 // 最小1万㎡
    if (maxArea === Infinity) {
      // 一级资质：生成1万到50万㎡的土地
      area = randomInt(minArea, 500000)
    } else {
      // 其他资质：最大面积限制内生成
      area = randomInt(minArea, Math.min(maxArea, 500000))
    }

    // 根据城市和用途生成价格
    const basePrice = city.basePrice * useConfig.priceMultiplier * random(0.8, 1.2)

    // 计算楼面地价
    const floorAreaRatio = random(useConfig.floorAreaRatio[0], useConfig.floorAreaRatio[1])
    const pricePerSquare = basePrice / floorAreaRatio

    // 综合折扣率
    const qualificationMultiplier = getQualificationPriceMultiplier()
    const creditDiscount = getCreditDiscountRate()
    const discountRate = qualificationMultiplier * creditDiscount

    // 当前价格
    const currentPrice = Math.round(basePrice * discountRate)

    // 生成标签
    const tagCount = randomInt(1, 3)
    const tags = randomPickMultiple(LAND_TAG_POOL, tagCount)

    // 过期时间：15天后
    const gameTime = gameState.value?.gameTime || { year: 2008, month: 0, day: 1 }
    const expireDate = addDays(gameTime, LAND_MARKET_CONFIG.refreshIntervalDays)

    return {
      id: 'land_market_' + Date.now() + '_' + randomInt(1000, 9999),
      province: city.name,
      city: city.name,
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

    // 更新最后刷新时间
    gameState.value.landMarket.lastRefreshTime = { ...gameTime }

    // 生成新的土地列表
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
    if (!gameState.value) return false

    const land = gameState.value.landMarket.lands.find(l => l.id === landId)
    if (!land) return false

    // 检查金额
    const company = gameState.value.company
    if (!company || company.cash < land.currentPrice) {
      return false
    }

    // 检查资质是否满足最大面积要求
    const maxArea = getMaxLandArea()
    if (land.area > maxArea) {
      return false
    }

    // 扣除现金
    company.cash -= land.currentPrice

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

    // 从市场移除
    gameState.value.landMarket.lands = gameState.value.landMarket.lands.filter(l => l.id !== landId)

    return true
  }

  // 获取土地市场数据（computed用）
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
    getCreditDiscountRate
  }
})
