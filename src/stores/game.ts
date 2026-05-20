import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, Company, Player, Land, Project } from '@/types/game'

// 从原始localStorage key读取数据
const OLD_SAVE_KEY = 'real-estate-save'
const SAVE_KEY_PREFIX = 'real-estate-save-'
const AUTO_SAVE_KEY = 'real-estate-save-auto'

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
    autoSave
  }
})
