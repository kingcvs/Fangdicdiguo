import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Shareholder {
  id: string
  name: string
  ratio: number
  isPlayer: boolean
  capital: number
}

export interface RegistrationState {
  // 步骤1: 注册地区
  provinceId: string | null
  provinceName: string
  
  // 步骤2: 公司核名
  companyName: string
  fullCompanyName: string
  
  // 步骤3: 企业性质
  enterpriseType: 'limited' | 'one-person' | 'partnership' | null
  
  // 步骤4: 股权架构
  shareholders: Shareholder[]
  
  // 步骤5: 注册资本
  registeredCapital: number
  paidRatio: number
  
  // 步骤6: 工商注册
  creditCode: string
  establishmentDate: string
  legalRepresentative: string
  registeredAddress: string
  
  // 步骤7: 刻章
  seals: {
    official: boolean
    finance: boolean
    legal: boolean
    invoice: boolean
    contract: boolean
    business: boolean
  }
  
  // 步骤8: 银行开户
  selectedBank: string | null
  
  // 步骤9: 税务登记
  taxRegistered: boolean
  
  // 步骤10: 资质申请
  hasEngineers: boolean
  hasAccountant: boolean
  qualificationObtained: boolean
}

export const useRegistrationStore = defineStore('registration', () => {
  // 状态
  const currentStep = ref(1)
  const data = ref<RegistrationState>({
    provinceId: null,
    provinceName: '',
    companyName: '',
    fullCompanyName: '',
    enterpriseType: null,
    shareholders: [
      { id: '1', name: '玩家', ratio: 100, isPlayer: true, capital: 10000000 }
    ],
    registeredCapital: 50000000,
    paidRatio: 20,
    creditCode: '',
    establishmentDate: '2008-01-01',
    legalRepresentative: '玩家',
    registeredAddress: '',
    seals: {
      official: true,
      finance: true,
      legal: true,
      invoice: true,
      contract: false,
      business: false
    },
    selectedBank: null,
    taxRegistered: false,
    hasEngineers: false,
    hasAccountant: false,
    qualificationObtained: false
  })
  
  // 计算属性
  const totalRatio = computed(() => {
    return data.value.shareholders.reduce((sum, s) => sum + s.ratio, 0)
  })
  
  const paidCapital = computed(() => {
    return Math.floor(data.value.registeredCapital * data.value.paidRatio / 100)
  })
  
  const totalShareholderCapital = computed(() => {
    return data.value.shareholders.reduce((sum, s) => sum + s.capital, 0)
  })
  
  const initialCash = computed(() => {
    // 实缴资本 - 各种费用 - 3个月工资
    const fees = 1000 + 500 + 200 // 注册费 + 刻章费 + 税控设备
    const salaries = (3000 * 2 + 2500) * 3 // 2工程师 + 1会计，3个月
    return paidCapital.value - fees - salaries
  })
  
  // 方法
  function setProvince(provinceId: string, provinceName: string) {
    data.value.provinceId = provinceId
    data.value.provinceName = provinceName
  }
  
  function setCompanyName(name: string, fullName: string) {
    data.value.companyName = name
    data.value.fullCompanyName = fullName
  }
  
  function setEnterpriseType(type: 'limited' | 'one-person' | 'partnership') {
    data.value.enterpriseType = type
    // 如果是一人公司，重置股东为玩家100%
    if (type === 'one-person') {
      data.value.shareholders = [
        { id: '1', name: '玩家', ratio: 100, isPlayer: true, capital: paidCapital.value }
      ]
    }
  }
  
  function updateShareholderRatio(id: string, ratio: number) {
    const shareholder = data.value.shareholders.find(s => s.id === id)
    if (shareholder) {
      shareholder.ratio = ratio
    }
  }
  
  function addShareholder(name: string, ratio: number, capital: number = 0) {
    const id = Date.now().toString()
    // 根据持股比例计算默认出资额
    const defaultCapital = Math.floor((paidCapital.value * ratio / 100))
    data.value.shareholders.push({ id, name, ratio, isPlayer: false, capital: capital || defaultCapital })
  }
  
  function updateShareholderCapital(id: string, capital: number) {
    const shareholder = data.value.shareholders.find(s => s.id === id)
    if (shareholder) {
      shareholder.capital = capital
    }
  }
  
  function removeShareholder(id: string) {
    const index = data.value.shareholders.findIndex(s => s.id === id)
    if (index > -1 && !data.value.shareholders[index].isPlayer) {
      data.value.shareholders.splice(index, 1)
    }
  }
  
  function setCapitalInfo(capital: number, ratio: number) {
    data.value.registeredCapital = capital
    data.value.paidRatio = ratio
  }
  
  function setRegistrationInfo(code: string, address: string) {
    data.value.creditCode = code
    data.value.registeredAddress = address
  }
  
  function setSeals(seals: Partial<RegistrationState['seals']>) {
    data.value.seals = { ...data.value.seals, ...seals }
  }
  
  function setBank(bankId: string) {
    data.value.selectedBank = bankId
  }
  
  function setTaxRegistered(registered: boolean) {
    data.value.taxRegistered = registered
  }
  
  function setQualification(engineers: boolean, accountant: boolean, obtained: boolean) {
    data.value.hasEngineers = engineers
    data.value.hasAccountant = accountant
    data.value.qualificationObtained = obtained
  }
  
  function setStep(step: number) {
    currentStep.value = step
  }
  
  function reset() {
    currentStep.value = 1
    const defaultPaidCapital = Math.floor(50000000 * 20 / 100)
    data.value = {
      provinceId: null,
      provinceName: '',
      companyName: '',
      fullCompanyName: '',
      enterpriseType: null,
      shareholders: [
        { id: '1', name: '玩家', ratio: 100, isPlayer: true, capital: defaultPaidCapital }
      ],
      registeredCapital: 50000000,
      paidRatio: 20,
      creditCode: '',
      establishmentDate: '2008-01-01',
      legalRepresentative: '玩家',
      registeredAddress: '',
      seals: {
        official: true,
        finance: true,
        legal: true,
        invoice: true,
        contract: false,
        business: false
      },
      selectedBank: null,
      taxRegistered: false,
      hasEngineers: false,
      hasAccountant: false,
      qualificationObtained: false
    }
  }
  
  return {
    currentStep,
    data,
    totalRatio,
    paidCapital,
    totalShareholderCapital,
    initialCash,
    setProvince,
    setCompanyName,
    setEnterpriseType,
    updateShareholderRatio,
    updateShareholderCapital,
    addShareholder,
    removeShareholder,
    setCapitalInfo,
    setRegistrationInfo,
    setSeals,
    setBank,
    setTaxRegistered,
    setQualification,
    setStep,
    reset
  }
})
