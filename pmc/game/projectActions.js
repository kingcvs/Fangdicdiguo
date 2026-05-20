// 项目管理交互逻辑
const ProjectActions = {
    // 当前选中的项目
    currentProjectId: null,
    
    // 选择项目
    selectProject: function(projectId) {
        this.currentProjectId = projectId;
        GameState.notify();
    },
    
    // 成立项目公司
    establishProjectCompany: function(projectId, capitalRatio) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        // 支出50万注册费+验资费
        if (state.company.cash < 500000) {
            UI.showToast('资金不足，无法成立项目公司');
            return;
        }
        
        // 更新状态
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.status = GameTypes.ProjectStatus.PRE_CONSTRUCTION;
                p.projectCompanyEstablished = true;
                p.capitalRatio = capitalRatio || 0.3; // 默认30%
                p.companyEstablishDate = new Date();
            }
            state.company.cash -= 500000;
            state.company.totalAssets -= 500000;
        });
        
        UI.showToast('项目公司成立成功！');
        GameState.notify();
    },
    
    // 选择产品定位
    selectProductPositioning: function(projectId, positioning) {
        const positioningConfig = {
            affordable: {
                name: '刚需盘',
                constructionCostMin: 2500,
                constructionCostMax: 3500,
                absorptionRate: { min: 8, max: 15 },
                profitLevel: 'low'
            },
            improvement: {
                name: '改善盘',
                constructionCostMin: 3500,
                constructionCostMax: 5000,
                absorptionRate: { min: 5, max: 10 },
                profitLevel: 'medium'
            },
            luxury: {
                name: '高端盘',
                constructionCostMin: 5000,
                constructionCostMax: 8000,
                absorptionRate: { min: 2, max: 6 },
                profitLevel: 'high'
            },
            commercial: {
                name: '商业',
                constructionCostMin: 4000,
                constructionCostMax: 6000,
                absorptionRate: { min: 1, max: 4 },
                profitLevel: 'high'
            },
            mixed: {
                name: '综合体',
                constructionCostMin: 5000,
                constructionCostMax: 10000,
                absorptionRate: { min: 3, max: 8 },
                profitLevel: 'high'
            }
        };
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.productPositioning = positioning;
                p.positioningConfig = positioningConfig[positioning];
                // 设置建安成本区间
                const config = positioningConfig[positioning];
                p.constructionCostPerSqm = (config.constructionCostMin + config.constructionCostMax) / 2;
            }
        });
        
        UI.showToast('已选择：' + positioningConfig[positioning].name);
        GameState.notify();
    },
    
    // 选择设计方案
    selectDesignScheme: function(projectId, scheme) {
        const schemeConfig = {
            standard: {
                name: '标准化方案',
                designCostPerSqm: 80,
                brandBonus: 0,
                conversionBonus: 0
            },
            custom: {
                name: '定制化方案',
                designCostPerSqm: 150,
                brandBonus: 5,
                conversionBonus: 0
            },
            master: {
                name: '大师联名',
                designCostPerSqm: 300,
                brandBonus: 15,
                conversionBonus: 10
            }
        };
        
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        const config = schemeConfig[scheme];
        const designCost = config.designCostPerSqm * project.constructionArea;
        
        if (state.company.cash < designCost) {
            UI.showToast('资金不足，设计费用需要 ' + Utils.formatMoney(designCost));
            return;
        }
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.designScheme = scheme;
                p.designConfig = config;
                p.totalDesignCost = designCost;
                p.brandValue += config.brandBonus;
            }
            state.company.cash -= designCost;
            state.company.totalAssets -= designCost;
        });
        
        UI.showToast('已选择：' + config.name + '，品牌值+' + config.brandBonus);
        GameState.notify();
    },
    
    // 报批报建 - 选择策略
    selectApprovalStrategy: function(projectId, stage, strategy) {
        const stageConfigs = {
            land_planning: {
                name: '建设用地规划许可证',
                strategies: {
                    normal: { name: '正常流程', time: 1.5, cost: 0, successRate: 0.95 },
                    expedite: { name: '加急通道', time: 0.5, cost: 2000000, successRate: 0.9 }
                }
            },
            design_review: {
                name: '方案审查',
                strategies: {
                    normal: { name: '一次通过', time: 1, cost: 0, successRate: 1, areaReduction: 0.075 },
                    max_far: { name: '极限容积率', time: 1, cost: 0, successRate: 1, revisionChance: 0.5 },
                    exceed: { name: '超限报批', time: 3, cost: 0, successRate: 0.3 }
                }
            },
            construction_planning: {
                name: '建设工程规划许可证',
                strategies: {
                    normal: { name: '正常流程', time: 1.5, cost: 0, successRate: 0.95 },
                    expedite: { name: '加急通道', time: 0.5, cost: 2000000, successRate: 0.9 }
                }
            },
            construction_permit: {
                name: '施工许可证',
                strategies: {
                    sequential: { name: '逐项送审', time: 2, costMultiplier: 20, successRate: 1 },
                    parallel: { name: '并行送审', time: 1, costMultiplier: 40, successRate: 0.9 },
                    green: { name: '绿色通道', time: 0.5, costMultiplier: 30, successRate: 1, requireCredit: 'AA+' }
                }
            }
        };
        
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        const stageConfig = stageConfigs[stage];
        const strategyConfig = stageConfig.strategies[strategy];
        
        // 检查绿色通道权限
        if (strategy === 'green' && state.company.creditLevel !== 'AA+') {
            UI.showToast('信用评级不足，无法使用绿色通道');
            return;
        }
        
        // 计算费用
        let cost = strategyConfig.cost;
        if (strategyConfig.costMultiplier) {
            cost = strategyConfig.costMultiplier * project.constructionArea;
        }
        
        if (state.company.cash < cost) {
            UI.showToast('资金不足');
            return;
        }
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                if (!p.approvalProgress) p.approvalProgress = {};
                p.approvalProgress[stage] = {
                    strategy: strategy,
                    config: strategyConfig,
                    status: 'processing',
                    startTime: new Date(),
                    timeRemaining: strategyConfig.time
                };
            }
            state.company.cash -= cost;
        });
        
        UI.showToast('已选择策略：' + strategyConfig.name);
        GameState.notify();
    },
    
    // 选择总包商
    selectContractor: function(projectId, contractorType) {
        const contractorConfig = {
            central_enterprise: {
                name: '央企总包',
                qualityBonus: 20,
                speedMultiplier: 0.9,
                costMultiplier: 1.25,
                accidentRate: 0.02
            },
            local_leader: {
                name: '地方龙头',
                qualityBonus: 5,
                speedMultiplier: 1.0,
                costMultiplier: 1.1,
                accidentRate: 0.08
            },
            general: {
                name: '普通承包商',
                qualityBonus: -5,
                speedMultiplier: 1.1,
                costMultiplier: 0.95,
                accidentRate: 0.15
            },
            low_cost: {
                name: '低价承包商',
                qualityBonus: -15,
                speedMultiplier: 1.2,
                costMultiplier: 0.8,
                accidentRate: 0.25
            }
        };
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.contractorType = contractorType;
                p.contractorConfig = contractorConfig[contractorType];
                p.status = GameTypes.ProjectStatus.CONSTRUCTION;
                p.constructionProgress = 0;
                p.currentPhase = 'foundation';
            }
        });
        
        UI.showToast('已选择：' + contractorConfig[contractorType].name);
        GameState.notify();
    },
    
    // 工程管理决策
    executeEngineeringAction: function(projectId, action) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        const actions = {
            inspection: {
                name: '现场巡查',
                cost: 100000,
                effect: '发现问题概率+30%'
            },
            rush: {
                name: '赶工令',
                costMultiplier: 0.05,
                speedBonus: 0.2,
                qualityPenalty: 5
            },
            supervision: {
                name: '增加监理',
                costPerSqm: 5,
                accidentRateReduction: 0.5
            },
            normal: {
                name: '正常推进',
                cost: 0
            }
        };
        
        const actionConfig = actions[action];
        let cost = actionConfig.cost || 0;
        
        if (actionConfig.costMultiplier) {
            cost = actionConfig.costMultiplier * project.totalConstructionCost;
        } else if (actionConfig.costPerSqm) {
            cost = actionConfig.costPerSqm * project.constructionArea;
        }
        
        if (state.company.cash < cost) {
            UI.showToast('资金不足');
            return;
        }
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                if (!p.engineeringActions) p.engineeringActions = [];
                p.engineeringActions.push({
                    action: action,
                    date: new Date(),
                    cost: cost
                });
                
                if (actionConfig.speedBonus) {
                    p.constructionSpeed = (p.constructionSpeed || 1) * (1 + actionConfig.speedBonus);
                }
                if (actionConfig.qualityPenalty) {
                    p.qualityScore = (p.qualityScore || 100) - actionConfig.qualityPenalty;
                }
                if (actionConfig.accidentRateReduction && p.contractorConfig) {
                    p.contractorConfig.accidentRate *= (1 - actionConfig.accidentRateReduction);
                }
            }
            state.company.cash -= cost;
        });
        
        UI.showToast('已执行：' + actionConfig.name);
        GameState.notify();
    },
    
    // 处理质量事故
    handleQualityAccident: function(projectId, action) {
        const actions = {
            full_rework: {
                name: '全面返工',
                time: 2,
                costMultiplier: 0.08,
                brandEffect: 0
            },
            partial_repair: {
                name: '局部修复',
                time: 1,
                costMultiplier: 0.03,
                brandEffect: -5,
                complaintRateIncrease: 15
            },
            cover_up: {
                name: '瞒报处理',
                time: 0.5,
                costMultiplier: 0.01,
                brandEffect: -15,
                exposureChance: 0.3
            }
        };
        
        const actionConfig = actions[action];
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        const cost = actionConfig.costMultiplier * project.totalConstructionCost;
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.constructionDelay = (p.constructionDelay || 0) + actionConfig.time;
                p.qualityIncidents = (p.qualityIncidents || 0) + 1;
                
                if (actionConfig.brandEffect) {
                    state.company.brandValue += actionConfig.brandEffect;
                }
                if (actionConfig.complaintRateIncrease) {
                    p.complaintRate = (p.complaintRate || 0) + actionConfig.complaintRateIncrease;
                }
                
                // 瞒报处理的风险
                if (action === 'cover_up' && Math.random() < actionConfig.exposureChance) {
                    state.company.brandValue -= 30;
                    state.company.publicOpinion = (state.company.publicOpinion || 0) + 30;
                    p.constructionDelay += 1; // 停工检查
                }
            }
            state.company.cash -= cost;
        });
        
        UI.showToast('已选择：' + actionConfig.name);
        GameState.notify();
    },
    
    // 申请预售许可
    applyPresalePermit: function(projectId) {
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.presaleApplied = true;
                p.presaleStatus = 'processing';
                p.presaleApprovalTime = 1;
                
                // 随机事件
                const roll = Math.random();
                if (roll < 0.1) {
                    p.presaleFundRegulation = 0.5; // 资金监管比例上调到50%
                    UI.showToast('预售资金监管比例上调至50%');
                } else if (roll < 0.15) {
                    p.presaleApprovalTime += 1;
                    UI.showToast('预售证被卡，需补充材料');
                }
            }
        });
        
        UI.showToast('预售许可申请已提交');
        GameState.notify();
    },
    
    // 选择定价档位
    selectPricingTier: function(projectId, tier) {
        const tierConfig = {
            low_volume: { name: '低价跑量', multiplier: 0.84, absorptionBonus: 40 },
            below_average: { name: '低于均价', multiplier: 0.9, absorptionBonus: 20 },
            recommended: { name: '建议定价', multiplier: 1.0, absorptionBonus: 0 },
            above_average: { name: '高于均价', multiplier: 1.1, absorptionBonus: -25 },
            premium: { name: '溢价策略', multiplier: 1.19, absorptionBonus: -45 }
        };
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.pricingTier = tier;
                p.pricingConfig = tierConfig[tier];
                p.sellingPrice = Math.round(p.marketPrice * tierConfig[tier].multiplier);
                p.absorptionRate = (p.baseAbsorptionRate || 8) * (1 + tierConfig[tier].absorptionBonus / 100);
            }
        });
        
        UI.showToast('已选择定价策略：' + tierConfig[tier].name);
        GameState.notify();
    },
    
    // 选择开盘方式
    selectLaunchMethod: function(projectId, method) {
        const methodConfig = {
            offline: {
                name: '线下集中开盘',
                conversionBonus: 10,
                cost: 5000000,
                riskEvent: { chance: 0.15, event: '黄牛暗箱操作', opinionImpact: 10 }
            },
            online: {
                name: '线上选房',
                conversionBonus: 5,
                cost: 1000000,
                riskEvent: { chance: 0.1, event: '系统崩溃', customerLoss: 5 }
            },
            normal: {
                name: '常规平销',
                conversionBonus: 0,
                cost: 0,
                riskEvent: null
            }
        };
        
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        const config = methodConfig[method];
        
        if (state.company.cash < config.cost) {
            UI.showToast('资金不足');
            return;
        }
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.launchMethod = method;
                p.launchConfig = config;
                p.conversionRate = (p.conversionRate || 20) + config.conversionBonus;
                
                // 检查风险事件
                if (config.riskEvent && Math.random() < config.riskEvent.chance) {
                    if (config.riskEvent.opinionImpact) {
                        state.company.publicOpinion = (state.company.publicOpinion || 0) + config.riskEvent.opinionImpact;
                    }
                    if (config.riskEvent.customerLoss) {
                        p.customerPool = (p.customerPool || 0) * (1 - config.riskEvent.customerLoss / 100);
                    }
                }
            }
            state.company.cash -= config.cost;
        });
        
        UI.showToast('已选择：' + config.name);
        GameState.notify();
    },
    
    // 设置折扣
    setDiscount: function(projectId, discount) {
        const discountConfig = {
            '100': { name: '无折扣', absorptionBonus: 0 },
            '98': { name: '98折', absorptionBonus: 5 },
            '95': { name: '95折', absorptionBonus: 12 },
            '92': { name: '92折', absorptionBonus: 20 },
            '90': { name: '90折', absorptionBonus: 30 }
        };
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.discount = parseInt(discount);
                p.discountConfig = discountConfig[discount];
                p.absorptionRate = (p.absorptionRate || 8) * (1 + discountConfig[discount].absorptionBonus / 100);
            }
        });
        
        UI.showToast('已设置折扣：' + discountConfig[discount].name);
        GameState.notify();
    },
    
    // 选择蓄客渠道
    selectCustomerChannels: function(projectId, channels) {
        const channelConfig = {
            natural: { name: '自然来访', cost: 0, customersPerMonth: function(proj) { return Math.floor(proj.constructionArea / 5); }, quality: 'C' },
            online: { name: '线上投放', cost: 1000000, customersPerMonth: 300, quality: 'B' },
            channel: { name: '渠道带客', cost: 0, customersPerMonth: 500, quality: 'B', commissionRate: 0.03 },
            referral: { name: '老带新', cost: 0, customersPerMonth: 100, quality: 'A', reward: 10000 },
            circle: { name: '圈层营销', cost: 3000000, customersPerMonth: 100, quality: 'A' }
        };
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.selectedChannels = channels;
                p.channelConfigs = channels.map(function(c) { return channelConfig[c]; });
                
                // 计算每月蓄客
                let totalCost = 0;
                let totalCustomers = 0;
                channels.forEach(function(c) {
                    const config = channelConfig[c];
                    totalCost += config.cost || 0;
                    totalCustomers += typeof config.customersPerMonth === 'function' ? config.customersPerMonth(p) : config.customersPerMonth;
                });
                
                p.monthlyCustomerCost = totalCost;
                p.monthlyNewCustomers = totalCustomers;
            }
        });
        
        UI.showToast('已选择蓄客渠道');
        GameState.notify();
    },
    
    // 选择合作银行
    selectBank: function(projectId, bankId) {
        const bankConfig = {
            icbc: { name: '工商银行', rate: 0.041, speedMultiplier: 1.0, quota: 1.0, acceptance: '高' },
            ccb: { name: '建设银行', rate: 0.040, speedMultiplier: 0.9, quota: 0.9, acceptance: '中' },
            abc: { name: '农业银行', rate: 0.042, speedMultiplier: 1.1, quota: 0.95, acceptance: '中' },
            boc: { name: '中国银行', rate: 0.039, speedMultiplier: 0.8, quota: 0.85, acceptance: '低' },
            joint_stock: { name: '股份制银行', rate: 0.038, speedMultiplier: 0.7, quota: 0.75, acceptance: '低' }
        };
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.partnerBank = bankId;
                p.bankConfig = bankConfig[bankId];
            }
        });
        
        UI.showToast('已选择合作银行：' + bankConfig[bankId].name);
        GameState.notify();
    },
    
    // 处理逾期
    handleOverdue: function(projectId, action) {
        const actions = {
            switch_bank: { name: '协助客户换银行', time: 1, successRate: 0.7 },
            urge_bank: { name: '催促原银行加快', cost: 500000, successRate: 0.5 },
            demand_full_payment: { name: '要求客户补齐尾款', successRate: 0.7, defaultChance: 0.3 }
        };
        
        const actionConfig = actions[action];
        const state = GameState.get();
        
        if (actionConfig.cost && state.company.cash < actionConfig.cost) {
            UI.showToast('资金不足');
            return;
        }
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                if (actionConfig.time) {
                    p.contractDelay = (p.contractDelay || 0) + actionConfig.time;
                }
                
                const success = Math.random() < actionConfig.successRate;
                
                if (action === 'demand_full_payment' && !success) {
                    // 客户违约退房
                    p.defaultedUnits = (p.defaultedUnits || 0) + 1;
                    p.refundedDeposit = (p.refundedDeposit || 0) + 50000; // 定金不退
                }
            }
            if (actionConfig.cost) {
                state.company.cash -= actionConfig.cost;
            }
        });
        
        UI.showToast('已执行：' + actionConfig.name);
        GameState.notify();
    },
    
    // 选择验收策略
    selectInspectionStrategy: function(projectId, strategy) {
        const strategyConfig = {
            thorough: { name: '全面精验', time: 2, confidence: 100, issueRate: 0 },
            spot_check: { name: '抽检验收', time: 1, confidence: 85, issueRate: 0.15 },
            fast: { name: '快速验收', time: 0.5, confidence: 65, issueRate: 0.35, complaintBonus: 30 }
        };
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.inspectionStrategy = strategy;
                p.inspectionConfig = strategyConfig[strategy];
                p.inspectionTime = strategyConfig[strategy].time;
                p.qualityConfidence = strategyConfig[strategy].confidence;
                
                // 检查是否有遗留问题
                if (Math.random() < strategyConfig[strategy].issueRate) {
                    p.remainingIssues = Math.floor(Math.random() * 5) + 1;
                    UI.showToast('验收发现 ' + p.remainingIssues + ' 处质量问题');
                }
            }
        });
        
        UI.showToast('已选择：' + strategyConfig[strategy].name);
        GameState.notify();
    },
    
    // 处理验收问题
    handleInspectionIssues: function(projectId, action) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project || !project.remainingIssues) return;
        
        const actions = {
            full_fix: { name: '全部整改', time: 1, costMultiplier: 1, brandBonus: 5 },
            partial_fix: { name: '整改70%', time: 0.5, costMultiplier: 0.7, brandBonus: -3, complaintBonus: 15 },
            symbolic_fix: { name: '象征性整改', time: 0.2, costMultiplier: 0.3, brandBonus: -15, complaintBonus: 40 }
        };
        
        const actionConfig = actions[action];
        const fixCost = (project.remainingIssues * 50000) * actionConfig.costMultiplier;
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.inspectionDelay = (p.inspectionDelay || 0) + actionConfig.time;
                p.remainingIssues = 0;
                
                if (actionConfig.brandBonus) {
                    state.company.brandValue += actionConfig.brandBonus;
                }
                if (actionConfig.complaintBonus) {
                    p.complaintRate = (p.complaintRate || 0) + actionConfig.complaintBonus;
                }
            }
            state.company.cash -= fixCost;
        });
        
        UI.showToast('已执行：' + actionConfig.name);
        GameState.notify();
    },
    
    // 清盘结算
    settleProject: function(projectId) {
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.status = GameTypes.ProjectStatus.COMPLETED;
                p.settled = true;
                p.settlementDate = new Date();
                
                // 计算利润
                const totalRevenue = p.totalRevenue || 0;
                const totalCost = p.totalCost || 0;
                const profit = totalRevenue - totalCost;
                
                state.company.cash += profit;
                state.company.totalAssets += profit;
                
                // 归档项目
                if (!state.archivedProjects) state.archivedProjects = [];
                state.archivedProjects.push(p);
                
                // 从活跃项目中移除
                const index = state.projects.findIndex(function(proj) { return proj.id === projectId; });
                if (index > -1) {
                    state.projects.splice(index, 1);
                }
            }
        });
        
        UI.showToast('项目已清盘结算');
        GameState.notify();
    },
    
    // 设置营销预算
    setMarketingBudget: function(projectId, ratio) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        const totalValue = project.totalValue || (project.constructionArea * 15000); // 假设单价15000
        const budget = totalValue * ratio;
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.marketingBudgetRatio = ratio;
                p.marketingBudget = budget;
                p.monthlyMarketingSpend = budget / 12; // 假设12个月营销周期
            }
        });
        
        UI.showToast('已设置营销预算：' + Utils.formatMoney(budget) + ' (占货值' + (ratio * 100) + '%)');
        GameState.notify();
    },
    
    // 调整定价
    adjustPricing: function(projectId, newPrice) {
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                const oldPrice = p.sellingPrice;
                p.sellingPrice = newPrice;
                p.lastPriceChange = new Date();
                
                // 检查是否降价
                if (newPrice < oldPrice) {
                    p.priceReductionPending = true;
                    p.priceReductionDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天后生效
                    UI.showToast('降价已申请，30天后生效');
                } else {
                    // 涨价，去化速度-10%
                    p.absorptionRate = (p.absorptionRate || 8) * 0.9;
                    UI.showToast('已上调价格，去化速度-10%');
                }
            }
        });
        GameState.notify();
    },
    
    // 开盘
    launchProject: function(projectId) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.status = GameTypes.ProjectStatus.PRESALE;
                p.launchDate = new Date();
                p.totalUnits = p.totalUnits || Math.floor(p.constructionArea / 100); // 假设每套100㎡
                p.soldUnits = 0;
                p.customerPool = 0;
            }
        });
        
        UI.showToast('项目已开盘！');
        GameState.notify();
    },
    
    // 处理质量事故
    handleQualityIncident: function(projectId, incidentType, action) {
        const incidentTypes = {
            foundation: { name: '基础质量问题', baseCost: 500000, baseTime: 2 },
            structure: { name: '主体结构问题', baseCost: 1000000, baseTime: 3 },
            facade: { name: '外立面问题', baseCost: 300000, baseTime: 1 },
            electrical: { name: '机电问题', baseCost: 500000, baseTime: 2 },
            other: { name: '其他质量问题', baseCost: 200000, baseTime: 1 }
        };
        
        const incident = incidentTypes[incidentType] || incidentTypes.other;
        
        const actions = {
            full_rework: { name: '全面返工', timeMultiplier: 2, costMultiplier: 0.08, brandEffect: 0 },
            partial_repair: { name: '局部修复', timeMultiplier: 1, costMultiplier: 0.03, brandEffect: -5, complaintBonus: 15 },
            cover_up: { name: '瞒报处理', timeMultiplier: 0.5, costMultiplier: 0.01, brandEffect: -15, exposureChance: 0.3 }
        };
        
        const actionConfig = actions[action];
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        
        if (!project) return;
        
        const cost = incident.baseCost + (actionConfig.costMultiplier * project.totalConstructionCost);
        
        GameState.update(function(state) {
            const p = state.projects.find(function(proj) { return proj.id === projectId; });
            if (p) {
                p.constructionDelay = (p.constructionDelay || 0) + incident.baseTime * actionConfig.timeMultiplier;
                p.qualityIncidents = (p.qualityIncidents || 0) + 1;
                p.lastIncidentType = incidentType;
                
                if (actionConfig.brandEffect) {
                    state.company.brandValue += actionConfig.brandEffect;
                }
                if (actionConfig.complaintBonus) {
                    p.complaintRate = (p.complaintRate || 0) + actionConfig.complaintBonus;
                }
                
                // 瞒报处理的风险
                if (action === 'cover_up' && Math.random() < actionConfig.exposureChance) {
                    state.company.brandValue -= 30;
                    state.company.publicOpinion = (state.company.publicOpinion || 0) + 30;
                    p.constructionDelay += 1;
                    UI.showToast('质量问题被曝光！舆论+30');
                }
            }
            state.company.cash -= cost;
        });
        
        UI.showToast('已处理' + incident.name + '：' + actionConfig.name);
        GameState.notify();
    }
};
