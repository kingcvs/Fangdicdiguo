// 应用主逻辑
const App = {
    // DOM元素
    elements: {},
    
    // 初始化
    init: function() {
        // 获取DOM元素
        this.elements.dateDisplay = document.getElementById('dateDisplay');
        this.elements.mainContent = document.getElementById('mainContent');
        this.elements.pauseBtn = document.getElementById('pauseBtn');
        this.elements.speed1x = document.getElementById('speed1x');
        this.elements.speed2x = document.getElementById('speed2x');
        this.elements.speed3x = document.getElementById('speed3x');
        this.elements.bottomNav = document.getElementById('bottomNav');
        
        // 绑定事件
        this.bindEvents();
        
        // 订阅状态变化
        GameState.subscribe(this.render.bind(this));
        
        // 初始渲染
        this.render();
    },
    
    // 绑定事件
    bindEvents: function() {
        const self = this;
        
        // 重新获取DOM元素（因为界面可能被重建了）
        this.elements.dateDisplay = document.getElementById('dateDisplay');
        this.elements.mainContent = document.getElementById('mainContent');
        this.elements.pauseBtn = document.getElementById('pauseBtn');
        this.elements.speed1x = document.getElementById('speed1x');
        this.elements.speed2x = document.getElementById('speed2x');
        this.elements.speed3x = document.getElementById('speed3x');
        this.elements.bottomNav = document.getElementById('bottomNav');
        
        // 时间控制
        this.elements.pauseBtn.onclick = function() {
            GameState.update(function(state) {
                state.isPaused = true;
            });
        };
        
        this.elements.speed1x.onclick = function() {
            GameState.update(function(state) {
                state.isPaused = false;
                state.speed = 1;
            });
        };
        
        this.elements.speed2x.onclick = function() {
            GameState.update(function(state) {
                state.isPaused = false;
                state.speed = 2;
            });
        };
        
        this.elements.speed3x.onclick = function() {
            GameState.update(function(state) {
                state.isPaused = false;
                state.speed = 3;
            });
        };
        
        // 底部导航
        this.elements.bottomNav.onclick = function(e) {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                const newPage = navItem.dataset.page;
                const oldPage = Pages.currentPage;
                
                // 如果从项目页面离开，重置项目页面状态为列表视图
                if (oldPage === 'project' && newPage !== 'project') {
                    Pages.tabStates.project = { list: true, activeProject: null, activeTab: 'preparation' };
                }
                
                Pages.currentPage = newPage;
                self.render();
            }
        };
        
        // 标签页切换（事件委托）
        this.elements.mainContent.onclick = function(e) {
            const tab = e.target.closest('.tab');
            if (tab) {
                const index = parseInt(tab.dataset.tabIndex);
                Pages.tabStates[Pages.currentPage] = index;
                self.render();
            }
        };
    },
    
    // 渲染应用
    render: function() {
        const state = GameState.get();
        
        // 更新日期显示
        this.elements.dateDisplay.textContent = Utils.formatDate(state.date);
        
        // 更新时间控制按钮状态
        this.updateTimeControls(state);
        
        // 更新导航状态
        this.updateNavigation();
        
        // 渲染页面内容
        this.renderPage();
    },
    
    // 更新时间控制按钮
    updateTimeControls: function(state) {
        this.elements.pauseBtn.classList.toggle('active', state.isPaused);
        this.elements.speed1x.classList.toggle('active', !state.isPaused && state.speed === 1);
        this.elements.speed2x.classList.toggle('active', !state.isPaused && state.speed === 2);
        this.elements.speed3x.classList.toggle('active', !state.isPaused && state.speed === 3);
    },
    
    // 更新导航
    updateNavigation: function() {
        const navItems = this.elements.bottomNav.querySelectorAll('.nav-item');
        navItems.forEach(function(item) {
            const page = item.dataset.page;
            item.classList.toggle('active', page === Pages.currentPage);
        });
    },
    
    // 渲染页面
    renderPage: function() {
        const page = Pages.currentPage;
        let content = '';
        
        switch(page) {
            case 'overview':
                content = Pages.overview();
                break;
            case 'investment':
                content = Pages.investment();
                break;
            case 'project':
                content = Pages.project();
                break;
            case 'marketing':
                content = Pages.marketing();
                break;
            case 'operation':
                content = Pages.operation();
                break;
            case 'capital':
                content = Pages.capital();
                break;
            case 'brand':
                content = Pages.brand();
                break;
            case 'personal':
                content = Pages.personal();
                break;
            case 'governance':
                content = Pages.governance();
                break;
            case 'settings':
                content = Pages.settings();
                break;
            default:
                content = Pages.overview();
        }
        
        this.elements.mainContent.innerHTML = content;
    }
};
