<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-xl font-bold text-white">注册资本与实缴</h2>
      <p class="text-gray-400 text-sm">设置公司的注册资本金与实缴比例</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm text-gray-300 mb-2">注册资本 (万元)</label>
        <input 
          type="range" 
          v-model.number="capitalInMillion" 
          :min="10" 
          :max="1000" 
          :step="10"
          class="w-full accent-amber-400"
          @input="updateCapital"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>10万</span>
          <span class="text-amber-400 font-bold">{{ capitalInMillion }}万</span>
          <span>1000万</span>
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-300 mb-2">实缴比例</label>
        <input 
          type="range" 
          v-model.number="paidRatio" 
          :min="20" 
          :max="100" 
          :step="5"
          class="w-full accent-amber-400"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>20%</span>
          <span class="text-amber-400 font-bold">{{ paidRatio }}%</span>
          <span>100%</span>
        </div>
      </div>

      <div class="bg-black/30 rounded-lg p-4 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">注册资本</span>
          <span class="text-white">{{ formatNumber(registeredCapital) }} 元</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">实缴资本</span>
          <span class="text-amber-400 font-bold">{{ formatNumber(paidCapital) }} 元</span>
        </div>
        <div class="border-t border-white/10 pt-2 mt-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">初始可用资金</span>
            <span class="text-green-400 font-bold">{{ formatNumber(initialCash) }} 元</span>
          </div>
        </div>
      </div>

      <p class="text-xs text-gray-500">
        * 提示：实缴资本越高，银行贷款额度越高，但初始可用资金越少
      </p>
    </div>

    <div class="flex gap-3">
      <button @click="$emit('back')" class="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
        上一步
      </button>
      <button @click="handleComplete" class="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all">
        下一步
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRegistrationStore } from '@/stores/registration'
import { fees } from '@/data/registrationData'

const emit = defineEmits(['complete', 'back'])

const registrationStore = useRegistrationStore()

const capitalInMillion = ref(50)
const paidRatio = ref(20)

const registeredCapital = computed(() => capitalInMillion.value * 10000)
const paidCapital = computed(() => Math.floor(registeredCapital.value * paidRatio.value / 100))
const initialCash = computed(() => {
  const totalFees = fees.registration + fees.seal + fees.taxEquipment
  const salaries = (fees.engineerSalary * 2 + fees.accountantSalary) * 3
  return paidCapital.value - totalFees - salaries
})

function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}

function updateCapital() {
  registrationStore.setCapitalInfo(registeredCapital.value, paidRatio.value)
}

function handleComplete() {
  registrationStore.setCapitalInfo(registeredCapital.value, paidRatio.value)
  emit('complete')
}
</script>
