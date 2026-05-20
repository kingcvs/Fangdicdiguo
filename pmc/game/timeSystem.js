// 时间系统
const TimeSystem = {
    // 游戏循环计时器
    interval: null,
    // 上次更新时间
    lastUpdate: null,
    // 每天对应的实际毫秒数
    dayDuration: 500, // 默认0.5秒一天
    
    // 初始化
    init: function() {
        this.lastUpdate = Date.now();
        this.startLoop();
    },
    
    // 开始游戏循环
    startLoop: function() {
        const self = this;
        this.interval = setInterval(function() {
            self.tick();
        }, 50);
    },
    
    // 停止游戏循环
    stopLoop: function() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    // 游戏主循环
    tick: function() {
        const state = GameState.get();
        if (state.isPaused) return;
        
        const now = Date.now();
        const delta = now - this.lastUpdate;
        
        // 根据游戏速度计算是否推进时间
        const speedMultiplier = state.speed || 1;
        const requiredTime = this.dayDuration / speedMultiplier;
        
        if (delta >= requiredTime) {
            this.advanceDay();
            this.lastUpdate = now;
        }
    },
    
    // 推进一天
    advanceDay: function() {
        const state = GameState.get();
        const oldDate = new Date(state.date);
        
        // 推进日期
        state.date.setDate(state.date.getDate() + 1);
        
        // 检查是否需要刷新土地（每10天）
        const dayOfMonth = state.date.getDate();
        if (dayOfMonth % 10 === 1) {
            this.refreshLandMarket();
        }
        
        // 检查是否进入新的一个月
        if (state.date.getMonth() !== oldDate.getMonth() || state.date.getFullYear() !== oldDate.getFullYear()) {
            this.processMonthly();
        }
        
        // 每天生成新事件
        this.generateDailyEvent();
        
        // 通知更新
        GameState.notify();
    },
    
    // 刷新土地市场
    refreshLandMarket: function() {
        const state = GameState.get();
        const city = state.company.city;
        
        // 移除所有待售土地，保留已有土地
        state.land = state.land.filter(function(l) {
            return l.status !== GameTypes.LandStatus.AVAILABLE;
        });
        
        // 生成新一批随机土地
        const newLands = InitialData.generateRandomLands(city, 8);
        state.land = state.land.concat(newLands);
        
        UI.showToast('🏗️ 土地市场已更新，新地块上架！');
    },
    
    // 每日生成事件
    generateDailyEvent: function() {
        const state = GameState.get();
        const newEvents = InitialData.generateEvents(state);
        state.events = newEvents.concat(state.events).slice(0, 30); // 保留最近30条
    },
    
    // 月度处理
    processMonthly: function() {
        const state = GameState.get();
        
        // 支付员工工资
        this.paySalaries();
        
        // 处理贷款还款
        this.processLoans();
        
        // 更新项目进度
        this.updateProjects();
        
        // 检查项目竣工并更新累计面积
        this.checkProjectCompletion();
        
        // 检查资质升级
        this.checkQualificationUpgrade();
        
        // 刷新市场环境（每月）
        this.refreshMarketEnv();
        
        // 刷新宏观经济数据（每季度）
        if (state.date.getMonth() % 3 === 0) {
            this.refreshMacroData();
        }
        
        // 更新市场
        Economy.updateMarket();
        
        // 更新财务报表
        Accounting.calculateMonthly();
        
        // 更新总资产和负债
        state.company.totalAssets = Utils.calculateTotalAssets(state);
        state.company.liabilities = Utils.calculateTotalLiabilities(state);
        
        // 检查成就
        GameState.checkAchievements();
    },
    
    // 检查项目竣工
    checkProjectCompletion: function() {
        const state = GameState.get();
        state.projects.forEach(function(project) {
            if (project.status === GameTypes.ProjectStatus.COMPLETED && !project.areaAdded) {
                state.company.totalCompletedArea += project.area || 100000;
                project.areaAdded = true;
            }
        });
    },
    
    // 检查资质升级
    checkQualificationUpgrade: function() {
        const state = GameState.get();
        const company = state.company;
        const area = company.totalCompletedArea;
        
        // 升级条件：5万→三级，25万→二级，100万→一级
        if (area >= 1000000 && company.qualificationLevel > 1) {
            company.qualificationLevel = 1;
            company.developableArea = 1000000;
            UI.showToast('🎖️ 资质升级为一级！');
        } else if (area >= 250000 && company.qualificationLevel > 2) {
            company.qualificationLevel = 2;
            company.developableArea = 500000;
            UI.showToast('🎖️ 资质升级为二级！');
        } else if (area >= 50000 && company.qualificationLevel > 3) {
            company.qualificationLevel = 3;
            company.developableArea = 200000;
            UI.showToast('🎖️ 资质升级为三级！');
        }
    },
    
    // 刷新市场环境
    refreshMarketEnv: function() {
        const state = GameState.get();
        state.marketEnv = InitialData.generateMarketEnv();
    },
    
    // 刷新宏观经济数据
    refreshMacroData: function() {
        const state = GameState.get();
        state.macroData = InitialData.generateMacroData();
    },
    
    // 支付员工工资
    paySalaries: function() {
        const state = GameState.get();
        let totalSalary = 0;
        
        state.employees.forEach(function(emp) {
            if (emp.status !== GameTypes.EmployeeStatus.FIRED) {
                totalSalary += emp.salary;
            }
        });
        
        if (totalSalary > 0) {
            state.company.cash -= totalSalary;
            GameState.addTransaction(
                GameTypes.TransactionType.EXPENSE,
                totalSalary,
                '员工工资',
                '人力成本'
            );
        }
    },
    
    // 处理贷款还款
    processLoans: function() {
        const state = GameState.get();
        
        state.loans.forEach(function(loan) {
            if (loan.status !== GameTypes.LoanStatus.ACTIVE) return;
            
            // 计算月还款
            const monthlyPayment = loan.monthlyPayment;
            const interestPortion = loan.remainingBalance * (loan.interestRate / 12);
            const principalPortion = monthlyPayment - interestPortion;
            
            // 还款
            state.company.cash -= monthlyPayment;
            loan.remainingBalance -= principalPortion;
            loan.paidMonths = (loan.paidMonths || 0) + 1;
            
            GameState.addTransaction(
                GameTypes.TransactionType.EXPENSE,
                monthlyPayment,
                '贷款还款：' + loan.name,
                '财务费用'
            );
            
            // 检查是否还清
            if (loan.remainingBalance <= 0 || loan.paidMonths >= loan.termMonths) {
                loan.status = GameTypes.LoanStatus.PAID;
                loan.remainingBalance = 0;
                UI.showToast('✅ 贷款已还清：' + loan.name);
            }
        });
    },
    
    // 更新项目进度
    updateProjects: function() {
        const state = GameState.get();
        
        state.projects.forEach(function(project) {
            if (project.status === GameTypes.ProjectStatus.COMPLETED) return;
            
            // 获取项目经理的加成
            let speedBonus = 0;
            let qualityBonus = 0;
            let costBonus = 0;
            
            if (project.projectManagerId) {
                const manager = state.employees.find(function(e) {
                    return e.id === project.projectManagerId;
                });
                if (manager) {
                    speedBonus = manager.speed;
                    qualityBonus = manager.quality;
                    costBonus = manager.cost;
                }
            }
            
            // 根据项目状态处理
            switch (project.status) {
                case GameTypes.ProjectStatus.CERTIFICATION:
                    this.processCertification(project, speedBonus);
                    break;
                case GameTypes.ProjectStatus.CONSTRUCTION:
                    this.processConstruction(project, speedBonus, qualityBonus, costBonus);
                    break;
                case GameTypes.ProjectStatus.PRESALE:
                    this.processPresale(project, qualityBonus);
                    break;
            }
        }.bind(this));
    },
    
    // 处理证书办理
    processCertification: function(project, speedBonus) {
        // 先解锁下一个证书（如果上一个已完成）
        this.unlockNextCertificate(project);
        
        // 处理正在办理的证书
        for (let i = 0; i < project.certificates.length; i++) {
            const cert = project.certificates[i];
            
            if (cert.status === GameTypes.CertificateStatus.PROCESSING) {
                // 计算进度
                const baseSpeed = 100 / (cert.duration || 30);
                const speed = baseSpeed * (1 + speedBonus * 0.1);
                cert.progress = Math.min(100, cert.progress + speed);
                
                if (cert.progress >= 100) {
                    cert.status = GameTypes.CertificateStatus.COMPLETED;
                    cert.obtainedDate = new Date(GameState.get().date);
                    
                    UI.showToast('📜 获得证书：' + cert.name);
                    
                    // 解锁下一个证书
                    this.unlockNextCertificate(project);
                    
                    // 检查是否所有证书都完成
                    const allComplete = project.certificates.every(function(c) {
                        return c.status === GameTypes.CertificateStatus.COMPLETED;
                    });
                    
                    if (allComplete) {
                        project.status = GameTypes.ProjectStatus.PLANNING;
                        project.stages[0].completed = true;
                        project.stages[0].active = false;
                        project.stages[1].active = true;
                        UI.showToast('🏗️ ' + project.name + ' 四证完成，进入设计阶段！');
                        
                        // 自动模式下自动开始设计
                        if (project.autoMode) {
                            GameActions.startDesign(project.id);
                        }
                    }
                }
                break;
            }
        }
    },
    
    // 解锁下一个证书
    unlockNextCertificate: function(project) {
        for (let i = 0; i < project.certificates.length; i++) {
            const cert = project.certificates[i];
            
            if (cert.status === GameTypes.CertificateStatus.COMPLETED) {
                // 解锁下一个证书
                if (i + 1 < project.certificates.length) {
                    project.certificates[i + 1].unlocked = true;
                }
            }
        }
    },
    
    // 处理工程建设
    processConstruction: function(project, speedBonus, qualityBonus, costBonus) {
        if (!project.construction) {
            project.construction = {
                phase: '未开始',
                progress: 0,
                quality: 50,
                phases: [
                    { name: '地基施工', progress: 0, completed: false },
                    { name: '主体结构', progress: 0, completed: false },
                    { name: '内外装修', progress: 0, completed: false },
                    { name: '设备安装', progress: 0, completed: false },
                    { name: '竣工验收', progress: 0, completed: false }
                ],
                currentPhase: 0
            };
        }
        
        if (project.construction.phase !== '进行中') {
            return;
        }
        
        const state = GameState.get();
        const currentPhase = project.construction.currentPhase;
        const phase = project.construction.phases[currentPhase];
        
        // 计算进度
        const baseSpeed = 20;
        const speed = baseSpeed + speedBonus * 3;
        phase.progress = Math.min(100, phase.progress + speed);
        
        // 更新整体进度
        let totalProgress = 0;
        const phaseWeight = 100 / project.construction.phases.length;
        for (let i = 0; i < project.construction.phases.length; i++) {
            const p = project.construction.phases[i];
            if (p.completed) {
                totalProgress += phaseWeight;
            } else if (i === currentPhase) {
                totalProgress += phaseWeight * (p.progress / 100);
            }
        }
        project.construction.progress = totalProgress;
        project.progress = totalProgress;
        
        // 计算成本（考虑成本加成）
        const phaseCost = project.constructionCost / project.construction.phases.length;
        const monthlyCost = phaseCost / 3; // 假设每个阶段3个月
        const costModifier = 1 + costBonus / 100;
        const actualCost = monthlyCost * costModifier;
        
        // 支付工程费用
        state.company.cash -= actualCost;
        project.cost.actualCost = (project.cost.actualCost || 0) + actualCost;
        
        GameState.addTransaction(
            GameTypes.TransactionType.EXPENSE,
            actualCost,
            '工程建设：' + project.name,
            '开发成本'
        );
        
        // 质量影响售价
        project.construction.quality = (project.construction.quality || 50) + qualityBonus * 0.3;
        project.construction.quality = Math.min(100, Math.max(0, project.construction.quality));
        project.quality = project.construction.quality;
        
        // 检查当前阶段是否完成
        if (phase.progress >= 100 && !phase.completed) {
            phase.completed = true;
            
            if (currentPhase < project.construction.phases.length - 1) {
                project.construction.currentPhase++;
                UI.showToast('✅ ' + project.name + ' 完成 ' + phase.name + '！');
            } else {
                // 全部完成
                project.construction.phase = '已完成';
                project.construction.completeDate = new Date(state.date);
                project.stages[2].completed = true;
                project.stages[2].active = false;
                project.stages[3].active = true;
                project.status = GameTypes.ProjectStatus.PRESALE;
                
                UI.showToast('🏢 ' + project.name + ' 施工完成，开始预售！');
                
                // 检查完成第一个项目的成就
                const completedCount = state.projects.filter(function(p) {
                    return p.status === GameTypes.ProjectStatus.COMPLETED || 
                           p.status === GameTypes.ProjectStatus.PRESALE;
                }).length;
                if (completedCount === 1) {
                    GameState.unlockAchievement('ach_first_complete');
                }
            }
        }
    },
    
    // 处理预售
    processPresale: function(project, qualityBonus) {
        const state = GameState.get();
        
        // 计算售价（基于质量和品牌）
        const basePrice = project.expectedRevenue || (project.landCost + project.constructionCost) * 1.5;
        const qualityMultiplier = 0.8 + (project.quality || 50) / 100 * 0.4;
        const brandMultiplier = 0.8 + state.company.brandValue / 100 * 0.4;
        const finalPrice = basePrice * qualityMultiplier * brandMultiplier;
        
        // 每月销售进度
        const salesSpeed = 15 + qualityBonus; // 每月销售百分比
        project.salesProgress = (project.salesProgress || 0) + salesSpeed;
        project.salesProgress = Math.min(100, project.salesProgress);
        
        // 计算回款
        const monthlyRevenue = finalPrice * salesSpeed / 100;
        state.company.cash += monthlyRevenue;
        project.totalRevenue = (project.totalRevenue || 0) + monthlyRevenue;
        
        GameState.addTransaction(
            GameTypes.TransactionType.INCOME,
            monthlyRevenue,
            '销售收入：' + project.name,
            '销售收入'
        );
        
        // 提升品牌价值
        state.company.brandValue = Math.min(200, state.company.brandValue + 0.5);
        
        // 检查销售完成
        if (project.salesProgress >= 100) {
            project.status = GameTypes.ProjectStatus.COMPLETED;
            project.completionDate = new Date(state.date);
            
            // 计算利润
            const totalCost = project.landCost + (project.spentCost || project.constructionCost);
            const profit = (project.totalRevenue || finalPrice) - totalCost;
            
            UI.showToast('🎊 ' + project.name + ' 完成！利润：' + Utils.formatMoney(profit));
        }
    },
    
    // 设置游戏速度
    setSpeed: function(speed) {
        GameState.update(function(state) {
            state.speed = speed;
        });
    },
    
    // 暂停/继续
    togglePause: function() {
        GameState.update(function(state) {
            state.isPaused = !state.isPaused;
        });
    },
    
    // 暂停
    pause: function() {
        GameState.update(function(state) {
            state.isPaused = true;
        });
    },
    
    // 继续
    resume: function() {
        GameState.update(function(state) {
            state.isPaused = false;
        });
    }
};