// UI组件
const UI = {
    // Toast容器
    toastContainer: null,
    
    // 初始化UI
    init: function() {
        this.createToastContainer();
    },
    
    // 创建Toast容器
    createToastContainer: function() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        document.body.appendChild(this.toastContainer);
    },
    
    // 显示Toast
    showToast: function(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        this.toastContainer.appendChild(toast);
        
        setTimeout(function() {
            toast.remove();
        }, 3000);
    },
    
    // 显示Modal
    showModal: function(content, options) {
        options = options || {};
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const title = document.createElement('h3');
        title.className = 'modal-title';
        title.textContent = options.title || '';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.textContent = '✕';
        closeBtn.onclick = function() {
            overlay.remove();
        };
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        const body = document.createElement('div');
        body.innerHTML = content;
        
        modal.appendChild(header);
        modal.appendChild(body);
        
        if (options.footer) {
            const footer = document.createElement('div');
            footer.style.marginTop = '20px';
            footer.innerHTML = options.footer;
            modal.appendChild(footer);
        }
        
        overlay.appendChild(modal);
        overlay.onclick = function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        };
        
        document.body.appendChild(overlay);
        return overlay;
    },
    
    // 财务卡片
    financeCard: function(label, value, positive) {
        const valueClass = positive === true ? 'positive' : (positive === false ? 'negative' : '');
        return '<div class="finance-card">' +
            '<div class="finance-label">' + label + '</div>' +
            '<div class="finance-value ' + valueClass + '">' + value + '</div>' +
        '</div>';
    },
    
    // 员工卡片
    employeeCard: function(emp) {
        const typeText = Utils.getEmployeeTypeText(emp.type);
        return '<div class="card employee-card" data-emp-id="' + emp.id + '">' +
            '<div class="employee-avatar">👤</div>' +
            '<div class="employee-info">' +
                '<div class="employee-name">' + emp.name + '</div>' +
                '<span class="employee-type">' + typeText + '</span>' +
                '<div class="employee-stats">' +
                    '<span class="stat-item">速度 <span class="stat-value">+' + emp.speed + '</span></span>' +
                    '<span class="stat-item">质量 <span class="stat-value">+' + emp.quality + '</span></span>' +
                    '<span class="stat-item">成本 <span class="stat-value">' + (emp.cost > 0 ? '+' : '') + emp.cost + '%</span></span>' +
                '</div>' +
            '</div>' +
        '</div>';
    },
    
    // 项目卡片
    projectCard: function(project) {
        const statusText = Utils.getProjectStatusText(project.status);
        return '<div class="card project-card" data-project-id="' + project.id + '">' +
            '<div class="card-header">' +
                '<div>' +
                    '<div class="card-title">' + project.name + '</div>' +
                    '<div class="card-subtitle">' + project.location + '</div>' +
                '</div>' +
                '<span class="project-status status-' + project.status + '">' + statusText + '</span>' +
            '</div>' +
            '<div class="progress-bar">' +
                '<div class="progress-fill" style="width: ' + project.progress + '%"></div>' +
            '</div>' +
            '<div style="margin-top:10px;font-size:13px;color:#94a3b8;display:flex;justify-content:space-between">' +
                '<span>进度: ' + project.progress + '%</span>' +
                '<span>投入: ' + Utils.formatMoney(project.landCost + (project.spentCost || 0)) + '</span>' +
            '</div>' +
        '</div>';
    },
    
    // 土地卡片
    landCard: function(land) {
        const zoningText = Utils.getZoningText(land.zoning);
        const isOwned = land.status === GameTypes.LandStatus.OWNED;
        return '<div class="card land-card" data-land-id="' + land.id + '">' +
            '<div class="card-header">' +
                '<div>' +
                    '<div class="card-title">' + land.name + '</div>' +
                    '<div class="card-subtitle">' + land.location + '</div>' +
                '</div>' +
                '<span style="padding:4px 10px;border-radius:15px;font-size:12px;background:' + 
                    (isOwned ? 'rgba(34,197,94,0.2)' : 'rgba(148,163,184,0.2)') + ';color:' + 
                    (isOwned ? '#22c55e' : '#94a3b8') + '">' + 
                    (isOwned ? '已持有' : zoningText) + '</span>' +
            '</div>' +
            '<div style="margin-top:10px;font-size:13px;color:#94a3b8;display:flex;justify-content:space-between;align-items:center">' +
                '<span>面积: ' + (land.size / 10000).toFixed(2) + '万㎡</span>' +
                '<span style="color:#f97316;font-weight:700;font-size:16px">' + Utils.formatMoney(land.price) + '</span>' +
            '</div>' +
            (land.description ? '<p style="margin-top:10px;font-size:13px;color:#64748b">' + land.description + '</p>' : '') +
        '</div>';
    },
    
    // 成就卡片
    achievementCard: function(achievement) {
        return '<div class="card achievement-card ' + (achievement.unlocked ? 'unlocked' : '') + '">' +
            '<div class="achievement-icon">' + (achievement.unlocked ? '🏆' : '🔒') + '</div>' +
            '<div class="achievement-info">' +
                '<div class="achievement-name">' + achievement.name + '</div>' +
                '<div class="achievement-desc">' + achievement.description + '</div>' +
            '</div>' +
        '</div>';
    },
    
    // 标签页
    tabs: function(tabs, activeIndex, options) {
        options = options || {};
        const className = options.twoRow ? 'tabs two-row' : 'tabs';
        return '<div class="' + className + '">' +
            tabs.map(function(tab, index) {
                return '<button class="tab ' + (index === activeIndex ? 'active' : '') + '" data-tab-index="' + index + '">' +
                    tab.label +
                '</button>';
            }).join('') +
        '</div>';
    }
};
