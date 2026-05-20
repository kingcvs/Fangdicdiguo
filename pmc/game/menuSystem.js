// 菜单系统
const MenuSystem = {
    VERSION: 'v2.1',
    
    // 更新日志
    CHANGELOG: [
        {
            version: 'v2.1',
            date: '2026-05-21',
            changes: [
                '📰 全新杂志风格UI设计',
                '🎨 克制的深蓝金配色方案',
                '✨ 无卡片设计，线性信息层次',
                '🏢 主菜单海报式布局',
                '📱 流畅的入场动画和微交互',
                '🎯 极简的底部导航设计'
            ]
        },
        {
            version: 'v2.0',
            date: '2026-05-21',
            changes: [
                '✨ 全新GOLD EDITION黑金奢华UI设计',
                '🎨 采用渐变色彩和精致动画效果',
                '🌟 玻璃拟态设计，现代感十足',
                '🏆 符合主流文字模拟游戏的视觉风格',
                '📱 优化触控体验和动画流畅度',
                '✨ 添加噪声纹理和视觉层次效果'
            ]
        },
        {
            version: 'v1.1',
            date: '2026-05-21',
            changes: [
                '🔧 修复项目页面切换后卡住不动的问题',
                '💾 修复存档管理读取存档无响应的问题',
                '▶️ 修复继续游戏无法正常进入的问题',
                '📱 修复按钮点击和页面自动缩放的问题',
                '📝 完善更新日志显示功能'
            ]
        },
        {
            version: 'v1.0',
            date: '2026-05-20',
            changes: [
                '🏗️ 完整的项目详情管理界面',
                '📋 四证办理功能模块',
                '📐 设计管理功能模块',
                '👷 项目经理信息展示',
                '📊 项目进度阶段展示',
                '💎 按截图严格还原界面样式'
            ]
        },
        {
            version: 'v0.9',
            date: '2026-05-20',
            changes: [
                '📦 完善存档系统数据结构',
                '👤 个人页面标签页改为两排布局',
                '📜 优化滚动条样式，完整显示内容',
                '💾 存档包含所有要求的数据字段'
            ]
        },
        {
            version: 'v0.8',
            date: '2026-05-20',
            changes: [
                '📱 完善全设备响应式适配',
                '🖥️ 支持从手机到桌面设备完美显示',
                '🎯 触控设备优化体验',
                '📐 安全区域适配，支持刘海屏'
            ]
        },
        {
            version: 'v0.7',
            date: '2026-05-20',
            changes: [
                '📰 最近动态改为滚动式显示',
                '🔄 每条消息高度缩小，可同时浏览5-7条'
            ]
        },
        {
            version: 'v0.6',
            date: '2026-05-20',
            changes: [
                '📱 缩小底部导航栏高度，减少遮挡',
                '🏢 竞争对手全部使用虚拟公司名'
            ]
        },
        {
            version: 'v0.5',
            date: '2026-05-20',
            changes: [
                '💰 土地市场增加5000万起拍价土地',
                '📊 5000万土地占比20%且必存在',
                '🎲 土地随机排列，更自然的展示效果'
            ]
        },
        {
            version: 'v0.4',
            date: '2026-05-20',
            changes: [
                '🛠️ 修复总览页面事件时间显示问题',
                '🏗️ 土地市场新增4种土地类型筛选',
                '📅 每10天刷新随机土地',
                '📊 土地卡片新增详细信息展示',
                '🔢 显示占地、容积率、建面、限高',
                '💹 显示楼面价、起拍价、地房比',
                '📈 显示预估利润和开发类型',
                '🎯 不同类型有不同建安费用和利润率',
                '👇 右下角添加参与竞拍按钮'
            ]
        },
        {
            version: 'v0.3',
            date: '2026-05-20',
            changes: [
                '📱 完善底部导航两排布局',
                '📊 总览页面企业信息居中显示',
                '🏗️ 投资页面新增6个模块',
                '💰 资本页面新增4个模块',
                '🏷️ 品牌页面重构为3个模块',
                '👤 个人页面新增9个模块',
                '🎯 治理页面新增7个模块',
                '⚙️ 设置页面新增5个模块',
                '📈 资质系统新增经验条展示',
                '🌍 新增市场环境和宏观经济指标',
                '📰 新增最近动态和事件系统'
            ]
        },
        {
            version: 'v0.2',
            date: '2026-05-20',
            changes: [
                '📱 调整底部导航为两排布局',
                '📊 优化总览页面，添加公司名称展示',
                '⏱️ 修改时间系统为按天推进',
                '⚡ 调整时间倍速为1x/2x/3x',
                '📅 初始游戏时间改为2008年1月1日',
                '📰 实现每天随机生成新闻事件',
                '🏢 事件中使用虚拟公司名称'
            ]
        },
        {
            version: 'v0.1',
            date: '2026-05-20',
            changes: [
                '🚀 首次发布',
                '✨ 基础游戏框架搭建',
                '📊 财务系统实现',
                '🏗️ 项目开发系统',
                '👥 员工管理系统',
                '💾 存档系统',
                '🎮 主菜单界面',
                '📝 公司创建系统'
            ]
        }
    ],
    
    // 存档槽数量
    MAX_SAVE_SLOTS: 3,
    
    // 当前使用的存档槽
    currentSlot: null,
    
    // 初始化菜单
    init: function() {
        // 同步版本号显示
        const versionElem = document.getElementById('gameVersion');
        if (versionElem) {
            versionElem.textContent = this.VERSION;
        }
        this.checkContinueButton();
    },
    
    // 检查是否有存档可以继续
    checkContinueButton: function() {
        const hasAutoSave = this.getSave('auto') !== null;
        const hasSlot1 = this.getSave('slot_1') !== null;
        
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            if (hasAutoSave || hasSlot1) {
                continueBtn.disabled = false;
            } else {
                continueBtn.disabled = true;
                continueBtn.style.opacity = '0.5';
            }
        }
    },
    
    // 获取存档键名
    getSaveKey: function(slotId) {
        return 'realEstateGame_save_' + slotId;
    },
    
    // 获取存档
    getSave: function(slotId) {
        try {
            const data = localStorage.getItem(this.getSaveKey(slotId));
            if (data) {
                return JSON.parse(data);
            }
        } catch (e) {
            console.error('读取存档失败:', e);
        }
        return null;
    },
    
    // 保存存档
    saveToSlot: function(slotId, state) {
        try {
            const saveData = {
                version: this.VERSION,
                saveDate: new Date().toISOString(),
                gameState: state
            };
            localStorage.setItem(this.getSaveKey(slotId), JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('保存存档失败:', e);
            return false;
        }
    },
    
    // 删除存档
    deleteSave: function(slotId) {
        try {
            localStorage.removeItem(this.getSaveKey(slotId));
            return true;
        } catch (e) {
            console.error('删除存档失败:', e);
            return false;
        }
    },
    
    // 获取所有存档信息
    getAllSaves: function() {
        const saves = [];
        
        // 自动存档
        const autoSave = this.getSave('auto');
        saves.push({
            id: 'auto',
            name: '自动存档',
            data: autoSave
        });
        
        // 存档槽1-3
        for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
            const save = this.getSave('slot_' + i);
            saves.push({
                id: 'slot_' + i,
                name: '存档 ' + i,
                data: save
            });
        }
        
        return saves;
    },
    
    // 开始新游戏 - 进入公司创建界面
    newGame: function() {
        // 隐藏主菜单
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'none';
        }
        
        // 显示公司创建界面
        this.showCompanySetup();
    },
    
    // 显示公司创建界面
    showCompanySetup: function() {
        let html = this.renderCompanySetup();
        const mainContent = document.getElementById('app');
        if (mainContent) {
            mainContent.innerHTML = html;
            mainContent.style.display = 'flex';
        }
        
        // 绑定事件
        this.bindCompanySetupEvents();
    },
    
    // 渲染公司创建界面
    renderCompanySetup: function() {
        const cities = InitialData.getCities();
        const cityOptions = cities.map(function(city) {
            return '<option value="' + city.id + '">' + city.name + ' (均价: ' + Utils.formatMoney(city.avgPrice) + '/㎡)</option>';
        }).join('');
        
        return '<div class="company-setup">' +
            '<div class="setup-header">' +
                '<div class="setup-icon">🏢</div>' +
                '<h2 class="setup-title">创建你的房地产公司</h2>' +
                '<p class="setup-subtitle">填写公司信息，开启创业之旅</p>' +
            '</div>' +
            '<div class="setup-content">' +
                '<div class="form-group">' +
                    '<label class="form-label">📝 公司名称</label>' +
                    '<input type="text" id="companyName" class="form-input" placeholder="例如：未来地产有限公司" value="未来地产">' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">🏛️ 企业性质</label>' +
                    '<div class="radio-group">' +
                        '<label class="radio-option">' +
                            '<input type="radio" name="companyType" value="limited" checked>' +
                            '<span class="radio-mark"></span>' +
                            '<span class="radio-label">有限责任公司</span>' +
                        '</label>' +
                        '<label class="radio-option">' +
                            '<input type="radio" name="companyType" value="jointstock">' +
                            '<span class="radio-mark"></span>' +
                            '<span class="radio-label">股份有限公司</span>' +
                        '</label>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">👥 股权结构</label>' +
                    '<div class="option-grid">' +
                        '<div class="setup-option" data-equity="sole">' +
                            '<div class="option-icon">👤</div>' +
                            '<div class="option-title">独资运营</div>' +
                            '<div class="option-desc">创始人100%持股</div>' +
                        '</div>' +
                        '<div class="setup-option" data-equity="cofounder">' +
                            '<div class="option-icon">🤝</div>' +
                            '<div class="option-title">联合创始人</div>' +
                            '<div class="option-desc">创始人80%，联合创始人20%</div>' +
                        '</div>' +
                        '<div class="setup-option" data-equity="angel">' +
                            '<div class="option-icon">💰</div>' +
                            '<div class="option-title">天使投资人</div>' +
                            '<div class="option-desc">创始人60%，联合创始人20%，投资人20%</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">💵 注册资本</label>' +
                    '<div class="option-grid three-col">' +
                        '<div class="setup-option" data-capital="10000000">' +
                            '<div class="option-title">1000万</div>' +
                        '</div>' +
                        '<div class="setup-option" data-capital="30000000">' +
                            '<div class="option-title">3000万</div>' +
                        '</div>' +
                        '<div class="setup-option" data-capital="50000000">' +
                            '<div class="option-title">5000万</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="form-group">' +
                    '<label class="form-label">📍 注册地区</label>' +
                    '<select id="citySelect" class="form-select">' +
                        cityOptions +
                    '</select>' +
                '</div>' +
                '<div class="section-title">📊 公司预览</div>' +
                '<div class="card preview-card" id="companyPreview">' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">公司名称</span>' +
                        '<span class="preview-value" id="previewName">未来地产</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">企业类型</span>' +
                        '<span class="preview-value" id="previewType">有限责任公司</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">注册城市</span>' +
                        '<span class="preview-value" id="previewCity">北京市</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">城市均价</span>' +
                        '<span class="preview-value" id="previewAvgPrice">¥50,000/㎡</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">股权结构</span>' +
                        '<span class="preview-value" id="previewEquity">创始人100%</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">股东构成</span>' +
                        '<span class="preview-value" id="previewShareholders">创始人</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">分红策略</span>' +
                        '<span class="preview-value" id="previewDividend">按持股比例</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">注册资本</span>' +
                        '<span class="preview-value" id="previewCapital">¥10,000,000</span>' +
                    '</div>' +
                    '<div class="preview-item highlight">' +
                        '<span class="preview-label">初始资金</span>' +
                        '<span class="preview-value" id="previewFunds">¥10,000,000</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">资质等级</span>' +
                        '<span class="preview-value">四级</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">可开发面积</span>' +
                        '<span class="preview-value" id="previewArea">100,000㎡</span>' +
                    '</div>' +
                    '<div class="preview-item">' +
                        '<span class="preview-label">信用等级</span>' +
                        '<span class="preview-value">C级</span>' +
                    '</div>' +
                '</div>' +
                '<button class="btn btn-primary btn-full" id="startGameBtn" style="margin-top: 20px;">🚀 开始创业</button>' +
            '</div>' +
        '</div>';
    },
    
    // 绑定公司创建界面事件
    bindCompanySetupEvents: function() {
        const self = this;
        
        // 公司名称输入
        const nameInput = document.getElementById('companyName');
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                self.updateCompanyPreview();
            });
        }
        
        // 企业性质选择
        const companyTypeRadios = document.querySelectorAll('input[name="companyType"]');
        companyTypeRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                self.updateCompanyPreview();
            });
        });
        
        // 股权结构选择
        const equityOptions = document.querySelectorAll('[data-equity]');
        equityOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                equityOptions.forEach(function(o) { o.classList.remove('selected'); });
                this.classList.add('selected');
                self.updateCompanyPreview();
            });
        });
        
        // 默认选中第一个
        if (equityOptions.length > 0) {
            equityOptions[0].classList.add('selected');
        }
        
        // 注册资本选择
        const capitalOptions = document.querySelectorAll('[data-capital]');
        capitalOptions.forEach(function(option) {
            option.addEventListener('click', function() {
                capitalOptions.forEach(function(o) { o.classList.remove('selected'); });
                this.classList.add('selected');
                self.updateCompanyPreview();
            });
        });
        
        // 默认选中第一个
        if (capitalOptions.length > 0) {
            capitalOptions[0].classList.add('selected');
        }
        
        // 城市选择
        const citySelect = document.getElementById('citySelect');
        if (citySelect) {
            citySelect.addEventListener('change', function() {
                self.updateCompanyPreview();
            });
        }
        
        // 开始游戏按钮
        const startBtn = document.getElementById('startGameBtn');
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                self.confirmCreateCompany();
            });
        }
        
        // 初始更新预览
        this.updateCompanyPreview();
    },
    
    // 计算额外资金
    calculateExtraFunds: function(equityType) {
        switch (equityType) {
            case 'cofounder':
                return 10000000 + Math.random() * 20000000; // 1000万-3000万
            case 'angel':
                return 50000000 + Math.random() * 50000000; // 5000万-1亿
            default:
                return 0;
        }
    },
    
    // 获取股权结构信息
    getEquityInfo: function(equityType) {
        switch (equityType) {
            case 'cofounder':
                return {
                    text: '创始人80%，联合创始人20%',
                    shareholders: '创始人、联合创始人',
                    shares: [
                        { name: '创始人', percentage: 80 },
                        { name: '联合创始人', percentage: 20 }
                    ]
                };
            case 'angel':
                return {
                    text: '创始人60%，联合创始人20%，天使投资人20%',
                    shareholders: '创始人、联合创始人、天使投资人',
                    shares: [
                        { name: '创始人', percentage: 60 },
                        { name: '联合创始人', percentage: 20 },
                        { name: '天使投资人', percentage: 20 }
                    ]
                };
            default:
                return {
                    text: '创始人100%',
                    shareholders: '创始人',
                    shares: [
                        { name: '创始人', percentage: 100 }
                    ]
                };
        }
    },
    
    // 更新公司预览
    updateCompanyPreview: function() {
        const nameInput = document.getElementById('companyName');
        const companyTypeRadios = document.querySelectorAll('input[name="companyType"]:checked');
        const equityOption = document.querySelector('[data-equity].selected');
        const capitalOption = document.querySelector('[data-capital].selected');
        const citySelect = document.getElementById('citySelect');
        const cities = InitialData.getCities();
        
        const companyName = nameInput ? nameInput.value : '未来地产';
        const companyType = companyTypeRadios.length > 0 ? companyTypeRadios[0].value : 'limited';
        const equityType = equityOption ? equityOption.getAttribute('data-equity') : 'sole';
        const capital = capitalOption ? parseInt(capitalOption.getAttribute('data-capital')) : 10000000;
        const cityId = citySelect ? citySelect.value : cities[0].id;
        const city = cities.find(function(c) { return c.id === cityId; }) || cities[0];
        
        const equityInfo = this.getEquityInfo(equityType);
        const extraFunds = this.calculateExtraFunds(equityType);
        const totalFunds = capital + extraFunds;
        
        const previewName = document.getElementById('previewName');
        const previewType = document.getElementById('previewType');
        const previewCity = document.getElementById('previewCity');
        const previewAvgPrice = document.getElementById('previewAvgPrice');
        const previewEquity = document.getElementById('previewEquity');
        const previewShareholders = document.getElementById('previewShareholders');
        const previewCapital = document.getElementById('previewCapital');
        const previewFunds = document.getElementById('previewFunds');
        const previewArea = document.getElementById('previewArea');
        
        if (previewName) previewName.textContent = companyName;
        if (previewType) previewType.textContent = companyType === 'limited' ? '有限责任公司' : '股份有限公司';
        if (previewCity) previewCity.textContent = city.name;
        if (previewAvgPrice) previewAvgPrice.textContent = Utils.formatMoney(city.avgPrice) + '/㎡';
        if (previewEquity) previewEquity.textContent = equityInfo.text;
        if (previewShareholders) previewShareholders.textContent = equityInfo.shareholders;
        if (previewCapital) previewCapital.textContent = Utils.formatMoney(capital);
        if (previewFunds) previewFunds.textContent = Utils.formatMoney(totalFunds);
        if (previewArea) previewArea.textContent = '100,000㎡';
    },
    
    // 确认创建公司
    confirmCreateCompany: function() {
        const nameInput = document.getElementById('companyName');
        const companyTypeRadios = document.querySelectorAll('input[name="companyType"]:checked');
        const equityOption = document.querySelector('[data-equity].selected');
        const capitalOption = document.querySelector('[data-capital].selected');
        const citySelect = document.getElementById('citySelect');
        const cities = InitialData.getCities();
        
        const companyName = nameInput ? nameInput.value : '未来地产';
        const companyType = companyTypeRadios.length > 0 ? companyTypeRadios[0].value : 'limited';
        const equityType = equityOption ? equityOption.getAttribute('data-equity') : 'sole';
        const capital = capitalOption ? parseInt(capitalOption.getAttribute('data-capital')) : 10000000;
        const cityId = citySelect ? citySelect.value : cities[0].id;
        const city = cities.find(function(c) { return c.id === cityId; }) || cities[0];
        
        const equityInfo = this.getEquityInfo(equityType);
        const extraFunds = this.calculateExtraFunds(equityType);
        const totalFunds = capital + extraFunds;
        
        // 创建初始状态
        GameState.state = InitialData.createInitialStateWithParams({
            companyName: companyName,
            companyType: companyType,
            city: city,
            equityType: equityType,
            shareholders: equityInfo.shares,
            capital: capital,
            initialFunds: totalFunds
        });
        
        this.currentSlot = 'auto';
        
        // 进入游戏
        this.enterGame();
    },
    
    // 继续游戏
    continueGame: function() {
        // 优先读取自动存档，然后是存档1
        let saveData = this.getSave('auto');
        let slotName = '自动存档';
        
        if (!saveData) {
            saveData = this.getSave('slot_1');
            slotName = '存档 1';
            this.currentSlot = 'slot_1';
        } else {
            this.currentSlot = 'auto';
        }
        
        if (saveData) {
            this.loadGame(saveData, slotName);
        } else {
            UI.showToast('没有找到存档');
        }
    },
    
    // 加载游戏
    loadGame: function(saveData, slotName) {
        try {
            GameState.state = saveData.gameState;
            
            // 恢复日期对象
            if (GameState.state.date) {
                GameState.state.date = new Date(GameState.state.date);
            }
            
            // 恢复贷款日期
            if (GameState.state.loans) {
                GameState.state.loans.forEach(function(loan) {
                    if (loan.startDate) {
                        loan.startDate = new Date(loan.startDate);
                    }
                });
            }
            
            UI.showToast('✅ 已加载 ' + slotName);
            this.enterGame();
        } catch (e) {
            console.error('加载存档失败:', e);
            UI.showToast('存档损坏');
        }
    },
    
    // 显示存档管理
    showSaveManager: function() {
        const saves = this.getAllSaves();
        let html = '<div class="save-list">';
        
        saves.forEach(function(save) {
            if (save.data) {
                // 有存档
                const saveDate = new Date(save.data.saveDate);
                const state = save.data.gameState;
                const company = state && state.company ? state.company : null;
                
                html += '<div class="save-item">' +
                    '<div class="save-info">' +
                    '<div class="save-name">' + save.name + '</div>' +
                    '<div class="save-date">' + saveDate.toLocaleString('zh-CN') + '</div>';
                
                if (company) {
                    html += '<div class="save-stats">' +
                        '现金: ' + Utils.formatMoney(company.cash) +
                        ' | 资产: ' + Utils.formatMoney(company.totalAssets) +
                        (state.date ? ' | 日期: ' + Utils.formatDate(new Date(state.date)) : '') +
                        '</div>';
                }
                
                html += '</div>' +
                    '<div class="save-actions">' +
                    '<button class="btn btn-primary btn-small" onclick="MenuSystem.loadFromSlot(\'' + save.id + '\', \'' + save.name + '\')">读取</button>' +
                    '<button class="btn btn-danger btn-small" onclick="MenuSystem.deleteSaveConfirm(\'' + save.id + '\', \'' + save.name + '\')">删除</button>' +
                    '</div>' +
                    '</div>';
            } else {
                // 空存档
                html += '<div class="save-item empty">' +
                    '<div class="save-info">' +
                    '<div class="save-name">' + save.name + '</div>' +
                    '<div class="save-date">空存档</div>' +
                    '</div>' +
                    '<div class="save-actions">' +
                    '<button class="btn btn-secondary btn-small" disabled>---</button>' +
                    '</div>' +
                    '</div>';
            }
        });
        
        html += '</div>';
        
        UI.showModal(html, {
            title: '💾 存档管理'
        });
    },
    
    // 从指定存档槽读取
    loadFromSlot: function(slotId, slotName) {
        const saveData = this.getSave(slotId);
        if (saveData) {
            this.currentSlot = slotId;
            
            // 关闭对话框
            const overlay = document.querySelector('.modal-overlay');
            if (overlay) overlay.remove();
            
            this.loadGame(saveData, slotName);
        }
    },
    
    // 确认删除存档
    deleteSaveConfirm: function(slotId, slotName) {
        UI.showModal(
            '<p style="color: var(--text-secondary); margin-bottom: 10px;">确定要删除 <strong style="color: var(--accent);">' + slotName + '</strong> 吗？</p>' +
            '<p style="color: var(--danger); font-size: 13px;">此操作不可恢复！</p>',
            {
                title: '⚠️ 删除存档',
                footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>' +
                        '<button class="btn btn-danger" style="margin-left: 10px;" onclick="MenuSystem.confirmDelete(\'' + slotId + '\', \'' + slotName + '\')">确认删除</button>'
            }
        );
    },
    
    // 确认删除
    confirmDelete: function(slotId, slotName) {
        if (this.deleteSave(slotId)) {
            UI.showToast('✅ 已删除 ' + slotName);
            
            // 刷新存档管理界面
            const overlay = document.querySelector('.modal-overlay');
            if (overlay) overlay.remove();
            
            this.showSaveManager();
            this.checkContinueButton();
        }
    },
    
    // 显示更新日志
    showChangelog: function() {
        let html = '<div class="changelog-list">';
        
        this.CHANGELOG.forEach(function(log) {
            html += '<div class="changelog-item">' +
                '<div class="changelog-version">' + log.version + '</div>' +
                '<div class="changelog-date">' + log.date + '</div>' +
                '<div class="changelog-content"><ul>';
            
            log.changes.forEach(function(change) {
                html += '<li>' + change + '</li>';
            });
            
            html += '</ul></div></div>';
        });
        
        html += '</div>';
        
        UI.showModal(html, {
            title: '📝 更新日志'
        });
    },
    
    // 进入游戏
    enterGame: function() {
        // 隐藏菜单
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'none';
        }
        
        // 重置页面状态
        Pages.currentPage = 'overview';
        Pages.tabStates = {};
        
        // 重新构建游戏界面结构
        const gameApp = document.getElementById('app');
        if (gameApp) {
            gameApp.innerHTML = '' +
                '<header id="header" class="header">' +
                    '<div class="date-display" id="dateDisplay">2008年1月1日</div>' +
                    '<div class="time-controls">' +
                        '<button id="pauseBtn" class="time-btn active">⏸</button>' +
                        '<button id="speed1x" class="time-btn" data-speed="1">1x</button>' +
                        '<button id="speed2x" class="time-btn" data-speed="2">2x</button>' +
                        '<button id="speed3x" class="time-btn" data-speed="3">3x</button>' +
                        '<button class="time-btn" onclick="MenuSystem.returnToMenu()" title="返回菜单">🏠</button>' +
                    '</div>' +
                '</header>' +
                '<main id="mainContent" class="main-content"></main>' +
                '<nav id="bottomNav" class="bottom-nav">' +
                    '<div class="nav-row">' +
                        '<button class="nav-item active" data-page="overview">' +
                            '<span class="nav-icon">📊</span>' +
                            '<span class="nav-label">总览</span>' +
                        '</button>' +
                        '<button class="nav-item" data-page="investment">' +
                            '<span class="nav-icon">🏗️</span>' +
                            '<span class="nav-label">投资</span>' +
                        '</button>' +
                        '<button class="nav-item" data-page="project">' +
                            '<span class="nav-icon">📍</span>' +
                            '<span class="nav-label">项目</span>' +
                        '</button>' +
                        '<button class="nav-item" data-page="marketing">' +
                            '<span class="nav-icon">💎</span>' +
                            '<span class="nav-label">营销</span>' +
                        '</button>' +
                        '<button class="nav-item" data-page="operation">' +
                            '<span class="nav-icon">⚙️</span>' +
                            '<span class="nav-label">运营</span>' +
                        '</button>' +
                    '</div>' +
                    '<div class="nav-row">' +
                        '<button class="nav-item" data-page="capital">' +
                            '<span class="nav-icon">💰</span>' +
                            '<span class="nav-label">资本</span>' +
                        '</button>' +
                        '<button class="nav-item" data-page="brand">' +
                            '<span class="nav-icon">🏷️</span>' +
                            '<span class="nav-label">品牌</span>' +
                        '</button>' +
                        '<button class="nav-item" data-page="personal">' +
                            '<span class="nav-icon">👤</span>' +
                            '<span class="nav-label">个人</span>' +
                        '</button>' +
                        '<button class="nav-item" data-page="governance">' +
                            '<span class="nav-icon">📋</span>' +
                            '<span class="nav-label">治理</span>' +
                        '</button>' +
                        '<button class="nav-item" data-page="settings">' +
                            '<span class="nav-icon">⭐</span>' +
                            '<span class="nav-label">设置</span>' +
                        '</button>' +
                    '</div>' +
                '</nav>';
            gameApp.style.display = 'flex';
        }
        
        // 初始化游戏
        UI.init();
        App.init();
        // 确保时间系统初始化（即使是再次进入游戏也重置）
        TimeSystem.init();
        window.gameInitialized = true;
        
        // 自动存档
        this.autoSave();
    },
    
    // 返回菜单
    returnToMenu: function() {
        // 暂停游戏
        if (GameState.state) {
            GameState.state.isPaused = true;
        }
        
        // 先保存
        this.autoSave();
        
        // 显示确认对话框
        UI.showModal(
            '<p style="color: var(--text-secondary); margin-bottom: 10px;">确定要返回主菜单吗？</p>' +
            '<p style="color: var(--text-muted); font-size: 13px;">游戏进度已自动保存</p>',
            {
                title: '🏠 返回菜单',
                footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>' +
                        '<button class="btn btn-primary" style="margin-left: 10px;" onclick="MenuSystem.confirmReturnToMenu()">确定</button>'
            }
        );
    },
    
    // 确认返回菜单
    confirmReturnToMenu: function() {
        // 关闭对话框
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
        
        // 显示菜单
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) {
            mainMenu.style.display = 'flex';
        }
        
        // 隐藏游戏界面
        const gameApp = document.getElementById('app');
        if (gameApp) {
            gameApp.style.display = 'none';
        }
        
        // 更新继续按钮状态
        this.checkContinueButton();
    },
    
    // 自动保存
    autoSave: function() {
        if (GameState.state) {
            this.saveToSlot('auto', GameState.state);
        }
    },
    
    // 保存到指定槽位
    quickSave: function(slotId) {
        if (GameState.state) {
            if (this.saveToSlot(slotId, GameState.state)) {
                const slotName = slotId === 'auto' ? '自动存档' : slotId.replace('_', ' ');
                UI.showToast('✅ 已保存到 ' + slotName);
            }
        }
    }
};
