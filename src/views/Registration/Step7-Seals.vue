<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-xl font-bold text-white">刻章</h2>
      <p class="text-gray-400 text-sm">选择需要刻制的印章</p>
    </div>

    <div class="space-y-3">
      <div 
        v-for="seal in sealTypes" 
        :key="seal.id"
        class="bg-black/30 rounded-lg p-4 cursor-pointer transition-all hover:bg-black/50"
        :class="{ 'border-2 border-amber-400': selectedSeals[seal.id] }"
        @click="toggleSeal(seal.id, seal.required)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-xl">
              🔏
            </div>
            <div>
              <h4 class="text-white font-semibold">
                {{ seal.name }}
                <span v-if="seal.required" class="text-xs bg-red-500/30 text-red-400 px-2 py-0.5 rounded ml-2">必选</span>
              </h4>
              <p class="text-gray-500 text-xs">{{ seal.description }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-amber-400 font-bold">+{{ seal.cost }}元</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-black/30 rounded-lg p-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-400">刻章费用</span>
        <span class="text-red-400">-{{ totalCost.toLocaleString('zh-CN') }} 元</span>
      </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRegistrationStore } from '@/stores/registration'

const emit = defineEmits(['complete', 'back'])

const registrationStore = useRegistrationStore()

const sealTypes = [
  { id: 'official', name: '公章', required: true, cost: 80, description: '公司最高权力象征' },
  { id: 'finance', name: '财务章', required: true, cost: 80, description: '财务相关文件使用' },
  { id: 'legal', name: '法人章', required: true, cost: 60, description: '法定代表人签章' },
  { id: 'invoice', name: '发票章', required: true, cost: 80, description: '发票开具使用' },
  { id: 'contract', name: '合同章', required: false, cost: 100, description: '合同签署专用' },
  { id: 'business', name: '业务章', required: false, cost: 100, description: '日常业务单据使用' }
]

const selectedSeals = ref({ ...registrationStore.data.seals })

const totalCost = computed(() => {
  return sealTypes.reduce((sum, seal) => {
    return sum + (selectedSeals.value[seal.id as keyof typeof selectedSeals.value] ? seal.cost : 0)
  }, 0)
})

onMounted(() => {
  selectedSeals.value = { ...registrationStore.data.seals }
})

function toggleSeal(id: string, required: boolean) {
  if (required) return
  selectedSeals.value[id as keyof typeof selectedSeals.value] = !selectedSeals.value[id as keyof typeof selectedSeals.value]
}

function handleComplete() {
  registrationStore.setSeals(selectedSeals.value)
  emit('complete')
}
</script>
