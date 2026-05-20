<template>
  <div class="min-h-screen bg-game-primary flex flex-col">
    <!-- 顶部状态栏 -->
    <div class="bg-game-card/90 border-b border-white/10 p-4">
      <div class="max-w-md mx-auto">
        <div class="flex justify-between items-center mb-3">
          <div class="text-lg font-bold text-white">{{ company?.name || '我的公司' }}</div>
          <div class="text-white/70 text-sm">{{ gameTime }}</div>
        </div>
        <div class="grid grid-cols-4 gap-2 text-center">
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">现金</div>
            <div class="text-amber-400 font-bold text-sm">{{ formatMoney(cash) }}</div>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">总资产</div>
            <div class="text-green-400 font-bold text-sm">{{ formatMoney(totalAssets) }}</div>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">资质</div>
            <div class="text-blue-400 font-bold text-sm">{{ qualificationLevel }}</div>
          </div>
          <div class="bg-white/5 rounded-lg p-2">
            <div class="text-xs text-white/50">信用</div>
            <div class="text-purple-400 font-bold text-sm">{{ company?.creditRating || 'C' }}</div>
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
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="card">
              <div class="text-white/50 text-xs">现金</div>
              <div class="text-xl font-bold text-amber-400">{{ formatMoney(cash) }}</div>
            </div>
            <div class="card">
              <div class="text-white/50 text-xs">总资产</div>
              <div class="text-xl font-bold text-green-400">{{ formatMoney(totalAssets) }}</div>
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
          </div>

          <div class="card mb-4">
            <div class="text-white/50 text-xs mb-2">负债率</div>
            <div class="text-xl font-bold mb-2" :class="parseFloat(debtRatio) > 70 ? 'text-red-400' : 'text-green-400'">
              {{ debtRatio }}%
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ 
                width: Math.min(100, parseFloat(debtRatio)) + '%',
                background: parseFloat(debtRatio) > 70 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #22c55e, #4ade80)'
              }"></div>
            </div>
            <div class="text-white/50 text-xs mt-2 text-right">安全线: 70%</div>
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

          <div class="section-title">🌟 品牌价值</div>
          <div class="card mb-4">
            <div class="flex justify-between items-center mb-3">
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
            <div class="text-white/50 text-xs mt-2 text-right">{{ brandLevelText }}</div>
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
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              v-for="(tab, idx) in investmentTabs"
              :key="idx"
              class="btn-primary whitespace-nowrap text-sm"
              :class="activeInvestmentTab === idx ? 'bg-amber-500' : ''"
              @click="activeInvestmentTab = idx"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 城市研究 -->
          <div v-if="activeInvestmentTab === 0">
            <div class="section-title">🏙 城市研究</div>
            <div v-for="city in cities" :key="city.id" class="module-btn mb-3 cursor-pointer" @click="showToast('查看' + city.name + '详情')">
              <div class="module-btn__left">
                <div class="module-btn__icon">🏙️</div>
                <div class="module-btn__content">
                  <div class="module-btn__title">{{ city.name }}</div>
                  <div class="module-btn__subtitle">{{ city.description }}</div>
                </div>
              </div>
              <div class="module-btn__right">
                <div class="module-btn__badge">{{ formatMoney(city.avgPrice) }}</div>
                <div>
                  <div class="module-btn__progress">
                    <div class="module-btn__progress-fill" :style="{ width: city.developmentLevel + '%' }"></div>
                  </div>
                  <div class="module-btn__progress-text">发展潜力 {{ city.potential }}%</div>
                </div>
                <div class="module-btn__arrow">→</div>
              </div>
            </div>
          </div>

          <!-- 土地市场 -->
          <div v-else-if="activeInvestmentTab === 1">
            <div class="section-title">📍 土地市场</div>
            <div class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无可购买土地
            </div>
          </div>

          <!-- 土地储备 -->
          <div v-else-if="activeInvestmentTab === 2">
            <div class="section-title">🏗 土地储备</div>
            <div v-if="landReserves.length === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
              暂无土地储备
            </div>
            <div v-else v-for="land in landReserves" :key="land.id" class="card mb-3">
              <div class="card-title">{{ land.city }} - 地块</div>
              <div class="card-subtitle">面积: {{ formatArea(land.area) }}㎡ | 容积率: {{ land.floorAreaRatio }}</div>
              <div class="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <span class="text-white/50">获取价格:</span>
                  <span class="font-semibold">{{ formatMoney(land.acquisitionPrice) }}</span>
                </div>
                <div>
                  <span class="text-white/50">当前价值:</span>
                  <span class="font-semibold text-green-400">{{ formatMoney(land.currentValue) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 市场趋势 -->
          <div v-else-if="activeInvestmentTab === 3">
            <div class="section-title">📈 市场趋势</div>
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
            <div class="module-btn mb-3 cursor-pointer" @click="showToast('土地交易功能开发中')">
              <div class="module-btn__left">
                <div class="module-btn__icon">🏗️</div>
                <div class="module-btn__content">
                  <div class="module-btn__title">土地资产交易</div>
                  <div class="module-btn__subtitle">买卖土地资产，优化资产配置</div>
                </div>
              </div>
              <div class="module-btn__right">
                <div class="module-btn__badge">暂无</div>
                <div class="module-btn__arrow">→</div>
              </div>
            </div>
            <div class="module-btn cursor-pointer" @click="showToast('股权转让功能开发中')">
              <div class="module-btn__left">
                <div class="module-btn__icon">📊</div>
                <div class="module-btn__content">
                  <div class="module-btn__title">项目股权转让</div>
                  <div class="module-btn__subtitle">转让项目股权，获取资金回报</div>
                </div>
              </div>
              <div class="module-btn__right">
                <div class="module-btn__badge">暂无</div>
                <div class="module-btn__arrow">→</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 工程管理页面 -->
        <div v-else-if="activeTab === 'project'">
          <div class="section-title">🏗️ 我的项目</div>
          <div v-if="projects.length === 0" class="card" style="text-align: center; color: #64748b; padding: 40px;">
            暂无项目，先去拿地吧！
          </div>
          <div v-else v-for="project in projects" :key="project.id" class="card mb-3 cursor-pointer" @click="showToast('查看' + project.name + '详情')">
            <div class="flex justify-between items-start flex-wrap gap-3 mb-3">
              <div>
                <div class="text-lg font-bold flex items-center gap-2">
                  {{ project.name }}
                </div>
                <div class="text-white/70 text-sm mt-1">
                  {{ project.status === 'planning' ? '规划中' : project.status === 'construction' ? '施工中' : project.status === 'presale' ? '预售中' : '已完成' }}
                </div>
              </div>
              <span class="status-badge" :class="getStatusClass(project.status)">{{ getStatusText(project.status) }}</span>
            </div>
            <div class="mt-3">
              <div class="flex justify-between mb-2 text-sm">
                <span class="text-white/50">建设进度</span>
                <span>{{ project.constructionProgress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: project.constructionProgress + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 营销销售页面 -->
        <div v-else-if="activeTab === 'marketing'">
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              v-for="(tab, idx) in marketingTabs"
              :key="idx"
              class="btn-primary whitespace-nowrap text-sm"
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
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              v-for="(tab, idx) in operationTabs"
              :key="idx"
              class="btn-primary whitespace-nowrap text-sm"
              :class="activeOperationTab === idx ? 'bg-amber-500' : ''"
              @click="activeOperationTab = idx"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 员工管理 -->
          <div v-if="activeOperationTab === 0">
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
          <div v-else-if="activeOperationTab === 1">
            <div class="section-title">🎯 招聘市场</div>
            <div v-for="emp in availableEmployees" :key="emp.id" class="card mb-3 cursor-pointer" @click="showToast('招聘' + emp.name)">
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
              <button class="btn-primary btn-full mt-3">招聘</button>
            </div>
          </div>
        </div>

        <!-- 资本运作页面 -->
        <div v-else-if="activeTab === 'capital'">
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button
              v-for="(tab, idx) in capitalTabs"
              :key="idx"
              class="btn-primary whitespace-nowrap text-sm"
              :class="activeCapitalTab === idx ? 'bg-amber-500' : ''"
              @click="activeCapitalTab = idx"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 银行中心 -->
          <div v-if="activeCapitalTab === 0">
            <div class="section-title">🏦 银行中心</div>
            <div v-for="bank in banks" :key="bank.id" class="card mb-3 cursor-pointer" @click="showToast('打开' + bank.name)">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <div class="text-lg font-bold">{{ bank.name }}</div>
                  <div class="text-white/50 text-xs mt-1">{{ bank.feature }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold text-green-400">{{ (bank.baseRate * 100).toFixed(1) }}%</div>
                  <div class="text-white/50 text-xs">基础利率</div>
                </div>
              </div>
              <div class="mt-2 text-xs text-white/50">
                💡 {{ bank.description }}
              </div>
            </div>
          </div>

          <!-- 融资中心 -->
          <div v-else-if="activeCapitalTab === 1">
            <div class="section-title">💵 融资中心</div>
            <div class="card">
              <div class="flex justify-between items-center mb-4">
                <div class="font-bold text-base">📈 股权融资</div>
                <span class="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">股权稀释</span>
              </div>
              <div class="text-white/50 text-sm">融资功能开发中...</div>
            </div>
          </div>

          <!-- 三条红线 -->
          <div v-else-if="activeCapitalTab === 2">
            <div class="section-title">📊 三条红线</div>
            <div class="card">
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-2">
                    <span>剔除预收款后的资产负债率</span>
                    <span :class="threeRedLines.assetLiabilityRatio < 0.7 ? 'text-green-400' : 'text-red-400'">
                      {{ (threeRedLines.assetLiabilityRatio * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: Math.min(100, threeRedLines.assetLiabilityRatio * 100) + '%', background: threeRedLines.assetLiabilityRatio < 0.7 ? '#22c55e' : '#ef4444' }"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-2">
                    <span>净负债率</span>
                    <span :class="threeRedLines.netDebtRatio < 1 ? 'text-green-400' : 'text-red-400'">
                      {{ (threeRedLines.netDebtRatio * 100).toFixed(1) }}%
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: Math.min(100, threeRedLines.netDebtRatio * 100) + '%', background: threeRedLines.netDebtRatio < 1 ? '#22c55e' : '#ef4444' }"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-2">
                    <span>现金短债比</span>
                    <span :class="threeRedLines.cashShortDebtRatio > 1 ? 'text-green-400' : 'text-red-400'">
                      {{ threeRedLines.cashShortDebtRatio.toFixed(2) }}
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: Math.min(100, threeRedLines.cashShortDebtRatio * 50) + '%', background: threeRedLines.cashShortDebtRatio > 1 ? '#22c55e' : '#ef4444' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 财务报表 -->
          <div v-else-if="activeCapitalTab === 3">
            <div class="section-title">📋 财务报表</div>
            <div class="card">
              <div class="text-white/50 text-sm">财务报表功能开发中...</div>
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
          <div class="section-title">🏛️ 公司治理</div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('高管团队功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">👔</div>
              <div class="module-btn__content">
                <div class="module-btn__title">高管团队</div>
                <div class="module-btn__subtitle">招聘和管理公司高管</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('组织架构功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">🏢</div>
              <div class="module-btn__content">
                <div class="module-btn__title">组织架构</div>
                <div class="module-btn__subtitle">设计和优化公司组织架构</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('风控体系功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">🛡️</div>
              <div class="module-btn__content">
                <div class="module-btn__title">风控体系</div>
                <div class="module-btn__subtitle">建立风险控制和管理体系</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn cursor-pointer" @click="showToast('内部审计功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">📊</div>
              <div class="module-btn__content">
                <div class="module-btn__title">内部审计</div>
                <div class="module-btn__subtitle">定期审计，防范经营风险</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>
        </div>

        <!-- 设置页面 -->
        <div v-else-if="activeTab === 'base'">
          <div class="section-title">🎮 游戏设置</div>

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
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('更新日志功能开发中')">
            <div class="module-btn__left">
              <div class="module-btn__icon">📝</div>
              <div class="module-btn__content">
                <div class="module-btn__title">更新日志</div>
                <div class="module-btn__subtitle">查看游戏版本更新记录</div>
              </div>
            </div>
            <div class="module-btn__right">
              <div class="module-btn__arrow">→</div>
            </div>
          </div>

          <div class="module-btn mb-3 cursor-pointer" @click="showToast('关于游戏功能开发中')">
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

          <div class="module-btn cursor-pointer" @click="router.push('/')">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const activeTab = ref('overview')
const activeInvestmentTab = ref(0)
const activeMarketingTab = ref(0)
const activeOperationTab = ref(0)
const activeCapitalTab = ref(0)

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
const operationTabs = ['员工管理', '招聘市场']
const capitalTabs = ['银行中心', '融资中心', '三条红线', '财务报表']

const company = computed(() => gameStore.company)
const cash = computed(() => gameStore.cash)
const totalAssets = computed(() => gameStore.totalAssets)
const landReserves = computed(() => gameStore.landReserves)
const projects = computed(() => gameStore.projects)
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

const housingPriceIndex = computed(() => macroEconomy.value.housingPriceIndex || 1.0)
const marketDemand = computed(() => 75)
const economicCycle = computed(() => '稳定期')

const gameTime = computed(() => {
  const time = gameStore.gameState?.gameTime
  if (!time) return '2008年1月'
  return `${time.year}年${time.month + 1}月`
})

const qualificationLevel = computed(() => {
  const level = company.value?.qualificationLevel || 4
  const levels: Record<number, string> = { 1: '一级', 2: '二级', 3: '三级', 4: '四级' }
  return levels[level] || '四级'
})

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

const cities = [
  { id: 'beijing', name: '北京', description: '政治文化中心，高端市场', avgPrice: 80000, developmentLevel: 85, potential: 75 },
  { id: 'shanghai', name: '上海', description: '经济金融中心，国际化大都市', avgPrice: 78000, developmentLevel: 88, potential: 80 },
  { id: 'guangzhou', name: '广州', description: '华南中心，商贸活跃', avgPrice: 45000, developmentLevel: 75, potential: 70 },
  { id: 'shenzhen', name: '深圳', description: '科技创新中心，年轻活力', avgPrice: 70000, developmentLevel: 82, potential: 85 }
]

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

function showToast(message: string) {
  alert(message)
}
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
