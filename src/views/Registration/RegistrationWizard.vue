<template>
  <div class="min-h-screen bg-game-primary p-4">
    <div class="max-w-md mx-auto">
      <h1 class="text-2xl font-bold text-white mb-4">公司注册流程</h1>
      <p class="text-white/70 mb-4">当前步骤: {{ currentStep }}</p>
      <p class="text-white/70 mb-4">此页面正在开发中...</p>
      
      <div class="flex gap-4">
        <button @click="prevStep" v-if="currentStep > 1" class="btn-primary">
          上一步
        </button>
        <button @click="nextStep" v-if="currentStep < 11" class="btn-primary">
          下一步
        </button>
        <button @click="goBack" class="btn-primary">
          返回主菜单
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentStep = ref(parseInt(route.params.step as string) || 1)

function nextStep() {
  if (currentStep.value < 11) {
    currentStep.value++
    router.push(`/registration/${currentStep.value}`)
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    router.push(`/registration/${currentStep.value}`)
  }
}

function goBack() {
  router.push('/')
}
</script>
