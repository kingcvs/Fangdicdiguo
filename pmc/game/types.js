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
    }
};