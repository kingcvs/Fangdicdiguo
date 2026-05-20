<template>
  <div class="min-h-screen bg-game-primary p-4">
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-white mb-4">设置</h1>
      <p class="text-white/70 mb-4">此页面正在开发中...</p>
      
      <button @click="goBack" class="btn-primary">
        返回主菜单
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/')
}
</script>
