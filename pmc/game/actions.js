// 游戏操作
const GameActions = {
    // 显示项目详情
    showProjectDetail: function(projectId) {
        Pages.openProjectDetail(projectId);
    },
    
    // 切换自动模式
    toggleAutoMode: function(projectId) {
        UI.showToast('自动模式切换功能开发中...');
    },
    
    // 解雇项目经理
    fireManager: function(projectId) {
        UI.showToast('解雇项目经理功能开发中...');
    },
    
    // 处理下一步
    handleNextStep: function(projectId) {
        Pages.switchProjectTab('certificates');
    },
    
    // 申请证书
    applyCertificate: function(projectId, certName) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }

        const certIndex = project.certificates.findIndex(function(c) {
            return c.typeName === certName || c.name === certName;
        });

        if (certIndex === -1) {
            UI.showToast('证书不存在！');
            return;
        }

        const cert = project.certificates[certIndex];

        if (!cert.unlocked) {
            UI.showToast('该证书尚未解锁！');
            return;
        }

        if (cert.status === GameTypes.CertificateStatus.PROCESSING) {
            UI.showToast('该证书正在办理中！');
            return;
        }

        if (cert.status === GameTypes.CertificateStatus.COMPLETED) {
            UI.showToast('该证书已完成！');
            return;
        }

        // 检查是否有足够的资金
        const cost = cert.cost || 500000;
        if (state.company.cash < cost) {
            UI.showToast('资金不足！需要 ' + Utils.formatMoney(cost));
            return;
        }

        // 开始办理
        state.company.cash -= cost;
        cert.status = GameTypes.CertificateStatus.PROCESSING;
        cert.progress = 0;
        cert.startDate = new Date(state.date);

        // 添加交易记录
        GameState.addTransaction(
            GameTypes.TransactionType.EXPENSE,
            cost,
            '办理' + certName + '费用',
            '项目' + project.name
        );

        UI.showToast('✅ 已开始办理「' + certName + '」！');
        GameState.notify();
    },
    
    // 开始设计阶段
    startDesign: function(projectId) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }
        
        if (project.design.phase !== '未开始') {
            UI.showToast('设计阶段已开始！');
            return;
        }
        
        project.design.phase = '进行中';
        project.design.startDate = new Date(state.date);
        
        UI.showToast('🎨 开始项目设计！');
        GameState.notify();
    },
    
    // 设置项目定位
    setPositioning: function(projectId, positioning) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }
        
        project.design.positioning = positioning;
        
        // 根据定位调整系数
        if (positioning === '刚需') {
            project.design.costCoefficient = 0.85;
            project.design.priceCoefficient = 0.9;
            project.design.demandCoefficient = 1.2;
            project.level = '刚需';
        } else if (positioning === '改善') {
            project.design.costCoefficient = 1.0;
            project.design.priceCoefficient = 1.1;
            project.design.demandCoefficient = 1.0;
            project.level = '改善';
        } else if (positioning === '高端') {
            project.design.costCoefficient = 1.3;
            project.design.priceCoefficient = 1.5;
            project.design.demandCoefficient = 0.7;
            project.level = '高端';
        }
        
        // 计算预算
        this.calculateBudget(project);
        
        UI.showToast('🏠 项目定位已设置为: ' + positioning);
        GameState.notify();
    },
    
    // 设置外立面风格
    setFacade: function(projectId, facade) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }
        
        project.design.facade = facade;
        
        // 根据外立面调整系数
        if (facade === '现代简约') {
            project.design.costCoefficient *= 0.95;
            project.design.demandCoefficient *= 1.05;
        } else if (facade === '新中式') {
            project.design.costCoefficient *= 1.1;
            project.design.demandCoefficient *= 1.0;
        } else if (facade === 'ArtDeco') {
            project.design.costCoefficient *= 1.15;
            project.design.priceCoefficient *= 1.05;
        } else if (facade === '法式') {
            project.design.costCoefficient *= 1.25;
            project.design.priceCoefficient *= 1.15;
        }
        
        UI.showToast('🎨 外立面风格已设置为: ' + facade);
        GameState.notify();
    },
    
    // 设置容积率
    setPlotRatio: function(projectId, plotRatio) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }
        
        if (plotRatio > project.design.plotRatioLimit) {
            UI.showToast('容积率超过上限！');
            return;
        }
        
        project.design.plotRatio = plotRatio;
        this.calculateBudget(project);
        
        UI.showToast('📐 容积率已设置为: ' + plotRatio.toFixed(2));
        GameState.notify();
    },
    
    // 完成设计
    completeDesign: function(projectId) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }
        
        if (project.design.phase !== '进行中') {
            UI.showToast('设计阶段未开始或已完成！');
            return;
        }
        
        project.design.phase = '已完成';
        project.design.completeDate = new Date(state.date);
        project.stages[1].completed = true;
        project.stages[1].active = false;
        project.stages[2].active = true;
        
        // 进入下一个阶段
        project.status = GameTypes.ProjectStatus.CONSTRUCTION;
        
        UI.showToast('✅ 设计完成！项目进入施工阶段');
        
        // 自动模式下自动开始施工
        if (project.autoMode) {
            this.startConstruction(projectId);
        }
        
        GameState.notify();
    },
    
    // 开始施工
    startConstruction: function(projectId) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }
        
        if (project.construction.phase !== '未开始') {
            UI.showToast('施工已开始或已完成！');
            return;
        }
        
        project.construction.phase = '进行中';
        project.construction.startDate = new Date(state.date);
        project.construction.currentPhase = 0;
        
        UI.showToast('🏗️ 开始施工！');
        GameState.notify();
    },
    
    // 推进施工阶段
    advanceConstructionPhase: function(projectId) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }
        
        if (project.construction.phase !== '进行中') {
            UI.showToast('施工未开始或已完成！');
            return;
        }
        
        const currentPhase = project.construction.currentPhase;
        if (currentPhase < project.construction.phases.length - 1) {
            project.construction.phases[currentPhase].completed = true;
            project.construction.currentPhase++;
            UI.showToast('✅ 完成 ' + project.construction.phases[currentPhase].name + '！');
        }
        
        GameState.notify();
    },
    
    // 完成施工
    completeConstruction: function(projectId) {
        const state = GameState.get();
        const project = state.projects.find(function(p) { return p.id === projectId; });
        if (!project) {
            UI.showToast('项目不存在！');
            return;
        }
        
        if (project.construction.phase !== '进行中') {
            UI.showToast('施工未开始或已完成！');
            return;
        }
        
        project.construction.phase = '已完成';
        project.construction.completeDate = new Date(state.date);
        project.stages[2].completed = true;
        project.stages[2].active = false;
        project.stages[3].active = true;
        
        // 进入预售阶段
        project.status = GameTypes.ProjectStatus.PRESALE;
        
        UI.showToast('🎉 施工完成！项目进入预售阶段');
        GameState.notify();
    },
    
    // 计算预算
    calculateBudget: function(project) {
        const baseCost = project.landCost + project.constructionCost;
        const designCost = baseCost * 0.05;
        const totalBudget = baseCost * project.design.costCoefficient + designCost;
        
        project.cost.budget = totalBudget;
        project.cost.costBreakdown.design = designCost;
    },
    
    // 购买土地
    buyLand: function(landId) {
        const state = GameState.get();
        const land = state.land.find(function(l) {
            return l.id === landId;
        });
        
        if (!land) {
            UI.showToast('土地不存在！');
            return;
        }
        
        if (state.company.cash < land.price) {
            UI.showToast('现金不足！');
            return;
        }
        
        // 扣钱
        state.company.cash -= land.price;
        // 变更土地状态
        land.status = GameTypes.LandStatus.OWNED;
        // 添加交易记录
        GameState.addTransaction(
            GameTypes.TransactionType.EXPENSE,
            land.price,
            '购买土地: ' + land.name,
            '土地投资'
        );
        
        // 检查成就
        const ownedCount = state.land.filter(function(l) {
            return l.status === GameTypes.LandStatus.OWNED;
        }).length;
        if (ownedCount === 1) {
            GameState.unlockAchievement('ach_first_land');
        }
        
        UI.showToast('✅ 成功购买土地: ' + land.name);
        GameState.notify();
    },
    
    // 启动项目
    startProject: function(landId) {
        const state = GameState.get();
        const land = state.land.find(function(l) {
            return l.id === landId;
        });
        
        if (!land) {
            UI.showToast('土地不存在！');
            return;
        }
        
        // 选择员工Modal
        const availableEmployees = state.employees.filter(function(e) {
            return e.status === GameTypes.EmployeeStatus.AVAILABLE;
        });
        
        let modalContent = '<div class="form-group">' +
            '<label class="form-label">项目名称</label>' +
            '<input type="text" id="projectName" class="form-input" value="' + land.location + '项目" placeholder="输入项目名称">' +
        '</div>' +
        '<div class="form-group">' +
            '<label class="form-label">项目类型</label>' +
            '<select id="projectType" class="form-select">' +
                '<option value="residential">住宅项目</option>' +
                '<option value="commercial">商业项目</option>' +
            '</select>' +
        '</div>' +
        '<div class="form-group">' +
            '<label class="form-label">项目经理 (可选)</label>';
        
        if (availableEmployees.length === 0) {
            modalContent += '<div style="color:#94a3b8;padding:10px;background:#1e293b;border-radius:8px">暂无可用员工，先去招聘吧！</div>';
        } else {
            modalContent += '<select id="projectManager" class="form-select">' +
                '<option value="">无</option>';
            availableEmployees.forEach(function(emp) {
                modalContent += '<option value="' + emp.id + '">' + emp.name + ' (' + Utils.getEmployeeTypeText(emp.type) + ')</option>';
            });
            modalContent += '</select>';
        }
        
        modalContent += '</div>';
        
        const self = this;
        UI.showModal(modalContent, {
            title: '🚀 启动项目',
            footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>' +
                    '<button class="btn btn-primary" style="margin-left:10px" id="confirmStart">确认启动</button>'
        });
        
        // 绑定确认按钮
        setTimeout(function() {
            const confirmBtn = document.getElementById('confirmStart');
            if (confirmBtn) {
                confirmBtn.onclick = function() {
                    const projectName = document.getElementById('projectName').value;
                    const projectType = document.getElementById('projectType').value;
                    const managerId = document.getElementById('projectManager') ? document.getElementById('projectManager').value : '';
                    
                    self.confirmStartProject(landId, projectName, projectType, managerId);
                    
                    // 关闭modal
                    const overlay = document.querySelector('.modal-overlay');
                    if (overlay) overlay.remove();
                };
            }
        }, 100);
    },
    
    // 确认启动项目
    confirmStartProject: function(landId, projectName, projectType, managerId) {
        const state = GameState.get();
        const land = state.land.find(function(l) {
            return l.id === landId;
        });
        
        if (!land) return;
        
        // 计算建设成本
        const constructionCost = land.price * 1.5;
        
        // 创建项目
        const project = {
            id: Utils.generateId('proj'),
            name: projectName,
            status: GameTypes.ProjectStatus.CERTIFICATION,
            landCost: land.price,
            constructionCost: constructionCost,
            progress: 0,
            location: land.location,
            area: land.buildArea || 100000,
            size: land.size,
            zoning: projectType,
            projectManagerId: managerId,
            startDate: new Date(state.date),
            quality: 50,
            city: state.company.city ? state.company.city.name : '默认城市',
            level: '刚需', // 默认等级
            type: projectType === 'commercial' ? '商业' : '住宅',
            saleType: '销售型',
            currentStage: 0,
            stages: [
                { name: '四证', completed: false, active: true },
                { name: '设计', completed: false, active: false },
                { name: '施工', completed: false, active: false },
                { name: '预售', completed: false, active: false },
                { name: '结算', completed: false, active: false },
                { name: '竣工', completed: false, active: false },
                { name: '交付', completed: false, active: false },
                { name: '完成', completed: false, active: false }
            ],
            autoMode: false,
            certificates: [
                { 
                    type: GameTypes.CertificateTypes.LAND,
                    typeName: '国有土地使用证', 
                    name: '国有土地使用证', 
                    status: GameTypes.CertificateStatus.PENDING, 
                    unlocked: true,
                    progress: 0,
                    duration: 30,
                    cost: 500000
                },
                { 
                    type: GameTypes.CertificateTypes.PLANNING,
                    typeName: '建设用地规划许可证', 
                    name: '建设用地规划许可证', 
                    status: GameTypes.CertificateStatus.PENDING, 
                    unlocked: false,
                    progress: 0,
                    duration: 25,
                    cost: 300000
                },
                { 
                    type: GameTypes.CertificateTypes.CONSTRUCTION,
                    typeName: '建设工程规划许可证', 
                    name: '建设工程规划许可证', 
                    status: GameTypes.CertificateStatus.PENDING, 
                    unlocked: false,
                    progress: 0,
                    duration: 40,
                    cost: 800000
                },
                { 
                    type: GameTypes.CertificateTypes.PRESALE,
                    typeName: '建筑工程施工许可证', 
                    name: '建筑工程施工许可证', 
                    status: GameTypes.CertificateStatus.PENDING, 
                    unlocked: false,
                    progress: 0,
                    duration: 35,
                    cost: 600000
                }
            ],
            design: {
                phase: '未开始',
                positioning: '刚需',
                facade: '现代简约',
                costCoefficient: 1.0,
                priceCoefficient: 1.0,
                demandCoefficient: 1.0,
                plotRatio: land.plotRatio || 2.5,
                plotRatioLimit: land.plotRatio || 2.5,
                greeningRate: 0.3,
                buildingDensity: 0.25
            },
            construction: {
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
            },
            cost: {
                budget: 0,
                actualCost: 0,
                costBreakdown: {
                    land: land.price,
                    construction: constructionCost,
                    design: 0,
                    marketing: 0,
                    other: 0
                }
            },
            procurement: {
                suppliers: [],
                materials: []
            },
            planning: {
                units: [],
                totalUnits: 0,
                unitTypes: []
            },
            finance: {
                cashFlow: [],
                budget: []
            }
        };
        
        // 开始办理第一个证书
        // 不再自动开始，需要玩家手动点击
        
        // 添加项目
        state.projects.push(project);
        
        // 标记土地为已开发
        land.status = GameTypes.LandStatus.DEVELOPED;
        
        // 分配员工
        if (managerId) {
            const manager = state.employees.find(function(e) {
                return e.id === managerId;
            });
            if (manager) {
                manager.status = GameTypes.EmployeeStatus.ASSIGNED;
                manager.assignedProjectId = project.id;
            }
        }
        
        // 添加交易记录
        GameState.addTransaction(
            GameTypes.TransactionType.INVESTMENT,
            land.price,
            '启动项目: ' + projectName,
            '项目投资'
        );
        
        // 检查成就
        const activeProjects = state.projects.filter(function(p) {
            return p.status !== GameTypes.ProjectStatus.COMPLETED;
        });
        if (state.projects.length === 1) {
            GameState.unlockAchievement('ach_first_project');
        }
        if (activeProjects.length >= 5) {
            GameState.unlockAchievement('ach_5_projects');
        }
        
        UI.showToast('🚀 项目已启动: ' + projectName);
        GameState.notify();
    },
    
    // 显示项目详情
    showProjectDetail: function(projectId) {
        const state = GameState.get();
        const project = state.projects.find(function(p) {
            return p.id === projectId;
        });
        
        if (!project) return;
        
        let certHtml = '';
        project.certificates.forEach(function(cert) {
            const statusClass = cert.status === GameTypes.CertificateStatus.COMPLETED ? 'completed' : 
                               cert.status === GameTypes.CertificateStatus.PROCESSING ? 'processing' : '';
            certHtml += '<div class="cert-step ' + statusClass + '">' +
                '<div class="cert-icon">' + (cert.status === GameTypes.CertificateStatus.COMPLETED ? '✅' : '📋') + '</div>' +
                '<div>' + Utils.getCertificateTypeText(cert.type) + '</div>' +
                '<div style="font-size:12px;color:#64748b">' + 
                    (cert.status === GameTypes.CertificateStatus.COMPLETED ? '已获得' : 
                     cert.status === GameTypes.CertificateStatus.PROCESSING ? '办理中 ' + cert.progress + '%' : '待办理') +
                '</div>' +
            '</div>';
        });
        
        let modalContent = '<div class="card" style="margin:0;border:none;padding:0">' +
            '<div class="card-header" style="margin-bottom:15px">' +
                '<div class="card-title">' + project.name + '</div>' +
                '<span class="project-status status-' + project.status + '">' + Utils.getProjectStatusText(project.status) + '</span>' +
            '</div>' +
            '<div style="margin-bottom:15px;color:#94a3b8">位置: ' + project.location + '</div>' +
            '<div style="margin-bottom:15px">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                    '<span style="color:#94a3b8">整体进度</span>' +
                    '<span>' + project.progress + '%</span>' +
                '</div>' +
                '<div class="progress-bar">' +
                    '<div class="progress-fill" style="width:' + project.progress + '%"></div>' +
                '</div>' +
            '</div>' +
            '<div class="certificate-steps">' + certHtml + '</div>' +
            '<div style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:15px">' +
                '<div style="text-align:center;padding:15px;background:#1e293b;border-radius:10px">' +
                    '<div style="color:#94a3b8;font-size:13px;margin-bottom:5px">土地成本</div>' +
                    '<div style="font-weight:700">' + Utils.formatMoney(project.landCost) + '</div>' +
                '</div>' +
                '<div style="text-align:center;padding:15px;background:#1e293b;border-radius:10px">' +
                    '<div style="color:#94a3b8;font-size:13px;margin-bottom:5px">建设成本</div>' +
                    '<div style="font-weight:700">' + Utils.formatMoney(project.constructionCost) + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        UI.showModal(modalContent, {
            title: '📋 项目详情'
        });
    },
    
    // 招聘员工
    hireEmployee: function(empId) {
        const state = GameState.get();
        const candidates = InitialData.getAvailableEmployees();
        const emp = candidates.find(function(e) {
            return e.id === empId;
        });
        
        if (!emp) {
            UI.showToast('员工不存在！');
            return;
        }
        
        // 添加到员工列表
        const newEmp = Utils.deepClone(emp);
        state.employees.push(newEmp);
        
        UI.showToast('✅ 已招聘: ' + emp.name);
        
        // 检查成就
        const activeEmployees = state.employees.filter(function(e) {
            return e.status !== GameTypes.EmployeeStatus.FIRED;
        });
        if (activeEmployees.length >= 10) {
            GameState.unlockAchievement('ach_employee_10');
        }
        
        GameState.notify();
    },
    
    // 品牌升级
    brandUpgrade: function() {
        const state = GameState.get();
        const cost = 1000000;
        
        if (state.company.cash < cost) {
            UI.showToast('现金不足！');
            return;
        }
        
        state.company.cash -= cost;
        state.company.brandValue = Math.min(200, state.company.brandValue + 10);
        
        GameState.addTransaction(
            GameTypes.TransactionType.EXPENSE,
            cost,
            '品牌升级',
            '品牌建设'
        );
        
        UI.showToast('🌟 品牌价值 +10');
        
        // 检查成就
        if (state.company.brandValue >= 100) {
            GameState.unlockAchievement('ach_brand_100');
        }
        
        GameState.notify();
    },
    
    // 申请贷款
    takeLoan: function(productId) {
        const state = GameState.get();
        const products = InitialData.getLoanProducts();
        const product = products.find(function(p) {
            return p.id === productId;
        });
        
        if (!product) return;
        
        let modalContent = '<div class="form-group">' +
            '<label class="form-label">贷款金额</label>' +
            '<input type="number" id="loanAmount" class="form-input" value="' + Math.min(product.maxAmount, 10000000) + '" min="100000" max="' + product.maxAmount + '" step="100000">' +
        '</div>' +
        '<div class="form-group">' +
            '<label class="form-label">贷款期限 (月)</label>' +
            '<select id="loanTerm" class="form-select">';
        
        for (let i = product.minTerm; i <= Math.min(product.maxTerm, 60); i += 6) {
            modalContent += '<option value="' + i + '">' + i + '个月</option>';
        }
        
        modalContent += '</select></div>' +
        '<div id="loanPreview" style="margin-top:15px;padding:15px;background:#1e293b;border-radius:10px">' +
            '<div style="color:#94a3b8;margin-bottom:8px">预览</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
                '<div><div style="color:#64748b;font-size:13px">月利率</div><div style="font-weight:700">' + (product.interestRate * 100 / 12).toFixed(2) + '%</div></div>' +
                '<div><div style="color:#64748b;font-size:13px">月供</div><div style="font-weight:700" id="monthlyPay">--</div></div>' +
                '<div><div style="color:#64748b;font-size:13px">总利息</div><div style="font-weight:700" id="totalInterest">--</div></div>' +
            '</div>' +
        '</div>';
        
        UI.showModal(modalContent, {
            title: '💰 申请贷款',
            footer: '<button class="btn btn-secondary" onclick="document.querySelector(\'.modal-overlay\').remove()">取消</button>' +
                    '<button class="btn btn-primary" style="margin-left:10px" id="confirmLoan">确认贷款</button>'
        });
        
        // 计算预览
        const calcPreview = function() {
            const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
            const term = parseInt(document.getElementById('loanTerm').value) || 12;
            const monthly = Utils.calculateMonthlyPayment(amount, product.interestRate, term);
            const totalInt = Utils.calculateTotalInterest(amount, product.interestRate, term);
            
            const monthlyEl = document.getElementById('monthlyPay');
            const intEl = document.getElementById('totalInterest');
            
            if (monthlyEl) monthlyEl.textContent = Utils.formatMoney(monthly);
            if (intEl) intEl.textContent = Utils.formatMoney(totalInt);
        };
        
        setTimeout(function() {
            const amountInput = document.getElementById('loanAmount');
            const termSelect = document.getElementById('loanTerm');
            
            if (amountInput) {
                amountInput.oninput = calcPreview;
            }
            if (termSelect) {
                termSelect.onchange = calcPreview;
            }
            
            // 初始计算
            calcPreview();
            
            // 确认按钮
            const confirmBtn = document.getElementById('confirmLoan');
            if (confirmBtn) {
                confirmBtn.onclick = function() {
                    const amount = parseFloat(document.getElementById('loanAmount').value) || 0;
                    const term = parseInt(document.getElementById('loanTerm').value) || 12;
                    
                    GameActions.confirmTakeLoan(product, amount, term);
                    
                    const overlay = document.querySelector('.modal-overlay');
                    if (overlay) overlay.remove();
                };
            }
        }, 100);
    },
    
    // 确认贷款
    confirmTakeLoan: function(product, amount, term) {
        const state = GameState.get();
        const monthly = Utils.calculateMonthlyPayment(amount, product.interestRate, term);
        
        const loan = {
            id: Utils.generateId('loan'),
            name: product.name,
            type: product.type,
            principal: amount,
            interestRate: product.interestRate,
            remainingBalance: amount,
            monthlyPayment: monthly,
            termMonths: term,
            paidMonths: 0,
            startDate: new Date(state.date),
            status: GameTypes.LoanStatus.ACTIVE
        };
        
        state.loans.push(loan);
        state.company.cash += amount;
        state.company.liabilities += amount;
        
        GameState.addTransaction(
            GameTypes.TransactionType.LOAN,
            amount,
            '获得贷款: ' + product.name,
            '融资'
        );
        
        UI.showToast('💰 贷款已到账: ' + Utils.formatMoney(amount));
        GameState.notify();
    },
    
    // 保存游戏
    saveGame: function() {
        MenuSystem.autoSave();
        UI.showToast('💾 游戏已保存！');
    },
    
    // 重置游戏
    resetGame: function() {
        if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
            MenuSystem.confirmNewGame();
        }
    }
};
