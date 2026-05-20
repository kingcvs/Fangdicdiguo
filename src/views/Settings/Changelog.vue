<template>
  <div class="min-h-screen bg-game-primary p-4">
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-white mb-4">更新日志</h1>
      
      <div class="space-y-4">
        <div class="bg-game-card/80 rounded-lg p-4">
          <h2 class="text-lg font-bold text-game-accent">v3.0.0</h2>
          <p class="text-white/70 text-sm mb-2">2026-05-20</p>
          <ul class="text-white/80 text-sm space-y-1">
            <li>• 升级到Vue 3 + Vite + TailwindCSS + Pinia</li>
            <li>• 全新的UI设计系统</li>
            <li>• 完整的公司注册流程框架</li>
            <li>• 模块化的代码架构</li>
          </ul>
        </div>
        
        <div class="bg-game-card/80 rounded-lg p-4">
          <h2 class="text-lg font-bold text-game-accent">v2.3.0</h2>
          <p class="text-white/70 text-sm mb-2">2026-05-20</p>
          <ul class="text-white/80 text-sm space-y-1">
            <li>• 新增模块按钮组件系统</li>
            <li>• 优化界面视觉效果</li>
            <li>• 提升用户体验</li>
          </ul>
        </div>
      </div>
      
      <button @click="goBack" class="btn-primary mt-6">
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
