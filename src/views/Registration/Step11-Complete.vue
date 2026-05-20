<template>
  <div class="space-y-6">
    <div class="text-center py-4">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-2xl font-bold text-white mb-2">恭喜！公司成立了！</h2>
      <p class="text-amber-400 text-lg">{{ registrationStore.data.fullCompanyName }}</p>
    </div>

    <div class="bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-500/30 rounded-lg p-5">
      <h3 class="text-amber-400 font-bold mb-4 text-center">公司信息汇总</h3>
      
      <div class="space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">注册地区</span>
          <span class="text-white">{{ registrationStore.data.provinceName }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">企业性质</span>
          <span class="text-white">{{ enterpriseTypeName }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">统一社会信用代码</span>
          <span class="text-amber-400 font-mono text-xs">{{ registrationStore.data.creditCode }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">注册资本</span>
          <span class="text-white">{{ (registrationStore.data.registeredCapital / 10000).toFixed(0) }}万元</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">实缴资本</span>
          <span class="text-white">{{ (registrationStore.paidCapital / 10000).toFixed(0) }}万元</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">开户银行</span>
          <span class="text-white">{{ selectedBankName }}</span>
        </div>
      </div>
    </div>

    <div class="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
      <div class="flex justify-between">
        <span class="text-gray-400">初始可用资金</span>
        <span class="text-green-400 font-bold text-xl">{{ formatNumber(registrationStore.initialCash) }} 元</span>
      </div>
    </div>

    <div class="bg-black/30 rounded-lg p-4">
      <h4 class="text-white font-bold mb-2">下一步做什么？</h4>
      <ul class="text-gray-400 text-sm space-y-1">
        <li>• 查看土地市场，寻找合适的地块</li>
        <li>• 关注市场动态，把握开发时机</li>
        <li>• 管理好现金流，稳健发展</li>
      </ul>
    </div>

    <button @click="$emit('start-game')" class="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold text-lg rounded-xl transition-all transform hover:scale-[1.02]">
      开始您的房地产帝国之旅！
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRegistrationStore } from '@/stores/registration'
import { banks, enterpriseTypes } from '@/data/registrationData'

const emit = defineEmits(['start-game'])

const registrationStore = useRegistrationStore()

const enterpriseTypeName = computed(() => {
  const type = enterpriseTypes.find(t => t.id === registrationStore.data.enterpriseType)
  return type?.name || '未知'
})

const selectedBankName = computed(() => {
  const bank = banks.find(b => b.id === registrationStore.data.selectedBank)
  return bank?.name || '未知银行'
})

function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}
</script>
