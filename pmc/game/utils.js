// 工具函数
const Utils = {
    // 格式化货币
    formatMoney: function(amount) {
        if (amount >= 100000000) {
            return (amount / 100000000).toFixed(2) + '亿';
        } else if (amount >= 10000) {
            return (amount / 10000).toFixed(2) + '万';
        } else {
            return amount.toFixed(2) + '元';
        }
    },
    
    // 格式化面积
    formatArea: function(area) {
        if (area >= 10000) {
            return (area / 10000).toFixed(2) + '万㎡';
        } else {
            return area + '㎡';
        }
    },
    
    // 格式化日期
    formatDate: function(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return year + '年' + month + '月' + day + '日';
    },
    
    // 格式化月份
    formatMonth: function(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return year + '年' + month + '月';
    },
    
    // 生成唯一ID
    generateId: function(prefix) {
        return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    
    // 计算月还款额（等额本息）
    calculateMonthlyPayment: function(principal, annualRate, termMonths) {
        const monthlyRate = annualRate / 12;
        if (monthlyRate === 0) {
            return principal / termMonths;
        }
        const compoundFactor = Math.pow(1 + monthlyRate, termMonths);
        return (principal * monthlyRate * compoundFactor) / (compoundFactor - 1);
    },
    
    // 计算贷款总利息
    calculateTotalInterest: function(principal, annualRate, termMonths) {
        const monthlyPayment = this.calculateMonthlyPayment(principal, annualRate, termMonths);
        return monthlyPayment * termMonths - principal;
    },
    
    // 限制数值范围
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    // 随机数生成
    random: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    // 随机整数
    randomInt: function(min, max) {
        return Math.floor(this.random(min, max + 1));
    },
    
    // 随机选择数组元素
    randomChoice: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // 深拷贝对象
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    
    // 数组分组
    groupBy: function(array, key) {
        return array.reduce(function(result, item) {
            (result[item[key]] = result[item[key]] || []).push(item);
            return result;
        }, {});
    },
    
    // 睡眠函数
    sleep: function(ms) {
        return new Promise(function(resolve) {
            setTimeout(resolve, ms);
        });
    },
    
    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    },
    
    // 员工类型文本
    getEmployeeTypeText: function(type) {
        const typeMap = {
            [GameTypes.EmployeeType.MANAGER]: '经理',
            [GameTypes.EmployeeType.ENGINEER]: '工程师',
            [GameTypes.EmployeeType.SALES]: '销售',
            [GameTypes.EmployeeType.FINANCE]: '财务'
        };
        return typeMap[type] || type;
    },
    
    // 项目状态文本
    getProjectStatusText: function(status) {
        const statusMap = {
            [GameTypes.ProjectStatus.PLANNING]: '规划中',
            [GameTypes.ProjectStatus.CERTIFICATION]: '办证中',
            [GameTypes.ProjectStatus.CONSTRUCTION]: '建设中',
            [GameTypes.ProjectStatus.PRESALE]: '预售中',
            [GameTypes.ProjectStatus.COMPLETED]: '已完成'
        };
        return statusMap[status] || status;
    },
    
    // 证书类型文本
    getCertificateTypeText: function(type) {
        const typeMap = {
            [GameTypes.CertificateTypes.LAND]: '土地证',
            [GameTypes.CertificateTypes.PLANNING]: '规划证',
            [GameTypes.CertificateTypes.CONSTRUCTION]: '施工证',
            [GameTypes.CertificateTypes.PRESALE]: '预售证'
        };
        return typeMap[type] || type;
    },
    
    // 土地用途文本
    getZoningText: function(zoning) {
        const zoningMap = {
            [GameTypes.LandZoning.RESIDENTIAL]: '住宅',
            [GameTypes.LandZoning.COMMERCIAL]: '商业',
            [GameTypes.LandZoning.INDUSTRIAL]: '工业'
        };
        return zoningMap[zoning] || zoning;
    },
    
    // 计算总资产
    calculateTotalAssets: function(gameState) {
        let total = gameState.company.cash;
        
        // 加上土地价值
        gameState.land.forEach(function(land) {
            if (land.status === GameTypes.LandStatus.OWNED) {
                total += land.price;
            }
        });
        
        // 加上在建项目价值
        gameState.projects.forEach(function(project) {
            if (project.status !== GameTypes.ProjectStatus.COMPLETED) {
                total += project.landCost + (project.constructionCost * project.progress / 100);
            }
        });
        
        return total;
    },
    
    // 计算总负债
    calculateTotalLiabilities: function(gameState) {
        let total = 0;
        gameState.loans.forEach(function(loan) {
            if (loan.status === GameTypes.LoanStatus.ACTIVE) {
                total += loan.remainingBalance;
            }
        });
        return total;
    }
};