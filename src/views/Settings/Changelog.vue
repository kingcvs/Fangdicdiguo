<template>
  <div class="min-h-screen bg-game-primary p-4">
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-white mb-4">更新日志</h1>
      
      <div class="space-y-4">
        <div v-for="entry in changelog" :key="entry.version" class="bg-game-card/80 rounded-lg p-4">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-bold text-game-accent">v{{ entry.version }}</h2>
            <span class="text-white/50 text-sm">{{ entry.date }}</span>
          </div>
          <ul class="text-white/80 text-sm space-y-1">
            <li v-for="change in entry.changes" :key="change">• {{ change }}</li>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getChangelog } from '@/config/version'

const router = useRouter()
const changelog = ref(getChangelog())

function goBack() {
  router.push('/')
}
</script>
