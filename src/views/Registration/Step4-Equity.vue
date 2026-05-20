<template>
  <div class="step-container">
    <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-3">
      <span class="text-3xl">👥</span>
      设置股权架构
    </h2>
    <p class="text-white/70 mb-6">
      设置初始股东及持股比例
    </p>
    
    <div v-if="enterpriseType === 'one-person'" class="bg-game-card/60 rounded-xl p-6 mb-6">
      <div class="text-amber-400 font-semibold mb-2">一人有限责任公司</div>
      <p class="text-white/70">您100%持有公司股份</p>
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
        
        <div class="flex items-center gap-4">
          <div class="flex-1">
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
      </div>
      
      <!-- 添加股东 -->
      <button
        v-if="shareholders.length < 5"
        @click="addNewShareholder"
        class="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/60 hover:border-amber-500 hover:text-amber-400 transition-all"
      >
        + 添加股东
      </button>
      
      <!-- 持股比例检查 -->
      <div
        :class="[
          'p-4 rounded-xl border',
          totalRatio === 100
            ? 'bg-green-500/20 border-green-500/50'
            : 'bg-red-500/20 border-red-500/50'
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="text-white font-semibold">总持股比例</span>
          <span
            :class="totalRatio === 100 ? 'text-green-400' : 'text-red-400'"
            class="font-mono font-bold"
          >
            {{ totalRatio }}%
          </span>
        </div>
        <p v-if="totalRatio !== 100" class="text-sm text-white/60 mt-1">
          总持股比例必须等于100%
        </p>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="mt-8 flex gap-4">
      <button
        @click="prevStep"
        class="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
      >
        ← 上一步
      </button>
      <button
        @click="nextStep"
        :disabled="enterpriseType !== 'one-person' && totalRatio !== 100"
        :class="[
          'flex-1 py-3 px-6 rounded-xl font-bold transition-all',
          enterpriseType === 'one-person' || totalRatio === 100
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistrationStore } from '@/stores/registration'

const router = useRouter()
const registrationStore = useRegistrationStore()

const enterpriseType = computed(() => registrationStore.data.enterpriseType)
const shareholders = computed(() => registrationStore.data.shareholders)
const totalRatio = computed(() => registrationStore.totalRatio)

const newShareholderName = ref('')

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
  }
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
}

function prevStep() {
  registrationStore.setStep(3)
  router.push('/registration/3')
}

function nextStep() {
  if (enterpriseType.value === 'one-person' || totalRatio.value === 100) {
    registrationStore.setStep(5)
    router.push('/registration/5')
  }
}
</script>

<style scoped>
.step-container {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 4px;
}

.step-container::-webkit-scrollbar {
  width: 6px;
}

.step-container::-webkit-scrollbar-track {
  background: transparent;
}

.step-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
