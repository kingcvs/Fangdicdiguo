import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, Company, Player, Land, Project, City, ResearchProject, CityResearch } from '@/types/game'

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
      achievements: []
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
    addResearchPoints
  }
})
