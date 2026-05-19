// 游戏状态管理
const GameState = {
    // 游戏状态
    state: null,
    
    // 状态变更回调
    listeners: [],
    
    // 初始化游戏
    init: function() {
        // 初始化为空状态，菜单系统会处理存档加载
        this.state = InitialData.createInitialState();
    },
    
    // 获取当前状态
    get: function() {
        return this.state;
    },
    
    // 更新状态
    update: function(updater) {
        if (typeof updater === 'function') {
            updater(this.state);
        } else {
            Object.assign(this.state, updater);
        }
        this.notify();
        this.autoSave();
    },
    
    // 订阅状态变更
    subscribe: function(listener) {
        this.listeners.push(listener);
        return function() {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        }.bind(this);
    },
    
    // 通知所有监听器
    notify: function() {
        this.listeners.forEach(function(listener) {
            listener(this.state);
        }.bind(this));
    },
    
    // 自动保存
    autoSave: Utils.throttle(function() {
        if (window.MenuSystem) {
            MenuSystem.autoSave();
        }
    }, 5000),
    
    // 添加交易记录
    addTransaction: function(type, amount, description, category) {
        const transaction = {
            id: Utils.generateId('tx'),
            type: type,
            amount: amount,
            description: description,
            date: new Date(this.state.date),
            category: category
        };
        this.state.transactions.unshift(transaction);
        // 只保留最近100条记录
        if (this.state.transactions.length > 100) {
            this.state.transactions.pop();
        }
    },
    
    // 解锁成就
    unlockAchievement: function(achievementId) {
        const achievement = this.state.achievements.find(function(a) {
            return a.id === achievementId;
        });
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockDate = new Date(this.state.date);
            this.state.player.achievements.push(achievementId);
            this.notify();
            UI.showToast('🎉 解锁成就：' + achievement.name);
        }
    },
    
    // 检查成就
    checkAchievements: function() {
        const state = this.state;
        
        // 检查资产
        if (state.company.totalAssets >= 100000000) {
            this.unlockAchievement('ach_millionaire');
        }
        if (state.company.totalAssets >= 1000000000) {
            this.unlockAchievement('ach_billionaire');
        }
        
        // 检查品牌价值
        if (state.company.brandValue >= 100) {
            this.unlockAchievement('ach_brand_100');
        }
        
        // 检查项目数量
        const activeProjects = state.projects.filter(function(p) {
            return p.status !== GameTypes.ProjectStatus.COMPLETED;
        });
        if (activeProjects.length >= 5) {
            this.unlockAchievement('ach_5_projects');
        }
        
        // 检查员工数量
        const activeEmployees = state.employees.filter(function(e) {
            return e.status !== GameTypes.EmployeeStatus.FIRED;
        });
        if (activeEmployees.length >= 10) {
            this.unlockAchievement('ach_employee_10');
        }
    }
};