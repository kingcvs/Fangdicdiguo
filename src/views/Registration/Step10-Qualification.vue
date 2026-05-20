<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <h2 class="text-xl font-bold text-white">房地产开发资质</h2>
      <p class="text-gray-400 text-sm">招聘必要人员并申请房地产开发暂定资质</p>
    </div>

    <div v-if="!isComplete" class="space-y-4">
      <div class="bg-black/30 rounded-lg p-4">
        <h4 class="text-white font-bold mb-3">核心团队组建</h4>
        
        <div class="space-y-3">
          <div 
            v-for="(role, index) in roles" 
            :key="role.title"
            class="flex items-center justify-between p-3 rounded-lg transition-all"
            :class="role.hired ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-800/50'"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                {{ role.icon }}
              </div>
              <div>
                <div class="text-white font-semibold">{{ role.name }}</div>
                <div class="text-gray-500 text-xs">{{ role.title }}</div>
              </div>
            </div>
            <div class="text-right">
              <div v-if="role.hired" class="text-green-400 text-sm">已入职 ✓</div>
              <div v-else class="text-gray-400 text-sm">{{ role.salary.toLocaleString('zh-CN') }}元/月</div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-black/30 rounded-lg p-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-400">资质申请费</span>
          <span class="text-red-400">-2,000 元</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-400">首月工资准备金</span>
          <span class="text-red-400">-{{ (3000 * 2 + 2500).toLocaleString('zh-CN') }} 元</span>
        </div>
      </div>

      <button 
        @click="startApplication"
        :disabled="isHiring"
        class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all"
      >
        {{ isHiring ? '招聘中...' : '开始招聘并申请资质' }}
      </button>

      <button @click="$emit('back')" class="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all">
        上一步
      </button>
    </div>

    <div v-else class="space-y-4">
      <div class="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-center">
        <div class="text-4xl mb-2">✅</div>
        <h3 class="text-green-400 font-bold text-lg">资质申请成功！</h3>
        <p class="text-gray-400 text-sm mt-1">获得房地产开发暂定资质</p>
      </div>

      <div class="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4">
        <h4 class="text-amber-400 font-bold mb-2">资质证书信息</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">资质等级</span>
            <span class="text-white">暂定资质</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">有效期</span>
            <span class="text-white">1年</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">可开发规模</span>
            <span class="text-white">10万平方米以下</span>
          </div>
        </div>
      </div>

      <button @click="handleComplete" class="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-all">
        下一步
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRegistrationStore } from '@/stores/registration'

const emit = defineEmits(['complete', 'back'])

const registrationStore = useRegistrationStore()

const isComplete = ref(false)
const isHiring = ref(false)

const roles = ref([
  { name: '张工程师', title: '土建工程师', salary: 3000, icon: '👷', hired: false },
  { name: '李工程师', title: '土建工程师', salary: 3000, icon: '👷', hired: false },
  { name: '王会计', title: '会计', salary: 2500, icon: '👩‍💼', hired: false }
])

function startApplication() {
  isHiring.value = true
  
  roles.value.forEach((role, index) => {
    setTimeout(() => {
      role.hired = true
    }, 500 * (index + 1))
  })

  setTimeout(() => {
    isHiring.value = false
    isComplete.value = true
    registrationStore.setQualification(true, true, true)
  }, 2000)
}

function handleComplete() {
  emit('complete')
}
</script>
