<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-xl font-bold text-white">税务登记</h2>
      <p class="text-gray-400 text-sm">正在办理税务登记与税控设备...</p>
    </div>

    <div v-if="!isComplete" class="flex flex-col items-center py-8">
      <div class="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-300">{{ currentStatus }}</p>
    </div>

    <div v-else class="space-y-4">
      <div class="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
        <div class="text-4xl mb-2">✅</div>
        <h3 class="text-green-400 font-bold text-lg">税务登记完成！</h3>
      </div>

      <div class="bg-black/30 rounded-lg p-4 space-y-3">
        <h4 class="text-white font-bold">已完成事项</h4>
        <div class="space-y-2">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-400">✓</span>
            <span class="text-gray-300">税种核定完成</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-400">✓</span>
            <span class="text-gray-300">增值税一般纳税人认定</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-400">✓</span>
            <span class="text-gray-300">税控设备购买完成</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="text-green-400">✓</span>
            <span class="text-gray-300">发票领购簿办理完成</span>
          </div>
        </div>
      </div>

      <div class="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">税控设备及服务费</span>
          <span class="text-red-400">-{{ fees.taxEquipment.toLocaleString('zh-CN') }} 元</span>
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
import { ref, onMounted } from 'vue'
import { useRegistrationStore } from '@/stores/registration'
import { fees } from '@/data/registrationData'

const emit = defineEmits(['complete', 'back'])

const registrationStore = useRegistrationStore()

const isComplete = ref(false)
const currentStatus = ref('正在提交税务登记...')

const statuses = [
  '正在提交税务登记...',
  '税种核定中...',
  '购买税控设备...',
  '税务登记完成！'
]

onMounted(() => {
  let index = 0
  const interval = setInterval(() => {
    if (index < statuses.length) {
      currentStatus.value = statuses[index]
      index++
    } else {
      clearInterval(interval)
      isComplete.value = true
      registrationStore.setTaxRegistered(true)
    }
  }, 800)
})

function handleComplete() {
  emit('complete')
}
</script>
