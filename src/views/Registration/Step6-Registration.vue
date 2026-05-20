<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-xl font-bold text-white">工商注册登记</h2>
      <p class="text-gray-400 text-sm">正在自动办理工商注册登记...</p>
    </div>

    <div v-if="!isComplete" class="flex flex-col items-center py-8">
      <div class="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-300">{{ currentStatus }}</p>
    </div>

    <div v-else class="space-y-4">
      <div class="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
        <div class="text-4xl mb-2">✅</div>
        <h3 class="text-green-400 font-bold text-lg">工商注册成功！</h3>
      </div>

      <div class="bg-black/30 rounded-lg p-4 space-y-3">
        <h4 class="text-white font-bold">企业信息</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">企业名称</span>
            <span class="text-white">{{ registrationStore.data.fullCompanyName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">统一社会信用代码</span>
            <span class="text-amber-400 font-mono">{{ registrationStore.data.creditCode }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">法定代表人</span>
            <span class="text-white">{{ registrationStore.data.legalRepresentative }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">成立日期</span>
            <span class="text-white">{{ registrationStore.data.establishmentDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">注册地址</span>
            <span class="text-white">{{ registrationStore.data.registeredAddress }}</span>
          </div>
        </div>
      </div>

      <div class="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">工商注册登记费</span>
          <span class="text-red-400">-{{ fees.registration.toLocaleString('zh-CN') }} 元</span>
        </div>
      </div>
    </div>

    <div class="flex gap-3">
      <button @click="$emit('back')" v-if="!isComplete" class="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
        上一步
      </button>
      <button @click="handleComplete" v-if="isComplete" class="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all">
        下一步
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRegistrationStore } from '@/stores/registration'
import { generateCreditCode, getCapitalCity, fees } from '@/data/registrationData'

const emit = defineEmits(['complete', 'back'])

const registrationStore = useRegistrationStore()

const isComplete = ref(false)
const currentStatus = ref('正在提交材料...')

const statuses = [
  '正在提交材料...',
  '工商部门审核中...',
  '生成营业执照...',
  '登记完成！'
]

onMounted(() => {
  if (!registrationStore.data.creditCode) {
    const creditCode = generateCreditCode()
    const address = getCapitalCity(registrationStore.data.provinceId || '') + '某某区某某路1号'
    registrationStore.setRegistrationInfo(creditCode, address)
  }
  
  let index = 0
  const interval = setInterval(() => {
    if (index < statuses.length) {
      currentStatus.value = statuses[index]
      index++
    } else {
      clearInterval(interval)
      isComplete.value = true
    }
  }, 800)
})

function handleComplete() {
  emit('complete')
}
</script>
