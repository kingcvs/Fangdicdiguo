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
                        '<div style="font-weight:600">' + state.marketEnv.housingPriceIndex + '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="color:#94a3b8;font-size:12px">市场需求</div>' +
                        '<div style="font-weight:600">' + state.marketEnv.marketDemand + '%</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="section-title">📈 宏观经济指标</div>' +
            '<div class="card">' +
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;font-size:12px">' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">GDP增速</span><span style="font-weight:600">' + state.macroData.gdpGrowth + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">CPI</span><span style="font-weight:600">' + state.macroData.cpi + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">M2增速</span><span style="font-weight:600">' + state.macroData.m2Growth + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">5Y-LPR</span><span style="font-weight:600">' + state.macroData.lpr5y + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">房贷利率</span><span style="font-weight:600">' + state.macroData.mortgageRate + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">汇率</span><span style="font-weight:600">' + state.macroData.exchangeRate + '</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">居民杠杆</span><span style="font-weight:600">' + state.macroData.householdLeverage + '%</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">PMI</span><span style="font-weight:600">' + state.macroData.pmi + '</span></div>' +
                    '<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">消费信心</span><span style="font-weight:600">' + state.macroData.consumerConfidence + '</span></div>' +
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
                            '<span style="color:#22c55e;font-weight:600">' + (state.marketEnv?.housingPriceIndex || 1.0).toFixed(2) + '</span>' +
                        '</div>' +
                        '<div class="progress-bar">' +
                            '<div class="progress-fill" style="width:' + ((state.marketEnv?.housingPriceIndex || 1.0) * 70) + '%"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="margin-top:15px">' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:10px">' +
                            '<span>市场需求</span>' +
                            '<span style="color:#3b82f6;font-weight:600">' + (state.marketEnv?.marketDemand || 75) + '%</span>' +
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
            case 'certificates':
                html += this.renderCertificatesTab(project, state);
                break;
            case 'design':
                html += this.renderDesignTab(project);
                break;
            case 'construction':
                html += this.renderConstructionTab(project);
                break;
            case 'cost':
                html += this.renderCostTab(project);
                break;
            case 'procurement':
                html += this.renderProcurementTab(project);
                break;
            case 'planning':
                html += this.renderPlanningTab(project);
                break;
            case 'finance':
                html += this.renderProjectFinanceTab(project);
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
            { id: 'certificates', label: '四证办理' },
            { id: 'design', label: '设计管理' },
            { id: 'construction', label: '工程管理' },
            { id: 'cost', label: '成本控制' },
            { id: 'procurement', label: '招采管理' },
            { id: 'planning', label: '单元规划' },
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
                '<div style="color:#94a3b8;font-size:13px">按顺序办理：国有土地使用证→建设用地规划→建设工程规划→施工许可</div>' +
            '</div>' +
            project.certificates.map(function(cert, index) {
                let statusClass = 'pending';
                let statusText = '待办理';
                let buttonText = '申请办理';
                let buttonClass = 'btn-primary';
                let buttonDisabled = !cert.unlocked;
                let progressBar = '';
                
                if (cert.status === GameTypes.CertificateStatus.PROCESSING) {
                    statusClass = 'processing';
                    statusText = '办理中 ' + Math.round(cert.progress || 0) + '%';
                    buttonText = '办理中...';
                    buttonClass = 'btn-secondary';
                    buttonDisabled = true;
                    progressBar = '<div style="margin-top:8px"><div class="progress-bar"><div class="progress-fill" style="width:' + Math.round(cert.progress || 0) + '%"></div></div></div>';
                } else if (cert.status === GameTypes.CertificateStatus.COMPLETED) {
                    statusClass = 'completed';
                    statusText = '已完成 ✓';
                    buttonText = '已完成';
                    buttonClass = 'btn-secondary';
                    buttonDisabled = true;
                } else if (!cert.unlocked) {
                    statusClass = 'locked';
                    statusText = '未解锁';
                }
                
                let costText = '';
                if (cert.cost && cert.unlocked && cert.status === GameTypes.CertificateStatus.PENDING) {
                    costText = '<div style="color:#f97316;font-size:13px;margin-top:8px">费用: ' + Utils.formatMoney(cert.cost) + '</div>';
                }
                
                return '<div class="card cert-card cert-' + statusClass + '">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="font-weight:600">' + (index + 1) + '. ' + cert.name + '</span>' +
                        '<span class="cert-status status-' + statusClass + '">' + statusText + '</span>' +
                    '</div>' +
                    progressBar +
                    costText +
                    (cert.unlocked && cert.status === GameTypes.CertificateStatus.PENDING ? 
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
        const canEdit = design.phase !== '已完成';
        const isStarted = design.phase === '进行中';
        const isComplete = design.phase === '已完成';
        
        let html = '<div class="section-title" style="margin-top:16px">📐 设计管理</div>';
        
        // 阶段状态
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                '<span style="font-weight:600">当前阶段</span>' +
                '<span style="color:' + (isComplete ? '#22c55e' : isStarted ? '#3b82f6' : '#94a3b8') + ';font-weight:600">' + design.phase + '</span>' +
            '</div>';
        
        // 如果设计未开始，显示开始按钮
        if (design.phase === '未开始') {
            html += '<button class="btn btn-primary btn-full" onclick="GameActions.startDesign(\'' + project.id + '\')">开始设计</button>';
        }
        
        html += '</div>';
        
        // 如果设计已开始，显示设计选项
        if (isStarted || isComplete) {
            html += '<div class="card" style="margin-top:16px">' +
                '<div class="card-title">项目定位</div>' +
                '<div class="card-subtitle" style="margin-top:8px">选择项目定位影响成本、售价和市场需求</div>' +
                '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">' +
                    positions.map(function(pos) {
                        return '<button class="btn ' + (design.positioning === pos ? 'btn-primary' : 'btn-secondary') + ' btn-sm" ' +
                            (!canEdit ? 'disabled' : 'onclick="GameActions.setPositioning(\'' + project.id + '\', \'' + pos + '\')"') + '>' + pos + '</button>';
                    }).join('') +
                '</div>' +
            '</div>';
            
            html += '<div class="card" style="margin-top:16px">' +
                '<div class="card-title">外立面风格</div>' +
                '<div class="card-subtitle" style="margin-top:8px">建筑外观风格影响项目品质和客户接受度</div>' +
                '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">' +
                    facades.map(function(facade) {
                        return '<button class="btn ' + (design.facade === facade ? 'btn-primary' : 'btn-secondary') + ' btn-sm" ' +
                            (!canEdit ? 'disabled' : 'onclick="GameActions.setFacade(\'' + project.id + '\', \'' + facade + '\')"') + '>' + facade + '</button>';
                    }).join('') +
                '</div>' +
            '</div>';
            
            html += '<div class="card" style="margin-top:16px">' +
                '<div class="card-title">📊 设计参数</div>' +
                '<div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:12px">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#94a3b8">成本系数</span>' +
                        '<span style="font-weight:600;color:#f97316">×' + design.costCoefficient.toFixed(2) + '</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#94a3b8">售价系数</span>' +
                        '<span style="font-weight:600;color:#22c55e">×' + design.priceCoefficient.toFixed(2) + '</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#94a3b8">需求系数</span>' +
                        '<span style="font-weight:600;color:#3b82f6">×' + design.demandCoefficient.toFixed(2) + '</span>' +
                    '</div>' +
                    '<div style="border-top:1px solid var(--border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#94a3b8">容积率</span>' +
                        '<span style="font-weight:600">' + design.plotRatio.toFixed(2) + ' / ' + design.plotRatioLimit.toFixed(2) + '</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#94a3b8">绿化率</span>' +
                        '<span style="font-weight:600">' + (design.greeningRate * 100).toFixed(0) + '%</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#94a3b8">建筑密度</span>' +
                        '<span style="font-weight:600">' + (design.buildingDensity * 100).toFixed(0) + '%</span>' +
                    '</div>' +
                '</div>' +
            '</div>';
            
            // 预期收益预览
            html += '<div class="card" style="margin-top:16px">' +
                '<div class="card-title">💰 预算与收益</div>' +
                '<div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:12px">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#94a3b8">预计总成本</span>' +
                        '<span style="font-weight:600;color:#f97316">' + Utils.formatMoney(project.cost.budget || 0) + '</span>' +
                    '</div>' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="color:#94a3b8">预计总营收</span>' +
                        '<span style="font-weight:600;color:#22c55e">' + Utils.formatMoney((project.cost.budget || 0) * design.priceCoefficient * 1.5) + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>';
            
            // 如果设计进行中，显示完成按钮
            if (isStarted) {
                html += '<div class="card" style="margin-top:16px">' +
                    '<button class="btn btn-primary btn-full" onclick="GameActions.completeDesign(\'' + project.id + '\')">✅ 完成设计</button>' +
                '</div>';
            }
        }
        
        return html;
    },
    
    // 渲染工程管理标签页
    renderConstructionTab: function(project) {
        const construction = project.construction;
        const isStarted = construction.phase === '进行中';
        const isComplete = construction.phase === '已完成';
        const canEdit = !isComplete;
        
        let html = '<div class="section-title" style="margin-top:16px">🏗️ 工程管理</div>';
        
        // 阶段状态
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
                '<span style="font-weight:600">当前阶段</span>' +
                '<span style="color:' + (isComplete ? '#22c55e' : isStarted ? '#3b82f6' : '#94a3b8') + ';font-weight:600">' + construction.phase + '</span>' +
            '</div>';
        
        // 如果施工未开始，显示开始按钮
        if (construction.phase === '未开始') {
            html += '<button class="btn btn-primary btn-full" onclick="GameActions.startConstruction(\'' + project.id + '\')">开始施工</button>';
        }
        
        html += '</div>';
        
        // 如果施工已开始或完成，显示施工详情
        if (isStarted || isComplete) {
            // 整体进度
            html += '<div class="card" style="margin-top:16px">' +
                '<div class="card-title">整体进度</div>' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:8px;margin-top:12px">' +
                    '<span style="color:#94a3b8">施工进度</span>' +
                    '<span style="font-weight:600">' + Math.round(construction.progress || 0) + '%</span>' +
                '</div>' +
                '<div class="progress-bar">' +
                    '<div class="progress-fill" style="width:' + (construction.progress || 0) + '%"></div>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;margin-top:12px">' +
                    '<span style="color:#94a3b8">工程质量</span>' +
                    '<span style="font-weight:600;color:' + ((construction.quality || 50) >= 80 ? '#22c55e' : (construction.quality || 50) >= 60 ? '#f97316' : '#ef4444') + '">' + Math.round(construction.quality || 50) + '/100</span>' +
                '</div>' +
            '</div>';
            
            // 分阶段进度
            html += '<div class="card" style="margin-top:16px">' +
                '<div class="card-title">施工阶段</div>';
            
            construction.phases.forEach(function(phase, index) {
                const isCurrent = index === construction.currentPhase;
                const isFinished = phase.completed;
                
                html += '<div style="margin-top:12px;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
                        '<span style="font-weight:' + (isCurrent ? '700' : '500') + ';color:' + (isCurrent ? '#3b82f6' : isFinished ? '#22c55e' : '#cbd5e1') + '">' + 
                            (isFinished ? '✅ ' : isCurrent ? '📍 ' : '○ ') + phase.name + 
                        '</span>' +
                        '<span style="color:#94a3b8;font-size:13px">' + Math.round(phase.progress) + '%</span>' +
                    '</div>' +
                    '<div class="progress-bar" style="height:6px;">' +
                        '<div class="progress-fill" style="width:' + phase.progress + '%;background:' + (isFinished ? '#22c55e' : isCurrent ? '#3b82f6' : '#64748b') + ';"></div>' +
                    '</div>' +
                '</div>';
            });
            
            html += '</div>';
            
            // 如果施工进行中，显示完成按钮
            if (isStarted) {
                html += '<div class="card" style="margin-top:16px">' +
                    '<button class="btn btn-primary btn-full" onclick="GameActions.completeConstruction(\'' + project.id + '\')">🎉 完成施工</button>' +
                '</div>';
            }
        }
        
        return html;
    },
    
    // 渲染成本控制标签页
    renderCostTab: function(project) {
        const cost = project.cost;
        const budget = cost.budget || 0;
        const actual = cost.actualCost || 0;
        const remaining = Math.max(0, budget - actual);
        const progress = budget > 0 ? (actual / budget) * 100 : 0;
        
        let html = '<div class="section-title" style="margin-top:16px">💰 成本控制</div>';
        
        // 预算概览
        html += '<div class="card">' +
            '<div class="card-title">成本概览</div>' +
            '<div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:12px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">总预算</span>' +
                    '<span style="font-weight:700;color:#f97316">' + Utils.formatMoney(budget) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">已支出</span>' +
                    '<span style="font-weight:700;color:#ef4444">' + Utils.formatMoney(actual) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">剩余预算</span>' +
                    '<span style="font-weight:700;color:#22c55e">' + Utils.formatMoney(remaining) + '</span>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top:16px">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                    '<span style="color:#94a3b8">预算使用率</span>' +
                    '<span style="font-weight:600">' + Math.round(progress) + '%</span>' +
                '</div>' +
                '<div class="progress-bar">' +
                    '<div class="progress-fill" style="width:' + Math.min(100, progress) + '%;background:' + (progress > 90 ? '#ef4444' : progress > 70 ? '#f97316' : '#22c55e') + ';"></div>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        // 成本细分
        const breakdown = cost.costBreakdown || {};
        html += '<div class="card" style="margin-top:16px">' +
            '<div class="card-title">成本明细</div>' +
            '<div style="display:grid;grid-template-columns:1fr;gap:10px;margin-top:12px">';
        
        const breakdownItems = [
            { key: 'land', label: '土地成本' },
            { key: 'construction', label: '建设成本' },
            { key: 'design', label: '设计成本' },
            { key: 'marketing', label: '营销成本' },
            { key: 'other', label: '其他成本' }
        ];
        
        breakdownItems.forEach(function(item) {
            const value = breakdown[item.key] || 0;
            const percentage = budget > 0 ? (value / budget) * 100 : 0;
            html += '<div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
                    '<span style="color:#cbd5e1">' + item.label + '</span>' +
                    '<span style="font-weight:600">' + Utils.formatMoney(value) + ' (' + percentage.toFixed(1) + '%)</span>' +
                '</div>' +
                '<div class="progress-bar" style="height:4px;">' +
                    '<div class="progress-fill" style="width:' + percentage + '%;background:#3b82f6;"></div>' +
                '</div>' +
            '</div>';
        });
        
        html += '</div></div>';
        
        return html;
    },
    
    // 渲染招采管理标签页
    renderProcurementTab: function(project) {
        const procurement = project.procurement || { suppliers: [], materials: [] };
        
        let html = '<div class="section-title" style="margin-top:16px">📦 招采管理</div>';
        
        // 供应商列表
        html += '<div class="card">' +
            '<div class="card-title">合作供应商</div>';
        
        if (procurement.suppliers.length === 0) {
            html += '<div style="margin-top:12px;color:#94a3b8;text-align:center;padding:20px">暂无供应商，施工阶段可进行招采</div>';
        } else {
            procurement.suppliers.forEach(function(supplier) {
                html += '<div style="margin-top:12px;padding:12px;background:#1e293b;border-radius:10px;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:center">' +
                        '<span style="font-weight:600">' + supplier.name + '</span>' +
                        '<span style="color:#94a3b8;font-size:13px">' + supplier.type + '</span>' +
                    '</div>' +
                    '<div style="margin-top:6px;color:#94a3b8;font-size:13px">合作金额：' + Utils.formatMoney(supplier.amount || 0) + '</div>' +
                '</div>';
            });
        }
        
        html += '</div>';
        
        // 材料清单
        html += '<div class="card" style="margin-top:16px">' +
            '<div class="card-title">材料清单</div>';
        
        const defaultMaterials = [
            { name: '钢材', quantity: 500, unit: '吨', status: '待采购' },
            { name: '水泥', quantity: 2000, unit: '吨', status: '待采购' },
            { name: '混凝土', quantity: 10000, unit: '方', status: '待采购' },
            { name: '木材', quantity: 300, unit: '方', status: '待采购' },
            { name: '装修材料', quantity: 1, unit: '批', status: '待采购' }
        ];
        
        const materials = procurement.materials.length > 0 ? procurement.materials : defaultMaterials;
        
        materials.forEach(function(material) {
            html += '<div style="margin-top:10px;padding:10px;background:#1e293b;border-radius:8px;display:flex;justify-content:space-between;align-items:center">' +
                '<div>' +
                    '<div style="font-weight:500">' + material.name + '</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">数量：' + material.quantity + ' ' + material.unit + '</div>' +
                '</div>' +
                '<span style="padding:4px 10px;border-radius:6px;font-size:12px;background:' + (material.status === '已采购' ? '#05966930' : '#f9731630') + ';color:' + (material.status === '已采购' ? '#22c55e' : '#f97316') + '">' + material.status + '</span>' +
            '</div>';
        });
        
        html += '</div>';
        
        return html;
    },
    
    // 渲染单元规划标签页
    renderPlanningTab: function(project) {
        const planning = project.planning || { units: [], totalUnits: 0, unitTypes: [] };
        
        let html = '<div class="section-title" style="margin-top:16px">🏘️ 单元规划</div>';
        
        // 户型类型
        html += '<div class="card">' +
            '<div class="card-title">户型规划</div>';
        
        const defaultUnitTypes = [
            { name: '一居室', area: 50, count: 20, price: 0 },
            { name: '两居室', area: 80, count: 30, price: 0 },
            { name: '三居室', area: 120, count: 25, price: 0 },
            { name: '四居室', area: 160, count: 10, price: 0 }
        ];
        
        const unitTypes = planning.unitTypes.length > 0 ? planning.unitTypes : defaultUnitTypes;
        let totalUnits = 0;
        let totalArea = 0;
        
        unitTypes.forEach(function(type) {
            totalUnits += type.count;
            totalArea += type.count * type.area;
        });
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;margin-bottom:16px">' +
            '<div style="text-align:center;padding:12px;background:#1e293b;border-radius:10px">' +
                '<div style="font-size:24px;font-weight:700;color:#3b82f6">' + totalUnits + '</div>' +
                '<div style="color:#94a3b8;font-size:13px">总户数</div>' +
            '</div>' +
            '<div style="text-align:center;padding:12px;background:#1e293b;border-radius:10px">' +
                '<div style="font-size:24px;font-weight:700;color:#22c55e">' + Utils.formatArea(totalArea) + '</div>' +
                '<div style="color:#94a3b8;font-size:13px">总面积</div>' +
            '</div>' +
        '</div>';
        
        unitTypes.forEach(function(type) {
            html += '<div style="margin-top:10px;padding:12px;background:#1e293b;border-radius:10px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="font-weight:600">' + type.name + '</span>' +
                    '<span style="color:#f97316">' + type.count + ' 户</span>' +
                '</div>' +
                '<div style="margin-top:6px;color:#94a3b8;font-size:13px">单户面积：' + Utils.formatArea(type.area) + ' | 小计：' + Utils.formatArea(type.count * type.area) + '</div>' +
            '</div>';
        });
        
        html += '</div>';
        
        // 景观规划
        html += '<div class="card" style="margin-top:16px">' +
            '<div class="card-title">景观规划</div>' +
            '<div style="margin-top:12px;display:grid;grid-template-columns:1fr;gap:8px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#1e293b;border-radius:8px">' +
                    '<span style="color:#cbd5e1">绿化率</span>' +
                    '<span style="font-weight:600;color:#22c55e">' + ((project.design?.greeningRate || 0.3) * 100).toFixed(0) + '%</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#1e293b;border-radius:8px">' +
                    '<span style="color:#cbd5e1">容积率</span>' +
                    '<span style="font-weight:600;color:#3b82f6">' + (project.design?.plotRatio || 2.5).toFixed(2) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:#1e293b;border-radius:8px">' +
                    '<span style="color:#cbd5e1">建筑密度</span>' +
                    '<span style="font-weight:600;color:#f97316">' + ((project.design?.buildingDensity || 0.25) * 100).toFixed(0) + '%</span>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        return html;
    },
    
    // 渲染项目资金管理标签页
    renderProjectFinanceTab: function(project) {
        const finance = project.finance || { cashFlow: [], budget: [] };
        
        let html = '<div class="section-title" style="margin-top:16px">💳 资金管理</div>';
        
        // 资金状态
        const totalCost = project.cost?.budget || 0;
        const spent = project.cost?.actualCost || 0;
        const remaining = Math.max(0, totalCost - spent);
        
        html += '<div class="card">' +
            '<div class="card-title">资金状态</div>' +
            '<div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:12px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">项目总投入</span>' +
                    '<span style="font-weight:700;color:#f97316">' + Utils.formatMoney(totalCost) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">已投入资金</span>' +
                    '<span style="font-weight:700;color:#ef4444">' + Utils.formatMoney(spent) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">待投入资金</span>' +
                    '<span style="font-weight:700;color:#22c55e">' + Utils.formatMoney(remaining) + '</span>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        // 资金计划
        html += '<div class="card" style="margin-top:16px">' +
            '<div class="card-title">资金计划</div>';
        
        const phases = [
            { name: '四证办理', cost: project.cost?.costBreakdown?.design || 500000 },
            { name: '设计阶段', cost: project.cost?.costBreakdown?.design || 500000 },
            { name: '地基施工', cost: (project.constructionCost || 0) * 0.2 },
            { name: '主体结构', cost: (project.constructionCost || 0) * 0.4 },
            { name: '内外装修', cost: (project.constructionCost || 0) * 0.25 },
            { name: '设备安装', cost: (project.constructionCost || 0) * 0.1 },
            { name: '竣工验收', cost: (project.constructionCost || 0) * 0.05 }
        ];
        
        phases.forEach(function(phase, index) {
            const isActive = index <= (project.currentStage || 0);
            html += '<div style="margin-top:10px;padding:10px;background:#1e293b;border-radius:8px;display:flex;justify-content:space-between;align-items:center;opacity:' + (isActive ? '1' : '0.6') + '">' +
                '<span style="font-weight:' + (isActive ? '600' : '500') + '">' + phase.name + '</span>' +
                '<span style="color:#f97316">' + Utils.formatMoney(phase.cost) + '</span>' +
            '</div>';
        });
        
        html += '</div>';
        
        // 预期收益
        const expectedRevenue = (totalCost * (project.design?.priceCoefficient || 1.0) * 1.5);
        const expectedProfit = expectedRevenue - totalCost;
        const profitMargin = totalCost > 0 ? (expectedProfit / totalCost) * 100 : 0;
        
        html += '<div class="card" style="margin-top:16px">' +
            '<div class="card-title">预期收益</div>' +
            '<div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:12px">' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">预期总营收</span>' +
                    '<span style="font-weight:700;color:#22c55e">' + Utils.formatMoney(expectedRevenue) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">预期利润</span>' +
                    '<span style="font-weight:700;color:#3b82f6">' + Utils.formatMoney(expectedProfit) + '</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;align-items:center">' +
                    '<span style="color:#94a3b8">预期利润率</span>' +
                    '<span style="font-weight:700;color:#f97316">' + profitMargin.toFixed(1) + '%</span>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        return html;
    },
    
    // 渲染营销页面
    marketing: function() {
        const state = GameState.get();
        this.tabStates.marketing = this.tabStates.marketing || 0;
        const activeTab = this.tabStates.marketing;
        
        const tabs = [
            { label: '品牌建设' },
            { label: '营销活动' }
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
        } else {
            html += '<div class="section-title">📣 营销活动</div>' +
                '<div class="card">' +
                    '<div class="card-title">暂无活动</div>' +
                    '<div class="card-subtitle">更多功能开发中...</div>' +
                '</div>';
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
    
    // 渲染资本页面
    capital: function() {
        const state = GameState.get();
        this.tabStates.capital = this.tabStates.capital || 0;
        const activeTab = this.tabStates.capital;
        
        const tabs = [
            { label: '融资中心' },
            { label: '三条红线' },
            { label: '税务筹划' },
            { label: '财务报表' }
        ];
        
        let html = UI.tabs(tabs, activeTab);
        
        if (activeTab === 0) {
            // 融资中心
            html += '<div class="section-title">🏦 融资中心</div>';
            const products = InitialData.getLoanProducts();
            products.forEach(function(product) {
                html += '<div class="card" onclick="GameActions.takeLoan(\'' + product.id + '\')" style="cursor:pointer">' +
                    '<div class="card-header">' +
                        '<div class="card-title">' + product.name + '</div>' +
                        '<span style="color:#22c55e;font-weight:700">利率 ' + (product.interestRate * 100).toFixed(1) + '%</span>' +
                    '</div>' +
                    '<div style="margin-top:10px;color:#94a3b8;font-size:13px">' +
                        '最高额度: ' + Utils.formatMoney(product.maxAmount) + ' | 期限: ' + product.minTerm + '-' + product.maxTerm + '个月' +
                    '</div>' +
                '</div>';
            });
        } else if (activeTab === 1) {
            // 三条红线
            const debtRatio = state.company.liabilities > 0 && state.company.totalAssets > 0 
                ? ((state.company.liabilities / state.company.totalAssets) * 100).toFixed(1) 
                : 0;
            const netDebtRatio = Math.min(150, Math.random() * 100 + 30).toFixed(1);
            const cashShortTermDebt = Math.max(0.5, Math.random() * 2).toFixed(2);
            
            html += '<div class="section-title">📊 三条红线</div>' +
                '<div class="card">' +
                    '<div class="card-title">剔除预收款后的资产负债率</div>' +
                    '<div style="display:flex;justify-content:space-between;margin-top:10px">' +
                        '<span style="color:' + (debtRatio > 70 ? '#ef4444' : '#22c55e') + ';font-weight:700;font-size:24px">' + debtRatio + '%</span>' +
                        '<span style="color:#94a3b8">标准: ≤70%</span>' +
                    '</div>' +
                    '<div class="progress-bar" style="margin-top:10px">' +
                        '<div class="progress-fill" style="width:' + Math.min(100, debtRatio) + '%;background:' + (debtRatio > 70 ? '#ef4444' : '#22c55e') + '"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">净负债率</div>' +
                    '<div style="display:flex;justify-content:space-between;margin-top:10px">' +
                        '<span style="color:' + (netDebtRatio > 100 ? '#ef4444' : '#22c55e') + ';font-weight:700;font-size:24px">' + netDebtRatio + '%</span>' +
                        '<span style="color:#94a3b8">标准: ≤100%</span>' +
                    '</div>' +
                    '<div class="progress-bar" style="margin-top:10px">' +
                        '<div class="progress-fill" style="width:' + Math.min(100, netDebtRatio) + '%;background:' + (netDebtRatio > 100 ? '#ef4444' : '#22c55e') + '"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">现金短债比</div>' +
                    '<div style="display:flex;justify-content:space-between;margin-top:10px">' +
                        '<span style="color:' + (cashShortTermDebt < 1 ? '#ef4444' : '#22c55e') + ';font-weight:700;font-size:24px">' + cashShortTermDebt + '</span>' +
                        '<span style="color:#94a3b8">标准: ≥1.0</span>' +
                    '</div>' +
                '</div>';
        } else if (activeTab === 2) {
            // 税务筹划
            html += '<div class="section-title">📋 税务筹划</div>' +
                '<div class="card">' +
                    '<div class="card-title">增值税筹划</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">合理利用税收优惠政策</div>' +
                    '<div style="margin-top:12px;color:#94a3b8;font-size:13px">预计节税: ' + Utils.formatMoney(Math.floor(Math.random() * 1000000) + 500000) + '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">企业所得税筹划</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">优化成本结构，降低税负</div>' +
                    '<div style="margin-top:12px;color:#94a3b8;font-size:13px">预计节税: ' + Utils.formatMoney(Math.floor(Math.random() * 2000000) + 1000000) + '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">土地增值税筹划</div>' +
                    '<div class="card-subtitle" style="margin-top:8px">合理规划项目结算方式</div>' +
                    '<div style="margin-top:12px;color:#94a3b8;font-size:13px">预计节税: ' + Utils.formatMoney(Math.floor(Math.random() * 5000000) + 3000000) + '</div>' +
                '</div>';
        } else if (activeTab === 3) {
            // 财务报表
            html += '<div class="section-title">📈 财务报表</div>' +
                '<div class="card">' +
                    '<div class="card-title">资产负债表</div>' +
                    '<div style="margin-top:15px">' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                            '<span style="color:#94a3b8">流动资产</span>' +
                            '<span style="font-weight:600">' + Utils.formatMoney(state.company.cash) + '</span>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                            '<span style="color:#94a3b8">非流动资产</span>' +
                            '<span style="font-weight:600">' + Utils.formatMoney(state.company.totalAssets - state.company.cash) + '</span>' +
                        '</div>' +
                        '<div style="border-top:1px solid var(--border);margin:10px 0"></div>' +
                        '<div style="display:flex;justify-content:space-between;font-weight:700">' +
                            '<span>总资产</span>' +
                            '<span style="color:#22c55e">' + Utils.formatMoney(state.company.totalAssets) + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="card" style="margin-top:16px">' +
                    '<div class="card-title">利润表</div>' +
                    '<div style="margin-top:15px">' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                            '<span style="color:#94a3b8">营业收入</span>' +
                            '<span style="font-weight:600">' + Utils.formatMoney(Math.floor(Math.random() * 50000000) + 10000000) + '</span>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                            '<span style="color:#94a3b8">营业成本</span>' +
                            '<span style="font-weight:600">' + Utils.formatMoney(Math.floor(Math.random() * 30000000) + 5000000) + '</span>' +
                        '</div>' +
                        '<div style="border-top:1px solid var(--border);margin:10px 0"></div>' +
                        '<div style="display:flex;justify-content:space-between;font-weight:700">' +
                            '<span>净利润</span>' +
                            '<span style="color:#f97316">' + Utils.formatMoney(state.company.monthlyProfit) + '</span>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
        
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
