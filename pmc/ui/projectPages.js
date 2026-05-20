// 项目管理页面渲染函数
const ProjectPages = {
    // 渲染前期筹备标签页
    renderPreparationTab: function(project, state) {
        let html = '<div class="section-title" style="margin-top:16px">📋 前期筹备</div>';
        
        // 2.1 成立项目公司
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div>' +
                    '<div style="font-weight:600">2.1 成立项目公司</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">支出：注册费+验资费 = 50万，自动完成需1周</div>' +
                '</div>' +
                '<span class="status-badge ' + (project.projectCompanyEstablished ? 'status-completed' : 'status-pending') + '">' +
                    (project.projectCompanyEstablished ? '已完成' : '待办理') +
                '</span>' +
            '</div>';
        
        if (!project.projectCompanyEstablished) {
            html += '<div style="margin-top:12px">' +
                '<div style="color:#94a3b8;font-size:13px;margin-bottom:10px">注入资本金比例（影响后续贷款额度）</div>' +
                '<div style="display:flex;gap:10px;margin-bottom:12px">' +
                    '<button class="btn btn-secondary btn-sm" onclick="ProjectActions.establishProjectCompany(\'' + project.id + '\', 0.3)">30%</button>' +
                    '<button class="btn btn-secondary btn-sm" onclick="ProjectActions.establishProjectCompany(\'' + project.id + '\', 0.5)">50%</button>' +
                    '<button class="btn btn-secondary btn-sm" onclick="ProjectActions.establishProjectCompany(\'' + project.id + '\', 0.7)">70%</button>' +
                '</div>' +
                '<div style="color:#f97316;font-size:12px">当前公司现金: ' + Utils.formatMoney(state.company.cash) + '</div>' +
            '</div>';
        }
        html += '</div>';
        
        // 2.2 产品定位
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div>' +
                    '<div style="font-weight:600">2.2 产品定位</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">选择项目定位，影响建安成本和去化速度</div>' +
                '</div>' +
                '<span class="status-badge ' + (project.productPositioning ? 'status-completed' : 'status-pending') + '">' +
                    (project.productPositioning ? project.positioningConfig?.name || '已选择' : '待选择') +
                '</span>' +
            '</div>';
        
        if (!project.productPositioning) {
            const positions = [
                { id: 'affordable', name: '刚需盘', desc: '建安2500-3500元/㎡，去化快(月8-15%)，利润薄' },
                { id: 'improvement', name: '改善盘', desc: '建安3500-5000元/㎡，去化中(月5-10%)，利润中' },
                { id: 'luxury', name: '高端盘', desc: '建安5000-8000元/㎡，去化慢(月2-6%)，利润高但风险大' },
                { id: 'commercial', name: '商业', desc: '建安4000-6000元/㎡，去化很慢(月1-4%)，可自持收租' },
                { id: 'mixed', name: '综合体', desc: '建安5000-10000元/㎡，住宅部分快销回款，商业部分自持运营' }
            ];
            
            html += '<div style="margin-top:12px">' +
                positions.map(function(p) {
                    return '<button class="btn btn-secondary btn-full" style="text-align:left;margin-bottom:8px;padding:12px" onclick="ProjectActions.selectProductPositioning(\'' + project.id + '\', \'' + p.id + '\')">' +
                        '<div style="font-weight:600">' + p.name + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' + p.desc + '</div>' +
                    '</button>';
                }).join('') +
            '</div>';
        }
        html += '</div>';
        
        // 2.3 方案设计
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div>' +
                    '<div style="font-weight:600">2.3 方案设计</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">设计费用 = 建面 × 单价</div>' +
                '</div>' +
                '<span class="status-badge ' + (project.designScheme ? 'status-completed' : 'status-pending') + '">' +
                    (project.designScheme ? project.designConfig?.name || '已选择' : '待选择') +
                '</span>' +
            '</div>';
        
        if (!project.designScheme) {
            const schemes = [
                { id: 'standard', name: '标准化方案', cost: 80, brand: 0, conversion: 0, desc: '品质一般' },
                { id: 'custom', name: '定制化方案', cost: 150, brand: 5, conversion: 0, desc: '品质良好' },
                { id: 'master', name: '大师联名', cost: 300, brand: 15, conversion: 10, desc: '品质卓越，蓄客转化+10%' }
            ];
            
            html += '<div style="margin-top:12px">' +
                schemes.map(function(s) {
                    const cost = s.cost * project.constructionArea;
                    return '<button class="btn btn-secondary btn-full" style="text-align:left;margin-bottom:8px;padding:12px" onclick="ProjectActions.selectDesignScheme(\'' + project.id + '\', \'' + s.id + '\')">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                            '<span style="font-weight:600">' + s.name + '</span>' +
                            '<span style="color:#f97316">' + Utils.formatMoney(cost) + '</span>' +
                        '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' + s.desc + '，品牌值+' + s.brand + '</div>' +
                    '</button>';
                }).join('') +
            '</div>';
        }
        html += '</div>';
        
        return html;
    },
    
    // 渲染报批报建标签页
    renderApprovalTab: function(project, state) {
        let html = '<div class="section-title" style="margin-top:16px">📋 报批报建</div>';
        
        const stages = [
            { id: 'land_planning', name: '建设用地规划许可证', desc: '1-2月' },
            { id: 'design_review', name: '方案审查', desc: '1-3月' },
            { id: 'construction_planning', name: '建设工程规划许可证', desc: '1-2月' },
            { id: 'construction_permit', name: '施工许可证', desc: '1-2月' }
        ];
        
        stages.forEach(function(stage) {
            const progress = project.approvalProgress?.[stage.id];
            const isCompleted = progress?.status === 'completed';
            const isProcessing = progress?.status === 'processing';
            
            html += '<div class="card">' +
                '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                    '<div>' +
                        '<div style="font-weight:600">' + stage.name + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' + stage.desc + '</div>' +
                    '</div>' +
                    '<span class="status-badge ' + 
                        (isCompleted ? 'status-completed' : isProcessing ? 'status-processing' : 'status-pending') + '">' +
                        (isCompleted ? '已完成' : isProcessing ? '办理中' : '待办理') +
                    '</span>' +
                '</div>';
            
            if (!isCompleted && !isProcessing) {
                if (stage.id === 'land_planning' || stage.id === 'construction_planning') {
                    // 策略A/B
                    html += '<div style="margin-top:12px">' +
                        '<button class="btn btn-primary btn-full" style="margin-bottom:8px" onclick="ProjectActions.selectApprovalStrategy(\'' + project.id + '\', \'' + stage.id + '\', \'normal\')">' +
                            'A. 正常流程 — 耗时1.5月，花费0，成功率95%' +
                        '</button>' +
                        '<button class="btn btn-secondary btn-full" onclick="ProjectActions.selectApprovalStrategy(\'' + project.id + '\', \'' + stage.id + '\', \'expedite\')">' +
                            'B. 加急通道 — 耗时0.5月，花费200万打点，成功率90%(5%被查出罚款500万)' +
                        '</button>' +
                    '</div>';
                } else if (stage.id === 'design_review') {
                    // 策略A/B/C
                    html += '<div style="margin-top:12px">' +
                        '<button class="btn btn-primary btn-full" style="margin-bottom:8px" onclick="ProjectActions.selectApprovalStrategy(\'' + project.id + '\', \'' + stage.id + '\', \'normal\')">' +
                            'A. 一次通过 — 严格按规范设计，耗时1月，可建面积可能减少5-10%' +
                        '</button>' +
                        '<button class="btn btn-secondary btn-full" style="margin-bottom:8px" onclick="ProjectActions.selectApprovalStrategy(\'' + project.id + '\', \'' + stage.id + '\', \'max_far\')">' +
                            'B. 极限容积率 — 尽量做满指标，[40%]需改1次(+1月)，[10%]需改2次(+2月)' +
                        '</button>' +
                        '<button class="btn btn-warning btn-full" onclick="ProjectActions.selectApprovalStrategy(\'' + project.id + '\', \'' + stage.id + '\', \'exceed\')">' +
                            'C. 超限报批 — 突破控规限制，耗时3月，[30%]通过，[70%]被打回' +
                        '</button>' +
                    '</div>';
                } else if (stage.id === 'construction_permit') {
                    // 策略A/B/C
                    html += '<div style="margin-top:12px">' +
                        '<button class="btn btn-primary btn-full" style="margin-bottom:8px" onclick="ProjectActions.selectApprovalStrategy(\'' + project.id + '\', \'' + stage.id + '\', \'sequential\')">' +
                            'A. 逐项送审 — 耗时2月，费用建面×20元，通过率100%' +
                        '</button>' +
                        '<button class="btn btn-secondary btn-full" style="margin-bottom:8px" onclick="ProjectActions.selectApprovalStrategy(\'' + project.id + '\', \'' + stage.id + '\', \'parallel\')">' +
                            'B. 并行送审 — 耗时1月，费用建面×40元，[10%]某项被打回(+0.5月)' +
                        '</button>' +
                        '<button class="btn btn-success btn-full" onclick="ProjectActions.selectApprovalStrategy(\'' + project.id + '\', \'' + stage.id + '\', \'green\')">' +
                            'C. 绿色通道 — 需信用评级AA+以上，耗时0.5月，费用建面×30元' +
                        '</button>' +
                    '</div>';
                }
            } else if (isProcessing) {
                html += '<div style="margin-top:12px;color:#f97316">' +
                    '正在办理中，预计剩余 ' + progress?.timeRemaining + ' 个月' +
                '</div>';
            }
            
            html += '</div>';
        });
        
        // 报建随机事件提示
        html += '<div class="card" style="background:rgba(245,158,11,0.1)">' +
            '<div style="font-weight:600;color:#f97316;margin-bottom:8px">⚠️ 报建随机事件</div>' +
            '<div style="color:#94a3b8;font-size:12px;line-height:1.6">' +
                '• [10%] 规划调整，容积率下调0.3<br>' +
                '• [8%] 环评未过，需补充环评报告(+2月+300万)<br>' +
                '• [5%] 文物勘探发现遗址，地块部分不可开发<br>' +
                '• [15%] 周边居民投诉，需做社会稳定评估(+1月)<br>' +
                '• [5%] 政策变化，限高下调/配建要求增加' +
            '</div>' +
        '</div>';
        
        return html;
    },
    
    // 渲染工程管理标签页
    renderConstructionTab: function(project, state) {
        let html = '<div class="section-title" style="margin-top:16px">🏗️ 工程管理</div>';
        
        // 3.1 总包选择
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div>' +
                    '<div style="font-weight:600">3.1 总包选择</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">选择总承包商，影响质量、速度和成本</div>' +
                '</div>' +
                '<span class="status-badge ' + (project.contractorType ? 'status-completed' : 'status-pending') + '">' +
                    (project.contractorType ? project.contractorConfig?.name || '已选择' : '待选择') +
                '</span>' +
            '</div>';
        
        if (!project.contractorType) {
            const contractors = [
                { id: 'central_enterprise', name: '央企总包', quality: '+20%', speed: '×0.9', cost: '+25%', accident: '2%' },
                { id: 'local_leader', name: '地方龙头', quality: '+5%', speed: '×1.0', cost: '+10%', accident: '8%' },
                { id: 'general', name: '普通承包商', quality: '-5%', speed: '×1.1', cost: '-5%', accident: '15%' },
                { id: 'low_cost', name: '低价承包商', quality: '-15%', speed: '×1.2', cost: '-20%', accident: '25%' }
            ];
            
            html += '<div style="margin-top:12px">' +
                contractors.map(function(c) {
                    return '<button class="btn btn-secondary btn-full" style="text-align:left;margin-bottom:8px;padding:12px" onclick="ProjectActions.selectContractor(\'' + project.id + '\', \'' + c.id + '\')">' +
                        '<div style="font-weight:600">' + c.name + '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' +
                            '质量' + c.quality + ' | 速度' + c.speed + ' | 成本' + c.cost + ' | 事故率' + c.accident +
                        '</div>' +
                    '</button>';
                }).join('') +
            '</div>';
        }
        html += '</div>';
        
        // 3.2 施工进度
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">3.2 施工进度</div>' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                '<span style="color:#94a3b8">当前进度</span>' +
                '<span style="font-weight:700;color:#22c55e">' + (project.constructionProgress || 0) + '%</span>' +
            '</div>' +
            '<div class="progress-bar">' +
                '<div class="progress-fill" style="width:' + (project.constructionProgress || 0) + '%"></div>' +
            '</div>';
        
        // 施工阶段
        const phases = [
            { id: 'foundation', name: '基础工程', range: '0%-20%', months: '1-3月' },
            { id: 'structure', name: '主体结构', range: '20%-60%', months: '3-8月' },
            { id: 'secondary_structure', name: '二次结构+外立面', range: '60%-85%', months: '2-5月' },
            { id: 'mechanical_electrical', name: '机电+精装', range: '85%-95%', months: '2-4月' },
            { id: 'landscape', name: '园林+收尾', range: '95%-100%', months: '1-2月' }
        ];
        
        html += '<div style="margin-top:16px">' +
            phases.map(function(p) {
                const progress = project.constructionProgress || 0;
                const [min, max] = p.range.replace('%', '').split('-').map(Number);
                const isActive = progress >= min && progress < max;
                const isCompleted = progress >= max;
                
                return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
                    '<div style="width:8px;height:8px;border-radius:50%;background:' + 
                        (isCompleted ? '#22c55e' : isActive ? '#f97316' : '#94a3b8') + '"></div>' +
                    '<div style="flex:1">' +
                        '<div style="font-size:13px">' + p.name + '</div>' +
                        '<div style="color:#94a3b8;font-size:11px">' + p.range + ' · ' + p.months + '</div>' +
                    '</div>' +
                '</div>';
            }).join('') +
        '</div>' +
        '</div>';
        
        // 3.3 工程管理决策
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">3.3 工程管理决策</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
                '<button class="btn btn-secondary" onclick="ProjectActions.executeEngineeringAction(\'' + project.id + '\', \'inspection\')">' +
                    '🔍 现场巡查' +
                '</button>' +
                '<button class="btn btn-secondary" onclick="ProjectActions.executeEngineeringAction(\'' + project.id + '\', \'rush\')">' +
                    '⚡ 赶工令' +
                '</button>' +
                '<button class="btn btn-secondary" onclick="ProjectActions.executeEngineeringAction(\'' + project.id + '\', \'supervision\')">' +
                    '🛡️ 增加监理' +
                '</button>' +
                '<button class="btn btn-primary" onclick="ProjectActions.executeEngineeringAction(\'' + project.id + '\', \'normal\')">' +
                    '▶️ 正常推进' +
                '</button>' +
            '</div>' +
        '</div>';
        
        return html;
    },
    
    // 渲染预售开盘标签页
    renderPresaleTab: function(project, state) {
        let html = '<div class="section-title" style="margin-top:16px">💰 预售开盘</div>';
        
        // 4.1 预售许可申请
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div>' +
                    '<div style="font-weight:600">4.1 预售许可申请</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">条件：多层封顶/高层完成1/3-1/2</div>' +
                '</div>' +
                '<span class="status-badge ' + 
                    (project.presaleApplied ? (project.presaleApproved ? 'status-completed' : 'status-processing') : 'status-pending') + '">' +
                    (project.presaleApproved ? '已获批' : project.presaleApplied ? '审批中' : '待申请') +
                '</span>' +
            '</div>';
        
        if (!project.presaleApplied) {
            html += '<button class="btn btn-primary btn-full" onclick="ProjectActions.applyPresalePermit(\'' + project.id + '\')">' +
                '申请预售许可' +
            '</button>';
        } else if (!project.presaleApproved) {
            html += '<div style="color:#f97316">审批中，预计 ' + (project.presaleApprovalTime || 1) + ' 个月完成</div>';
        }
        html += '</div>';
        
        // 4.2 定价策略
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">4.2 定价策略</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">区域市场均价</div>' +
                    '<div style="font-weight:600">' + Utils.formatMoney(project.marketPrice || 15000) + ' 元/㎡</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">楼面价</div>' +
                    '<div style="font-weight:600">' + Utils.formatMoney(project.landCost || 5000) + ' 元/㎡</div>' +
                '</div>' +
            '</div>';
        
        if (!project.pricingTier) {
            const tiers = [
                { id: 'low_volume', name: '低价跑量', multiplier: 0.84, absorption: '+40%', desc: '利润大幅降低' },
                { id: 'below_average', name: '低于均价', multiplier: 0.9, absorption: '+20%', desc: '利润降低' },
                { id: 'recommended', name: '建议定价', multiplier: 1.0, absorption: '正常', desc: '基准利润' },
                { id: 'above_average', name: '高于均价', multiplier: 1.1, absorption: '-25%', desc: '利润增加' },
                { id: 'premium', name: '溢价策略', multiplier: 1.19, absorption: '-45%', desc: '利润大幅增加但可能滞销' }
            ];
            
            html += '<div>' +
                tiers.map(function(t) {
                    const price = Math.round((project.marketPrice || 15000) * t.multiplier);
                    return '<button class="btn btn-secondary btn-full" style="text-align:left;margin-bottom:8px;padding:12px" onclick="ProjectActions.selectPricingTier(\'' + project.id + '\', \'' + t.id + '\')">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                            '<span style="font-weight:600">' + t.name + '</span>' +
                            '<span style="color:#22c55e">' + price + '元/㎡</span>' +
                        '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' +
                            '去化速度' + t.absorption + ' · ' + t.desc +
                        '</div>' +
                    '</button>';
                }).join('') +
            '</div>';
        } else {
            html += '<div style="color:#22c55e">已选择：' + project.pricingConfig?.name + '，售价 ' + project.sellingPrice + '元/㎡</div>';
        }
        html += '</div>';
        
        // 4.3 开盘方式
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">4.3 开盘方式</div>';
        
        if (!project.launchMethod) {
            const methods = [
                { id: 'offline', name: '线下集中开盘', conversion: '+10%', cost: 5000000, risk: '[15%]黄牛暗箱操作' },
                { id: 'online', name: '线上选房', conversion: '+5%', cost: 1000000, risk: '[10%]系统崩溃' },
                { id: 'normal', name: '常规平销', conversion: '+0%', cost: 0, risk: '无' }
            ];
            
            html += '<div>' +
                methods.map(function(m) {
                    return '<button class="btn btn-secondary btn-full" style="text-align:left;margin-bottom:8px;padding:12px" onclick="ProjectActions.selectLaunchMethod(\'' + project.id + '\', \'' + m.id + '\')">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                            '<span style="font-weight:600">' + m.name + '</span>' +
                            '<span style="color:' + (m.cost > 0 ? '#f97316' : '#22c55e') + '">' + 
                                (m.cost > 0 ? Utils.formatMoney(m.cost) : '免费') + '</span>' +
                        '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' +
                            '转化率' + m.conversion + ' · 风险: ' + m.risk +
                        '</div>' +
                    '</button>';
                }).join('') +
            '</div>';
        }
        html += '</div>';
        
        // 4.4 折扣体系
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">4.4 折扣体系</div>';
        
        if (!project.discount) {
            const discounts = [
                { id: '100', name: '100折', absorption: '+0%', desc: '利润最大化' },
                { id: '98', name: '98折', absorption: '+5%', desc: '小幅促进' },
                { id: '95', name: '95折', absorption: '+12%', desc: '明显促进' },
                { id: '92', name: '92折', absorption: '+20%', desc: '强力促进' },
                { id: '90', name: '90折', absorption: '+30%', desc: '利润明显压缩' }
            ];
            
            html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
                discounts.map(function(d) {
                    return '<button class="btn btn-secondary" onclick="ProjectActions.setDiscount(\'' + project.id + '\', \'' + d.id + '\')">' +
                        d.name +
                        '<div style="font-size:11px;color:#94a3b8;margin-top:4px">' + d.absorption + '</div>' +
                    '</button>';
                }).join('') +
            '</div>';
        }
        html += '</div>';
        
        return html;
    },
    
    // 渲染营销蓄客标签页
    renderMarketingTab: function(project, state) {
        let html = '<div class="section-title" style="margin-top:16px">📣 营销蓄客</div>';
        
        // 5.1 蓄客渠道选择
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">5.1 蓄客渠道选择（可多选）</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
                '<button class="btn btn-secondary" onclick="ProjectActions.selectCustomerChannels(\'' + project.id + '\', [\'natural\'])">' +
                    '🌿 自然来访' +
                    '<div style="font-size:11px;color:#94a3b8;margin-top:4px">免费 · C级客户</div>' +
                '</button>' +
                '<button class="btn btn-secondary" onclick="ProjectActions.selectCustomerChannels(\'' + project.id + '\', [\'online\'])">' +
                    '💻 线上投放' +
                    '<div style="font-size:11px;color:#94a3b8;margin-top:4px">50-200万/月 · B级客户</div>' +
                '</button>' +
                '<button class="btn btn-secondary" onclick="ProjectActions.selectCustomerChannels(\'' + project.id + '\', [\'channel\'])">' +
                    '🤝 渠道带客' +
                    '<div style="font-size:11px;color:#94a3b8;margin-top:4px">佣金1%-5% · B级客户</div>' +
                '</button>' +
                '<button class="btn btn-secondary" onclick="ProjectActions.selectCustomerChannels(\'' + project.id + '\', [\'referral\'])">' +
                    '👥 老带新' +
                    '<div style="font-size:11px;color:#94a3b8;margin-top:4px">奖励5000-20000元 · A级客户</div>' +
                '</button>' +
            '</div>';
        
        if (project.productPositioning === 'luxury') {
            html += '<button class="btn btn-success btn-full" style="margin-top:10px" onclick="ProjectActions.selectCustomerChannels(\'' + project.id + '\', [\'circle\'])">' +
                '🎩 圈层营销' +
                '<div style="font-size:11px;color:#94a3b8;margin-top:4px">100-500万/次 · A级客户（高端盘专用）</div>' +
            '</button>';
        }
        html += '</div>';
        
        // 5.2 蓄客转化
        const customerPool = project.customerPool || 500;
        const aLevel = Math.floor(customerPool * 0.2);
        const bLevel = Math.floor(customerPool * 0.5);
        const cLevel = customerPool - aLevel - bLevel;
        const expectedSubscriptions = Math.floor(aLevel * 0.3 + bLevel * 0.15 + cLevel * 0.05);
        
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">5.2 蓄客转化</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center">' +
                '<div>' +
                    '<div style="font-size:20px;font-weight:700;color:#ef4444">' + customerPool + '</div>' +
                    '<div style="color:#94a3b8;font-size:12px">蓄客池</div>' +
                '</div>' +
                '<div>' +
                    '<div style="font-size:20px;font-weight:700;color:#22c55e">' + expectedSubscriptions + '</div>' +
                    '<div style="color:#94a3b8;font-size:12px">预计认购</div>' +
                '</div>' +
                '<div>' +
                    '<div style="font-size:20px;font-weight:700;color:#3b82f6">' + Math.round(expectedSubscriptions / customerPool * 100) + '%</div>' +
                    '<div style="color:#94a3b8;font-size:12px">认购率</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                    '<span style="color:#94a3b8">A级客户 (' + aLevel + '人)</span>' +
                    '<span>转化率 30%</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:8px">' +
                    '<span style="color:#94a3b8">B级客户 (' + bLevel + '人)</span>' +
                    '<span>转化率 15%</span>' +
                '</div>' +
                '<div style="display:flex;justify-content:space-between">' +
                    '<span style="color:#94a3b8">C级客户 (' + cLevel + '人)</span>' +
                    '<span>转化率 5%</span>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        // 5.3 营销费用预算
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">5.3 营销费用预算</div>' +
            '<div style="color:#94a3b8;font-size:13px;margin-bottom:12px">' +
                '行业惯例：总货值的2%-5%' +
            '</div>' +
            '<div style="display:flex;gap:10px">' +
                '<button class="btn btn-secondary" onclick="GameActions.setMarketingBudget(\'' + project.id + '\', 0.02)">2%</button>' +
                '<button class="btn btn-primary" onclick="GameActions.setMarketingBudget(\'' + project.id + '\', 0.03)">3%</button>' +
                '<button class="btn btn-success" onclick="GameActions.setMarketingBudget(\'' + project.id + '\', 0.05)">5%</button>' +
            '</div>' +
        '</div>';
        
        return html;
    },
    
    // 渲染签约回款标签页
    renderContractingTab: function(project, state) {
        let html = '<div class="section-title" style="margin-top:16px">📝 签约回款</div>';
        
        // 6.1 签约流水线
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">6.1 签约流水线</div>' +
            '<div style="color:#94a3b8;font-size:12px;margin-bottom:16px">' +
                '认购(定金5万) → 网签(7天内付首付,1月) → 按揭申请(1月) → 放款到账(1-2月)' +
            '</div>';
        
        // 模拟批次数据
        const batches = [
            { id: 1, units: 15, stage: '网签', elapsed: 0.5, total: 1 },
            { id: 2, units: 20, stage: '按揭申请', elapsed: 1, total: 1 },
            { id: 3, units: 10, stage: '放款到账', elapsed: 0.5, total: 2 }
        ];
        
        html += batches.map(function(batch) {
            const downPayment = batch.units * 30; // 平均每套30万首付
            const mortgage = batch.units * 70; // 平均每套70万按揭
            
            return '<div style="border-left:3px solid #3b82f6;padding-left:12px;margin-bottom:12px">' +
                '<div style="font-weight:600">批次' + batch.id + '(' + batch.units + '套): ' + batch.stage + '</div>' +
                '<div style="color:#94a3b8;font-size:12px">' + batch.elapsed + '/' + batch.total + '月</div>' +
                '<div style="display:flex;gap:15px;margin-top:8px;font-size:12px">' +
                    '<span>首付: ' + downPayment + '万</span>' +
                    '<span>按揭: ' + mortgage + '万</span>' +
                    '<span>预计到账: ' + (batch.total - batch.elapsed) + '月后</span>' +
                '</div>' +
            '</div>';
        }).join('');
        html += '</div>';
        
        // 6.2 合作银行选择
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">6.2 合作银行选择</div>' +
            '<div style="color:#94a3b8;font-size:12px;margin-bottom:12px">' +
                '利率低→客户意愿高但银行放款慢 | 额度不足→部分客户放款失败' +
            '</div>';
        
        const banks = [
            { id: 'icbc', name: '工商银行', rate: 4.1, speed: 1.0, quota: 1.0, acceptance: '高' },
            { id: 'ccb', name: '建设银行', rate: 4.0, speed: 0.9, quota: 0.9, acceptance: '中' },
            { id: 'abc', name: '农业银行', rate: 4.2, speed: 1.1, quota: 0.95, acceptance: '中' },
            { id: 'boc', name: '中国银行', rate: 3.9, speed: 0.8, quota: 0.85, acceptance: '低' },
            { id: 'joint_stock', name: '股份制银行', rate: 3.8, speed: 0.7, quota: 0.75, acceptance: '低' }
        ];
        
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
            banks.map(function(b) {
                return '<button class="btn btn-secondary" onclick="ProjectActions.selectBank(\'' + project.id + '\', \'' + b.id + '\')">' +
                    '<div style="font-weight:600">' + b.name + '</div>' +
                    '<div style="font-size:11px;color:#94a3b8;margin-top:4px">' +
                        b.rate + '% | 速度×' + b.speed + ' | 额度' + (b.quota * 100) + '%' +
                    '</div>' +
                '</button>';
            }).join('') +
        '</div>' +
        '</div>';
        
        // 6.3 回款风险
        html += '<div class="card" style="background:rgba(239,68,68,0.1)">' +
            '<div style="font-weight:600;color:#ef4444;margin-bottom:12px">⚠️ 回款风险</div>' +
            '<div style="color:#94a3b8;font-size:12px;line-height:1.6">' +
                '• 逾期：购房人资质不足/银行额度紧张<br>' +
                '• 退房：客户违约退房，定金不退但房源重新释放<br>' +
                '• 烂尾风险：资金链断裂导致停工，舆论+50，政府介入' +
            '</div>' +
            '<div style="margin-top:12px">' +
                '<button class="btn btn-secondary btn-sm" onclick="ProjectActions.handleOverdue(\'' + project.id + '\', \'switch_bank\')">协助换银行</button>' +
                '<button class="btn btn-secondary btn-sm" style="margin-left:8px" onclick="ProjectActions.handleOverdue(\'' + project.id + '\', \'urge_bank\')">催促银行</button>' +
                '<button class="btn btn-warning btn-sm" style="margin-left:8px" onclick="ProjectActions.handleOverdue(\'' + project.id + '\', \'demand_full_payment\')">要求补齐尾款</button>' +
            '</div>' +
        '</div>';
        
        return html;
    },
    
    // 渲染竣工交付标签页
    renderDeliveryTab: function(project, state) {
        let html = '<div class="section-title" style="margin-top:16px">🏠 竣工交付</div>';
        
        // 7.1 竣工验收
        html += '<div class="card">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
                '<div>' +
                    '<div style="font-weight:600">7.1 竣工验收</div>' +
                    '<div style="color:#94a3b8;font-size:12px;margin-top:4px">施工100%完成后进入</div>' +
                '</div>' +
                '<span class="status-badge ' + (project.inspectionCompleted ? 'status-completed' : 'status-pending') + '">' +
                    (project.inspectionCompleted ? '已完成' : '待验收') +
                '</span>' +
            '</div>';
        
        if (!project.inspectionCompleted && !project.inspectionStrategy) {
            const strategies = [
                { id: 'thorough', name: '全面精验', time: 2, confidence: 100, desc: '每户必查' },
                { id: 'spot_check', name: '抽检验收', time: 1, confidence: 85, desc: '抽查30%户型，[15%]遗留问题' },
                { id: 'fast', name: '快速验收', time: 0.5, confidence: 65, desc: '走流程，[35%]遗留问题' }
            ];
            
            html += '<div style="margin-top:12px">' +
                strategies.map(function(s) {
                    return '<button class="btn btn-secondary btn-full" style="text-align:left;margin-bottom:8px;padding:12px" onclick="ProjectActions.selectInspectionStrategy(\'' + project.id + '\', \'' + s.id + '\')">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center">' +
                            '<span style="font-weight:600">' + s.name + '</span>' +
                            '<span style="color:#22c55e">' + s.time + '月 · 信心' + s.confidence + '%</span>' +
                        '</div>' +
                        '<div style="color:#94a3b8;font-size:12px;margin-top:4px">' + s.desc + '</div>' +
                    '</button>';
                }).join('') +
            '</div>';
        } else if (project.inspectionStrategy && !project.inspectionCompleted) {
            // 处理验收问题
            if (project.remainingIssues) {
                html += '<div style="margin-top:12px">' +
                    '<div style="color:#ef4444;font-weight:600;margin-bottom:12px">发现 ' + project.remainingIssues + ' 处质量问题待整改</div>' +
                    '<button class="btn btn-primary btn-full" style="margin-bottom:8px" onclick="ProjectActions.handleInspectionIssues(\'' + project.id + '\', \'full_fix\')">' +
                        'A. 全部整改 — +1月，费用全额，品牌值+5' +
                    '</button>' +
                    '<button class="btn btn-secondary btn-full" style="margin-bottom:8px" onclick="ProjectActions.handleInspectionIssues(\'' + project.id + '\', \'partial_fix\')">' +
                        'B. 整改70% — +0.5月，费用70%，品牌值-3' +
                    '</button>' +
                    '<button class="btn btn-warning btn-full" onclick="ProjectActions.handleInspectionIssues(\'' + project.id + '\', \'symbolic_fix\')">' +
                        'C. 象征性整改 — +0.2月，费用30%，品牌值-15' +
                    '</button>' +
                '</div>';
            } else {
                html += '<div style="color:#22c55e">验收进行中，预计 ' + (project.inspectionTime || 1) + ' 个月完成</div>';
            }
        }
        html += '</div>';
        
        // 7.2 交付流程
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">7.2 交付流程</div>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
                ['交付准备', '集中交付', '整改维修', '物业移交', '清盘结算'].map(function(step, idx) {
                    return '<div style="display:flex;align-items:center;gap:4px">' +
                        '<span style="color:#22c55e">✓</span>' +
                        '<span>' + step + '</span>' +
                        (idx < 4 ? '<span style="color:#94a3b8">→</span>' : '') +
                    '</div>';
                }).join('') +
            '</div>' +
            '<div style="margin-top:16px">' +
                '<div style="font-weight:600;margin-bottom:8px">业主满意度</div>' +
                '<div style="display:flex;gap:10px">' +
                    '<div style="flex:1;text-align:center;padding:12px;background:rgba(34,197,94,0.1);border-radius:8px">' +
                        '<div style="font-size:18px;font-weight:700;color:#22c55e">优秀</div>' +
                        '<div style="color:#94a3b8;font-size:11px">&gt;90% · +10品牌</div>' +
                    '</div>' +
                    '<div style="flex:1;text-align:center;padding:12px;background:rgba(245,158,11,0.1);border-radius:8px">' +
                        '<div style="font-size:18px;font-weight:700;color:#f59e0b">良好</div>' +
                        '<div style="color:#94a3b8;font-size:11px">70-90% · +3品牌</div>' +
                    '</div>' +
                    '<div style="flex:1;text-align:center;padding:12px;background:rgba(249,115,22,0.1);border-radius:8px">' +
                        '<div style="font-size:18px;font-weight:700;color:#f97316">一般</div>' +
                        '<div style="color:#94a3b8;font-size:11px">50-70% · -5品牌</div>' +
                    '</div>' +
                    '<div style="flex:1;text-align:center;padding:12px;background:rgba(239,68,68,0.1);border-radius:8px">' +
                        '<div style="font-size:18px;font-weight:700;color:#ef4444">差</div>' +
                        '<div style="color:#94a3b8;font-size:11px">&lt;50% · -20品牌</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        // 7.3 清盘结算
        const totalRevenue = project.totalRevenue || 500000000;
        const totalCost = project.totalCost || 420000000;
        const profit = totalRevenue - totalCost;
        const profitRate = ((profit / totalRevenue) * 100).toFixed(1);
        
        html += '<div class="card" style="background:rgba(34,197,94,0.1)">' +
            '<div style="font-weight:600;color:#22c55e;margin-bottom:12px">7.3 清盘结算</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:16px">' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">总货值</div>' +
                    '<div style="font-weight:700">' + Utils.formatMoney(totalRevenue) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">总成本</div>' +
                    '<div style="font-weight:700">' + Utils.formatMoney(totalCost) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">净利润</div>' +
                    '<div style="font-weight:700;color:#22c55e">' + Utils.formatMoney(profit) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">净利率</div>' +
                    '<div style="font-weight:700;color:#22c55e">' + profitRate + '%</div>' +
                '</div>' +
            '</div>' +
            '<button class="btn btn-primary btn-full" onclick="ProjectActions.settleProject(\'' + project.id + '\')">' +
                '确认清盘结算' +
            '</button>' +
        '</div>';
        
        return html;
    },
    
    // 渲染资金管理标签页
    renderProjectFinanceTab: function(project, state) {
        let html = '<div class="section-title" style="margin-top:16px">💰 项目资金管理</div>';
        
        // 项目现金流
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">项目现金流</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px">' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">已回款</div>' +
                    '<div style="font-weight:700;color:#22c55e">' + Utils.formatMoney(project.totalRevenue || 0) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">已支出</div>' +
                    '<div style="font-weight:700;color:#ef4444">' + Utils.formatMoney(project.totalCost || 0) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">待回款</div>' +
                    '<div style="font-weight:700;color:#3b82f6">' + Utils.formatMoney(project.pendingRevenue || 0) + '</div>' +
                '</div>' +
                '<div>' +
                    '<div style="color:#94a3b8;font-size:12px">待支出</div>' +
                    '<div style="font-weight:700;color:#f97316">' + Utils.formatMoney(project.pendingCost || 0) + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        // 项目贷款
        html += '<div class="card">' +
            '<div style="font-weight:600;margin-bottom:12px">项目贷款</div>' +
            '<div style="color:#94a3b8;font-size:12px;text-align:center;padding:20px">' +
                '📋 点击左侧「资金」菜单申请项目贷款' +
            '</div>' +
        '</div>';
        
        return html;
    }
};
