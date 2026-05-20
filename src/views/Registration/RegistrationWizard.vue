<template>
  <div class="min-h-screen bg-game-primary p-4">
    <div class="max-w-lg mx-auto">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-white mb-2">公司注册流程</h1>
        <p class="text-amber-400 font-semibold">{{ currentStepInfo.title }}</p>
      </div>

      <div class="flex justify-center mb-6 overflow-x-auto">
        <div class="flex items-center gap-2">
          <div v-for="step in steps" :key="step.step" class="flex items-center">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
              :class="[
                step.step < currentStep ? 'bg-amber-400 text-black' : 
                step.step === currentStep ? 'bg-amber-500 text-black scale-110' : 
                'bg-gray-700 text-gray-400'
              ]"
            >
              {{ step.step }}
            </div>
            <div v-if="step.step < steps.length" class="w-4 h-0.5 bg-gray-600"></div>
          </div>
        </div>
      </div>

      <div class="bg-game-card/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <Step1Province v-if="currentStep === 1" @complete="nextStep" />
        <Step2Name v-else-if="currentStep === 2" @complete="nextStep" @back="prevStep" />
        <Step3Type v-else-if="currentStep === 3" @complete="nextStep" @back="prevStep" />
        <Step4Equity v-else-if="currentStep === 4" @complete="nextStep" @back="prevStep" />
        <Step5Capital v-else-if="currentStep === 5" @complete="nextStep" @back="prevStep" />
        <Step6Registration v-else-if="currentStep === 6" @complete="nextStep" @back="prevStep" />
        <Step7Seals v-else-if="currentStep === 7" @complete="nextStep" @back="prevStep" />
        <Step8Bank v-else-if="currentStep === 8" @complete="nextStep" @back="prevStep" />
        <Step9Tax v-else-if="currentStep === 9" @complete="nextStep" @back="prevStep" />
        <Step10Qualification v-else-if="currentStep === 10" @complete="nextStep" @back="prevStep" />
        <Step11Complete v-else-if="currentStep === 11" @start-game="startGame" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRegistrationStore } from '@/stores/registration'
import Step1Province from './Step1-Province.vue'
import Step2Name from './Step2-Name.vue'
import Step3Type from './Step3-Type.vue'
import Step4Equity from './Step4-Equity.vue'
import Step5Capital from './Step5-Capital.vue'
import Step6Registration from './Step6-Registration.vue'
import Step7Seals from './Step7-Seals.vue'
import Step8Bank from './Step8-Bank.vue'
import Step9Tax from './Step9-Tax.vue'
import Step10Qualification from './Step10-Qualification.vue'
import Step11Complete from './Step11-Complete.vue'

const router = useRouter()
const route = useRoute()
const registrationStore = useRegistrationStore()

const currentStep = ref(parseInt(route.params.step as string) || 1)

const steps = [
  { step: 1, title: '选择注册地区', icon: '📍' },
  { step: 2, title: '公司核名', icon: '✏️' },
  { step: 3, title: '选择企业性质', icon: '🏢' },
  { step: 4, title: '设置股权架构', icon: '👥' },
  { step: 5, title: '注册资本与实缴', icon: '💰' },
  { step: 6, title: '工商注册登记', icon: '📋' },
  { step: 7, title: '刻章', icon: '🔏' },
  { step: 8, title: '银行开户', icon: '🏦' },
  { step: 9, title: '税务登记', icon: '📝' },
  { step: 10, title: '房地产开发资质', icon: '📜' },
  { step: 11, title: '公司成立', icon: '🎉' }
]

const currentStepInfo = computed(() => steps.find(s => s.step === currentStep.value) || steps[0])

onMounted(() => {
  registrationStore.setStep(currentStep.value)
})

function nextStep() {
  if (currentStep.value < 11) {
    currentStep.value++
    registrationStore.setStep(currentStep.value)
    router.push(`/registration/${currentStep.value}`)
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    registrationStore.setStep(currentStep.value)
    router.push(`/registration/${currentStep.value}`)
  }
}

function startGame() {
  router.push('/game')
}
</script>
