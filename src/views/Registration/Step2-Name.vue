<template>
  <div class="step-container">
    <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-3">
      <span class="text-3xl">✏️</span>
      公司核名
    </h2>
    <p class="text-white/70 mb-6">
      请输入您想要的公司字号，系统会查重
    </p>
    
    <!-- 输入区域 -->
    <div class="bg-game-card/60 rounded-xl p-6">
      <label class="block text-white mb-3">公司字号（2-10个汉字）</label>
      <div class="flex items-center gap-2 mb-2">
        <input
          v-model="companyName"
          type="text"
          maxlength="10"
          placeholder="请输入字号"
          :class="[
            'flex-1 bg-white/10 border-2 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none transition-all',
            checkResult === 'available' ? 'border-green-500' :
            checkResult === 'taken' ? 'border-red-500' :
            'border-white/20'
          ]"
          @input="clearCheck"
        />
        <span class="text-white/70 whitespace-nowrap">房地产开发有限公司</span>
      </div>
      
      <!-- 查重按钮 -->
      <button
        @click="checkName"
        :disabled="companyName.length < 2 || checking"
        :class="[
          'w-full py-3 rounded-lg font-semibold transition-all',
          companyName.length >= 2 && !checking
            ? 'bg-amber-600 hover:bg-amber-500 text-white'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        ]"
      >
        {{ checking ? '查重中...' : checkResult === null ? '检查字号' : '重新检查' }}
      </button>
      
      <!-- 查重结果 -->
      <div v-if="checkResult" class="mt-4">
        <div
          v-if="checkResult === 'available'"
          class="p-4 bg-green-500/20 border border-green-500/50 rounded-lg"
        >
          <div class="text-green-400 font-semibold flex items-center gap-2">
            <span>✓</span>
            字号可用！
          </div>
          <div class="text-white mt-2">
            {{ fullCompanyName }}
          </div>
        </div>
        <div
          v-else
          class="p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
        >
          <div class="text-red-400 font-semibold flex items-center gap-2">
            <span>✗</span>
            该字号已被占用，请重新输入
          </div>
          <div class="text-white/70 mt-2 text-sm">
            建议：{{ getSuggestion() }}
          </div>
        </div>
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
        :disabled="checkResult !== 'available'"
        :class="[
          'flex-1 py-3 px-6 rounded-xl font-bold transition-all',
          checkResult === 'available'
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
import { generateExistingNames } from '@/data/registrationData'

const router = useRouter()
const registrationStore = useRegistrationStore()

const companyName = ref('')
const checkResult = ref<'available' | 'taken' | null>(null)
const checking = ref(false)

const fullCompanyName = computed(() => {
  if (!companyName.value) return ''
  const province = registrationStore.data.provinceName
  return `${province}${companyName.value}房地产开发有限公司`
})

const existingNames = generateExistingNames()

function clearCheck() {
  checkResult.value = null
}

function checkName() {
  if (companyName.value.length < 2) return
  
  checking.value = true
  
  // 模拟查重
  setTimeout(() => {
    // 30%概率被占用
    const isTaken = existingNames.includes(companyName.value) || Math.random() < 0.3
    checkResult.value = isTaken ? 'taken' : 'available'
    
    if (checkResult.value === 'available') {
      registrationStore.setCompanyName(companyName.value, fullCompanyName.value)
    }
    
    checking.value = false
  }, 500)
}

function getSuggestion() {
  const chars = '华中兴旺盛发达恒远宏伟星辰天地和安福'
  let suggestion = companyName.value
  while (suggestion === companyName.value || existingNames.includes(suggestion)) {
    const char1 = chars[Math.floor(Math.random() * chars.length)]
    const char2 = chars[Math.floor(Math.random() * chars.length)]
    suggestion = char1 + char2
  }
  return suggestion
}

function prevStep() {
  registrationStore.setStep(1)
  router.push('/registration/1')
}

function nextStep() {
  if (checkResult.value === 'available') {
    registrationStore.setStep(3)
    router.push('/registration/3')
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
