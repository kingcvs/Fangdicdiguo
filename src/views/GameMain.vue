<template>
  <div class="min-h-screen bg-game-primary flex flex-col">
    <!-- 顶部状态栏 -->
    <div class="bg-game-card/90 border-b border-white/10 p-4">
      <div class="max-w-md mx-auto">
        <!-- 日期和时间控制 -->
        <div class="flex justify-between items-center mb-3">
          <div class="text-white/70 text-sm">{{ gameTime }}</div>
          <div class="flex items-center gap-2">
            <button
              class="px-2 py-1 rounded text-xs font-medium transition-all"
              :class="timePaused ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'"
              @click="handleTogglePause"
            >
              {{ timePaused ? '▶ 继续' : '⏸ 暂停' }}
            </button>
            <span class="text-white/50 text-xs">速度:</span>
            <button
              v-for="speed in [1, 2, 3]"
              :key="speed"
              class="px-2 py-1 rounded text-xs font-medium transition-all"
              :class="timeSpeed === speed && !timePaused ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'"
              @click="setTimeSpeed(speed)"
            >
              {{ speed }}X
            </button>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-2 text-center">
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">现金</div>
            <div class="text-amber-400 font-bold text-sm">{{ formatMoney(cash || 0) }}</div>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">总资产</div>
            <div class="text-green-400 font-bold text-sm">{{ formatMoney(totalAssets || 0) }}</div>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">资质</div>
            <div class="text-blue-400 font-bold text-sm">{{ qualificationLevel }}</div>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">信用</div>
            <div class="text-purple-400 font-bold text-sm">{{ company?.creditRating || 'C' }}</div>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">研究点</div>
            <div class="text-cyan-400 font-bold text-sm">{{ totalResearchPoints }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-y-auto pb-32">
      <div class="max-w-md mx-auto p-4">
        <!-- 总览页面 -->
        <div v-if="activeTab === 'overview'">
          <div class="section-title">🏢 企业信息</div>
          <div class="card mb-4">
            <div class="text-center mb-4">
              <div class="text-2xl font-bold text-game-accent">{{ company?.name }}</div>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-3 text-center">
              <div>
                <div class="text-white/50 text-xs">企业性质</div>
                <div class="font-semibold">{{ enterpriseTypeText }}</div>
              </div>
              <div>
                <div class="text-white/50 text-xs">注册资本</div>
                <div class="font-semibold">{{ formatMoney(company?.registeredCapital || 0) }}</div>
              </div>
              <div>
                <div class="text-white/50 text-xs">成立日期</div>
                <div class="font-semibold">{{ company?.establishmentDate || '-' }}</div>
              </div>
              <div>
                <div class="text-white/50 text-xs">注册地区</div>
                <div class="font-semibold">{{ company?.registrationProvince || '-' }}</div>
              </div>
            </div>
          </div>

          <div class="section-title">💰 财务状况</div>
          <div class="grid grid-cols-3 gap-3 mb-4">
            <div class="card">
              <div class="text-white/50 text-xs">现金</div>
              <div class="text-xl font-bold text-amber-400">{{ formatMoney(cash) }}</div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">总资产</div>
              <div class="text-xl font-bold text-green-400">{{ formatMoney(totalAssets) }}</div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">研究点</div>
              <div class="text-xl font-bold text-cyan-400">{{ totalResearchPoints }}</div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">总负债</div>
              <div class="text-xl font-bold text-red-400">{{ formatMoney(company?.totalLiabilities || 0) }}</div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">月利润</div>
              <div class="text-xl font-bold" :class="(company?.monthlyProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ formatMoney(company?.monthlyProfit || 0) }}
              </div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">负债率</div>
              <div class="text-xl font-bold" :class="parseFloat(debtRatio) > 70 ? 'text-red-400' : 'text-green-400'">
                {{ debtRatio }}%
              </div>
            </div>
          </div>

          <div class="section-title">📊 项目概览</div>
          <div class="card mb-4">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div>
                <div class="text-2xl font-bold text-blue-400">{{ projects.length }}</div>
                <div class="text-white/50 text-xs">在建项目</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-400">{{ landReserves.length }}</div>
                <div class="text-white/50 text-xs">土地储备</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-amber-400">{{ company?.employees?.length || 0 }}</div>
                <div class="text-white/50 text-xs">员工数量</div>
              </div>
            </div>
          </div>

          <!-- 资质升级进度 -->
          <div class="card mb-4">
            <div class="flex justify-between items-center mb-3">
              <div class="font-semibold text-white">🏆 资质升级进度</div>
              <div class="text-xs" :class="qualificationProgress?.canUpgrade ? 'text-green-400' : 'text-white/50'">
                {{ qualificationLevel }} → {{ nextQualificationLevel }}
              </div>
            </div>
            <div class="space-y-2">
              <div v-for="(req, key) in qualificationProgress?.requirements" :key="key" class="flex justify-between items-center text-sm">
                <span class="text-white/70">{{ getQualificationLabel(key as string) }}</span>
                <span class="text-white">{{ formatQualificationValue(key as string, req.current) }} / {{ formatQualificationValue(key as string, req.required) }}</span>
              </div>
            </div>
            <div v-if="qualificationProgress?.canUpgrade" class="mt-3">
              <button class="btn-primary btn-full bg-green-600 hover:bg-green-500" @click="handleQualificationUpgrade">
                申请资质升级
              </button>
            </div>
          </div>

          <div class="section-title">📈 宏观经济</div>
          <div class="card mb-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <div class="text-white/50 text-xs">GDP增速</div>
                <div class="font-semibold">{{ macroEconomy.gdpGrowthRate }}%</div>
              </div>
              <div>
                <div class="text-white/50 text-xs">利率</div>
                <div class="font-semibold">{{ macroEconomy.interestRate }}%</div>
              </div>
              <div>
                <div class="text-white/50 text-xs">房价指数</div>
                <div class="font-semibold">{{ macroEconomy.housingPriceIndex.toFixed(1) }}</div>
              </div>
              <div>
                <div class="text-white/50 text-xs">城镇化率</div>
                <div class="font-semibold">{{ macroEconomy.urbanizationRate }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 投资系统页面 -->
        <div v-else-if="activeTab === 'investment'">
          <div class="grid grid-cols-3 gap-2 mb-4">
            <button
              v-for="(tab, idx) in investmentTabs.slice(0, 3)"
              :key="idx"
              class="btn-primary text-sm py-2"
              :class="activeInvestmentTab === idx ? 'bg-amber-500' : ''"
              @click="activeInvestmentTab = idx"
            >
              {{ tab }}
            </button>
          </div>
          <div class="grid grid-cols-3 gap-2 mb-4">
            <button
              v-for="(tab, idx) in investmentTabs.slice(3, 6)"
              :key="idx + 3"
              class="btn-primary text-sm py-2"
              :class="activeInvestmentTab === (idx + 3) ? 'bg-amber-500' : ''"
              @click="activeInvestmentTab = (idx + 3)"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 城市研究 -->
          <div v-if="activeInvestmentTab === 0">
            <div v-if="!selectedCity">
              <div class="section-title">🏙 城市研究</div>
              <div class="card mb-4">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="text-white/50 text-xs">可用研究点</div>
                    <div class="text-xl font-bold text-cyan-400">{{ researchPoints }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-white/50 text-xs">已研究城市</div>
                    <div class="text-xl font-bold text-green-400">{{ researchedCitiesCount }}/{{ allCities.length }}</div>
                  </div>
                </div>
              </div>
              <div v-for="city in allCities" :key="city.id" class="module-btn mb-3 cursor-pointer" @click="selectCity(city.id)">
                <div class="module-btn__left">
                  <div class="module-btn__icon">🏙️</div>
                  <div class="module-btn__content">
                    <div class="module-btn__title">{{ city.name }}</div>
                    <div class="module-btn__subtitle">{{ city.description }}</div>
                  </div>
                </div>
                <div class="module-btn__right">
                  <div class="text-right">
                    <div class="module-btn__badge">{{ formatMoney(getCityAvgPrice(city.id)) }}</div>
                    <div class="text-xs text-green-400 mt-1" v-if="getCityPriceBoost(city.id) > 0">
                      +{{ getCityPriceBoost(city.id) }}% 加成
                    </div>
                  </div>
                  <div>
                    <div class="module-btn__progress">
                      <div class="module-btn__progress-fill" :style="{ width: getCityResearchProgress(city.id) + '%' }"></div>
                    </div>
                    <div class="module-btn__progress-text">
                      {{ getCityResearchStatus(city.id) }}
                    </div>
                  </div>
                  <div class="module-btn__arrow">→</div>
                </div>
              </div>
            </div>

            <div v-else>
              <button class="btn-primary mb-4 text-sm" @click="selectedCity = null">
                ← 返回城市列表
              </button>
              
              <div class="card mb-4">
                <div class="text-center mb-4">
                  <div class="text-3xl mb-2">🏙️</div>
                  <div class="text-2xl font-bold text-game-accent">{{ currentCity?.name }}</div>
                  <div class="text-white/50 text-sm">{{ currentCity?.description }}</div>
                </div>
                <div class="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div class="text-white/50 text-xs">基准房价</div>
                    <div class="font-bold text-amber-400">{{ formatMoney(currentCity?.avgPrice || 0) }}</div>
                  </div>
                  <div>
                    <div class="text-white/50 text-xs">研究加成</div>
                    <div class="font-bold text-green-400">+{{ getCityPriceBoost(selectedCity) }}%</div>
                  </div>
                  <div>
                    <div class="text-white/50 text-xs">有效房价</div>
                    <div class="font-bold text-blue-400">{{ formatMoney(getEffectiveCityPrice(selectedCity)) }}</div>
                  </div>
                </div>
                <div class="mt-4 pt-4 border-t border-white/10">
                  <div class="flex flex-wrap gap-2">
                    <span v-for="tag in currentCity?.tags" :key="tag" class="px-2 py-1 bg-white/10 rounded-full text-xs">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <div v-if="getCityResearch(selectedCity)?.inProgressProject" class="card mb-4 border-cyan-500/30">
                <div class="card-title flex items-center gap-2">
                  <span class="animate-pulse">🔬</span>
                  研究进行中
                </div>
                <div class="mt-3">
                  <div class="flex justify-between mb-2">
                    <span>{{ getInProgressProjectName(selectedCity) }}</span>
                    <span class="text-cyan-400">{{ Math.round(getCityResearch(selectedCity)?.progress || 0) }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: (getCityResearch(selectedCity)?.progress || 0) + '%', background: 'linear-gradient(90deg, #06b6d4, #22d3ee)' }"></div>
                  </div>
                </div>
              </div>

              <div class="section-title">📋 可研究项目</div>
              <div v-if="getAvailableResearchProjects(selectedCity).length === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
                暂无可研究项目
              </div>
              <div v-for="project in getAvailableResearchProjects(selectedCity)" :key="project.id" class="card mb-3">
                <div class="flex items-start gap-3">
                  <div class="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {{ project.icon }}
                  </div>
                  <div class="flex-1">
                    <div class="font-semibold">{{ project.name }}</div>
                    <div class="text-white/50 text-sm mt-1">{{ project.description }}</div>
                    <div class="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div>
                        <span class="text-white/50">费用:</span>
                        <span class="text-amber-400">{{ formatMoney(project.cost) }}</span>
                      </div>
                      <div>
                        <span class="text-white/50">研究点:</span>
                        <span class="text-cyan-400">{{ project.researchPoints }}</span>
                      </div>
                      <div>
                        <span class="text-white/50">周期:</span>
                        <span>{{ project.duration }}月</span>
                      </div>
                    </div>
                    <div class="mt-2 text-sm text-green-400">
                      💰 售价加成: +{{ project.priceBoost }}%
                    </div>
                    <button 
                      class="btn-primary btn-full mt-3 text-sm"
                      :class="{ 'opacity-50 cursor-not-allowed': !canStartResearch(selectedCity, project.id) }"
                      @click="handleStartResearch(selectedCity, project.id)"
                    >
                      开始研究
                    </button>
                  </div>
                </div>
              </div>

              <div class="section-title">✅ 已完成研究</div>
              <div v-if="getCompletedResearchProjects(selectedCity).length === 0" class="card" style="text-align: center; color: #64748b; padding: 30px;">
                暂无已完成研究
              </div>
              <div v-for="project in getCompletedResearchProjects(selectedCity)" :key="project.id" class="card mb-2 opacity-70">
                <div class="flex items-center gap-3">
                  <div class="text-2xl">{{ project.icon }}</div>
                  <div class="flex-1">
                    <div class="font-semibold">{{ project.name }}</div>
                    <div class="text-green-400 text-sm">+{{ project.priceBoost }}% 售价加成</div>
                  </div>
                  <div class="text-green-400 text-xl">✓</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 土地市场 -->
          <div v-else-if="activeInvestmentTab === 1">
            <div class="section-title">📍 土地市场</div>

            <!-- 市场状态栏 -->
            <div class="card mb-4">
              <div class="flex justify-between items-center text-sm">
                <div>
                  <span class="text-white/50">您的资质:</span>
                  <span class="text-blue-400 font-semibold ml-1">{{ qualificationLevel }}</span>
                  <span class="text-white/30 mx-1">|</span>
                  <span class="text-purple-400 font-semibold">{{ company?.creditRating || 'C' }}</span>
                </div>
                <div class="text-amber-400">
                  可开发面积: <span class="font-semibold">{{ formatLandArea(maxLandArea) }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center text-sm mt-2">
                <div class="text-white/50">
                  下次刷新: <span class="text-amber-400">{{ daysToNextRefresh }}天后</span>
                </div>
                <button class="btn-primary text-xs px-3 py-1" @click="handleRefreshMarket">
                  立即刷新
                </button>
              </div>
            </div>

            <!-- 土地列表 -->
            <div v-if="marketLands.length === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无可购买土地
            </div>
            <div v-else>
              <div v-for="land in marketLands" :key="land.id" class="card mb-3">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="font-semibold text-white">{{ land.city }} - {{ land.district }}</div>
                    <div class="text-xs text-white/50 mt-1">
                      <span class="bg-white/10 px-2 py-0.5 rounded">{{ land.landUse }}</span>
                      <span class="ml-2">容积率 {{ land.floorAreaRatio }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-amber-400">{{ formatMoney(land.currentPrice) }}</div>
                    <div class="text-xs text-white/50">当前价格</div>
                  </div>
                </div>

                <!-- 土地标签 -->
                <div class="flex flex-wrap gap-1 mb-3">
                  <span v-for="tag in land.tags" :key="tag" class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                    {{ tag }}
                  </span>
                </div>

                <!-- 土地信息 -->
                <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div class="flex justify-between">
                    <span class="text-white/50">占地面积</span>
                    <span class="text-white">{{ formatArea(land.area) }}㎡</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">可建面积</span>
                    <span class="text-green-400">{{ formatArea(land.area * land.floorAreaRatio) }}㎡</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">楼面地价</span>
                    <span class="text-white">{{ formatMoney(land.pricePerSquare) }}/㎡</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">土地年限</span>
                    <span class="text-white">{{ land.useYears }}年</span>
                  </div>
                </div>

                <!-- 资质限制提示 -->
                <div v-if="land.area > maxLandArea" class="text-xs text-red-400 mb-2 bg-red-500/10 p-2 rounded">
                  ⚠️ 该土地面积超出您的资质限制（最大{{ formatLandArea(maxLandArea) }}），无法购买
                </div>

                <!-- 操作按钮 -->
                <button
                  class="btn-primary btn-full"
                  :disabled="land.area > maxLandArea || cash < land.currentPrice"
                  :class="{ 'opacity-50 cursor-not-allowed': land.area > maxLandArea || cash < land.currentPrice }"
                  @click="handlePurchaseLand(land)"
                >
                  <span v-if="land.area > maxLandArea">资质不符</span>
                  <span v-else-if="cash < land.currentPrice">资金不足</span>
                  <span v-else>购买土地</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 土地储备 -->
          <div v-else-if="activeInvestmentTab === 2">
            <div class="section-title">🏗 土地储备</div>
            <div v-if="landReserves.length === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无土地储备
            </div>
            <div v-else>
              <!-- 土地列表 -->
              <div v-for="land in landReserves" :key="land.id" class="card mb-3">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="font-semibold text-white">{{ land.city }} - {{ land.district }}</div>
                    <div class="text-xs text-white/50 mt-1">
                      <span class="bg-white/10 px-2 py-0.5 rounded">{{ land.landUse }}</span>
                      <span class="ml-2">容积率 {{ land.floorAreaRatio }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-amber-400">{{ formatMoney(land.currentValue) }}</div>
                    <div class="text-xs text-white/50">当前价值</div>
                  </div>
                </div>

                <!-- 土地信息 -->
                <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div class="flex justify-between">
                    <span class="text-white/50">占地面积</span>
                    <span class="text-white">{{ formatArea(land.area) }}㎡</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">可建面积</span>
                    <span class="text-green-400">{{ formatArea(land.area * land.floorAreaRatio) }}㎡</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">获取价格</span>
                    <span class="text-white">{{ formatMoney(land.acquisitionPrice) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/50">土地状态</span>
                    <span :class="land.status === 'pending' ? 'text-blue-400' : land.status === 'developing' ? 'text-amber-400' : 'text-green-400'">
                      {{ land.status === 'pending' ? '待开发' : land.status === 'developing' ? '开发中' : '已完成' }}
                    </span>
                  </div>
                </div>

                <!-- 土地标签 -->
                <div class="flex flex-wrap gap-1 mb-3">
                  <span v-for="tag in land.tags" :key="tag" class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                    {{ tag }}
                  </span>
                </div>

                <!-- 开发规划（仅待开发土地显示） -->
                <div v-if="land.status === 'pending'">
                  <button 
                    v-if="!selectedLandForDevelopment || selectedLandForDevelopment !== land.id"
                    class="btn-primary btn-full"
                    @click="startDevelopmentPlanning(land)"
                  >
                    📋 制定开发规划
                  </button>

                  <!-- 开发规划面板 -->
                  <div v-if="selectedLandForDevelopment === land.id" class="mt-4 pt-4 border-t border-white/10">
                    <div class="text-sm font-semibold mb-3">开发规划设置</div>

                    <!-- 项目类型选择 -->
                    <div class="mb-3">
                      <div class="text-xs text-white/50 mb-2">项目类型</div>
                      <div class="grid grid-cols-2 gap-2">
                        <button 
                          v-for="type in getValidProjectTypes(land.landUse)" 
                          :key="type"
                          class="btn-primary text-sm py-2"
                          :class="developmentForm.projectType === type ? 'bg-amber-500' : ''"
                          @click="selectProjectType(type)"
                        >
                          {{ type }}
                        </button>
                      </div>
                    </div>

                    <!-- 开发品味选择 -->
                    <div class="mb-3">
                      <div class="text-xs text-white/50 mb-2">开发品味</div>
                      <div class="grid grid-cols-3 gap-2">
                        <button 
                          v-for="level in ['高端', '中端', '低端']" 
                          :key="level"
                          class="btn-primary text-sm py-2"
                          :class="developmentForm.qualityLevel === level ? 'bg-amber-500' : ''"
                          @click="selectQualityLevel(level)"
                        >
                          {{ level }}
                        </button>
                      </div>
                      <div class="text-xs text-white/50 mt-2">
                        {{ getQualityDescription(developmentForm.qualityLevel) }}
                      </div>
                    </div>

                    <!-- 项目名称 -->
                    <div class="mb-3">
                      <div class="text-xs text-white/50 mb-2">项目名称</div>
                      <input 
                        type="text" 
                        class="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                        placeholder="输入项目名称"
                        v-model="developmentForm.projectName"
                      >
                    </div>

                    <!-- 成本收益预估 -->
                    <div class="bg-white/5 rounded-lg p-3 mb-3">
                      <div class="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div class="text-white/50 text-xs">预估成本</div>
                          <div class="text-lg font-bold text-red-400">{{ formatMoney(developmentPreview.cost) }}</div>
                        </div>
                        <div>
                          <div class="text-white/50 text-xs">预估收益</div>
                          <div class="text-lg font-bold text-green-400">{{ formatMoney(developmentPreview.revenue) }}</div>
                        </div>
                        <div>
                          <div class="text-white/50 text-xs">建设周期</div>
                          <div class="font-semibold">{{ developmentPreview.period }}月</div>
                        </div>
                        <div>
                          <div class="text-white/50 text-xs">预估利润率</div>
                          <div class="font-semibold" :class="developmentPreview.profitRate > 20 ? 'text-green-400' : 'text-amber-400'">
                            {{ developmentPreview.profitRate.toFixed(1) }}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="flex gap-2">
                      <button class="btn-primary flex-1" @click="cancelDevelopmentPlanning">
                        取消
                      </button>
                      <button 
                        class="btn-primary flex-1 bg-green-600 hover:bg-green-500"
                        :class="{ 'opacity-50 cursor-not-allowed': !canConfirmDevelopment(land) }"
                        @click="confirmDevelopmentPlan(land)"
                      >
                        确认开发
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 已开发状态 -->
                <div v-else-if="land.status === 'developing'" class="text-xs text-amber-400">
                  🏗️ 正在开发中，请前往工程页面查看进度
                </div>
              </div>
            </div>
          </div>

          <!-- 市场趋势 -->
          <div v-else-if="activeInvestmentTab === 3">
            <div class="section-title">📈 市场趋势</div>
            <div class="card mb-3">
              <div class="card-title">宏观经济指数</div>
              <div class="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div>
                  <div class="text-white/50 text-xs">GDP增速</div>
                  <div class="font-semibold text-green-400">{{ macroEconomy.gdpGrowthRate.toFixed(1) }}%</div>
                </div>
                <div>
                  <div class="text-white/50 text-xs">基准利率</div>
                  <div class="font-semibold text-amber-400">{{ (macroEconomy.interestRate * 100).toFixed(2) }}%</div>
                </div>
                <div>
                  <div class="text-white/50 text-xs">房价指数</div>
                  <div class="font-semibold text-blue-400">{{ macroEconomy.housingPriceIndex.toFixed(2) }}</div>
                </div>
                <div>
                  <div class="text-white/50 text-xs">城镇化率</div>
                  <div class="font-semibold text-purple-400">{{ macroEconomy.urbanizationRate.toFixed(1) }}%</div>
                </div>
              </div>
            </div>

            <div class="card mb-3">
              <div class="card-title">房地产市场指数</div>
              <div class="mt-4">
                <div class="flex justify-between mb-2">
                  <span>房价指数</span>
                  <span class="text-green-400 font-semibold">{{ housingPriceIndex.toFixed(1) }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (housingPriceIndex * 70) + '%' }"></div>
                </div>
              </div>
              <div class="mt-4">
                <div class="flex justify-between mb-2">
                  <span>市场需求</span>
                  <span class="text-blue-400 font-semibold">{{ marketDemand.toFixed(0) }}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: marketDemand + '%', background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' }"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-title">经济周期</div>
              <div class="card-subtitle" style="margin-top: 8px;">当前处于: {{ economicCycle }}</div>
            </div>
          </div>

          <!-- 竞争对手 -->
          <div v-else-if="activeInvestmentTab === 4">
            <div class="section-title">🏢 竞争对手</div>
            <div v-for="(comp, idx) in competitors" :key="idx" class="module-btn mb-3 cursor-pointer" @click="showToast('查看' + comp.name + '详情')">
              <div class="module-btn__left">
                <div class="module-btn__icon">🏢</div>
                <div class="module-btn__content">
                  <div class="module-btn__title">{{ comp.name }}</div>
                  <div class="module-btn__subtitle">行业排名 #{{ idx + 1 }}</div>
                </div>
              </div>
              <div class="module-btn__right">
                <div class="module-btn__badge">{{ comp.stars }}星</div>
                <div>
                  <div class="module-btn__progress">
                    <div class="module-btn__progress-fill" :style="{ width: comp.marketShare + '%' }"></div>
                  </div>
                  <div class="module-btn__progress-text">市场份额 {{ comp.marketShare }}%</div>
                </div>
                <div class="module-btn__arrow">→</div>
              </div>
            </div>
          </div>

          <!-- 资产交易 -->
          <div v-else-if="activeInvestmentTab === 5">
            <div class="section-title">💱 资产交易</div>

            <!-- 市场评估 -->
            <div class="card mb-4">
              <div class="font-semibold mb-2">市场评估</div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div class="text-white/50 text-xs">市场规模</div>
                  <div class="text-amber-400">{{ getMarketScale() }}</div>
                </div>
                <div>
                  <div class="text-white/50 text-xs">交易热度</div>
                  <div class="text-green-400">{{ getMarketActivity() }}</div>
                </div>
              </div>
            </div>

            <!-- 土地资产交易 -->
            <div class="card mb-4">
              <div class="font-semibold mb-3">🏗️ 土地资产交易</div>
              <div v-if="landReserves.length > 0" class="space-y-2">
                <div v-for="land in landReserves" :key="land.id" class="bg-white/5 rounded-lg p-3">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-medium text-sm">{{ land.city }} - {{ land.district }}</div>
                      <div class="text-xs text-white/50">
                        {{ formatArea(land.area) }} | 容积率 {{ land.floorAreaRatio }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-amber-400 font-semibold">{{ formatMoney(land.currentValue) }}</div>
                      <div class="text-xs text-white/50">
                        估值: {{ formatMoney(land.currentValue / land.area) }}/㎡
                      </div>
                    </div>
                  </div>
                  <div class="mt-2 text-xs text-white/50">
                    土地状态: {{ getLandStatusText(land.status) }}
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-white/50 py-4">
                暂无土地资产
              </div>
            </div>

            <!-- 项目股权转让 -->
            <div class="card mb-4">
              <div class="font-semibold mb-3">📊 项目股权转让</div>
              <div v-if="projects.length > 0" class="space-y-2">
                <div v-for="project in projects.filter(p => p.status !== 'planning')" :key="project.id" class="bg-white/5 rounded-lg p-3">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-medium text-sm">{{ project.name }}</div>
                      <div class="text-xs text-white/50">
                        {{ project.projectType }} | {{ formatArea(project.totalArea) }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-green-400 font-semibold">{{ formatMoney(project.totalCost) }}</div>
                      <div class="text-xs text-white/50">预估价值</div>
                    </div>
                  </div>
                  <div class="mt-2 flex gap-2">
                    <button class="btn-primary flex-1 text-xs py-1" @click="handleProjectTransfer(project)">
                      转让股权
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-white/50 py-4">
                暂无可转让项目
              </div>
            </div>

            <!-- 交易限制提示 -->
            <div class="text-xs text-white/50 text-center">
              💡 交易金额将根据您的资质等级和当前市场规模进行调整
            </div>
          </div>
        </div>

        <!-- 工程管理页面 -->
        <div v-else-if="activeTab === 'project'">
          <div class="section-title">🏗️ 我的项目</div>
          <div v-if="projects.length === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
            暂无项目，先去拿地吧！
          </div>
          <div v-else>
            <!-- 项目列表 -->
            <div v-for="project in projects" :key="project.id" class="card mb-3">
              <!-- 项目头部 -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <div class="text-lg font-bold text-white">{{ project.name }}</div>
                  <div class="text-xs text-white/50 mt-1">
                    <span class="bg-white/10 px-2 py-0.5 rounded">{{ project.projectType }}</span>
                    <span class="ml-2">{{ project.qualityLevel }}</span>
                    <span class="mx-2">|</span>
                    <span>{{ project.city }} {{ project.district }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="status-badge" :class="getProjectStatusClass(project.status)">{{ getProjectStatusText(project.status) }}</span>
                </div>
              </div>

              <!-- 项目基本信息 -->
              <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                <div class="flex justify-between">
                  <span class="text-white/50">总建筑面积</span>
                  <span class="text-white">{{ formatArea(project.totalArea) }}㎡</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/50">总成本</span>
                  <span class="text-red-400">{{ formatMoney(project.totalCost) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/50">预估收益</span>
                  <span class="text-green-400">{{ formatMoney(project.estimatedRevenue) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/50">平均售价</span>
                  <span class="text-amber-400">{{ formatMoney(project.avgPricePerSqm) }}/㎡</span>
                </div>
              </div>

              <!-- 当前阶段进度 -->
              <div class="bg-white/5 rounded-lg p-3 mb-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-semibold">当前阶段</span>
                  <span class="text-amber-400 text-sm">{{ getPhaseText(project.status) }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getPhaseProgress(project) + '%' }"></div>
                </div>
                <div class="text-xs text-white/50 mt-2 text-right">{{ getPhaseProgress(project) }}%</div>
              </div>

              <!-- 施工进度（仅施工阶段显示） -->
              <div v-if="project.status === 'construction'" class="bg-white/5 rounded-lg p-3 mb-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-semibold">施工进度</span>
                  <span class="text-blue-400 text-sm">{{ getConstructionPhaseText(project.currentPhase) }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: project.constructionProgress + '%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }"></div>
                </div>
                <div class="text-xs text-white/50 mt-2 text-right">{{ project.constructionProgress.toFixed(1) }}%</div>
              </div>

              <!-- 五证办理状态 -->
              <div class="mb-3">
                <div class="text-sm font-semibold mb-2">五证办理</div>
                <div class="grid grid-cols-5 gap-1">
                  <div 
                    v-for="(cert, key) in project.fiveCertificates" 
                    :key="key"
                    class="text-center p-2 rounded-lg"
                    :class="cert.obtained ? 'bg-green-500/20' : cert.pending ? 'bg-amber-500/20' : 'bg-white/5'"
                  >
                    <div class="text-xs">{{ getCertificateName(key) }}</div>
                    <div class="mt-1">
                      <span v-if="cert.obtained" class="text-green-400">✓</span>
                      <span v-else-if="cert.pending" class="text-amber-400">{{ Math.round(cert.progress || 0) }}%</span>
                      <span v-else class="text-white/30">-</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-2">
                <button 
                  v-if="project.status === 'planning'"
                  class="btn-primary flex-1 text-sm"
                  @click="handleAdvancePhase(project.id)"
                >
                  进入设计阶段
                </button>
                <button 
                  v-if="project.status === 'design'"
                  class="btn-primary flex-1 text-sm"
                  @click="handleAdvancePhase(project.id)"
                >
                  进入审批阶段
                </button>
                <button 
                  v-if="project.status === 'approval' && !project.fiveCertificates.constructionPermit.obtained"
                  class="btn-primary flex-1 text-sm"
                  @click="handleApplyCertificate(project.id, 'constructionPermit')"
                  :class="{ 'opacity-50': project.fiveCertificates.constructionPermit.pending }"
                >
                  办理施工许可证
                </button>
                <button 
                  v-if="project.status === 'approval' && project.fiveCertificates.constructionPermit.obtained"
                  class="btn-primary flex-1 text-sm bg-green-600"
                  @click="handleAdvancePhase(project.id)"
                >
                  开始施工
                </button>
                <button 
                  v-if="project.status === 'construction' && project.constructionProgress >= 50 && !project.fiveCertificates.presalePermit.obtained"
                  class="btn-primary flex-1 text-sm"
                  @click="handleApplyCertificate(project.id, 'presalePermit')"
                  :class="{ 'opacity-50': project.fiveCertificates.presalePermit.pending }"
                >
                  办理预售许可证
                </button>
                <button 
                  v-if="project.status === 'presale'"
                  class="btn-primary flex-1 text-sm"
                  @click="handleAdvancePhase(project.id)"
                >
                  进入交付阶段
                </button>
                <button 
                  v-if="project.status === 'delivery'"
                  class="btn-primary flex-1 text-sm bg-green-600"
                  @click="handleAdvancePhase(project.id)"
                >
                  完成项目
                </button>
              </div>

              <!-- 项目详情展开 -->
              <button 
                class="text-xs text-white/50 mt-3 w-full text-center"
                @click="toggleProjectDetail(project.id)"
              >
                {{ expandedProjects.includes(project.id) ? '收起详情' : '展开详情' }}
              </button>

              <!-- 详细阶段信息 -->
              <div v-if="expandedProjects.includes(project.id)" class="mt-3 pt-3 border-t border-white/10">
                <div class="text-sm font-semibold mb-3">开发流程详情</div>
                
                <!-- 各阶段详情 -->
                <div class="space-y-2">
                  <div v-for="(phase, key) in project.phases" :key="key" class="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center"
                         :class="phase.status === 'completed' ? 'bg-green-500/30' : phase.status === 'in_progress' ? 'bg-amber-500/30' : 'bg-white/10'">
                      <span v-if="phase.status === 'completed'" class="text-green-400">✓</span>
                      <span v-else-if="phase.status === 'in_progress'" class="text-amber-400">●</span>
                      <span v-else class="text-white/30">○</span>
                    </div>
                    <div class="flex-1">
                      <div class="text-sm">{{ getPhaseName(key) }}</div>
                      <div class="text-xs text-white/50">
                        {{ phase.status === 'completed' ? '已完成' : phase.status === 'in_progress' ? `进行中 ${Math.round(phase.progress)}%` : '待开始' }}
                      </div>
                    </div>
                    <div v-if="phase.cost" class="text-xs text-amber-400">
                      {{ formatMoney(phase.cost) }}
                    </div>
                  </div>
                </div>

                <!-- 销售信息 -->
                <div v-if="project.status === 'presale' || project.status === 'delivery' || project.status === 'completed'" class="mt-3 pt-3 border-t border-white/10">
                  <div class="text-sm font-semibold mb-2">销售情况</div>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-white/50">已售面积</span>
                      <span class="text-green-400">{{ formatArea(project.soldArea) }}㎡</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-white/50">未售面积</span>
                      <span class="text-white">{{ formatArea(project.unsoldArea) }}㎡</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 营销销售页面 -->
        <div v-else-if="activeTab === 'marketing'">
          <div class="grid grid-cols-3 gap-2 mb-4">
            <button
              v-for="(tab, idx) in marketingTabs"
              :key="idx"
              class="btn-primary text-sm py-2"
              :class="activeMarketingTab === idx ? 'bg-amber-500' : ''"
              @click="activeMarketingTab = idx"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 品牌建设 -->
          <div v-if="activeMarketingTab === 0">
            <div class="section-title">🌟 品牌建设</div>
            <div class="card mb-3">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <div class="text-2xl font-bold">{{ company?.brand?.score || 0 }}</div>
                  <div class="text-white/50 text-xs">品牌价值</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-white/50">对售价影响</div>
                  <div class="font-bold text-green-400">+{{ Math.round((company?.brand?.score || 0) / 2) }}%</div>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: Math.min(100, (company?.brand?.score || 0) / 2) + '%' }"></div>
              </div>
            </div>
            <div class="card cursor-pointer" @click="showToast('品牌升级功能开发中')">
              <div class="card-title">🔝 品牌升级</div>
              <div class="card-subtitle">投入资金提升品牌价值</div>
              <div class="mt-3 text-amber-400 font-semibold">单次投入: {{ formatMoney(1000000) }}</div>
            </div>
          </div>

          <!-- 预售开盘 -->
          <div v-else-if="activeMarketingTab === 1">
            <div class="section-title">💰 预售开盘</div>
            <div class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无预售项目
            </div>
          </div>

          <!-- 营销蓄客 -->
          <div v-else-if="activeMarketingTab === 2">
            <div class="section-title">📣 营销蓄客</div>
            <div class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无营销项目
            </div>
          </div>
        </div>

        <!-- 运营管理页面 -->
        <div v-else-if="activeTab === 'operation'">
          <div class="section-title">📊 运营概览</div>
          
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="card">
              <div class="text-white/50 text-xs">员工总数</div>
              <div class="text-xl font-bold text-blue-400">{{ company?.employees?.length || 0 }}</div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">高管人数</div>
              <div class="text-xl font-bold text-purple-400">{{ company?.executives?.length || 0 }}</div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">部门数量</div>
              <div class="text-xl font-bold text-green-400">{{ organizationStructure.departments.length }}</div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">月人力成本</div>
              <div class="text-xl font-bold text-red-400">{{ formatMoney(monthlySalaryCost) }}</div>
            </div>
          </div>

          <div class="section-title">🏗️ 项目运营</div>
          <div class="card mb-4">
            <div class="grid grid-cols-3 gap-3 text-center">
              <div>
                <div class="text-2xl font-bold text-blue-400">{{ projects.length }}</div>
                <div class="text-white/50 text-xs">总项目数</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-amber-400">{{ ongoingProjectsCount }}</div>
                <div class="text-white/50 text-xs">在建项目</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-400">{{ completedProjectsCount }}</div>
                <div class="text-white/50 text-xs">已完成</div>
              </div>
            </div>
          </div>

          <div class="section-title">💰 财务概览</div>
          <div class="card mb-4">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-white/70 text-sm">月收入</span>
                <span class="text-green-400 font-semibold">{{ formatMoney(company?.monthlyRevenue || 0) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-white/70 text-sm">月利润</span>
                <span :class="(company?.monthlyProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'" class="font-semibold">
                  {{ formatMoney(company?.monthlyProfit || 0) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-white/70 text-sm">负债率</span>
                <span :class="parseFloat(debtRatio) > 70 ? 'text-red-400' : 'text-green-400'" class="font-semibold">
                  {{ debtRatio }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 资本运作页面 -->
        <div v-else-if="activeTab === 'capital'">
          <div class="grid grid-cols-3 gap-2 mb-4">
            <button
              v-for="(tab, idx) in capitalTabs"
              :key="idx"
              class="btn-primary text-sm py-2"
              :class="activeCapitalTab === idx ? 'bg-amber-500' : ''"
              @click="activeCapitalTab = idx"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 银行中心 -->
          <div v-if="activeCapitalTab === 0">
            <div v-if="!selectedBank">
              <div class="section-title">🏦 银行中心</div>
              <div class="card mb-4">
                <div class="text-sm text-white/50 mb-3">您的贷款利率将根据资质等级和信用等级进行调整</div>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span class="text-white/50">资质等级:</span>
                    <span class="text-blue-400 ml-1">{{ qualificationLevel }}</span>
                  </div>
                  <div>
                    <span class="text-white/50">信用等级:</span>
                    <span class="text-purple-400 ml-1">{{ company?.creditRating || 'C' }}</span>
                  </div>
                </div>
              </div>
              <div v-for="bank in banks" :key="bank.id" class="card mb-3 cursor-pointer hover:bg-white/10 transition-colors" @click="selectedBank = bank.id">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <div class="text-lg font-bold">{{ bank.name }}</div>
                    <div class="text-white/50 text-xs mt-1">{{ bank.feature }}</div>
                  </div>
                  <div class="text-right">
                    <div class="text-xl font-bold text-green-400">{{ (getActualInterestRate(bank.id) * 100).toFixed(2) }}%</div>
                    <div class="text-white/50 text-xs">实际利率</div>
                  </div>
                </div>
                <div class="mt-2 text-xs text-white/50 mb-3">
                  💡 {{ bank.description }}
                </div>
                <div class="grid grid-cols-3 gap-2 text-xs">
                  <div class="text-center bg-white/5 rounded p-2">
                    <div class="text-white/50">最低贷款</div>
                    <div class="text-amber-400 font-bold">{{ formatMoney(1000000) }}</div>
                  </div>
                  <div class="text-center bg-white/5 rounded p-2">
                    <div class="text-white/50">最高可贷</div>
                    <div class="text-green-400 font-bold">{{ formatMoney(maxLoanAmount) }}</div>
                  </div>
                  <div class="text-center bg-white/5 rounded p-2">
                    <div class="text-white/50">贷款期限</div>
                    <div class="text-blue-400 font-bold">最长60月</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <button class="btn-primary mb-4 text-sm" @click="selectedBank = null">
                ← 返回银行列表
              </button>
              
              <div class="card mb-4">
                <div class="text-center mb-4">
                  <div class="text-3xl mb-2">🏦</div>
                  <div class="text-2xl font-bold text-game-accent">{{ currentBank?.name }}</div>
                  <div class="text-white/50 text-sm">{{ currentBank?.feature }}</div>
                </div>
                <div class="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div class="text-white/50 text-xs">实际利率</div>
                    <div class="font-bold text-green-400">{{ (getActualInterestRate(currentBank?.id || '') * 100).toFixed(2) }}%</div>
                  </div>
                  <div>
                    <div class="text-white/50 text-xs">最高可贷</div>
                    <div class="font-bold text-amber-400">{{ formatMoney(maxLoanAmount) }}</div>
                  </div>
                </div>
              </div>

              <div class="section-title">💰 贷款</div>
              <div class="card mb-4">
                <div class="space-y-3">
                  <div>
                    <div class="text-xs text-white/50 mb-2">贷款金额</div>
                    <input 
                      type="range" 
                      min="1000000" 
                      :max="maxLoanAmount" 
                      step="1000000"
                      v-model="loanForm.amount"
                      class="w-full"
                    >
                    <div class="text-right text-amber-400 font-bold mt-1">{{ formatMoney(loanForm.amount) }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-white/50 mb-2">贷款期限</div>
                    <div class="grid grid-cols-4 gap-2">
                      <button 
                        v-for="term in [12, 24, 36, 60]" 
                        :key="term"
                        class="btn-primary text-sm py-2"
                        :class="loanForm.term === term ? 'bg-amber-500' : ''"
                        @click="loanForm.term = term"
                      >
                        {{ term }}月
                      </button>
                    </div>
                  </div>
                  <div class="bg-white/5 rounded-lg p-3 text-sm">
                    <div class="flex justify-between mb-2">
                      <span class="text-white/50">月还款额</span>
                      <span class="text-amber-400 font-bold">{{ formatMoney(calculateMonthlyPayment()) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-white/50">总利息</span>
                      <span class="text-red-400 font-bold">{{ formatMoney(calculateTotalInterest()) }}</span>
                    </div>
                  </div>
                  <button 
                    class="btn-primary btn-full bg-green-600 hover:bg-green-500"
                    :disabled="cash < 0 || loanForm.amount > maxLoanAmount"
                    @click="handleApplyLoan"
                  >
                    申请贷款
                  </button>
                </div>
              </div>

              <div class="section-title">💳 还款</div>
              <div class="card mb-4">
                <div v-if="activeLoans.length === 0" class="text-center text-white/50 py-8">
                  暂无未还贷款
                </div>
                <div v-else v-for="loan in activeLoans" :key="loan.id" class="border-b border-white/10 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                  <div class="flex justify-between items-center mb-2">
                    <div class="font-semibold">{{ currentBank?.name }}</div>
                    <div class="text-amber-400 font-bold">{{ formatMoney(loan.remainingPrincipal) }}</div>
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs text-white/50 mb-3">
                    <div>期限: {{ loan.term }}月</div>
                    <div>已还: {{ loan.paidMonths }}月</div>
                    <div>月供: {{ formatMoney(loan.monthlyPayment) }}</div>
                    <div>利率: {{ (loan.interestRate * 100).toFixed(2) }}%</div>
                  </div>
                  <div class="progress-bar mb-3">
                    <div class="progress-fill" :style="{ width: (loan.paidMonths / loan.term) * 100 + '%' }"></div>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn-primary flex-1 text-sm" @click="handleRepayLoan(loan.id, 'monthly')">
                      按月还款
                    </button>
                    <button class="btn-primary flex-1 text-sm bg-amber-600 hover:bg-amber-500" @click="handleRepayLoan(loan.id, 'full')">
                      提前结清
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 金融中心 -->
          <div v-else-if="activeCapitalTab === 1">
            <div class="section-title">💵 金融中心</div>

            <!-- 上市计划 -->
            <div class="card mb-4">
              <div class="flex justify-between items-center mb-3">
                <div class="font-bold text-base">📈 上市计划</div>
                <span v-if="company?.stockInfo?.listed" class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">已上市</span>
                <span v-else class="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">未上市</span>
              </div>

              <div v-if="company?.stockInfo?.listed" class="space-y-3">
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div class="text-white/50 text-xs">总股本</div>
                    <div class="font-bold text-white">{{ formatNumber(company.stockInfo.totalShares) }}股</div>
                  </div>
                  <div>
                    <div class="text-white/50 text-xs">股价</div>
                    <div class="font-bold text-green-400">{{ formatMoney(company.stockInfo.sharePrice) }}元</div>
                  </div>
                  <div>
                    <div class="text-white/50 text-xs">市值</div>
                    <div class="font-bold text-amber-400">{{ formatMoney(company.stockInfo.marketCap) }}</div>
                  </div>
                  <div>
                    <div class="text-white/50 text-xs">市盈率</div>
                    <div class="font-bold text-blue-400">{{ company.stockInfo.peRatio.toFixed(1) }}</div>
                  </div>
                </div>
                <div class="flex gap-2 mt-3">
                  <button class="btn-primary flex-1 text-sm" @click="handleAdditionalIssue">增发股票</button>
                  <button class="btn-primary flex-1 text-sm" @click="handleShareBuyback">股份回购</button>
                </div>
              </div>

              <div v-else>
                <div class="text-sm text-white/50 mb-3">上市要求：</div>
                <div class="space-y-2 text-sm mb-4">
                  <div class="flex justify-between">
                    <span class="text-white/70">成立年限≥{{ ipoRequirements.minYears }}年</span>
                    <span :class="checkIPOEligibility().reasons.length === 0 || !checkIPOEligibility().reasons.some(r => r.includes('成立年限')) ? 'text-green-400' : 'text-red-400'">
                      {{ checkIPOEligibility().reasons.some(r => r.includes('成立年限')) ? '不满足' : '满足' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/70">注册资本≥{{ formatMoney(ipoRequirements.minRegisteredCapital) }}</span>
                    <span :class="(company?.registeredCapital || 0) >= ipoRequirements.minRegisteredCapital ? 'text-green-400' : 'text-red-400'">
                      {{ (company?.registeredCapital || 0) >= ipoRequirements.minRegisteredCapital ? '满足' : '不满足' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/70">总资产≥{{ formatMoney(ipoRequirements.minTotalAssets) }}</span>
                    <span :class="(company?.totalAssets || 0) >= ipoRequirements.minTotalAssets ? 'text-green-400' : 'text-red-400'">
                      {{ (company?.totalAssets || 0) >= ipoRequirements.minTotalAssets ? '满足' : '不满足' }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-white/70">完成项目≥{{ ipoRequirements.minProjects }}个</span>
                    <span :class="completedProjectsCount >= ipoRequirements.minProjects ? 'text-green-400' : 'text-red-400'">
                      {{ completedProjectsCount }} / {{ ipoRequirements.minProjects }}
                    </span>
                  </div>
                </div>
                <button
                  class="btn-primary btn-full"
                  :disabled="!checkIPOEligibility().eligible"
                  @click="handleIPO"
                >
                  {{ checkIPOEligibility().eligible ? '申请上市' : '条件不满足' }}
                </button>
                <div v-if="!checkIPOEligibility().eligible && checkIPOEligibility().reasons.length > 0" class="mt-2 text-xs text-red-400">
                  {{ checkIPOEligibility().reasons.join('; ') }}
                </div>
              </div>
            </div>
          </div>

          <!-- 股东操作 -->
          <div v-else-if="activeCapitalTab === 2">
            <div class="section-title">👥 股东结构</div>
            <div class="card mb-4">
              <div class="font-bold mb-3">当前股权结构</div>
              <div v-for="shareholder in company?.shareholders" :key="shareholder.id" class="flex justify-between items-center py-2 border-b border-white/10">
                <div>
                  <div class="text-sm font-semibold">{{ shareholder.name }}</div>
                  <div class="text-xs text-white/50">{{ shareholder.isPlayer ? '创始人' : '投资者' }}</div>
                </div>
                <div class="text-right">
                  <div class="text-amber-400 font-bold">{{ shareholder.sharePercentage }}%</div>
                </div>
              </div>
              <div v-if="!company?.shareholders || company.shareholders.length === 0" class="text-center text-white/50 py-4">
                暂无股东信息
              </div>
            </div>
          </div>

          <!-- 行业执照 -->
          <div v-else-if="activeCapitalTab === 3">
            <div class="section-title">📜 营业执照</div>
            <div class="space-y-3 mb-4">
              <div v-for="license in businessLicenses" :key="license.id" class="card">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="font-semibold">{{ license.name }}</div>
                    <div class="text-xs text-white/50 mt-1">{{ license.description }}</div>
                  </div>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="{
                      'bg-green-500/20 text-green-400': license.status === 'valid',
                      'bg-amber-500/20 text-amber-400': license.status === 'pending',
                      'bg-red-500/20 text-red-400': license.status === 'expired' || license.status === 'revoked'
                    }"
                  >
                    {{ license.status === 'valid' ? '有效' : license.status === 'pending' ? '办理中' : license.status === 'expired' ? '已过期' : '已吊销' }}
                  </span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-white/10">
                  <div>
                    <span class="text-white/50">发证机关:</span>
                    <span class="ml-1">{{ license.issuingAuthority }}</span>
                  </div>
                  <div v-if="license.issueDate">
                    <span class="text-white/50">发证日期:</span>
                    <span class="ml-1">{{ license.issueDate }}</span>
                  </div>
                  <div v-if="license.expireDate">
                    <span class="text-white/50">有效期至:</span>
                    <span class="ml-1">{{ license.expireDate }}</span>
                  </div>
                </div>
                <div v-if="license.effect" class="mt-2 text-xs text-green-400">
                  ✅ {{ license.effect }}
                </div>
              </div>
            </div>

            <div class="section-title">🏛️ 行业协会</div>
            <div class="space-y-3">
              <div v-for="assoc in industryAssociations" :key="assoc.id" class="card">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="font-semibold">{{ assoc.name }}</div>
                    <div class="text-xs text-white/50 mt-1">
                      {{ assoc.type === 'national' ? '全国性协会' : assoc.type === 'provincial' ? '省级协会' : '市级协会' }}
                    </div>
                  </div>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="assoc.joined ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'"
                  >
                    {{ assoc.joined ? '已加入' : '未加入' }}
                  </span>
                </div>
                <div class="mt-3 pt-3 border-t border-white/10">
                  <div class="text-xs text-white/50 mb-2">会员权益:</div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="(benefit, idx) in assoc.benefits" :key="idx" class="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                      {{ benefit }}
                    </span>
                  </div>
                </div>
                <div class="flex justify-between items-center mt-3">
                  <div class="text-xs text-amber-400">
                    会费: {{ formatMoney(assoc.membershipFee) }}/年
                  </div>
                  <button 
                    v-if="!assoc.joined"
                    class="btn-primary text-xs px-3 py-1"
                    @click="handleJoinAssociation(assoc.id)"
                  >
                    申请加入
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 三条红线 -->
          <div v-else-if="activeCapitalTab === 4">
            <div class="section-title">📊 三条红线</div>
            <div class="card mb-4">
              <div class="text-xs text-white/50 mb-3">实时监测房地产企业负债情况</div>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm">剔除预收款后的资产负债率</span>
                    <span :class="threeRedLines.assetLiabilityRatio < 0.7 ? 'text-green-400' : 'text-red-400'">
                      {{ (threeRedLines.assetLiabilityRatio * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: Math.min(100, threeRedLines.assetLiabilityRatio * 100) + '%', background: threeRedLines.assetLiabilityRatio < 0.7 ? '#22c55e' : '#ef4444' }"></div>
                  </div>
                  <div class="text-xs text-white/50 mt-1">红线: 70%</div>
                </div>
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm">净负债率</span>
                    <span :class="threeRedLines.netDebtRatio < 1 ? 'text-green-400' : 'text-red-400'">
                      {{ (threeRedLines.netDebtRatio * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: Math.min(100, threeRedLines.netDebtRatio * 100) + '%', background: threeRedLines.netDebtRatio < 1 ? '#22c55e' : '#ef4444' }"></div>
                  </div>
                  <div class="text-xs text-white/50 mt-1">红线: 100%</div>
                </div>
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-sm">现金短债比</span>
                    <span :class="threeRedLines.cashShortDebtRatio > 1 ? 'text-green-400' : 'text-red-400'">
                      {{ threeRedLines.cashShortDebtRatio.toFixed(2) }}
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: Math.min(100, threeRedLines.cashShortDebtRatio * 50) + '%', background: threeRedLines.cashShortDebtRatio > 1 ? '#22c55e' : '#ef4444' }"></div>
                  </div>
                  <div class="text-xs text-white/50 mt-1">红线: 1.0</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 财务报表 -->
          <div v-else-if="activeCapitalTab === 5">
            <div class="section-title">📋 财务报表</div>
            <div class="card mb-4">
              <div class="font-bold mb-3">资产负债表</div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between font-semibold border-b border-white/10 pb-2">
                  <span>资产</span>
                  <span>{{ formatMoney(financialStatements.balanceSheet.totalAssets) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">货币资金</span>
                  <span>{{ formatMoney(financialStatements.balanceSheet.currentAssets.cash) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">存货</span>
                  <span>{{ formatMoney(financialStatements.balanceSheet.currentAssets.inventory) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">土地</span>
                  <span>{{ formatMoney(financialStatements.balanceSheet.fixedAssets.land) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">在建工程</span>
                  <span>{{ formatMoney(financialStatements.balanceSheet.fixedAssets.constructionInProgress) }}</span>
                </div>
                <div class="flex justify-between font-semibold border-t border-white/10 pt-2 mt-2">
                  <span>负债</span>
                  <span class="text-red-400">{{ formatMoney(financialStatements.balanceSheet.totalLiabilities) }}</span>
                </div>
                <div class="flex justify-between font-semibold border-t border-white/10 pt-2 mt-2">
                  <span>所有者权益</span>
                  <span class="text-green-400">{{ formatMoney(financialStatements.balanceSheet.totalEquity) }}</span>
                </div>
              </div>
            </div>

            <div class="card mb-4">
              <div class="font-bold mb-3">利润表</div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-white/70">营业收入</span>
                  <span>{{ formatMoney(financialStatements.incomeStatement.revenue) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">营业成本</span>
                  <span class="text-red-400">{{ formatMoney(financialStatements.incomeStatement.costOfGoodsSold) }}</span>
                </div>
                <div class="flex justify-between font-semibold border-t border-white/10 pt-2">
                  <span>毛利润</span>
                  <span class="text-green-400">{{ formatMoney(financialStatements.incomeStatement.grossProfit) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">销售费用</span>
                  <span>{{ formatMoney(financialStatements.incomeStatement.sellingExpenses) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">管理费用</span>
                  <span>{{ formatMoney(financialStatements.incomeStatement.administrativeExpenses) }}</span>
                </div>
                <div class="flex justify-between font-semibold border-t border-white/10 pt-2">
                  <span>净利润</span>
                  <span class="text-green-400">{{ formatMoney(financialStatements.incomeStatement.netProfit) }}</span>
                </div>
              </div>
            </div>

            <div class="card mb-4">
              <div class="font-bold mb-3">现金流量表</div>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-white/70">经营活动现金流</span>
                  <span :class="financialStatements.cashFlowStatement.operatingActivities.netCashFromOperating >= 0 ? 'text-green-400' : 'text-red-400'">
                    {{ formatMoney(financialStatements.cashFlowStatement.operatingActivities.netCashFromOperating) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">投资活动现金流</span>
                  <span :class="financialStatements.cashFlowStatement.investingActivities.netCashFromInvesting >= 0 ? 'text-green-400' : 'text-red-400'">
                    {{ formatMoney(financialStatements.cashFlowStatement.investingActivities.netCashFromInvesting) }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/70">融资活动现金流</span>
                  <span :class="financialStatements.cashFlowStatement.financingActivities.netCashFromFinancing >= 0 ? 'text-green-400' : 'text-red-400'">
                    {{ formatMoney(financialStatements.cashFlowStatement.financingActivities.netCashFromFinancing) }}
                  </span>
                </div>
                <div class="flex justify-between font-semibold border-t border-white/10 pt-2">
                  <span>现金净增加</span>
                  <span :class="financialStatements.cashFlowStatement.netChangeInCash >= 0 ? 'text-green-400' : 'text-red-400'">
                    {{ formatMoney(financialStatements.cashFlowStatement.netChangeInCash) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 个人模块页面 -->
        <div v-else-if="activeTab === 'personal'">
          <div class="section-title">👤 个人信息</div>
          <div class="card mb-4">
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 bg-game-accent rounded-full flex items-center justify-center text-4xl">👤</div>
              <div>
                <div class="text-xl font-bold">{{ player?.nickname || '创业者' }}</div>
                <div class="text-white/50 text-sm">社会地位: Lv.{{ player?.socialStatus?.level || 1 }}</div>
                <div class="text-white/50 text-sm">声望: {{ player?.socialStatus?.reputation || 0 }}</div>
              </div>
            </div>
          </div>

          <div class="section-title">💪 能力值</div>
          <div class="card mb-4">
            <div class="space-y-3">
              <div>
                <div class="flex justify-between mb-2">
                  <span>谈判能力</span>
                  <span class="text-amber-400">{{ player?.abilities?.negotiation || 50 }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (player?.abilities?.negotiation || 50) + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span>管理能力</span>
                  <span class="text-amber-400">{{ player?.abilities?.management || 50 }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (player?.abilities?.management || 50) + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span>风险预判</span>
                  <span class="text-amber-400">{{ player?.abilities?.riskPrediction || 50 }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (player?.abilities?.riskPrediction || 50) + '%' }"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between mb-2">
                  <span>公共关系</span>
                  <span class="text-amber-400">{{ player?.abilities?.publicRelations || 50 }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: (player?.abilities?.publicRelations || 50) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="section-title">⚠️ 风险监控</div>
          <div class="card">
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center">
                <div class="text-lg font-bold text-yellow-400">{{ player?.risks?.taxRisk || 0 }}%</div>
                <div class="text-white/50 text-xs">税务风险</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-yellow-400">{{ player?.risks?.briberyRisk || 0 }}%</div>
                <div class="text-white/50 text-xs">贿赂风险</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-yellow-400">{{ player?.risks?.publicOpinionRisk || 0 }}%</div>
                <div class="text-white/50 text-xs">舆论风险</div>
              </div>
              <div class="text-center">
                <div class="text-lg font-bold text-yellow-400">{{ player?.risks?.healthRisk || 0 }}%</div>
                <div class="text-white/50 text-xs">健康风险</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 品牌模块页面 -->
        <div v-else-if="activeTab === 'brand'">
          <div class="section-title">🌟 品牌中心</div>
          <div class="card mb-4">
            <div class="flex justify-between items-center mb-4">
              <div>
                <div class="text-3xl font-bold">{{ company?.brand?.score || 0 }}</div>
                <div class="text-white/50 text-sm">品牌价值</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-white/50">品牌等级</div>
                <div class="font-bold text-amber-400">{{ brandLevelText }}</div>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: Math.min(100, (company?.brand?.score || 0) / 2) + '%' }"></div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('品牌建设功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">🎯</div>
              <div class="module-btn__content">
                <div class="module-btn__title">品牌建设</div>
                <div class="module-btn__subtitle">投入广告和营销，提升品牌价值</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('声誉管理功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">🏆</div>
              <div class="module-btn__content">
                <div class="module-btn__title">声誉管理</div>
                <div class="module-btn__subtitle">处理危机事件，维护企业声誉</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn cursor-pointer" @click="showToast('品牌授权功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">📜</div>
              <div class="module-btn__content">
                <div class="module-btn__title">品牌授权</div>
                <div class="module-btn__subtitle">授权品牌使用，获取授权收入</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>
        </div>

        <!-- 治理系统页面 -->
        <div v-else-if="activeTab === 'governance'">
          <div class="grid grid-cols-3 gap-2 mb-4">
            <button
              v-for="(tab, idx) in governanceTabs"
              :key="idx"
              class="btn-primary text-sm py-2"
              :class="activeGovernanceTab === idx ? 'bg-amber-500' : ''"
              @click="activeGovernanceTab = idx"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 高管团队 -->
          <div v-if="activeGovernanceTab === 0">
            <div class="section-title">👔 高管团队</div>
            <div v-if="(company?.executives?.length || 0) === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无高管
            </div>
            <div v-else v-for="exec in company?.executives" :key="exec.id" class="card mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">👔</div>
                <div class="flex-1">
                  <div class="font-semibold">{{ exec.name }}</div>
                  <div class="text-white/50 text-sm">{{ exec.position }}</div>
                </div>
                <div class="text-right">
                  <div class="text-amber-400 font-semibold">{{ formatMoney(exec.salary) }}</div>
                  <div class="text-white/50 text-xs">月薪</div>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-white/10">
                <div>
                  <span class="text-white/50">能力:</span>
                  <span class="text-green-400 ml-1">{{ exec.ability }}</span>
                </div>
                <div>
                  <span class="text-white/50">忠诚度:</span>
                  <span class="text-blue-400 ml-1">{{ exec.loyalty }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 组织架构 -->
          <div v-else-if="activeGovernanceTab === 1">
            <div class="section-title">🏢 组织架构</div>
            <div class="card mb-4">
              <div class="flex justify-between items-center mb-3">
                <div class="font-bold">部门设置</div>
                <div class="text-sm text-white/50">共 {{ organizationStructure.departments.length }} 个部门</div>
              </div>
              <div class="space-y-2">
                <div v-for="dept in organizationStructure.departments" :key="dept.id" class="bg-white/5 rounded-lg p-3">
                  <div class="flex justify-between items-center">
                    <div class="font-semibold">{{ dept.name }}</div>
                    <div class="text-xs text-white/50">预算: {{ formatMoney(dept.budget) }}</div>
                  </div>
                  <div class="text-xs text-white/50 mt-1">{{ dept.description }}</div>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="flex justify-between items-center">
                <div class="font-bold">员工总数</div>
                <div class="text-2xl font-bold text-blue-400">{{ organizationStructure.totalEmployees || company?.employees?.length || 0 }}</div>
              </div>
            </div>
          </div>

          <!-- 员工管理 -->
          <div v-else-if="activeGovernanceTab === 2">
            <div class="section-title">👥 我的员工</div>
            <div v-if="(company?.employees?.length || 0) === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无员工，去招聘市场看看吧！
            </div>
            <div v-else v-for="emp in company?.employees" :key="emp.id" class="card mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">👤</div>
                <div class="flex-1">
                  <div class="font-semibold">{{ emp.name }}</div>
                  <div class="text-white/50 text-sm">{{ emp.position }}</div>
                </div>
                <div class="text-right">
                  <div class="text-amber-400 font-semibold">{{ formatMoney(emp.salary) }}</div>
                  <div class="text-white/50 text-xs">月薪</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 招聘市场 -->
          <div v-else-if="activeGovernanceTab === 3">
            <div class="section-title">🎯 招聘市场</div>
            <div v-for="emp in availableEmployees" :key="emp.id" class="card mb-3">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">👤</div>
                <div class="flex-1">
                  <div class="font-semibold">{{ emp.name }}</div>
                  <div class="text-white/50 text-sm">{{ emp.position }}</div>
                </div>
                <div class="text-right">
                  <div class="text-amber-400 font-semibold">{{ formatMoney(emp.salary) }}</div>
                  <div class="text-white/50 text-xs">月薪</div>
                </div>
              </div>
              <button class="btn-primary btn-full mt-3" @click="showToast('招聘' + emp.name)">招聘</button>
            </div>
          </div>

          <!-- 风控体系 -->
          <div v-else-if="activeGovernanceTab === 4">
            <div class="section-title">🛡️ 风控体系</div>
            <div class="card mb-4">
              <div class="flex justify-between items-center mb-4">
                <div>
                  <div class="text-2xl font-bold">Lv.{{ riskControlSystem.level }}</div>
                  <div class="text-white/50 text-sm">风控等级</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-white/50">审计频率</div>
                  <div class="font-semibold">
                    {{ riskControlSystem.auditFrequency === 'monthly' ? '每月' : riskControlSystem.auditFrequency === 'quarterly' ? '每季度' : '每年' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="section-title">📋 风控政策</div>
            <div class="space-y-3">
              <div v-for="policy in riskControlSystem.policies" :key="policy.id" class="card">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <div class="font-semibold">{{ policy.name }}</div>
                    <div class="text-xs text-white/50 mt-1">{{ policy.description }}</div>
                  </div>
                  <span 
                    class="px-2 py-1 rounded-full text-xs font-semibold"
                    :class="policy.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'"
                  >
                    {{ policy.status === 'active' ? '生效中' : '未启用' }}
                  </span>
                </div>
                <div class="mt-3 pt-3 border-t border-white/10">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-white/50">类型</span>
                    <span>
                      {{ policy.type === 'finance' ? '财务风险' : policy.type === 'operation' ? '运营风险' : policy.type === 'legal' ? '法律风险' : '市场风险' }}
                    </span>
                  </div>
                  <div class="flex justify-between text-xs mb-2">
                    <span class="text-white/50">有效性</span>
                    <span class="text-green-400">{{ policy.effectiveness }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: policy.effectiveness + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 内部审计 -->
          <div v-else-if="activeGovernanceTab === 5">
            <div class="section-title">📊 内部审计</div>
            <div v-if="internalAudits.length === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无审计记录
            </div>
            <div v-else v-for="audit in internalAudits" :key="audit.id" class="card mb-3">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-semibold">{{ audit.name }}</div>
                  <div class="text-xs text-white/50 mt-1">
                    {{ audit.type === 'financial' ? '财务审计' : audit.type === 'operational' ? '运营审计' : audit.type === 'compliance' ? '合规审计' : '专项审计' }}
                  </div>
                </div>
                <span 
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-green-500/20 text-green-400': audit.status === 'completed',
                    'bg-amber-500/20 text-amber-400': audit.status === 'in_progress',
                    'bg-white/10 text-white/50': audit.status === 'planned'
                  }"
                >
                  {{ audit.status === 'completed' ? '已完成' : audit.status === 'in_progress' ? '进行中' : '计划中' }}
                </span>
              </div>
              <div v-if="audit.startDate || audit.endDate" class="grid grid-cols-2 gap-2 text-xs mt-3 pt-3 border-t border-white/10">
                <div v-if="audit.startDate">
                  <span class="text-white/50">开始日期:</span>
                  <span class="ml-1">{{ audit.startDate }}</span>
                </div>
                <div v-if="audit.endDate">
                  <span class="text-white/50">结束日期:</span>
                  <span class="ml-1">{{ audit.endDate }}</span>
                </div>
              </div>
              <div v-if="audit.findings && audit.findings.length > 0" class="mt-3">
                <div class="text-xs text-white/50 mb-2">审计发现:</div>
                <div class="space-y-1">
                  <div 
                    v-for="finding in audit.findings" 
                    :key="finding.id" 
                    class="text-xs p-2 rounded bg-white/5"
                  >
                    <span 
                      :class="{
                        'text-red-400': finding.severity === 'critical' || finding.severity === 'high',
                        'text-amber-400': finding.severity === 'medium',
                        'text-blue-400': finding.severity === 'low'
                      }"
                    >
                      [{{ finding.severity === 'critical' ? '严重' : finding.severity === 'high' ? '高' : finding.severity === 'medium' ? '中' : '低' }}]
                    </span>
                    <span class="ml-1">{{ finding.description }}</span>
                  </div>
                </div>
              </div>
              <div v-if="audit.recommendations && audit.recommendations.length > 0" class="mt-3">
                <div class="text-xs text-white/50 mb-2">整改建议:</div>
                <ul class="text-xs space-y-1">
                  <li v-for="(rec, idx) in audit.recommendations" :key="idx" class="text-green-400">
                    • {{ rec }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 设置页面 -->
        <div v-else-if="activeTab === 'base'">
          <div class="section-title">🎮 游戏设置</div>

          <!-- 快速存档 -->
          <div class="card mb-4">
            <div class="card-title mb-3">快速存档</div>
            <div class="grid grid-cols-2 gap-2">
              <button class="btn-primary" @click="quickSave">
                💾 快速保存
              </button>
              <button class="btn-primary" @click="gameStore.autoSave">
                🔄 自动存档
              </button>
            </div>
            <div class="text-xs text-white/50 mt-2 text-center">
              上次存档: {{ lastSaveTime }}
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('声音设置功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">🔊</div>
              <div class="module-btn__content">
                <div class="module-btn__title">声音设置</div>
                <div class="module-btn__subtitle">调整背景音乐和音效</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('显示设置功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">🖥️</div>
              <div class="module-btn__content">
                <div class="module-btn__title">显示设置</div>
                <div class="module-btn__subtitle">调整界面显示效果</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="router.push('/saves')">
            <div class="module-btn__left">
              <div class="module-btn__icon">💾</div>
              <div class="module-btn__content">
                <div class="module-btn__title">存档管理</div>
                <div class="module-btn__subtitle">保存和加载游戏进度</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__badge">{{ saveSlotsCount }}个</div>
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="router.push('/changelog')">
            <div class="module-btn__left">
              <div class="module-btn__icon">📝</div>
              <div class="module-btn__content">
                <div class="module-btn__title">更新日志</div>
                <div class="module-btn__subtitle">查看游戏版本更新记录</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__badge">v{{ currentVersion }}</div>
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showAbout">
            <div class="module-btn__left">
              <div class="module-btn__icon">ℹ️</div>
              <div class="module-btn__content">
                <div class="module-btn__title">关于游戏</div>
                <div class="module-btn__subtitle">了解游戏信息和版本</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn cursor-pointer" @click="exitToMainMenu">
            <div class="module-btn__left">
              <div class="module-btn__icon">🏠</div>
              <div class="module-btn__content">
                <div class="module-btn__title">返回主菜单</div>
                <div class="module-btn__subtitle">退出游戏回到主菜单</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <div class="fixed bottom-0 left-0 right-0 bg-game-card/95 border-t border-white/10">
      <div class="max-w-md mx-auto">
        <!-- 第一行导航 -->
        <div class="grid grid-cols-5 gap-1 py-2 px-2 border-b border-white/10">
          <button
            v-for="tab in firstRowTabs"
            :key="tab.id"
            class="flex flex-col items-center py-2 px-1 rounded-lg transition-all"
            :class="activeTab === tab.id ? 'bg-white/10' : ''"
            @click="activeTab = tab.id"
          >
            <span class="text-xl">{{ tab.icon }}</span>
            <span class="text-xs mt-1" :class="activeTab === tab.id ? 'text-amber-400' : 'text-white/70'">{{ tab.name }}</span>
          </button>
        </div>
        <!-- 第二行导航 -->
        <div class="grid grid-cols-5 gap-1 py-2 px-2">
          <button
            v-for="tab in secondRowTabs"
            :key="tab.id"
            class="flex flex-col items-center py-2 px-1 rounded-lg transition-all"
            :class="activeTab === tab.id ? 'bg-white/10' : ''"
            @click="activeTab = tab.id"
          >
            <span class="text-lg">{{ tab.icon }}</span>
            <span class="text-xs mt-1" :class="activeTab === tab.id ? 'text-amber-400' : 'text-white/70'">{{ tab.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import type { City, ResearchProject, Land, Project, ProjectType, QualityLevel } from '@/types/game'
import { getCurrentVersion } from '@/config/version'

const router = useRouter()
const gameStore = useGameStore()

const activeTab = ref('overview')
const activeInvestmentTab = ref(0)
const activeMarketingTab = ref(0)
const activeOperationTab = ref(0)
const activeCapitalTab = ref(0)
const activeGovernanceTab = ref(0)
const selectedCity = ref<string | null>(null)
const selectedBank = ref<string | null>(null)
const timeSpeed = ref(1) // 时间流速：1X, 2X, 3X
const timePaused = ref(false)

const loanForm = ref({
  amount: 1000000,
  term: 12
})

const activeLoans = ref<any[]>([])
let gameInterval: ReturnType<typeof setInterval> | null = null

// 时间流速对应间隔（毫秒）
// 1X: 5秒 = 1天
// 2X: 3秒 = 1天
// 3X: 2秒 = 1天
const SPEED_INTERVALS = { 1: 5000, 2: 3000, 3: 2000 }

function startGameLoop() {
  if (gameInterval) clearInterval(gameInterval)
  if (timePaused.value) return
  gameInterval = setInterval(() => {
    if (!timePaused.value) {
      gameStore.advanceDay()
    }
  }, SPEED_INTERVALS[timeSpeed.value as 1 | 2 | 3] || 5000)
}

function stopGameLoop() {
  if (gameInterval) {
    clearInterval(gameInterval)
    gameInterval = null
  }
}

// 开发规划相关
const selectedLandForDevelopment = ref<string | null>(null)
const developmentForm = ref({
  projectType: '住宅' as ProjectType,
  qualityLevel: '中端' as QualityLevel,
  projectName: ''
})
const expandedProjects = ref<string[]>([])

// 版本和存档相关
const currentVersion = ref(getCurrentVersion())
const lastSaveTime = ref('未存档')
const saveSlotsCount = computed(() => gameStore.saveSlots.length)

// 第一行导航
const firstRowTabs = [
  { id: 'overview', name: '总览', icon: '🏠' },
  { id: 'investment', name: '投资', icon: '📈' },
  { id: 'project', name: '工程', icon: '🏗️' },
  { id: 'marketing', name: '营销', icon: '📣' },
  { id: 'operation', name: '运营', icon: '👥' }
]

// 第二行导航
const secondRowTabs = [
  { id: 'capital', name: '资本', icon: '💵' },
  { id: 'personal', name: '个人', icon: '👤' },
  { id: 'brand', name: '品牌', icon: '🌟' },
  { id: 'governance', name: '治理', icon: '🏛️' },
  { id: 'base', name: '设置', icon: '⚙️' }
]

const investmentTabs = ['城市研究', '土地市场', '土地储备', '市场趋势', '竞争对手', '资产交易']
const marketingTabs = ['品牌建设', '预售开盘', '营销蓄客']
const operationTabs = ['运营概览']
const governanceTabs = ['高管团队', '组织架构', '员工管理', '招聘市场', '风控体系', '内部审计']
const capitalTabs = ['银行中心', '金融中心', '股东操作', '行业执照', '三条红线', '财务报表']

const company = computed(() => gameStore.company)
const cash = computed(() => gameStore.cash)
const totalAssets = computed(() => gameStore.totalAssets)
const landReserves = computed(() => gameStore.landReserves)
const projects = computed(() => gameStore.projects)
const researchPoints = computed(() => gameStore.researchPoints)
const totalResearchPoints = computed(() => gameStore.getTotalResearchPoints())
const allCities = computed(() => gameStore.allCities)
const allResearchProjects = computed(() => gameStore.allResearchProjects)
const player = computed(() => gameStore.gameState?.player)
const macroEconomy = computed(() => gameStore.gameState?.macroEconomy || {
  gdpGrowthRate: 5,
  interestRate: 0.05,
  urbanizationRate: 50,
  population: 1400000000,
  housingPriceIndex: 1.0
})

const threeRedLines = computed(() => company.value?.threeRedLines || {
  assetLiabilityRatio: 0.5,
  netDebtRatio: 0.8,
  cashShortDebtRatio: 1.5
})

const businessLicenses = computed(() => gameStore.getBusinessLicenses())
const industryAssociations = computed(() => gameStore.getIndustryAssociations())
const organizationStructure = computed(() => gameStore.getOrganizationStructure())
const riskControlSystem = computed(() => gameStore.getRiskControlSystem())
const internalAudits = computed(() => gameStore.getInternalAudits())

const currentBank = computed(() => {
  if (!selectedBank.value) return null
  return banks.find(b => b.id === selectedBank.value) || null
})

const qualificationProgress = computed(() => gameStore.getQualificationProgress())

const housingPriceIndex = computed(() => macroEconomy.value.housingPriceIndex || 1.0)
const marketDemand = computed(() => 75)
const economicCycle = computed(() => '稳定期')

const gameTime = computed(() => {
  const time = gameStore.gameState?.gameTime
  if (!time) return '2008年1月1日'
  return `${time.year}年${time.month + 1}月${time.day || 1}日`
})

const qualificationLevel = computed(() => {
  const level = company.value?.qualificationLevel || 4
  const levels: Record<number, string> = { 1: '一级', 2: '二级', 3: '三级', 4: '四级' }
  return levels[level] || '四级'
})

const nextQualificationLevel = computed(() => {
  const level = company.value?.qualificationLevel || 4
  if (level <= 1) return '已满级'
  const levels: Record<number, string> = { 1: '一级', 2: '二级', 3: '三级', 4: '四级' }
  return levels[level - 1] || '已满级'
})

function getQualificationLabel(key: string): string {
  const labels: Record<string, string> = {
    registeredCapital: '注册资本',
    totalAssets: '净资产',
    completedProjects: '完成项目',
    totalSoldArea: '累计销售面积',
    socialReputation: '社会知名度',
    technicalPersonnel: '技术人员'
  }
  return labels[key] || key
}

function formatQualificationValue(key: string, value: number): string {
  if (key === 'registeredCapital' || key === 'totalAssets') {
    return formatMoney(value)
  }
  if (key === 'totalSoldArea' || key === 'technicalPersonnel') {
    return formatArea(value)
  }
  if (key === 'completedProjects') {
    return value.toString()
  }
  return value.toString()
}

function handleQualificationUpgrade() {
  const success = gameStore.applyQualificationUpgrade()
  if (success) {
    showToast('资质升级成功！')
  } else {
    showToast('资质升级失败，条件不满足')
  }
}

function setTimeSpeed(speed: number) {
  timeSpeed.value = speed
  timePaused.value = false
  gameStore.setTimeSpeed(speed)
  startGameLoop()
}

function handleTogglePause() {
  timePaused.value = !timePaused.value
  gameStore.toggleTimePause()
  if (timePaused.value) {
    stopGameLoop()
  } else {
    startGameLoop()
  }
}

// 银行贷款相关
const maxLoanAmount = computed(() => gameStore.getMaxLoanAmount())

function getActualInterestRate(bankId: string): number {
  // 返回基于期限的利率（默认12个月）
  return gameStore.getLoanInterestRate(12)
}

// IPO相关
const ipoRequirements = computed(() => gameStore.getIPORequirements())

const completedProjectsCount = computed(() => {
  return projects.value.filter(p => p.status === 'completed').length
})

const ongoingProjectsCount = computed(() => {
  return projects.value.filter(p => p.status !== 'completed').length
})

const monthlySalaryCost = computed(() => {
  let total = 0
  if (company.value?.employees) {
    total += company.value.employees.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0)
  }
  if (company.value?.executives) {
    total += company.value.executives.reduce((sum: number, exec: any) => sum + (exec.salary || 0), 0)
  }
  return total
})

const financialStatements = computed(() => gameStore.generateFinancialStatements())

function checkIPOEligibility() {
  return gameStore.checkIPOEligibility()
}

function handleIPO() {
  const eligibility = checkIPOEligibility()
  if (!eligibility.eligible) {
    showToast('条件不满足：' + eligibility.reasons.join('; '))
    return
  }
  const success = gameStore.listCompany()
  if (success) {
    showToast('恭喜！公司成功上市！')
  } else {
    showToast('上市失败')
  }
}

function handleAdditionalIssue() {
  const percentage = 10 // 假设增发10%
  const success = gameStore.additionalShareOffering(percentage, company.value?.stockInfo?.sharePrice || 10)
  if (success) {
    showToast(`成功增发${percentage}%股本！`)
  } else {
    showToast('增发失败')
  }
}

function handleShareBuyback() {
  const percentage = 5 // 假设回购5%
  const success = gameStore.buybackShares(percentage)
  if (success) {
    showToast(`成功回购${percentage}%股份！`)
  } else {
    showToast('回购失败，资金不足')
  }
}

function handleAddShareholder() {
  showToast('增加股东功能开发中')
}

function handleTransferShares() {
  showToast('股权转让功能开发中')
}

// 银行贷款相关函数
function calculateMonthlyPayment(): number {
  const principal = loanForm.value.amount
  const monthlyRate = getActualInterestRate(selectedBank.value || '') / 12
  const term = loanForm.value.term
  if (monthlyRate === 0) return principal / term
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
}

function calculateTotalInterest(): number {
  const monthlyPayment = calculateMonthlyPayment()
  const totalPayment = monthlyPayment * loanForm.value.term
  return totalPayment - loanForm.value.amount
}

function handleApplyLoan() {
  showToast('贷款申请已提交')
}

function handleRepayLoan(loanId: string, type: 'monthly' | 'full') {
  showToast(type === 'monthly' ? '按月还款成功' : '提前结清成功')
}

function handleJoinAssociation(assocId: string) {
  const success = gameStore.joinAssociation(assocId)
  if (success) {
    showToast('成功加入协会！')
  } else {
    showToast('加入失败，请检查条件')
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN')
}

// 资产交易相关
function getMarketScale(): string {
  const totalAssetsValue = totalAssets.value
  if (totalAssetsValue > 10000000000) return '大型市场'
  if (totalAssetsValue > 1000000000) return '中型市场'
  if (totalAssetsValue > 100000000) return '小型市场'
  return '微型市场'
}

function getMarketActivity(): string {
  const macro = macroEconomy.value
  if (macro.housingPriceIndex > 1.3) return '活跃'
  if (macro.housingPriceIndex > 0.8) return '平稳'
  return '低迷'
}

function getLandStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'idle': '闲置',
    'planning': '规划中',
    'developing': '开发中',
    'sold': '已出售'
  }
  return statusMap[status] || status
}

function handleProjectTransfer(project: Project) {
  showToast(`项目转让功能开发中: ${project.name}`)
}

// 土地市场相关
const marketLands = computed(() => gameStore.getLandMarketLands())
const maxLandArea = computed(() => gameStore.getMaxLandArea())
const daysToNextRefresh = computed(() => gameStore.getDaysToNextRefresh())

function formatLandArea(area: number): string {
  if (!isFinite(area)) {
    return '不限'
  }
  if (area >= 1000000) {
    return (area / 1000000).toFixed(1) + '百万'
  }
  return formatArea(area)
}

function handleRefreshMarket() {
  if (confirm('确定要消耗5万现金立即刷新土地市场吗？')) {
    if (cash.value >= 50000) {
      if (gameStore.company) {
        gameStore.company.cash -= 50000
      }
      gameStore.refreshLandMarket()
      showToast('土地市场已刷新！')
    } else {
      showToast('现金不足，需要5万现金刷新市场')
    }
  }
}

function handlePurchaseLand(land: any) {
  const result = gameStore.purchaseLand(land.id)
  if (result) {
    showToast(`成功购买${land.city} ${land.district}土地！`)
  } else {
    showToast('购买失败，请检查资金和资质')
  }
}

const enterpriseTypeText = computed(() => {
  const type = company.value?.enterpriseType
  const types: Record<string, string> = {
    limited: '有限责任公司',
    'one-person': '一人有限公司',
    partnership: '合伙企业'
  }
  return types[type || ''] || '有限责任公司'
})

const brandLevelText = computed(() => {
  const level = company.value?.brand?.level
  const levels: Record<string, string> = {
    unknown: '未知',
    regional: '区域品牌',
    national: '全国品牌',
    'national-top': '全国知名',
    'industry-benchmark': '行业标杆'
  }
  return levels[level || ''] || '区域品牌'
})

const debtRatio = computed(() => {
  if (!company.value) return '0.0'
  if (company.value.totalAssets === 0) return '0.0'
  return ((company.value.totalLiabilities / company.value.totalAssets) * 100).toFixed(1)
})

const researchingCitiesCount = computed(() => {
  return company.value?.cityResearches.filter(r => r.inProgressProject).length || 0
})

const researchedCitiesCount = computed(() => {
  return company.value?.cityResearches.filter(r => r.completedProjects.length > 0).length || 0
})

const currentCity = computed(() => {
  if (!selectedCity.value) return null
  return allCities.value.find((c: City) => c.id === selectedCity.value) || null
})

const competitors = [
  { name: '万科地产', stars: 5, marketShare: 15 },
  { name: '保利发展', stars: 5, marketShare: 12 },
  { name: '绿地集团', stars: 4, marketShare: 10 },
  { name: '融创中国', stars: 4, marketShare: 8 },
  { name: '龙湖集团', stars: 4, marketShare: 7 }
]

const banks = [
  { id: 'icbc', name: '中国工商银行', feature: '国有大行，资金雄厚', baseRate: 0.045, description: '额度高，利率稳定' },
  { id: 'ccb', name: '中国建设银行', feature: '房地产特色服务', baseRate: 0.043, description: '房贷经验丰富，审批快' },
  { id: 'abc', name: '中国农业银行', feature: '县域经济支持', baseRate: 0.047, description: '三四线城市优势明显' },
  { id: 'boc', name: '中国银行', feature: '国际化业务', baseRate: 0.046, description: '跨境业务便利' }
]

const availableEmployees = [
  { id: 'emp1', name: '张明', position: '项目经理', salary: 30000 },
  { id: 'emp2', name: '李华', position: '财务总监', salary: 50000 },
  { id: 'emp3', name: '王芳', position: '营销经理', salary: 25000 },
  { id: 'emp4', name: '刘强', position: '工程师', salary: 20000 }
]

function formatMoney(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(2) + '万'
  }
  return num.toFixed(0) + '元'
}

function formatArea(area: number): string {
  if (area >= 10000) {
    return (area / 10000).toFixed(2) + '万'
  }
  return area.toFixed(0)
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    planning: 'status-badge--info',
    construction: 'status-badge--warning',
    presale: 'status-badge--success',
    completed: 'status-badge--success'
  }
  return classes[status] || 'status-badge--info'
}

function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    planning: '规划中',
    construction: '施工中',
    presale: '预售中',
    completed: '已完成'
  }
  return texts[status] || '未知'
}

function selectCity(cityId: string) {
  selectedCity.value = cityId
}

function getCityResearch(cityId: string) {
  return gameStore.getCityResearch(cityId)
}

function getCityPriceBoost(cityId: string): number {
  return gameStore.getCityPriceBoost(cityId)
}

function getCityAvgPrice(cityId: string): number {
  const city = allCities.value.find((c: City) => c.id === cityId)
  return city?.avgPrice || 0
}

function getEffectiveCityPrice(cityId: string): number {
  const basePrice = getCityAvgPrice(cityId)
  const boost = getCityPriceBoost(cityId)
  return Math.floor(basePrice * (1 + boost / 100))
}

function getCityResearchProgress(cityId: string): number {
  const research = getCityResearch(cityId)
  if (!research) return 0
  if (research.inProgressProject) {
    return research.progress
  }
  const completed = research.completedProjects.length
  const total = allResearchProjects.value.length
  return total > 0 ? (completed / total) * 100 : 0
}

function getCityResearchStatus(cityId: string): string {
  const research = getCityResearch(cityId)
  if (!research) return '未研究'
  if (research.inProgressProject) {
    return '研究中 ' + Math.round(research.progress) + '%'
  }
  if (research.completedProjects.length > 0) {
    return `已完成 ${research.completedProjects.length}项`
  }
  return '未研究'
}

function getAvailableResearchProjects(cityId: string): ResearchProject[] {
  return gameStore.getAvailableResearchProjects(cityId)
}

function getCompletedResearchProjects(cityId: string): ResearchProject[] {
  const research = getCityResearch(cityId)
  if (!research) return []
  return allResearchProjects.value.filter((p: ResearchProject) => 
    research.completedProjects.includes(p.id)
  )
}

function getInProgressProjectName(cityId: string): string {
  const research = getCityResearch(cityId)
  if (!research?.inProgressProject) return ''
  const project = allResearchProjects.value.find((p: ResearchProject) => p.id === research.inProgressProject)
  return project?.name || ''
}

function canStartResearch(cityId: string, projectId: string): boolean {
  const project = allResearchProjects.value.find((p: ResearchProject) => p.id === projectId)
  if (!project) return false
  if (company.value?.cash || 0 < project.cost) return false
  if (researchPoints.value < project.researchPoints) return false
  const research = getCityResearch(cityId)
  if (research?.inProgressProject) return false
  return true
}

function handleStartResearch(cityId: string, projectId: string) {
  if (!canStartResearch(cityId, projectId)) {
    const project = allResearchProjects.value.find((p: ResearchProject) => p.id === projectId)
    if (!project) return
    if ((company.value?.cash || 0) < project.cost) {
      showToast('资金不足，无法开始研究')
      return
    }
    if (researchPoints.value < project.researchPoints) {
      showToast('研究点不足，无法开始研究')
      return
    }
    return
  }
  const success = gameStore.startResearch(cityId, projectId)
  if (success) {
    showToast('研究项目已开始！')
  } else {
    showToast('开始研究失败')
  }
}

function gainResearchPoints() {
  const cost = 1000000
  if ((company.value?.cash || 0) < cost) {
    showToast('资金不足，无法获取研究点')
    return
  }
  gameStore.addResearchPoints(20)
  if (company.value && gameStore.gameState) {
    gameStore.updateState({
      company: {
        ...company.value,
        cash: company.value.cash - cost
      }
    })
  }
  showToast('获得20研究点！')
}

function goToCityResearch() {
  activeTab.value = 'investment'
  activeInvestmentTab.value = 0
  selectedCity.value = null
}

// ========== 开发规划相关函数 ==========

// 开发规划预览
const developmentPreview = computed(() => {
  if (!selectedLandForDevelopment.value) {
    return { cost: 0, revenue: 0, period: 0, profitRate: 0 }
  }
  const land = landReserves.value.find(l => l.id === selectedLandForDevelopment.value)
  if (!land) {
    return { cost: 0, revenue: 0, period: 0, profitRate: 0 }
  }
  
  const cost = gameStore.calculateDevelopmentCost(land, developmentForm.value.projectType, developmentForm.value.qualityLevel)
  const revenue = gameStore.calculateEstimatedRevenue(land, developmentForm.value.projectType, developmentForm.value.qualityLevel)
  const period = gameStore.calculateConstructionPeriod(developmentForm.value.projectType, developmentForm.value.qualityLevel)
  const profitRate = cost > 0 ? ((revenue - cost) / cost) * 100 : 0
  
  return { cost, revenue, period, profitRate }
})

// 开始制定开发规划
function startDevelopmentPlanning(land: Land) {
  selectedLandForDevelopment.value = land.id
  developmentForm.value = {
    projectType: gameStore.getValidProjectTypes(land.landUse)[0],
    qualityLevel: '中端',
    projectName: `${land.city}${land.district}项目`
  }
}

// 取消开发规划
function cancelDevelopmentPlanning() {
  selectedLandForDevelopment.value = null
}

// 选择项目类型
function selectProjectType(type: ProjectType) {
  developmentForm.value.projectType = type
}

// 选择开发品味
function selectQualityLevel(level: QualityLevel) {
  developmentForm.value.qualityLevel = level
}

// 获取品味描述
function getQualityDescription(level: QualityLevel): string {
  const configs = gameStore.getQualityLevelConfigs()
  const config = configs.find(c => c.level === level)
  return config?.description || ''
}

// 获取土地可开发类型
function getValidProjectTypes(landUse: string): ProjectType[] {
  return gameStore.getValidProjectTypes(landUse)
}

// 检查是否可以确认开发
function canConfirmDevelopment(land: Land): boolean {
  if (!developmentForm.value.projectName) return false
  const cost = developmentPreview.value.cost
  if (cash.value < cost * 0.3) return false // 需要30%启动资金
  return true
}

// 确认开发规划
function confirmDevelopmentPlan(land: Land) {
  if (!canConfirmDevelopment(land)) {
    showToast('资金不足或信息不完整')
    return
  }
  
  const plan = {
    projectType: developmentForm.value.projectType,
    qualityLevel: developmentForm.value.qualityLevel,
    projectName: developmentForm.value.projectName,
    estimatedCost: developmentPreview.value.cost,
    estimatedRevenue: developmentPreview.value.revenue,
    constructionPeriod: developmentPreview.value.period
  }
  
  // 设置开发规划
  const success = gameStore.setLandDevelopmentPlan(land.id, plan)
  if (!success) {
    showToast('设置开发规划失败')
    return
  }
  
  // 确认开发
  const confirmSuccess = gameStore.confirmDevelopment(land.id)
  if (confirmSuccess) {
    showToast(`项目"${plan.projectName}"已开始开发！`)
    selectedLandForDevelopment.value = null
    // 自动跳转到工程页面
    activeTab.value = 'project'
  } else {
    showToast('确认开发失败，请检查资金')
  }
}

// ========== 工程页面相关函数 ==========

// 获取项目状态样式类
function getProjectStatusClass(status: string): string {
  const classes: Record<string, string> = {
    planning: 'status-badge--info',
    design: 'status-badge--info',
    approval: 'status-badge--warning',
    construction: 'status-badge--warning',
    presale: 'status-badge--success',
    delivery: 'status-badge--success',
    completed: 'status-badge--success'
  }
  return classes[status] || 'status-badge--info'
}

// 获取项目状态文本
function getProjectStatusText(status: string): string {
  const texts: Record<string, string> = {
    planning: '规划中',
    design: '设计中',
    approval: '审批中',
    construction: '施工中',
    presale: '预售中',
    delivery: '交付中',
    completed: '已完成'
  }
  return texts[status] || '未知'
}

// 获取阶段文本
function getPhaseText(status: string): string {
  const texts: Record<string, string> = {
    planning: '规划阶段',
    design: '设计阶段',
    approval: '审批阶段',
    construction: '施工阶段',
    presale: '预售阶段',
    delivery: '交付阶段',
    completed: '已完成'
  }
  return texts[status] || '未知'
}

// 获取阶段进度
function getPhaseProgress(project: Project): number {
  const phase = project.phases[project.status as keyof typeof project.phases]
  return phase?.progress || 0
}

// 获取施工阶段文本
function getConstructionPhaseText(phase: string): string {
  const config = gameStore.getConstructionPhaseConfig()
  return config[phase as keyof typeof config]?.name || phase
}

// 获取证照名称
function getCertificateName(key: string): string {
  const names: Record<string, string> = {
    landUsePermit: '土地证',
    constructionPlanningPermit: '规划证',
    constructionPermit: '施工证',
    presalePermit: '预售证',
    completionAcceptance: '竣工证'
  }
  return names[key] || key
}

// 获取阶段名称
function getPhaseName(key: string): string {
  const names: Record<string, string> = {
    planning: '规划阶段',
    design: '设计阶段',
    approval: '审批阶段',
    construction: '施工阶段',
    presale: '预售阶段',
    delivery: '交付阶段'
  }
  return names[key] || key
}

// 展开/收起项目详情
function toggleProjectDetail(projectId: string) {
  const index = expandedProjects.value.indexOf(projectId)
  if (index === -1) {
    expandedProjects.value.push(projectId)
  } else {
    expandedProjects.value.splice(index, 1)
  }
}

// 推进项目阶段
function handleAdvancePhase(projectId: string) {
  const success = gameStore.advanceProjectPhase(projectId)
  if (success) {
    showToast('项目阶段已推进')
  } else {
    showToast('无法推进阶段，请完成当前阶段任务')
  }
}

// 办理证照
function handleApplyCertificate(projectId: string, certType: string) {
  const success = gameStore.applyForCertificate(projectId, certType)
  if (success) {
    showToast('证照办理已开始')
  } else {
    showToast('无法办理证照，请检查条件')
  }
}

// ========== 设置页面相关函数 ==========

// 快速保存
function quickSave() {
  const success = gameStore.saveGame('auto')
  if (success) {
    lastSaveTime.value = '刚刚'
    showToast('游戏已保存')
    gameStore.getAllSaves()
  } else {
    showToast('保存失败')
  }
}

// 显示关于信息
function showAbout() {
  showToast(`房地产帝国 v${currentVersion.value}\n2008-2028中国地产全周期模拟\n真实复刻中国房地产全流程`)
}

// 退出到主菜单
function exitToMainMenu() {
  if (confirm('确定要退出游戏吗？建议先保存游戏进度。')) {
    gameStore.autoSave()
    gameStore.exitGame()
    router.push('/')
  }
}

function showToast(message: string) {
  alert(message)
}

// 组件挂载时检查土地市场是否需要刷新
onMounted(() => {
  gameStore.checkAndRefreshLandMarket()
  gameStore.getAllSaves()
  // 启动游戏循环
  startGameLoop()
  // 更新上次存档时间
  const autoSave = gameStore.saveSlots.find(s => s.id === 'auto')
  if (autoSave) {
    const now = new Date()
    const diff = now.getTime() - autoSave.timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) lastSaveTime.value = '刚刚'
    else if (hours < 24) lastSaveTime.value = `${hours}小时前`
    else lastSaveTime.value = `${Math.floor(hours / 24)}天前`
  }
})
</script>

<style scoped>
.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 24px;
  color: white;
}

.section-title:first-child {
  margin-top: 0;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  color: white;
}

.card-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

.progress-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #fbbf24);
  transition: width 0.3s ease;
}

/* Module Button Styles */
.module-btn {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.module-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(249, 115, 22, 0.3);
}

.module-btn__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-btn__icon {
  width: 48px;
  height: 48px;
  background: rgba(249, 115, 22, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.module-btn__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.module-btn__title {
  font-weight: 600;
  font-size: 16px;
  color: white;
}

.module-btn__subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.module-btn__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-btn__badge {
  background: rgba(249, 115, 22, 0.15);
  color: #fbbf24;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.module-btn__progress {
  width: 100px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.module-btn__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

.module-btn__progress-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

.module-btn__arrow {
  color: rgba(255, 255, 255, 0.3);
  font-size: 20px;
  transition: all 0.3s ease;
}

.module-btn:hover .module-btn__arrow {
  color: rgba(249, 115, 22, 0.8);
  transform: translateX(4px);
}

/* Status Badge Styles */
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge--success {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.status-badge--warning {
  background: rgba(249, 115, 22, 0.15);
  color: #f97316;
}

.status-badge--info {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

/* Button Styles */
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

.btn-full {
  width: 100%;
}
</style>
