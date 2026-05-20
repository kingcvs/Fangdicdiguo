// 游戏初始数据
const InitialData = {
    // 获取城市数据
    getCities: function() {
        return [
            { id: 'beijing', name: '北京市', avgPrice: 50000 },
            { id: 'shanghai', name: '上海市', avgPrice: 55000 },
            { id: 'guangzhou', name: '广州市', avgPrice: 35000 },
            { id: 'shenzhen', name: '深圳市', avgPrice: 58000 },
            { id: 'hangzhou', name: '杭州市', avgPrice: 40000 },
            { id: 'chengdu', name: '成都市', avgPrice: 25000 }
        ];
    },
    
    // 创建初始游戏状态
    createInitialState: function() {
        const cities = this.getCities();
        return this.createInitialStateWithParams({
            companyName: '未来地产集团',
            companyType: 'limited',
            city: cities[0],
            equityType: 'sole',
            shareholders: [{ name: '创始人', percentage: 100 }],
            capital: 50000000,
            initialFunds: 50000000
        });
    },
    
    // 获取资质等级名称
    getQualificationLevelName: function(level) {
        const names = { 1: '一级', 2: '二级', 3: '三级', 4: '四级' };
        return names[level] || '四级';
    },
    
    // 获取经济周期
    getEconomicCycles: function() {
        return ['复苏', '繁荣', '过热', '衰退', '萧条'];
    },
    
    // 生成随机宏观经济数据
    generateMacroData: function() {
        return {
            gdpGrowth: 3 + Math.random() * 4,
            cpi: 0.5 + Math.random() * 3,
            m2Growth: 6 + Math.random() * 6,
            lpr5y: 3.5 + Math.random() * 2,
            mortgageRate: 4 + Math.random() * 2,
            exchangeRate: 6.8 + Math.random() * 0.8,
            householdLeverage: 50 + Math.random() * 30,
            pmi: 45 + Math.random() * 15,
            consumerConfidence: 80 + Math.random() * 40
        };
    },
    
    // 生成随机市场环境数据
    generateMarketEnv: function() {
        const cycles = this.getEconomicCycles();
        return {
            economicCycle: cycles[Math.floor(Math.random() * cycles.length)],
            housingPriceIndex: 0.9 + Math.random() * 0.3,
            marketDemand: 60 + Math.random() * 40
        };
    },
    
    // 生成随机事件
    generateEvents: function(state) {
        const eventTemplates = [
            { type: 'good', title: '利好消息', templates: [
                '政策利好！政府出台房地产扶持政策',
                '城市规划升级，{city}房价看涨',
                '市场需求旺盛，房产销售火爆',
                '银行降息，融资成本降低',
                '央行降准释放流动性，市场资金面宽松',
                '住房公积金贷款政策调整，购房成本下降'
            ]},
            { type: 'bad', title: '利空消息', templates: [
                '调控收紧，{city}限购政策升级',
                '市场遇冷，购房者观望情绪浓厚',
                '建材价格上涨，开发成本增加',
                '银行加息，融资压力增大',
                '土地拍卖溢价率过高，拿地成本激增',
                '房贷利率上调，购房需求受抑制'
            ]},
            { type: 'competitor', title: '竞争对手动态', templates: [
                '{comp}高价拿地，彰显资金实力',
                '{comp}新项目盛大开盘，首日去化超80%',
                '{comp}陷入资金链紧张传闻',
                '{comp}宣布多元化转型，布局新业务',
                '{comp}与知名企业签署战略合作协议',
                '{comp}获得大额银行授信'
            ]},
            { type: 'player', title: '公司动态', templates: [
                '公司{action}，品牌影响力提升',
                '团队士气高涨，效率显著提升',
                '公司荣获「年度最佳雇主」称号',
                '公司入选行业百强榜单',
                '公司新项目案名正式发布'
            ]},
            { type: 'project', title: '项目动态', templates: [
                '{proj}项目进展顺利，提前{days}天完成节点',
                '{proj}获得市场高度认可',
                '{proj}荣获「最佳人居环境奖」',
                '{proj}样板间开放，客户来访超千人'
            ]}
        ];
        
        const competitors = this.getVirtualCompanyNames();
        const actions = ['成功举办品牌发布会', '获得行业荣誉', '与知名企业达成合作', '完成新一轮融资', '引进高端人才'];
        
        let events = [];
        const numEvents = 3 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < numEvents; i++) {
            const category = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
            const template = category.templates[Math.floor(Math.random() * category.templates.length)];
            let message = template;
            
            message = message.replace('{city}', state.company.city?.name || '本市');
            message = message.replace('{comp}', competitors[Math.floor(Math.random() * competitors.length)]);
            message = message.replace('{action}', actions[Math.floor(Math.random() * actions.length)]);
            message = message.replace('{proj}', state.projects.length > 0 ? 
                state.projects[Math.floor(Math.random() * state.projects.length)].name : '某');
            message = message.replace('{days}', (5 + Math.floor(Math.random() * 20)).toString());
            
            events.push({
                id: Utils.generateId('evt'),
                type: category.type,
                title: category.title,
                message: message,
                date: new Date(state.date)
            });
        }
        
        return events;
    },
    
    // 获取虚拟公司名称
    getVirtualCompanyNames: function() {
        return [
            '星辰地产', '恒信集团', '天和置业', '城峰建设', '恒基发展',
            '华丰置地', '云鼎集团', '悦居地产', '融信中国', '泰和幸福',
            '锦地集团', '城科股份', '盛城控股', '恒茂集团', '悦辉集团',
            '新华建设', '阳光里', '荣达发展', '蓝海发展', '恒基泰'
        ];
    },
    
    // 根据参数创建初始游戏状态
    createInitialStateWithParams: function(params) {
        // 初始化银行关系
        const banks = this.getBanks();
        const bankRelations = {};
        banks.forEach(function(bank) {
            bankRelations[bank.id] = {
                relation: bank.initialRelation,
                totalLoans: 0,
                overdueCount: 0,
                defaultCount: 0,
                lastRepayment: null
            };
        });
        
        return {
            date: new Date(2008, 0, 1),
            isPaused: true,
            speed: 1,
            company: {
                cash: params.initialFunds,
                totalAssets: params.initialFunds,
                liabilities: 0,
                monthlyProfit: 0,
                brandValue: 50,
                name: params.companyName,
                type: params.companyType,
                city: params.city,
                capital: params.capital,
                qualificationLevel: 4,
                qualificationProgress: 0,
                creditLevel: 'C',
                creditLeverage: 0.05,  // 信用杠杆，B级=0.05
                developableArea: 100000,
                totalCompletedArea: 0,
                positiveReviews: 0,
                negativeReviews: 0,
                totalDonations: 0
            },
            projects: [],
            employees: this.createInitialEmployees(),
            land: this.createInitialLand(),
            transactions: [],
            loans: [],
            loanRecords: [],
            shareholders: this.createShareholdersFromParams(params),
            directors: this.createInitialDirectors(),
            achievements: this.createInitialAchievements(),
            player: {
                name: '创业者',
                personalWealth: 1000000,
                personalTax: 0,
                reputation: 50,
                skills: {
                    negotiation: 50,
                    leadership: 50,
                    finance: 50,
                    marketing: 50,
                    engineering: 50
                },
                achievements: []
            },
            market: {
                interestRate: 0.05,
                inflationRate: 0.02,
                landPriceIndex: 1.0,
                housingPriceIndex: 1.0,
                marketSentiment: 0.5
            },
            marketEnv: this.generateMarketEnv(),
            macroData: this.generateMacroData(),
            events: this.generateEvents({ 
                company: { city: params.city }, 
                projects: [] 
            }),
            // 银行关系
            bankRelations: bankRelations,
            // 三条红线状态
            redLineStatus: {
                assetLiabilityRatio: 0,  // 剔除预收款资产负债率
                netDebtRatio: 50,         // 净负债率
                cashShortTermDebtRatio: 2.0,  // 现金短债比
                tier: GameTypes.RedLineTier.GREEN,  // 当前档位
                lastCheckDate: new Date(2008, 0, 1)
            },
            // 存款
            deposits: [],
            // 股权融资历史
            fundingHistory: [],
            // 上市公司状态
            listedStatus: {
                isListed: false,
                listingProgress: 0,
                preparationStartDate: null,
                sponsors: null,
                auditors: null,
                lawyers: null
            },
            // 表外负债
            offBalanceSheetDebt: []
        };
    },
    
    // 根据参数创建股东
    createShareholdersFromParams: function(params) {
        let shareholders = [];
        let shareId = 1;
        
        params.shareholders.forEach(function(share, index) {
            shareholders.push({
                id: 'sh_' + (shareId++),
                name: share.name,
                shares: 1000000 * share.percentage / 100,
                sharePercentage: share.percentage,
                type: index === 0 ? GameTypes.ShareholderType.FOUNDER : 
                      share.name.includes('投资人') ? GameTypes.ShareholderType.INVESTOR : 
                      GameTypes.ShareholderType.COFOUNDER,
                investmentDate: new Date(2024, 0, 1)
            });
        });
        
        return shareholders;
    },
    
    // 创建初始员工
    createInitialEmployees: function() {
        return [
            {
                id: 'emp_001',
                name: '张建国',
                type: GameTypes.EmployeeType.MANAGER,
                salary: 40000,
                speed: 5,
                quality: 7,
                cost: -2,
                status: GameTypes.EmployeeStatus.AVAILABLE,
                description: '经验丰富，注重质量和成本控制，项目推进稳妥',
                personality: '稳健型',
                stars: 3,
                effect: { quality: 5, cost: -2 }
            },
            {
                id: 'emp_002',
                name: '李工程师',
                type: GameTypes.EmployeeType.ENGINEER,
                salary: 20000,
                speed: 8,
                quality: 8,
                cost: 0,
                status: GameTypes.EmployeeStatus.AVAILABLE,
                description: '技术过硬的工程师，工程进度快',
                personality: '技术型',
                stars: 3,
                effect: { quality: 8, speed: 8 }
            },
            {
                id: 'emp_003',
                name: '张销售',
                type: GameTypes.EmployeeType.SALES,
                salary: 18000,
                speed: 6,
                quality: 9,
                cost: 3,
                status: GameTypes.EmployeeStatus.AVAILABLE,
                description: '销售天才，能卖出好价钱',
                personality: '进取型',
                stars: 3,
                effect: { sales: 9 }
            },
            {
                id: 'emp_004',
                name: '赵会计',
                type: GameTypes.EmployeeType.FINANCE,
                salary: 15000,
                speed: 7,
                quality: 7,
                cost: -4,
                status: GameTypes.EmployeeStatus.AVAILABLE,
                description: '理财专家，善于节约成本',
                personality: '谨慎型',
                stars: 3,
                effect: { cost: -4 }
            }
        ];
    },

    // 创建示例项目
    createDemoProject: function() {
        return {
            id: 'proj_demo',
            name: '城西科技园高端项目',
            level: '高端',
            status: '报批',
            city: '徐州',
            area: 60000,
            type: '住宅',
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
            projectManager: null,
            autoMode: false,
            tabs: {
                certificates: { active: true },
                design: { active: false },
                construction: { active: false },
                cost: { active: false },
                procurement: { active: false },
                planning: { active: false },
                finance: { active: false }
            },
            certificates: [
                { name: '国有土地使用证', status: 'pending', unlocked: true },
                { name: '建设用地规划许可证', status: 'locked', unlocked: false },
                { name: '建设工程规划许可证', status: 'locked', unlocked: false },
                { name: '建筑工程施工许可证', status: 'locked', unlocked: false }
            ],
            design: {
                phase: '未开始',
                positioning: '高端',
                facade: '法式',
                costCoefficient: 1.25,
                priceCoefficient: 1.20,
                demandCoefficient: 0.85,
                plotRatio: 2.5,
                plotRatioLimit: 2.5
            }
        };
    },
    
    // 获取土地类型
    getLandTypes: function() {
        return ['招挂拍', '勾地', '法拍', '二手'];
    },
    
    // 获取开发类型
    getDevelopmentTypes: function() {
        return {
            '刚需': { constructionCost: 3000, duration: 24, profitRate: 0.2 },
            '改善': { constructionCost: 5000, duration: 30, profitRate: 0.3 },
            '高端': { constructionCost: 8000, duration: 36, profitRate: 0.4 },
            '商业': { constructionCost: 10000, duration: 42, profitRate: 0.35 }
        };
    },
    
    // 获取项目名称前缀
    getProjectNamePrefixes: function() {
        return ['融创', '碧桂园', '保利', '中海', '华润', '龙湖', '金地', '旭辉', '金茂', '绿城'];
    },
    
    // 获取项目名称后缀
    getProjectNameSuffixes: function() {
        return ['花园', '华府', '公馆', '华庭', '湾', '园', '府', '台', '苑', '阁'];
    },
    
    // 生成随机土地
    generateRandomLand: function(city, index, isFixedPrice) {
        const landTypes = this.getLandTypes();
        const devTypes = Object.keys(this.getDevelopmentTypes());
        const prefixes = this.getProjectNamePrefixes();
        const suffixes = this.getProjectNameSuffixes();
        
        const cityAvgPrice = city.avgPrice;
        const landType = landTypes[Math.floor(Math.random() * landTypes.length)];
        const devType = devTypes[Math.floor(Math.random() * devTypes.length)];
        
        let totalLandPrice;
        let siteArea;
        let landPricePerSqm;
        let plotRatio;
        let buildArea;
        
        if (isFixedPrice) {
            // 5000万起拍价的土地
            totalLandPrice = 50000000;
            siteArea = Math.floor(30000 + Math.random() * 50000);
            plotRatio = 2.0 + Math.random() * 2.0;
            buildArea = Math.floor(siteArea * plotRatio);
            landPricePerSqm = Math.floor(totalLandPrice / buildArea);
        } else {
            // 其他随机价格的土地
            siteArea = Math.floor(20000 + Math.random() * 100000);
            plotRatio = 1.5 + Math.random() * 3.5;
            buildArea = Math.floor(siteArea * plotRatio);
            landPricePerSqm = Math.floor(cityAvgPrice * 0.4 + Math.random() * cityAvgPrice * 0.3);
            totalLandPrice = landPricePerSqm * buildArea;
        }
        
        const maxHeight = Math.floor(50 + Math.random() * 150);
        
        const devData = this.getDevelopmentTypes()[devType];
        const totalConstructionCost = buildArea * devData.constructionCost;
        const totalCost = totalLandPrice + totalConstructionCost;
        const estimatedRevenue = buildArea * cityAvgPrice;
        const estimatedProfit = Math.floor(estimatedRevenue * devData.profitRate);
        
        const landToHouseRatio = landPricePerSqm / cityAvgPrice;
        
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const projectName = prefix + suffix;
        
        return {
            id: Utils.generateId('land'),
            name: projectName,
            location: city.name,
            landType: landType,
            devType: devType,
            siteArea: siteArea,
            plotRatio: plotRatio,
            buildArea: buildArea,
            landPricePerSqm: landPricePerSqm,
            maxHeight: maxHeight,
            totalLandPrice: totalLandPrice,
            landToHouseRatio: landToHouseRatio,
            estimatedProfit: estimatedProfit,
            zoning: devType === '商业' ? GameTypes.LandZoning.COMMERCIAL : GameTypes.LandZoning.RESIDENTIAL,
            status: GameTypes.LandStatus.AVAILABLE,
            price: totalLandPrice,
            size: siteArea,
            constructionCost: devData.constructionCost,
            constructionDuration: devData.duration,
            profitRate: devData.profitRate,
            description: devType + '项目，位于' + city.name + '黄金地段，发展潜力大'
        };
    },
    
    // 批量生成随机土地
    generateRandomLands: function(city, count) {
        let lands = [];
        // 计算5000万起拍价土地的数量（至少1个，最多占20%）
        const fixedPriceCount = Math.max(1, Math.floor(count * 0.2));
        const randomPriceCount = count - fixedPriceCount;
        
        // 先生成5000万起拍价的土地
        for (let i = 0; i < fixedPriceCount; i++) {
            lands.push(this.generateRandomLand(city, i, true));
        }
        
        // 再生成其他随机价格的土地
        for (let i = 0; i < randomPriceCount; i++) {
            lands.push(this.generateRandomLand(city, fixedPriceCount + i, false));
        }
        
        // 打乱土地顺序
        for (let i = lands.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [lands[i], lands[j]] = [lands[j], lands[i]];
        }
        
        return lands;
    },
    
    // 创建初始土地
    createInitialLand: function() {
        const cities = this.getCities();
        const city = cities[0];
        let lands = [];
        
        // 添加一些随机土地
        const randomLands = this.generateRandomLands(city, 8);
        lands = lands.concat(randomLands);
        
        return lands;
    },
    
    // 创建初始股东
    createInitialShareholders: function() {
        return [
            {
                id: 'sh_001',
                name: '创始人团队',
                shares: 1000000,
                sharePercentage: 100,
                type: GameTypes.ShareholderType.FOUNDER,
                investmentDate: new Date(2024, 0, 1)
            }
        ];
    },
    
    // 创建初始董事会
    createInitialDirectors: function() {
        return [
            {
                id: 'dir_001',
                name: '董事长',
                role: GameTypes.DirectorRole.CHAIRMAN,
                expertise: '战略规划',
                salary: 0,
                status: 'active',
                appointmentDate: new Date(2024, 0, 1)
            }
        ];
    },
    
    // 创建初始成就
    createInitialAchievements: function() {
        return [
            {
                id: 'ach_first_land',
                name: '第一桶金',
                description: '购买第一块土地',
                unlocked: false,
                category: GameTypes.AchievementCategory.PROJECT
            },
            {
                id: 'ach_first_project',
                name: '开工大吉',
                description: '启动第一个项目',
                unlocked: false,
                category: GameTypes.AchievementCategory.PROJECT
            },
            {
                id: 'ach_first_complete',
                name: '竣工典礼',
                description: '完成第一个项目',
                unlocked: false,
                category: GameTypes.AchievementCategory.PROJECT
            },
            {
                id: 'ach_millionaire',
                name: '百万富翁',
                description: '公司资产达到1亿',
                unlocked: false,
                category: GameTypes.AchievementCategory.FINANCE
            },
            {
                id: 'ach_billionaire',
                name: '亿万富翁',
                description: '公司资产达到10亿',
                unlocked: false,
                category: GameTypes.AchievementCategory.FINANCE
            },
            {
                id: 'ach_brand_100',
                name: '知名品牌',
                description: '品牌价值达到100',
                unlocked: false,
                category: GameTypes.AchievementCategory.BRAND
            },
            {
                id: 'ach_5_projects',
                name: '多线作战',
                description: '同时进行5个项目',
                unlocked: false,
                category: GameTypes.AchievementCategory.PROJECT
            },
            {
                id: 'ach_employee_10',
                name: '团队扩张',
                description: '拥有10名员工',
                unlocked: false,
                category: GameTypes.AchievementCategory.PERSONAL
            }
        ];
    },
    
    // 可雇佣的新员工库
    getAvailableEmployees: function() {
        return [
            {
                id: 'emp_new_001',
                name: '陈总监',
                type: GameTypes.EmployeeType.MANAGER,
                salary: 35000,
                speed: 7,
                quality: 9,
                cost: -3,
                status: GameTypes.EmployeeStatus.AVAILABLE,
                description: '资深总监，综合能力强'
            },
            {
                id: 'emp_new_002',
                name: '刘设计师',
                type: GameTypes.EmployeeType.ENGINEER,
                salary: 28000,
                speed: 6,
                quality: 10,
                cost: 2,
                status: GameTypes.EmployeeStatus.AVAILABLE,
                description: '追求完美的设计师，品质至上'
            },
            {
                id: 'emp_new_003',
                name: '孙营销',
                type: GameTypes.EmployeeType.SALES,
                salary: 22000,
                speed: 9,
                quality: 8,
                cost: 1,
                status: GameTypes.EmployeeStatus.AVAILABLE,
                description: '高效销售，快速回款'
            },
            {
                id: 'emp_new_004',
                name: '周财务',
                type: GameTypes.EmployeeType.FINANCE,
                salary: 20000,
                speed: 8,
                quality: 8,
                cost: -5,
                status: GameTypes.EmployeeStatus.AVAILABLE,
                description: '成本杀手，极度节约'
            }
        ];
    },
    
    // 银行贷款产品
    getLoanProducts: function() {
        return [
            {
                id: 'loan_bank_1',
                name: '企业经营贷',
                type: GameTypes.LoanType.BANK,
                maxAmount: 100000000,
                interestRate: 0.06,
                minTerm: 12,
                maxTerm: 60
            },
            {
                id: 'loan_bank_2',
                name: '项目开发贷',
                type: GameTypes.LoanType.BANK,
                maxAmount: 300000000,
                interestRate: 0.055,
                minTerm: 24,
                maxTerm: 120
            },
            {
                id: 'loan_bond_1',
                name: '企业债券',
                type: GameTypes.LoanType.BOND,
                maxAmount: 500000000,
                interestRate: 0.07,
                minTerm: 36,
                maxTerm: 120
            }
        ];
    },
    
    // 获取银行数据
    getBanks: function() {
        return [
            {
                id: GameTypes.BankType.ICBC,
                name: '工商银行',
                baseRate: 0.041,
                feature: '额度大',
                initialRelation: 50,
                description: '国有大行，贷款额度充足，适合大额融资'
            },
            {
                id: GameTypes.BankType.CCB,
                name: '建设银行',
                baseRate: 0.040,
                feature: '利率低但慢',
                initialRelation: 50,
                description: '审批较慢但利率较低，适合稳健型融资'
            },
            {
                id: GameTypes.BankType.ABC,
                name: '农业银行',
                baseRate: 0.042,
                feature: '速度快',
                initialRelation: 50,
                description: '审批效率高，适合急需资金的情况'
            },
            {
                id: GameTypes.BankType.BOC,
                name: '中国银行',
                baseRate: 0.039,
                feature: '利率最低额度紧',
                initialRelation: 40,
                description: '利率最低但额度紧张，需要良好关系'
            },
            {
                id: GameTypes.BankType.JOINT_STOCK,
                name: '股份制银行',
                baseRate: 0.045,
                feature: '灵活快速额度小',
                initialRelation: 50,
                description: '审批灵活但额度有限，适合灵活周转'
            }
        ];
    },
    
    // 获取股权融资轮次
    getFundingRounds: function() {
        return [
            {
                id: GameTypes.FundingRound.ANGEL,
                name: '天使轮',
                dilutionMin: 0.10,
                dilutionMax: 0.20,
                valuationMultiple: { min: 3, max: 5 },
                revenueThreshold: 0,
                description: '种子轮融资，适合初创企业'
            },
            {
                id: GameTypes.FundingRound.A,
                name: 'A轮',
                dilutionMin: 0.10,
                dilutionMax: 0.15,
                valuationMultiple: { min: 2, max: 3 },
                revenueThreshold: 50000000,
                description: '第一轮正式融资，需要一定营收基础'
            },
            {
                id: GameTypes.FundingRound.B,
                name: 'B轮',
                dilutionMin: 0.05,
                dilutionMax: 0.10,
                valuationMultiple: { min: 1.5, max: 2 },
                revenueThreshold: 200000000,
                description: '扩张期融资，需要较大营收规模'
            },
            {
                id: GameTypes.FundingRound.C,
                name: 'C轮',
                dilutionMin: 0.05,
                dilutionMax: 0.10,
                valuationMultiple: { min: 1.2, max: 1.5 },
                revenueThreshold: 1000000000,
                description: '成熟期融资，市场地位稳固'
            },
            {
                id: GameTypes.FundingRound.PRE_IPO,
                name: 'Pre-IPO',
                dilutionMin: 0.05,
                dilutionMax: 0.08,
                valuationMultiple: { min: 1, max: 1.2 },
                revenueThreshold: 5000000000,
                description: '上市前最后一轮融资'
            },
            {
                id: GameTypes.FundingRound.IPO,
                name: 'IPO',
                dilutionMin: 0.10,
                dilutionMax: 0.25,
                valuationMultiple: { min: 0, max: 0 },
                revenueThreshold: 10000000000,
                description: '首次公开募股，登录资本市场'
            }
        ];
    },
    
    // 获取存款产品
    getDepositProducts: function() {
        return [
            {
                id: 'demand',
                name: '活期存款',
                rate: 0.003,
                term: 0,
                description: '随时存取，灵活方便'
            },
            {
                id: 'agreement',
                name: '协定存款',
                rate: 0.012,
                term: 0,
                description: '大额存款协议，利率较高'
            },
            {
                id: '3month',
                name: '3个月定期',
                rate: 0.015,
                term: 3,
                description: '短期存款，收益稳定'
            },
            {
                id: '6month',
                name: '6个月定期',
                rate: 0.018,
                term: 6,
                description: '中期存款，收益较好'
            },
            {
                id: '1year',
                name: '1年期定期',
                rate: 0.021,
                term: 12,
                description: '长期存款，收益最高'
            }
        ];
    }
};
