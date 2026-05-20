<template>
  <div class="min-h-screen bg-game-primary p-4">
    <div class="max-w-md mx-auto">
      <!-- 返回按钮 -->
      <button @click="goBack" class="mb-4 flex items-center gap-2 text-white/70 hover:text-white transition-all">
        <span class="text-xl">←</span>
        <span class="text-sm">返回</span>
      </button>
      
      <h1 class="text-2xl font-bold text-white mb-6">设置</h1>
      
      <!-- 声音设置 -->
      <div class="mb-6">
        <h2 class="text-white/70 text-sm mb-3">声音</h2>
        <div class="card">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-white font-semibold">音乐</div>
                <div class="text-white/50 text-sm">游戏背景音乐</div>
              </div>
              <div class="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  v-model.number="settings.musicVolume" 
                  class="w-32"
                />
                <span class="text-white/70 text-sm w-10 text-right">{{ settings.musicVolume }}%</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-white font-semibold">音效</div>
                <div class="text-white/50 text-sm">游戏音效</div>
              </div>
              <div class="flex items-center gap-2">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  v-model.number="settings.sfxVolume" 
                  class="w-32"
                />
                <span class="text-white/70 text-sm w-10 text-right">{{ settings.sfxVolume }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 显示设置 -->
      <div class="mb-6">
        <h2 class="text-white/70 text-sm mb-3">显示</h2>
        <div class="card">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-white font-semibold">画质</div>
                <div class="text-white/50 text-sm">渲染质量</div>
              </div>
              <select v-model="settings.quality" class="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-white font-semibold">动画效果</div>
                <div class="text-white/50 text-sm">过渡动画</div>
              </div>
              <button 
                @click="settings.animations = !settings.animations" 
                :class="[
                  'w-12 h-6 rounded-full transition-all',
                  settings.animations ? 'bg-amber-500' : 'bg-white/30'
                ]"
              >
                <div 
                  :class="[
                    'w-5 h-5 bg-white rounded-full mt-0.5 transition-all',
                    settings.animations ? 'ml-6' : 'ml-0.5'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 游戏设置 -->
      <div class="mb-6">
        <h2 class="text-white/70 text-sm mb-3">游戏</h2>
        <div class="card">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-white font-semibold">自动保存</div>
                <div class="text-white/50 text-sm">定期自动保存游戏</div>
              </div>
              <button 
                @click="settings.autoSave = !settings.autoSave" 
                :class="[
                  'w-12 h-6 rounded-full transition-all',
                  settings.autoSave ? 'bg-amber-500' : 'bg-white/30'
                ]"
              >
                <div 
                  :class="[
                    'w-5 h-5 bg-white rounded-full mt-0.5 transition-all',
                    settings.autoSave ? 'ml-6' : 'ml-0.5'
                  ]"
                />
              </button>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-white font-semibold">保存间隔</div>
                <div class="text-white/50 text-sm">自动保存时间间隔</div>
              </div>
              <select v-model="settings.saveInterval" class="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                <option :value="1">1分钟</option>
                <option :value="5">5分钟</option>
                <option :value="10">10分钟</option>
                <option :value="30">30分钟</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 数据管理 -->
      <div class="mb-6">
        <h2 class="text-white/70 text-sm mb-3">数据管理</h2>
        <div class="card">
          <div class="space-y-3">
            <button @click="resetSettings" class="btn-secondary w-full">
              重置设置
            </button>
            <button @click="clearAllData" class="btn-danger w-full">
              清除所有数据
            </button>
          </div>
        </div>
      </div>
      
      <!-- 关于 -->
      <div class="mb-6">
        <h2 class="text-white/70 text-sm mb-3">关于</h2>
        <div class="card text-center">
          <div class="text-4xl mb-4">🏗️</div>
          <div class="text-white font-bold text-lg mb-1">房地产帝国</div>
          <div class="text-white/50 text-sm mb-3">v3.0.0</div>
          <div class="text-white/50 text-xs">
            真实还原中国房地产开发流程
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'

interface AppSettings {
  musicVolume: number
  sfxVolume: number
  quality: 'low' | 'medium' | 'high'
  animations: boolean
  autoSave: boolean
  saveInterval: number
}

const router = useRouter()
const SETTINGS_KEY = 'real-estate-settings'

const defaultSettings: AppSettings = {
  musicVolume: 50,
  sfxVolume: 50,
  quality: 'medium',
  animations: true,
  autoSave: true,
  saveInterval: 5
}

const settings = ref<AppSettings>({ ...defaultSettings })

let autoSaveTimer: any = null

function goBack() {
  router.push('/')
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      settings.value = { ...defaultSettings, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Failed to load settings:', e)
  }
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
  } catch (e) {
    console.error('Failed to save settings:', e)
  }
}

function resetSettings() {
  if (confirm('确定要重置所有设置吗？')) {
    settings.value = { ...defaultSettings }
    saveSettings()
  }
}

function clearAllData() {
  if (confirm('确定要清除所有游戏数据吗？这将删除所有存档和设置！')) {
    // 清除所有存档
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('real-estate')) {
        localStorage.removeItem(key)
      }
    }
    alert('数据已清除')
    router.push('/')
  }
}

function startAutoSaveTimer() {
  if (settings.value.autoSave) {
    autoSaveTimer = setInterval(() => {
      // 这里触发自动保存，由主游戏处理
      console.log('Auto save triggered')
    }, settings.value.saveInterval * 60 * 1000)
  }
}

function stopAutoSaveTimer() {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer)
    autoSaveTimer = null
  }
}

// 监听设置变化
watch(settings, () => {
  saveSettings()
  if (settings.value.autoSave) {
    stopAutoSaveTimer()
    startAutoSaveTimer()
  } else {
    stopAutoSaveTimer()
  }
}, { deep: true })

onMounted(() => {
  loadSettings()
  startAutoSaveTimer()
})

onUnmounted(() => {
  stopAutoSaveTimer()
})
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.3);
}
</style>