// 页面渲染
const Pages = {
    // 当前页面
    currentPage: 'overview',
    
    // 页面标签页状态
    tabStates: {},
    
    // 土地类型筛选
    landTypeFilter: null,
    
    // 渲染总览页面
    overview: function() {
        const state = GameState.get();
        const company = state.company;
        
        // 企业信息
        const companyTypeText = company.type === 'limited' ? '有限责任公司' : '股份有限公司';
        const debtRatio = company.liabilities > 0 ? ((company.liabilities / company.totalAssets) * 100).toFixed(1) : 0;
        
        // 资质升级进度
        const area = company.totalCompletedArea;
        let qualificationProgress = 0;
        let nextLevel = '';
        let nextLevelArea = 0;
        
        if (company.qualificationLevel === 4) {
            qualificationProgress = Math.min(100, (area / 50000) * 100);
            nextLevel = '三级';
            nextLevelArea = 50000;
        } else if (company.qualificationLevel === 3) {
            qualificationProgress = Math.min(100, ((area - 50000) / 200000) * 100);
            nextLevel = '二级';
            nextLevelArea = 250000;
        } else if (company.qualificationLevel === 2) {
            qualificationProgress = Math.min(100, ((area - 250000) / 750000) * 100);
            nextLevel = '一级';
            nextLevelArea = 1000000;
        } else {
            qualificationProgress = 100;
            nextLevel = '已达最高级';
            nextLevelArea = 1000000;
        }
        
        // 项目概览
        const activeProjects = state.projects.filter(function(p) {
            return p.status !== GameTypes.ProjectStatus.COMPLETED;
        });
        const ownedLand = state.land.filter(function(l) {
            return l.status === GameTypes.LandStatus.OWNED;
        });
        
        let html = '<div class="section-title">🏢 企业信息</div>' +
            '<div class="card">' +
                '<div style="text-align:center;margin-bottom:20px">' +
                    '<div style="font-size:24px;font-weight:700;color:#f97316">' + company.name + '</div>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:15px;text-align:center">' +
                    '<div>' +
                        '<div style="color:#94a3b8;font-size:12px">企业性质</div>' +
                        '<div style="font-weight:600">' + companyTypeText + '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="color:#94a3b8;font-size:12px">注册资本</div>' +
                        '<div style="font-weight:600">' + Utils.formatMoney(company.capital) + '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="color:#94a3b8;font-size:12px">信用等级</div>' +
                        '<div style="font-weight:600;color:#f97316">' + company.creditLevel + '级</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="color:#94a3b8;font-size:12px">资质等级</div>' +
                        '<div style="font-weight:600;color:#f97316">' + InitialData.getQualificationLevelName(company.qualificationLevel) + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="section-title">💰 财务状况</div>' +
            '<div class="finance-grid">' +
                UI.financeCard('现金', Utils.formatMoney(company.cash)) +
                UI.financeCard('总资产', Utils.formatMoney(company.totalAssets)) +
                UI.financeCard('负债率', debtRatio + '%') +
                UI.financeCard('月利润', Utils.formatMoney(company.monthlyProfit), company.monthlyProfit >= 0) +
            '</div>' +
            '<div class="card">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
                    '<span style="font-weight:600">资质升级进度</span>' +
                    '<span style="color:#94a3b8;font-size:12px">' + 
                        Utils.formatArea(area) + ' / ' + Utils.formatArea(nextLevelArea) + 
                    '</span>' +
                '</div>' +
                '<div class="progress-bar">' +
                    '<div class="progress-fill" style="width:' + qualificationProgress + '%"></div>' +
                '</div>' +
                '<div style="text-align:center;margin-top:8px;color:#94a3b8;font-size:12px">' +
                    (company.qualificationLevel < 1 ? '下一等级：' + nextLevel : nextLevel) +
                '</div>' +
            '</div>' +
            '<div class="section-title">📊 项目概览</div>' +
            '<div class="card">' +
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;text-align:center">' +
                    '<div>' +
                        '<div style="font-size:24px;font-weight:700;color:#3b82f6">' + activeProjects.length + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px">在建/预售</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="font-size:24px;font-weight:700;color:#22c55e">' + ownedLand.length + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px">土地储备</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="font-size:24px;font-weight:700;color:#f97316">' + Utils.formatArea(area) + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px">累计竣工</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="section-title">🌍 市场环境</div>' +
            '<div class="card">' +
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;text-align:center">' +
                    '<div>' +
                        '<div style="color:#94a3b8;font-size:12px">经济周期</div>' +
                        '<div style="font-weight:600">' + state.marketEnv.economicCycle + '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="color:#94a3b8;font-size:12px">房价指数</div>' +
                        '<div style="font-weight:600">' + state.marketEnv.housingPriceIndex.toFixed(1) + '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="color:#94a3b8;font-size:12px">市场需求</div>' +
                        '<div style="font-weight:600">' + state.marketEnv.marketDemand.toFixed(0) + '%</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="section-title">📈 宏观经济指标</div>' +
            '<div class="card">' +
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-size:12px">' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">GDP增速</span><span style="font-weight:600">' + state.macroData.gdpGrowth.toFixed(1) + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">CPI</span><span style="font-weight:600">' + state.macroData.cpi.toFixed(1) + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">M2增速</span><span style="font-weight:600">' + state.macroData.m2Growth.toFixed(1) + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">5Y-LPR</span><span style="font-weight:600">' + state.macroData.lpr5y.toFixed(1) + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">房贷利率</span><span style="font-weight:600">' + state.macroData.mortgageRate.toFixed(1) + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">汇率</span><span style="font-weight:600">' + state.macroData.exchangeRate.toFixed(1) + '</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">居民杠杆</span><span style="font-weight:600">' + state.macroData.householdLeverage.toFixed(1) + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">PMI</span><span style="font-weight:600">' + state.macroData.pmi.toFixed(1) + '</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">消费信心</span><span style="font-weight:600">' + state.macroData.consumerConfidence.toFixed(1) + '</span></div>' +
                '</div>' +
            '</div>' +
            '<div class="section-title">📰 最近动态</div>';
        
        // 渲染事件 - 滚动式显示
        html += '<div class="events-scroll-container">';
        
        if (state.events && state.events.length > 0) {
            state.events.slice(0, 7).forEach(function(event) {
                const typeColors = {
                    good: 'background:linear-gradient(135deg,#05966920,#22c55e20);border-left:3px solid #22c55e',
                    bad: 'background:linear-gradient(135deg,#dc262620,#ef444420);border-left:3px solid #ef4444',
                    competitor: 'background:linear-gradient(135deg,#7c3aed20,#8b5cf620);border-left:3px solid #8b5cf6',
                    player: 'background:linear-gradient(135deg,#0891b220,#06b6d420);border-left:3px solid #06b6d4',
                    project: 'background:linear-gradient(135deg,#d9770620,#f59e0b20);border-left:3px solid #f59e0b'
                };
                html += '<div class="event-item" style="' + (typeColors[event.type] || '') + '">' +
                    '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:4px">' +
                    '<div style="font-weight:600;font-size:13px">' + event.title + '</div>' +
                    '<div style="color:#94a3b8;font-size:10px">' + Utils.formatDate(new Date(event.date)) + '</div>' +
                    '</div>' +
                    '<div style="font-size:12px;line-height:1.4;color:#cbd5e1">' + event.message + '</div>' +
                    '</div>';
            });
        }
        
        html += '</div>';
        
        return html;
    },
    
    // 渲染投资页面
    investment: function() {
        const state = GameState.get();
        this.tabStates.investment = this.tabStates.investment || 0;
        const activeTab = this.tabStates.investment;
        
        const tabs = [
            { label: '城市研究' },
            { label: '土地市场' },
            { label: '土地储备' },
            { label: '市场趋势' },
            { label: '竞争对手' },
            { label: '资产交易' }
        ];
        
        let html = UI.tabs(tabs, activeTab);
        
        if (activeTab === 0) {
            // 城市研究
            html += '<div class="section-title">🏙 城市研究</div>';
            const cities = InitialData.getCities();
            cities.forEach(function(city) {
                html += '<div class="card">' +
                    '<div class="card-header">' +
                        '<div class="card-title">' + city.name + '</div>' +
                    '</div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">平均房价</div>' +
                            '<div style="font-weight:600;color:#f97316">' + Utils.formatMoney(city.avgPrice) + '</div>' +
                        '</div>' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">发展潜力</div>' +
                            '<div style="font-weight:600;color:#22c55e">' + (Math.floor(Math.random() * 30) + 70) + '%</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-top:10px;color:#94a3b8;font-size:13px">' +
                        city.name + '是热门投资城市，未来发展前景广阔' +
                    '</div>' +
                '</div>';
            });
        } else if (activeTab === 1) {
            // 土地市场 - 增强版
            html += '<div class="section-title">📍 土地市场</div>';
            
            // 显示土地类型筛选
            const landTypes = InitialData.getLandTypes();
            html += '<div style="display:flex;gap:8px;margin-bottom:16px;overflow-x:auto;padding:4px;">';
            landTypes.forEach(function(type, i) {
                const isActive = (!this.landTypeFilter && i === 0) || this.landTypeFilter === type;
                html += '<button class="btn btn-small" style="' + (isActive ? 'background:#f97316;color:white;border:none;' : '') + '" onclick="Pages.setLandTypeFilter(\'' + type + '\')">' + type + '</button>';
            }.bind(this));
            html += '</div>';
            
            if (!this.landTypeFilter && landTypes.length > 0) {
                this.landTypeFilter = landTypes[0];
            }
            
            const availableLand = state.land.filter(function(l) {
                return l.status === GameTypes.LandStatus.AVAILABLE && 
                       (l.landType === this.landTypeFilter || !l.landType);
            }.bind(this));
            
            if (availableLand.length === 0) {
                html += '<div class="card" style="text-align:center;color:#64748b;padding:40px">暂无可购买土地</div>';
            } else {
                availableLand.forEach(function(land) {
                    html += this.enhancedLandCard(land);
                }.bind(this));
            }
        } else if (activeTab === 2) {
            // 土地储备
            const myLand = state.land.filter(function(l) {
                return l.status === GameTypes.LandStatus.OWNED;
            });
            
            html += '<div class="section-title">🏗 土地储备</div>';
            if (myLand.length === 0) {
                html += '<div class="card" style="text-align:center;color:#64748b;padding:40px">暂无土地储备</div>';
            } else {
                myLand.forEach(function(land) {
                    html += '<div onclick="GameActions.startProject(\'' + land.id + '\')">' +
                        UI.landCard(land) +
                        '<button class="btn btn-primary btn-full" style="margin-top:-15px;border-radius:0 0 16px 16px">开发项目</button>' +
                    '</div>';
                });
            }
        } else if (activeTab === 3) {
            // 市场趋势
            html += '<div class="section-title">📈 市场趋势</div>' +
                '<div class="card">' +
                    '<div class="card-title">房地产市场指数</div>' +
                    '<div style="margin-top:15px">' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:10px">' +
                            '<span>房价指数</span>' +
                            '<span style="color:#22c55e;font-weight:600">' + (state.marketEnv?.housingPriceIndex || 1.0).toFixed(1) + '</span>' +
                        '</div>' +
                        '<div class="progress-bar">' +
                            '<div class="progress-fill" style="width:' + ((state.marketEnv?.housingPriceIndex || 1.0) * 70) + '%"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-top:15px">' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:10px">' +
                            '<span>市场需求</span>' +
                            '<span style="color:#3b82f6;font-weight:600">' + (state.marketEnv?.marketDemand || 75).toFixed(0) + '%</span>' +
                        '</div>' +
                        '<div class="progress-bar">' +
                            '<div class="progress-fill" style="width:' + (state.marketEnv?.marketDemand || 75) + '%;background:linear-gradient(90deg,#3b82f6 0%,#60a5fa 100%)"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">经济周期</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">当前处于：' + (state.marketEnv?.economicCycle || '稳定期') + '</div>' +
                '</div>';
        } else if (activeTab === 4) {
            // 竞争对手
            html += '<div class="section-title">🏢 竞争对手</div>';
            const competitors = InitialData.getVirtualCompanyNames();
            competitors.slice(0, 8).forEach(function(comp, i) {
                html += '<div class="card">' +
                    '<div class="card-header">' +
                        '<div class="card-title">' + comp + '</div>' +
                        '<span style="color:#94a3b8;font-size:12px">行业排名 #' + (i + 1) + '</span>' +
                    '</div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">市场份额</div>' +
                            '<div style="font-weight:600">' + (Math.random() * 8 + 2).toFixed(1) + '%</div>' +
                        '</div>' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">资金实力</div>' +
                            '<div style="font-weight:600;color:#22c55e">' + (Math.floor(Math.random() * 3) + 3) + '星</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            });
        } else if (activeTab === 5) {
            // 资产交易
            html += '<div class="section-title">💱 资产交易</div>' +
                '<div class="card">' +
                    '<div class="card-title">土地资产交易</div>' +
                    '<div class="card-subtitle">买卖土地资产，优化资产配置</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无交易记录</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">项目股权转让</div>' +
                    '<div class="card-subtitle">转让项目股权，获取资金回报</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无股权交易</div>' +
                '</div>';
        }
        
        return html;
    },
    
    // 渲染项目页面
    project: function() {
        const state = GameState.get();
        this.tabStates.project = this.tabStates.project || { list: true, activeProject: null, activeTab: 'certificates' };
        const ts = this.tabStates.project;
        
        // 如果没有活动项目，显示项目列表
        if (ts.list || !ts.activeProject) {
            let html = '<div class="section-title">🏗️ 我的项目</div>';
            
            if (state.projects.length === 0) {
                // 创建一个示例项目用于演示
                html += '<div class="card" style="cursor:pointer" onclick="Pages.openProjectDemo()">' +
                    '<div class="card-title">🎨 查看项目详情演示</div>' +
                    '<div class="card-subtitle">点击查看完整的项目管理界面</div>' +
                '</div>';
            } else {
                state.projects.forEach(function(project) {
                    html += '<div onclick="Pages.openProjectDetail(\'' + project.id + '\')">' +
                        UI.projectCard(project) +
                    '</div>';
                });
            }
            
            return html;
        } else {
            // 显示项目详情
            return this.renderProjectDetail(ts.activeProject, ts.activeTab);
        }
    },
    
    // 打开演示项目
    openProjectDemo: function() {
        this.tabStates.project = { list: false, activeProject: 'demo', activeTab: 'certificates' };
        GameState.notify();
    },
    
    // 打开项目详情
    openProjectDetail: function(projectId) {
        this.tabStates.project = { list: false, activeProject: projectId, activeTab: 'certificates' };
        GameState.notify();
    },
    
    // 切换项目标签
    switchProjectTab: function(tab) {
        this.tabStates.project.activeTab = tab;
        GameState.notify();
    },
    
    // 返回项目列表
    backToProjectList: function() {
        this.tabStates.project = { list: true, activeProject: null, activeTab: 'certificates' };
        GameState.notify();
    },
    
    // 渲染项目详情
    renderProjectDetail: function(projectId, activeTab) {
        const state = GameState.get();
        let project = InitialData.createDemoProject();
        if (state.projects.length > 0) {
            project = state.projects.find(p => p.id === projectId) || project;
        }
        
        // 确保有项目经理
        if (!project.projectManager && state.employees.length > 0) {
            project.projectManager = state.employees.find(e => e.type === GameTypes.EmployeeType.MANAGER);
        }
        
        let html = '';
        
        // 返回按钮
        html += '<div style="margin-bottom:16px">' +
            '<button class="btn btn-secondary" onclick="Pages.backToProjectList()">← 返回项目列表</button>' +
        '</div>';
        
        // 项目头部
        html += this.renderProjectHeader(project);
        
        // 项目经理信息
        html += this.renderProjectManager(project);
        
        // 下一步提示
        html += this.renderNextStep(project);
        
        // 标签页
        html += this.renderProjectTabs(project, activeTab);
        
        // 标签页内容
        switch (activeTab) {
            case 'preparation':
                html += this.renderPreparationTab(project, state);
                break;
            case 'approval':
                html += this.renderApprovalTab(project, state);
                break;
            case 'construction':
                html += this.renderConstructionTab(project, state);
                break;
            case 'presale':
                html += this.renderPresaleTab(project, state);
                break;
            case 'marketing':
                html += this.renderMarketingTab(project, state);
                break;
            case 'contracting':
                html += this.renderContractingTab(project, state);
                break;
            case 'delivery':
                html += this.renderDeliveryTab(project, state);
                break;
            case 'finance':
                html += this.renderProjectFinanceTab(project, state);
                break;
        }
        
        return html;
    },
    
    // 渲染项目头部
    renderProjectHeader: function(project) {
        return '<div class="card project-header">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">' +
                '<div>' +
                    '<div style="font-size:20px;font-weight:700;display:flex;align-items:center;gap:8px">' +
                        project.name +
                        '<span class="level-badge level-' + project.level + '">🏙️ ' + project.level + '</span>' +
                    '</div>' +
                    '<div style="color:#94a3b8;font-size:13px;margin-top:6px">' +
                        project.city + ' · ' + project.name + ' 建面 ' + Utils.formatArea(project.area) + '㎡ ' + 
                        project.type + ' <span style="color:#f97316;font-weight:600">' + project.saleType + '</span>' +
                    '</div>' +
                '</div>' +
                '<span class="status-badge status-' + project.status + '">' + project.status + '</span>' +
            '</div>' +
            // 项目进度阶段
            '<div class="project-stages">' +
                project.stages.map(function(stage, idx) {
                    return '<div class="stage-item ' + (stage.active ? 'active' : '') + ' ' + (stage.completed ? 'completed' : '') + '">' +
                        '<div class="stage-icon">' + (stage.completed ? '✓' : (['📋','📐','🏗️','🏠','💰','🎉','🔑','✅'][idx] || '○')) + '</div>' +
                        '<div class="stage-name">' + stage.name + '</div>' +
                    '</div>';
                }).join('') +
            '</div>' +
        '</div>';
    },
    
    // 渲染项目经理信息
    renderProjectManager: function(project) {
        const pm = project.projectManager;
        if (!pm) {
            return '<div class="card">' +
                '<div class="card-title">👷 暂无项目经理</div>' +
                '<div class="card-subtitle" style="margin-top:8px">请先招聘项目经理</div>' +
            '</div>';
        }
        
        let starsHtml = '';
        for (let i = 0; i < pm.stars; i++) starsHtml += '⭐';
        
        return '<div class="card project-manager">' +
            '<div class="card-title" style="margin-bottom:12px">👷 项目经理</div>' +
            '<div style="display:flex;gap:12px;align-items:flex-start">' +
                '<div class="pm-avatar">👨‍💼</div>' +
                '<div style="flex:1">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
                        '<div style="display:flex;align-items:center;gap:8px">' +
                            '<span style="font-size:16px;font-weight:700">' + pm.name + '</span>' +
                            '<span class="personality-badge">' + pm.personality + '</span>' +
                            '<span style="color:#f97316">' + starsHtml + '</span>' +
                        '</div>' +
                        '<div style="color:#94a3b8">月薪 ' + Utils.formatMoney(pm.salary) + '</div>' +
                    '</div>' +
                    '<div style="margin-top:10px;display:flex;gap:12px;flex-wrap:wrap">' +
                        (pm.effect.quality ? '<span style="color:#22c55e">加成: 质量+' + pm.effect.quality + '%</span>' : '') +
                        (pm.effect.cost ? '<span style="color:#f97316">成本' + pm.effect.cost + '%</span>' : '') +
                        (pm.effect.speed ? '<span style="color:#3b82f6">速度+' + pm.effect.speed + '%</span>' : '') +
                        (pm.effect.sales ? '<span style="color:#ec4899">销售+' + pm.effect.sales + '%</span>' : '') +
                    '</div>' +
                    '<div style="margin-top:8px;color:#94a3b8;font-size:13px">' + pm.description + '</div>' +
                    '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap">' +
                        '<button class="btn btn-secondary btn-sm" onclick="GameActions.toggleAutoMode(\'' + project.id + '\')">' +
                            '🔧 自动模式: ' + (project.autoMode ? '开' : '关') +
                        '</button>' +
                        '<button class="btn btn-danger btn-sm" onclick="GameActions.fireManager(\'' + project.id + '\')">' +
                            '解雇' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    },
    
    // 渲染下一步提示
    renderNextStep: function(project) {
        return '<div class="card next-step-card">' +
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
                '<span>⏩ 下一步: 点击「开始办理」国有土地使用证</span>' +
                '<button class="btn btn-primary btn-sm" onclick="GameActions.handleNextStep(\'' + project.id + '\')">前往</button>' +
            '</div>' +
        '</div>';
    },
    
    // 渲染项目标签页
    renderProjectTabs: function(project, activeTab) {
        const tabs = [
            { id: 'preparation', label: '前期筹备' },
            { id: 'approval', label: '报批报建' },
            { id: 'construction', label: '工程管理' },
            { id: 'presale', label: '预售开盘' },
            { id: 'marketing', label: '营销蓄客' },
            { id: 'contracting', label: '签约回款' },
            { id: 'delivery', label: '竣工交付' },
            { id: 'finance', label: '资金管理' }
        ];
        
        return '<div class="project-tabs">' +
            tabs.map(function(tab) {
                return '<button class="project-tab ' + (tab.id === activeTab ? 'active' : '') + '" ' +
                    'onclick="Pages.switchProjectTab(\'' + tab.id + '\')">' +
                    tab.label +
                '</button>';
            }).join('') +
        '</div>';
    },
    
    // 渲染四证办理标签页
    renderCertificatesTab: function(project, state) {
        return '<div class="section-title" style="margin-top:16px">📋 四证办理流程</div>' +
            '<div class="card">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                    '<span style="font-weight:600">公司可用现金</span>' +
                    '<span style="color:#22c55e;font-size:20px;font-weight:700">' + Utils.formatMoney(state.company.cash) + '</span>' +
                '</div>' +
                '<div style="color:#94a3b8;font-size:13px">按顺序办理：用地规划→工程规划→施工许可→预售许可</div>' +
            '</div>' +
            project.certificates.map(function(cert) {
                let statusClass = 'pending';
                let statusText = '待办理';
                let buttonText = '申请办理';
                let buttonClass = 'btn-primary';
                let buttonDisabled = !cert.unlocked;
                
                if (cert.status === 'processing') {
                    statusClass = 'processing';
                    statusText = '办理中';
                    buttonText = '办理中...';
                    buttonClass = 'btn-secondary';
                    buttonDisabled = true;
                } else if (cert.status === 'completed') {
                    statusClass = 'completed';
                    statusText = '已完成';
                    buttonText = '已完成';
                    buttonClass = 'btn-secondary';
                    buttonDisabled = true;
                }
                
                return '<div class="card cert-card cert-' + statusClass + '">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="font-weight:600">' + cert.name + '</span>' +
                        '<span class="cert-status status-' + statusClass + '">' + statusText + '</span>' +
                    '</div>' +
                    (cert.unlocked ? 
                        '<div style="margin-top:12px;text-align:right">' +
                            '<button class="btn ' + buttonClass + ' btn-sm" ' + 
                                (buttonDisabled ? 'disabled' : 'onclick="GameActions.applyCertificate(\'' + project.id + '\', \'' + cert.name + '\')"') +
                            '>' + buttonText + '</button>' +
                        '</div>' : ''
                    ) +
                '</div>';
            }).join('');
    },
    
    // 渲染设计管理标签页
    renderDesignTab: function(project) {
        const design = project.design;
        const positions = ['刚需', '改善', '高端'];
        const facades = ['现代简约', '新中式', 'ArtDeco', '法式'];
        
        return '<div class="section-title" style="margin-top:16px">📐 设计总览</div>' +
            '<div class="card">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                    '<span style="font-weight:600">当前阶段</span>' +
                    '<span style="color:#3b82f6">' + design.phase + '</span>' +
                '</div>' +
                '<div style="margin-bottom:16px">' +
                    '<div style="color:#94a3b8;font-size:13px;margin-bottom:8px">项目定位</div>' +
                    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
                        positions.map(function(pos) {
                            return '<button class="btn ' + (design.positioning === pos ? 'btn-primary' : 'btn-secondary') + ' btn-sm" ' +
                                'onclick="GameActions.setPositioning(\'' + project.id + '\', \'' + pos + '\')">' + pos + '</button>';
                        }).join('') +
                    '</div>' +
                '</div>' +
                '<div style="margin-bottom:16px">' +
                    '<div style="color:#94a3b8;font-size:13px;margin-bottom:8px">外立面风格</div>' +
                    '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
                        facades.map(function(facade) {
                            return '<button class="btn ' + (design.facade === facade ? 'btn-primary' : 'btn-secondary') + ' btn-sm" ' +
                                'onclick="GameActions.setFacade(\'' + project.id + '\', \'' + facade + '\')">' + facade + '</button>';
                        }).join('') +
                    '</div>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr;gap:12px">' +
                    '<div style="display:flex;justify-content:space-between">' +
                        '<span style="color:#94a3b8">成本系数</span>' +
                        '<span style="font-weight:600">×' + design.costCoefficient.toFixed(2) + '</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between">' +
                        '<span style="color:#94a3b8">售价系数</span>' +
                        '<span style="font-weight:600">×' + design.priceCoefficient.toFixed(2) + '</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between">' +
                        '<span style="color:#94a3b8">需求系数</span>' +
                        '<span style="font-weight:600">×' + design.demandCoefficient.toFixed(2) + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="card" style="margin-top:16px">' +
                '<div class="card-title">📊 规划指标</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px">' +
                    '<span style="font-weight:600">容积率</span>' +
                    '<span style="font-weight:600">' + design.plotRatio.toFixed(2) + ' (上限 ' + design.plotRatioLimit.toFixed(2) + ')</span>' +
                '</div>' +
            '</div>';
    },
    
    // 渲染前期筹备标签页
    renderPreparationTab: function(project, state) {
        return ProjectPages.renderPreparationTab(project, state);
    },
    
    // 渲染报批报建标签页
    renderApprovalTab: function(project, state) {
        return ProjectPages.renderApprovalTab(project, state);
    },
    
    // 渲染工程管理标签页
    renderConstructionTab: function(project, state) {
        return ProjectPages.renderConstructionTab(project, state);
    },
    
    // 渲染预售开盘标签页
    renderPresaleTab: function(project, state) {
        return ProjectPages.renderPresaleTab(project, state);
    },
    
    // 渲染营销蓄客标签页
    renderMarketingTab: function(project, state) {
        return ProjectPages.renderMarketingTab(project, state);
    },
    
    // 渲染签约回款标签页
    renderContractingTab: function(project, state) {
        return ProjectPages.renderContractingTab(project, state);
    },
    
    // 渲染竣工交付标签页
    renderDeliveryTab: function(project, state) {
        return ProjectPages.renderDeliveryTab(project, state);
    },
    
    // 渲染项目资金管理标签页
    renderProjectFinanceTab: function(project, state) {
        return ProjectPages.renderProjectFinanceTab(project, state);
    },
    
    // 渲染营销页面
    marketing: function() {
        const state = GameState.get();
        this.tabStates.marketing = this.tabStates.marketing || 0;
        const activeTab = this.tabStates.marketing;
        
        const tabs = [
            { label: '品牌建设' },
            { label: '预售开盘' },
            { label: '营销蓄客' }
        ];
        
        let html = UI.tabs(tabs, activeTab);
        
        if (activeTab === 0) {
            html += '<div class="section-title">🌟 品牌建设</div>' +
                '<div class="card">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
                        '<div>' +
                            '<div style="font-size:24px;font-weight:700">' + state.company.brandValue + '</div>' +
                            '<div style="color:#64748b;font-size:13px">品牌价值</div>' +
                        '</div>' +
                        '<div style="text-align:right">' +
                            '<div style="font-size:13px;color:#94a3b8">对售价影响</div>' +
                            '<div style="font-weight:700;color:#22c55e">+' + Math.round(state.company.brandValue / 2) + '%</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="progress-bar">' +
                        '<div class="progress-fill" style="width:' + Math.min(100, state.company.brandValue / 2) + '%"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" onclick="GameActions.brandUpgrade()" style="cursor:pointer">' +
                    '<div class="card-title">🔝 品牌升级</div>' +
                    '<div class="card-subtitle">投入资金提升品牌价值</div>' +
                    '<div style="margin-top:10px;color:#f97316;font-weight:600">单次投入: ' + Utils.formatMoney(1000000) + '</div>' +
                '</div>';
        } else if (activeTab === 1) {
            // 预售开盘
            const activeProject = state.projects.find(function(p) {
                return p.status === GameTypes.ProjectStatus.PRESALE || p.status === GameTypes.ProjectStatus.CONSTRUCTION;
            });
            
            if (!activeProject) {
                html += '<div class="section-title">💰 预售开盘</div>' +
                    '<div class="card">' +
                        '<div class="card-title">暂无预售项目</div>' +
                        '<div class="card-subtitle">请先在项目页面选择项目并申请预售许可</div>' +
                    '</div>';
            } else {
                html += '<div class="section-title">💰 预售开盘 - ' + activeProject.name + '</div>';
                html += this.renderPresaleTab(activeProject, state);
            }
        } else {
            // 营销蓄客
            const activeProject = state.projects.find(function(p) {
                return p.status === GameTypes.ProjectStatus.PRESALE || p.status === GameTypes.ProjectStatus.CONSTRUCTION;
            });
            
            if (!activeProject) {
                html += '<div class="section-title">📣 营销蓄客</div>' +
                    '<div class="card">' +
                        '<div class="card-title">暂无营销项目</div>' +
                        '<div class="card-subtitle">请先在项目页面选择项目</div>' +
                    '</div>';
            } else {
                html += '<div class="section-title">📣 营销蓄客 - ' + activeProject.name + '</div>';
                html += this.renderMarketingTab(activeProject, state);
            }
        }
        
        return html;
    },
    
    // 渲染运营页面
    operation: function() {
        const state = GameState.get();
        this.tabStates.operation = this.tabStates.operation || 0;
        const activeTab = this.tabStates.operation;
        
        const tabs = [
            { label: '员工管理' },
            { label: '招聘市场' }
        ];
        
        let html = UI.tabs(tabs, activeTab);
        
        if (activeTab === 0) {
            // 员工管理
            const activeEmployees = state.employees.filter(function(e) {
                return e.status !== GameTypes.EmployeeStatus.FIRED;
            });
            
            html += '<div class="section-title">👥 我的员工</div>';
            if (activeEmployees.length === 0) {
                html += '<div class="card" style="text-align:center;color:#64748b;padding:40px">暂无员工，去招聘市场看看吧！</div>';
            } else {
                activeEmployees.forEach(function(emp) {
                    html += UI.employeeCard(emp);
                });
            }
        } else {
            // 招聘市场
            html += '<div class="section-title">🎯 招聘市场</div>';
            const available = InitialData.getAvailableEmployees();
            available.forEach(function(emp) {
                const isHired = state.employees.some(function(e) {
                    return e.id === emp.id;
                });
                if (!isHired) {
                    html += '<div onclick="GameActions.hireEmployee(\'' + emp.id + '\')">' +
                        UI.employeeCard(emp) +
                        '<button class="btn btn-primary btn-full" style="margin-top:-15px;border-radius:0 0 16px 16px">招聘 (月薪: ' + Utils.formatMoney(emp.salary) + ')</button>' +
                    '</div>';
                }
            });
        }
        
        return html;
    },
    
    // 渲染资本页面 - 增强版
    capital: function() {
        const state = GameState.get();
        this.tabStates.capital = this.tabStates.capital || 0;
        const activeTab = this.tabStates.capital;
        
        const tabs = [
            { label: '银行中心' },
            { label: '融资中心' },
            { label: '三条红线' },
            { label: '财务报表' }
        ];
        
        let html = UI.tabs(tabs, activeTab);
        
        if (activeTab === 0) {
            // 银行中心
            html += this.renderBankCenter(state);
        } else if (activeTab === 1) {
            // 融资中心
            html += this.renderFinancingCenter(state);
        } else if (activeTab === 2) {
            // 三条红线
            html += this.renderThreeRedLines(state);
        } else if (activeTab === 3) {
            // 财务报表
            html += this.renderFinancialStatements(state);
        }
        
        return html;
    },
    
    // 渲染银行中心
    renderBankCenter: function(state) {
        let html = '<div class="section-title">🏦 银行中心</div>';
        
        // 银行卡片
        const banks = InitialData.getBanks();
        banks.forEach(function(bank) {
            const relation = state.bankRelations[bank.id] || { relation: 50, totalLoans: 0 };
            const relationLevel = this.getRelationLevel(relation.relation);
            const relationColor = relationLevel === 'excellent' ? '#22c55e' : 
                                 relationLevel === 'normal' ? '#f59e0b' : 
                                 relationLevel === 'poor' ? '#ef4444' : '#dc2626';
            
            // 计算实际利率
            let rateAdjustment = 0;
            let quotaMultiplier = 1;
            if (relation.relation > 80) {
                rateAdjustment = -0.003;
                quotaMultiplier = 1.2;
            } else if (relation.relation >= 50 && relation.relation <= 79) {
                // 正常
            } else if (relation.relation >= 30 && relation.relation <= 49) {
                rateAdjustment = 0.003;
                quotaMultiplier = 0.8;
            }
            
            const actualRate = ((bank.baseRate + rateAdjustment) * 100).toFixed(1);
            
            html += '<div class="card" style="cursor:pointer" onclick="CapitalActions.openBank(\'' + bank.id + '\')">' +
                '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">' +
                    '<div>' +
                        '<div style="font-size:18px;font-weight:700">' + bank.name + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' + bank.feature + '</div>' +
                    '</div>' +
                    '<div style="text-align:right">' +
                        '<div style="font-size:20px;font-weight:700;color:#22c55e">' + actualRate + '%</div>' +
                        '<div style="color:#94a3b8;font-size:11px">实际利率</div>' +
                    '</div>' +
                '</div>' +
                '<div style="margin-bottom:10px">' +
                    '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                        '<span style="color:#94a3b8;font-size:12px">关系值</span>' +
                        '<span style="font-weight:600;color:' + relationColor + ';font-size:14px">' + relation.relation + '</span>' +
                    '</div>' +
                    '<div class="progress-bar" style="height:10px">' +
                        '<div class="progress-fill" style="width:' + relation.relation + '%;background:' + relationColor + '"></div>' +
                    '</div>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;font-size:12px">' +
                    '<div style="color:#94a3b8">基础利率: <span style="color:#f97316;font-weight:600">' + (bank.baseRate * 100).toFixed(1) + '%</span></div>' +
                    '<div style="color:#94a3b8">额度系数: <span style="color:#22c55e;font-weight:600">×' + quotaMultiplier.toFixed(1) + '</span></div>' +
                '</div>' +
                '<div style="margin-top:12px;padding:8px;background:rgba(59,130,246,0.1);border-radius:8px;font-size:12px;color:#94a3b8">' +
                    '💡 ' + bank.description +
                '</div>' +
            '</div>';
        }.bind(this));
        
        // 存款产品
        html += '<div style="margin-top:20px"></div><div class="section-title">💰 存款产品</div>';
        const deposits = InitialData.getDepositProducts();
        deposits.forEach(function(deposit) {
            html += '<div class="card">' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<div>' +
                        '<div style="font-weight:600">' + deposit.name + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' + deposit.description + '</div>' +
                    '</div>' +
                    '<div style="text-align:right">' +
                        '<div style="font-size:20px;font-weight:700;color:#22c55e">' + (deposit.rate * 100).toFixed(1) + '%</div>' +
                        '<div style="color:#94a3b8;font-size:11px">年利率</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
        });
        
        // 贷款记录
        html += '<div style="margin-top:20px"></div><div class="section-title">📋 贷款记录</div>';
        if (state.loans && state.loans.length > 0) {
            state.loans.forEach(function(loan) {
                const statusColor = loan.status === GameTypes.LoanStatus.ACTIVE ? '#22c55e' : 
                                   loan.status === GameTypes.LoanStatus.PAID ? '#94a3b8' : '#ef4444';
                html += '<div class="card">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
                        '<div style="font-weight:600">' + loan.bankName + ' - ' + loan.productName + '</div>' +
                        '<span style="color:' + statusColor + ';font-weight:600;font-size:12px">' + 
                            (loan.status === GameTypes.LoanStatus.ACTIVE ? '进行中' : 
                             loan.status === GameTypes.LoanStatus.PAID ? '已还清' : '已违约') + '</span>' +
                    '</div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;font-size:12px">' +
                        '<div><span style="color:#94a3b8">金额:</span> <span style="font-weight:600">' + Utils.formatMoney(loan.amount) + '</span></div>' +
                        '<div><span style="color:#94a3b8">利率:</span> <span style="font-weight:600;color:#22c55e">' + (loan.interestRate * 100).toFixed(1) + '%</span></div>' +
                        '<div><span style="color:#94a3b8">期限:</span> <span style="font-weight:600">' + loan.term + '月</span></div>' +
                    '</div>' +
                '</div>';
            });
        } else {
            html += '<div class="card" style="text-align:center;color:#64748b;padding:40px">暂无贷款记录</div>';
        }
        
        return html;
    },
    
    // 渲染融资中心
    renderFinancingCenter: function(state) {
        let html = '<div class="section-title">💵 融资中心</div>';
        
        // 股权融资
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                '<div style="font-weight:700;font-size:16px">📈 股权融资</div>' +
                '<span style="background:rgba(34,197,94,0.2);color:#22c55e;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600">股权稀释</span>' +
            '</div>';
        
        const fundingRounds = InitialData.getFundingRounds();
        const completedRounds = state.fundingHistory ? state.fundingHistory.length : 0;
        
        fundingRounds.forEach(function(round, index) {
            const isCompleted = index < completedRounds;
            const isCurrent = index === completedRounds;
            const isLocked = index > completedRounds;
            
            let bgColor = 'rgba(148,163,184,0.1)';
            let borderColor = 'rgba(148,163,184,0.3)';
            let statusText = '🔒 待解锁';
            let opacity = 0.5;
            
            if (isCompleted) {
                bgColor = 'rgba(34,197,94,0.1)';
                borderColor = 'rgba(34,197,94,0.3)';
                statusText = '✅ 已完成';
                opacity = 1;
            } else if (isCurrent) {
                bgColor = 'rgba(249,115,22,0.1)';
                borderColor = 'rgba(249,115,22,0.3)';
                statusText = '🔥 当前可申请';
                opacity = 1;
            }
            
            html += '<div style="padding:12px;background:' + bgColor + ';border:1px solid ' + borderColor + ';border-radius:12px;margin-bottom:10px;opacity:' + opacity + ';cursor:' + (isCurrent ? 'pointer' : 'default') + '" ' + (isCurrent ? 'onclick="CapitalActions.applyFunding(\'' + round.id + '\')"' : '') + '>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
                    '<div style="font-weight:600">' + round.name + '</div>' +
                    '<span style="font-size:12px">' + statusText + '</span>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px;color:#94a3b8">' +
                    '<div>稀释比例: ' + (round.dilutionMin * 100).toFixed(0) + '%-' + (round.dilutionMax * 100).toFixed(0) + '%</div>' +
                    '<div>估值倍率: ' + round.valuationMultiple.min + 'x-' + round.valuationMultiple.max + 'x</div>' +
                    '<div>营收门槛: ' + (round.revenueThreshold > 0 ? Utils.formatMoney(round.revenueThreshold) : '无') + '</div>' +
                    '<div>' + round.description + '</div>' +
                '</div>' +
            '</div>';
        });
        
        html += '</div>';
        
        // 债券融资
        if (state.listedStatus && state.listedStatus.isListed) {
            html += '<div class="card" style="margin-top:16px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                    '<div style="font-weight:700;font-size:16px">📊 债券融资</div>' +
                    '<span style="background:rgba(59,130,246,0.2);color:#3b82f6;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600">上市公司</span>' +
                '</div>' +
                '<div style="color:#94a3b8;font-size:13px;text-align:center;padding:20px">' +
                    '🏢 公司已上市，可以发行债券融资' +
                '</div>' +
            '</div>';
        } else {
            html += '<div class="card" style="margin-top:16px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                    '<div style="font-weight:700;font-size:16px">📊 债券融资</div>' +
                    '<span style="background:rgba(148,163,184,0.2);color:#94a3b8;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:600">未上市</span>' +
                '</div>' +
                '<div style="color:#94a3b8;font-size:13px;text-align:center;padding:20px">' +
                    '🔒 完成IPO后可发行公司债券' +
                '</div>' +
            '</div>';
        }
        
        return html;
    },
    
    // 渲染三条红线
    renderThreeRedLines: function(state) {
        let html = '<div class="section-title">📊 三条红线监测</div>';
        
        const redLine = state.redLineStatus || {};
        
        // 当前档位
        const tierColors = {
            green: { bg: 'rgba(34,197,94,0.2)', text: '#22c55e', label: '🟢 绿档' },
            yellow: { bg: 'rgba(245,158,11,0.2)', text: '#f59e0b', label: '🟡 黄档' },
            orange: { bg: 'rgba(249,115,22,0.2)', text: '#f97316', label: '🟠 橙档' },
            red: { bg: 'rgba(239,68,68,0.2)', text: '#ef4444', label: '🔴 红档' }
        };
        
        const tier = redLine.tier || GameTypes.RedLineTier.GREEN;
        const tierInfo = tierColors[tier];
        
        html += '<div class="card" style="background:' + tierInfo.bg + ';border-color:' + tierInfo.text + ';margin-bottom:20px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
                '<div>' +
                    '<div style="font-size:18px;font-weight:700;color:' + tierInfo.text + '">' + tierInfo.label + '</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' + this.getTierDescription(tier) + '</div>' +
                '</div>' +
                '<div style="font-size:32px;font-weight:800;color:' + tierInfo.text + '">' + this.getTierChinese(tier) + '</div>' +
            '</div>' +
        '</div>';
        
        // 红线一：剔除预收款资产负债率
        const assetLiabRatio = redLine.assetLiabilityRatio || 0;
        const assetLiabStatus = assetLiabRatio > 70 ? '🔴' : assetLiabRatio > 60 ? '🟡' : '🟢';
        
        html += '<div class="card" style="margin-bottom:16px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div style="font-weight:600">红线一 ' + assetLiabStatus + ' 剔除预收款资产负债率</div>' +
                '<span style="font-size:20px;font-weight:700;color:' + (assetLiabRatio > 70 ? '#ef4444' : '#22c55e') + '">' + assetLiabRatio.toFixed(1) + '%</span>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                '<span style="color:#94a3b8;font-size:12px">标准: ≤70%</span>' +
                '<span style="color:#ef4444;font-size:12px">阈值: 70%</span>' +
            '</div>' +
            '<div class="progress-bar" style="height:12px">' +
                '<div class="progress-fill" style="width:' + Math.min(100, assetLiabRatio) + '%;background:' + (assetLiabRatio > 70 ? '#ef4444' : '#22c55e') + '"></div>' +
            '</div>' +
            '<div style="margin-top:10px;font-size:12px;color:' + (assetLiabRatio > 70 ? '#ef4444' : '#94a3b8') + '">' +
                (assetLiabRatio > 70 ? '⚠️ 已踩红线！需要降低负债率' : '✅ 符合标准') +
            '</div>' +
        '</div>';
        
        // 红线二：净负债率
        const netDebtRatio = redLine.netDebtRatio || 50;
        const netDebtStatus = netDebtRatio > 100 ? '🔴' : netDebtRatio > 80 ? '🟡' : '🟢';
        
        html += '<div class="card" style="margin-bottom:16px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div style="font-weight:600">红线二 ' + netDebtStatus + ' 净负债率</div>' +
                '<span style="font-size:20px;font-weight:700;color:' + (netDebtRatio > 100 ? '#ef4444' : '#22c55e') + '">' + netDebtRatio.toFixed(1) + '%</span>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                '<span style="color:#94a3b8;font-size:12px">标准: ≤100%</span>' +
                '<span style="color:#ef4444;font-size:12px">阈值: 100%</span>' +
            '</div>' +
            '<div class="progress-bar" style="height:12px">' +
                '<div class="progress-fill" style="width:' + Math.min(100, netDebtRatio) + '%;background:' + (netDebtRatio > 100 ? '#ef4444' : '#22c55e') + '"></div>' +
            '</div>' +
            '<div style="margin-top:10px;font-size:12px;color:' + (netDebtRatio > 100 ? '#ef4444' : '#94a3b8') + '">' +
                (netDebtRatio > 100 ? '⚠️ 已踩红线！需要降低净负债' : '✅ 符合标准') +
            '</div>' +
        '</div>';
        
        // 红线三：现金短债比
        const cashRatio = redLine.cashShortTermDebtRatio || 2.0;
        const cashRatioStatus = cashRatio < 1 ? '🔴' : cashRatio < 1.5 ? '🟡' : '🟢';
        
        html += '<div class="card" style="margin-bottom:16px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div style="font-weight:600">红线三 ' + cashRatioStatus + ' 现金短债比</div>' +
                '<span style="font-size:20px;font-weight:700;color:' + (cashRatio < 1 ? '#ef4444' : '#22c55e') + '">' + cashRatio.toFixed(2) + 'x</span>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                '<span style="color:#94a3b8;font-size:12px">标准: ≥1.0倍</span>' +
                '<span style="color:#ef4444;font-size:12px">阈值: 1.0倍</span>' +
            '</div>' +
            '<div class="progress-bar" style="height:12px">' +
                '<div class="progress-fill" style="width:' + Math.min(100, (cashRatio / 2) * 100) + '%;background:' + (cashRatio < 1 ? '#ef4444' : '#22c55e') + '"></div>' +
            '</div>' +
            '<div style="margin-top:10px;font-size:12px;color:' + (cashRatio < 1 ? '#ef4444' : '#94a3b8') + '">' +
                (cashRatio < 1 ? '⚠️ 已踩红线！现金不足以覆盖短期债务' : '✅ 符合标准') +
            '</div>' +
        '</div>';
        
        // 降档策略
        html += '<div class="section-title" style="margin-top:24px">🎯 降档策略</div>';
        if (tier !== GameTypes.RedLineTier.GREEN) {
            html += '<div class="card" style="background:rgba(249,115,22,0.1);border-color:rgba(249,115,22,0.3)">' +
                '<div style="font-weight:600;margin-bottom:12px;color:#f97316">💡 建议操作</div>' +
                '<div style="font-size:13px;color:#94a3b8;line-height:1.8">';
            
            if (assetLiabRatio > 70) {
                html += '• 加速卖房回款（降价5-10%，2-4月见效）<br>';
                html += '• 出售资产（急售7折，即时见效）<br>';
                html += '• 引入战略投资者（出让5-15%股权）<br>';
            }
            
            if (netDebtRatio > 100) {
                html += '• 卖资产还债<br>';
                html += '• 依靠利润慢慢偿还（6-18月）<br>';
                html += '• 债转股（40%成功率）<br>';
            }
            
            if (cashRatio < 1) {
                html += '• 卖资产囤现金<br>';
                html += '• 长债换短债（60%成功率）<br>';
                html += '• 过桥贷款凑数（30%风险）<br>';
            }
            
            html += '</div></div>';
        } else {
            html += '<div class="card" style="text-align:center;color:#22c55e;padding:30px">' +
                '✅ 继续保持！您的公司处于绿档，健康运营中' +
            '</div>';
        }
        
        return html;
    },
    
    // 渲染财务报表
    renderFinancialStatements: function(state) {
        let html = '<div class="section-title">📈 财务报表</div>';
        
        // 资产负债表
        html += '<div class="card" style="margin-bottom:16px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                '<div style="font-weight:700;font-size:16px">📊 资产负债表</div>' +
                '<span style="color:#94a3b8;font-size:12px">' + Utils.formatDate(state.date) + '</span>' +
            '</div>' +
            '<div style="border-bottom:2px solid var(--border);margin-bottom:12px;padding-bottom:8px;font-weight:600">资产</div>' +
            '<div style="margin-left:12px;margin-bottom:8px">' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">' +
                    '<span>现金</span>' +
                    '<span style="font-weight:600;color:#22c55e">' + Utils.formatMoney(state.company.cash) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;color:#94a3b8">' +
                    '<span>  应收账款</span>' +
                    '<span>' + Utils.formatMoney(Math.floor(state.company.totalAssets * 0.05)) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;color:#94a3b8">' +
                    '<span>  存货</span>' +
                    '<span>' + Utils.formatMoney(Math.floor(state.company.totalAssets * 0.3)) + '</span>' +
                '</div>' +
            '</div>' +
            '<div style="border-bottom:2px solid var(--border);margin-bottom:12px;padding-bottom:8px;font-weight:600">负债</div>' +
            '<div style="margin-left:12px;margin-bottom:8px">' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">' +
                    '<span>短期借款</span>' +
                    '<span style="font-weight:600;color:#ef4444">' + Utils.formatMoney(Math.floor(state.company.liabilities * 0.4)) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">' +
                    '<span>长期借款</span>' +
                    '<span style="font-weight:600;color:#ef4444">' + Utils.formatMoney(Math.floor(state.company.liabilities * 0.6)) + '</span>' +
                '</div>' +
            '</div>' +
            '<div style="border-top:2px solid var(--border);padding-top:12px">' +
                '<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700">' +
                    '<span>净资产</span>' +
                    '<span style="color:#22c55e">' + Utils.formatMoney(state.company.totalAssets - state.company.liabilities) + '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        // 利润表
        html += '<div class="card" style="margin-bottom:16px">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                '<div style="font-weight:700;font-size:16px">💹 利润表</div>' +
                '<span style="color:#94a3b8;font-size:12px">本月</span>' +
            '</div>' +
            '<div style="margin-bottom:8px">' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">' +
                    '<span>营业收入</span>' +
                    '<span style="font-weight:600;color:#22c55e">' + Utils.formatMoney(Math.floor(Math.random() * 50000000) + 10000000) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;color:#94a3b8">' +
                    '<span>  营业成本</span>' +
                    '<span style="color:#ef4444">-' + Utils.formatMoney(Math.floor(Math.random() * 30000000) + 5000000) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;color:#94a3b8">' +
                    '<span>  销售费用</span>' +
                    '<span style="color:#ef4444">-' + Utils.formatMoney(Math.floor(Math.random() * 5000000) + 1000000) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;color:#94a3b8">' +
                    '<span>  管理费用</span>' +
                    '<span style="color:#ef4444">-' + Utils.formatMoney(Math.floor(Math.random() * 3000000) + 500000) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;color:#94a3b8">' +
                    '<span>  财务费用</span>' +
                    '<span style="color:#ef4444">-' + Utils.formatMoney(Math.floor(Math.random() * 2000000) + 500000) + '</span>' +
                '</div>' +
            '</div>' +
            '<div style="border-top:2px solid var(--border);padding-top:12px">' +
                '<div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700">' +
                    '<span>净利润</span>' +
                    '<span style="color:' + (state.company.monthlyProfit >= 0 ? '#22c55e' : '#ef4444') + '">' + 
                        Utils.formatMoney(state.company.monthlyProfit) + '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        // 财务指标
        html += '<div class="section-title" style="margin-top:24px">📊 财务分析</div>';
        
        const debtRatio = state.company.liabilities > 0 && state.company.totalAssets > 0 
            ? ((state.company.liabilities / state.company.totalAssets) * 100).toFixed(1) 
            : 0;
        const roe = state.company.totalAssets > 0 
            ? ((state.company.monthlyProfit / state.company.totalAssets) * 100).toFixed(1) 
            : 0;
        const grossMargin = Math.floor(Math.random() * 20) + 20;
        const netMargin = Math.floor(Math.random() * 10) + 5;
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
            '<div class="card">' +
                '<div style="color:#94a3b8;font-size:12px">毛利率</div>' +
                '<div style="font-size:24px;font-weight:700;color:#22c55e;margin-top:4px">' + grossMargin + '%</div>' +
                '<div style="font-size:11px;color:#94a3b8;margin-top:4px">' + (grossMargin > 30 ? '⬆ 优秀' : grossMargin > 20 ? '➡ 良好' : '⬇ 较低') + '</div>' +
            '</div>' +
            '<div class="card">' +
                '<div style="color:#94a3b8;font-size:12px">净利率</div>' +
                '<div style="font-size:24px;font-weight:700;color:#22c55e;margin-top:4px">' + netMargin + '%</div>' +
                '<div style="font-size:11px;color:#94a3b8;margin-top:4px">' + (netMargin > 10 ? '⬆ 优秀' : netMargin > 5 ? '➡ 良好' : '⬇ 较低') + '</div>' +
            '</div>' +
            '<div class="card">' +
                '<div style="color:#94a3b8;font-size:12px">ROE</div>' +
                '<div style="font-size:24px;font-weight:700;color:#3b82f6;margin-top:4px">' + roe + '%</div>' +
                '<div style="font-size:11px;color:#94a3b8;margin-top:4px">净资产收益率</div>' +
            '</div>' +
            '<div class="card">' +
                '<div style="color:#94a3b8;font-size:12px">资产负债率</div>' +
                '<div style="font-size:24px;font-weight:700;color:' + (debtRatio > 70 ? '#ef4444' : '#22c55e') + ';margin-top:4px">' + debtRatio + '%</div>' +
                '<div style="font-size:11px;color:#94a3b8;margin-top:4px">' + (debtRatio > 70 ? '⚠ 偏高' : '✅ 正常') + '</div>' +
            '</div>' +
        '</div>';
        
        return html;
    },
    
    // 获取关系等级
    getRelationLevel: function(relation) {
        if (relation > 80) return 'excellent';
        if (relation >= 50) return 'normal';
        if (relation >= 30) return 'poor';
        return 'critical';
    },
    
    // 获取档位描述
    getTierDescription: function(tier) {
        const descriptions = {
            green: '正常经营，银行优先放贷',
            yellow: '踩1条红线，审批+1月利率+0.5%拿地受限',
            orange: '踩2条红线，只能借新还旧股价-10%',
            red: '踩3条红线，全渠道冻结30天倒计时'
        };
        return descriptions[tier] || '';
    },
    
    // 获取档位中文
    getTierChinese: function(tier) {
        const chinese = {
            green: '绿',
            yellow: '黄',
            orange: '橙',
            red: '红'
        };
        return chinese[tier] || '';
    },
    
    // 渲染税务筹划
    taxPlanning: function() {
        const state = GameState.get();
        let html = '<div class="section-title">📋 税务筹划</div>';
        
        // 企业所得税
        html += '<div class="card" style="margin-bottom:16px">' +
            '<div class="card-title">🏢 企业所得税</div>' +
            '<div class="card-subtitle">基本税率：25%</div>' +
            '<div style="margin-top:12px">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px">' +
                    '<span style="color:#94a3b8">本月应税收入</span>' +
                    '<span style="font-weight:600">' + Utils.formatMoney(Math.floor(Math.random() * 50000000) + 10000000) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:13px">' +
                    '<span style="color:#94a3b8">应纳税额</span>' +
                    '<span style="font-weight:600;color:#ef4444">' + Utils.formatMoney(Math.floor(Math.random() * 10000000) + 2000000) + '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        // 增值税
        html += '<div class="card" style="margin-bottom:16px">' +
            '<div class="card-title">💰 增值税</div>' +
            '<div class="card-subtitle">房地产业增值税税率：9%</div>' +
            '<div style="margin-top:12px;font-size:13px;color:#94a3b8">' +
                '• 开发项目适用9%税率<br>' +
                '• 老项目可选择简易计税5%<br>' +
                '• 土地价款可以抵扣' +
            '</div>' +
        '</div>';
        
        // 土地增值税
        html += '<div class="card" style="margin-bottom:16px">' +
            '<div class="card-title">🏗️ 土地增值税</div>' +
            '<div class="card-subtitle">超率累进税率 30%-60%</div>' +
            '<div style="margin-top:12px;font-size:13px;color:#94a3b8">' +
                '• 增值额未超过扣除项目金额50%：30%<br>' +
                '• 增值额超过50%-100%：40%<br>' +
                '• 增值额超过100%-200%：50%<br>' +
                '• 增值额超过200%：60%' +
            '</div>' +
        '</div>';
        
        return html;
    },
    
    // 渲染品牌页面
    brand: function() {
        const state = GameState.get();
        this.tabStates.brand = this.tabStates.brand || 0;
        const activeTab = this.tabStates.brand;
        
        const tabs = [
            { label: '品牌价值' },
            { label: '社交舆情' },
            { label: '社会责任' }
        ];
        
        let html = UI.tabs(tabs, activeTab);
        
        if (activeTab === 0) {
            // 品牌价值
            html += '<div class="section-title">🏷 品牌价值</div>' +
                '<div class="card">' +
                    '<div style="text-align:center;margin-bottom:15px">' +
                        '<div style="font-size:48px;font-weight:800;color:#f97316">' + state.company.brandValue + '</div>' +
                        '<div style="color:#94a3b8;font-size:14px;margin-top:5px">品牌指数</div>' +
                    '</div>' +
                    '<div class="progress-bar">' +
                        '<div class="progress-fill" style="width:' + Math.min(100, state.company.brandValue / 2) + '%"></div>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;margin-top:10px;color:#94a3b8;font-size:12px">' +
                        '<span>品牌评级: ' + (state.company.brandValue < 50 ? '新锐品牌' : state.company.brandValue < 100 ? '知名品牌' : '卓越品牌') + '</span>' +
                        '<span>对售价影响: +' + Math.round(state.company.brandValue / 2) + '%</span>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer" onclick="GameActions.brandUpgrade()">' +
                    '<div class="card-title">📈 品牌升级</div>' +
                    '<div class="card-subtitle">投入资金提升品牌价值</div>' +
                    '<div style="margin-top:10px;color:#f97316;font-weight:600">单次投入: ' + Utils.formatMoney(1000000) + '</div>' +
                '</div>';
        } else if (activeTab === 1) {
            // 社交舆情
            html += '<div class="section-title">📱 社交舆情</div>' +
                '<div class="card">' +
                    '<div class="card-title">社交媒体热度</div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:15px;margin-top:15px;text-align:center">' +
                        '<div>' +
                            '<div style="font-size:24px;font-weight:700;color:#3b82f6">' + Math.floor(Math.random() * 100000) + '</div>' +
                            '<div style="color:#94a3b8;font-size:12px">话题阅读</div>' +
                        '</div>' +
                        '<div>' +
                            '<div style="font-size:24px;font-weight:700;color:#22c55e">' + Math.floor(Math.random() * 10000) + '</div>' +
                            '<div style="color:#94a3b8;font-size:12px">正面评价</div>' +
                        '</div>' +
                        '<div>' +
                            '<div style="font-size:24px;font-weight:700;color:#ef4444">' + Math.floor(Math.random() * 500) + '</div>' +
                            '<div style="color:#94a3b8;font-size:12px">负面舆情</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">舆情动态</div>' +
                    '<div style="margin-top:10px;color:#94a3b8;font-size:13px">' +
                        '· 客户满意度持续提升<br>' +
                        '· 项目交付获得好评<br>' +
                        '· 品牌影响力逐步扩大' +
                    '</div>' +
                '</div>';
        } else if (activeTab === 2) {
            // 社会责任
            html += '<div class="section-title">❤️ 社会责任</div>' +
                '<div class="card">' +
                    '<div class="card-title">公益捐赠</div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:15px">' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">累计捐赠</div>' +
                            '<div style="font-weight:600;color:#22c55e">' + Utils.formatMoney(0) + '</div>' +
                        '</div>' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">公益项目</div>' +
                            '<div style="font-weight:600;color:#f97316">0 个</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🤝 开展公益活动</div>' +
                    '<div class="card-subtitle">参与公益事业，提升品牌形象</div>' +
                    '<div style="margin-top:10px;color:#94a3b8;font-size:13px">预计提升品牌价值 5-10 点</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">🌱 绿色建筑</div>' +
                    '<div class="card-subtitle">践行绿色发展理念，推广环保建筑</div>' +
                    '<div style="margin-top:10px;color:#94a3b8;font-size:13px">绿色建筑认证: 暂无</div>' +
                '</div>';
        }
        
        return html;
    },
    
    // 渲染个人页面
    personal: function() {
        const state = GameState.get();
        this.tabStates.personal = this.tabStates.personal || 0;
        const activeTab = this.tabStates.personal;
        
        const tabs = [
            { label: '资产总览' },
            { label: '投资理财' },
            { label: '个人房产' },
            { label: '个人贷款' },
            { label: '生活消费' },
            { label: '薪酬往来' },
            { label: '个人税务' },
            { label: '成就' },
            { label: '家庭' }
        ];
        
        let html = UI.tabs(tabs, activeTab, { twoRow: true });
        
        if (activeTab === 0) {
            // 资产总览
            html += '<div class="section-title">💰 资产总览</div>' +
                '<div class="card">' +
                    '<div style="display:flex;align-items:center;gap:15px;margin-bottom:20px">' +
                        '<div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#f97316,#fbbf24);display:flex;align-items:center;justify-content:center;font-size:28px">👨‍💼</div>' +
                        '<div>' +
                            '<div style="font-size:18px;font-weight:700">' + state.player.name + '</div>' +
                            '<div style="color:#94a3b8;font-size:13px">身价: ' + Utils.formatMoney(state.player.personalWealth) + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:15px">' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">流动资产</div>' +
                            '<div style="font-weight:600;color:#22c55e">' + Utils.formatMoney(Math.floor(state.player.personalWealth * 0.3)) + '</div>' +
                        '</div>' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">固定资产</div>' +
                            '<div style="font-weight:600;color:#f97316">' + Utils.formatMoney(Math.floor(state.player.personalWealth * 0.7)) + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">能力指标</div>' +
                    '<div style="margin-top:15px">' +
                        '<div class="skill-item">' +
                            '<div class="skill-header">' +
                                '<span class="skill-name">谈判能力</span>' +
                                '<span class="skill-value">' + state.player.skills.negotiation + '</span>' +
                            '</div>' +
                            '<div class="skill-bar"><div class="skill-fill" style="width:' + state.player.skills.negotiation + '%"></div></div>' +
                        '</div>' +
                        '<div class="skill-item">' +
                            '<div class="skill-header">' +
                                '<span class="skill-name">领导力</span>' +
                                '<span class="skill-value">' + state.player.skills.leadership + '</span>' +
                            '</div>' +
                            '<div class="skill-bar"><div class="skill-fill" style="width:' + state.player.skills.leadership + '%"></div></div>' +
                        '</div>' +
                        '<div class="skill-item">' +
                            '<div class="skill-header">' +
                                '<span class="skill-name">财务能力</span>' +
                                '<span class="skill-value">' + state.player.skills.finance + '</span>' +
                            '</div>' +
                            '<div class="skill-bar"><div class="skill-fill" style="width:' + state.player.skills.finance + '%"></div></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        } else if (activeTab === 1) {
            // 投资理财
            html += '<div class="section-title">📈 投资理财</div>' +
                '<div class="card">' +
                    '<div class="card-title">投资组合</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">管理您的个人投资</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无投资记录</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">💹 股票投资</div>' +
                    '<div class="card-subtitle">参与股市投资，获取资本收益</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🏦 理财产品</div>' +
                    '<div class="card-subtitle">稳健型理财，稳定收益</div>' +
                '</div>';
        } else if (activeTab === 2) {
            // 个人房产
            html += '<div class="section-title">🏠 个人房产</div>' +
                '<div class="card">' +
                    '<div class="card-title">我的房产</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">管理您的个人物业</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无个人房产</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🏘️ 购置房产</div>' +
                    '<div class="card-subtitle">购买自用或投资性房产</div>' +
                '</div>';
        } else if (activeTab === 3) {
            // 个人贷款
            html += '<div class="section-title">💳 个人贷款</div>' +
                '<div class="card">' +
                    '<div class="card-title">贷款记录</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无个人贷款</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🏦 申请贷款</div>' +
                    '<div class="card-subtitle">根据需要申请个人贷款</div>' +
                '</div>';
        } else if (activeTab === 4) {
            // 生活消费
            html += '<div class="section-title">🛒 生活消费</div>' +
                '<div class="card">' +
                    '<div class="card-title">月度支出</div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:15px">' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">住房支出</div>' +
                            '<div style="font-weight:600">' + Utils.formatMoney(Math.floor(Math.random() * 30000) + 10000) + '</div>' +
                        '</div>' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">生活消费</div>' +
                            '<div style="font-weight:600">' + Utils.formatMoney(Math.floor(Math.random() * 20000) + 5000) + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">消费明细</div>' +
                    '<div style="margin-top:10px;color:#94a3b8;font-size:13px">' +
                        '· 物业费、水电费<br>' +
                        '· 餐饮娱乐支出<br>' +
                        '· 交通出行费用<br>' +
                        '· 其他日常消费' +
                    '</div>' +
                '</div>';
        } else if (activeTab === 5) {
            // 薪酬往来
            html += '<div class="section-title">💼 薪酬往来</div>' +
                '<div class="card">' +
                    '<div class="card-title">薪酬收入</div>' +
                    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:15px">' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">年薪</div>' +
                            '<div style="font-weight:600;color:#22c55e">' + Utils.formatMoney(Math.floor(Math.random() * 500000) + 200000) + '</div>' +
                        '</div>' +
                        '<div>' +
                            '<div style="color:#94a3b8;font-size:12px">分红</div>' +
                            '<div style="font-weight:600;color:#f97316">' + Utils.formatMoney(0) + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">收入记录</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无收入记录</div>' +
                '</div>';
        } else if (activeTab === 6) {
            // 个人税务
            html += '<div class="section-title">📋 个人税务</div>' +
                '<div class="card">' +
                    '<div class="card-title">税务申报</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">依法纳税，合规经营</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无税务记录</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">税务筹划</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">合理规划个人税务</div>' +
                '</div>';
        } else if (activeTab === 7) {
            // 成就
            html += '<div class="section-title">🏆 成就</div>';
            state.achievements.forEach(function(achievement) {
                html += UI.achievementCard(achievement);
            });
        } else if (activeTab === 8) {
            // 家庭
            html += '<div class="section-title">👨‍👩‍👧‍👦 家庭</div>' +
                '<div class="card">' +
                    '<div class="card-title">家庭成员</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无家庭成员信息</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🏡 家庭规划</div>' +
                    '<div class="card-subtitle">规划家庭未来，创造美好生活</div>' +
                '</div>';
        }
        
        return html;
    },
    
    // 渲染治理页面
    governance: function() {
        const state = GameState.get();
        this.tabStates.governance = this.tabStates.governance || 0;
        const activeTab = this.tabStates.governance;
        
        const tabs = [
            { label: '股权结构' },
            { label: '融资中心' },
            { label: '分红政策' },
            { label: '控制权' },
            { label: '董事会' },
            { label: '高管团队' },
            { label: '股权操作' }
        ];
        
        let html = UI.tabs(tabs, activeTab);
        
        if (activeTab === 0) {
            // 股权结构
            html += '<div class="section-title">📊 股权结构</div>';
            state.shareholders.forEach(function(shareholder) {
                html += '<div class="card">' +
                    '<div class="card-header">' +
                        '<div class="card-title">' + shareholder.name + '</div>' +
                        '<span style="color:#22c55e;font-weight:700">' + shareholder.sharePercentage.toFixed(1) + '%</span>' +
                    '</div>' +
                    '<div class="card-subtitle">' + shareholder.type + '</div>' +
                '</div>';
            });
        } else if (activeTab === 1) {
            // 融资中心
            html += '<div class="section-title">💵 融资中心</div>' +
                '<div class="card">' +
                    '<div class="card-title">股权融资</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">通过出让股权获取资金</div>' +
                    '<div style="margin-top:12px;color:#94a3b8;font-size:13px">预计融资金额: ' + Utils.formatMoney(50000000) + '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🤝 引入投资者</div>' +
                    '<div class="card-subtitle">寻找战略投资者，助力企业发展</div>' +
                '</div>';
        } else if (activeTab === 2) {
            // 分红政策
            html += '<div class="section-title">💰 分红政策</div>' +
                '<div class="card">' +
                    '<div class="card-title">分红方式</div>' +
                    '<div style="margin-top:15px">' +
                        '<div style="padding:10px;background:rgba(37,99,235,0.1);border-radius:8px;border:1px solid #3b82f6;margin-bottom:10px">' +
                            '<div style="font-weight:600">现金分红</div>' +
                            '<div style="color:#94a3b8;font-size:12px;margin-top:5px">按持股比例分配现金</div>' +
                        '</div>' +
                        '<div style="padding:10px;background:var(--bg-card);border-radius:8px;border:1px solid var(--border)">' +
                            '<div style="font-weight:600">股票分红</div>' +
                            '<div style="color:#94a3b8;font-size:12px;margin-top:5px">按持股比例分配股票</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">分红记录</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px;text-align:center;padding:20px">暂无分红记录</div>' +
                '</div>';
        } else if (activeTab === 3) {
            // 控制权
            html += '<div class="section-title">⚖️ 控制权</div>' +
                '<div class="card">' +
                    '<div class="card-title">投票权结构</div>' +
                    '<div style="margin-top:15px">' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                            '<span style="color:#94a3b8">创始人持股</span>' +
                            '<span style="font-weight:600;color:#f97316">60%</span>' +
                        '</div>' +
                        '<div class="progress-bar">' +
                            '<div class="progress-fill" style="width:60%"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-top:15px;color:#94a3b8;font-size:13px">' +
                        '创始人拥有公司绝对控制权，可以主导公司决策' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">控制权分析</div>' +
                    '<div style="margin-top:10px;color:#94a3b8;font-size:13px">' +
                        '· 创始人持股超过50%，拥有控制权<br>' +
                        '· 重大决策需股东会表决通过<br>' +
                        '· 董事会负责日常经营决策' +
                    '</div>' +
                '</div>';
        } else if (activeTab === 4) {
            // 董事会
            html += '<div class="section-title">🎖️ 董事会</div>';
            state.directors.forEach(function(director) {
                html += '<div class="card">' +
                    '<div class="card-header">' +
                        '<div class="card-title">' + director.name + '</div>' +
                        '<span style="color:#f97316;font-weight:600;font-size:13px">' + director.role + '</span>' +
                    '</div>' +
                    '<div class="card-subtitle">专长: ' + director.expertise + '</div>' +
                '</div>';
            });
        } else if (activeTab === 5) {
            // 高管团队
            html += '<div class="section-title">👥 高管团队</div>' +
                '<div class="card">' +
                    '<div class="card-title">CEO 首席执行官</div>' +
                    '<div class="card-subtitle">全面负责公司运营管理</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">CFO 首席财务官</div>' +
                    '<div class="card-subtitle">负责公司财务战略和风险管控</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">COO 首席运营官</div>' +
                    '<div class="card-subtitle">负责公司日常运营管理</div>' +
                '</div>';
        } else if (activeTab === 6) {
            // 股权操作
            html += '<div class="section-title">📋 股权操作</div>' +
                '<div class="card" style="cursor:pointer">' +
                    '<div class="card-title">📈 股权激励</div>' +
                    '<div class="card-subtitle">对核心员工进行股权激励</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🔄 股权转让</div>' +
                    '<div class="card-subtitle">股东之间进行股权转让</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">📊 股权稀释</div>' +
                    '<div class="card-subtitle">通过增资扩股稀释股权</div>' +
                '</div>';
        }
        
        return html;
    },
    
    // 渲染设置页面
    settings: function() {
        const state = GameState.get();
        this.tabStates.settings = this.tabStates.settings || 0;
        const activeTab = this.tabStates.settings;
        
        const tabs = [
            { label: '存档管理' },
            { label: '游戏设置' },
            { label: '福利中心' },
            { label: '公司信息' },
            { label: '关于' }
        ];
        
        let html = UI.tabs(tabs, activeTab);
        
        if (activeTab === 0) {
            // 存档管理
            html += '<div class="section-title">💾 存档管理</div>' +
                '<div class="card" onclick="MenuSystem.quickSave(\'slot_1\')" style="cursor:pointer">' +
                    '<div class="card-title">📌 存档1</div>' +
                    '<div class="card-subtitle">保存或读取进度</div>' +
                '</div>' +
                '<div class="card" onclick="MenuSystem.quickSave(\'slot_2\')" style="cursor:pointer">' +
                    '<div class="card-title">📌 存档2</div>' +
                    '<div class="card-subtitle">保存或读取进度</div>' +
                '</div>' +
                '<div class="card" onclick="MenuSystem.quickSave(\'slot_3\')" style="cursor:pointer">' +
                    '<div class="card-title">📌 存档3</div>' +
                    '<div class="card-subtitle">保存或读取进度</div>' +
                '</div>' +
                '<div class="card" onclick="MenuSystem.showSaveManager()" style="cursor:pointer">' +
                    '<div class="card-title">🗂️ 更多操作</div>' +
                    '<div class="card-subtitle">管理存档文件，删除或重命名</div>' +
                '</div>' +
                '<div class="card" onclick="MenuSystem.returnToMenu()" style="cursor:pointer;margin-top:16px">' +
                    '<div class="card-title" style="color:#60a5fa">🏠 返回主菜单</div>' +
                    '<div class="card-subtitle">返回游戏主菜单</div>' +
                '</div>';
        } else if (activeTab === 1) {
            // 游戏设置
            html += '<div class="section-title">⚙️ 游戏设置</div>' +
                '<div class="card">' +
                    '<div class="card-title">🎵 音效设置</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">控制游戏音效开关</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">🎨 主题设置</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">选择您喜欢的界面主题</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">📱 操作设置</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">自定义游戏操作方式</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">🔔 通知设置</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">管理游戏通知</div>' +
                '</div>';
        } else if (activeTab === 2) {
            // 福利中心
            html += '<div class="section-title">🎁 福利中心</div>' +
                '<div class="card" style="cursor:pointer">' +
                    '<div class="card-title">🎯 每日签到</div>' +
                    '<div class="card-subtitle">每日签到领取奖励</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🏆 成就奖励</div>' +
                    '<div class="card-subtitle">完成成就获得奖励</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px;cursor:pointer">' +
                    '<div class="card-title">🎲 幸运抽奖</div>' +
                    '<div class="card-subtitle">参与抽奖赢取大奖</div>' +
                '</div>';
        } else if (activeTab === 3) {
            // 公司信息
            html += '<div class="section-title">🏢 公司信息</div>' +
                '<div class="card">' +
                    '<div class="card-title">公司名称</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">' + state.company.name + '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">企业性质</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">' + (state.company.type === 'limited' ? '有限责任公司' : '股份有限公司') + '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">注册资本</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">' + Utils.formatMoney(state.company.capital) + '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">成立时间</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">2008年1月1日</div>' +
                '</div>';
        } else if (activeTab === 4) {
            // 关于
            html += '<div class="section-title">ℹ️ 关于</div>' +
                '<div class="card">' +
                    '<div class="card-title">🎮 游戏版本</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">' + MenuSystem.VERSION + '</div>' +
                '</div>' +
                '<div class="card" onclick="MenuSystem.showChangelog()" style="cursor:pointer;margin-top:16px">' +
                    '<div class="card-title">📝 更新日志</div>' +
                    '<div class="card-subtitle">查看游戏更新内容</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">📖 游戏说明</div>' +
                    '<div class="card-subtitle" style="margin-top:10px;line-height:1.6">1. 购买土地，启动项目<br>2. 招聘员工，提高效率<br>3. 办理证书，开始建设<br>4. 预售回款，扩大规模</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">💼 制作团队</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">感谢您的游玩！</div>' +
                '</div>';
        }
        
        return html;
    },
    
    // 设置土地类型筛选
    setLandTypeFilter: function(type) {
        this.landTypeFilter = type;
        App.render();
    },
    
    // 增强的土地卡片
    enhancedLandCard: function(land) {
        const profitColor = land.estimatedProfit >= 0 ? '#22c55e' : '#ef4444';
        const profitSign = land.estimatedProfit >= 0 ? '+' : '';
        const landType = land.landType || '招挂拍';
        const devType = land.devType || '刚需';
        const buildArea = land.buildArea || (land.siteArea || land.size) * 2;
        const landPricePerSqm = land.landPricePerSqm || (land.price / buildArea);
        const estimatedProfit = land.estimatedProfit || Math.floor(land.price * 0.3);
        
        return '<div class="card land-card-enhanced">' +
            '<div class="card-header">' +
                '<div class="card-title">' + land.name + '</div>' +
                '<span style="background:' + (landType === '法拍' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)') + ';color:' + (landType === '法拍' ? '#ef4444' : '#3b82f6') + ';padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600">' + landType + '</span>' +
            '</div>' +
            '<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">' +
                '<span style="background:rgba(249,115,22,0.1);color:#f97316;padding:4px 10px;border-radius:12px;font-size:12px">' + devType + '</span>' +
                '<span style="background:rgba(34,197,94,0.1);color:#22c55e;padding:4px 10px;border-radius:12px;font-size:12px">工期' + (land.constructionDuration || 24) + '月</span>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:11px">占地</div>' +
                    '<div style="font-weight:600">' + Utils.formatArea(land.siteArea || land.size) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:11px">容积率</div>' +
                    '<div style="font-weight:600">' + (land.plotRatio || 2.5) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:11px">建面</div>' +
                    '<div style="font-weight:600">' + Utils.formatArea(buildArea) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:11px">楼面价</div>' +
                    '<div style="font-weight:600">' + Utils.formatMoney(landPricePerSqm) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:11px">限高</div>' +
                    '<div style="font-weight:600">' + (land.maxHeight || 100) + '米</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:11px">起拍价</div>' +
                    '<div style="font-weight:600;color:#f97316">' + Utils.formatMoney(land.totalLandPrice || land.price) + '</div>' +
                '</div>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:11px">地房比</div>' +
                    '<div style="font-weight:600">' + (land.landToHouseRatio || 0.4).toFixed(2) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:11px">预估利润</div>' +
                    '<div style="font-weight:600;color:' + profitColor + '">' + profitSign + Utils.formatMoney(estimatedProfit) + '</div>' +
                '</div>' +
            '</div>' +
            '<button class="btn btn-primary btn-full" onclick="GameActions.buyLand(\'' + land.id + '\')">' +
                '🏗️ 参与竞拍' +
            '</button>' +
        '</div>';
    }
};
