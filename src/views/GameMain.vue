<template>
  <div class="min-h-screen bg-game-primary p-4">
    <div class="max-w-md mx-auto">
      <!-- 顶部信息栏 -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-white">游戏主界面</h1>
        <button @click="goBack" class="text-white/70 hover:text-white">
          退出
        </button>
      </div>
      
      <!-- 公司信息卡片 -->
      <div v-if="gameStore.company" class="bg-game-card/80 rounded-lg p-4 mb-4">
        <h2 class="text-xl font-bold text-game-accent mb-2">
          {{ gameStore.company.name }}
        </h2>
        <div class="grid grid-cols-2 gap-2 text-white/80">
          <div>
            <p class="text-sm text-white/50">现金</p>
            <p class="font-semibold">{{ formatMoney(gameStore.cash) }}</p>
          </div>
          <div>
            <p class="text-sm text-white/50">总资产</p>
            <p class="font-semibold">{{ formatMoney(gameStore.totalAssets) }}</p>
          </div>
          <div>
            <p class="text-sm text-white/50">资质等级</p>
            <p class="font-semibold">{{ getQualificationLevelName(gameStore.company.qualificationLevel) }}</p>
          </div>
          <div>
            <p class="text-sm text-white/50">信用等级</p>
            <p class="font-semibold">{{ gameStore.company.creditRating }}</p>
          </div>
        </div>
      </div>
      
      <!-- 游戏时间 -->
      <div v-if="gameStore.gameState" class="bg-game-card/80 rounded-lg p-4 mb-4">
        <p class="text-white/70 text-sm">游戏时间</p>
        <p class="text-xl font-bold text-white">
          {{ gameStore.gameState.gameTime.year }}年
          {{ gameStore.gameState.gameTime.month + 1 }}月
          {{ gameStore.gameState.gameTime.day }}日
        </p>
      </div>
      
      <!-- 功能菜单 -->
      <div class="grid grid-cols-2 gap-3">
        <button class="btn-primary text-sm">投资</button>
        <button class="btn-primary text-sm">工程</button>
        <button class="btn-primary text-sm">营销</button>
        <button class="btn-primary text-sm">运营</button>
        <button class="btn-primary text-sm">资本</button>
        <button class="btn-primary text-sm">个人</button>
      </div>
      
      <!-- 开发提示 -->
      <p class="text-white/50 text-center mt-6 text-sm">
        游戏界面正在开发中，更多功能即将上线
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

function goBack() {
  gameStore.exitGame()
  router.push('/')
}

function formatMoney(amount: number): string {
  if (amount >= 100000000) {
    return (amount / 100000000).toFixed(2) + '亿'
  } else if (amount >= 10000) {
    return (amount / 10000).toFixed(2) + '万'
  }
  return amount.toFixed(0) + '元'
}

function getQualificationLevelName(level: number): string {
  const names: Record<number, string> = { 1: '一级', 2: '二级', 3: '三级', 4: '四级' }
  return names[level] || '四级'
}
</script>
