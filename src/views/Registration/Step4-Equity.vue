<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-3">
      <span class="text-3xl">👥</span>
      设置股权架构
    </h2>
    <p class="text-white/70 mb-6">
      设置初始股东及持股比例
    </p>
    
    <div v-if="enterpriseType === 'one-person'" class="bg-game-card/60 rounded-xl p-6 mb-6">
      <div class="text-amber-400 font-semibold mb-2">一人有限责任公司</div>
      <p class="text-white/70 mb-4">您100%持有公司股份</p>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-white/5 rounded-lg p-3">
          <div class="text-xs text-white/50 mb-1">认缴出资</div>
          <div class="text-lg font-bold text-amber-400">{{ formatMoney(registeredCapital) }}</div>
        </div>
        <div class="bg-white/5 rounded-lg p-3">
          <div class="text-xs text-white/50 mb-1">实缴出资</div>
          <div class="text-lg font-bold text-green-400">{{ formatMoney(paidCapital) }}</div>
        </div>
      </div>
    </div>
    
    <div v-else class="space-y-4">
      <!-- 股东列表 -->
      <div
        v-for="(shareholder, index) in shareholders"
        :key="shareholder.id"
        class="bg-game-card/60 rounded-xl p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ shareholder.isPlayer ? '👤' : '👥' }}</span>
            <span class="text-white font-semibold">{{ shareholder.name }}</span>
            <span v-if="shareholder.isPlayer" class="px-2 py-0.5 bg-blue-500/30 text-blue-400 text-xs rounded">玩家</span>
          </div>
          <button
            v-if="!shareholder.isPlayer && shareholders.length > 1"
            @click="removeShareholder(shareholder.id)"
            class="text-red-400 hover:text-red-300 text-sm"
          >
            删除
          </button>
        </div>
        
        <div class="space-y-3">
          <!-- 持股比例 -->
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="text-xs text-white/50 mb-1 block">持股比例</label>
              <input
                v-model.number="shareholder.ratio"
                type="range"
                min="shareholder.isPlayer ? 30 : 1"
                max="100"
                class="w-full"
                @input="adjustRatios(shareholder.id)"
              />
            </div>
            <span class="text-white font-mono w-16 text-right">{{ shareholder.ratio }}%</span>
          </div>
          
          <!-- 出资额 -->
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <label class="text-xs text-white/50 mb-1 block">实缴出资额</label>
              <div class="flex items-center gap-2">
                <span class="text-amber-400">¥</span>
                <input
                  v-model.number="shareholder.capital"
                  type="number"
                  min="10000"
                  step="10000"
                  class="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  @input="updateCapital(shareholder.id, shareholder.capital)"
                />
              </div>
            </div>
            <span class="text-white/50 text-sm w-16 text-right">{{ formatMoney(shareholder.capital) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 添加股东 -->
      <button
        v-if="shareholders.length < 3"
        @click="addNewShareholder"
        class="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:border-amber-500 hover:text-amber-400 transition-all"
      >
        + 添加股东 (最多3位)
      </button>
      <div v-else class="text-center text-white/50 text-sm py-2">
        已达最大股东数量 (3位)
      </div>
      
      <!-- 汇总信息 -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div class="bg-white/5 rounded-xl p-4">
          <div class="text-xs text-white/50 mb-1">总持股比例</div>
          <div
            :class="totalRatio === 100 ? 'text-green-400' : 'text-red-400'"
            class="text-xl font-bold"
          >
            {{ totalRatio }}%
          </div>
        </div>
        <div class="bg-white/5 rounded-xl p-4">
          <div class="text-xs text-white/50 mb-1">总实缴出资</div>
          <div
            :class="totalShareholderCapital >= paidCapital ? 'text-green-400' : 'text-amber-400'"
            class="text-xl font-bold"
          >
            {{ formatMoney(totalShareholderCapital) }}
          </div>
        </div>
      </div>
      
      <!-- 检查提示 -->
      <div
        :class="[
          'p-4 rounded-xl border',
          totalRatio === 100 && totalShareholderCapital >= paidCapital
            ? 'bg-green-500/20 border-green-500/50'
            : 'bg-red-500/20 border-red-500/50'
        ]"
      >
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-white font-semibold text-sm">持股比例检查</span>
            <span :class="totalRatio === 100 ? 'text-green-400' : 'text-red-400'" class="text-sm font-bold">
              {{ totalRatio === 100 ? '✓ 正确' : '✗ 错误' }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-white font-semibold text-sm">出资额检查</span>
            <span :class="totalShareholderCapital >= paidCapital ? 'text-green-400' : 'text-red-400'" class="text-sm font-bold">
              {{ totalShareholderCapital >= paidCapital ? '✓ 充足' : '✗ 不足' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="mt-8 flex gap-4">
      <button
        @click="handleBack"
        class="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
      >
        ← 上一步
      </button>
      <button
        @click="handleComplete"
        :disabled="!canProceed"
        :class="[
          'flex-1 py-3 px-6 rounded-xl font-bold transition-all',
          canProceed
            ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        ]"
      >
        下一步 →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistrationStore } from '@/stores/registration'

const emit = defineEmits(['complete', 'back'])
const router = useRouter()
const registrationStore = useRegistrationStore()

const enterpriseType = computed(() => registrationStore.data.enterpriseType)
const shareholders = computed(() => registrationStore.data.shareholders)
const totalRatio = computed(() => registrationStore.totalRatio)
const paidCapital = computed(() => registrationStore.paidCapital)
const registeredCapital = computed(() => registrationStore.data.registeredCapital)
const totalShareholderCapital = computed(() => registrationStore.totalShareholderCapital)

const canProceed = computed(() => {
  if (enterpriseType.value === 'one-person') return true
  return totalRatio.value === 100 && totalShareholderCapital.value >= paidCapital.value
})

function formatMoney(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toFixed(0) + '元'
}

function adjustRatios(changedId: string) {
    const others = shareholders.value.filter(s => s.id !== changedId)
    const changed = shareholders.value.find(s => s.id === changedId)
    
    if (changed && others.length > 0) {
      const remaining = 100 - changed.ratio
      const currentOthersTotal = others.reduce((sum, s) => sum + s.ratio, 0)
      
      if (currentOthersTotal > 0) {
        const ratio = remaining / currentOthersTotal
        others.forEach(s => {
          s.ratio = Math.round(s.ratio * ratio)
        })
      }
      
      // 确保总和为100
      const newTotal = shareholders.value.reduce((sum, s) => sum + s.ratio, 0)
      if (newTotal !== 100) {
        const last = shareholders.value[shareholders.value.length - 1]
        last.ratio += (100 - newTotal)
      }
      
      // 更新出资额
      updateAllCapitals()
    }
  }
  
  function updateAllCapitals() {
    shareholders.value.forEach(shareholder => {
      const expectedCapital = Math.floor((paidCapital.value * shareholder.ratio) / 100)
      shareholder.capital = expectedCapital
    })
  }
  
  // 初始化时和paidCapital变化时更新所有出资额
  onMounted(() => {
    updateAllCapitals()
  })
  
  // 监听paidCapital变化，更新所有出资额
  watch(paidCapital, () => {
    updateAllCapitals()
  })

function updateCapital(id: string, capital: number) {
  registrationStore.updateShareholderCapital(id, capital)
}

function addNewShareholder() {
  const names = ['张三', '李四', '王五', '赵六', '钱七']
  const count = shareholders.value.length - 1
  const ratio = Math.floor(Math.max(5, (100 - shareholders.value[0].ratio) / 4))
  
  registrationStore.addShareholder(names[count % names.length], ratio)
  
  // 调整比例
  adjustRatios(shareholders.value[0].id)
}

function removeShareholder(id: string) {
  registrationStore.removeShareholder(id)
  // 调整剩余股东比例
  if (shareholders.value.length > 0) {
    adjustRatios(shareholders.value[0].id)
  }
}

function handleBack() {
  emit('back')
}

function handleComplete() {
  if (canProceed.value) {
    emit('complete')
  }
}
</script>
