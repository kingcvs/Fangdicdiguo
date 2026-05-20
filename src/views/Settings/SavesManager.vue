<template>
  <div class="min-h-screen bg-game-primary p-4">
    <div class="max-w-md mx-auto">
      <!-- 返回按钮 -->
      <button @click="goBack" class="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition-all">
        <span class="text-xl">←</span>
        <span class="text-sm">返回</span>
      </button>
      
      <h1 class="text-2xl font-bold text-white mb-6">存档管理</h1>
      
      <!-- 自动存档 -->
      <div class="mb-6">
        <h2 class="text-white/70 text-sm mb-3">自动存档</h2>
        <div v-if="autoSaveSlot" class="card mb-3">
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="text-white font-semibold">{{ autoSaveSlot.name }}</div>
              <div class="text-white/50 text-sm">
                {{ formatTime(autoSaveSlot.timestamp) }}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-2 text-center text-sm mb-3">
            <div>
              <div class="text-white/50">时间</div>
              <div class="text-white font-semibold">
                {{ autoSaveSlot.gameTime.year }}年{{ autoSaveSlot.gameTime.month + 1 }}月
              </div>
            </div>
            <div>
              <div class="text-white/50">现金</div>
              <div class="text-amber-400 font-semibold">
                {{ formatMoney(autoSaveSlot.cash) }}
              </div>
            </div>
            <div>
              <div class="text-white/50">总资产</div>
              <div class="text-green-400 font-semibold">
                {{ formatMoney(autoSaveSlot.totalAssets) }}
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="loadSave(autoSaveSlot.id)" class="btn-primary btn-sm flex-1">
              加载
            </button>
            <button @click="deleteSave(autoSaveSlot.id)" class="btn-danger btn-sm flex-1">
              删除
            </button>
          </div>
        </div>
        <div v-else class="card text-center text-white/50 py-6">
          暂无自动存档
        </div>
      </div>
      
      <!-- 手动存档槽 -->
      <div>
        <h2 class="text-white/70 text-sm mb-3">存档槽</h2>
        <div class="space-y-3">
          <div v-for="i in 5" :key="i" class="card">
            <template v-if="getSlotById(`slot-${i}`)">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="text-white font-semibold">存档 {{ i }}</div>
                  <div class="text-white/50 text-sm">
                    {{ formatTime(getSlotById(`slot-${i}`)!.timestamp) }}
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center text-sm mb-3">
                <div>
                  <div class="text-white/50">时间</div>
                  <div class="text-white font-semibold">
                    {{ getSlotById(`slot-${i}`)!.gameTime.year }}年{{ getSlotById(`slot-${i}`)!.gameTime.month + 1 }}月
                  </div>
                </div>
                <div>
                  <div class="text-white/50">现金</div>
                  <div class="text-amber-400 font-semibold">
                    {{ formatMoney(getSlotById(`slot-${i}`)!.cash) }}
                  </div>
                </div>
                <div>
                  <div class="text-white/50">总资产</div>
                  <div class="text-green-400 font-semibold">
                    {{ formatMoney(getSlotById(`slot-${i}`)!.totalAssets) }}
                  </div>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="loadSave(`slot-${i}`)" class="btn-primary btn-sm flex-1">
                  加载
                </button>
                <button @click="deleteSave(`slot-${i}`)" class="btn-danger btn-sm flex-1">
                  删除
                </button>
              </div>
            </template>
            <template v-else>
              <div class="flex justify-between items-center">
                <div class="text-white/50">存档槽 {{ i }} - 空</div>
                <button v-if="isInGame" @click="saveToSlot(i)" class="btn-primary btn-sm">
                  保存
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore, type SaveSlot } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const isInGame = computed(() => gameStore.isInGame)
const saveSlots = computed(() => gameStore.saveSlots)

const autoSaveSlot = computed(() => saveSlots.value.find(s => s.id === 'auto'))

function getSlotById(id: string): SaveSlot | undefined {
  return saveSlots.value.find(s => s.id === id)
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN')
}

function formatMoney(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toFixed(0) + '元'
}

function goBack() {
  if (isInGame.value) {
    router.push('/game')
  } else {
    router.push('/')
  }
}

function loadSave(slotId: string) {
  const success = gameStore.loadSaveGame(slotId)
  if (success) {
    router.push('/game')
  } else {
    alert('加载存档失败')
  }
}

function saveToSlot(slotNum: number) {
  const success = gameStore.saveGame(`slot-${slotNum}`)
  if (success) {
    alert('保存成功')
  } else {
    alert('保存失败')
  }
}

function deleteSave(slotId: string) {
  if (confirm('确定要删除这个存档吗？')) {
    const success = gameStore.deleteSave(slotId)
    if (!success) {
      alert('删除失败')
    }
  }
}

onMounted(() => {
  gameStore.getAllSaves()
})
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-primary {
  background: rgba(249, 115, 22, 0.2);
  color: #f97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: rgba(249, 115, 22, 0.3);
  border-color: rgba(249, 115, 22, 0.5);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: rgba(239, 68, 68, 0.5);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}
</style>