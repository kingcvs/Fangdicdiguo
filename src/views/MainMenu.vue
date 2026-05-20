<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 bg-gradient-to-b from-game-primary via-game-primary to-game-secondary">
      <div class="absolute inset-0 bg-black/50"></div>
    </div>
    
    <!-- 加载中 -->
    <div v-if="gameStore.isLoading" class="relative z-10 text-center">
      <p class="text-white text-lg">加载中...</p>
    </div>
    
    <!-- 主内容 -->
    <div v-else class="relative z-10 w-full max-w-md">
      <!-- 游戏标题 -->
      <div class="text-center mb-12 animate-hero-entrance">
        <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-game-accent to-game-accent-end bg-clip-text text-transparent">
          房地产帝国
        </h1>
        <p class="text-white/70 text-lg">
          2008-2028中国地产全周期模拟
        </p>
      </div>
      
      <!-- 功能按钮 -->
      <div class="flex flex-col gap-4">
        <!-- 继续游戏 -->
        <button
          v-if="hasSave"
          @click="continueGame"
          class="btn-primary animate-hero-entrance"
          style="animation-delay: 0.1s"
        >
          继续游戏
        </button>
        
        <!-- 开始游戏 -->
        <button
          @click="startGame"
          class="btn-primary animate-hero-entrance"
          :style="{ animationDelay: hasSave ? '0.2s' : '0.1s' }"
        >
          开始游戏
        </button>
        
        <!-- 存档管理 -->
        <button
          @click="goToSaves"
          class="btn-primary animate-hero-entrance"
          :style="{ animationDelay: hasSave ? '0.3s' : '0.2s' }"
        >
          存档管理
        </button>
        
        <!-- 更新日志 -->
        <button
          @click="goToChangelog"
          class="btn-primary animate-hero-entrance"
          :style="{ animationDelay: hasSave ? '0.4s' : '0.3s' }"
        >
          更新日志
        </button>
        
        <!-- 设置 -->
        <button
          @click="goToSettings"
          class="btn-primary animate-hero-entrance"
          :style="{ animationDelay: hasSave ? '0.5s' : '0.4s' }"
        >
          设置
        </button>
      </div>
      
      <!-- 版本号 -->
      <div class="absolute bottom-4 right-4 text-white/50 text-sm">
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

onMounted(() => {
  checkSaveData()
})

function checkSaveData() {
  gameStore.checkOldSave()
  hasSave.value = gameStore.hasOldSave
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
