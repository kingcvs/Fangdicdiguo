<template>
  <div class="step-container">
    <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-3">
      <span class="text-3xl">🏢</span>
      选择企业性质
    </h2>
    <p class="text-white/70 mb-6">
      请选择合适的企业类型，这将影响您的经营和融资
    </p>
    
    <!-- 企业类型选择 -->
    <div class="space-y-4">
      <div
        v-for="type in enterpriseTypes"
        :key="type.id"
        @click="selectType(type.id)"
        :class="[
          'bg-game-card/60 rounded-xl p-5 border-2 cursor-pointer transition-all',
          selectedType === type.id
            ? 'border-amber-500 bg-amber-500/10'
            : 'border-white/10 hover:border-white/30'
        ]"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              {{ type.name }}
              <span
                v-if="type.recommended"
                class="px-2 py-0.5 bg-green-500/30 text-green-400 text-xs rounded-full"
              >
                推荐
              </span>
            </h3>
            <p class="text-white/60 text-sm mt-1">{{ type.description }}</p>
          </div>
          <div
            v-if="selectedType === type.id"
            class="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm"
          >
            ✓
          </div>
        </div>
        
        <!-- 信息行 -->
        <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div class="text-white/60">
            股东人数: <span class="text-white">{{ type.maxShareholders }}人</span>
          </div>
          <div class="text-white/60">
            融资难度: <span :class="getDifficultyClass(type.financingDifficulty)">{{ type.financingDifficulty }}</span>
          </div>
          <div class="text-white/60">
            可升级: <span class="text-white">{{ type.canUpgrade ? '是' : '否' }}</span>
          </div>
        </div>
        
        <!-- 优缺点 -->
        <div v-if="selectedType === type.id" class="space-y-3 pt-3 border-t border-white/10">
          <div>
            <div class="text-green-400 font-semibold mb-1 text-sm">优点：</div>
            <ul class="space-y-1">
              <li v-for="(pro, i) in type.pros" :key="i" class="text-white/70 text-sm flex items-start gap-2">
                <span class="text-green-400">✓</span>
                {{ pro }}
              </li>
            </ul>
          </div>
          <div>
            <div class="text-red-400 font-semibold mb-1 text-sm">缺点：</div>
            <ul class="space-y-1">
              <li v-for="(con, i) in type.cons" :key="i" class="text-white/70 text-sm flex items-start gap-2">
                <span class="text-red-400">✗</span>
                {{ con }}
              </li>
            </ul>
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
        :disabled="!selectedType"
        :class="[
          'flex-1 py-3 px-6 rounded-xl font-bold transition-all',
          selectedType
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistrationStore } from '@/stores/registration'
import { enterpriseTypes } from '@/data/registrationData'

const router = useRouter()
const registrationStore = useRegistrationStore()

const selectedType = ref<string | null>(null)

function selectType(typeId: string) {
  selectedType.value = typeId
  registrationStore.setEnterpriseType(typeId as any)
}

function getDifficultyClass(difficulty: string) {
  switch (difficulty) {
    case '中等': return 'text-yellow-400'
    case '高': return 'text-orange-400'
    case '极高': return 'text-red-400'
    default: return 'text-white'
  }
}

function prevStep() {
  registrationStore.setStep(2)
  router.push('/registration/2')
}

function nextStep() {
  if (selectedType.value) {
    registrationStore.setStep(4)
    router.push('/registration/4')
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
