<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-xl font-bold text-white">银行开户</h2>
      <p class="text-gray-400 text-sm">选择一家银行开立公司基本账户</p>
    </div>

    <div class="space-y-3">
      <div 
        v-for="bank in banks" 
        :key="bank.id"
        class="bg-black/30 rounded-lg p-4 cursor-pointer transition-all hover:bg-black/50"
        :class="{ 'border-2 border-amber-400': selectedBank === bank.id }"
        @click="selectedBank = bank.id"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
              🏦
            </div>
            <div>
              <h4 class="text-white font-semibold">{{ bank.name }}</h4>
              <p class="text-gray-500 text-xs">{{ bank.description }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-amber-400 font-bold">{{ bank.rate >= 0 ? '+' : '' }}{{ bank.rate }}%</div>
            <div class="text-gray-500 text-xs">开发贷利率</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-black/30 rounded-lg p-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-400">银行开户费</span>
        <span class="text-red-400">-200 元</span>
      </div>
    </div>

    <div class="flex gap-3">
      <button @click="$emit('back')" class="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
        上一步
      </button>
      <button 
        @click="handleComplete" 
        :disabled="!selectedBank"
        class="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all"
      >
        下一步
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRegistrationStore } from '@/stores/registration'
import { banks } from '@/data/registrationData'

const emit = defineEmits(['complete', 'back'])

const registrationStore = useRegistrationStore()

const selectedBank = ref<string | null>(registrationStore.data.selectedBank)

onMounted(() => {
  selectedBank.value = registrationStore.data.selectedBank
})

function handleComplete() {
  if (selectedBank.value) {
    registrationStore.setBank(selectedBank.value)
    emit('complete')
  }
}
</script>
