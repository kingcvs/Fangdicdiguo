// 游戏类型定义 - 虽然JS是动态类型，但定义类型有助于开发
const GameTypes = {
    // 证书类型
    CertificateTypes: {
        LAND: 'land',
        PLANNING: 'planning',
        CONSTRUCTION: 'construction',
        PRESALE: 'presale'
    },
    
    // 证书状态
    CertificateStatus: {
        PENDING: 'pending',
        PROCESSING: 'processing',
        COMPLETED: 'completed'
    },
    
    // 项目状态
    ProjectStatus: {
        PLANNING: 'planning',
        CERTIFICATION: 'certification',
        CONSTRUCTION: 'construction',
        PRESALE: 'presale',
        COMPLETED: 'completed'
    },
    
    // 员工类型
    EmployeeType: {
        MANAGER: 'manager',
        ENGINEER: 'engineer',
        SALES: 'sales',
        FINANCE: 'finance'
    },
    
    // 员工状态
    EmployeeStatus: {
        AVAILABLE: 'available',
        ASSIGNED: 'assigned',
        FIRED: 'fired'
    },
    
    // 土地状态
    LandStatus: {
        AVAILABLE: 'available',
        OWNED: 'owned',
        DEVELOPED: 'developed'
    },
    
    // 土地用途
    LandZoning: {
        RESIDENTIAL: 'residential',
        COMMERCIAL: 'commercial',
        INDUSTRIAL: 'industrial'
    },
    
    // 交易类型
    TransactionType: {
        INCOME: 'income',
        EXPENSE: 'expense',
        INVESTMENT: 'investment',
        LOAN: 'loan'
    },
    
    // 贷款类型
    LoanType: {
        BANK: 'bank',
        BOND: 'bond',
        TRUST: 'trust'
    },
    
    // 贷款状态
    LoanStatus: {
        ACTIVE: 'active',
        PAID: 'paid',
        DEFAULTED: 'defaulted'
    },
    
    // 股东类型
    ShareholderType: {
        FOUNDER: 'founder',
        COFOUNDER: 'cofounder',
        INVESTOR: 'investor',
        PUBLIC: 'public',
        EMPLOYEE: 'employee'
    },
    
    // 董事角色
    DirectorRole: {
        CHAIRMAN: 'chairman',
        CEO: 'ceo',
        CFO: 'cfo',
        CTO: 'cto',
        INDEPENDENT: 'independent'
    },
    
    // 成就分类
    AchievementCategory: {
        FINANCE: 'finance',
        PROJECT: 'project',
        BRAND: 'brand',
        PERSONAL: 'personal'
    },
    
    // 银行类型
    BankType: {
        ICBC: 'icbc',
        CCB: 'ccb',
        ABC: 'abc',
        BOC: 'boc',
        JOINT_STOCK: 'joint_stock'
    },
    
    // 信用等级
    CreditLevel: {
        AAA: 'AAA',
        AA: 'AA',
        A: 'A',
        BBB: 'BBB',
        BB: 'BB',
        B: 'B',
        C: 'C'
    },
    
    // 三线档位
    RedLineTier: {
        GREEN: 'green',
        YELLOW: 'yellow',
        ORANGE: 'orange',
        RED: 'red'
    },
    
    // 贷款产品类型
    LoanProductType: {
        WORKING: 'working',
        DEVELOPMENT: 'development',
        PROPERTY: 'property',
        'M&A': 'm&a'
    },
    
    // 融资轮次
    FundingRound: {
        ANGEL: 'angel',
        A: 'a',
        B: 'b',
        C: 'c',
        PRE_IPO: 'pre_ipo',
        IPO: 'ipo'
    },
    
    // 对赌类型
    BetType: {
        PERFORMANCE: 'performance',
        LISTING: 'listing',
        EQUITY_ADJUST: 'equity_adjust'
    },
    
    // 贷款流程阶段
    LoanStage: {
        QUOTA: 'quota',
        PRODUCT: 'product',
        NEGOTIATION: 'negotiation',
        TERMS: 'terms'
    },
    
    // 还款状态
    RepaymentStatus: {
        ON_TIME: 'on_time',
        INTEREST_ONLY: 'interest_only',
        EXTENSION: 'extension',
        OVERDUE: 'overdue'
    },
    
    // 项目详细状态
    ProjectStatus: {
        PREPARATION: 'preparation',
        PRE_CONSTRUCTION: 'pre_construction',
        CONSTRUCTION: 'construction',
        PRESALE: 'presale',
        DELIVERY: 'delivery',
        COMPLETED: 'completed'
    },
    
    // 产品定位
    ProductPositioning: {
        AFFORDABLE: 'affordable',
        IMPROVEMENT: 'improvement',
        LUXURY: 'luxury',
        COMMERCIAL: 'commercial',
        MIXED: 'mixed'
    },
    
    // 设计方案
    DesignScheme: {
        STANDARD: 'standard',
        CUSTOM: 'custom',
        MASTER: 'master'
    },
    
    // 报批报建阶段
    ApprovalStage: {
        LAND_PLANNING: 'land_planning',
        DESIGN_REVIEW: 'design_review',
        CONSTRUCTION_PLANNING: 'construction_planning',
        CONSTRUCTION_PERMIT: 'construction_permit'
    },
    
    // 总包类型
    ContractorType: {
        CENTRAL_ENTERPRISE: 'central_enterprise',
        LOCAL_LEADER: 'local_leader',
        GENERAL: 'general',
        LOW_COST: 'low_cost'
    },
    
    // 施工阶段
    ConstructionPhase: {
        FOUNDATION: 'foundation',
        STRUCTURE: 'structure',
        SECONDARY_STRUCTURE: 'secondary_structure',
        MECHANICAL_ELECTRICAL: 'mechanical_electrical',
        LANDSCAPE: 'landscape'
    },
    
    // 开盘方式
    LaunchMethod: {
        OFFLINE: 'offline',
        ONLINE: 'online',
        NORMAL: 'normal'
    },
    
    // 定价档位
    PricingTier: {
        LOW_VOLUME: 'low_volume',
        BELOW_AVERAGE: 'below_average',
        RECOMMENDED: 'recommended',
        ABOVE_AVERAGE: 'above_average',
        PREMIUM: 'premium'
    },
    
    // 验收策略
    InspectionStrategy: {
        THOROUGH: 'thorough',
        SPOT_CHECK: 'spot_check',
        FAST: 'fast'
    },
    
    // 交付满意度
    DeliverySatisfaction: {
        EXCELLENT: 'excellent',
        GOOD: 'good',
        AVERAGE: 'average',
        POOR: 'poor'
    },
    
    // 蓄客渠道
    CustomerChannel: {
        NATURAL: 'natural',
        ONLINE: 'online',
        CHANNEL: 'channel',
        REFERRAL: 'referral',
        CIRCLE: 'circle'
    },
    
    // 客户等级
    CustomerLevel: {
        A: 'A',
        B: 'B',
        C: 'C'
    },
    
    // 签约环节
    ContractStage: {
        SUBSCRIPTION: 'subscription',
        ONLINE_SIGN: 'online_sign',
        MORTGAGE_APPLICATION: 'mortgage_application',
        LOAN_DISBURSEMENT: 'loan_disbursement'
    }
};