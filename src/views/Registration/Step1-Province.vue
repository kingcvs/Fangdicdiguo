<template>
  <div class="step-container">
    <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-3">
      <span class="text-3xl">📍</span>
      选择注册地区
    </h2>
    <p class="text-white/70 mb-6">
      选择公司注册地，此将决定您的初始可开发区域
    </p>
    
    <!-- 区域选择 -->
    <div class="space-y-6">
      <div v-for="(regionProvinces, regionName) in provinces" :key="regionName" class="bg-game-card/60 rounded-xl p-4">
        <h3 class="text-lg font-semibold text-amber-400 mb-3">{{ regionName }}</h3>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="province in regionProvinces"
            :key="province.id"
            @click="selectProvince(province)"
            :class="[
              'w-full text-left p-3 rounded-lg border-2 transition-all',
              selectedProvince?.id === province.id
                ? 'border-amber-500 bg-amber-500/20'
                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
            ]"
          >
            <div class="font-semibold text-white mb-1">{{ province.name }}</div>
            <div class="grid grid-cols-2 gap-1 text-xs text-white/60">
              <div>热度: <span :class="getHeatColor(province.heat)">{{ province.heat }}</span></div>
              <div>地价: ¥{{ formatNumber(province.landPrice) }}</div>
              <div>政策: {{ province.policy }}%</div>
              <div>竞争: {{ province.competition }}%</div>
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 选中提示 -->
    <div v-if="selectedProvince" class="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl">
      <div class="text-green-400 font-semibold mb-2">
        ✓ 已选择：{{ selectedProvince.name }}
      </div>
      <div class="text-sm text-white/70">
        此地区将作为您的初始可开发区域
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="mt-8 flex gap-4">
      <button
        @click="goBack"
        class="flex-1 py-3 px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all"
      >
        返回主菜单
      </button>
      <button
        @click="nextStep"
        :disabled="!selectedProvince"
        :class="[
          'flex-1 py-3 px-6 rounded-xl font-bold transition-all',
          selectedProvince
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
import { provinces } from '@/data/registrationData'

const router = useRouter()
const registrationStore = useRegistrationStore()

const selectedProvince = ref<any>(null)

function selectProvince(province: any) {
  selectedProvince.value = province
  registrationStore.setProvince(province.id, province.name)
}

function getHeatColor(heat: number) {
  if (heat >= 80) return 'text-red-400'
  if (heat >= 60) return 'text-orange-400'
  if (heat >= 40) return 'text-yellow-400'
  return 'text-green-400'
}

function formatNumber(num: number) {
  return (num / 10000).toFixed(0) + '万'
}

function goBack() {
  router.push('/')
}

function nextStep() {
  if (selectedProvince.value) {
    registrationStore.setStep(2)
    router.push('/registration/2')
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
