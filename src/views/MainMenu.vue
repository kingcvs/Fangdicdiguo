<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <!-- 背景：深蓝色调城市天际线夜景 -->
    <div class="absolute inset-0 bg-gradient-to-b from-blue-950 via-game-primary to-game-secondary">
      <!-- 建筑轮廓层 -->
      <svg class="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5" class="text-amber-400"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <!-- 城市剪影 -->
      <div class="absolute bottom-0 left-0 right-0 h-1/2 opacity-20">
        <svg viewBox="0 0 1440 320" class="w-full h-full" preserveAspectRatio="none">
          <path fill="currentColor" class="text-amber-900" d="M0,320 L0,250 L50,250 L50,180 L100,180 L100,280 L150,280 L150,200 L200,200 L200,150 L250,150 L250,220 L300,220 L300,170 L350,170 L350,240 L400,240 L400,190 L450,190 L450,130 L500,130 L500,200 L550,200 L550,260 L600,260 L600,180 L650,180 L650,140 L700,140 L700,230 L750,230 L750,170 L800,170 L800,120 L850,120 L850,210 L900,210 L900,160 L950,160 L950,250 L1000,250 L1000,190 L1050,190 L1050,140 L1100,140 L1100,220 L1150,220 L1150,180 L1200,180 L1200,130 L1250,130 L1250,240 L1300,240 L1300,200 L1350,200 L1350,150 L1400,150 L1400,270 L1440,270 L1440,320 Z" />
        </svg>
      </div>
      <!-- 70%黑色遮罩 -->
      <div class="absolute inset-0 bg-black/70"></div>
    </div>
    
    <!-- 加载中 -->
    <div v-if="isLoading" class="relative z-10 text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-game-accent border-t-transparent mx-auto mb-4"></div>
      <p class="text-white text-lg">加载中...</p>
    </div>
    
    <!-- 主内容 -->
    <div v-else class="relative z-10 w-full max-w-md">
      <!-- 游戏标题区域 -->
      <div class="text-center mb-16 animate-hero-entrance">
        <!-- 装饰线 -->
        <div class="flex items-center justify-center gap-4 mb-6">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-game-accent"></div>
          <span class="text-game-accent text-2xl">🏗️</span>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-game-accent"></div>
        </div>
        
        <!-- 主标题 -->
        <h1 class="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">
          房地产帝国
        </h1>
        
        <!-- 副标题 -->
        <p class="text-white/70 text-lg md:text-xl tracking-wider">
          2008-2028中国地产全周期模拟
        </p>
        
        <!-- 装饰线 -->
        <div class="flex items-center justify-center gap-4 mt-6">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-white/30"></div>
          <span class="text-white/30 text-sm">REAL ESTATE EMPIRE</span>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-white/30"></div>
        </div>
      </div>
      
      <!-- 功能按钮 -->
      <div class="flex flex-col gap-4 px-4">
        <!-- 继续游戏（高亮显示） -->
        <button
          v-if="hasSave"
          @click="continueGame"
          class="group relative bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-xl py-4 px-8 text-xl font-bold shadow-lg shadow-amber-900/50 transition-all duration-300 transform hover:scale-105 animate-hero-entrance"
          style="animation-delay: 0.1s"
        >
          <span class="flex items-center justify-center gap-3">
            <span class="text-2xl">▶️</span>
            继续游戏
          </span>
          <div class="absolute inset-0 rounded-xl border-2 border-amber-400/50 group-hover:border-amber-300 transition-all"></div>
        </button>
        
        <!-- 开始游戏 -->
        <button
          @click="startGame"
          class="group bg-game-card/80 hover:bg-amber-600/30 backdrop-blur-sm border border-white/10 hover:border-amber-500/50 text-white rounded-xl py-3 px-6 text-lg font-semibold transition-all duration-300 transform hover:scale-102 hover:translate-x-1 animate-hero-entrance"
          :style="{ animationDelay: hasSave ? '0.2s' : '0.1s' }"
        >
          <span class="flex items-center justify-between">
            <span class="flex items-center gap-3">
              <span class="text-xl">🚀</span>
              开始游戏
            </span>
            <span class="text-white/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all">→</span>
          </span>
        </button>
        
        <!-- 存档管理 -->
        <button
          @click="goToSaves"
          class="group bg-game-card/80 hover:bg-blue-600/30 backdrop-blur-sm border border-white/10 hover:border-blue-500/50 text-white rounded-xl py-3 px-6 text-lg font-semibold transition-all duration-300 transform hover:scale-102 hover:translate-x-1 animate-hero-entrance"
          :style="{ animationDelay: hasSave ? '0.3s' : '0.2s' }"
        >
          <span class="flex items-center justify-between">
            <span class="flex items-center gap-3">
              <span class="text-xl">💾</span>
              存档管理
            </span>
            <span class="text-white/50 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">→</span>
          </span>
        </button>
        
        <!-- 更新日志 -->
        <button
          @click="goToChangelog"
          class="group bg-game-card/80 hover:bg-purple-600/30 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 text-white rounded-xl py-3 px-6 text-lg font-semibold transition-all duration-300 transform hover:scale-102 hover:translate-x-1 animate-hero-entrance"
          :style="{ animationDelay: hasSave ? '0.4s' : '0.3s' }"
        >
          <span class="flex items-center justify-between">
            <span class="flex items-center gap-3">
              <span class="text-xl">📋</span>
              更新日志
            </span>
            <span class="text-white/50 group-hover:text-purple-400 group-hover:translate-x-1 transition-all">→</span>
          </span>
        </button>
        
        <!-- 设置 -->
        <button
          @click="goToSettings"
          class="group bg-game-card/80 hover:bg-green-600/30 backdrop-blur-sm border border-white/10 hover:border-green-500/50 text-white rounded-xl py-3 px-6 text-lg font-semibold transition-all duration-300 transform hover:scale-102 hover:translate-x-1 animate-hero-entrance"
          :style="{ animationDelay: hasSave ? '0.5s' : '0.4s' }"
        >
          <span class="flex items-center justify-between">
            <span class="flex items-center gap-3">
              <span class="text-xl">⚙️</span>
              设置
            </span>
            <span class="text-white/50 group-hover:text-green-400 group-hover:translate-x-1 transition-all">→</span>
          </span>
        </button>
      </div>
      
      <!-- 底部信息 -->
      <div class="mt-12 text-center">
        <p class="text-white/40 text-sm">
          🏛️ 真实复刻中国房地产全流程
        </p>
      </div>
      
      <!-- 版本号 -->
      <div class="absolute bottom-4 right-4 text-white/40 text-sm">
        v3.0.0
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()
const hasSave = ref(false)
const isLoading = ref(false)

onMounted(() => {
  checkSaveData()
})

function checkSaveData() {
  isLoading.value = true
  try {
    gameStore.checkOldSave()
    hasSave.value = gameStore.hasOldSave
  } catch (e) {
    hasSave.value = false
  }
  isLoading.value = false
}

function continueGame() {
  const success = gameStore.loadSave()
  if (success) {
    router.push('/game')
  }
}

function startGame() {
  router.push('/registration/1')
}

function goToSaves() {
  router.push('/saves')
}

function goToChangelog() {
  router.push('/changelog')
}

function goToSettings() {
  router.push('/settings')
}
</script>

<style scoped>
.animate-hero-entrance {
  animation: heroEntrance 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes heroEntrance {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>
