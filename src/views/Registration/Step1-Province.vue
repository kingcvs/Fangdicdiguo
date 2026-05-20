<template>
  <div>
    <h2 class="text-2xl font-bold text-white mb-2 flex items-center gap-3">
      <span class="text-3xl">📍</span>
      选择注册地区
    </h2>
    <p class="text-white/70 mb-6">
      选择公司注册地，此将决定您的初始可开发区域
    </p>
    
    <!-- 左右排列布局 -->
    <div class="grid grid-cols-12 gap-4">
      <!-- 左侧区域选择 -->
      <div class="col-span-4">
        <h3 class="text-white/80 text-sm mb-3 font-semibold">选择区域</h3>
        <div class="space-y-2">
          <button
            v-for="region in regionNames"
            :key="region"
            @click="selectedRegion = region"
            :class="[
              'w-full text-left px-4 py-3 rounded-lg transition-all',
              selectedRegion === region
                ? 'bg-amber-500 text-black font-semibold'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            ]"
          >
            {{ region }}
          </button>
        </div>
      </div>
      
      <!-- 右侧省份选择 -->
      <div class="col-span-8">
        <h3 class="text-white/80 text-sm mb-3 font-semibold">选择省份</h3>
        <div class="space-y-3">
          <button
            v-for="province in currentRegionProvinces"
            :key="province.id"
            @click="selectProvince(province)"
            :class="[
              'w-full text-left p-4 rounded-xl border-2 transition-all',
              selectedProvince?.id === province.id
                ? 'border-amber-500 bg-amber-500/20'
                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
            ]"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="font-semibold text-white text-lg">{{ province.name }}</div>
              <div class="flex items-center gap-2">
                <span
                  :class="getHeatColor(province.heat)"
                  class="px-2 py-1 rounded text-xs font-semibold"
                >
                  热度 {{ province.heat }}
                </span>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-3 text-sm">
              <div class="flex justify-between">
                <span class="text-white/50">地价</span>
                <span class="text-amber-400 font-semibold">¥{{ formatNumber(province.landPrice) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">政策</span>
                <span class="text-green-400 font-semibold">{{ province.policy }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">竞争</span>
                <span class="text-blue-400 font-semibold">{{ province.competition }}%</span>
              </div>
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
        @click="handleComplete"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistrationStore } from '@/stores/registration'
import { provinces } from '@/data/registrationData'

const emit = defineEmits(['complete'])
const router = useRouter()
const registrationStore = useRegistrationStore()

const selectedProvince = ref<any>(null)
const selectedRegion = ref<string>('华北')

const regionNames = computed(() => Object.keys(provinces))

const currentRegionProvinces = computed(() => {
  return provinces[selectedRegion.value as keyof typeof provinces] || []
})

function selectProvince(province: any) {
  selectedProvince.value = province
  registrationStore.setProvince(province.id, province.name)
}

function getHeatColor(heat: number) {
  if (heat >= 80) return 'bg-red-500/30 text-red-300'
  if (heat >= 60) return 'bg-orange-500/30 text-orange-300'
  if (heat >= 40) return 'bg-yellow-500/30 text-yellow-300'
  return 'bg-green-500/30 text-green-300'
}

function formatNumber(num: number) {
  return (num / 10000).toFixed(0) + '万'
}

function goBack() {
  router.push('/')
}

function handleComplete() {
  if (selectedProvince.value) {
    emit('complete')
  }
}
</script>
